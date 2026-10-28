"""Export the landing page as one offline HTML using the shipped local assets."""
from pathlib import Path
import base64
import html as html_module
import json
import mimetypes
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'

def update_partners():
    """Keep the no-JavaScript markup in sync with the one editable JS list."""
    result = subprocess.run([
        'node', '-e', '''
const fs = require('node:fs'), vm = require('node:vm');
const context = vm.createContext({window: {}});
vm.runInContext(fs.readFileSync(process.argv[1], 'utf8'), context, {timeout: 1000});
if (!Array.isArray(context.window.HALLOWEEN_PARTNERS)) throw Error('Expected a partner array');
console.log(JSON.stringify(context.window.HALLOWEEN_PARTNERS));
''', str(DIST / 'assets/partners-data.js')
    ], check=True, capture_output=True, text=True)
    partners = json.loads(result.stdout)
    entries = []
    esc = html_module.escape
    for partner in partners:
        name = partner['name']
        if not isinstance(name, str) or not name.strip():
            raise ValueError('Every partner needs a name')
        href = partner.get('href', '')
        if href and not href.startswith(('https://', 'http://', '#')):
            raise ValueError('Partner links must be HTTP(S) URLs or page anchors')
        logo = partner.get('logo')
        surface = ' partner-logo-surface' if partner.get('logoSurface') == 'light' else ''
        if logo:
            path = (DIST / logo).resolve()
            if not path.is_relative_to(DIST.resolve()) or not path.is_file():
                raise ValueError(f'Missing local partner logo: {logo}')
            logo_class = esc(partner.get('logoClass', ''), quote=True)
            artwork = f'<img class="{logo_class}" src="{esc(logo, quote=True)}" alt="" loading="lazy" decoding="async" draggable="false">'
        elif partner.get('emblem') == 'event':
            artwork = '<svg class="event-emblem" viewBox="0 0 60 60" aria-hidden="true"><use href="#pumpkin-mark"/></svg>'
        else:
            artwork = '<span class="partner-wordmark" aria-hidden="true">' + esc(partner.get('wordmark') or name) + '</span>'
        name_class = 'partner-name'
        if partner.get('kind') == 'department':
            name_class += ' department'
        if partner.get('hideName') or (not logo and partner.get('wordmark', '').lower() == name.lower()):
            name_class += ' sr-only'
        tag = 'a' if href else 'div'
        link = f' href="{esc(href, quote=True)}"' if href else ''
        if href and not href.startswith('#'):
            link += ' target="_blank" rel="noopener noreferrer"'
        entries.append(f'<li class="partner-entry"><{tag} class="partner-card"{link}><span class="partner-logo{surface}">{artwork}</span><span class="{name_class}">{esc(name)}</span></{tag}></li>')
    path = DIST / 'index.html'
    page = path.read_text()
    page, count = re.subn(r'(<ul class="partners-list"[^>]*>).*?(</ul>)',
                         lambda m: m[1] + ''.join(entries) + m[2], page, flags=re.S)
    if count != 1:
        raise ValueError('Expected exactly one partner fallback list')
    path.write_text(page)

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

update_partners()
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
