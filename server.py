import json
import re
from datetime import date, datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parent
GEDCOM = ROOT / "export-Ancestors.ged 3"
PORT = 4173
PUBLIC_HISTORICAL_ROLE = re.compile(
    r"rabbi|hakham|hacham|gaon|dayan|rishon|author|scholar|mukhtar|mayor|engraver|master craftsman",
    re.IGNORECASE,
)


def year_from_date(value):
    match = re.search(r"\d{3,4}", value)
    return match[0] if match else ""


def is_over_85(birth_date, today=None):
    today = today or date.today()
    value = birth_date.strip().upper()
    exact_date = re.fullmatch(r"(\d{1,2})\s+([A-Z]{3})\s+(\d{4})", value)
    if exact_date:
        try:
            born = datetime.strptime(value, "%d %b %Y").date()
        except ValueError:
            return False
        age = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
        return age > 85

    year_match = re.fullmatch(r"(?:(ABT|EST|CAL|BEF|AFT)\s+)?(\d{3,4})", value)
    if not year_match:
        return False
    qualifier, year_text = year_match.groups()
    year = int(year_text)
    earliest_possible_cutoff_year = today.year - 86
    return year < earliest_possible_cutoff_year or (
        year == earliest_possible_cutoff_year and qualifier == "BEF"
    )


def initials_name(name, surname):
    if surname and name.casefold().endswith(surname.casefold()):
        given_names = name[: -len(surname)].split()
        family_name = surname
    else:
        parts = name.split()
        if len(parts) == 1:
            return f"{parts[0][0].upper()}." if parts[0] else ""
        given_names, family_name = parts[:-1], parts[-1] if parts else ""
    if not given_names:
        parts = name.split()
        return f"{parts[0][0].upper()}." if len(parts) == 1 else ""
    initials = " ".join(f"{part[0].upper()}." for part in given_names if part)
    return " ".join(part for part in (initials, family_name) if part)


def ancestor_generations(people, root_name="Nathan Albert Pardo"):
    people_by_id = {person["id"]: person for person in people}
    root = next((person for person in people if person["name"] == root_name), None)
    if not root:
        return {}

    generations = {root["id"]: 0}
    pending = [root["id"]]
    while pending:
        person_id = pending.pop(0)
        for parent_id in people_by_id[person_id]["parents"]:
            if parent_id not in generations and parent_id in people_by_id:
                generations[parent_id] = generations[person_id] + 1
                pending.append(parent_id)
    return generations


def records_from_gedcom(text):
    people = []
    families = []

    for record in re.split(r"(?m)^0 ", text)[1:]:
        lines = record.splitlines()
        header = re.match(r"(@[^@]+@)\s+(INDI|FAM)\b", lines[0])
        if not header:
            continue

        record_id, kind = header.groups()
        if kind == "FAM":
            family = {"id": record_id, "husband": "", "wife": "", "children": []}
            for line in lines[1:]:
                if match := re.match(r"^1 HUSB (@[^@]+@)", line):
                    family["husband"] = match[1]
                elif match := re.match(r"^1 WIFE (@[^@]+@)", line):
                    family["wife"] = match[1]
                elif match := re.match(r"^1 CHIL (@[^@]+@)", line):
                    family["children"].append(match[1])
            families.append(family)
            continue

        person = {
            "id": record_id,
            "name": "",
            "surname": "",
            "surnames": [],
            "fallback_surname": "",
            "birth_date": "",
            "death_date": "",
            "place": "",
            "birth_place": "",
            "family_ids": [],
            "roles": [],
            "_photos": [],
            "deceased": False,
        }
        event = ""
        in_photo = False

        for line in lines[1:]:
            if match := re.match(r"^1 NAME (.+)", line):
                if not person["name"]:
                    gedcom_name = match[1]
                    person["name"] = gedcom_name.replace("/", "").strip()
                    surname = re.search(r"/([^/]+)/", gedcom_name)
                    if surname:
                        surname = surname[1].strip()
                        person["surnames"].append(surname)
                        if not person["surname"]:
                            person["surname"] = surname
            elif match := re.match(r"^2 SURN (.+)", line):
                surname = match[1].strip()
                person["surnames"].append(surname)
                if not person["fallback_surname"]:
                    person["fallback_surname"] = surname
            elif re.match(r"^1 (BIRT|DEAT)\b", line):
                event = line.split()[1]
                in_photo = False
                if event == "DEAT":
                    person["deceased"] = True
            elif match := re.match(r"^1 (TITL|OCCU)(?: (.*))?", line):
                if match[2] and PUBLIC_HISTORICAL_ROLE.search(match[2]):
                    person["roles"].append(match[2].strip())
                event = ""
                in_photo = False
            elif re.match(r"^1 OBJE\b", line):
                event = ""
                in_photo = True
            elif match := re.match(r"^2 FILE (https://\S+|assets/[A-Za-z0-9._-]+)", line):
                if in_photo:
                    person["_photos"].append({"url": match[1], "caption": ""})
            elif match := re.match(r"^2 TITL (.+)", line):
                if in_photo and person["_photos"]:
                    person["_photos"][-1]["caption"] = match[1].strip()
            elif match := re.match(r"^2 DATE (.+)", line):
                if event in ("BIRT", "DEAT"):
                    person["birth_date" if event == "BIRT" else "death_date"] = match[1].strip()
            elif match := re.match(r"^2 PLAC (.+)", line):
                if event == "BIRT" and not person["birth_place"]:
                    person["birth_place"] = match[1].strip()
                if event == "BIRT" and not person["place"]:
                    person["place"] = match[1].split(",")[0].strip()
            elif match := re.match(r"^1 FAMC (@[^@]+@)", line):
                person["family_ids"].append(match[1])
            elif re.match(r"^1 ", line):
                event = ""
                in_photo = False

        if not person["surname"]:
            person["surname"] = person["fallback_surname"]
        person.pop("fallback_surname")
        person["surnames"] = list(dict.fromkeys(person["surnames"]))
        birth_date = person["birth_date"]
        death_date = person.pop("death_date")
        person["birth"] = year_from_date(birth_date) if person["deceased"] else ""
        person["death"] = year_from_date(death_date)
        people.append(person)

    family_by_id = {family["id"]: family for family in families}
    people_by_id = {person["id"]: person for person in people}
    parents_by_child = {}
    for family in families:
        parent_ids = [parent for parent in (family["husband"], family["wife"]) if parent in people_by_id]
        for child_id in family["children"]:
            parents_by_child.setdefault(child_id, []).extend(parent_ids)
    photos = []
    for person in people:
        parent_ids = []
        for family_id in person.pop("family_ids"):
            family = family_by_id.get(family_id)
            if family:
                parent_ids.extend(parent for parent in (family["husband"], family["wife"]) if parent in people_by_id)
        parent_ids.extend(parents_by_child.get(person["id"], []))
        person["parents"] = list(dict.fromkeys(parent_ids))
        for photo in person.pop("_photos"):
            path = urlsplit(photo["url"]).path.casefold()
            if person["deceased"] and person["death"] and path.endswith((".jpg", ".jpeg", ".png", ".webp")):
                photos.append({"personId": person["id"], "name": person["name"], **photo})
        person.pop("deceased")
        person["roles"] = list(dict.fromkeys(person["roles"]))

    surnames = {}
    for person in people:
        for variant in person["surnames"] or [person["surname"]]:
            name = variant.strip()
            if name and not re.fullmatch(r"[?\s]+", name):
                surnames.setdefault(name.casefold(), {"name": name, "places": "Recorded family line"})

    return {
        "people": people,
        "families": families,
        "surnames": sorted(surnames.values(), key=lambda surname: surname["name"].casefold()),
        "photos": photos,
    }


def load_archive():
    if not GEDCOM.is_file():
        return None
    return records_from_gedcom(GEDCOM.read_text(encoding="utf-8", errors="replace"))


def public_archive_data(data):
    generations = ancestor_generations(data["people"])
    people = []
    for source_person in data["people"]:
        person = {**source_person, "parents": list(source_person["parents"])}
        older_than_85 = is_over_85(person.get("birth_date", ""))
        generation = generations.get(person["id"], 0)
        publicly_named_generation = generation > 3
        if older_than_85:
            person["birth"] = person.get("birth_date", "")
            person["place"] = person.get("birth_place", person.get("place", ""))
        elif not person.get("death"):
            if person["name"] != "Nathan Albert Pardo" and not publicly_named_generation:
                person["name"] = initials_name(person["name"], person.get("surname", ""))
            person["birth"] = ""
            person["place"] = ""
        person.pop("birth_date", None)
        person.pop("birth_place", None)
        people.append(person)

    surnames = {}
    public_names = {person["id"]: person["name"] for person in people}
    for person in people:
        for variant in person["surnames"] or [person["surname"]]:
            name = variant.strip()
            if name and not re.fullmatch(r"[?\s]+", name):
                surnames.setdefault(name.casefold(), {"name": name, "places": "Recorded family line"})

    return {
        "people": people,
        "families": data["families"],
        "surnames": sorted(surnames.values(), key=lambda surname: surname["name"].casefold()),
        "photos": [
            {**photo, "name": public_names.get(photo.get("personId"), photo["name"])}
            for photo in data["photos"]
            if next(
                (person for person in people if person["id"] == photo.get("personId")),
                {},
            ).get("death")
        ],
    }


class ArchiveHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        request_path = unquote(urlsplit(self.path).path)
        if request_path == "/api/family-data":
            archive = load_archive()
            if archive is None:
                self.send_error(404, "GEDCOM source is not available")
                return
            data = public_archive_data(archive)
            payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        if ".ged" in request_path.casefold() or ".git" in request_path.casefold():
            self.send_error(404, "Not found")
            return
        super().do_GET()

    def do_HEAD(self):
        request_path = unquote(urlsplit(self.path).path)
        if ".ged" in request_path.casefold() or ".git" in request_path.casefold():
            self.send_error(404, "Not found")
            return
        super().do_HEAD()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), ArchiveHandler)
    print(f"Family archive running at http://localhost:{PORT}")
    server.serve_forever()