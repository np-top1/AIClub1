# Copilot Instructions for The Pardo Family Archive

## Project shape

This repository is a small static web app backed by a lightweight Python HTTP server.

- `index.html` defines the single-page UI shell and sections for the overview, tree, surname index, stories, and timeline.
- `styles.css` contains the full visual design and layout rules.
- `app.js` is the app logic: it renders the family tree, surname directory, search results, imported GEDCOM parsing, and timeline state.
- `server.py` serves the static site from the repo root and exposes the sanitized data API at `/api/family-data`.
- `export-Ancestors.ged 3` is the source GEDCOM used by the server and the browser import flow.

The app is intentionally framework-free: no bundler, package manager, or build step is required for normal development.

## Run locally

```bash
python3 server.py
```

Then open:

- `http://localhost:4173`
- `http://localhost:4173/api/family-data`

The server reads the local GEDCOM file and returns only sanitized family data; raw GEDCOM content is blocked from HTTP requests. The browser can also import a GEDCOM file locally without uploading it anywhere.

## Build, test, and lint commands

There is no formal build, lint, or test runner in this repository.

- No `package.json`, `pytest`, `make`, or CI script exists for automated checks.
- There is no single “test” command to run; validation is done by starting the app and verifying the page or API response.
- For a minimal smoke check, use:

```bash
python3 server.py
curl -sS http://localhost:4173/api/family-data | head
```

If you change the frontend behavior, reload the page in a browser and confirm the affected section still renders correctly.

## Key implementation conventions

- Preserve the privacy-first behavior: do not expose raw GEDCOM records over HTTP.
- Keep `server.py` responsible for sanitizing archive data before the browser receives it.
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
