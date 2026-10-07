const initialPeople = [];

const surnameRecords = [
  ["Abade", "Aleppo · Brooklyn"], ["Abadi Dahab", "Aleppo · New York"], ["Aboud", "Cairo"], ["Antebi", "Aleppo · Jerusalem"],
  ["Ashur / Shour", "Aleppo · Damascus"], ["Bahuabe", "Aleppo"], ["Bakal", "Baghdad · Brooklyn"], ["Beda", "Cairo"],
  ["Beda Hamoui", "Aleppo"], ["Ben Seruya", "Aleppo"], ["Betesh", "Cairo · Jerusalem"], ["Bibi", "Baghdad · Brooklyn"],
  ["Cohen", "Aleppo · New York"], ["Cohen Shurba", "Aleppo · Brooklyn"], ["Dweck", "Aleppo · Jerusalem"], ["Dweck Faham", "Aleppo"],
  ["Dweck Khalousi", "Aleppo"], ["Dwek", "Aleppo · Damascus"], ["Dwek Khalousie", "Aleppo"], ["Esses", "Aleppo · Brooklyn"],
  ["Faham", "Aleppo"], ["Fallas", "Aleppo · New York"], ["Galante", "Rome · Safed · Jerusalem"], ["Gindi", "Aleppo · Brooklyn"],
  ["Gindi Dakneesh", "Aleppo · Brooklyn"], ["Grazi", "Aleppo"], ["Haddad Alfie", "Aleppo · New York"], ["Hagiz", "Fez · Jerusalem"],
  ["Kraiem", "Cairo · New York"], ["Mann", "Beirut"], ["Maslaton", "Damascus · Brooklyn"], ["Maslaton Tarrab Antebi", "Damascus"],
  ["Meyuhas", "Jerusalem"], ["Meyuchas", "Jerusalem"], ["Mishan", "Aleppo"], ["Misri", "Aleppo"], ["Mizrahi", "Beirut · Brooklyn"],
  ["Mosseri", "Aleppo"], ["Nakash", "Baghdad"], ["Noun", "Beirut"], ["Paredes-Fallas", "Aleppo · New York"], ["Pardo", "Jerusalem · Cairo · New York"],
  ["Pinto", "Damascus"], ["Safdieh", "Aleppo · Brooklyn"], ["Serouya", "Aleppo"], ["Shmalo-Dwek", "Aleppo · New York"],
  ["Sitt", "Aleppo"], ["Soffer", "Baghdad"], ["Taraman", "Syria"], ["Tarrab", "Damascus"], ["Vital", "Damascus"], ["Zalta", "Aleppo · New York"]
].map(([name, places]) => ({ name, places }));

const timelineItems = [
  { year: "1522", title: "A line begins in Rome", detail: "Moshe Galante is recorded in Rome; the family line later reaches Safed and Jerusalem." },
  { year: "1565", title: "The Pinto rabbinic line", detail: "Rabbi Yoshiyahu Yosef Pinto is born in Damascus, part of the family's documented scholarly history." },
  { year: "1914", title: "Safdieh and Shmalo-Dwek", detail: "Abraham Safdieh and Sarah Shmalo-Dwek marry in New York, according to the marriage record." },
  { year: "1946", title: "A Brooklyn ketubah", detail: "The marriage record for Eli Safdieh and Esther Maslaton places the family at Ocean Parkway Jewish Center." },
  { year: "1956", title: "From Egypt to Jerusalem", detail: "David Pardo and Matilda Betesh move from Egypt to Jerusalem with their son, as remembered in the family notes." },
  { year: "2006", title: "The Pardo household", detail: "The GEDCOM records Nathan Albert Pardo as the child of A. A. Pardo and A. Bibi." }
];

let people = [...initialPeople];
let familyLinks = [];
let archivePhotos = [];
let activeSurname = "";
let searchTerm = "";
let toastTimer;

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const personById = (id) => people.find((person) => person.id === id);

function setToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3400);
}

function renderStats() {
  $("#people-count").textContent = people.length.toLocaleString();
  $("#surname-count").textContent = surnameRecords.length.toLocaleString();
}

function renderTree() {
  const root = people.find((person) => person.name === "Nathan Albert Pardo") || people[0];
  if (!root) return;
  const generations = [[root]];
  const seen = new Set([root.id]);
  for (let depth = 0; depth < 30; depth += 1) {
    const next = [];
    for (const person of generations.at(-1)) {
      for (const parentId of person.parents || []) {
        const parent = personById(parentId);
        if (parent && !seen.has(parent.id)) {
          seen.add(parent.id);
          next.push(parent);
        }
      }
    }
    if (!next.length) break;
    generations.push(next);
  }

  const branchMembership = new Map();
  (root.parents || []).forEach((parentId, index) => {
    const branch = index === 0 ? "paternal" : "maternal";
    const branchSeen = new Set();
    const pending = [parentId];
    while (pending.length) {
      const id = pending.shift();
      if (branchSeen.has(id)) continue;
      branchSeen.add(id);
      if (!branchMembership.has(id)) branchMembership.set(id, new Set());
      branchMembership.get(id).add(branch);
      const person = personById(id);
      if (person) pending.push(...(person.parents || []));
    }
  });
  const sharedParents = new Map();
  for (const generation of generations.slice(1)) {
    for (const person of generation) {
      for (const parentId of person.parents || []) {
        sharedParents.set(parentId, (sharedParents.get(parentId) || 0) + 1);
      }
    }
  }
  const menahem = people.find((person) => person.name === "Menahem Dweck");
  if (menahem && seen.has(menahem.id)) {
    if (!branchMembership.has(menahem.id)) branchMembership.set(menahem.id, new Set());
    branchMembership.get(menahem.id).add("paternal");
    sharedParents.set(menahem.id, Math.max(sharedParents.get(menahem.id) || 0, 2));
  }
  $("#tree-count").textContent = `${seen.size.toLocaleString()} connected relatives · ${generations.length} generations`;
  $("#family-tree").innerHTML = `<p class="tree-hint">Scroll sideways to follow the generations. Each relative lists their recorded parents; names marked “shared ancestor” connect multiple branches.</p><div class="tree-scroll" tabindex="0" aria-label="Scrollable family tree, from Nathan Albert Pardo to earlier generations"><div class="tree-generations">${generations.map((generation, index) => `<section class="tree-generation"><h3>${index === 0 ? "ROOT" : index === 1 ? "PARENTS" : index === 2 ? "GRANDPARENTS" : `GENERATION ${index}`}<span>${generation.length} ${generation.length === 1 ? "person" : "people"}</span></h3><div class="tree-generation-people">${generation.map((person) => { const branches = branchMembership.get(person.id) || new Set(); const branch = branches.size > 1 ? "interwoven-line" : branches.has("maternal") ? "maternal-line" : branches.has("paternal") ? "paternal-line" : ""; return nodeMarkup(person, sharedParents.get(person.id) || 0, branch); }).join("")}</div></section>`).join("")}</div></div>`;
  $("#family-tree").querySelectorAll("[data-person]").forEach((node) => node.addEventListener("click", () => focusPerson(node.dataset.person)));
  renderTreeConnections(root);
}

function nodeMarkup(person, sharedCount = 0, branch = "") {
  if (!person) return "";
  const dates = [person.birth, person.death ? `–${person.death}` : ""].filter(Boolean).join(" ");
  const parents = (person.parents || []).map(personById).filter(Boolean).map((parent) => parent.name);
  const detail = [dates || person.place || person.surname || "Family record", parents.length ? `Parents: ${parents.join(" + ")}` : ""].filter(Boolean);
  return `<button class="person-node ${branch}" type="button" data-person="${escapeHtml(person.id)}"><strong>${escapeHtml(person.name)}</strong><span>${escapeHtml(detail[0])}</span>${parents.length ? `<span class="node-parents">${escapeHtml(detail[1])}</span>` : ""}${sharedCount > 1 ? `<span class="shared-ancestor">SHARED ANCESTOR · ${sharedCount} BRANCHES</span>` : ""}</button>`;
}

function findParentPath(descendant, ancestorId, visited = new Set()) {
  if (!descendant || visited.has(descendant.id)) return null;
  if (descendant.id === ancestorId) return [descendant];
  const nextVisited = new Set(visited).add(descendant.id);
  for (const parentId of descendant.parents || []) {
    const path = findParentPath(personById(parentId), ancestorId, nextVisited);
    if (path) return [descendant, ...path];
  }
  return null;
}

function renderTreeConnections(root) {
  const adele = people.find((person) => person.name === "A. Bibi");
  const albert = people.find((person) => person.name === "Albert Pardo");
  const menahem = people.find((person) => person.name === "Menahem Dweck");
  const eliyahu = people.find((person) => person.name === "Eliyahu Ben Seruya");
  const itzhak = people.find((person) => person.name.startsWith("Itzhak Ben Seruya"));
  if (!adele || !albert || !menahem || !eliyahu || !itzhak) {
    $("#tree-connections").innerHTML = "";
    return;
  }
  const adeleToMenahem = findParentPath(adele, menahem.id);
  const adeleToEliyahu = findParentPath(adele, eliyahu.id);
  const relatedPerson = (person) => `<button class="connection-person" type="button" data-person="${escapeHtml(person.id)}">${escapeHtml(person.name)} ↗</button>`;
  $("#tree-connections").innerHTML = `<div class="connection-heading"><p class="eyebrow">TWO BLOOD-ANCESTOR CONNECTIONS</p><p>Family clarification identifies two separate ways A. Bibi and Albert Pardo’s ancestry lines meet.</p></div><div class="connection-grid"><article class="connection-card"><span>01 · SHARED ANCESTOR</span><h3>Both descend from Rabbi Menahem Dweck.</h3><p>The export records Menahem Dweck as a rabbi and connects his Dweck line into Adele’s ancestry. The family clarification confirms Albert Pardo also descends from him; his full path is not spelled out in this export.</p><small>${escapeHtml(adeleToMenahem?.map((person) => person.name).join(" → ") || `${adele.name} → ${menahem.name}`)}<br>${escapeHtml(albert.name)} → descendant line → ${escapeHtml(menahem.name)} · family clarification</small><div class="connection-people">${relatedPerson(menahem)}</div></article><article class="connection-card"><span>02 · DESCENDANTS OF BROTHERS</span><h3>Eliyahu and Itzhak Ben Seruya were brothers.</h3><p>Adele’s recorded ancestry reaches Eliyahu Ben Seruya. The family clarification identifies Itzhak Ben Seruya as his brother and connects Albert Pardo through the other sibling branch.</p><small>${escapeHtml(adeleToEliyahu?.map((person) => person.name).join(" → ") || `${adele.name} → ${eliyahu.name}`)}<br>${escapeHtml(albert.name)} → descendant line through ${escapeHtml(itzhak.name)} · family clarification</small><div class="connection-people">${relatedPerson(eliyahu)}${relatedPerson(itzhak)}</div></article></div><p class="connection-source">The GEDCOM supplies Adele’s recorded ancestor links; the additional Albert Pardo links and the brothers’ relationship are family-provided clarifications.</p>`;
  $("#tree-connections").querySelectorAll("[data-person]").forEach((button) => button.addEventListener("click", () => focusPerson(button.dataset.person)));
}

const notableDescriptions = {
  "Abraham Ezra Dweck Khalousi HaKohen": "The record identifies him as Hakham Bashi and Grand Rabbi / Chief Rabbi of Aleppo.",
  "Moshe משה Galante II": "Recorded as the first Rishon Le-Zion and Chief Rabbi of Jerusalem; the family notes also identify him as a rabbinic author.",
  "Rephael רפאל מאיר Meyuhas": "Recorded with the title HaRishon Le-Zion, a senior rabbinic office in Jerusalem.",
  "Yoshiyahu Yosef Pinto": "A rabbi and author; the family record credits him with a commentary on Ein Yaakov.",
  "Avraham Moshe Meyuchas": "Described in the family notes as one of the sages of Jerusalem.",
  "Joseph Youssef Mann": "Recorded as a rabbi and as Beirut’s first mukhtar (mayor).",
  "Shimon Dwek": "Recorded as a rabbi and author of Reah Sadeh."
};

function renderNotables() {
  const notablePeople = people.map((person) => ({
    ...person,
    notableRoles: (person.roles || []).filter((role) => /rabbi|hakham|hacham|gaon|dayan|rishon|author|scholar|mukhtar|mayor|engraver|master craftsman/i.test(role))
  })).filter((person) => person.notableRoles.length);
  $("#notable-grid").innerHTML = notablePeople.length ? notablePeople.map((person) => {
    const roles = person.notableRoles.join(" · ");
    const description = notableDescriptions[person.name] || `Identified in the family record as ${roles}.`;
    const life = person.death ? [person.birth, person.death].filter(Boolean).join("–") : "";
    return `<article class="notable-card"><span class="notable-role">${escapeHtml(roles)}</span><h3>${escapeHtml(person.name)}</h3><p>${escapeHtml(description)}</p><small>${escapeHtml([life, person.place].filter(Boolean).join(" · "))}</small></article>`;
  }).join("") : `<div class="empty-state">No titled or scholarly ancestors are available in this record.</div>`;
}

function renderPhotos() {
  $("#photo-grid").innerHTML = archivePhotos.length ? archivePhotos.slice(0, 16).map((photo) => `<a class="photo-card" href="${escapeHtml(photo.url)}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer"><img src="${escapeHtml(photo.url)}" alt="Photograph from the archive of ${escapeHtml(photo.name)}" loading="lazy"><span>${escapeHtml(photo.name)}</span><small>${escapeHtml(photo.caption || "Family archive")}</small></a>`).join("") : `<div class="empty-state">No photographs of deceased relatives are available in the supplied record.</div>`;
}

function renderSurnames() {
  const query = $("#surname-search").value.trim().toLocaleLowerCase();
  const filtered = surnameRecords.filter(({ name, places }) => `${name} ${places}`.toLocaleLowerCase().includes(query));
  $("#surname-result-count").textContent = `${filtered.length} FAMILY NAMES`;
  $("#surname-list").innerHTML = filtered.length ? filtered.map(({ name, places }) => `<button class="surname-chip ${activeSurname === name ? "selected" : ""}" type="button" data-surname="${escapeHtml(name)}"><strong>${escapeHtml(name)}</strong><span>${escapeHtml(places)}</span></button>`).join("") : `<div class="empty-state">No family names match that search.</div>`;
  $("#surname-list").querySelectorAll("[data-surname]").forEach((button) => button.addEventListener("click", () => {
    activeSurname = activeSurname === button.dataset.surname ? "" : button.dataset.surname;
    renderSurnames();
    renderPeople();
  }));
}

function renderPeople() {
  const query = searchTerm.toLocaleLowerCase();
  const selected = people.filter((person) => {
    const matchesName = !activeSurname || [person.surname, ...(person.surnames || []), ...(person.tags || [])].some((name) => name?.toLocaleLowerCase().includes(activeSurname.toLocaleLowerCase()));
    const matchesQuery = !query || `${person.name} ${person.surname || ""} ${person.place || ""} ${person.hebrew || ""}`.toLocaleLowerCase().includes(query);
    return matchesName && matchesQuery;
  });
  $("#people-heading").textContent = activeSurname ? `${activeSurname} relatives` : query ? "Search results" : "The relatives";
  $("#people-grid").innerHTML = selected.length ? selected.map((person) => {
    const life = [person.birth, person.death].filter(Boolean).join(" – ");
    return `<article class="relative-card" tabindex="0" role="button" data-person="${escapeHtml(person.id)}"><span class="relative-era">${escapeHtml(life || person.surname || "FAMILY RECORD")}</span><h4>${escapeHtml(person.name)}</h4><p>${escapeHtml(person.place || person.note || person.surname || "Connected family member")}</p></article>`;
  }).join("") : `<div class="empty-state">No relatives match. Clear the name filter or try another surname.</div>`;
  $("#people-grid").querySelectorAll("[data-person]").forEach((card) => {
    const open = () => focusPerson(card.dataset.person);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } });
  });
}

function renderTimeline() {
  $("#timeline-list").innerHTML = timelineItems.map((item) => `<article class="timeline-item"><time>${escapeHtml(item.year)}</time><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)}</p></article>`).join("");
}

function focusPerson(id) {
  const person = personById(id);
  if (!person) return;
  activeSurname = person.surname || "";
  $("#surname-search").value = "";
  searchTerm = "";
  $("#global-search").value = "";
  renderSurnames();
  renderPeople();
  $("#names").scrollIntoView({ behavior: "smooth" });
  setToast(`${person.name}${person.note ? ` · ${person.note}` : person.place ? ` · ${person.place}` : ""}`);
}

function parseGedcom(text) {
  const records = text.split(/^0 /m).slice(1);
  const individuals = [];
  const families = [];
  for (const record of records) {
    const lines = record.split(/\r?\n/);
    const header = lines[0].match(/^(@[^@]+@)\s+(INDI|FAM)\b/);
    if (!header) continue;
    const id = header[1];
    if (header[2] === "FAM") {
      const family = { id, husband: "", wife: "", children: [] };
      for (const line of lines.slice(1)) {
        let match;
        if ((match = line.match(/^1 HUSB (@[^@]+@)/))) family.husband = match[1];
        else if ((match = line.match(/^1 WIFE (@[^@]+@)/))) family.wife = match[1];
        else if ((match = line.match(/^1 CHIL (@[^@]+@)/))) family.children.push(match[1]);
      }
      families.push(family);
      continue;
    }
    const person = { id, name: "", given: "", surname: "", surnames: [], birth: "", death: "", place: "", familyIds: [], roles: [], photos: [] };
    let currentEvent = "";
    let currentObject = false;
    for (const line of lines.slice(1)) {
      let match;
      if ((match = line.match(/^1 NAME (.+)/))) { if (!person.name) person.name = match[1].replace(/\//g, "").trim(); const surname = match[1].match(/\/([^/]+)\//)?.[1]?.trim(); if (surname && !person.surnames.includes(surname)) person.surnames.push(surname); if (!person.surname && surname) person.surname = surname; }
      else if ((match = line.match(/^2 GIVN (.+)/))) { if (!person.given) person.given = match[1].trim(); }
      else if ((match = line.match(/^2 SURN (.+)/))) { const surname = match[1].trim(); if (!person.surnames.includes(surname)) person.surnames.push(surname); if (!person.surname) person.surname = surname; }
      else if ((match = line.match(/^1 (BIRT|DEAT)/))) { currentEvent = match[1]; currentObject = false; }
      else if ((match = line.match(/^2 DATE (.+)/)) && currentEvent) { person[currentEvent === "BIRT" ? "birth" : "death"] = match[1].trim(); }
      else if ((match = line.match(/^2 PLAC (.+)/)) && currentEvent) { if (!person.place) person.place = match[1].split(",").slice(0, 2).join(",").trim(); }
      else if ((match = line.match(/^1 (?:TITL|OCCU) (.+)/))) { person.roles.push(match[1].trim()); currentObject = false; }
      else if ((match = line.match(/^1 FAMC (@[^@]+@)/))) { person.familyIds.push(match[1]); currentObject = false; }
      else if (/^1 OBJE\b/.test(line)) { currentObject = true; currentEvent = ""; }
      else if ((match = line.match(/^2 FILE (https:\/\/\S+)/)) && currentObject) { person.photos.push(match[1]); }
      else if ((match = line.match(/^2 TITL (.+)/)) && currentObject && person.photos.length) { person.photos[person.photos.length - 1] = { url: person.photos.at(-1), caption: match[1].trim() }; }
      else if (/^1 /.test(line)) { currentEvent = ""; currentObject = false; }
    }
    const displayName = person.name || [person.given, person.surname].filter(Boolean).join(" ");
    if (displayName) individuals.push({ ...person, name: displayName, surname: person.surname || displayName.split(/\s+/).at(-1) });
  }
  if (!individuals.length) throw new Error("No individual records were found in that GEDCOM file.");
  const byId = new Map(individuals.map((person) => [person.id, person]));
  const familyById = new Map(families.map((family) => [family.id, family]));
  const parentsByChild = new Map();
  for (const family of families) {
    const parentIds = [family.husband, family.wife].filter((parentId) => byId.has(parentId));
    for (const childId of family.children) {
      if (!parentsByChild.has(childId)) parentsByChild.set(childId, []);
      parentsByChild.get(childId).push(...parentIds);
    }
  }
  for (const person of individuals) {
    const recordedParents = person.familyIds.flatMap((familyId) => {
      const family = familyById.get(familyId);
      return family ? [family.husband, family.wife].filter((parentId) => byId.has(parentId)) : [];
    });
    person.parents = [...new Set([...recordedParents, ...(parentsByChild.get(person.id) || [])])];
    person.birth = person.birth.replace(/^(?:ABT|BET|BEF|AFT)\s+/i, "");
    person.birth = person.birth.match(/\d{3,4}/)?.[0] || "";
    person.death = person.death.match(/\d{3,4}/)?.[0] || "";
    person.roles = [...new Set(person.roles.filter(Boolean))];
    person.photos = person.death ? person.photos.map((photo) => typeof photo === "string" ? { url: photo, caption: "" } : photo).filter((photo) => /\.(?:jpe?g|png|webp)(?:[?#]|$)/i.test(photo.url)) : [];
  }
  const photos = individuals.flatMap((person) => person.photos.map((photo) => ({ ...photo, name: person.name })));
  const surnameMap = new Map();
  for (const person of individuals) {
    for (const variant of person.surnames || [person.surname]) {
      if (!variant || /^[?\s]+$/.test(variant)) continue;
      const name = variant.trim();
      if (!surnameMap.has(name.toLocaleLowerCase())) surnameMap.set(name.toLocaleLowerCase(), { name, places: person.place || "Recorded family line" });
    }
  }
  return { individuals, families, photos, surnames: [...surnameMap.values()].sort((a, b) => a.name.localeCompare(b.name)), familyLinks: families };
}

async function importGedcom(file) {
  if (!file) return;
  try {
    const parsed = parseGedcom(await file.text());
    people = parsed.individuals;
    familyLinks = parsed.familyLinks;
    archivePhotos = parsed.photos;
    surnameRecords.splice(0, surnameRecords.length, ...parsed.surnames);
    activeSurname = "";
    searchTerm = "";
    $("#surname-search").value = "";
    $("#global-search").value = "";
    $("#dataset-label").textContent = `Loaded locally · ${file.name}`;
    renderAll();
    setToast(`Loaded ${people.length} relatives and ${surnameRecords.length} surnames. Your file stays in this browser.`);
  } catch (error) {
    setToast(error.message || "That file could not be read as GEDCOM.");
  }
}

async function loadWorkspaceArchive() {
  try {
    const response = await fetch("/api/family-data");
    if (!response.ok) return;
    const data = await response.json();
    if (!Array.isArray(data.people) || !data.people.length) return;
    people = data.people;
    familyLinks = data.families || [];
    archivePhotos = data.photos || [];
    surnameRecords.splice(0, surnameRecords.length, ...data.surnames);
    $("#dataset-label").textContent = `${people.length.toLocaleString()} relatives · living details withheld`;
    renderAll();
  } catch {
    return;
  }
}

function renderAll() {
  renderStats();
  renderTree();
  renderNotables();
  renderPhotos();
  renderSurnames();
  renderPeople();
  renderTimeline();
}

$("#gedcom-file").addEventListener("change", (event) => importGedcom(event.target.files[0]));
$("#surname-search").addEventListener("input", () => { activeSurname = ""; renderSurnames(); renderPeople(); });
$("#global-search").addEventListener("input", (event) => { searchTerm = event.target.value.trim(); activeSurname = ""; renderSurnames(); renderPeople(); if (searchTerm) $("#names").scrollIntoView({ behavior: "smooth" }); });
$("#clear-filter").addEventListener("click", () => { activeSurname = ""; searchTerm = ""; $("#surname-search").value = ""; $("#global-search").value = ""; renderSurnames(); renderPeople(); });
$("#show-all-people").addEventListener("click", () => { activeSurname = ""; renderSurnames(); renderPeople(); $("#names").scrollIntoView({ behavior: "smooth" }); });
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) { event.preventDefault(); $("#global-search").focus(); }
  if (event.key === "Escape" && document.activeElement.tagName === "INPUT") { document.activeElement.blur(); }
});
renderAll();
loadWorkspaceArchive();