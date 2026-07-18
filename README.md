# LingoGo

**Travel smarter. Speak local.**

Offline-first travel language companion for South Korea and Japan.

## Release Snapshot

- Current release: v1.0.0
- Public app URL: https://jjloicfr22.github.io/lingogo/
- Supported destinations: Japan, South Korea
- Interface languages: English, French, Spanish
- Offline capability: Yes (PWA service worker)
- Field-test template: [docs/field-test.md](docs/field-test.md)
- v1.1 backlog: [docs/v1-1-backlog.md](docs/v1-1-backlog.md)

## Run locally

Because the app loads JSON modules and uses a service worker, serve it through a local web server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

Push the project files to a repository and enable GitHub Pages from the main branch/root directory.

## Included in this build

- Destination picker
- Korean and Japanese travel packs
- English-first active-recall flashcards
- Automatic pronunciation after reveal
- XP and saved phrases
- Show to Local mode
- Situation Mode
- Offline PWA service worker
- Mobile-first responsive interface
