/** Auto-migrated calculator engine from vanilla app. Progressive React rewrite target. */

// ================================================================
// CONSTANTS
// ================================================================

const ACRONYMS_DATA = [
  { abbr: 'AVF',       name: 'Absolute Volume Factor' },
  { abbr: 'BBL',       name: 'Oil Barrels (42 Gallons)' },
  { abbr: 'BPM',       name: 'Barrels Per Minute' },
  { abbr: 'cp',        name: 'Centipoise (viscosity)' },
  { abbr: 'Cum',       name: 'Cumulative Total' },
  { abbr: 'GPM',       name: 'Gallons Per Minute' },
  { abbr: 'GPT',       name: 'Gallons Per Thousand' },
  { abbr: 'Lbs',       name: 'Pounds (US Standard)' },
  { abbr: 'LGA',       name: 'Liquid Guar Additive' },
  { abbr: 'mA',        name: 'MilliAmps' },
  { abbr: 'PPA',       name: 'Pounds Proppant Added' },
  { abbr: 'PPG',       name: 'Pounds Per Gallon' },
  { abbr: 'PPM',       name: 'Pounds Per Minute' },
  { abbr: 'PPR',       name: 'Pounds Per Revolution' },
  { abbr: 'PPT',       name: 'Pounds Per Thousand' },
  { abbr: 'Prop Conc', name: 'Proppant Concentration' },
  { abbr: 'PSI',       name: 'Pounds Per Square Inch' },
  { abbr: 'RPM',       name: 'Revolutions Per Minute' },
  { abbr: 'SG',        name: 'Specific Gravity' },
  { abbr: 'TVD',       name: 'True Vertical Depth' },
];

const UNIT_CONVERSIONS_SECTION1 = [
  { unit: 'Barrel',         symbol: 'bbl',    conv: '42 gal' },
  { unit: 'Barrel',         symbol: 'bbl',    conv: '9,702 in³' },
  { unit: 'Barrel',         symbol: 'bbl',    conv: '5.6146 ft³' },
  { unit: 'Barrel',         symbol: 'bbl',    conv: '0.15899 m³' },
  { unit: 'Cubic Feet',     symbol: 'ft³',    conv: '7.48 gal' },
  { unit: 'Cubic Feet',     symbol: 'ft³',    conv: '1,728 in³' },
  { unit: 'Cubic Feet',     symbol: 'ft³',    conv: '0.1781 bbl' },
  { unit: 'Cubic Feet',     symbol: 'ft³',    conv: '0.0283 m³' },
  { unit: 'Feet',           symbol: 'ft',     conv: '12 in' },
  { unit: 'Density',        symbol: 'lbs/gal',conv: '120.05 kg/m³' },
  { unit: 'Density',        symbol: 'g/ml',   conv: '62.428 lb/ft³' },
  { unit: 'Density',        symbol: 'kg/m³',  conv: '0.00833 lbs/gal' },
  { unit: 'Concentration',  symbol: 'ppt',    conv: '0.1198 g/L' },
  { unit: 'Gallon',         symbol: 'gal',    conv: '231 in³' },
  { unit: 'Gallon',         symbol: 'gal',    conv: '0.1337 ft³' },
  { unit: 'Gallon',         symbol: 'gal',    conv: '0.0238 bbl' },
  { unit: 'Gallon',         symbol: 'gal',    conv: '0.00379 m³' },
  { unit: 'Cubic Inch',     symbol: 'in³',    conv: '0.0043 gal' },
  { unit: 'Cubic Inch',     symbol: 'in³',    conv: '0.00058 ft³' },
  { unit: 'Cubic Inch',     symbol: 'in³',    conv: '0.000103 bbl' },
  { unit: 'Cubic Meter',    symbol: 'm³',     conv: '264.17 gal' },
  { unit: 'Cubic Meter',    symbol: 'm³',     conv: '6.2898 bbl' },
  { unit: 'Cubic Meter',    symbol: 'm³',     conv: '35.315 ft³' },
  { unit: 'Weight',         symbol: 'lb',     conv: '0.45359 kg' },
  { unit: 'Weight',         symbol: 'kg',     conv: '2.2046 lbs' },
];

const UNIT_CATEGORIES = {
  Volume: {
    units: ['BBL', 'GAL', 'FT3', 'IN3', 'M3'],
    labels: { BBL:'Barrels (bbl)', GAL:'Gallons (gal)', FT3:'Cubic Feet (ft³)', IN3:'Cubic Inches (in³)', M3:'Cubic Meters (m³)' },
    toBase: { BBL: 42, GAL: 1, FT3: 7.480519, IN3: 1/231, M3: 264.172 }
  },
  Density: {
    units: ['LBS_GAL', 'G_ML', 'KG_M3', 'LBS_FT3'],
    labels: { LBS_GAL:'lbs/gal (ppg)', G_ML:'g/ml', KG_M3:'kg/m³', LBS_FT3:'lb/ft³' },
    toBase: { LBS_GAL: 1, G_ML: 8.3454, KG_M3: 1/120.05, LBS_FT3: 1/7.480519 }
  },
  Weight: {
    units: ['LB', 'KG'],
    labels: { LB:'Pounds (lb)', KG:'Kilograms (kg)' },
    toBase: { LB: 1, KG: 2.204622 }
  },
  Length: {
    units: ['FT', 'IN'],
    labels: { FT:'Feet (ft)', IN:'Inches (in)' },
    toBase: { FT: 1, IN: 1/12 }
  },
  Concentration: {
    units: ['PPT', 'G_L'],
    labels: { PPT:'PPT (lb/1000gal)', G_L:'g/L' },
    toBase: { PPT: 1, G_L: 1/0.11982 }
  }
};

const TUBULAR_DATA = [
  { type:'2.375" 4.7#',  factor:0.1624, id:1.995 },
  { type:'2.875" 6.5#',  factor:0.2431, id:2.441 },
  { type:'4.5" 11.6#',   factor:0.6528, id:4.000 },
  { type:'4.5" 12.75#',  factor:0.6392, id:3.958 },
  { type:'4.5" 13.5#',   factor:0.6269, id:3.920 },
  { type:'4.5" 15.1#',   factor:0.5972, id:3.826 },
  { type:'5.5" 17#',     factor:0.9764, id:4.892 },
  { type:'5.5" 20#',     factor:0.9314, id:4.778 },
  { type:'5.5" 23#',     factor:0.8898, id:4.670 },
  { type:'7" 23#',       factor:1.6535, id:6.366 },
  { type:'7" 26#',       factor:1.6070, id:6.276 },
  { type:'7" 29#',       factor:1.5603, id:6.184 },
  { type:'7" 32#',       factor:1.5152, id:6.094 },
];

const CH_COLORS = ['#10B981','#3B82F6','#EF4444','#F59E0B','#8B5CF6','#EC4899','#6366F1','#06B6D4','#14B8A6','#F97316'];

const RULES_OF_FOUR = [
  ['40 lb / PPT','10.0 GPT LGA'],['30 lb / PPT','7.5 GPT LGA'],
  ['24 lb / PPT','6.0 GPT LGA'],['20 lb / PPT','5.0 GPT LGA'],
  ['16 lb / PPT','4.0 GPT LGA'],['10 lb / PPT','2.5 GPT LGA'],
  ['Lb System','Visc (cp) + 4'],['Target Visc','Lb System − 4'],
];

const FIELD_CONSTANTS = [
  ['1 BBL','42 GAL = 9,702 in³ = 5.6146 ft³ = 0.15899 m³'],
  ['1 GAL','231 in³ = 0.1337 ft³ = 0.0238 bbl = 0.00379 m³'],
  ['1 FT³','7.48 gal = 1,728 in³ = 0.1781 bbl = 0.0283 m³'],
  ['1 m³','264.17 gal = 6.2898 bbl = 35.315 ft³'],
  ['1 lb / 1 kg','1 lb = 0.4536 kg | 1 kg = 2.2046 lbs'],
  ['Density: 1 ppg','120.05 kg/m³ | 1 g/ml = 62.428 lb/ft³'],
  ['Concentration: 1 ppt','0.1198 g/L'],
  ['Frac Gradient','0.865 psi/ft'],
  ['Water Density','8.33 ppg'],
  ['Sand SG (std)','2.65'],
];

const TOTE_TYPES = [
  { label:'330-gal tote',          factor:7.45 },
  { label:'550-gal Soft side',     factor:8.72 },
  { label:'560-gal Gel (S&S)',     factor:8.55 },
  { label:'750-gal Gel Tote',      factor:12.33 },
];

const HCL_TABLE = [
  [5, 8.54],[10, 8.75],[15, 8.97],[20, 9.18],[25, 9.39],[28, 9.52],[32, 9.67],
];

const PROPPANT_DATA = [
  { type:'Natural Brown Sand',       bulk:91,  sg:2.65 },
  { type:'Natural White Sand',       bulk:95,  sg:2.65 },
  { type:'Resin Coated Sand',        bulk:93,  sg:2.55 },
  { type:'Low Density Ceramic',      bulk:95,  sg:2.70 },
  { type:'Medium Density Ceramic',   bulk:108, sg:3.20 },
  { type:'High Density Ceramic',     bulk:125, sg:3.50 },
  { type:'Breaker (Enzymatic/Chem)', bulk:56,  sg:1.35 },
];

const TABS = [
  {id:'dashboard',label:'Home'},
  {id:'math',label:'Math'},
  {id:'sand',label:'Sand'},
  {id:'chem',label:'Chem'},
  {id:'hydration',label:'Hydration'},
  {id:'blender',label:'Blender'},
  {id:'lime',label:'LIME'},
  {id:'wellbore',label:'Wellbore'},
  {id:'hp',label:'HP'},
];

// Shared icons for dashboard cards + hamburger menu (same assets)
const NAV_ICON_SRC = {
  math: '/Math-icon.jpg',
  sand: '/Sand-icon.jpg',
  chem: '/Chem-icon.jpg',
  hydration: '/Hydration-icon.jpg',
  blender: '/Blender-icon.jpg',
  lime: '/Lime-icon.jpg',
  wellbore: '/Wellbore-icon.jpg',
  hp: '/Horsepower.jpg',
};

function dashCardIcon(id) {
  const src = NAV_ICON_SRC[id];
  if (!src) return '';
  return `<img src="${src}" alt="" style="height:32px;width:auto;max-width:96px;object-fit:contain;border-radius:5px;">`;
}

function sidebarIcon(id) {
  if (id === 'dashboard') return '🏠';
  const src = NAV_ICON_SRC[id];
  if (!src) return '';
  return `<img src="${src}" alt="">`;
}

const DASH_CARDS = [
  {id:'math',     label:'Math',    icon: dashCardIcon('math'),     bg:'#dbeafe', tc:'#1e40af'},
  {id:'sand',     label:'Sand',    icon: dashCardIcon('sand'),     bg:'#fef3c7', tc:'#92400e'},
  {id:'chem',     label:'Chem',    icon: dashCardIcon('chem'),     bg:'#d1fae5', tc:'#065f46'},
  {id:'hydration',label:'Hydration',icon: dashCardIcon('hydration'),bg:'#e0e7ff', tc:'#3730a3'},
  {id:'blender',  label:'Blender', icon: dashCardIcon('blender'),  bg:'#ede9fe', tc:'#5b21b6'},
  {id:'lime',     label:'LIME',    icon: dashCardIcon('lime'),     bg:'#fce7f3', tc:'#9d174d'},
  {id:'wellbore', label:'Wellbore',icon: dashCardIcon('wellbore'), bg:'#e5e7eb', tc:'#374151'},
  {id:'hp',       label:'Horsepower', icon: dashCardIcon('hp'),    bg:'#d1fae5', tc:'#065f46'},
];

const BASE_GEARS  = [[1,4.2],[2,4.9],[3,5.7],[4,6.8],[5,7.9],[6,9.3],[7,10.7]];
const EXTRA_GEARS = [[8,12.4],[9,14.6]];
const ALL_GEAR_RATES = {1:4.2,2:4.9,3:5.7,4:6.8,5:7.9,6:9.3,7:10.7,8:12.4,9:14.6};

// ================================================================
// STATE
// ================================================================

function mkState() {
  return {
    tab: 'dashboard',
    cleanRate: 0,
    stages: [{ id: 1, name: 'Stage 1', totalDesignLbs: 0, inv: [] }],
    stageIdx: 0,
    chemicals: [],
    goPumps: 14,
    goTarget: 100,
    goExtreme: false,
    wellCapRows: [],
    multiToteRows: [],
  };
}

let S = mkState();

function loadS() {
  try {
    const raw = localStorage.getItem('ampdFrac_v3');
    if (raw) S = Object.assign(mkState(), JSON.parse(raw));
  } catch(e) {}
}

function saveS() {
  try { localStorage.setItem('ampdFrac_v3', JSON.stringify(S)); } catch(e) {}
}

// ================================================================
// FAVORITES — pin tools from any page to the Home dashboard
// ================================================================

const FAVORITES_KEY = 'ampdFrac_favorites_v1';
const TAB_LABELS = {
  math: 'Math', sand: 'Sand', chem: 'Chem', hydration: 'Hydration',
  blender: 'Blender', lime: 'LIME', wellbore: 'Wellbore', hp: 'Horsepower',
  dashboard: 'Home',
};

/** @type {{id:string,label:string,tab:string}[]} */
let favorites = [];

const HEART_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       aria-hidden="true">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path class="heart heart-path"
      d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/>
  </svg>`;

function slugToolId(tab, label) {
  const s = String(label || '')
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${tab}__${s || 'tool'}`;
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data)) favorites = data.filter(f => f && f.id && f.label && f.tab);
  } catch (e) {}
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {}
}

function isFavorite(id) {
  return favorites.some(f => f.id === id);
}

function pulseHeart(btn) {
  if (!btn) return;
  btn.classList.remove('pulse');
  // reflow to restart animation
  void btn.offsetWidth;
  btn.classList.add('pulse');
  setTimeout(() => btn.classList.remove('pulse'), 650);
}

function toggleFavorite(id, label, tab, btn) {
  const idx = favorites.findIndex(f => f.id === id);
  if (idx >= 0) {
    favorites.splice(idx, 1);
  } else {
    favorites.unshift({ id, label, tab });
  }
  saveFavorites();
  syncAllHeartButtons();
  renderFavoritesPanel();
  if (btn) pulseHeart(btn);
}

function syncAllHeartButtons() {
  document.querySelectorAll('.fav-heart[data-tool-id]').forEach(btn => {
    const on = isFavorite(btn.dataset.toolId);
    btn.classList.toggle('is-fav', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.title = on ? 'Remove from favorites' : 'Add to favorites';
    btn.setAttribute('aria-label', btn.title);
  });
}

function renderFavoritesPanel() {
  const list = document.getElementById('favorites-list');
  const empty = document.getElementById('favorites-empty');
  if (!list || !empty) return;

  if (!favorites.length) {
    list.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = favorites.map(f => {
    const tabName = TAB_LABELS[f.tab] || f.tab;
    return `
      <button type="button" class="fav-item" onclick="openFavorite('${esc(f.id)}')">
        <div class="fav-item-body">
          <div class="fav-item-label">${esc(f.label)}</div>
          <div class="fav-item-tab">${esc(tabName)}</div>
        </div>
        <span class="fav-item-go">Open →</span>
      </button>`;
  }).join('');
}

function openFavorite(toolId) {
  const safeId = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(toolId) : String(toolId).replace(/"/g, '\\"');
  // Prefer the tool card (scroll target), not the heart button which also has data-tool-id
  const el = document.querySelector(`.card[data-tool-id="${safeId}"], .card-sm[data-tool-id="${safeId}"], [data-tool-id="${safeId}"]:not(.fav-heart)`);
  if (!el) {
    // Stale favorite — remove
    favorites = favorites.filter(f => f.id !== toolId);
    saveFavorites();
    renderFavoritesPanel();
    return;
  }
  const section = el.closest('.section');
  if (!section || !section.id) return;
  const tab = section.id.replace(/^s-/, '');
  nav(tab);
  requestAnimationFrame(() => {
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('tool-highlight');
      setTimeout(() => el.classList.remove('tool-highlight'), 1600);
    }, 40);
  });
}

function ensureToolFavoriteUI() {
  document.querySelectorAll('.section[id^="s-"] .tool-title').forEach(titleEl => {
    if (titleEl.closest('#favorites-card')) return;
    if (titleEl.closest('#settings-panel')) return;
    if (titleEl.dataset.favBound === '1') return;

    const section = titleEl.closest('.section');
    if (!section || section.id === 's-dashboard') return;

    // Prefer existing text content before we restructure
    let label = (titleEl.querySelector('.tool-title-text')?.textContent || titleEl.textContent || '').trim();
    label = label.replace(/\s+/g, ' ');
    if (!label || label === 'Favorites') return;

    const tab = section.id.replace(/^s-/, '');
    const toolId = slugToolId(tab, label);

    // Attach id to nearest card for scroll target
    const card = titleEl.closest('.card, .card-sm');
    if (card) {
      card.dataset.toolId = toolId;
      card.dataset.toolLabel = label;
      card.dataset.toolTab = tab;
    }

    // Restructure title to include heart (once)
    if (!titleEl.classList.contains('tool-title-with-heart')) {
      const text = label;
      titleEl.textContent = '';
      titleEl.classList.add('tool-title-with-heart');
      const span = document.createElement('span');
      span.className = 'tool-title-text';
      span.textContent = text;
      titleEl.appendChild(span);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fav-heart' + (isFavorite(toolId) ? ' is-fav' : '');
      btn.dataset.toolId = toolId;
      btn.innerHTML = HEART_SVG;
      btn.title = isFavorite(toolId) ? 'Remove from favorites' : 'Add to favorites';
      btn.setAttribute('aria-label', btn.title);
      btn.setAttribute('aria-pressed', isFavorite(toolId) ? 'true' : 'false');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(toolId, label, tab, btn);
      });
      // Hover pulse (desktop) — mirrors the Motion heart beat
      btn.addEventListener('mouseenter', () => pulseHeart(btn));
      titleEl.appendChild(btn);
    }

    titleEl.dataset.favBound = '1';
  });
  syncAllHeartButtons();
  renderFavoritesPanel();
}

// ================================================================
// SETTINGS — company profiles, logo + brand colors (this browser)
// ================================================================

const SETTINGS_KEY = 'ampdFrac_settings_v2';

const COMPANY_PROFILES = {
  default: {
    id: 'default',
    name: 'Default',
    short: 'No logo · black text · grey accents',
    logo: null,
    green: '#6C6C70', // buttons, results, accents
    blue: '#1C1C1E',  // tool titles / text emphasis
  },
  amped: {
    id: 'amped',
    name: 'Amped Energy Solutions',
    short: 'Green titles/labels · blue buttons, fields & results',
    logo: '/new-amped-logo.png',
    green: '#2DC76D',
    blue: '#2D7AC7',
  },
  liberty: {
    id: 'liberty',
    name: 'Liberty Energy',
    short: 'Red titles/buttons · black numbers',
    logo: '/liberty-logo.png',
    green: '#E32400',
    blue: '#1C1C1E', // field numbers & calculator results
  },
};

const DEFAULT_PROFILE_ID = 'default';

const THEME = {
  profileId: DEFAULT_PROFILE_ID,
  logoDataUrl: null, // custom upload; null = use selected profile logo (or none)
  green: COMPANY_PROFILES.default.green,
  blue: COMPANY_PROFILES.default.blue,
};

function getActiveProfile() {
  return COMPANY_PROFILES[THEME.profileId] || COMPANY_PROFILES[DEFAULT_PROFILE_ID];
}

/** Effective logo URL, or null when the profile has no logo and no custom upload. */
function profileLogoSrc() {
  if (THEME.logoDataUrl) return THEME.logoDataUrl;
  const logo = getActiveProfile().logo;
  return logo || null;
}

function normalizeHex(hex) {
  if (!hex) return null;
  let h = String(hex).trim();
  if (!h.startsWith('#')) h = '#' + h;
  if (/^#[0-9A-Fa-f]{3}$/.test(h)) {
    h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(h)) return null;
  return h.toUpperCase();
}

function hexToRgb(hex) {
  const h = normalizeHex(hex);
  if (!h) return null;
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  };
}

function rgbaFromHex(hex, a) {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${a})`;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
}

function darkenHex(hex, factor = 0.85) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const d = (n) => Math.max(0, Math.min(255, Math.round(n * factor)));
  return '#' + [d(rgb.r), d(rgb.g), d(rgb.b)].map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function loadSettings() {
  try {
    // Prefer v2; migrate v1 if needed
    let raw = localStorage.getItem(SETTINGS_KEY);
    let data = raw ? JSON.parse(raw) : null;
    if (!data) {
      const legacy = localStorage.getItem('ampdFrac_settings_v1');
      if (legacy) data = JSON.parse(legacy);
    }
    if (!data) return;

    if (data.profileId && COMPANY_PROFILES[data.profileId]) {
      THEME.profileId = data.profileId;
    }
    if (data.logoDataUrl) THEME.logoDataUrl = data.logoDataUrl;
    if (normalizeHex(data.green)) THEME.green = normalizeHex(data.green);
    if (normalizeHex(data.blue)) THEME.blue = normalizeHex(data.blue);

    // Legacy saves without a profile: treat as Amped if they used Amped colors/logo
    if (!data.profileId && (data.green || data.blue || data.logoDataUrl)) {
      THEME.profileId = 'amped';
    }
  } catch (e) {}
}

function saveSettings() {
  const payload = {
    profileId: THEME.profileId,
    logoDataUrl: THEME.logoDataUrl,
    green: THEME.green,
    blue: THEME.blue,
  };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
  } catch (e) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        profileId: THEME.profileId,
        logoDataUrl: null,
        green: THEME.green,
        blue: THEME.blue,
      }));
      alert('Logo is too large to save in this browser. Profile and colors were saved; try a smaller image.');
    } catch (e2) {}
  }
}

function renderProfileList() {
  const host = document.getElementById('settings-profile-list');
  if (!host) return;
  // Keep a stable order: Default → Amped → Liberty → any future profiles
  const order = ['default', 'amped', 'liberty'];
  const profiles = [
    ...order.map(id => COMPANY_PROFILES[id]).filter(Boolean),
    ...Object.values(COMPANY_PROFILES).filter(p => !order.includes(p.id)),
  ];
  host.innerHTML = profiles.map(p => {
    const active = THEME.profileId === p.id;
    const logoHtml = p.logo
      ? `<img src="${p.logo}" alt="">`
      : 'None';
    return `
      <button type="button" class="profile-card${active ? ' active' : ''}" onclick="selectCompanyProfile('${p.id}')" aria-pressed="${active}">
        <div class="profile-card-logo${p.logo ? '' : ' empty'}">${logoHtml}</div>
        <div class="profile-card-meta">
          <div class="profile-card-name">${p.name}</div>
          <div class="profile-card-sub">${p.short}</div>
        </div>
        <div class="profile-swatches" aria-hidden="true">
          <span class="profile-swatch-dot" style="background:${p.green}"></span>
          <span class="profile-swatch-dot" style="background:${p.blue}"></span>
        </div>
        <div class="profile-check">${active ? '✓' : ''}</div>
      </button>`;
  }).join('');
}

function selectCompanyProfile(id) {
  const profile = COMPANY_PROFILES[id];
  if (!profile) return;
  THEME.profileId = id;
  THEME.logoDataUrl = null; // use company logo
  THEME.green = profile.green;
  THEME.blue = profile.blue;
  const file = document.getElementById('settings-logo-file');
  if (file) file.value = '';
  applySettings();
  saveSettings();
}

/** Copy for Settings → Brand Colors (what each picker controls for the active profile). */
function getColorRoleCopy() {
  const name = getActiveProfile().name;
  if (THEME.profileId === 'amped') {
    return {
      note: `Active profile: ${name}. Color A and Color B control different parts of the UI.`,
      greenLabel: 'Color A — titles & labels',
      greenHelp: 'Changes: page titles, tool card titles, field labels, and section subtitles.',
      blueLabel: 'Color B — numbers, buttons & results',
      blueHelp: 'Changes: all numbers in input fields, calculator result values, primary buttons, toggles, progress bars, and focus highlights.',
      footer: 'Amped uses two roles: Color A for text headings/labels, Color B for interactive accents and every numeric value.',
    };
  }
  if (THEME.profileId === 'liberty') {
    return {
      note: `Active profile: ${name}. Color A is Liberty red; Color B defaults to black for numbers.`,
      greenLabel: 'Color A — titles, labels & buttons',
      greenHelp: 'Changes: page titles, tool titles, field labels, primary buttons, toggles, and focus highlights.',
      blueLabel: 'Color B — numbers & results',
      blueHelp: 'Changes: all numbers typed in fields and calculator result values (including decimals). Default is black (#1C1C1E).',
      footer: 'Reset restores Color A to Liberty red (#E32400) and Color B to black (#1C1C1E).',
    };
  }
  // default + any future neutral profiles
  return {
    note: `Active profile: ${name}. Neutral theme — both colors default to black/grey for a clean, unbranded look.`,
    greenLabel: 'Color A — titles, labels & buttons',
    greenHelp: 'Changes: page titles, tool titles, field labels, primary buttons, toggles, and focus highlights.',
    blueLabel: 'Color B — numbers & results',
    blueHelp: 'Changes: all numbers typed in fields and calculator result values (including decimals).',
    footer: 'Reset restores this profile’s default neutral colors. Logo stays off unless you upload one.',
  };
}

function updateColorRoleHelp() {
  const copy = getColorRoleCopy();
  const set = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  set('settings-color-profile-note', copy.note);
  set('settings-green-label', copy.greenLabel);
  set('settings-green-help', copy.greenHelp);
  set('settings-blue-label', copy.blueLabel);
  set('settings-blue-help', copy.blueHelp);
  set('settings-color-footer-hint', copy.footer);

  const gSw = document.getElementById('settings-green-swatch');
  const bSw = document.getElementById('settings-blue-swatch');
  if (gSw) gSw.title = copy.greenLabel;
  if (bSw) bSw.title = copy.blueLabel;
}

function applyThemeColors() {
  const root = document.documentElement;
  const profile = getActiveProfile();
  const green = THEME.green || profile.green;
  const blue = THEME.blue || profile.blue;

  // Primary UI brand (buttons, result highlights, focus rings, etc.)
  // Amped uses blue for those accents; titles/labels stay green separately.
  const brandAccent = THEME.profileId === 'amped' ? blue : green;

  root.style.setProperty('--brand', brandAccent);
  root.style.setProperty('--brand-hover', darkenHex(brandAccent, 0.85));
  root.style.setProperty('--brand-dim', rgbaFromHex(brandAccent, 0.12));
  root.style.setProperty('--brand-dim2', rgbaFromHex(brandAccent, 0.06));
  root.style.setProperty('--brand-shadow', rgbaFromHex(brandAccent, 0.30));
  root.style.setProperty('--brand-blue', blue);
  root.style.setProperty('--brand-blue-dim', rgbaFromHex(blue, 0.12));
  root.style.setProperty('--blue', blue);

  // Amped: titles + labels = green; ALL numbers = blue
  // Default: black titles/labels/numbers
  // Liberty: titles/labels/buttons = red (Color A); numbers/results = black (Color B)
  let numberColor = blue;
  if (THEME.profileId === 'amped') {
    root.style.setProperty('--title-color', green);
    root.style.setProperty('--label-color', green);
    numberColor = blue; // #2D7AC7
  } else if (THEME.profileId === 'default') {
    root.style.setProperty('--title-color', blue);
    root.style.setProperty('--label-color', blue);
    numberColor = blue; // black
  } else {
    // liberty (+ similar brands)
    root.style.setProperty('--title-color', green);
    root.style.setProperty('--label-color', green);
    numberColor = blue; // black for Liberty default
  }
  root.style.setProperty('--field-value-color', numberColor);
  root.style.setProperty('--number-color', numberColor);

  const gHex = document.getElementById('settings-green-hex');
  const gSw = document.getElementById('settings-green-swatch');
  const bHex = document.getElementById('settings-blue-hex');
  const bSw = document.getElementById('settings-blue-swatch');
  if (gHex && document.activeElement !== gHex) gHex.value = green;
  if (gSw) gSw.value = green;
  if (bHex && document.activeElement !== bHex) bHex.value = blue;
  if (bSw) bSw.value = blue;

  updateColorRoleHelp();
}

function applyLogo() {
  const src = profileLogoSrc();
  document.querySelectorAll('img.app-logo').forEach(img => {
    if (!src) {
      img.setAttribute('data-empty', '1');
      img.removeAttribute('src');
      img.alt = '';
    } else {
      img.removeAttribute('data-empty');
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
      img.alt = 'Company logo';
    }
  });

  const previewWrap = document.querySelector('.settings-logo-preview');
  if (previewWrap) {
    const ph = previewWrap.querySelector('.logo-empty-label');
    if (!src) {
      previewWrap.classList.add('empty');
      if (ph) ph.style.display = '';
    } else {
      previewWrap.classList.remove('empty');
      if (ph) ph.style.display = 'none';
    }
  }
}

function applySettings() {
  applyThemeColors();
  applyLogo();
  renderProfileList();
}

function openSettings() {
  closeMenu();
  document.getElementById('settings-overlay').classList.add('open');
  document.getElementById('settings-panel').classList.add('open');
  document.getElementById('settings-panel').setAttribute('aria-hidden', 'false');
  applySettings();
}

function closeSettings() {
  document.getElementById('settings-overlay').classList.remove('open');
  document.getElementById('settings-panel').classList.remove('open');
  document.getElementById('settings-panel').setAttribute('aria-hidden', 'true');
}

function onColorPick(which, value) {
  const hex = normalizeHex(value);
  if (!hex) return;
  if (which === 'green') THEME.green = hex;
  else THEME.blue = hex;
  applyThemeColors();
  saveSettings();
}

function onColorHexInput(which, value) {
  const hex = normalizeHex(value);
  if (!hex) return;
  if (which === 'green') THEME.green = hex;
  else THEME.blue = hex;
  applyThemeColors();
  saveSettings();
}

function resetThemeColors() {
  const p = getActiveProfile();
  THEME.green = p.green;
  THEME.blue = p.blue;
  applyThemeColors();
  saveSettings();
}

function resetLogo() {
  THEME.logoDataUrl = null;
  applyLogo();
  saveSettings();
  const file = document.getElementById('settings-logo-file');
  if (file) file.value = '';
}

function resizeImageToDataUrl(file, maxEdge = 900, quality = 0.88) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image'));
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxEdge / Math.max(width, height));
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = (file.type === 'image/png') || (file.type === 'image/svg+xml');
        try {
          if (isPng) resolve(canvas.toDataURL('image/png'));
          else resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (err) {
          resolve(reader.result);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function onLogoFileSelected(ev) {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('Please choose an image file (PNG, JPG, etc.).');
    return;
  }
  try {
    if (file.type === 'image/svg+xml' || file.size < 180000) {
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      THEME.logoDataUrl = dataUrl;
    } else {
      THEME.logoDataUrl = await resizeImageToDataUrl(file);
    }
    applyLogo();
    saveSettings();
  } catch (err) {
    console.error(err);
    alert('Could not load that image. Try another file.');
  }
}

// ================================================================
// FORMULAS
// ================================================================

const F = {
  n: (n, d=2) => isFinite(n) ? n.toFixed(d) : '–',
  c: n => isFinite(n) ? Math.round(n).toLocaleString() : '–',
  circleArea:    d      => Math.PI * (d/2) * (d/2),
  cylVol:        (d,l)  => F.circleArea(d) * l,
  avf:           (sg,wd=8.33) => sg>0&&wd>0 ? 1/(sg*wd) : 0,
  slurryYield:   (ppa,avf) => ppa*avf+1,
  gpm:           (rate,gpt,fa=1) => rate*0.042*gpt*fa,
  hydrostatic:   (dens,tvd) => dens*tvd*0.05195,
  flushVol:      (depth,id) => 0.0009714*id*id*depth,
  bhp:           (t,h,f)  => t+h-f,
  hhp:           (rate,psi) => (rate*psi)/40.8,
  ironVel:       (rateBPM,idIn) => {
    if (idIn <= 0) return 0;
    const aFt2 = Math.PI * Math.pow(idIn/24, 2);
    const rFt3s = rateBPM * 5.6146 / 60;
    return rFt3s / aFt2;
  },
  convertUnit: (val, cat, from, to) => {
    const category = UNIT_CATEGORIES[cat] || UNIT_CATEGORIES.Volume;
    const baseFrom = category.toBase[from] || 1;
    const baseTo = category.toBase[to] || 1;
    return val * baseFrom / baseTo;
  },
  convert: (val, from, to) => {
    const g = {BBL:42,GAL:1,FT3:7.48};
    return val * (g[from]||1) / (g[to]||1);
  },
};

// ================================================================
// NAV
// ================================================================

function openMenu() {
  closeSettings();
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('open');
}
function closeMenu() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

function nav(tab) {
  S.tab = tab;
  closeMenu();
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('s-' + tab);
  if (el) el.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  window.scrollTo(0,0);
  saveS();
}

function buildNav() {
  // Sidebar nav — same icons as dashboard cards
  document.getElementById('sidebar-nav').innerHTML = TABS.map(t =>
    `<button class="tab-btn${t.id===S.tab?' active':''}" data-tab="${t.id}" onclick="nav('${t.id}')">
       <span class="snav-icon">${sidebarIcon(t.id)}</span><span class="snav-label">${t.label}</span>
     </button>`
  ).join('');

  // Dashboard grid
  document.getElementById('dash-grid').innerHTML = DASH_CARDS.map(c =>
    `<div class="nav-card" onclick="nav('${c.id}')">
       <div class="nav-card-icon">${c.icon}</div>
       <div class="nav-card-label">${c.label}</div>
     </div>`
  ).join('');

  // Tubular picker
  const sel = document.getElementById('wb-tubular');
  sel.innerHTML = TUBULAR_DATA.map(t => `<option value="${t.type}">${t.type}</option>`).join('');
  sel.value = '5.5" 20#';

  // Rules of Four
  document.getElementById('rof-grid').innerHTML = RULES_OF_FOUR.map(([l,v]) =>
    `<div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:10px;padding:10px;text-align:center;">
       <div class="lbl lbl-blue" style="margin-bottom:4px;">${l}</div>
       <div class="font-display" style="font-size:15px;font-weight:900;color:var(--blue);">${v}</div>
     </div>`
  ).join('');

  // Field constants
  document.getElementById('const-tbody').innerHTML = FIELD_CONSTANTS.map(([k,v]) =>
    `<tr>
       <td style="padding:9px 4px;font-size:13px;font-weight:600;border-bottom:1px solid var(--border);">${k}</td>
       <td style="padding:9px 4px;font-size:13px;font-weight:900;color:var(--brand);text-align:right;border-bottom:1px solid var(--border);font-family:'Space Grotesk',sans-serif;">${v}</td>
     </tr>`
  ).join('');

  // Casing capacity factors (reuses TUBULAR_DATA)
  document.getElementById('casing-tbody').innerHTML = TUBULAR_DATA.map(t =>
    `<tr>
       <td style="padding:9px 4px;font-size:13px;font-weight:600;border-bottom:1px solid var(--border);">${t.type}</td>
       <td class="tbl-right" style="padding:9px 4px;font-size:13px;border-bottom:1px solid var(--border);font-family:monospace;">${t.id.toFixed(3)}</td>
       <td class="tbl-right" style="padding:9px 4px;font-size:13px;font-weight:900;color:var(--brand);border-bottom:1px solid var(--border);font-family:monospace;">${t.factor.toFixed(4)}</td>
     </tr>`
  ).join('');

  // Tote type selects
  const toteOpts = TOTE_TYPES.map(t => `<option value="${t.factor}">${t.label} (${t.factor})</option>`).join('');
  document.getElementById('tote-type').innerHTML = toteOpts;
  document.getElementById('endstrap-type').innerHTML = toteOpts;

  // Tote capacity factors reference table
  document.getElementById('totetype-tbody').innerHTML = TOTE_TYPES.map(t =>
    `<tr>
       <td style="padding:9px 4px;font-size:13px;font-weight:600;border-bottom:1px solid var(--border);">${t.label}</td>
       <td class="tbl-right" style="padding:9px 4px;font-size:13px;font-weight:900;color:var(--brand);border-bottom:1px solid var(--border);font-family:monospace;">${t.factor}</td>
     </tr>`
  ).join('');

  // HCL % by mass density reference table
  document.getElementById('hcltable-tbody').innerHTML = HCL_TABLE.map(([pct,dens]) =>
    `<tr>
       <td style="padding:9px 4px;font-size:13px;font-weight:600;border-bottom:1px solid var(--border);">${pct}%</td>
       <td class="tbl-right" style="padding:9px 4px;font-size:13px;font-weight:900;color:var(--brand);border-bottom:1px solid var(--border);font-family:monospace;">${dens}</td>
     </tr>`
  ).join('');

  // Proppant properties reference table
  document.getElementById('proppant-tbody').innerHTML = PROPPANT_DATA.map(p =>
    `<tr>
       <td style="padding:9px 4px;font-size:13px;font-weight:600;border-bottom:1px solid var(--border);">${p.type}</td>
       <td class="tbl-right" style="padding:9px 4px;font-size:13px;border-bottom:1px solid var(--border);font-family:monospace;">${p.bulk}</td>
       <td class="tbl-right" style="padding:9px 4px;font-size:13px;font-weight:900;color:var(--brand);border-bottom:1px solid var(--border);font-family:monospace;">${p.sg.toFixed(2)}</td>
     </tr>`
  ).join('');
}

// ================================================================
// DASHBOARD
// ================================================================

// ================================================================
// MATH
// ================================================================

let circleMode = 'd';

function setCircleMode(mode) {
  circleMode = mode;
  document.getElementById('circ-mode-d').classList.toggle('sel', mode === 'd');
  document.getElementById('circ-mode-r').classList.toggle('sel', mode === 'r');
  document.getElementById('circ-lbl').textContent = mode === 'd' ? 'Diameter (IN)' : 'Radius (IN)';
  renderMath();
}

function renderAcronyms() {
  const query = (document.getElementById('acronym-search')?.value || '').toLowerCase().trim();
  const grid = document.getElementById('acronyms-grid');
  if (!grid) return;
  const filtered = ACRONYMS_DATA.filter(a =>
    a.abbr.toLowerCase().includes(query) || a.name.toLowerCase().includes(query)
  );
  if (!filtered.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;padding:12px;text-align:center;color:var(--text2);font-size:13px;">No acronyms matching "${esc(query)}"</div>`;
    return;
  }
  grid.innerHTML = filtered.map(a => `
    <div class="surface-card flex justify-between items-center" style="padding:8px 12px;">
      <span class="font-display" style="font-size:14px;font-weight:900;color:var(--brand);">${a.abbr}</span>
      <span style="font-size:12px;font-weight:600;color:var(--text);text-align:right;">${a.name}</span>
    </div>
  `).join('');
}

function renderUnitConversionsTable() {
  const query = (document.getElementById('unitref-search')?.value || '').toLowerCase().trim();
  const tbody = document.getElementById('unitref-tbody');
  if (!tbody) return;
  const filtered = UNIT_CONVERSIONS_SECTION1.filter(u =>
    u.unit.toLowerCase().includes(query) ||
    u.symbol.toLowerCase().includes(query) ||
    u.conv.toLowerCase().includes(query)
  );
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;padding:12px;color:var(--text2);font-size:13px;">No conversions found for "${esc(query)}"</td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map(u => `
    <tr>
      <td style="padding:8px 4px;font-size:13px;font-weight:600;border-bottom:1px solid var(--border);">${u.unit}</td>
      <td style="padding:8px 4px;font-size:13px;font-weight:700;color:var(--text2);text-align:center;border-bottom:1px solid var(--border);font-family:monospace;">${u.symbol}</td>
      <td class="tbl-right" style="padding:8px 4px;font-size:13px;font-weight:900;color:var(--brand);border-bottom:1px solid var(--border);font-family:'Space Grotesk',sans-serif;">${u.conv}</td>
    </tr>
  `).join('');
}

function updateConvUnits() {
  const catKey = document.getElementById('conv-cat')?.value || 'Volume';
  const cat = UNIT_CATEGORIES[catKey] || UNIT_CATEGORIES.Volume;
  const fromSel = document.getElementById('conv-from');
  const toSel = document.getElementById('conv-to');
  if (!fromSel || !toSel) return;

  const currentFrom = fromSel.value;
  const currentTo = toSel.value;

  fromSel.innerHTML = cat.units.map(u => `<option value="${u}">${cat.labels[u]}</option>`).join('');
  toSel.innerHTML = cat.units.map(u => `<option value="${u}">${cat.labels[u]}</option>`).join('');

  if (cat.units.includes(currentFrom)) fromSel.value = currentFrom;
  else fromSel.value = cat.units[0];

  if (cat.units.includes(currentTo)) toSel.value = currentTo;
  else toSel.value = cat.units[1] || cat.units[0];

  renderMath();
}

function toggleCustomHoseSize() {
  const sz = document.getElementById('hosecalc-size')?.value;
  const wrap = document.getElementById('hosecalc-custom-wrap');
  if (wrap) wrap.style.display = sz === 'custom' ? 'block' : 'none';
  renderMath();
}

function renderMath() {
  const val = parseFloat(document.getElementById('conv-val')?.value) || 0;
  const cat = document.getElementById('conv-cat')?.value || 'Volume';
  const fr = document.getElementById('conv-from')?.value;
  const to = document.getElementById('conv-to')?.value;
  const res = F.convertUnit(val, cat, fr, to);
  if (document.getElementById('conv-result')) document.getElementById('conv-result').textContent = res.toFixed(4);

  const catObj = UNIT_CATEGORIES[cat] || UNIT_CATEGORIES.Volume;
  const toLabel = (catObj.labels[to] || to || '').split(' ')[0];
  if (document.getElementById('conv-to-lbl')) document.getElementById('conv-to-lbl').textContent = toLabel;

  const gal = parseFloat(document.getElementById('bblgal-gal')?.value) || 0;
  if (document.getElementById('bblgal-bbl')) document.getElementById('bblgal-bbl').textContent = (gal/42).toFixed(2);

  // Force on an area
  const fPsi = parseFloat(document.getElementById('force-psi')?.value) || 0;
  const fArea = parseFloat(document.getElementById('force-area')?.value) || 0;
  const fLbs = fPsi * fArea;
  if (document.getElementById('force-lbs')) document.getElementById('force-lbs').textContent = F.c(fLbs);
  if (document.getElementById('force-kips')) document.getElementById('force-kips').textContent = (fLbs / 1000).toFixed(2);

  // Fluid velocity in a pipe
  const vRate = parseFloat(document.getElementById('velpipe-rate')?.value) || 0;
  const vId = parseFloat(document.getElementById('velpipe-id')?.value) || 0;
  const fps = F.ironVel(vRate, vId);
  if (document.getElementById('velpipe-fps')) document.getElementById('velpipe-fps').textContent = fps.toFixed(2);
  if (document.getElementById('velpipe-fpm')) document.getElementById('velpipe-fpm').textContent = F.c(fps * 60);

  // Hose volume calculator
  const hoseSz = document.getElementById('hosecalc-size')?.value || '4';
  const hoseLen = parseFloat(document.getElementById('hosecalc-len')?.value) || 0;
  let factor = 0.6528;
  if (hoseSz === '1') factor = 0.0408;
  else if (hoseSz === '2') factor = 0.1632;
  else if (hoseSz === '4') factor = 0.6528;
  else if (hoseSz === '8') factor = 2.6100;
  else if (hoseSz === 'custom') {
    const custId = parseFloat(document.getElementById('hosecalc-id')?.value) || 0;
    const custArea = Math.PI * Math.pow(custId/2, 2);
    factor = (custArea * 12) / 231;
  }
  const hGal = factor * hoseLen;
  if (document.getElementById('hosecalc-gal')) document.getElementById('hosecalc-gal').textContent = hGal.toFixed(2);
  if (document.getElementById('hosecalc-bbl')) document.getElementById('hosecalc-bbl').textContent = (hGal / 42).toFixed(2);

  const rl = parseFloat(document.getElementById('rect-len')?.value) || 0;
  const rh = parseFloat(document.getElementById('rect-h')?.value)   || 0;
  const rectIn2 = rl * rh;
  if (document.getElementById('rect-in2')) document.getElementById('rect-in2').textContent = F.c(rectIn2);
  if (document.getElementById('rect-ft2')) document.getElementById('rect-ft2').textContent = (rectIn2/144).toFixed(2);

  const cd = parseFloat(document.getElementById('circ-d')?.value) || 0;
  const circleRadius = circleMode === 'r' ? cd : cd / 2;
  const circleArea = circleMode === 'r' ? Math.PI * cd * cd : F.circleArea(cd);
  if (document.getElementById('circ-radius')) document.getElementById('circ-radius').textContent = circleRadius.toFixed(4);
  if (document.getElementById('circ-area')) document.getElementById('circ-area').textContent = circleArea.toFixed(4);

  const tl = parseFloat(document.getElementById('tank-l')?.value) || 0;
  const tw = parseFloat(document.getElementById('tank-w')?.value) || 0;
  const th = parseFloat(document.getElementById('tank-h')?.value) || 0;
  const tankIn3 = tl * tw * th;
  const tankGal = tankIn3 / 231;
  if (document.getElementById('tank-in3')) document.getElementById('tank-in3').textContent = F.c(tankIn3);
  if (document.getElementById('tank-gal')) document.getElementById('tank-gal').textContent = tankGal.toFixed(2);
  if (document.getElementById('tank-bbl')) document.getElementById('tank-bbl').textContent = (tankGal/42).toFixed(2);

  const cyld = parseFloat(document.getElementById('cyl-d')?.value) || 0;
  const cyll = parseFloat(document.getElementById('cyl-l')?.value) || 0;
  const cv   = F.cylVol(cyld, cyll);
  if (document.getElementById('cyl-in3')) document.getElementById('cyl-in3').textContent = cv.toFixed(4);
  if (document.getElementById('cyl-ft3')) document.getElementById('cyl-ft3').textContent = (cv/1728).toFixed(6);
  if (document.getElementById('cyl-gal')) document.getElementById('cyl-gal').textContent = (cv/231).toFixed(4);
  if (document.getElementById('cyl-bbl')) document.getElementById('cyl-bbl').textContent = (cv/231/42).toFixed(4);

  const cfBbl = parseFloat(document.getElementById('capfac-bbl')?.value) || 0;
  const cfFt  = parseFloat(document.getElementById('capfac-ft')?.value)  || 0;
  if (document.getElementById('capfac-result')) document.getElementById('capfac-result').textContent = cfFt > 0 ? ((cfBbl*42)/cfFt).toFixed(4) : '0.0000';
}

// Capacity: BBL/FT = ID² / 1029.44 ; GAL/FT = ID² / 24.51 (chart factors are gal/ft)
function wellCapFromId(idIn) {
  const id = parseFloat(idIn) || 0;
  if (id <= 0) return { bblPerFt: 0, galPerFt: 0 };
  const bblPerFt = (id * id) / 1029.44;
  return { bblPerFt, galPerFt: bblPerFt * 42 };
}

function wellCapNormalizeRow(row) {
  // Migrate legacy rows that stored chart gal/ft in bblPerFt
  if (row.galPerFt == null && row.bblPerFt != null && row.tubular && row.tubular !== 'custom') {
    const t = TUBULAR_DATA.find(x => x.type === row.tubular);
    if (t && Math.abs(row.bblPerFt - t.factor) < 1e-6) {
      row.galPerFt = t.factor;
      row.bblPerFt = t.factor / 42;
      row.idIn = t.id;
    }
  }
  if (row.galPerFt == null && row.bblPerFt != null) {
    // If value looks like gal/ft (> ~0.1), convert; else treat as bbl/ft
    if (row.bblPerFt > 0.1) {
      row.galPerFt = row.bblPerFt;
      row.bblPerFt = row.bblPerFt / 42;
    } else {
      row.galPerFt = row.bblPerFt * 42;
    }
  }
  if (row.idIn == null) row.idIn = 0;
  if (row.odIn == null) row.odIn = 0;
  if (row.label == null) row.label = '';
  if (row.manualFactor == null) row.manualFactor = false;
  return row;
}

function wellCapRowHTML(row, i) {
  row = wellCapNormalizeRow(row);
  const isCustom = row.tubular === 'custom';
  const chartOpts = TUBULAR_DATA.map((t, ti) =>
    `<option value="${ti}"${row.tubular === t.type ? ' selected' : ''}>${t.type} — ${t.factor.toFixed(4)} gal/ft (ID ${t.id})</option>`
  ).join('');
  const depthVal = row.depth === 0 || row.depth == null ? '' : row.depth;
  const odVal = row.odIn === 0 || row.odIn == null ? '' : row.odIn;
  const idVal = row.idIn === 0 || row.idIn == null ? '' : row.idIn;
  const secBbl = ((row.depth || 0) * (row.bblPerFt || 0)).toFixed(2);
  const secGal = F.c((row.depth || 0) * (row.galPerFt || 0));
  return `
    <div class="wellcap-section" data-wellcap-idx="${i}">
      <div class="wellcap-section-top">
        <div class="wellcap-section-label">Section ${i + 1}</div>
        <button type="button" class="btn-danger" onclick="wellCapDel(${i})" title="Remove section" aria-label="Remove section">✕</button>
      </div>
      <div class="wellcap-fields">
        <div class="field-block">
          <label class="lbl">Section Depth / Length (FT)</label>
          <input type="number" class="field" data-field="depth" value="${depthVal}" oninput="wellCapUpdate(${i},'depth',this.value)" placeholder="0">
        </div>
        <div class="field-block">
          <label class="lbl">Casing (Chart or Custom)</label>
          <select class="field" data-field="tubular" onchange="wellCapUpdate(${i},'tubular',this.value)">
            <option value="custom"${isCustom ? ' selected' : ''}>Custom casing (enter OD / ID)</option>
            ${chartOpts}
          </select>
        </div>
        <div class="grid-2" data-wellcap-dims style="${isCustom ? '' : 'opacity:0.9;'}">
          <div class="field-block">
            <label class="lbl">Outer Diam OD (IN)${isCustom ? '' : ' — chart'}</label>
            <input type="number" class="field" data-field="odIn" step="any" value="${odVal}"
              oninput="wellCapUpdate(${i},'odIn',this.value)" placeholder="${isCustom ? 'e.g. 5.500' : '—'}" ${isCustom ? '' : 'readonly'}>
          </div>
          <div class="field-block">
            <label class="lbl">Inner Diam ID (IN)${isCustom ? ' — required' : ''}</label>
            <input type="number" class="field" data-field="idIn" step="any" value="${idVal}"
              oninput="wellCapUpdate(${i},'idIn',this.value)" placeholder="${isCustom ? 'e.g. 4.778' : '—'}" ${isCustom ? '' : 'readonly'}>
          </div>
        </div>
        <div class="field-block" data-wellcap-label-wrap style="${isCustom ? '' : 'display:none;'}">
          <label class="lbl">Custom Label (optional)</label>
          <input type="text" class="field" data-field="label" value="${esc(row.label || '')}"
            oninput="wellCapUpdate(${i},'label',this.value)" placeholder='e.g. 5.5" 20# special'>
        </div>
        <div class="grid-2">
          <div class="field-block">
            <label class="lbl">Capacity (GAL/FT)</label>
            <input type="number" class="field" data-field="galPerFt" step="any" value="${row.galPerFt ? Number(row.galPerFt).toFixed(4) : ''}"
              oninput="wellCapUpdate(${i},'galPerFt',this.value)" placeholder="0">
          </div>
          <div class="field-block">
            <label class="lbl">Capacity (BBL/FT)</label>
            <input type="number" class="field" data-field="bblPerFt" step="any" value="${row.bblPerFt ? Number(row.bblPerFt).toFixed(4) : ''}"
              oninput="wellCapUpdate(${i},'bblPerFt',this.value)" placeholder="0">
          </div>
        </div>
        <div class="tile wellcap-section-vol">
          <div class="lbl">Section Volume</div>
          <div class="val" style="color:var(--brand);" data-wellcap-vol>
            <span>${secBbl}</span> <span class="unit">BBL</span>
            <span class="wellcap-gal-side">${secGal} GAL</span>
          </div>
        </div>
      </div>
    </div>`;
}

function wellCapUpdateTotals() {
  let totalBbl = 0;
  let totalGal = 0;
  S.wellCapRows.forEach(r => {
    totalBbl += (r.depth || 0) * (r.bblPerFt || 0);
    totalGal += (r.depth || 0) * (r.galPerFt || 0);
  });
  if (totalGal > 0 && totalBbl === 0) totalBbl = totalGal / 42;
  if (document.getElementById('wellcap-gal')) {
    document.getElementById('wellcap-gal').textContent = F.c(totalGal > 0 ? totalGal : totalBbl * 42);
  }
  if (document.getElementById('wellcap-bbl')) {
    document.getElementById('wellcap-bbl').textContent = totalBbl.toFixed(2);
  }
}

/** Update section volume tile + totals without rebuilding inputs (keeps focus while typing). */
function wellCapSoftUpdate(i, activeField) {
  const row = S.wellCapRows[i];
  if (!row) return;
  const card = document.querySelector(`[data-wellcap-idx="${i}"]`);
  if (!card) {
    renderWellCap();
    return;
  }

  const setIfNotFocused = (field, value) => {
    const el = card.querySelector(`[data-field="${field}"]`);
    if (!el || document.activeElement === el) return;
    el.value = value;
  };

  // Keep linked capacity fields in sync when derived from ID or the other unit
  if (activeField === 'idIn' && !row.manualFactor) {
    setIfNotFocused('galPerFt', row.galPerFt ? row.galPerFt.toFixed(4) : '');
    setIfNotFocused('bblPerFt', row.bblPerFt ? row.bblPerFt.toFixed(4) : '');
  } else if (activeField === 'galPerFt') {
    setIfNotFocused('bblPerFt', row.bblPerFt ? row.bblPerFt.toFixed(4) : '');
  } else if (activeField === 'bblPerFt') {
    setIfNotFocused('galPerFt', row.galPerFt ? row.galPerFt.toFixed(4) : '');
  }

  const volEl = card.querySelector('[data-wellcap-vol]');
  if (volEl) {
    const bbl = (row.depth || 0) * (row.bblPerFt || 0);
    const gal = (row.depth || 0) * (row.galPerFt || 0);
    volEl.innerHTML = `<span>${bbl.toFixed(2)}</span> <span class="unit">BBL</span>
      <span class="wellcap-gal-side">${F.c(gal)} GAL</span>`;
  }

  wellCapUpdateTotals();
}

function renderWellCap() {
  const c = document.getElementById('wellcap-rows');
  if (!c) return;
  S.wellCapRows.forEach(wellCapNormalizeRow);
  const rows = S.wellCapRows;
  c.innerHTML = rows.length === 0
    ? '<div class="wellcap-empty">No sections yet. Tap “+ Add Section” to build the well string.</div>'
    : rows.map((row, i) => wellCapRowHTML(row, i)).join('');
  wellCapUpdateTotals();
}

function addWellCapRow() {
  S.wellCapRows.push({
    depth: 0,
    tubular: 'custom',
    odIn: 0,
    idIn: 0,
    label: '',
    galPerFt: 0,
    bblPerFt: 0,
    manualFactor: false,
  });
  saveS();
  renderWellCap();
}
function wellCapDel(i) {
  S.wellCapRows.splice(i, 1);
  saveS();
  renderWellCap();
}
function wellCapUpdate(i, field, v) {
  const row = S.wellCapRows[i];
  if (!row) return;
  wellCapNormalizeRow(row);

  // Only rebuild the whole form when casing type changes (layout differs).
  // Typing into number/text fields uses a soft update so focus is kept.
  let fullRender = false;

  if (field === 'tubular') {
    fullRender = true;
    if (v === 'custom') {
      row.tubular = 'custom';
      row.manualFactor = false;
    } else {
      const t = TUBULAR_DATA[parseInt(v, 10)];
      if (t) {
        row.tubular = t.type;
        row.idIn = t.id;
        row.odIn = 0;
        row.galPerFt = t.factor;       // chart is gal/ft
        row.bblPerFt = t.factor / 42;
        row.manualFactor = false;
        row.label = t.type;
      }
    }
  } else if (field === 'label') {
    row.label = v;
  } else if (field === 'idIn') {
    // Allow empty / partial input without forcing 0 mid-keystroke for display;
    // still compute from numeric value when valid.
    const n = v === '' || v === '.' || v === '-' ? NaN : parseFloat(v);
    row.idIn = isNaN(n) ? 0 : n;
    row.tubular = 'custom';
    if (!row.manualFactor) {
      const caps = wellCapFromId(row.idIn);
      row.bblPerFt = caps.bblPerFt;
      row.galPerFt = caps.galPerFt;
    }
  } else if (field === 'odIn') {
    const n = v === '' || v === '.' || v === '-' ? NaN : parseFloat(v);
    row.odIn = isNaN(n) ? 0 : n;
    row.tubular = 'custom';
  } else if (field === 'galPerFt') {
    const n = v === '' || v === '.' || v === '-' ? NaN : parseFloat(v);
    row.galPerFt = isNaN(n) ? 0 : n;
    row.bblPerFt = row.galPerFt / 42;
    row.manualFactor = true;
  } else if (field === 'bblPerFt') {
    const n = v === '' || v === '.' || v === '-' ? NaN : parseFloat(v);
    row.bblPerFt = isNaN(n) ? 0 : n;
    row.galPerFt = row.bblPerFt * 42;
    row.manualFactor = true;
  } else if (field === 'depth') {
    const n = v === '' || v === '.' || v === '-' ? NaN : parseFloat(v);
    row.depth = isNaN(n) ? 0 : n;
  } else {
    row[field] = parseFloat(v) || 0;
  }

  saveS();
  if (fullRender) renderWellCap();
  else wellCapSoftUpdate(i, field);
}

// ================================================================
// SAND
// ================================================================

function renderSand() {
  // Stage tabs
  document.getElementById('stage-tabs').innerHTML = S.stages.map((st, i) =>
    `<button class="tab-btn${i===S.stageIdx?' active':''}" style="font-size:13px;" onclick="setStage(${i})">${esc(st.name)}</button>`
  ).join('');

  // Stage detail
  const c = document.getElementById('sand-detail');
  if (!S.stages.length) { c.innerHTML = '<p style="color:var(--text2);text-align:center;padding:20px;">No stages.</p>'; return; }
  const st = S.stages[S.stageIdx];
  if (!st) return;
  const total = st.inv.reduce((s,i) => s + (i.consumed||0), 0);

  c.innerHTML = `
    <div class="card mb-4">
      <div class="flex items-center gap-2 mb-3">
        <input type="text" value="${esc(st.name)}"
          style="background:transparent;border:none;outline:none;font-size:15px;font-weight:700;color:var(--text);flex:1;"
          oninput="stName(${S.stageIdx},this.value)" aria-label="Stage name">
        ${S.stages.length > 1 ? `<button type="button" class="btn-danger" onclick="delStage(${S.stageIdx})" title="Remove stage" aria-label="Remove stage">✕</button>` : ''}
      </div>
      <div class="divider"></div>
      <div class="flex gap-3 mt-3">
        <div class="flex-1">
          <label class="lbl">Total Design (LBS)</label>
          <input type="number" class="field" value="${st.totalDesignLbs}"
            oninput="stDesign(${S.stageIdx},this.value)" placeholder="0">
        </div>
        <div class="tile flex-1">
          <div class="lbl">Total Actual</div>
          <div class="val" style="color:var(--brand);">${F.c(total)}</div>
          <div class="unit">LBS</div>
        </div>
      </div>
    </div>

    <div>
      <div class="flex justify-between items-center mb-3">
        <div class="lbl tool-title" style="margin:0;">Inventory Matrix</div>
        <button class="btn btn-brand" style="font-size:12px;padding:7px 14px;" onclick="addSand(${S.stageIdx})">+ Add</button>
      </div>
      ${st.inv.length === 0
        ? '<div style="color:var(--text2);text-align:center;padding:20px;font-size:13px;">No sand types yet.</div>'
        : st.inv.map((item,si) => sandCard(S.stageIdx,si,item)).join('')}
    </div>`;
  ensureToolFavoriteUI();
}

function sandCard(si, ti, item) {
  const pct  = item.designLbs > 0 ? Math.min((item.consumed||0)/item.designLbs*100,100) : 0;
  const rem  = Math.max(0, item.designLbs - (item.consumed||0));
  const col  = item.color || '#10B981';
  return `
    <div class="card-sm mb-3">
      <div class="flex items-center gap-2 mb-3">
        <input type="color" value="${col}" onchange="sandColor(${si},${ti},this.value)">
        <input type="text" value="${esc(item.name)}"
          style="background:transparent;border:none;outline:none;font-size:12px;font-weight:800;text-transform:uppercase;color:var(--text);flex:1;"
          oninput="sandName(${si},${ti},this.value)">
        <button class="btn-danger" onclick="delSand(${si},${ti})">✕</button>
      </div>
      <div class="flex gap-2 mb-3">
        <div class="tile flex-1">
          <div class="lbl">Design Limit</div>
          <div style="font-size:18px;font-weight:900;font-family:'Space Grotesk',sans-serif;">${F.c(item.designLbs)}</div>
          <div class="unit">LBS</div>
        </div>
        <div class="tile flex-1">
          <div class="lbl">Actual Load</div>
          <div style="font-size:18px;font-weight:900;color:var(--brand);font-family:'Space Grotesk',sans-serif;">${F.c(item.consumed||0)}</div>
          <div class="unit">LBS</div>
        </div>
      </div>
      <div class="prog-track mb-1">
        <div class="prog-fill" style="width:${pct}%;background:${col};"></div>
      </div>
      <div class="flex justify-between mb-3" style="font-size:10px;color:var(--text2);font-weight:600;">
        <span>${Math.round(pct)}% consumed</span>
        <span>${F.c(rem)} LBS remaining</span>
      </div>
      <div class="flex gap-2">
        <div class="flex-1">
          <label class="lbl">Design Limit (LBS)</label>
          <input type="number" class="field" value="${item.designLbs}"
            oninput="sandDesign(${si},${ti},this.value)" placeholder="0">
        </div>
        <div class="flex-1">
          <label class="lbl">Actual Load (LBS)</label>
          <input type="number" class="field" value="${item.consumed||0}"
            oninput="sandConsumed(${si},${ti},this.value)" placeholder="0">
        </div>
      </div>
    </div>`;
}

function setStage(i) { S.stageIdx = i; saveS(); renderSand(); }
function addStage() {
  const n = S.stages.length+1;
  S.stages.push({ id: Date.now(), name:`Stage ${n}`, totalDesignLbs:0, inv:[] });
  S.stageIdx = S.stages.length - 1;
  saveS(); renderSand();
}
function delStage(i) {
  if (S.stages.length <= 1) return;
  S.stages.splice(i, 1);
  S.stageIdx = Math.max(0, Math.min(S.stageIdx, S.stages.length-1));
  saveS(); renderSand();
}
function stName(i, v) { S.stages[i].name = v; saveS(); document.querySelectorAll('#stage-tabs .tab-btn')[i].textContent = v; }
function stDesign(i, v) { S.stages[i].totalDesignLbs = parseFloat(v)||0; saveS(); }
function addSand(si) {
  const cols = ['#10B981','#3B82F6','#EF4444','#F59E0B','#8B5CF6','#EC4899'];
  S.stages[si].inv.push({ id:Date.now(), name:'NEW SAND', designLbs:0, consumed:0, color:cols[S.stages[si].inv.length%cols.length] });
  saveS(); renderSand();
}
function delSand(si,ti) { S.stages[si].inv.splice(ti,1); saveS(); renderSand(); }
function sandName(si,ti,v) { S.stages[si].inv[ti].name = v; saveS(); }
function sandColor(si,ti,v) { S.stages[si].inv[ti].color = v; saveS(); }
function sandDesign(si,ti,v) { S.stages[si].inv[ti].designLbs = parseFloat(v)||0; saveS(); renderSand(); }
function sandConsumed(si,ti,v) { S.stages[si].inv[ti].consumed = parseFloat(v)||0; saveS(); renderSand(); }

function renderSandTools() {
  // Bulk Density Calculator
  const bMass = parseFloat(document.getElementById('bulkcalc-mass')?.value) || 0;
  const bVol  = parseFloat(document.getElementById('bulkcalc-vol')?.value)  || 0;
  const bRes  = bVol > 0 ? bMass / bVol : 0;
  if (document.getElementById('bulkcalc-result')) {
    document.getElementById('bulkcalc-result').textContent = bRes.toFixed(2);
  }

  // Render Proppant Table
  const propTbody = document.getElementById('proppant-tbody');
  if (propTbody) {
    propTbody.innerHTML = PROPPANT_DATA.map(p => `
      <tr>
        <td style="padding:8px 4px;font-size:13px;font-weight:600;border-bottom:1px solid var(--border);">${p.type}</td>
        <td class="tbl-right" style="padding:8px 4px;font-size:13px;font-weight:700;color:var(--brand);border-bottom:1px solid var(--border);font-family:'Space Grotesk',sans-serif;">${p.bulk}</td>
        <td class="tbl-right" style="padding:8px 4px;font-size:13px;font-weight:700;color:var(--text2);border-bottom:1px solid var(--border);font-family:monospace;">${p.sg.toFixed(2)}</td>
      </tr>
    `).join('');
  }

  // Sand Needed <-> Clean Volume
  const snClean = parseFloat(document.getElementById('sandneed-clean')?.value) || 0;
  const snPpg   = parseFloat(document.getElementById('sandneed-ppg')?.value)   || 0;
  const snLbs = snClean * 42 * snPpg;
  if (document.getElementById('sandneed-lbs')) document.getElementById('sandneed-lbs').textContent = Math.round(snLbs).toLocaleString();
  if (document.getElementById('sandneed-clean-out')) document.getElementById('sandneed-clean-out').textContent = (snPpg > 0 ? (snLbs/42/snPpg) : 0).toLocaleString(undefined,{maximumFractionDigits:0});

  // AVF / CFR / Yield / Slurry Density
  const ppa = parseFloat(document.getElementById('propcalc-ppa')?.value) || 0;
  const sg  = parseFloat(document.getElementById('propcalc-sg')?.value)  || 2.65;
  const waterDens = 8.33;
  const avfVal = 1 / (waterDens * sg);
  const avf = ppa * avfVal;
  const cfr = 1 / ((ppa / (sg * waterDens)) + 1);
  const propYield = (ppa * avfVal) + 1;
  const slurryDens = waterDens + (ppa / ((ppa / (sg * waterDens)) + 1));
  if (document.getElementById('propcalc-avf')) document.getElementById('propcalc-avf').textContent = avfVal.toFixed(4);
  if (document.getElementById('propcalc-cfr')) document.getElementById('propcalc-cfr').textContent = cfr.toFixed(3);
  if (document.getElementById('propcalc-yield')) document.getElementById('propcalc-yield').textContent = propYield.toFixed(3);
  if (document.getElementById('propcalc-slurrydens')) document.getElementById('propcalc-slurrydens').textContent = slurryDens.toFixed(2);

  // Proppant Concentration Method 1 (Pump Rates)
  const pcSlurryRate = parseFloat(document.getElementById('propconc-slurryrate')?.value) || 0;
  const pcCleanRate  = parseFloat(document.getElementById('propconc-cleanrate')?.value)  || 0;
  const pcSg1        = parseFloat(document.getElementById('propconc-sg1')?.value)        || 2.65;
  let ppaMethod1 = 0;
  if (pcCleanRate > 0 && pcSlurryRate >= pcCleanRate) {
    ppaMethod1 = ((pcSlurryRate / pcCleanRate) - 1) * 8.33 * pcSg1;
  }
  if (document.getElementById('propconc-res1')) {
    document.getElementById('propconc-res1').textContent = ppaMethod1.toFixed(2);
  }

  // Proppant Concentration Method 2 (Densitometer / Measured Density)
  const pcCarrier  = parseFloat(document.getElementById('propconc-carrier')?.value)  || 8.33;
  const pcMeasured = parseFloat(document.getElementById('propconc-measured')?.value) || 8.33;
  const pcSg2      = parseFloat(document.getElementById('propconc-sg2')?.value)      || 2.65;
  let ppaMethod2 = 0;
  const solidDens = pcSg2 * 8.33;
  if (pcMeasured > pcCarrier && pcMeasured < solidDens) {
    const denom = 1 - (pcMeasured / solidDens);
    ppaMethod2 = (pcMeasured - pcCarrier) / denom;
  }
  if (document.getElementById('propconc-res2')) {
    document.getElementById('propconc-res2').textContent = ppaMethod2.toFixed(2);
  }

  // Sand Ramp Average PPA & Total Sand
  const rStart = parseFloat(document.getElementById('ramp-start')?.value) || 0;
  const rEnd   = parseFloat(document.getElementById('ramp-end')?.value)   || 0;
  const rVol   = parseFloat(document.getElementById('ramp-vol')?.value)   || 0;
  const rAvgPpa = (rStart + rEnd) / 2;
  const rTotalLbs = rAvgPpa * rVol * 42;
  if (document.getElementById('ramp-avgppa')) document.getElementById('ramp-avgppa').textContent = rAvgPpa.toFixed(2);
  if (document.getElementById('ramp-totallbs')) document.getElementById('ramp-totallbs').textContent = Math.round(rTotalLbs).toLocaleString();

  // PPR Calculator (Dimensions)
  const augR   = parseFloat(document.getElementById('ppr-augr')?.value)   || 0;
  const shaftR = parseFloat(document.getElementById('ppr-shaftr')?.value) || 0;
  const pitch  = parseFloat(document.getElementById('ppr-pitch')?.value)  || 0;
  const bulk   = parseFloat(document.getElementById('ppr-bulk')?.value)   || 0;
  const ppr = 1.41 * (Math.pow(augR,2) - Math.pow(shaftR,2)) * pitch * bulk / 1728;
  if (document.getElementById('ppr-result')) document.getElementById('ppr-result').textContent = ppr.toFixed(4);

  // PPR Recalibration
  const pprOld    = parseFloat(document.getElementById('pprrecal-old')?.value)    || 0;
  const pprActual = parseFloat(document.getElementById('pprrecal-actual')?.value) || 0;
  const pprDesign = parseFloat(document.getElementById('pprrecal-design')?.value) || 0;
  const pprNew = pprDesign > 0 ? pprOld * (pprActual / pprDesign) : pprOld;
  if (document.getElementById('pprrecal-new')) document.getElementById('pprrecal-new').textContent = pprNew.toFixed(4);

  // Auger RPM, PPM & PPT Rates
  const arRate = parseFloat(document.getElementById('augerrpm-rate')?.value) || 0;
  const arPpg  = parseFloat(document.getElementById('augerrpm-ppg')?.value)  || 0;
  const arPpr  = parseFloat(document.getElementById('augerrpm-ppr')?.value)  || 0;
  const totalRpm = arPpr > 0 ? arRate * arPpg * 42 / arPpr : 0;
  const ppm = totalRpm * arPpr;
  const ppt = arPpg * 1000;
  if (document.getElementById('augerrpm-total')) document.getElementById('augerrpm-total').textContent = totalRpm.toFixed(1);
  if (document.getElementById('augerrpm-ppm')) document.getElementById('augerrpm-ppm').textContent = Math.round(ppm).toLocaleString();
  if (document.getElementById('augerrpm-ppt')) document.getElementById('augerrpm-ppt').textContent = Math.round(ppt).toLocaleString();

  // Multi-Auger Priority RPM Allocator
  const maTotalRpm   = parseFloat(document.getElementById('multiauger-totalrpm')?.value)   || 0;
  const maCount      = parseInt(document.getElementById('multiauger-count')?.value)        || 3;
  const maThreshold  = parseFloat(document.getElementById('multiauger-threshold')?.value)  || 50;
  const maContainer  = document.getElementById('multiauger-results');
  if (maContainer) {
    const isOver = maTotalRpm > (maThreshold * maCount);
    let augerRPMs = [];
    if (isOver) {
      const equalRpm = maTotalRpm / maCount;
      augerRPMs = Array(maCount).fill(equalRpm);
    } else {
      let remRpm = maTotalRpm;
      for (let i = 0; i < maCount; i++) {
        const take = Math.min(remRpm, maThreshold);
        augerRPMs.push(take);
        remRpm -= take;
      }
    }
    maContainer.innerHTML = augerRPMs.map((rpm, i) => `
      <div class="tile">
        <div class="lbl">Auger ${i + 1} RPM ${isOver ? '(Equal Run)' : `(P${i + 1})`}</div>
        <div class="val" style="color:var(--brand);">${rpm.toFixed(1)}</div>
        <div class="unit">RPM</div>
      </div>
    `).join('');
  }

  // Job Prop Total from Cum Volumes
  const jpSlurry = parseFloat(document.getElementById('jobprop-slurry')?.value) || 0;
  const jpClean  = parseFloat(document.getElementById('jobprop-clean')?.value)  || 0;
  const jpChem   = parseFloat(document.getElementById('jobprop-chem')?.value)   || 0;
  const jpTotal  = avfVal > 0 ? (jpSlurry - jpClean - jpChem) / avfVal : 0;
  if (document.getElementById('jobprop-total')) document.getElementById('jobprop-total').textContent = Math.round(jpTotal).toLocaleString();
}

// ================================================================
// CHEM
// ================================================================

function getRate() { return parseFloat(document.getElementById('ch-rate').value) || 0; }

function renderChem() {
  const rate = getRate();
  S.cleanRate = rate;
  const totalGPM = S.chemicals.reduce((s,ch) => s + F.gpm(rate, ch.gpt, ch.fine), 0);
  document.getElementById('ch-total').textContent = totalGPM.toFixed(2);
  document.getElementById('ch-count-lbl').textContent = `Dynamic summation of ${S.chemicals.length} active channel${S.chemicals.length===1?'':'s'}`;
  // Update GPM in existing channel cards
  S.chemicals.forEach(ch => {
    const el = document.getElementById(`ch-gpm-${ch.id}`);
    if (el) el.textContent = F.gpm(rate, ch.gpt, ch.fine).toFixed(3);
  });
  renderHydration();
}

function renderChCards() {
  const rate = getRate();
  const grid = document.getElementById('ch-grid');
  if (!S.chemicals.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text2);padding:20px;font-size:13px;">No channels. Click Init to create channels.</div>`;
    return;
  }
  grid.innerHTML = S.chemicals.map(ch => `
    <div class="card-sm">
      <div class="flex items-center gap-2 mb-3">
        <input type="color" value="${ch.color}" onchange="chColor('${ch.id}',this.value)"
               style="width:24px;height:24px;border-radius:50%;border:none;padding:0;">
        <input type="text" value="${esc(ch.name)}"
          style="background:transparent;border:none;outline:none;font-size:11px;font-weight:800;text-transform:uppercase;color:var(--text);flex:1;font-family:inherit;"
          oninput="chName('${ch.id}',this.value)">
        <button class="btn-danger" style="padding:2px 6px;" onclick="delCh('${ch.id}')">✕</button>
      </div>
      <div class="mb-2">
        <label class="lbl">GPT</label>
        <input type="number" class="field" value="${ch.gpt}" step="0.01"
          oninput="chGPT('${ch.id}',this.value)" placeholder="1.00">
      </div>
      <div class="mb-3">
        <label class="lbl">Fine Adjust</label>
        <input type="number" class="field" value="${ch.fine}" step="0.001"
          oninput="chFine('${ch.id}',this.value)" placeholder="1.00">
      </div>
      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:10px;padding:10px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div class="lbl" style="margin-bottom:2px;">GPM Output</div>
          <div id="ch-gpm-${ch.id}" class="font-display" style="font-size:18px;font-weight:900;color:var(--brand);">${F.gpm(rate,ch.gpt,ch.fine).toFixed(3)}</div>
        </div>
        <div style="font-size:10px;font-weight:700;color:var(--text2);">GPM</div>
      </div>
    </div>`).join('');
}

function initChannels() {
  const n = Math.max(1,Math.min(10,parseInt(document.getElementById('ch-count').value)||2));
  S.chemicals = Array.from({length:n},(_,i) => ({id:`c${Date.now()}_${i}`,name:`CHANNEL_${i+1}`,color:CH_COLORS[i%CH_COLORS.length],gpt:1,fine:1}));
  saveS(); renderChCards(); renderChem();
}

function delCh(id) { S.chemicals = S.chemicals.filter(c=>c.id!==id); saveS(); renderChCards(); renderChem(); }
function chName(id,v) { const c=S.chemicals.find(c=>c.id===id); if(c){ c.name=v; saveS(); } }
function chColor(id,v) { const c=S.chemicals.find(c=>c.id===id); if(c){ c.color=v; saveS(); } }
function chGPT(id,v) { const c=S.chemicals.find(c=>c.id===id); if(c){ c.gpt=parseFloat(v)||0; saveS(); renderChem(); } }
function chFine(id,v) { const c=S.chemicals.find(c=>c.id===id); if(c){ c.fine=parseFloat(v)||1; saveS(); renderChem(); } }

function renderChemTools() {
  // Chemical Used from Straps
  const cuStart = parseFloat(document.getElementById('chemused-start').value) || 0;
  const cuEnd   = parseFloat(document.getElementById('chemused-end').value)   || 0;
  document.getElementById('chemused-result').textContent = Math.max(0, cuStart - cuEnd).toFixed(1);

  // Chemical Stage Variance
  const cvPumped   = parseFloat(document.getElementById('chemvar-pumped').value)   || 0;
  const cvDesigned = parseFloat(document.getElementById('chemvar-designed').value) || 0;
  const cvPct  = cvDesigned > 0 ? (cvPumped/cvDesigned)*100 : 0;
  const cvDiff = cvPumped - cvDesigned;
  document.getElementById('chemvar-pct').textContent = cvPct.toFixed(1) + '%';
  const statusEl = document.getElementById('chemvar-status');
  if (cvDiff > 0)      { statusEl.textContent = `Over by ${cvDiff.toFixed(1)} gal`;  statusEl.style.color = 'var(--yellow)'; }
  else if (cvDiff < 0) { statusEl.textContent = `Under by ${Math.abs(cvDiff).toFixed(1)} gal`; statusEl.style.color = 'var(--brand)'; }
  else                 { statusEl.textContent = 'Exact match'; statusEl.style.color = 'var(--blue)'; }

  // GPT <-> GPM
  const ggRate = parseFloat(document.getElementById('gptgpm-rate').value) || 0;
  const ggGpt  = parseFloat(document.getElementById('gptgpm-gpt').value)  || 0;
  const ggGpm  = F.gpm(ggRate, ggGpt);
  document.getElementById('gptgpm-gpm').textContent  = ggGpm.toFixed(2);
  document.getElementById('gptgpm-conc').textContent = ggGpt.toFixed(2);

  // Acid Dilution
  const adVol    = parseFloat(document.getElementById('acidd-vol').value)       || 0;
  const adRawPct = parseFloat(document.getElementById('acidd-rawpct').value)    || 0;
  const adTgtPct = parseFloat(document.getElementById('acidd-targetpct').value) || 0;
  const adDens   = parseFloat(document.getElementById('acidd-density').value)   || 8.34;
  const adDilute = adVol * ((adDens/8.34) * (adRawPct - adTgtPct) + 1);
  document.getElementById('acidd-dilutevol').textContent = adDilute.toFixed(1);
  document.getElementById('acidd-watervol').textContent  = Math.max(0, adDilute - adVol).toFixed(1);

  // Buffer Needed
  const bufBbl = parseFloat(document.getElementById('buffer-bbl').value) || 0;
  const bufGpt = parseFloat(document.getElementById('buffer-gpt').value) || 0;
  document.getElementById('buffer-result').textContent = (bufBbl * 0.042 * bufGpt).toFixed(2);

  // Tote Volume from Strap
  const toteStrap   = parseFloat(document.getElementById('tote-strap').value)   || 0;
  const toteFactor   = parseFloat(document.getElementById('tote-type').value)    || TOTE_TYPES[0].factor;
  const toteBottoms = parseFloat(document.getElementById('tote-bottoms').value) || 0;
  document.getElementById('tote-accessible').textContent = Math.max(0, (toteStrap - toteBottoms) * toteFactor).toFixed(1);
  document.getElementById('tote-total').textContent      = (toteStrap * toteFactor).toFixed(1);

  // Ending Strap Predictor
  const esClean = parseFloat(document.getElementById('endstrap-clean').value) || 0;
  const esGpt   = parseFloat(document.getElementById('endstrap-gpt').value)   || 0;
  const esStart = parseFloat(document.getElementById('endstrap-start').value) || 0;
  const esFactor = parseFloat(document.getElementById('endstrap-type').value)  || TOTE_TYPES[0].factor;
  const esFrNeeded = esClean * 0.042 * esGpt;
  const esStartGal = esStart * esFactor;
  const esEndGal   = Math.max(0, esStartGal - esFrNeeded);
  document.getElementById('endstrap-fr').textContent     = Math.round(esFrNeeded).toLocaleString();
  document.getElementById('endstrap-ending').textContent = (esEndGal / esFactor).toFixed(1);

  // Tote Refill Count
  const trClean = parseFloat(document.getElementById('toterefill-clean')?.value) || 0;
  const trGpt   = parseFloat(document.getElementById('toterefill-gpt')?.value)   || 0;
  const trFill  = parseFloat(document.getElementById('toterefill-fill')?.value)  || 0;
  const trBot   = parseFloat(document.getElementById('toterefill-bottoms')?.value) || 0;
  const trFac   = parseFloat(document.getElementById('toterefill-factor')?.value) || 1;
  const trNeeded = trClean * 0.042 * trGpt;
  const trAccess = Math.max(0, trFill - trBot) * trFac;
  const trCount  = trAccess > 0 ? Math.ceil(trNeeded / trAccess) : 0;
  if (document.getElementById('toterefill-needed')) document.getElementById('toterefill-needed').textContent = Math.round(trNeeded).toLocaleString();
  if (document.getElementById('toterefill-accessible')) document.getElementById('toterefill-accessible').textContent = trAccess.toFixed(1);
  if (document.getElementById('toterefill-count')) document.getElementById('toterefill-count').textContent = trCount;

  // Chemical Setpoint & Clean Volume Back-Calculator
  const ccGpm       = parseFloat(document.getElementById('chemcalc-gpm')?.value)       || 0;
  const ccBpm       = parseFloat(document.getElementById('chemcalc-bpm')?.value)       || 0;
  const ccTotChem   = parseFloat(document.getElementById('chemcalc-totchem')?.value)   || 0;
  const ccTargetGpt = parseFloat(document.getElementById('chemcalc-targetgpt')?.value) || 0;

  const ccOutGpt      = ccBpm > 0 ? ccGpm / ccBpm : 0;
  const ccOutCleanBbl = ccTargetGpt > 0 ? (ccTotChem / (ccTargetGpt * 0.042)) : 0;

  if (document.getElementById('chemcalc-outgpt')) document.getElementById('chemcalc-outgpt').textContent = ccOutGpt.toFixed(2);
  if (document.getElementById('chemcalc-outcleanbbl')) document.getElementById('chemcalc-outcleanbbl').textContent = Math.round(ccOutCleanBbl).toLocaleString();

  // Liquid vs Dry Concentration Converter (GPT ↔ PPT)
  const gpGpt    = parseFloat(document.getElementById('gptppt-gpt')?.value)       || 0;
  const gpDens   = parseFloat(document.getElementById('gptppt-density')?.value)   || 0;
  const gpActive = parseFloat(document.getElementById('gptppt-activepct')?.value) || 100;
  const gpInPpt  = parseFloat(document.getElementById('gptppt-inppt')?.value)     || 0;

  const gpOutPpt     = gpGpt * gpDens * (gpActive / 100);
  const gpActiveDens = gpDens * (gpActive / 100);
  const gpOutBackGpt = gpActiveDens > 0 ? gpInPpt / gpActiveDens : 0;

  if (document.getElementById('gptppt-outppt')) document.getElementById('gptppt-outppt').textContent = gpOutPpt.toFixed(1);
  if (document.getElementById('gptppt-outbackgpt')) document.getElementById('gptppt-outbackgpt').textContent = gpOutBackGpt.toFixed(2);

  // Strap Rate (IN/HR) & Chemical Flow Rate
  const srInHr     = parseFloat(document.getElementById('straprate-inhr')?.value)     || 0;
  const srFactor   = parseFloat(document.getElementById('straprate-factor')?.value)   || 0;
  const srCleanBpm = parseFloat(document.getElementById('straprate-cleanbpm')?.value) || 0;

  const srOutGpm = (srInHr * srFactor) / 60;
  const srOutGpt = srCleanBpm > 0 ? srOutGpm / srCleanBpm : 0;

  if (document.getElementById('straprate-outgpm')) document.getElementById('straprate-outgpm').textContent = srOutGpm.toFixed(2);
  if (document.getElementById('straprate-outgpt')) document.getElementById('straprate-outgpt').textContent = srOutGpt.toFixed(3);

  // Chemical Specific Gravity (SG) & Tote Weight
  const csgSg       = parseFloat(document.getElementById('chemsg-sg')?.value)       || 0;
  const csgVol      = parseFloat(document.getElementById('chemsg-vol')?.value)      || 0;
  const csgWaterPpg = parseFloat(document.getElementById('chemsg-waterppg')?.value) || 8.34;

  const csgOutPpg = csgSg * csgWaterPpg;
  const csgOutLbs = csgVol * csgOutPpg;

  if (document.getElementById('chemsg-outppg')) document.getElementById('chemsg-outppg').textContent = csgOutPpg.toFixed(2);
  if (document.getElementById('chemsg-outlbs')) document.getElementById('chemsg-outlbs').textContent = Math.round(csgOutLbs).toLocaleString();

  renderMultiTote();
}

function hclFromPct() {
  const pct = parseFloat(document.getElementById('hcl-pct').value) || 0;
  document.getElementById('hcl-dens').value = (8.34 * (1 + 0.0051 * pct)).toFixed(3);
}
function hclFromDens() {
  const dens = parseFloat(document.getElementById('hcl-dens').value) || 0;
  document.getElementById('hcl-pct').value = dens > 0 ? (((dens/8.33) - 1) * 196.08).toFixed(1) : '0.0';
}

function multiToteRowHTML(row, i) {
  return `
    <div class="card-sm mb-3">
      <div class="flex gap-2 mb-2 items-end">
        <div class="flex-1">
          <label class="lbl">Strap (IN)</label>
          <input type="number" class="field" value="${row.strap}" step="0.1" oninput="multiToteUpdate(${i},'strap',this.value)" placeholder="0">
        </div>
        <button class="btn-danger" onclick="multiToteDel(${i})">✕</button>
      </div>
      <div class="flex gap-2 items-end">
        <div class="flex-1">
          <label class="lbl">Tote Type</label>
          <select class="field" onchange="multiToteUpdate(${i},'factor',this.value)">
            ${TOTE_TYPES.map(t=>`<option value="${t.factor}"${row.factor===t.factor?' selected':''}>${t.label} (${t.factor})</option>`).join('')}
          </select>
        </div>
        <div style="width:90px;">
          <label class="lbl">Bottoms (IN)</label>
          <input type="number" class="field" value="${row.bottoms}" step="0.5" oninput="multiToteUpdate(${i},'bottoms',this.value)" placeholder="0">
        </div>
      </div>
    </div>`;
}

function renderMultiTote() {
  const rows = S.multiToteRows;
  const c = document.getElementById('multitote-rows');
  c.innerHTML = rows.length === 0
    ? '<div style="color:var(--text2);text-align:center;padding:14px;font-size:13px;">No totes yet.</div>'
    : rows.map((row,i) => multiToteRowHTML(row,i)).join('');
  const total = rows.reduce((s,r) => s + Math.max(0, (r.strap||0) - (r.bottoms||0)) * (r.factor||0), 0);
  document.getElementById('multitote-total').textContent = total.toFixed(1);
}

function addMultiToteRow() {
  S.multiToteRows.push({ strap: 0, factor: TOTE_TYPES[0].factor, bottoms: 0 });
  saveS(); renderMultiTote();
}
function multiToteDel(i) { S.multiToteRows.splice(i,1); saveS(); renderMultiTote(); }
function multiToteUpdate(i, field, v) {
  const row = S.multiToteRows[i];
  if (!row) return;
  row[field] = parseFloat(v) || 0;
  saveS(); renderMultiTote();
}

// ================================================================
// HYDRATION  (Section 4 — FRAC MATH Reference Guide)
// ================================================================
// LGA Set Point = PPT / 4
// PPT = LGA × 4
// LGA Used (gal) = Guar lbs / 4
// Lb System ≈ Target Visc + 4 ; Target Visc ≈ Lb System − 4
// Tub Volume (bbl) = Capacity × Level% / 100
// Hydration Time (min) = Tub Volume / Job Clean Rate
// LGA Needed (gal) = Tub Volume × 0.042 × LGA Set Point
// Gel Visc Up (lbs) = Tub Volume × 0.042 × PPT
// Gel Increase Visc (lbs) = Tub Volume × 0.042 × (Target − Current)
// Design Gel (lbs) = Stage Volume × 0.042 × PPT
// PPM = Hydration Rate × 0.042 × PPT
// Guar Auger RPM = PPM / PPR
// LGA Tote Volume = 12.33 × Strap
// End Tote Volume = Start Volume − LGA Needed

let _rofLock = false;

function rofFromLga() {
  if (_rofLock) return;
  _rofLock = true;
  const lga = parseFloat(document.getElementById('rof-lga').value) || 0;
  const ppt = lga * 4;
  document.getElementById('rof-ppt').value = ppt.toFixed(1);
  document.getElementById('rof-lbsystem-in').value = ppt.toFixed(1);
  document.getElementById('rof-visc-in').value = Math.max(0, ppt - 4).toFixed(1);
  _rofLock = false;
  renderHydration();
}
function rofFromPpt() {
  if (_rofLock) return;
  _rofLock = true;
  const ppt = parseFloat(document.getElementById('rof-ppt').value) || 0;
  document.getElementById('rof-lga').value = (ppt / 4).toFixed(2);
  document.getElementById('rof-lbsystem-in').value = ppt.toFixed(1);
  document.getElementById('rof-visc-in').value = Math.max(0, ppt - 4).toFixed(1);
  _rofLock = false;
  renderHydration();
}
function rofFromLbSystem() {
  if (_rofLock) return;
  _rofLock = true;
  const lb = parseFloat(document.getElementById('rof-lbsystem-in').value) || 0;
  document.getElementById('rof-visc-in').value = Math.max(0, lb - 4).toFixed(1);
  document.getElementById('rof-ppt').value = lb.toFixed(1);
  document.getElementById('rof-lga').value = (lb / 4).toFixed(2);
  _rofLock = false;
  renderHydration();
}
function rofFromVisc() {
  if (_rofLock) return;
  _rofLock = true;
  const visc = parseFloat(document.getElementById('rof-visc-in').value) || 0;
  const lb = visc + 4;
  document.getElementById('rof-lbsystem-in').value = lb.toFixed(1);
  document.getElementById('rof-ppt').value = lb.toFixed(1);
  document.getElementById('rof-lga').value = (lb / 4).toFixed(2);
  _rofLock = false;
  renderHydration();
}
function rofFromGuarLbs() {
  if (_rofLock) return;
  _rofLock = true;
  const lbs = parseFloat(document.getElementById('rof-guar-lbs').value) || 0;
  document.getElementById('rof-lga-used').value = (lbs / 4).toFixed(2);
  _rofLock = false;
  renderHydration();
}
function rofFromLgaUsed() {
  if (_rofLock) return;
  _rofLock = true;
  const gal = parseFloat(document.getElementById('rof-lga-used').value) || 0;
  document.getElementById('rof-guar-lbs').value = (gal * 4).toFixed(1);
  _rofLock = false;
  renderHydration();
}

function syncLgaNeedFromTub() {
  const el = document.getElementById('lganeed-vol');
  const tub = document.getElementById('tub-vol');
  if (el && tub) {
    el.value = parseFloat(tub.textContent) || 0;
    renderHydration();
  }
}

function renderHydration() {
  // —— Rules of Four summary tiles ——
  const rofLga = parseFloat(document.getElementById('rof-lga')?.value) || 0;
  const rofPpt = rofLga * 4;
  if (document.getElementById('rof-ppt-out')) document.getElementById('rof-ppt-out').textContent = rofPpt.toFixed(1);
  if (document.getElementById('rof-visc-out')) document.getElementById('rof-visc-out').textContent = Math.max(0, rofPpt - 4).toFixed(1);

  // —— LGA Rate: GPM = Rate × 0.042 × LGA GPT ——
  const lgaRate = parseFloat(document.getElementById('lga-rate')?.value) || 0;
  const lgaGpt  = parseFloat(document.getElementById('lga-gpt')?.value)  || 0;
  const lgaGpm  = lgaRate * 0.042 * lgaGpt;
  const lgaPpt  = lgaGpt * 4;
  const lgaPpm  = lgaRate * 0.042 * lgaPpt;
  if (document.getElementById('lga-gpm')) document.getElementById('lga-gpm').textContent = lgaGpm.toFixed(2);
  if (document.getElementById('lga-ppt-eq')) document.getElementById('lga-ppt-eq').textContent = lgaPpt.toFixed(1);
  if (document.getElementById('lga-ppm-eq')) document.getElementById('lga-ppm-eq').textContent = lgaPpm.toFixed(1);

  // —— PPM & Guar Auger RPM ——
  const gRate = parseFloat(document.getElementById('guar-rate')?.value) || 0;
  const gPpt  = parseFloat(document.getElementById('guar-ppt')?.value)  || 0;
  const gPpr  = parseFloat(document.getElementById('guar-ppr')?.value)  || 0;
  const gPpm  = gRate * 0.042 * gPpt;
  const gGpm  = gPpm / 4; // LGA gal/min (4 lbs guar per LGA gallon)
  const gRpm  = gPpr > 0 ? gPpm / gPpr : 0;
  if (document.getElementById('guar-ppm')) document.getElementById('guar-ppm').textContent = gPpm.toFixed(1);
  if (document.getElementById('guar-gpm')) document.getElementById('guar-gpm').textContent = gGpm.toFixed(1);
  if (document.getElementById('guar-rpm')) document.getElementById('guar-rpm').textContent = gRpm.toFixed(1);

  // —— Tub Volume & Hydration Time ——
  // Tub Volume = Capacity × Level% / 100
  // Hydration Time = Tub Volume / Job Clean Rate
  const cap   = parseFloat(document.getElementById('tub-cap')?.value) || 0;
  const lv    = parseFloat(document.getElementById('tub-level')?.value) || 0;
  const clean = parseFloat(document.getElementById('tub-cleanrate')?.value) || 0;
  const vol   = cap * (lv / 100);
  const res   = clean > 0 ? vol / clean : null;
  if (document.getElementById('tub-pct-lbl')) document.getElementById('tub-pct-lbl').textContent = `${Math.round(lv)}%`;
  if (document.getElementById('tub-vol')) document.getElementById('tub-vol').textContent = vol.toFixed(1);
  if (document.getElementById('tub-res')) document.getElementById('tub-res').textContent = res !== null ? res.toFixed(1) : '–';

  // —— LGA Needed for Tub ——
  // LGA Needed = Tub Volume × 0.042 × LGA Set Point
  const needVol = parseFloat(document.getElementById('lganeed-vol')?.value) || 0;
  const needGpt = parseFloat(document.getElementById('lganeed-gpt')?.value) || 0;
  const needGal = needVol * 0.042 * needGpt;
  if (document.getElementById('lganeed-gal')) document.getElementById('lganeed-gal').textContent = needGal.toFixed(1);
  if (document.getElementById('lganeed-lbs')) document.getElementById('lganeed-lbs').textContent = (needGal * 4).toFixed(1);

  // —— Gel Used to Visc Up Tub ——
  // Gel Used (lbs) = Tub Volume × 0.042 × PPT
  const vuVol = parseFloat(document.getElementById('viscup-vol')?.value) || 0;
  const vuPpt = parseFloat(document.getElementById('viscup-ppt')?.value) || 0;
  const vuLbs = vuVol * 0.042 * vuPpt;
  if (document.getElementById('viscup-lbs')) document.getElementById('viscup-lbs').textContent = vuLbs.toFixed(1);
  if (document.getElementById('viscup-lga')) document.getElementById('viscup-lga').textContent = (vuLbs / 4).toFixed(1);

  // —— Gel Used to Increase Tub Viscosity ——
  // Gel Used (lbs) = Tub Volume × 0.042 × (Target cp − Current cp)
  const tvVol     = parseFloat(document.getElementById('tubvisc-vol')?.value) || 0;
  const tvCurrent = parseFloat(document.getElementById('tubvisc-current')?.value) || 0;
  const tvTarget  = parseFloat(document.getElementById('tubvisc-target')?.value) || 0;
  const tvDryLbs  = tvVol * 0.042 * (tvTarget - tvCurrent);
  if (document.getElementById('tubvisc-dry')) document.getElementById('tubvisc-dry').textContent = tvDryLbs.toFixed(1);
  if (document.getElementById('tubvisc-gel')) document.getElementById('tubvisc-gel').textContent = (tvDryLbs / 4).toFixed(1);

  // —— Design Gel Used for Stage ——
  // Design Gel (lbs) = Stage Volume × 0.042 × PPT
  const dgBbl = parseFloat(document.getElementById('designgel-bbl')?.value) || 0;
  const dgPpt = parseFloat(document.getElementById('designgel-ppt')?.value) || 0;
  const dgLbs = dgBbl * 0.042 * dgPpt;
  if (document.getElementById('designgel-dry')) document.getElementById('designgel-dry').textContent = dgLbs.toFixed(1);
  if (document.getElementById('designgel-lga')) document.getElementById('designgel-lga').textContent = (dgLbs / 4).toFixed(1);

  // —— LGA Tote Volume = factor × strap ——
  const lgaStrap = parseFloat(document.getElementById('lgatote-strap')?.value) || 0;
  const lgaCap   = parseFloat(document.getElementById('lgatote-cap')?.value) || 0;
  if (document.getElementById('lgatote-gal')) document.getElementById('lgatote-gal').textContent = (lgaStrap * lgaCap).toFixed(1);

  // —— End LGA Tote Volume = Start − LGA Needed ——
  const endCap   = parseFloat(document.getElementById('endlga-cap')?.value) || 0;
  const endStrap = parseFloat(document.getElementById('endlga-startstrap')?.value) || 0;
  const endNeed  = parseFloat(document.getElementById('endlga-needed')?.value) || 0;
  const endVolIn = document.getElementById('endlga-startvol')?.value;
  const startVol = (endVolIn !== '' && endVolIn != null && !isNaN(parseFloat(endVolIn)))
    ? parseFloat(endVolIn)
    : endStrap * endCap;
  const endVol   = startVol - endNeed;
  const endStrapOut = endCap > 0 ? endVol / endCap : 0;
  if (document.getElementById('endlga-start-out')) document.getElementById('endlga-start-out').textContent = startVol.toFixed(1);
  if (document.getElementById('endlga-endvol')) document.getElementById('endlga-endvol').textContent = endVol.toFixed(1);
  if (document.getElementById('endlga-endstrap')) document.getElementById('endlga-endstrap').textContent = endStrapOut.toFixed(1);

  // —— Mid-Stage Tote Swap Predictor ——
  const ts1Start = parseFloat(document.getElementById('toteswap-t1start')?.value) || 0;
  const ts1Swap  = parseFloat(document.getElementById('toteswap-t1swap')?.value) || 0;
  const ts2Start = parseFloat(document.getElementById('toteswap-t2start')?.value) || 0;
  const tsTotal  = parseFloat(document.getElementById('toteswap-totalgel')?.value) || 0;
  const tsFac    = parseFloat(document.getElementById('toteswap-factor')?.value) || 1;
  const ts1Gel   = Math.max(0, ts1Start - ts1Swap) * tsFac;
  const ts2Gel   = Math.max(0, tsTotal - ts1Gel);
  const ts2End   = tsFac > 0 ? Math.max(0, ts2Start - (ts2Gel / tsFac)) : 0;
  if (document.getElementById('toteswap-t1gel')) document.getElementById('toteswap-t1gel').textContent = ts1Gel.toFixed(1);
  if (document.getElementById('toteswap-t2end')) document.getElementById('toteswap-t2end').textContent = ts2End.toFixed(1);
}

// ================================================================
// BLENDER
// ================================================================

let blEl=0, blRun=false, blTmr=null;

function blThGPM() {
  const r = parseFloat(document.getElementById('bl-rate').value)   || 0;
  const g = parseFloat(document.getElementById('bl-gpt').value)    || 0;
  const f = parseFloat(document.getElementById('bl-fine').value)   || 1;
  return F.gpm(r, g, f);
}

function renderBlender() {
  const th = blThGPM();
  const dv = parseFloat(document.getElementById('bl-desired')?.value) || 0;
  const tt = th > 0 ? (dv/th)*60 : 0;
  if (document.getElementById('bl-th-gpm')) document.getElementById('bl-th-gpm').textContent  = th.toFixed(3);
  if (document.getElementById('bl-th-time')) document.getElementById('bl-th-time').textContent = tt.toFixed(1) + 's';

  // 1. Clean & Slurry Rate Conversion
  const cClean  = parseFloat(document.getElementById('blconv-cleanrate')?.value)  || 0;
  const cSlurry = parseFloat(document.getElementById('blconv-slurryrate')?.value) || 0;
  const cPpa    = parseFloat(document.getElementById('blconv-ppa')?.value)        || 0;
  const cSg     = parseFloat(document.getElementById('blconv-sg')?.value)         || 2.65;

  const avf   = cSg > 0 ? 1 / (8.34 * cSg) : 0.0452;
  const slurryYield = (cPpa * avf) + 1;
  const cfr   = slurryYield > 0 ? 1 / slurryYield : 1;
  const calcSlurry = cClean * slurryYield;
  const calcClean  = cSlurry * cfr;

  if (document.getElementById('blconv-avf')) document.getElementById('blconv-avf').textContent = avf.toFixed(4);
  if (document.getElementById('blconv-yield')) document.getElementById('blconv-yield').textContent = slurryYield.toFixed(4);
  if (document.getElementById('blconv-cfr')) document.getElementById('blconv-cfr').textContent = cfr.toFixed(4);
  if (document.getElementById('blconv-outslurry')) document.getElementById('blconv-outslurry').textContent = calcSlurry.toFixed(1);
  if (document.getElementById('blconv-outclean')) document.getElementById('blconv-outclean').textContent = calcClean.toFixed(1);

  // 2. Screw Concentration & Total Auger RPM
  const sClean = parseFloat(document.getElementById('blscrew-rate')?.value) || 0;
  const sPpa   = parseFloat(document.getElementById('blscrew-ppa')?.value)  || 0;
  const sPpr   = parseFloat(document.getElementById('blscrew-ppr')?.value)  || 1;
  const sAug1  = parseFloat(document.getElementById('blscrew-aug1')?.value) || 0;
  const sAug2  = parseFloat(document.getElementById('blscrew-aug2')?.value) || 0;
  const sAug3  = parseFloat(document.getElementById('blscrew-aug3')?.value) || 0;

  const reqRpm = sPpr > 0 ? (sClean * sPpa * 42) / sPpr : 0;
  const actRpm = sAug1 + sAug2 + sAug3;
  const screwConc = sClean > 0 ? (actRpm * sPpr) / (sClean * 42) : 0;
  const lbsMin = actRpm * sPpr;
  const propPpm = lbsMin / 3;

  if (document.getElementById('blscrew-reqrpm')) document.getElementById('blscrew-reqrpm').textContent = Math.round(reqRpm).toLocaleString();
  if (document.getElementById('blscrew-actrpm')) document.getElementById('blscrew-actrpm').textContent = Math.round(actRpm).toLocaleString();
  if (document.getElementById('blscrew-outconc')) document.getElementById('blscrew-outconc').textContent = screwConc.toFixed(2);
  if (document.getElementById('blscrew-lbsmin')) document.getElementById('blscrew-lbsmin').textContent = Math.round(lbsMin).toLocaleString();
  if (document.getElementById('blscrew-ppm')) document.getElementById('blscrew-ppm').textContent = propPpm.toFixed(1);

  // 3. Design Clean Rate from Slurry Rate
  const dSlurry = parseFloat(document.getElementById('bldesign-slurryrate')?.value) || 0;
  const dPpa    = parseFloat(document.getElementById('bldesign-ppa')?.value)        || 0;
  const dSg     = parseFloat(document.getElementById('bldesign-sg')?.value)         || 2.65;

  const dDenom = dSg > 0 ? (dPpa / (8.34 * dSg)) + 1 : 1;
  const dClean = dDenom > 0 ? dSlurry / dDenom : 0;

  if (document.getElementById('bldesign-cleanrate')) document.getElementById('bldesign-cleanrate').textContent = dClean.toFixed(1);

  // 4. Split Flow Blender Concentration (CLD)
  const spDesignPpa = parseFloat(document.getElementById('blsplit-designppa')?.value)  || 0;
  const spBlenderR  = parseFloat(document.getElementById('blsplit-blenderrate')?.value) || 1;
  const spTotalR    = parseFloat(document.getElementById('blsplit-totalrate')?.value)   || 1;

  const spRatio     = spTotalR > 0 ? spBlenderR / spTotalR : 1;
  const spBlenderConc = spRatio > 0 ? spDesignPpa / spRatio : 0;

  if (document.getElementById('blsplit-blenderconc')) document.getElementById('blsplit-blenderconc').textContent = spBlenderConc.toFixed(2);

  // 5. Auger PPR & Dry Add Recalibration
  const pAugRad  = parseFloat(document.getElementById('blppr-augerrad')?.value) || 0;
  const pShaftRad= parseFloat(document.getElementById('blppr-shaftrad')?.value) || 0;
  const pPitch   = parseFloat(document.getElementById('blppr-pitch')?.value)    || 0;
  const pBulk    = parseFloat(document.getElementById('blppr-bulkdens')?.value) || 0;

  const theoPpr  = 1.41 * (Math.pow(pAugRad, 2) - Math.pow(pShaftRad, 2)) * pPitch * pBulk / 1728;

  const pOldPpr  = parseFloat(document.getElementById('blppr-oldppr')?.value)   || 0;
  const pActTot  = parseFloat(document.getElementById('blppr-acttotal')?.value) || 0;
  const pDesTot  = parseFloat(document.getElementById('blppr-destotal')?.value) || 1;

  const recalPpr = pDesTot > 0 ? pOldPpr * (pActTot / pDesTot) : pOldPpr;

  if (document.getElementById('blppr-outppr')) document.getElementById('blppr-outppr').textContent = theoPpr.toFixed(2);
  if (document.getElementById('blppr-recalppr')) document.getElementById('blppr-recalppr').textContent = recalPpr.toFixed(2);

  // 6. Metric / Screwless Blender Clean Rate
  const mSlurrym3 = parseFloat(document.getElementById('blmetric-slurrym3')?.value) || 0;
  const mPpakgm3  = parseFloat(document.getElementById('blmetric-ppakgm3')?.value)  || 0;
  const mSg       = parseFloat(document.getElementById('blmetric-sg')?.value)        || 2.65;

  const mDenom    = mSg > 0 ? (mPpakgm3 / (mSg * 999.3524)) + 1 : 1;
  const mCleanm3  = mDenom > 0 ? mSlurrym3 / mDenom : 0;
  const mCleanbpm = mCleanm3 * 6.2898;

  if (document.getElementById('blmetric-cleanm3')) document.getElementById('blmetric-cleanm3').textContent = mCleanm3.toFixed(2);
  if (document.getElementById('blmetric-cleanbpm')) document.getElementById('blmetric-cleanbpm').textContent = mCleanbpm.toFixed(1);
}

function renderBucketTest() {
  const gal    = parseFloat(document.getElementById('bkt-gal').value)    || 0;
  const rate   = parseFloat(document.getElementById('bkt-rate').value)   || 0;
  const gpt    = parseFloat(document.getElementById('bkt-gpt').value)    || 0;
  const actual = parseFloat(document.getElementById('bkt-actual').value) || 1;
  const denom  = rate * 0.042 * gpt;
  const estSec = denom > 0 ? 60 * gal / denom : 0;
  const errorPct = actual > 0 ? ((estSec/actual) - 1) * 100 : 0;
  const newFine  = actual > 0 ? estSec/actual : 1;
  document.getElementById('bkt-est').textContent     = estSec.toFixed(1);
  document.getElementById('bkt-error').textContent   = errorPct.toFixed(1) + '%';
  document.getElementById('bkt-newfine').textContent = newFine.toFixed(2);
}

function blStartStop() {
  if (blRun) {
    blRun = false; clearInterval(blTmr);
    document.getElementById('bl-ss-btn').textContent = '▶ Start';
    document.getElementById('bl-ss-btn').style.background = 'var(--brand)';
    blCalc();
  } else {
    blEl = 0;
    document.getElementById('bl-results').classList.add('hidden');
    blRun = true;
    document.getElementById('bl-ss-btn').textContent = '⬛ Stop';
    document.getElementById('bl-ss-btn').style.background = 'var(--red)';
    const t0 = Date.now();
    blTmr = setInterval(() => {
      blEl = (Date.now()-t0)/1000;
      document.getElementById('bl-timer').textContent = blEl.toFixed(1) + 's';
      document.getElementById('bl-timer').style.color = 'var(--brand)';
    }, 100);
  }
}

function blReset() {
  blRun = false; clearInterval(blTmr); blEl = 0;
  document.getElementById('bl-timer').textContent = '0.0s';
  document.getElementById('bl-timer').style.color = 'var(--text)';
  document.getElementById('bl-ss-btn').textContent = '▶ Start';
  document.getElementById('bl-ss-btn').style.background = 'var(--brand)';
  document.getElementById('bl-results').classList.add('hidden');
}

function blCalc() {
  if (blEl <= 0) return;
  const bv = parseFloat(document.getElementById('bl-bucket').value) || 0.264;
  const r  = parseFloat(document.getElementById('bl-rate').value)   || 0;
  const g  = parseFloat(document.getElementById('bl-gpt').value)    || 0;
  const measured = (bv / blEl) * 60;
  const target   = blThGPM();
  const errPct   = target > 0 ? ((measured - target) / target) * 100 : 0;
  const baseGPM  = F.gpm(r, g, 1);
  const recFine  = baseGPM > 0 ? measured / baseGPM : 1;
  document.getElementById('bl-r-target').textContent   = target.toFixed(3);
  document.getElementById('bl-r-measured').textContent = measured.toFixed(3);
  const eEl = document.getElementById('bl-r-error');
  eEl.textContent = errPct.toFixed(1) + '%';
  eEl.style.color = Math.abs(errPct) > 5 ? 'var(--red)' : 'var(--brand)';
  document.getElementById('bl-r-fine').textContent = recFine.toFixed(3);
  document.getElementById('bl-results').classList.remove('hidden');
}

// ================================================================
// LIME
// ================================================================

function updateAnalogRanges() {
  const sel = document.getElementById('analog-device');
  const opt = sel.options[sel.selectedIndex];
  document.getElementById('analog-min').value = opt.dataset.min;
  document.getElementById('analog-max').value = opt.dataset.max;
  renderAnalogScaled();
}

function renderAnalogScaled() {
  const minS = parseFloat(document.getElementById('analog-min').value) || 0;
  const maxS = parseFloat(document.getElementById('analog-max').value) || 750;
  const raw  = parseFloat(document.getElementById('analog-raw').value)  || 4;
  const fine = parseFloat(document.getElementById('analog-fine').value) || 1.0;
  const minMa = 4, maxMa = 20;
  const scaled = ((maxS - minS) / (maxMa - minMa)) * (raw - minMa) + minS;
  document.getElementById('analog-result').textContent = (scaled * fine).toFixed(1);
}

function renderLIME() {
  const sc = parseFloat(document.getElementById('lime-scale').value) || 1;
  const fn = parseFloat(document.getElementById('lime-fine').value)  || 1;
  document.getElementById('lime-mult').textContent = (sc*fn).toFixed(3);

  const pv = document.getElementById('lime-profile').value;
  const isC = pv === 'custom';
  document.getElementById('lime-custom-wrap').classList.toggle('hidden', !isC);
  const k = isC ? (parseFloat(document.getElementById('lime-k-custom').value)||850) : parseFloat(pv);
  document.getElementById('lime-k-disp').textContent = k.toFixed(0);

  const hz  = parseFloat(document.getElementById('lime-freq').value) || 0;
  const gpm = (hz / k) * 60;
  document.getElementById('lime-gpm').textContent = gpm.toFixed(2);

  // Pressure Transducer Dual Converter
  const trRating = parseFloat(document.getElementById('transducer-rating')?.value) || 15000;
  const trInPsi  = parseFloat(document.getElementById('transducer-inputpsi')?.value) || 0;
  const trInMa   = parseFloat(document.getElementById('transducer-inputma')?.value)  || 4;
  const trOutMa  = (trInPsi / trRating) * 16 + 4;
  const trOutPsi = Math.max(0, (trInMa - 4) / 16) * trRating;
  if (document.getElementById('transducer-outma')) document.getElementById('transducer-outma').textContent = trOutMa.toFixed(2);
  if (document.getElementById('transducer-outpsi')) document.getElementById('transducer-outpsi').textContent = Math.round(trOutPsi).toLocaleString();

  // Frequency & Pinion Speed Calculator
  const fcHz     = parseFloat(document.getElementById('freqcalc-hz')?.value)    || 0;
  const fcTeeth  = parseFloat(document.getElementById('freqcalc-teeth')?.value) || 60;
  const fcRatio  = parseFloat(document.getElementById('freqcalc-ratio')?.value) || 1;
  const fcPinion = fcTeeth > 0 ? (fcHz * 60) / fcTeeth : 0;
  const fcEngine = fcPinion * fcRatio;
  if (document.getElementById('freqcalc-pinion')) document.getElementById('freqcalc-pinion').textContent = Math.round(fcPinion).toLocaleString();
  if (document.getElementById('freqcalc-engine')) document.getElementById('freqcalc-engine').textContent = Math.round(fcEngine).toLocaleString();

  // K-Factor Recalibration
  const krOld   = parseFloat(document.getElementById('krecal-old')?.value)   || 0;
  const krMicro = parseFloat(document.getElementById('krecal-micro')?.value) || 0;
  const krMag   = parseFloat(document.getElementById('krecal-mag')?.value)   || 1;
  const krNew   = krMag > 0 ? krOld * (krMicro / krMag) : krOld;
  if (document.getElementById('krecal-new')) document.getElementById('krecal-new').textContent = krNew.toFixed(1);
}

// ================================================================
// WELLBORE
// ================================================================

function renderWellbore() {
  const tvd     = parseFloat(document.getElementById('wb-tvd').value)     || 0;
  const perf    = parseFloat(document.getElementById('wb-perf').value)    || 0;
  const dens    = parseFloat(document.getElementById('wb-density').value) || 8.33;
  const cid     = parseFloat(document.getElementById('wb-id').value)      || 4.778;
  const treat   = parseFloat(document.getElementById('wb-treating').value)|| 0;
  const frict   = parseFloat(document.getElementById('wb-friction').value)|| 0;
  const tubType = document.getElementById('wb-tubular').value;
  const tub     = TUBULAR_DATA.find(t=>t.type===tubType) || TUBULAR_DATA[7];

  const hydro   = F.hydrostatic(dens, tvd);
  const flush   = F.flushVol(perf, cid);
  const bhp     = F.bhp(treat, hydro, frict);

  document.getElementById('wb-hydro').textContent    = Math.round(hydro).toLocaleString();
  document.getElementById('wb-capacity').textContent = flush.toFixed(2);
  document.getElementById('wb-factor').textContent   = tub.factor.toFixed(4);
  document.getElementById('wb-bhp').textContent      = Math.round(bhp).toLocaleString();

  // Tubular Capacity, Displacement & Metal Volume
  const tOd   = parseFloat(document.getElementById('tubular-od')?.value) || 0;
  const tId   = parseFloat(document.getElementById('tubular-id')?.value) || 0;
  const tLen  = parseFloat(document.getElementById('tubular-length')?.value) || 0;
  const tCapBbl = tId > 0 ? Math.pow(tId, 2) / 1029.44 : 0;
  const tCapGal = tId > 0 ? Math.pow(tId, 2) / 24.509 : 0;
  const tDispBbl = (tOd > tId) ? (Math.pow(tOd, 2) - Math.pow(tId, 2)) / 1029.44 : 0;
  const tTotCap = tCapBbl * tLen;
  const tTotDisp = tDispBbl * tLen;

  if (document.getElementById('tubular-capbblft')) document.getElementById('tubular-capbblft').textContent = tCapBbl.toFixed(4);
  if (document.getElementById('tubular-capgalft')) document.getElementById('tubular-capgalft').textContent = tCapGal.toFixed(3);
  if (document.getElementById('tubular-dispbblft')) document.getElementById('tubular-dispbblft').textContent = tDispBbl.toFixed(4);
  if (document.getElementById('tubular-totcap')) document.getElementById('tubular-totcap').textContent = tTotCap.toFixed(1);
  if (document.getElementById('tubular-totdisp')) document.getElementById('tubular-totdisp').textContent = tTotDisp.toFixed(1);

  // Equivalent Mud Weight (EMW) & Surface Pressure
  const emwStp    = parseFloat(document.getElementById('emw-stp')?.value) || 0;
  const emwTvd    = parseFloat(document.getElementById('emw-tvd')?.value) || 1;
  const emwDens   = parseFloat(document.getElementById('emw-density')?.value) || 8.33;
  const emwTarget = parseFloat(document.getElementById('emw-target')?.value) || 0;
  const emwHydro  = emwDens * emwTvd * 0.05195;
  const emwGrad   = emwDens * 0.05195;
  const emwCalc   = emwDens + (emwTvd > 0 ? emwStp / (emwTvd * 0.05195) : 0);
  const emwReqStp = (emwTarget - emwDens) * emwTvd * 0.05195;

  if (document.getElementById('emw-hydro')) document.getElementById('emw-hydro').textContent = Math.round(emwHydro).toLocaleString();
  if (document.getElementById('emw-grad')) document.getElementById('emw-grad').textContent = emwGrad.toFixed(3);
  if (document.getElementById('emw-calculated')) document.getElementById('emw-calculated').textContent = emwCalc.toFixed(2);
  if (document.getElementById('emw-reqstp')) document.getElementById('emw-reqstp').textContent = Math.round(emwReqStp).toLocaleString();

  // Overflush / Underflush & Top of Sand / PBTD
  const flPerf   = parseFloat(document.getElementById('flushcalc-perfdepth')?.value) || 0;
  const flCap    = parseFloat(document.getElementById('flushcalc-capbblft')?.value) || 0;
  const flPumped = parseFloat(document.getElementById('flushcalc-pumpedflush')?.value) || 0;
  const flSand   = parseFloat(document.getElementById('flushcalc-sandlbs')?.value) || 0;
  const flBulk   = parseFloat(document.getElementById('flushcalc-bulkdens')?.value) || 105;
  const flReq    = flPerf * flCap;
  const flDiff   = flPumped - flReq;
  const flSandHeight = (flCap > 0 && flBulk > 0) ? flSand / (flCap * 5.61458 * flBulk) : 0;
  const flTopSand   = flPerf - flSandHeight;

  if (document.getElementById('flushcalc-reqflush')) document.getElementById('flushcalc-reqflush').textContent = flReq.toFixed(1);
  if (document.getElementById('flushcalc-variance')) {
    const varTxt = flDiff >= 0 ? `+${flDiff.toFixed(1)} BBL (Overflush)` : `${flDiff.toFixed(1)} BBL (Underflush)`;
    document.getElementById('flushcalc-variance').textContent = varTxt;
    document.getElementById('flushcalc-variance').style.color = flDiff >= 0 ? 'var(--brand)' : 'var(--yellow)';
  }
  if (document.getElementById('flushcalc-sandheight')) document.getElementById('flushcalc-sandheight').textContent = flSandHeight.toFixed(1);
  if (document.getElementById('flushcalc-topofsand')) document.getElementById('flushcalc-topofsand').textContent = flTopSand.toFixed(1);

  // Perforation Pressure Drop & Active Perfs Solver
  const pfRate  = parseFloat(document.getElementById('perfcalc-rate')?.value) || 0;
  const pfDens  = parseFloat(document.getElementById('perfcalc-dens')?.value) || 8.33;
  const pfN     = parseFloat(document.getElementById('perfcalc-nperfs')?.value) || 1;
  const pfDiam  = parseFloat(document.getElementById('perfcalc-diam')?.value) || 0.42;
  const pfCd    = parseFloat(document.getElementById('perfcalc-cd')?.value) || 0.95;
  const pfMeas  = parseFloat(document.getElementById('perfcalc-measfrict')?.value) || 0;

  const pfDrop  = (pfN > 0 && pfDiam > 0 && pfCd > 0) ? (0.2369 * pfDens * Math.pow(pfRate, 2)) / (Math.pow(pfN, 2) * Math.pow(pfDiam, 4) * Math.pow(pfCd, 2)) : 0;
  const pfSolvedN = (pfMeas > 0 && pfDiam > 0 && pfCd > 0) ? Math.sqrt((0.2369 * pfDens * Math.pow(pfRate, 2)) / (pfMeas * Math.pow(pfDiam, 4) * Math.pow(pfCd, 2))) : 0;

  if (document.getElementById('perfcalc-outdrop')) document.getElementById('perfcalc-outdrop').textContent = Math.round(pfDrop).toLocaleString();
  if (document.getElementById('perfcalc-solvedn')) document.getElementById('perfcalc-solvedn').textContent = pfSolvedN.toFixed(1);

  // Surface Treating Pressure (STP) Predictor
  const stpBhp   = parseFloat(document.getElementById('stp-bhp')?.value) || 0;
  const stpDens  = parseFloat(document.getElementById('stp-density')?.value) || 8.33;
  const stpTvd   = parseFloat(document.getElementById('stp-tvd')?.value) || 0;
  const stpPipe  = parseFloat(document.getElementById('stp-pipefrict')?.value) || 0;
  const stpPerf  = parseFloat(document.getElementById('stp-perffrict')?.value) || 0;

  const stpHydro = stpDens * stpTvd * 0.05195;
  const stpCalc  = stpBhp - stpHydro + stpPipe + stpPerf;

  if (document.getElementById('stp-hydro')) document.getElementById('stp-hydro').textContent = Math.round(stpHydro).toLocaleString();
  if (document.getElementById('stp-calculated')) document.getElementById('stp-calculated').textContent = Math.round(stpCalc).toLocaleString();

  // Friction Loss Breakdown
  const frRate  = parseFloat(document.getElementById('frict-rate')?.value)  || 0;
  const frDens  = parseFloat(document.getElementById('frict-dens')?.value)  || 8.33;
  const frDepth = parseFloat(document.getElementById('frict-depth')?.value) || 0;
  const frId    = parseFloat(document.getElementById('frict-id')?.value)    || 4.778;
  const frFPipe = parseFloat(document.getElementById('frict-fpipe')?.value) || 0.00018;
  const frFPerf = parseFloat(document.getElementById('frict-fperf')?.value) || 0.08;

  const pipeFrict = frFPipe * (frDens * Math.pow(frRate,2) / Math.pow(frId,4)) * (frDepth / frId);
  const perfFrict = frFPerf * Math.pow(frRate,2);
  const totalFrict = pipeFrict + perfFrict;

  if (document.getElementById('frict-pipeval')) document.getElementById('frict-pipeval').textContent = Math.round(pipeFrict).toLocaleString();
  if (document.getElementById('frict-perfval')) document.getElementById('frict-perfval').textContent = Math.round(perfFrict).toLocaleString();
  if (document.getElementById('frict-totalval')) document.getElementById('frict-totalval').textContent = Math.round(totalFrict).toLocaleString();

  // Back-calculate f_pipe
  const frMeasPipe = parseFloat(document.getElementById('frict-measuredpipe')?.value) || 0;
  const denom = (frDens * Math.pow(frRate,2) / Math.pow(frId,4)) * (frDepth / frId);
  const solvedFPipe = denom > 0 ? frMeasPipe / denom : 0;
  if (document.getElementById('frict-solvedfpipe')) document.getElementById('frict-solvedfpipe').textContent = solvedFPipe.toFixed(6);

  // Well Control & Fracture Pressure
  const wcFormPress = parseFloat(document.getElementById('wellctrl-formpress')?.value) || 0;
  const wcTvd       = parseFloat(document.getElementById('wellctrl-tvd')?.value)       || 1;
  const wcGrad      = parseFloat(document.getElementById('wellctrl-grad')?.value)      || 0.75;

  const killMud  = wcTvd > 0 ? wcFormPress / (wcTvd * 0.05195) : 0;
  const fracPress = wcGrad * wcTvd;
  const reqIsip   = fracPress - (8.33 * wcTvd * 0.05195);

  if (document.getElementById('wellctrl-killmud')) document.getElementById('wellctrl-killmud').textContent = killMud.toFixed(2);
  if (document.getElementById('wellctrl-fracpress')) document.getElementById('wellctrl-fracpress').textContent = Math.round(fracPress).toLocaleString();
  if (document.getElementById('wellctrl-reqisip')) document.getElementById('wellctrl-reqisip').textContent = Math.round(reqIsip).toLocaleString();
}

function renderFracGradient() {
  const isip    = parseFloat(document.getElementById('fg-isip').value)    || 0;
  const tvd     = parseFloat(document.getElementById('fg-tvd').value)     || 0;
  const dens    = parseFloat(document.getElementById('fg-density').value) || 8.33;
  const closure = parseFloat(document.getElementById('fg-closure').value) || 0;
  const hydro = dens * tvd * 0.05195;
  const grad  = tvd > 0 ? (isip / tvd) + 0.433 : 0;
  const net   = isip + hydro - closure;
  document.getElementById('fg-grad').textContent = grad.toFixed(2);
  document.getElementById('fg-net').textContent  = Math.round(net).toLocaleString();
}

function renderPropLeft() {
  const slurry = parseFloat(document.getElementById('pl-slurry').value) || 0;
  const conc   = parseFloat(document.getElementById('pl-conc').value)   || 0;
  const sg     = parseFloat(document.getElementById('pl-sg').value)     || 2.65;
  const left = (conc + 1) > 0 ? (slurry * conc * 42) / ((conc + 1) * (sg * 8.33)) : 0;
  document.getElementById('pl-result').textContent = Math.round(left).toLocaleString();
}

// ================================================================
// HP
// ================================================================

const GEAR_RATIOS = {
  'TH55-E70': {1:6.248, 2:4.585, 3:3.378, 4:2.484, 5:1.831, 6:1.357, 7:1.000},
  'CX48':     {1:3.339, 2:2.453, 3:2.200, 4:1.808, 5:1.616, 6:1.359, 7:1.191, 8:0.999},
  'Allison':  {1:3.75,  2:2.69,  3:2.20,  4:1.77,  5:1.58,  6:1.27,  7:1.00,  8:0.72},
  'TH55-E90': {1:4.672, 2:3.429, 3:3.029, 4:2.526, 5:2.222, 6:1.849, 7:1.638, 8:1.357, 9:1.000},
  'TH350':    {1:2.52,  2:1.52,  3:1.00},
};

const PUMP_SPECS = {
  'SPM_TWS_2250': { bore:4.5, stroke:8,  plungers:3, bblPerRev:0.0393, maxPsi:15000 },
  'SPM_TWS_2500': { bore:4.5, stroke:10, plungers:3, bblPerRev:0.0492, maxPsi:15000 },
  'CAT_WS255':    { bore:4.5, stroke:8,  plungers:5, bblPerRev:0.0656, maxPsi:12100 },
  'GD_2500Q':     { bore:4.5, stroke:8,  plungers:5, bblPerRev:0.0656, maxPsi:12400 },
};

function renderHoseCounts() {
  const clean = parseFloat(document.getElementById('hose-clean').value) || 0;
  const dirty = parseFloat(document.getElementById('hose-dirty').value) || 0;
  document.getElementById('hose-suction').textContent   = Math.ceil(clean/10);
  document.getElementById('hose-discharge').textContent = Math.ceil(dirty/15);
}

function updateTransGearOptions() {
  const type = document.getElementById('trans-type').value;
  const gears = Object.keys(GEAR_RATIOS[type] || {});
  const ord = n => n==1?'1st':n==2?'2nd':n==3?'3rd':`${n}th`;
  document.getElementById('trans-gear').innerHTML = gears.map(g => `<option value="${g}">${ord(g)}</option>`).join('');
  renderTransmission();
}

function renderTransmission() {
  const type = document.getElementById('trans-type').value;
  const gear = parseInt(document.getElementById('trans-gear').value);
  const engineRpm = parseFloat(document.getElementById('trans-engine').value) || 0;
  const ratio = (GEAR_RATIOS[type] && GEAR_RATIOS[type][gear]) || 1;
  document.getElementById('trans-output').textContent = Math.round(engineRpm/ratio).toLocaleString();
}

function renderPumpRate() {
  const type = document.getElementById('pumprate-type').value;
  const eff  = parseFloat(document.getElementById('pumprate-eff').value) || 100;
  const peRpm = parseFloat(document.getElementById('pumprate-pe').value)  || 0;
  const spec = PUMP_SPECS[type] || PUMP_SPECS['SPM_TWS_2250'];
  const rate = (eff/100) * spec.bblPerRev * peRpm;
  document.getElementById('pumprate-bpm').textContent = rate.toFixed(1);
  document.getElementById('pumprate-psi').textContent = spec.maxPsi.toLocaleString();
}

function renderHP() {
  const rate       = parseFloat(document.getElementById('hp-rate').value)  || 0;
  const psi        = parseFloat(document.getElementById('hp-psi').value)   || 0;
  const pumps      = parseInt(document.getElementById('hp-pumps').value)   || 1;
  const totPumps   = parseInt(document.getElementById('hp-totalpumps')?.value) || pumps;
  const hpRating   = parseFloat(document.getElementById('hp-rating')?.value)   || 2500;
  const mechEff    = parseFloat(document.getElementById('hp-mecheff')?.value)  || 90;

  S.cleanRate = rate;
  const total = F.hhp(rate, psi);
  const perP  = pumps > 0 ? total/pumps : 0;
  const locAvailHhp = totPumps * hpRating;
  const activeFleetCap = pumps * hpRating;
  const activeLoad = activeFleetCap > 0 ? (total / activeFleetCap) * 100 : 0;
  const totalLoad  = locAvailHhp > 0 ? (total / locAvailHhp) * 100 : 0;
  const reqBhp     = (mechEff > 0) ? total / (mechEff / 100) : total;

  document.getElementById('hp-total').textContent    = F.c(total);
  document.getElementById('hp-rate-lbl').textContent = `Based on ${rate.toFixed(1)} BPM load`;
  if (document.getElementById('hp-per')) document.getElementById('hp-per').textContent = F.c(perP);
  if (document.getElementById('hp-reqbhp')) document.getElementById('hp-reqbhp').textContent = F.c(reqBhp);
  if (document.getElementById('hp-locavailable')) document.getElementById('hp-locavailable').textContent = F.c(locAvailHhp);
  if (document.getElementById('hp-activeload')) document.getElementById('hp-activeload').textContent = activeLoad.toFixed(1) + '%';
  if (document.getElementById('hp-totalload')) document.getElementById('hp-totalload').textContent = totalLoad.toFixed(1) + '%';

  // Engine Torque ↔ HP
  const tRpm  = parseFloat(document.getElementById('torque-rpm')?.value)  || 0;
  const tLbFt = parseFloat(document.getElementById('torque-lbft')?.value) || 0;
  const tBhp  = tRpm > 0 ? (tLbFt * tRpm) / 5252 : 0;
  if (document.getElementById('torque-outbhp')) document.getElementById('torque-outbhp').textContent = Math.round(tBhp).toLocaleString();

  const tInHp   = parseFloat(document.getElementById('torque-inputhp')?.value) || 0;
  const tOutLbFt = tRpm > 0 ? (tInHp * 5252) / tRpm : 0;
  if (document.getElementById('torque-outlbft')) document.getElementById('torque-outlbft').textContent = Math.round(tOutLbFt).toLocaleString();

  // Pump Displacement & Crank Speed
  const pdBore    = parseFloat(document.getElementById('pumpdisp-bore')?.value)     || 4.5;
  const pdStroke  = parseFloat(document.getElementById('pumpdisp-stroke')?.value)   || 8;
  const pdPlungers= parseInt(document.getElementById('pumpdisp-plungers')?.value)   || 3;
  const pdPinion  = parseFloat(document.getElementById('pumpdisp-pinion')?.value)   || 0;
  const pdRatio   = parseFloat(document.getElementById('pumpdisp-ratio')?.value)    || 6.353;
  const pdEff     = parseFloat(document.getElementById('pumpdisp-eff')?.value)      || 95;

  const bblPerRev = pdPlungers * (Math.PI * Math.pow(pdBore, 2) * pdStroke / 38808);
  const crankSpeed = pdRatio > 0 ? pdPinion / pdRatio : 0;
  const pumpBpm   = (pdEff / 100) * bblPerRev * crankSpeed;

  if (document.getElementById('pumpdisp-bblrev')) document.getElementById('pumpdisp-bblrev').textContent = bblPerRev.toFixed(4);
  if (document.getElementById('pumpdisp-crank')) document.getElementById('pumpdisp-crank').textContent = crankSpeed.toFixed(1);
  if (document.getElementById('pumpdisp-bpm')) document.getElementById('pumpdisp-bpm').textContent = pumpBpm.toFixed(1);

  // Iron Rate Limit & Max Pressure
  const ilId   = parseFloat(document.getElementById('ironlim-id')?.value)   || 3.0;
  const ilHhp  = parseFloat(document.getElementById('ironlim-hhp')?.value)  || 0;
  const ilRate = parseFloat(document.getElementById('ironlim-rate')?.value) || 1;

  const maxRateLine = 2 * Math.pow(ilId, 2);
  const maxPsiAtRate = ilRate > 0 ? (ilHhp * 40.8) / ilRate : 0;

  if (document.getElementById('ironlim-maxrate')) document.getElementById('ironlim-maxrate').textContent = maxRateLine.toFixed(1);
  if (document.getElementById('ironlim-maxpsi')) document.getElementById('ironlim-maxpsi').textContent = Math.round(maxPsiAtRate).toLocaleString();

  updateGORange();
  // Sync with chem/hydration
  document.getElementById('ch-rate').value = rate;
  renderChem();
  renderHydration();
}

// ================================================================
// GEAR OPTIMIZER
// ================================================================

function goCurrentGears() {
  return document.getElementById('go-extreme').checked ? [...BASE_GEARS,...EXTRA_GEARS] : [...BASE_GEARS];
}

function updateGORange() {
  const pumps = parseInt(document.getElementById('go-pumps').value) || 14;
  const gears = goCurrentGears();
  const rates = gears.map(g=>g[1]);
  document.getElementById('go-range').textContent =
    `Range: ${(pumps*Math.min(...rates)).toFixed(1)} – ${(pumps*Math.max(...rates)).toFixed(1)} BPM`;
}

function goPumps(n) {
  document.getElementById('go-pumps').value = n;
  document.querySelectorAll('.quick-btn').forEach(b => b.classList.toggle('sel', parseInt(b.textContent)===n));
  updateGORange();
}

function gearOrd(g) { return g===1?'1st':g===2?'2nd':g===3?'3rd':`${g}th`; }
function gearLabel(g) { return `${gearOrd(g)} Gear`; }

function goSolve(numPumps, target, gears) {
  const candidates = [];
  const counts = {};

  function bt(idx, rem, rate) {
    if (idx === gears.length) {
      if (rem !== 0) return;
      let mid=0, minG=999, maxG=0, used=0;
      for (const [g,c] of Object.entries(counts)) {
        const gc=+g, cnt=+c;
        if (cnt>0) { used++; if(gc>=4&&gc<=6) mid+=cnt; minG=Math.min(minG,gc); maxG=Math.max(maxG,gc); }
      }
      const spread = used>0 ? maxG-minG : 0;
      const midPct = (mid/numPumps)*100;
      const err    = Math.abs(rate-target);
      const score  = err*1200 + spread*25 + used*12 - midPct*4;
      candidates.push({ gearCounts:{...counts}, achievedRate:rate, error:err, spread, numTypes:used, midCount:mid, midPct, score });
      return;
    }
    const [g,r] = gears[idx];
    for (let c=0; c<=rem; c++) { counts[g]=c; bt(idx+1, rem-c, rate+c*r); }
    counts[g]=0;
  }

  bt(0, numPumps, 0);
  return candidates.sort((a,b)=>a.score-b.score).slice(0,5);
}

let goSols = [], goSelIdx = 0;

function goRun() {
  const pumps  = parseInt(document.getElementById('go-pumps').value)  || 14;
  const target = parseFloat(document.getElementById('go-target').value) || 100;
  const gears  = goCurrentGears();
  const btn    = document.getElementById('go-btn');
  btn.textContent = '⏳ Calculating…'; btn.disabled = true;
  setTimeout(() => {
    goSols   = goSolve(pumps, target, gears);
    goSelIdx = 0;
    btn.textContent = '⚡ Optimize'; btn.disabled = false;
    if (!goSols.length) { alert('No valid distribution found. Try adjusting the target.'); return; }
    goDisplay(pumps, target);
    document.getElementById('go-results').classList.remove('hidden');
  }, 10);
}

function goDisplay(numPumps, target) {
  const best = goSols[goSelIdx];

  document.getElementById('go-achieved').textContent = best.achievedRate.toFixed(1);

  const errEl = document.getElementById('go-err-badge');
  if (best.error < 0.05) {
    errEl.innerHTML = `<span class="badge badge-green">✓ EXACT MATCH</span>`;
  } else {
    const dir = best.achievedRate > target ? 'over' : 'under';
    errEl.innerHTML = `<span class="badge badge-yellow">${best.error.toFixed(1)} BPM ${dir}</span>`;
  }

  document.getElementById('go-midband').textContent = `${Math.round(best.midPct)}%`;

  // Distribution table
  const rows = [];
  for (let g=1; g<=9; g++) {
    const cnt = best.gearCounts[g] || 0;
    if (!cnt) continue;
    const isMid = g>=4 && g<=6;
    const rate  = ALL_GEAR_RATES[g] || 0;
    const pct   = Math.round((cnt/numPumps)*100);
    rows.push(`<tr class="${isMid?'gear-mid-row':''}">
      <td style="font-weight:700;padding:9px 6px;">${gearLabel(g)}</td>
      <td class="tbl-right font-display" style="font-weight:900;color:${isMid?'var(--brand)':'var(--text)'};padding:9px 6px;">${cnt}</td>
      <td class="tbl-right" style="color:var(--text2);font-family:monospace;padding:9px 6px;">${rate.toFixed(1)}</td>
      <td class="tbl-right" style="font-family:monospace;font-weight:600;padding:9px 6px;">${(cnt*rate).toFixed(1)}</td>
      <td class="tbl-right" style="color:var(--text2);font-family:monospace;padding:9px 6px;">${pct}%</td>
    </tr>`);
  }
  document.getElementById('go-tbl').innerHTML = rows.join('');

  // Alternatives
  if (goSols.length > 1) {
    document.getElementById('go-alts-wrap').classList.remove('hidden');
    document.getElementById('go-alts').innerHTML = goSols.slice(1,4).map((sol,i) => {
      const sum = Object.entries(sol.gearCounts)
        .filter(([,c])=>c>0).sort(([a],[b])=>+a-+b)
        .map(([g,c])=>`${c}×${gearOrd(+g)}`).join(', ');
      const sel = goSelIdx === i+1;
      return `<div class="alt-card${sel?' sel':''}" onclick="goSel(${i+1},${numPumps},${target})">
        <div>
          <div style="font-size:15px;font-weight:700;">${sol.achievedRate.toFixed(1)} BPM</div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px;">${sum}</div>
        </div>
        <div class="text-right">
          <div class="lbl" style="margin:0 0 2px;">MID-BAND</div>
          <div class="font-display" style="font-size:20px;font-weight:900;color:var(--brand);">${Math.round(sol.midPct)}%</div>
        </div>
      </div>`;
    }).join('');
  } else {
    document.getElementById('go-alts-wrap').classList.add('hidden');
  }

  // Field notes
  const notes = [];
  const mp = Math.round(best.midPct);
  notes.push(best.midPct >= 70
    ? `Excellent mid-band concentration — ${mp}% of pumps in 4th–6th gear. Very easy to fine-tune rate on the fly.`
    : `Good balance with ${mp}% in the preferred 4th–6th band.`);
  if (best.spread <= 2)      notes.push(`Very tight spread (${best.spread} gears) — ideal for location monitoring.`);
  else if (best.spread <= 4) notes.push(`Manageable spread of ${best.spread} gears.`);
  if ((best.gearCounts[8]||0)>0 || (best.gearCounts[9]||0)>0)
    notes.push(`⚠️ Extreme gears active. Only approved for critical rate situations.`);
  notes.push(`Assign the largest group to one pump line or color-code for quick visual checks on location.`);

  document.getElementById('go-notes').innerHTML = notes.map(n =>
    `<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;">
       <span style="color:var(--brand);font-size:12px;flex-shrink:0;margin-top:1px;">✓</span>
       <span style="font-size:12px;font-weight:500;color:var(--text);line-height:1.4;">${n}</span>
     </div>`).join('');
}

function goSel(idx, pumps, target) { goSelIdx = idx; goDisplay(pumps, target); }

// ================================================================
// UTILITIES
// ================================================================

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function bindAll(id, fn) {
  const el = document.getElementById(id);
  if (el) { el.addEventListener('input', fn); el.addEventListener('change', fn); }
}

// ================================================================
// INIT
// ================================================================

function init() {
  loadS();
  loadSettings();
  applySettings();
  loadFavorites();
  buildNav();
  ensureToolFavoriteUI();

  // Math
  updateConvUnits();
  renderAcronyms();
  renderUnitConversionsTable();
  ['conv-val','conv-cat','conv-from','conv-to','rect-len','rect-h','circ-d',
   'tank-l','tank-w','tank-h','cyl-d','cyl-l','capfac-bbl','capfac-ft',
   'force-psi','force-area','velpipe-rate','velpipe-id','hosecalc-size','hosecalc-id','hosecalc-len']
    .forEach(id => bindAll(id, renderMath));
  renderMath();

  // Sand
  renderSand();
  ['bulkcalc-mass','bulkcalc-vol','sandneed-clean','sandneed-ppg','propcalc-ppa','propcalc-sg',
   'propconc-slurryrate','propconc-cleanrate','propconc-sg1','propconc-carrier','propconc-measured','propconc-sg2',
   'ramp-start','ramp-end','ramp-vol','ppr-augr','ppr-shaftr','ppr-pitch','ppr-bulk',
   'pprrecal-old','pprrecal-actual','pprrecal-design','augerrpm-rate','augerrpm-ppg','augerrpm-ppr',
   'multiauger-totalrpm','multiauger-count','multiauger-threshold','jobprop-slurry','jobprop-clean','jobprop-chem']
    .forEach(id => bindAll(id, renderSandTools));
  renderSandTools();

  // Chem
  document.getElementById('ch-rate').value = S.cleanRate;
  bindAll('ch-rate', () => {
    S.cleanRate = getRate();
    saveS();
    const tr = document.getElementById('tub-cleanrate');
    const lr = document.getElementById('lga-rate');
    if (tr) tr.value = S.cleanRate;
    if (lr && !(parseFloat(lr.value) > 0)) lr.value = S.cleanRate;
    renderChem();
    renderHydration();
  });
  ['chemused-start','chemused-end','chemvar-pumped','chemvar-designed','gptgpm-rate','gptgpm-gpt',
   'acidd-vol','acidd-rawpct','acidd-targetpct','acidd-density','buffer-bbl','buffer-gpt',
   'tote-strap','tote-type','tote-bottoms','endstrap-clean','endstrap-gpt','endstrap-start','endstrap-type',
   'toterefill-clean','toterefill-gpt','toterefill-fill','toterefill-bottoms','toterefill-factor',
   'chemcalc-gpm','chemcalc-bpm','chemcalc-totchem','chemcalc-targetgpt',
   'gptppt-gpt','gptppt-density','gptppt-activepct','gptppt-inppt',
   'straprate-inhr','straprate-factor','straprate-cleanbpm',
   'chemsg-sg','chemsg-vol','chemsg-waterppg']
    .forEach(id => bindAll(id, renderChemTools));
  bindAll('hcl-pct',  () => { hclFromPct();  });
  bindAll('hcl-dens', () => { hclFromDens(); });
  renderChCards();
  renderChem();
  renderChemTools();

  // Hydration (Section 4)
  // Prefill rates from shared clean rate when available
  if (S.cleanRate > 0) {
    const tr = document.getElementById('tub-cleanrate');
    const lr = document.getElementById('lga-rate');
    if (tr && !(parseFloat(tr.value) > 0)) tr.value = S.cleanRate;
    if (lr && !(parseFloat(lr.value) > 0)) lr.value = S.cleanRate;
  }
  ['lga-rate','lga-gpt',
   'guar-rate','guar-ppt','guar-ppr',
   'tub-cap','tub-level',
   'lganeed-vol','lganeed-gpt',
   'viscup-vol','viscup-ppt',
   'tubvisc-vol','tubvisc-current','tubvisc-target',
   'designgel-bbl','designgel-ppt',
   'lgatote-strap','lgatote-cap',
   'endlga-startstrap','endlga-cap','endlga-needed','endlga-startvol',
   'toteswap-t1start','toteswap-t1swap','toteswap-t2start','toteswap-totalgel','toteswap-factor']
    .forEach(id => bindAll(id, renderHydration));
  // Keep shared clean rate in sync when tub clean rate changes
  bindAll('tub-cleanrate', () => {
    const r = parseFloat(document.getElementById('tub-cleanrate')?.value) || 0;
    if (r > 0) {
      S.cleanRate = r;
      const ch = document.getElementById('ch-rate');
      if (ch) ch.value = r;
      saveS();
    }
    renderHydration();
  });
  renderHydration();

  // Blender
  ['bl-rate','bl-gpt','bl-fine','bl-bucket','bl-desired',
   'blconv-cleanrate','blconv-slurryrate','blconv-ppa','blconv-sg',
   'blscrew-rate','blscrew-ppa','blscrew-ppr','blscrew-aug1','blscrew-aug2','blscrew-aug3',
   'bldesign-slurryrate','bldesign-ppa','bldesign-sg',
   'blsplit-designppa','blsplit-blenderrate','blsplit-totalrate',
   'blppr-augerrad','blppr-shaftrad','blppr-pitch','blppr-bulkdens','blppr-oldppr','blppr-acttotal','blppr-destotal',
   'blmetric-slurrym3','blmetric-ppakgm3','blmetric-sg'].forEach(id => bindAll(id, renderBlender));
  renderBlender();
  ['bkt-gal','bkt-rate','bkt-gpt','bkt-actual'].forEach(id => bindAll(id, renderBucketTest));
  renderBucketTest();

  // LIME
  ['lime-scale','lime-fine','lime-profile','lime-freq','lime-k-custom',
   'transducer-rating','transducer-inputpsi','transducer-inputma','freqcalc-hz','freqcalc-teeth','freqcalc-ratio',
   'krecal-old','krecal-micro','krecal-mag'].forEach(id => bindAll(id, renderLIME));
  renderLIME();
  ['analog-raw','analog-min','analog-max','analog-fine'].forEach(id => bindAll(id, renderAnalogScaled));
  bindAll('analog-device', updateAnalogRanges);
  renderAnalogScaled();

  // Wellbore
  ['wb-tvd','wb-perf','wb-density','wb-id','wb-treating','wb-friction','wb-tubular',
   'frict-rate','frict-dens','frict-depth','frict-id','frict-fpipe','frict-fperf','frict-measuredpipe',
   'wellctrl-formpress','wellctrl-tvd','wellctrl-grad',
   'tubular-od','tubular-id','tubular-length',
   'emw-stp','emw-tvd','emw-density','emw-target',
   'flushcalc-perfdepth','flushcalc-capbblft','flushcalc-pumpedflush','flushcalc-sandlbs','flushcalc-bulkdens',
   'perfcalc-rate','perfcalc-dens','perfcalc-nperfs','perfcalc-diam','perfcalc-cd','perfcalc-measfrict',
   'stp-bhp','stp-density','stp-tvd','stp-pipefrict','stp-perffrict'].forEach(id => bindAll(id, renderWellbore));
  renderWellbore();
  renderWellCap();
  ['fg-isip','fg-tvd','fg-density','fg-closure'].forEach(id => bindAll(id, renderFracGradient));
  renderFracGradient();
  ['pl-slurry','pl-conc','pl-sg'].forEach(id => bindAll(id, renderPropLeft));
  renderPropLeft();

  // HP
  document.getElementById('hp-rate').value = S.cleanRate;
  bindAll('hp-rate',  renderHP);
  bindAll('hp-psi',   renderHP);
  bindAll('hp-pumps', renderHP);
  ['hp-totalpumps','hp-rating','hp-mecheff','torque-rpm','torque-lbft','torque-inputhp','pumpdisp-bore','pumpdisp-stroke','pumpdisp-plungers',
   'pumpdisp-pinion','pumpdisp-ratio','pumpdisp-eff','ironlim-id','ironlim-hhp','ironlim-rate'].forEach(id => bindAll(id, renderHP));
  renderHP();

  bindAll('hose-clean', renderHoseCounts);
  bindAll('hose-dirty', renderHoseCounts);
  renderHoseCounts();

  bindAll('trans-type',   updateTransGearOptions);
  bindAll('trans-gear',   renderTransmission);
  bindAll('trans-engine', renderTransmission);
  updateTransGearOptions();

  bindAll('pumprate-type', renderPumpRate);
  bindAll('pumprate-eff',  renderPumpRate);
  bindAll('pumprate-pe',   renderPumpRate);
  renderPumpRate();

  // Gear optimizer
  bindAll('go-pumps',  updateGORange);
  bindAll('go-extreme',updateGORange);
  updateGORange();

  // Hearts on all tool cards (after dynamic sand UI is built)
  ensureToolFavoriteUI();

  // Navigate
  nav(S.tab);
}




export function initLegacyApp() {
  if (typeof document === 'undefined') return;
  if (window.__ampedLegacyInit) return;
  window.__ampedLegacyInit = true;
  try {
    init();
  } catch (e) {
    console.error('Legacy app init failed', e);
    window.__ampedLegacyInit = false;
    throw e;
  }
}

export function resetLegacyInitFlag() {
  window.__ampedLegacyInit = false;
}
