"""Export the landing page as one offline HTML using the shipped local assets."""
from pathlib import Path
import base64
import mimetypes
import re

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'

def asset(path):
    if path.suffix == '.png' and path.with_suffix('.webp').exists():
        path = path.with_suffix('.webp')
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return 'data:' + mime + ';base64,' + base64.b64encode(path.read_bytes()).decode()

def stylesheet(path):
    def url(match):
        value = match.group(1).strip('\"\'')
        if value.startswith(('data:', 'https:', 'http:', '#')):
            return match.group(0)
        return 'url("' + asset(path.parent / value) + '")'
    return re.sub(r'url\(([^)]+)\)', url, path.read_text())

html = (DIST / 'index.html').read_text()
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">',
              lambda m: '<style>' + stylesheet(DIST / m.group(1)) + '</style>', html)

def script(match):
    code = (DIST / match.group(1)).read_text()
    return '<script>document.addEventListener("DOMContentLoaded",()=>{\n' + code + '\n});</script>'

html = re.sub(r'<script src="([^"]+)" defer></script>', script, html)
html = re.sub(r'assets/[A-Za-z0-9_./-]+\.(?:png|webp|svg)',
              lambda m: asset(DIST / m.group(0)), html)
(DIST / 'standalone.html').write_text(html)
print('Created dist/standalone.html:', len(html.encode()), 'bytes')
