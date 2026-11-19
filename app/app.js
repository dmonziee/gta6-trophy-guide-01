// Leonida Trophy Guide — tracker for the 55 GTA VI trophies.
// Plain static page: loads its own data/trophies.json, keeps progress in
// localStorage, never talks to the network. Deep links: ?view=roadmap,
// ?trophy=<id>, ?spoiler=on|off, ?kind=..., ?grade=..., ?status=...

const STORE_KEY = 'gta6-trophies-v1';

const listEl = document.getElementById('list');
const emptyEl = document.getElementById('empty');
const onlineEmptyEl = document.getElementById('online-empty');
const hintEl = document.getElementById('filter-hint');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const statusEl = document.getElementById('status');
const spoilerEl = document.getElementById('spoiler');
const earnedCountEl = document.getElementById('earned-count');
const earnedPctEl = document.getElementById('earned-pct');
const progressFillEl = document.getElementById('progress-fill');
const progressBarEl = document.getElementById('progress-bar');
const progressNoteEl = document.getElementById('progress-note');

const params = new URLSearchParams(location.search);
const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;

let earned = new Set();
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]');
  if (Array.isArray(saved)) earned = new Set(saved.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
} catch {
  earned = new Set();
}

function persist() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function gradeLabel(grade) {
  return grade === 'platinum' ? 'Platinum' : grade === 'gold' ? 'Gold' : grade === 'silver' ? 'Silver' : 'Bronze';
}

function isHidden(t) {
  return spoilerEl.checked && t.hidden && !earned.has(t.id);
}

function cardFor(t) {
  const card = document.createElement('article');
  card.className = 'card';
  card.id = `trophy-${t.id}`;
  if (earned.has(t.id)) card.classList.add('is-earned');

  const checkWrap = document.createElement('div');
  checkWrap.className = 'card-check';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', `Mark ${t.name} earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id);
    else earned.delete(t.id);
    persist();
    render();
  });
  checkWrap.append(box);
  card.append(checkWrap);

  const body = document.createElement('div');
  body.className = 'card-body';

  const head = document.createElement('div');
  head.className = 'card-head';
  const title = document.createElement('h3');
  title.textContent = isHidden(t) ? 'Hidden story trophy' : t.name;
  head.append(title);
  const badge = document.createElement('span');
  badge.className = `badge badge-${t.grade}`;
  badge.textContent = gradeLabel(t.grade);
  head.append(badge);
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = t.kind;
  head.append(kindTag);
  if (t.missable && t.kind !== 'missable') {
    const miss = document.createElement('span');
    miss.className = 'tag tag-missable';
    miss.textContent = 'Missable';
    head.append(miss);
  }
  body.append(head);

  if (isHidden(t)) {
    const note = document.createElement('p');
    note.className = 'spoiler-note';
    note.textContent = 'Hidden story trophy — earn it to reveal its name, description and guide. Turn “Hide story spoilers” off to see it now.';
    body.append(note);
  } else {
    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = t.description;
    body.append(desc);

    const guide = document.createElement('p');
    guide.className = 'card-guide';
    guide.textContent = t.guide;
    body.append(guide);

    const metaBits = [];
    if (t.count) metaBits.push(`Needs: ${t.count}`);
    if (t.when) metaBits.push(`When: ${t.when}`);
    if (metaBits.length > 0) {
      const meta = document.createElement('p');
      meta.className = 'card-meta';
      meta.innerHTML = '';
      meta.textContent = metaBits.join(' · ');
      body.append(meta);
    }

    const src = document.createElement('p');
    src.className = 'card-sources';
    src.textContent = 'Sources: ';
    t.sources.forEach((s, i) => {
      if (i > 0) src.append(document.createTextNode(' · '));
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.name;
      a.rel = 'noopener';
      src.append(a);
    });
    body.append(src);
  }

  card.append(body);
  return card;
}

function currentFilters() {
  return {
    q: searchEl.value.trim().toLowerCase(),
    grade: gradeEl.value,
    kind: kindEl.value,
    status: statusEl.value,
  };
}

function render() {
  const f = currentFilters();
  const total = trophies.length;
  const pct = Math.round((earned.size / total) * 100);
  earnedCountEl.textContent = `${earned.size} / ${total}`;
  earnedPctEl.textContent = `${pct}%`;
  progressFillEl.style.width = `${pct}%`;
  progressBarEl.setAttribute('aria-valuenow', String(earned.size));
  progressNoteEl.textContent =
    earned.has(1)
      ? 'Platinum earned — Vice Got a Price! is yours.'
      : `Platinum: Vice Got a Price! — earn the other 54. (${total - earned.size} to go)`;

  listEl.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (f.kind === 'online') continue; // GTA VI has no online trophies
    if (f.grade !== 'all' && t.grade !== f.grade) continue;
    if (f.kind !== 'all' && t.kind !== f.kind) continue;
    if (f.status === 'earned' && !earned.has(t.id)) continue;
    if (f.status === 'not-earned' && earned.has(t.id)) continue;
    if (f.q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(f.q)) continue;
    }
    listEl.append(cardFor(t));
    shown++;
  }
  emptyEl.hidden = !(shown === 0 && f.kind !== 'online');
  onlineEmptyEl.hidden = f.kind !== 'online';
  hintEl.textContent =
    f.kind === 'online'
      ? ''
      : shown === total
        ? `Showing all ${total} trophies.`
        : `Showing ${shown} of ${total} trophies.`;
}

function showView(name) {
  for (const v of ['checklist', 'roadmap', 'sources']) {
    document.getElementById(`view-${v}`).hidden = v !== name;
    document.querySelector(`.view-tab[data-view="${v}"]`).classList.toggle('is-active', v === name);
  }
}

document.querySelectorAll('.view-tab').forEach((tab) => {
  tab.addEventListener('click', () => showView(tab.dataset.view));
});

for (const el of [searchEl, gradeEl, kindEl, statusEl, spoilerEl]) {
  el.addEventListener(el === searchEl ? 'input' : 'change', render);
}

document.getElementById('export').addEventListener('click', () => {
  const payload = { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const ids = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(ids)) throw new Error('no earned list');
    const valid = ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55);
    earned = new Set([...earned, ...valid]);
    persist();
    render();
  } catch {
    alert('That file is not a trophy-progress export from this guide.');
  }
  event.target.value = '';
});

// Deep links from the query string.
if (params.get('view') === 'roadmap' || params.get('view') === 'sources') showView(params.get('view'));
if (params.get('grade') && ['platinum', 'gold', 'silver', 'bronze'].includes(params.get('grade'))) gradeEl.value = params.get('grade');
if (params.get('kind') && ['story', 'missable', 'collectibles', 'activities', 'completion', 'online'].includes(params.get('kind'))) kindEl.value = params.get('kind');
if (params.get('status') && ['earned', 'not-earned'].includes(params.get('status'))) statusEl.value = params.get('status');
if (params.get('spoiler') === 'on') spoilerEl.checked = true;
if (params.get('spoiler') === 'off') spoilerEl.checked = false;

render();

// A ?trophy=<id> link opens that trophy's card and scrolls to it.
const focusId = Number(params.get('trophy'));
if (Number.isInteger(focusId) && focusId >= 1 && focusId <= 55) {
  const target = trophies.find((t) => t.id === focusId);
  if (target && target.hidden) spoilerEl.checked = false; // a story trophy link reveals that one
  render();
  const el = document.getElementById(`trophy-${focusId}`);
  if (el) {
    el.classList.add('is-highlight');
    el.scrollIntoView({ block: 'center' });
  }
}
