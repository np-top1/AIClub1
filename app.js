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
  { year: "1522", title: "A Galante ancestor in Rome", detail: "Moshe Galante is recorded in Rome; later generations of this line are associated with Safed and Jerusalem.", citations: ["gedcom"] },
  { year: "1565", title: "The Pinto rabbinic line", detail: "Josiah (Yoshiyahu) Yosef Pinto is born in Damascus and later serves as a rabbi there.", citations: ["pinto"] },
  { year: "1756", title: "Raphael Meyuhas becomes Rishon Le-Zion", detail: "Raphael Meyuhas ben Samuel is appointed chief rabbi (Rishon Le-Zion) of Jerusalem after the death of Israel Jacob Algazi. The reference also records his earlier service as av beit din and a 1723 mission to Constantinople.", citations: ["meyuhas"] },
  { year: "c. 1808–1811", title: "The Mann family reaches Lebanon", detail: "Nagi Girgi Zeidan’s family history describes Isaac Mann’s migration from Lithuania toward Safed and the family’s early settlement in Saida, followed by a move to Beirut.", citations: ["mann"] },
  { year: "1814", title: "David Pardo arrives in Jerusalem", detail: "A Monastir community history says the 1839 Montefiore census recorded David Pardo, a young miller from Monastir, arriving in Jerusalem in 1814 and marrying a Jerusalem woman.", citations: ["monastir-pardo"] },
  { year: "1822", title: "Haim Pinhas Pardo is born", detail: "The Monastir account identifies Haim Pinhas as David Pardo’s son, says he married Yael (daughter of Rabbi Shemuel Meyuhas), and names their children Malka, David, and Shemuel Eliezer. It describes Haim as a Jerusalem rabbi and preacher; the family tree records Shemuel Eliezer as their son.", citations: ["monastir-pardo", "gedcom"] },
  { year: "1875", title: "A Pardo home in Mishkenot Yisrael", detail: "The account says brothers David and Shemuel Eliezer Pardo helped establish Mishkenot Yisrael outside Jerusalem’s Old City walls; it dates the neighborhood’s founding to 1875.", citations: ["monastir-pardo"] },
  { year: "1882", title: "Haim Pinhas and Yael die in Jerusalem", detail: "The account reports that Haim Pinhas Pardo and his wife Yael died in 1882 and were buried on the Mount of Olives.", citations: ["monastir-pardo"] },
  { year: "c. 1890", title: "From Baghdad to Damascus", detail: "In the family account, Joseph Obadiah Bibi, his wife Farha, and his brother Salim (Solomon) leave Baghdad and settle in Damascus.", citations: ["family-account"] },
  { year: "1895", title: "Aleppo’s hakham bashi controversy", detail: "The family tree records Abraham Dweck Hakohen Khalousi’s life as 1800–1901. Yaron Harel’s study examines his removal from office in 1895.", citations: ["gedcom", "abraham-cambridge", "abraham-liverpool"] },
  { year: "1910s", title: "Joseph and Reuben Bibi reach California", detail: "The family account places Joseph Obadiah and Reuben’s departure from Damascus around 1910. Sampson Mills’ family history says Joseph and Reuben came from France for the California World’s Fair in the 1910s, then settled in the United States and moved to New York.", citations: ["family-account", "bibi-founder-history"] },
  { year: "1914", title: "Safdieh and Shmalo-Dwek", detail: "Abraham Safdieh and Sarah Shmalo-Dwek marry in New York, according to the marriage record.", citations: ["gedcom"] },
  { year: "1920", title: "A shared voyage to a new home", detail: "Farha, her remaining children, and Salim’s family are remembered as arriving on the same ship as Hacham Murad and Sarah Maslaton and their children. Salim’s descendants are not included in this ancestor tree.", citations: ["family-account"] },
  { year: "1938", title: "Shemuel Eliezer Pardo dies", detail: "A Monastir community history remembers Rabbi Shemuel Eliezer Pardo as a Jerusalem preacher, Hebrew educator, and teacher in the Sephardic Talmud Torah for about 30 years.", citations: ["monastir-pardo"] },
  { year: "1946", title: "A Brooklyn ketubah", detail: "The marriage record for Eli Safdieh and Esther Maslaton places the family at Ocean Parkway Jewish Center.", citations: ["gedcom"] },
  { year: "1956", title: "David and Matilda go to Israel", detail: "David Pardo and Matilda Betesh leave Egypt for Israel, while their son Albert Pardo and his wife Arlette take a separate route to America with their children.", citations: ["gedcom"] },
  { year: "1957", title: "Albert and Arlette reach Paris", detail: "Albert Pardo and Arlette travel to Paris with their children on their way from Egypt to America.", citations: ["family-account"] },
  { year: "1958", title: "Arrival at Idlewild Airport", detail: "The family account records Albert, Arlette, and their children arriving at then-Idlewild Airport aboard a TWA 707.", citations: ["family-account"] },
  { year: "2006", title: "The Pardo household", detail: "The GEDCOM records Nathan Albert Pardo as the child of A. A. Pardo and A. Bibi.", citations: ["gedcom"] }
];

const citationSources = [
  {
    id: "abraham-cambridge",
    label: "Yaron Harel, “Abraham Dweck Hakohen Khalousi: The Last Hakham Bashi Born in Aleppo,” Cambridge Core, in Intrigue and Revolution.",
    url: "https://www.cambridge.org/core/books/intrigue-and-revolution/abraham-dweck-hakohen-khalousi-the-last-hakham-bashi-born-in-aleppo/B206E6775FDAD5CDD7637E7AEAF68E2B"
  },
  {
    id: "abraham-liverpool",
    label: "Yaron Harel, “Abraham Dweck Hakohen Khalousi: The Last Hakham Bashi Born in Aleppo,” Liverpool University Press Scholarship Online, chapter 6.",
    url: "https://liverpool.universitypressscholarship.com/view/10.3828/liverpool/9781904113874.001.0001/upso-9781904113874-chapter-006"
  },
  {
    id: "abraham-researchgate",
    label: "ResearchGate copy of “Abraham Dweck Hakohen Khalousi: The Last Hakham Bashi Born in Aleppo” (repository copy of the same study).",
    url: "https://www.researchgate.net/publication/349619542_Abraham_Dweck_Hakohen_Khalousi_The_Last_Hakham_Bashi_Born_in_Aleppo"
  },
  {
    id: "galante",
    label: "“Galante,” The Jewish Encyclopedia (1901–1906).",
    url: "https://www.jewishencyclopedia.com/view.jsp?letter=G&artid=24"
  },
  {
    id: "pinto",
    label: "“Pinto,” The Jewish Encyclopedia (1901–1906), entry on Josiah ben Joseph Pinto.",
    url: "https://www.jewishencyclopedia.com/view.jsp?letter=P&artid=342"
  },
  {
    id: "maslaton",
    label: "Sarina Roffé, “Rabbi Murad Maslaton, A Great Leader,” JewishGen Rabbinic Journal.",
    url: "https://www.jewishgen.org/rabbinic/journal/maslaton.htm"
  },
  {
    id: "lebanon",
    label: "Alain Farhi, “The Jews of Lebanon: History and Records,” paper presented at the 32nd IAJGS International Conference on Jewish Genealogy, 2012.",
    url: "https://www.farhi.org/Documents/The%20Jews%20of%20Lebanon.htm"
  },
  {
    id: "mann",
    label: "Nagi Girgi Zeidan, “L’Histoire de la famille juive libanaise Mann” (French), 17 June 2009.",
    url: "https://www.farhi.org/Documents/HISTOIRE%20DE%20LA%20FAMILLE%20MANN%20JUIVE%20LIBANAISE.htm"
  },
  {
    id: "family-account",
    label: "Family account provided by the archive owner: Joseph Obadiah Bibi, Farha, Salim (Solomon), and the family’s Baghdad–Damascus migration and 1920 voyage. Recorded here as family testimony, not independently verified.",
    url: ""
  },
  {
    id: "gedcom",
    label: "Supplied family-tree GEDCOM export. Dates, names, and relationships are reproduced as recorded and are not independently verified by this website.",
    url: ""
  },
  {
    id: "meyuhas",
    label: "“Meyuhas, Raphael Meyuhas ben Samuel,” Encyclopedia.com, from Encyclopaedia Judaica.",
    url: "https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/meyuhas-raphael-meyuhas-ben-samuel"
  },
  {
    id: "bibi-founder-history",
    label: "“Founder History,” Sampson Mills, family history of Joseph and Reuben Bibi and the family business.",
    url: "https://www.sampsonmills.com/founder-history"
  },
  {
    id: "bibi-museum",
    label: "Sephardic Heritage Museum, excerpt from the forthcoming book Our Stories: 100 Years — Syrian Jewish Life in America, 1890–1990s; Facebook post preview.",
    url: "https://www.facebook.com/SephardicHeritageMuseum/posts/excerpt-from-our-upcoming-coffee-table-book-our-stories-100-years-syrian-jewish-/1139876531162019/"
  },
  {
    id: "monastir-pardo",
    label: "“The Pardo Preachers of Jerusalem,” Monastir-Bitola family-stories group post. Hebrew transcript supplied by the archive owner; historical claims are attributed to that post and have not all been independently verified.",
    url: "https://www.facebook.com/groups/393479247525941/posts/966942956846231/"
  }
];

const notableCitationIds = {
  "Abraham Ezra Dweck Khalousi HaKohen": ["abraham-cambridge", "abraham-liverpool", "abraham-researchgate"],
  "Moshe משה Galante II": ["galante"],
  "Rephael רפאל מאיר Meyuhas": ["meyuhas"],
  "Yoshiyahu Yosef Pinto": ["pinto"],
  "Mordechai Murad Maslaton": ["maslaton"],
  "Haim Pinhas Pardo": ["monastir-pardo", "gedcom"],
  "Shemuel Eliezer Pardo": ["monastir-pardo", "gedcom"],
  "Joseph Youssef Mann": ["mann"]
};

let people = [...initialPeople];
let familyLinks = [];
let archivePhotos = [];
let showAllPhotos = false;
let visiblePhotoCount = 24;
let galleryPhotos = [];
let viewerIndex = 0;
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
  const albertAri = people.find((person) => person.name === "A. A. Pardo");
  const menahem = people.find((person) => person.name === "Menahem Dweck");
  const eliyahu = people.find((person) => person.name === "Eliyahu Ben Seruya");
  const itzhak = people.find((person) => person.name.startsWith("Itzhak Ben Seruya"));
  if (!adele || !albertAri || !menahem || !eliyahu || !itzhak) {
    $("#tree-connections").innerHTML = "";
    return;
  }
  const adeleToMenahem = findParentPath(adele, menahem.id);
  const adeleToEliyahu = findParentPath(adele, eliyahu.id);
  const albertToMenahem = findParentPath(albertAri, menahem.id);
  const albertToItzhak = findParentPath(albertAri, itzhak.id);
  const brothersSharedParents = (eliyahu.parents || [])
    .filter((parentId) => (itzhak.parents || []).includes(parentId))
    .map(personById)
    .filter(Boolean);
  const relatedPerson = (person) => `<button class="connection-person" type="button" data-person="${escapeHtml(person.id)}">${escapeHtml(person.name)} ↗</button>`;
  const siblingDescription = brothersSharedParents.length
    ? `The updated GEDCOM records ${brothersSharedParents.map((parent) => parent.name).join(" and ")} as parent${brothersSharedParents.length > 1 ? "s" : ""} of both brothers.`
    : "The supplied family record identifies Eliyahu and Itzhak as brothers.";
  const ancestryPath = (path, ancestor) => path?.map((person) => person.name).join(" → ") || `${albertAri.name} → ${ancestor.name}`;
  const adelePath = (path, ancestor) => path?.map((person) => person.name).join(" → ") || `${adele.name} → ${ancestor.name}`;
  $("#tree-connections").innerHTML = `<div class="connection-heading"><p class="eyebrow">TWO BLOOD-ANCESTOR CONNECTIONS</p><p>Follow both A. Bibi’s and her husband A. A. Pardo’s documented family lines.</p></div><div class="connection-grid"><article class="connection-card"><span>01 · SHARED ANCESTOR</span><h3>A. Bibi and A. A. Pardo both descend from Rabbi Menahem Dweck.</h3><p>The archive records both ancestor paths through their maternal lines.</p><small>${escapeHtml(adelePath(adeleToMenahem, menahem))}<br>${escapeHtml(ancestryPath(albertToMenahem, menahem))}</small><div class="connection-people">${relatedPerson(menahem)}</div></article><article class="connection-card"><span>02 · DESCENDANTS OF BROTHERS</span><h3>A. Bibi and A. A. Pardo descend from the Ben Seruya brothers.</h3><p>${escapeHtml(siblingDescription)} Adele’s line runs through Eliyahu; Albert Ari’s line runs through Itzhak.</p><small>${escapeHtml(adelePath(adeleToEliyahu, eliyahu))}<br>${escapeHtml(ancestryPath(albertToItzhak, itzhak))}</small><div class="connection-people">${brothersSharedParents.map(relatedPerson).join("")}${relatedPerson(eliyahu)}${relatedPerson(itzhak)}</div></article></div><p class="connection-source">Ancestry paths shown above follow the supplied GEDCOM. The relationship between A. Bibi and A. A. Pardo is documented as their marriage; each descends from these ancestors independently.</p>`;
  $("#tree-connections").querySelectorAll("[data-person]").forEach((button) => button.addEventListener("click", () => focusPerson(button.dataset.person)));
}

const notableDescriptions = {
  "Abraham Ezra Dweck Khalousi HaKohen": "Yaron Harel’s study identifies Abraham Dweck Hakohen Khalousi as Aleppo’s last hakham bashi and examines his controversial 1895 removal from office. Harel notes the episode caused turmoil in Aleppo, Istanbul, and Jerusalem, but was later omitted from printed accounts and denied by community elders. The chapter places his leadership in the local structure of Syrian Jewish communities, rather than a single chief rabbinate over the whole region.",
  "Moshe משה Galante II": "A Jewish Encyclopedia entry records Moses ben Jonathan Galante’s dates (1621–1689) and works including Zebah ha-Shelamim and Korban Chagigah. The family record identifies him as a Jerusalem rabbi and the first Rishon Le-Zion.",
  "Rephael רפאל מאיר Meyuhas": "The Encyclopaedia Judaica biography describes Raphael Meyuhas ben Samuel as a Jerusalem-born scholar who headed the Bet Ya'akov yeshivah, served as av beit din, and was appointed Rishon Le-Zion in 1756. It also records a 1723 mission to Constantinople and several published works.",
  "Yoshiyahu Yosef Pinto": "The Jewish Encyclopedia describes Josiah ben Joseph Pinto (c. 1565–1648) as a Syrian rabbi and preacher based in Damascus, and lists his homiletical writings and commentary on Ein Yaakov.",
  "Mordechai Murad Maslaton": "A JewishGen biography of Rabbi Murad Maslaton (1876–1959) describes his teaching of Hebrew and Arabic at the Alliance Israelite school in Damascus, his leadership and teaching at Ahi Ezer, and his later service to the Syrian Jewish community in Brooklyn.",
  "Haim Pinhas Pardo": "The Monastir community-history post describes Haim Pinhas Pardo (1822–1882) as a Jerusalem rabbi and prominent preacher, son of David Pardo, who came from Monastir. It says Haim and his wife Yael were buried on the Mount of Olives. The supplied family tree records Shemuel Eliezer Pardo as their son.",
  "Shemuel Eliezer Pardo": "A Monastir community-history post remembers Rabbi Shemuel Eliezer Pardo (1857–1938) as a leading Jerusalem preacher, a regular preacher at Rabban Yohanan ben Zakkai Synagogue, an advocate of Hebrew-speaking families, and a teacher in the Sephardic Talmud Torah for about 30 years. It also credits him and his brother David with helping establish Mishkenot Yisrael in 1875, and says he made part of his home into a synagogue later called Ohel Shemuel.",
  "Avraham Moshe Meyuchas": "Described in the family notes as one of the sages of Jerusalem.",
  "Joseph Youssef Mann": "Nagi Girgi Zeidan’s history of the Mann family identifies Yousef as a rabbi in Beirut and names Isaac and Eliyahou as his sons. It says Eliyahou, not Yousef, served as mukhtar of Beirut’s Jewish community until 1900; Eliyahou’s son Isaac then held the role until 1930. The article presents some earlier family-history details as tentative.",
  "Shimon Dwek": "Recorded as a rabbi and author of Reah Sadeh."
};

function citationMarkers(ids = []) {
  return ids.map((id) => {
    const index = citationSources.findIndex((source) => source.id === id);
    if (index < 0) return "";
    return `<sup class="citation-marker"><a href="#citation-${escapeHtml(id)}" aria-label="See citation ${index + 1}">[${index + 1}]</a></sup>`;
  }).join(" ");
}

function renderCitations() {
  $("#citations-list").innerHTML = citationSources.map((source, index) => {
    const title = escapeHtml(source.label);
    const linkedTitle = source.url
      ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${title}</a>`
      : title;
    return `<li id="citation-${escapeHtml(source.id)}"><span class="citation-number">${index + 1}.</span> ${linkedTitle}</li>`;
  }).join("");
}

function renderNotables() {
  const notablePeople = people.map((person) => ({
    ...person,
    notableRoles: (person.roles || []).filter((role) => /rabbi|hakham|hacham|gaon|dayan|rishon|author|scholar|mukhtar|mayor|engraver|master craftsman/i.test(role))
  })).filter((person) => person.notableRoles.length);
  $("#notable-grid").innerHTML = notablePeople.length ? notablePeople.map((person) => {
    const roles = person.notableRoles.join(" · ");
    const description = notableDescriptions[person.name] || `Identified in the family record as ${roles}.`;
    const citations = citationMarkers(notableCitationIds[person.name]);
    const life = person.death ? [person.birth, person.death].filter(Boolean).join("–") : "";
    return `<article class="notable-card"><span class="notable-role">${escapeHtml(roles)}</span><h3>${escapeHtml(person.name)}</h3><p>${escapeHtml(description)} ${citations}</p><small>${escapeHtml([life, person.place].filter(Boolean).join(" · "))}</small></article>`;
  }).join("") : `<div class="empty-state">No titled or scholarly ancestors are available in this record.</div>`;
}

function renderPhotos() {
  const personOrder = new Map(people.map((person, index) => [person.name, index]));
  const portraitsByPerson = new Map();
  const seenUrlsByPerson = new Map();
  for (const photo of archivePhotos) {
    if (!photo.url) continue;
    if (!seenUrlsByPerson.has(photo.name)) seenUrlsByPerson.set(photo.name, new Set());
    const seenUrls = seenUrlsByPerson.get(photo.name);
    if (seenUrls.has(photo.url)) continue;
    seenUrls.add(photo.url);
    if (!portraitsByPerson.has(photo.name)) portraitsByPerson.set(photo.name, []);
    portraitsByPerson.get(photo.name).push(photo);
  }
  const photoQuality = (photo) => {
    const source = `${photo.url} ${photo.caption || ""}`.toLowerCase();
    let score = 0;
    if (/\.(?:jpe?g|webp)(?:[?#]|$)/.test(photo.url)) score += 3;
    if (/(?:portrait|family|sisters|cousins|dsc_|img_|photo_)/.test(source)) score += 2;
    if (/(?:draft|registration|census|ketub|document|family.tree|record|certificate|pdf|doc\.png|screenshot)/.test(source)) score -= 10;
    if (photo.caption) score -= 1;
    return score;
  };
  const curatedPhotos = [...portraitsByPerson.values()].map((portraits) => [...portraits].sort((a, b) => photoQuality(b) - photoQuality(a))[0]);
  const primaryPeople = new Set(["Joseph Obadiah Bibi", "Reuben Bibi", "Mordechai Murad Maslaton", "Shemuel Eliezer Pardo", "Abraham Ezra Dweck Khalousi HaKohen", "Haim Pinhas Pardo", "Rephael רפאל מאיר Meyuhas", "Yoshiyahu Yosef Pinto", "Menahem Dweck"]);
  const sortGallery = (a, b) => Number(primaryPeople.has(b.name)) - Number(primaryPeople.has(a.name))
    || personOrder.get(a.name) - personOrder.get(b.name);
  const curated = curatedPhotos.sort(sortGallery);
  const fullAlbum = [...portraitsByPerson.values()].flat().sort(sortGallery);
  const query = $("#photo-search").value.trim().toLocaleLowerCase();
  galleryPhotos = (showAllPhotos ? fullAlbum : curated).filter((photo) => photo.name.toLocaleLowerCase().includes(query));
  const shown = galleryPhotos.slice(0, visiblePhotoCount);
  const uniquePeople = new Set(galleryPhotos.map((photo) => photo.name)).size;
  $("#photo-count").textContent = showAllPhotos
    ? `${galleryPhotos.length} photos · ${uniquePeople} relatives`
    : `${galleryPhotos.length} relatives · one portrait each`;
  $("#photo-view-toggle").textContent = showAllPhotos ? "One portrait per relative" : `Browse every photo (${fullAlbum.length})`;
  $("#photo-view-toggle").setAttribute("aria-pressed", String(showAllPhotos));
  $("#photo-grid").innerHTML = shown.length ? shown.map((photo, index) => `<button class="photo-card" type="button" data-photo-index="${index}" aria-label="View photo of ${escapeHtml(photo.name)}"><span class="photo-image-wrap"><img src="${escapeHtml(photo.url)}" alt="Photograph of ${escapeHtml(photo.name)}" loading="lazy"><span class="photo-open-hint">OPEN GALLERY ↗</span></span><span class="photo-person">${escapeHtml(photo.name)}</span><small>${escapeHtml(photo.caption || "Family archive")}</small></button>`).join("") : `<div class="empty-state">No family photos match that name.</div>`;
  $("#photo-load-more").hidden = shown.length >= galleryPhotos.length;
  $("#photo-load-more").textContent = showAllPhotos ? "Show more photos ↓" : "Show more relatives ↓";
  $("#photo-grid").querySelectorAll("[data-photo-index]").forEach((card) => card.addEventListener("click", () => openPhoto(Number(card.dataset.photoIndex))));
}

function openPhoto(index) {
  viewerIndex = index;
  updatePhotoViewer();
  $("#photo-viewer").showModal();
}

function updatePhotoViewer() {
  const photo = galleryPhotos[viewerIndex];
  if (!photo) return;
  $("#photo-viewer-image").src = photo.url;
  $("#photo-viewer-image").alt = `Photograph of ${photo.name}`;
  $("#photo-viewer-name").textContent = photo.name;
  $("#photo-viewer-caption").textContent = photo.caption || "Family archive";
  $("#photo-viewer-count").textContent = `${viewerIndex + 1} / ${galleryPhotos.length}`;
}

function movePhoto(direction) {
  if (!galleryPhotos.length) return;
  viewerIndex = (viewerIndex + direction + galleryPhotos.length) % galleryPhotos.length;
  updatePhotoViewer();
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
  $("#timeline-list").innerHTML = timelineItems.map((item) => `<article class="timeline-item"><time>${escapeHtml(item.year)}</time><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)} ${citationMarkers(item.citations)}</p></article>`).join("");
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
    const person = { id, name: "", given: "", surname: "", surnames: [], birth: "", death: "", place: "", familyIds: [], roles: [], photos: [], deceased: false };
    let currentEvent = "";
    let currentObject = false;
    for (const line of lines.slice(1)) {
      let match;
      if ((match = line.match(/^1 NAME (.+)/))) { if (!person.name) person.name = match[1].replace(/\//g, "").trim(); const surname = match[1].match(/\/([^/]+)\//)?.[1]?.trim(); if (surname && !person.surnames.includes(surname)) person.surnames.push(surname); if (!person.surname && surname) person.surname = surname; }
      else if ((match = line.match(/^2 GIVN (.+)/))) { if (!person.given) person.given = match[1].trim(); }
      else if ((match = line.match(/^2 SURN (.+)/))) { const surname = match[1].trim(); if (!person.surnames.includes(surname)) person.surnames.push(surname); if (!person.surname) person.surname = surname; }
      else if ((match = line.match(/^1 (BIRT|DEAT)/))) { currentEvent = match[1]; currentObject = false; if (currentEvent === "DEAT") person.deceased = true; }
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
    person.photos = person.deceased ? person.photos.map((photo) => typeof photo === "string" ? { url: photo, caption: "" } : photo).filter((photo) => /\.(?:jpe?g|png|webp)(?:[?#]|$)/i.test(photo.url)) : [];
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
  renderCitations();
}

$("#gedcom-file").addEventListener("change", (event) => importGedcom(event.target.files[0]));
$("#surname-search").addEventListener("input", () => { activeSurname = ""; renderSurnames(); renderPeople(); });
$("#photo-search").addEventListener("input", () => { visiblePhotoCount = 24; renderPhotos(); });
$("#photo-view-toggle").addEventListener("click", () => { showAllPhotos = !showAllPhotos; visiblePhotoCount = 24; renderPhotos(); });
$("#photo-load-more").addEventListener("click", () => { visiblePhotoCount += 24; renderPhotos(); });
$("#photo-viewer-close").addEventListener("click", () => $("#photo-viewer").close());
$("#photo-viewer-prev").addEventListener("click", () => movePhoto(-1));
$("#photo-viewer-next").addEventListener("click", () => movePhoto(1));
$("#photo-viewer").addEventListener("click", (event) => { if (event.target === $("#photo-viewer")) $("#photo-viewer").close(); });
$("#photo-viewer").addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") { event.preventDefault(); movePhoto(-1); }
  if (event.key === "ArrowRight") { event.preventDefault(); movePhoto(1); }
});
$("#global-search").addEventListener("input", (event) => { searchTerm = event.target.value.trim(); activeSurname = ""; renderSurnames(); renderPeople(); if (searchTerm) $("#names").scrollIntoView({ behavior: "smooth" }); });
$("#clear-filter").addEventListener("click", () => { activeSurname = ""; searchTerm = ""; $("#surname-search").value = ""; $("#global-search").value = ""; renderSurnames(); renderPeople(); });
$("#show-all-people").addEventListener("click", () => { activeSurname = ""; renderSurnames(); renderPeople(); $("#names").scrollIntoView({ behavior: "smooth" }); });
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) { event.preventDefault(); $("#global-search").focus(); }
  if (event.key === "Escape" && document.activeElement.tagName === "INPUT") { document.activeElement.blur(); }
});
renderAll();
loadWorkspaceArchive();