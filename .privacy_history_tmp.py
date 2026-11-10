import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlsplit


sys.path.insert(0, "/workspaces/AIClub1")
import server


ROOT = Path.cwd()
SOURCE = Path("/workspaces/AIClub1/.github/export-Ancestors 10:20.ged")
GEDCOM = ROOT / "export-Ancestors.ged 3"
FEATURED = ROOT / "featured-photos.json"
BLOCKED_PHOTO_PATHS = {
    line.strip()
    for line in Path("/tmp/pardo-living-photo-path-hashes.txt").read_text().splitlines()
    if line.strip()
}
server.FEATURED_PHOTOS = Path("/tmp/no-featured-photo-config.json")


def blocked_photo(url):
    path = urlsplit(url).path.casefold()
    digest = hashlib.sha256(path.encode()).hexdigest()
    return digest in BLOCKED_PHOTO_PATHS


def archive_from_text(text):
    archive = server.records_from_gedcom(text)
    archive["photos"] = [
        photo for photo in archive["photos"] if not blocked_photo(photo["url"])
    ]
    return archive, server.public_archive_data(archive)


def public_gedcom(archive, public):
    public_people = {person["id"]: person for person in public["people"]}
    children = {}
    photos = {}
    for family in archive["families"]:
        for child_id in family["children"]:
            children.setdefault(child_id, []).append(family["id"])
    for photo in archive["photos"]:
        photos.setdefault(photo["personId"], []).append(photo["url"])

    lines = [
        "0 HEAD",
        "1 SOUR Pardo Family Archive",
        "1 GEDC",
        "2 VERS 5.5.1",
        "2 FORM LINEAGE-LINKED",
        "1 CHAR UTF-8",
    ]
    for person in archive["people"]:
        public_person = public_people[person["id"]]
        lines.extend([f"0 {person['id']} INDI", f"1 NAME {public_person['name']}"])
        lines.extend(f"2 SURN {surname}" for surname in person["surnames"] if surname)
        lines.extend(f"1 FAMC {family_id}" for family_id in children.get(person["id"], []))
        if person["death"] or server.is_over_85(person.get("birth_date", "")):
            if person.get("birth_date"):
                lines.extend(["1 BIRT", f"2 DATE {person['birth_date']}"])
                if person.get("birth_place"):
                    lines.append(f"2 PLAC {person['birth_place']}")
        if public_person["death"]:
            lines.extend(["1 DEAT", f"2 DATE {public_person['death']}"])
        lines.extend(f"1 OCCU {role}" for role in person["roles"])
        lines.extend(f"1 OBJE\n2 FILE {url}" for url in photos.get(person["id"], []))
    for family in archive["families"]:
        lines.append(f"0 {family['id']} FAM")
        if family["husband"]:
            lines.append(f"1 HUSB {family['husband']}")
        if family["wife"]:
            lines.append(f"1 WIFE {family['wife']}")
        lines.extend(f"1 CHIL {child}" for child in family["children"])
    lines.append("0 TRLR")
    return "\n".join(lines) + "\n"


def update_featured(archive):
    if not FEATURED.is_file():
        return
    config = json.loads(FEATURED.read_text(encoding="utf-8"))
    if (
        not isinstance(config, dict)
        or config.get("version") != 1
        or not isinstance(config.get("featuredPhotos"), dict)
    ):
        raise ValueError(f"Unexpected featured-photo settings format: {FEATURED}")
    by_person = {}
    for photo in archive["photos"]:
        by_person.setdefault(photo["personId"], []).append(photo["url"])
    selected = {}
    for person_id, old_url in config["featuredPhotos"].items():
        candidates = by_person.get(person_id, [])
        replacement = next(
            (url for url in candidates if urlsplit(url).path == urlsplit(old_url).path),
            candidates[0] if candidates else None,
        )
        if replacement:
            selected[person_id] = replacement
    FEATURED.write_text(
        json.dumps({"version": 1, "featuredPhotos": selected}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def sensitive_values(text):
    archive = server.records_from_gedcom(text)
    generations = server.ancestor_generations(archive["people"])
    people = {person["id"]: person for person in archive["people"]}
    names = {}
    tokens = set()
    for record in re.split(r"(?m)^0 ", text.lstrip("\ufeff"))[1:]:
        lines = record.splitlines()
        if not lines:
            continue
        header = re.match(r"(@[^@]+@)\s+INDI\b", lines[0])
        if not header or header[1] not in people:
            continue
        person = people[header[1]]
        living = not person.get("death")
        restricted_name = (
            living
            and generations.get(person["id"], 99) <= 3
            and person["name"] != "Nathan Albert Pardo"
            and not server.is_over_85(person.get("birth_date", ""))
        )
        if not living:
            continue
        event = ""
        in_photo = False
        private_subtree = False
        given = []
        surnames = [person.get("surname", "")]
        raw_names = []
        for line in lines[1:]:
            if match := re.match(r"^1 NAME (.+)", line):
                raw_names.append(match[1].replace("/", "").strip())
                private_subtree = False
            elif match := re.match(r"^2 GIVN (.+)", line):
                given.append(match[1].strip())
                if restricted_name:
                    tokens.add(match[1].strip())
            elif match := re.match(r"^2 SURN (.+)", line):
                surnames.append(match[1].strip())
            elif match := re.match(r"^1 (BIRT|DEAT)\b", line):
                event = match[1]
                in_photo = False
                private_subtree = False
            elif match := re.match(r"^2 DATE (.+)", line):
                if event == "BIRT" and not server.is_over_85(person.get("birth_date", "")):
                    tokens.add(match[1].strip())
            elif match := re.match(r"^2 PLAC (.+)", line):
                if event == "BIRT" and not server.is_over_85(person.get("birth_date", "")):
                    tokens.add(match[1].strip())
            elif match := re.match(r"^1 OBJE\b", line):
                event = ""
                in_photo = True
                private_subtree = False
            elif match := re.match(r"^2 FILE (https://\S+|assets/[A-Za-z0-9._-]+)", line):
                if in_photo:
                    tokens.add(match[1])
            elif match := re.match(r"^1 (NOTE|ADDR|PHON|EMAIL|WWW|RESI)\b(?: (.*))?", line):
                private_subtree = True
                if match[2]:
                    tokens.add(match[2].strip())
                event = ""
                in_photo = False
            elif match := re.match(r"^(\d+) (.+)", line):
                if private_subtree and int(match[1]) > 1:
                    tokens.add(match[2].strip())
                if int(match[1]) == 1:
                    private_subtree = False
                    event = ""
                    in_photo = False
        if restricted_name:
            for raw_name in raw_names:
                if raw_name:
                    names[raw_name] = server.initials_name(raw_name, person.get("surname", ""))
            for given_name in given:
                for surname in surnames:
                    if surname:
                        full_name = f"{given_name} {surname}".strip()
                        names[full_name] = server.initials_name(full_name, surname)
            if person["name"]:
                names[person["name"]] = server.initials_name(
                    person["name"], person.get("surname", "")
                )
    return names, {token for token in tokens if token and len(token) >= 6}


def redact_worktree():
    sources = []
    for path in (GEDCOM, SOURCE):
        if path.is_file():
            sources.append(path.read_text(encoding="utf-8-sig", errors="replace"))
    replacements = {}
    tokens = set()
    for text in sources:
        names, private_tokens = sensitive_values(text)
        replacements.update(names)
        tokens.update(private_tokens)

    if GEDCOM.is_file():
        original = GEDCOM.read_text(encoding="utf-8-sig", errors="replace")
        archive, public = archive_from_text(original)
        GEDCOM.write_text(public_gedcom(archive, public), encoding="utf-8")
        update_featured(archive)

    app = ROOT / "app.js"
    if app.is_file():
        source = app.read_text(encoding="utf-8", errors="replace")
        source = re.sub(
            r"const initialPeople\s*=\s*\[[\s\S]*?\];(?=\s*\n\s*const surnameRecords)",
            "const initialPeople = [];",
            source,
            count=1,
        )
        app.write_text(apply_name_redactions(source, replacements), encoding="utf-8")

    settings = ROOT / ".vscode" / "settings.json"
    if settings.is_file():
        data = json.loads(settings.read_text(encoding="utf-8"))
        approvals = data.get("chat.tools.terminal.autoApprove")
        if isinstance(approvals, dict):
            for key, value in list(approvals.items()):
                encoded = f"{key} {json.dumps(value, ensure_ascii=False)}".casefold()
                if any(token.casefold() in encoded for token in replacements):
                    approvals.pop(key)
                    continue
                if any(token.casefold() in encoded for token in tokens):
                    approvals.pop(key)
        settings.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    extensions = {".js", ".py", ".html", ".md", ".json", ".css", ".yml", ".yaml", ".txt"}
    tracked = subprocess.check_output(["git", "ls-files", "-z"]).decode().split("\0")
    for tracked_path in filter(None, tracked):
        file_path = ROOT / tracked_path
        if file_path in {GEDCOM, app, settings} or file_path.suffix.lower() not in extensions:
            continue
        try:
            source = file_path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        cleaned = apply_name_redactions(source, replacements)
        if cleaned != source:
            file_path.write_text(cleaned, encoding="utf-8")


def apply_name_redactions(text, replacements):
    for name, initials in sorted(replacements.items(), key=lambda item: len(item[0]), reverse=True):
        text = re.sub(re.escape(name), lambda _: initials, text, flags=re.I)
    return text


if __name__ == "__main__":
    redact_worktree()
