# Project instructions

- Preserve the Ukrainian event copy, Halloween art direction, responsive layouts and accessible motion toggle.
- Registration links lead to https://t.me/HalloweenHackathon7Bot.
- Keep the exact organizer-provided Google Maps location in the footer.
- Do not add new sponsors or partners, their logos, or their links to the project until the user explicitly approves them. Keep candidate research outside this repository.
- `dist/assets/partners-data.js` is the only editable participant list. Never hand-edit the fallback list. After editing the site, run `python scripts/export-standalone.py`; it syncs the fallback and self-contained page. GitHub Actions runs the same export after relevant pushes to main.
- This is a buildless static site. Publish the contents of `dist/` to static hosting; the entire asset directory is required for `index.html`.
