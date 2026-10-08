# The Pardo Family Archive

A responsive family-history site for the Pardo, Bibi, Safdieh, Massry, and connected family lines. It includes a generational tree, searchable relatives and surnames, historical stories, and a timeline. The interactive photo gallery starts with one curated portrait per relative; visitors can search names, browse the complete photo collection, and move between images in an accessible viewer.

## Run locally

Start the privacy-filtering development server from this folder:

```sh
python3 server.py
```

Open `http://localhost:4173`. The server reads `export-Ancestors.ged 3` locally and returns only names, relationships, surnames, and limited life details. Birth years and locations are omitted for people without a recorded death; contact information, addresses, and private notes are never sent to the page. The raw GEDCOM is blocked from HTTP requests. The page also works as a curated preview when opened without the server, and its GEDCOM import reads files locally in the browser.