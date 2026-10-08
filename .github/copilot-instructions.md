# Copilot Instructions for The Pardo Family Archive

## Project shape

This repository is a small static web app backed locally by a lightweight Python HTTP server and deployed through GitHub Pages.

- `index.html` defines the single-page UI shell and sections for the overview, tree, surname index, stories, and timeline.
- `styles.css` contains the full visual design and layout rules.
- `app.js` is the app logic: it renders the family tree, surname directory, search results, imported GEDCOM parsing, and timeline state.
- `server.py` serves the static site from the repo root and exposes the sanitized data API at `/api/family-data`.
- `export-Ancestors.ged 3` is the source GEDCOM used by the server and the browser import flow.
- `build_static.py` creates the Pages artifact with a conservative public-data filter; `.github/workflows/pages.yml` builds and deploys that artifact.

The app is intentionally framework-free: no bundler, package manager, or build step is required for normal development.

## Run locally

```bash
python3 server.py
```

Then open:

- `http://localhost:4173`
- `http://localhost:4173/api/family-data`

The local server reads the GEDCOM and returns sanitized family data; raw GEDCOM content is blocked from HTTP requests. The GitHub Pages workflow reads the private repository's GEDCOM only during its build and deploys static files plus generated data that retains every person and relationship. Living people through generation 3 are shown by initials except Nathan Albert Pardo; generations after 3 are named publicly. People whose recorded birth date establishes they are older than 85 are shown with full name, birth date, and birthplace. Never include living people's photos in the public export. It does not copy the raw GEDCOM into the Pages artifact. The browser can also import a GEDCOM file locally without uploading it anywhere.

## Build, test, and lint commands

There is no package manager or formal test runner in this repository. The Pages artifact can be checked locally with:

```sh
python3 build_static.py --output /tmp/pardo-pages-preview
```

For local app development:

```sh
python3 server.py
```

If you change the frontend behavior, verify the static build output and reload the page in a browser.

## Key implementation conventions

- Preserve the privacy-first behavior: do not expose raw GEDCOM records over HTTP.
- Keep `server.py` responsible for sanitizing archive data before the browser receives it.
- Keep the Pages artifact limited to `index.html`, `app.js`, `styles.css`, and generated sanitized data; never copy the raw GEDCOM into it.
- Keep every person and relationship in the public export. Abbreviate living names through generation 3 except Nathan Albert Pardo; generation 4 and later are named publicly. Disclose full name, birth date, and birthplace for people older than 85. Never export living people's photos.
- Keep the app static and client-rendered: use existing `renderAll()`, `renderTree()`, `renderSurnames()`, and `renderPeople()` patterns rather than introducing a framework or build pipeline.
- When working with GEDCOM data, normalize names and family relationships in the same shape used by `app.js` (`people`, `families`, `surnames`, `familyLinks`).
- Route guard behavior is important: `.ged` and `.git` paths should remain blocked in `server.py`.
- If you add new data or UI sections, prefer preserving the repo-root static structure and relative asset references.

## Editing guidance

- Prefer surgical changes in `app.js` and `server.py` over rewriting the app structure.
- The page is a single DOM-driven experience; update existing render functions instead of introducing separate app state management.
- Keep any new endpoints or data transformations aligned with the current `/api/family-data` contract.
- Do not add unrelated package tooling or frameworks unless the project explicitly grows into a larger application.

## Repository-specific expectations

- `README.md` is the authoritative run guide and product overview.
- The repo is intentionally lightweight and human-maintained; most work is plain HTML/CSS/JavaScript with a Python server.
- Validation should stay practical: start the server, open the page, and verify the dataset loads without exposing sensitive raw data.
