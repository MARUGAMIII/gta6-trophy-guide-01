// Leonida Legend — offline GTA VI trophy guide & tracker.
// Loads app/data/trophies.json, renders the checklist, and keeps progress in
// localStorage. No network request is made at run time besides that local file.
const EARNED_KEY = 'leonida-legend-earned-v1';
const SPOILER_KEY = 'leonida-legend-spoiler-v1';
const KIND_LABELS = {
  story: 'Story', side: 'Side quest', collectibles: 'Collectibles',
  activities: 'Activities', crime: 'Crime', misc: 'Misc',
  completion: '100% completion', platinum: 'Platinum', online: 'Online',
};
const GRADE_LABELS = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };

const listEl = document.getElementById('list');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoiler');
const hideEarnedEl = document.getElementById('hide-earned');
const emptyEl = document.getElementById('empty');
const emptyOnlineEl = document.getElementById('empty-online');
const shownCountEl = document.getElementById('shown-count');

let trophyData = null;
let earned = new Set(loadStoredIds(EARNED_KEY));
let openGuides = new Set();

function loadStoredIds(key) {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]'); } catch { return []; }
}

function saveProgress() {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort()));
}

function isHiddenFromReader(trophy) {
  return trophy.hidden && spoilerEl.checked && !earned.has(trophy.id);
}

function formatTarget(trophy) {
  if (!trophy.target) return '';
  const unit = trophy.target >= 1000 ? '$' + trophy.target.toLocaleString('en-US') : trophy.target;
  return 'Target: ' + unit + '.';
}

function sourceLinks(trophy) {
  return trophy.sources.map((key) => {
    const source = trophyData.sources[key];
    if (!source) return key;
    return source.url
      ? '<a href="' + source.url + '" target="_blank" rel="noopener">' + escapeHtml(source.name) + '</a>'
      : escapeHtml(source.name);
  }).join(' · ');
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function trophyMatchesFilters(trophy) {
  const query = searchEl.value.trim().toLowerCase();
  if (query) {
    const haystack = (trophy.name + ' ' + trophy.description + ' ' + (trophy.chapter ?? '') + ' ' + trophy.guide).toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (kindEl.value === 'missable' && !trophy.missable) return false;
  if (kindEl.value === 'online') return false;
  if (kindEl.value !== 'all' && kindEl.value !== 'missable' && trophy.kind !== kindEl.value) return false;
  if (gradeEl.value !== 'all' && trophy.grade !== gradeEl.value) return false;
  if (hideEarnedEl.checked && earned.has(trophy.id)) return false;
  return true;
}

function buildTrophyCard(trophy) {
  const li = document.createElement('li');
  const isEarned = earned.has(trophy.id);
  const hidden = isHiddenFromReader(trophy);
  li.className = 'trophy' + (isEarned ? ' earned' : '');
  li.dataset.trophyId = String(trophy.id);

  const head = document.createElement('div');
  head.className = 'trophy-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', 'Mark ' + trophy.name + ' as earned');
  box.addEventListener('change', () => toggleEarned(trophy.id, box.checked));
  const title = document.createElement('div');
  title.className = 'trophy-title';
  const name = document.createElement('div');
  name.className = 'trophy-name';
  name.textContent = hidden ? 'Hidden Trophy' : trophy.name;
  if (hidden) {
    const mark = document.createElement('span');
    mark.className = 'hidden-mark';
    mark.textContent = ' — hidden on PlayStation until earned';
    name.append(mark);
  }
  const desc = document.createElement('div');
  desc.className = 'trophy-desc';
  desc.textContent = hidden ? 'Hidden on PlayStation until earned. Tick it off once it pops to reveal it.' : trophy.description;
  const badges = document.createElement('div');
  badges.className = 'badges';
  const gradeBadge = document.createElement('span');
  gradeBadge.className = 'badge ' + trophy.grade;
  gradeBadge.textContent = GRADE_LABELS[trophy.grade];
  badges.append(gradeBadge);
  if (trophy.hidden) {
    const hiddenBadge = document.createElement('span');
    hiddenBadge.className = 'badge hidden-badge';
    hiddenBadge.textContent = 'Hidden';
    badges.append(hiddenBadge);
  }
  if (trophy.missable) {
    const missBadge = document.createElement('span');
    missBadge.className = 'badge missable';
    missBadge.textContent = '⚠ Missable';
    badges.append(missBadge);
  }
  if (trophy.kind !== 'platinum') {
    const kindBadge = document.createElement('span');
    kindBadge.className = 'badge kind';
    kindBadge.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
    badges.append(kindBadge);
  }
  title.append(name, desc, badges);
  head.append(box, title);
  li.append(head);

  if (!hidden) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'guide-toggle';
    const isOpen = openGuides.has(trophy.id);
    toggle.textContent = isOpen ? 'Hide guide ▲' : 'Show guide ▼';
    toggle.addEventListener('click', () => {
      if (openGuides.has(trophy.id)) openGuides.delete(trophy.id);
      else openGuides.add(trophy.id);
      renderTrophyList();
    });
    li.append(toggle);
    if (isOpen) {
      const guide = document.createElement('div');
      guide.className = 'guide';
      const text = document.createElement('p');
      text.textContent = trophy.guide;
      guide.append(text);
      if (trophy.target) {
        const target = document.createElement('p');
        target.className = 'target';
        target.textContent = formatTarget(trophy);
        guide.append(target);
      }
      const sources = document.createElement('p');
      sources.className = 'sources';
      sources.innerHTML = 'Sources: ' + sourceLinks(trophy);
      guide.append(sources);
      li.append(guide);
    }
  }
  return li;
}

function renderTrophyList() {
  listEl.replaceChildren();
  const visible = trophyData.trophies.filter(trophyMatchesFilters);
  for (const trophy of visible) listEl.append(buildTrophyCard(trophy));
  shownCountEl.textContent = '— showing ' + visible.length + ' of ' + trophyData.trophies.length;
  emptyEl.hidden = visible.length > 0 || kindEl.value === 'online';
  emptyOnlineEl.hidden = kindEl.value !== 'online';
  renderProgress();
}

function renderProgress() {
  const total = trophyData.trophies.length;
  const count = earned.size;
  const pct = Math.round((count / total) * 100);
  document.getElementById('progress-count').textContent = count + ' of ' + total + ' earned';
  document.getElementById('progress-pct').textContent = pct + '%';
  document.getElementById('progress-fill').style.width = pct + '%';
  const byGrade = {};
  for (const trophy of trophyData.trophies) {
    if (!earned.has(trophy.id)) continue;
    byGrade[trophy.grade] = (byGrade[trophy.grade] ?? 0) + 1;
  }
  const totals = {};
  for (const trophy of trophyData.trophies) totals[trophy.grade] = (totals[trophy.grade] ?? 0) + 1;
  document.getElementById('progress-grades').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => GRADE_LABELS[g] + ' ' + (byGrade[g] ?? 0) + '/' + totals[g]).join(' · ');
}

function renderRoadmapCounts() {
  const countKind = (kinds) => trophyData.trophies.filter((t) => kinds.includes(t.kind) && earned.has(t.id)).length;
  const totalKind = (kinds) => trophyData.trophies.filter((t) => kinds.includes(t.kind)).length;
  document.getElementById('step1-count').textContent =
    'Story trophies earned: ' + countKind(['story']) + '/' + totalKind(['story']) + ' · side quests: ' + countKind(['side']) + '/' + totalKind(['side']);
  document.getElementById('step2-count').textContent =
    'Grind trophies earned: ' + countKind(['activities', 'collectibles', 'crime', 'completion']) + '/' + totalKind(['activities', 'collectibles', 'crime', 'completion']);
  document.getElementById('step3-count').textContent =
    'Everything else earned: ' + countKind(['misc']) + '/' + totalKind(['misc']) + ' · platinum: ' + (earned.has(1) ? 'earned' : 'not yet');
}

function renderSources() {
  const list = document.getElementById('source-list');
  for (const source of Object.values(trophyData.sources)) {
    const li = document.createElement('li');
    if (source.url) {
      const a = document.createElement('a');
      a.href = source.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = source.name;
      li.append(a);
    } else {
      li.textContent = source.name;
    }
    list.append(li);
  }
}

function toggleEarned(id, checked) {
  if (checked) earned.add(id);
  else earned.delete(id);
  saveProgress();
  renderTrophyList();
  renderRoadmapCounts();
}

function exportProgress() {
  const payload = { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importProgress(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(ids)) throw new Error('No earned list in file');
    const valid = new Set(trophyData.trophies.map((t) => t.id));
    earned = new Set(ids.filter((id) => valid.has(id)));
    saveProgress();
    renderTrophyList();
    renderRoadmapCounts();
  } catch (err) {
    alert('Could not import that file: ' + err.message);
  }
}

function resetProgress() {
  if (!confirm('Clear all earned trophies?')) return;
  earned = new Set();
  openGuides = new Set();
  saveProgress();
  renderTrophyList();
  renderRoadmapCounts();
}

async function loadTrophyData() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load trophy data');
  return response.json();
}

function bindControls() {
  searchEl.addEventListener('input', renderTrophyList);
  kindEl.addEventListener('change', renderTrophyList);
  gradeEl.addEventListener('change', renderTrophyList);
  hideEarnedEl.addEventListener('change', renderTrophyList);
  spoilerEl.addEventListener('change', () => {
    localStorage.setItem(SPOILER_KEY, JSON.stringify(spoilerEl.checked));
    renderTrophyList();
  });
  document.getElementById('export').addEventListener('click', exportProgress);
  document.getElementById('import').addEventListener('change', (event) => importProgress(event.target.files[0]));
  document.getElementById('reset').addEventListener('click', resetProgress);
}

async function initGuide() {
  const storedSpoiler = localStorage.getItem(SPOILER_KEY);
  spoilerEl.checked = storedSpoiler === null ? true : JSON.parse(storedSpoiler);
  trophyData = await loadTrophyData();
  renderSources();
  bindControls();
  renderTrophyList();
  renderRoadmapCounts();
}

initGuide();
