import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path

from server import GEDCOM, public_archive_data, records_from_gedcom


ROOT = Path(__file__).resolve().parent
STATIC_FILES = ("index.html", "styles.css")


def replace_region(source, start_marker, end_marker, replacement):
    start = source.find(start_marker)
    end = source.find(end_marker, start + len(start_marker))
    if start < 0 or end < 0:
        raise ValueError(f"Could not safely sanitize app.js between {start_marker!r} and {end_marker!r}.")
    return source[:start] + replacement + source[end:]


def public_app_source(archive):
    source = (ROOT / "app.js").read_text(encoding="utf-8")
    source = replace_region(
        source,
        "const initialPeople = [",
        "\n\nconst surnameRecords = [",
        "const initialPeople = [];",
    )
    source = replace_region(
        source,
        "const surnameRecords = [",
        "\n\nconst timelineItems = [",
        "const surnameRecords = [];",
    )
    start_marker = "const timelineItems = ["
    end_marker = "\n];\n\nconst citationSources = ["
    start = source.find(start_marker)
    end = source.find(end_marker, start + len(start_marker))
    if start < 0 or end < 0:
        raise ValueError("Could not safely identify timeline data in app.js.")
    timeline = source[start:end]
    timeline = "\n".join(
        line
        for line in timeline.splitlines()
        if not (match := re.match(r'\s*\{ year: "(\d{4})"', line))
        or int(match.group(1)) < 1956
    )
    source = source[:start] + timeline + source[end:]
    public_names = {person["id"]: person["name"] for person in public_archive_data(archive)["people"]}
    for person in archive["people"]:
        display_name = public_names[person["id"]]
        if display_name == person["name"]:
            continue
        source = re.sub(
            rf"(?<![\w]){re.escape(person['name'])}(?![\w])",
            lambda _: display_name,
            source,
        )
    embedded_data = json.dumps(
        public_archive_data(archive),
        ensure_ascii=False,
        separators=(",", ":"),
    )
    return f"const embeddedArchiveData = {embedded_data};\n\n{source}"


def build_site(output_dir):
    if not GEDCOM.is_file():
        raise FileNotFoundError(f"GEDCOM source not found: {GEDCOM}")

    output_dir = output_dir.resolve()
    if output_dir == ROOT:
        raise ValueError("Build output must not be the repository root.")
    if output_dir.exists() and any(output_dir.iterdir()):
        raise FileExistsError(f"Build output directory must be empty: {output_dir}")

    archive = records_from_gedcom(GEDCOM.read_text(encoding="utf-8", errors="replace"))
    public_data = public_archive_data(archive)

    output_dir.mkdir(parents=True, exist_ok=True)
    app_source = public_app_source(archive)
    app_filename = f"app-{hashlib.sha256(app_source.encode('utf-8')).hexdigest()[:12]}.js"
    for filename in STATIC_FILES:
        if filename == "index.html":
            html = (ROOT / filename).read_text(encoding="utf-8")
            if html.count('src="app.js"') != 1:
                raise ValueError("Could not safely identify the app.js script reference in index.html.")
            html = html.replace('src="app.js"', f'src="{app_filename}"')
            (output_dir / filename).write_text(html, encoding="utf-8")
            (output_dir / "family-archive.html").write_text(html, encoding="utf-8")
        else:
            shutil.copy2(ROOT / filename, output_dir / filename)
    (output_dir / app_filename).write_text(app_source, encoding="utf-8")
    (output_dir / ".nojekyll").touch()
    assets_dir = ROOT / "assets"
    if assets_dir.is_dir():
        shutil.copytree(assets_dir, output_dir / "assets")

    (output_dir / "family-data.json").write_text(
        json.dumps(public_data, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    return public_data


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build the public, sanitized GitHub Pages site.")
    parser.add_argument("--output", type=Path, required=True, help="An empty output directory for the Pages artifact.")
    arguments = parser.parse_args()
    result = build_site(arguments.output)
    print(
        f"Built static site with {len(result['people'])} relatives, "
        f"{len(result['surnames'])} surnames, and {len(result['photos'])} photos."
    )
