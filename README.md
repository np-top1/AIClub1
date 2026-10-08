# The Pardo Family Archive

A responsive family-history site for the Pardo, Bibi, Safdieh, Massry, and connected family lines. It includes a generational tree, searchable relatives and surnames, historical stories, and a timeline. The interactive photo gallery starts with one curated portrait per relative; visitors can search names, browse the complete photo collection, and move between images in an accessible viewer.

## Run locally

For local development, start the privacy-filtering server from this folder:

```sh
python3 server.py
```

Open `http://localhost:4173`. The local server reads `export-Ancestors.ged 3` and serves its sanitized family data at `/api/family-data`; raw GEDCOM paths are blocked. Browser GEDCOM import is local to that browser session and does not upload the file.

## Deploy with GitHub Pages

The `Deploy family archive to GitHub Pages` workflow builds the static site on pushes to `main` and on manual runs. It reads the GEDCOM from the repository checkout, writes sanitized data to `_site/data/family-data.json`, and deploys only `_site`—the GEDCOM itself is not copied into the Pages artifact.

The public export keeps the full family tree and its relationships. Living relatives through generation 3 (Arlette Kraiem's generation) are shown by initials and surname, except Nathan Albert Pardo, whose full name is shown. People in generations beyond 3 are shown by full name. Anyone whose recorded birth date establishes that they are older than 85 is shown with their full name, recorded birth date, and birthplace regardless of generation. Other living relatives' birth details are withheld, and photos of living people are always removed. The deployed JavaScript omits local preview records, displays the inter-branch relationship paths using the public names, and stops the public timeline before recent household events. Review the generated site data and artifact before publishing.

To enable deployment:

1. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
2. Push the workflow and site changes to `main`, or run the workflow from **Actions → Deploy family archive to GitHub Pages → Run workflow**.
3. Open the deployment URL shown in the completed workflow or in **Settings → Pages**.

GitHub Pages is publicly accessible unless the repository’s GitHub plan and Pages settings support access restrictions. A private source repository does not by itself make the published site private. Treat all deployed names, relationships, photos, and historical details as public.