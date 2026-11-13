/* ==========================================================================
   Marketing Dashboard Template — engine v1.0
   You should NOT need to edit this file per client. Everything client-specific
   (branding, sheet link, channels, KPIs, charts) lives in /config.js.
   ========================================================================== */
(function () {
  'use strict';

  const CFG = window.DASHBOARD_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  if (!CFG) { document.body.innerHTML = '<p style="padding:32px;font:16px system-ui">config.js is missing or has an error. Open the browser console for details.</p>'; return; }

  /* ------------------------------------------------------------------ icons */
  const ICON = {
    grid: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    chart: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    play: '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    down: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    sortUp: '<path d="m18 15-6-6-6 6"/>',
    sortDown: '<path d="m6 9 6 6 6-6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    panel: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'
  };
  const icon = (n, s = 20) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n] || ICON.grid}</svg>`;

  /* ---------------------------------------------------------- metric library
     BASE metrics are summed straight from sheet columns. DERIVED metrics are
     calculated from the summed totals (so ratios are always correct at any
     date range). Add your own in config.js → metrics: { myMetric: {...} }.   */
  const div = (a, b) => (b ? a / b : null);
  const LIB = {
    spend:        { label: 'Ad Spend',          fmt: 'currency', good: 'neutral' },
    impressions:  { label: 'Impressions',       fmt: 'int',      good: 'up' },
    reach:        { label: 'Reach',             fmt: 'int',      good: 'up' },
    clicks:       { label: 'Clicks',            fmt: 'int',      good: 'up' },
    views:        { label: 'Video Views',       fmt: 'int',      good: 'up' },
    conversions:  { label: 'Conversions',       fmt: 'int',      good: 'up' },
    revenue:      { label: 'Revenue',           fmt: 'currency', good: 'up' },
    sessions:     { label: 'Sessions',          fmt: 'int',      good: 'up' },
    users:        { label: 'Users',             fmt: 'int',      good: 'up' },
    newUsers:     { label: 'New Users',         fmt: 'int',      good: 'up' },
    engagedSessions: { label: 'Engaged Sessions', fmt: 'int',    good: 'up' },
    leads:        { label: 'Leads',             fmt: 'int',      good: 'up' },
    appointments: { label: 'Appointments',      fmt: 'int',      good: 'up' },
    opportunities:{ label: 'Opportunities',     fmt: 'int',      good: 'up' },
    won:          { label: 'Won Deals',         fmt: 'int',      good: 'up' },
    posts:        { label: 'Posts',             fmt: 'int',      good: 'up' },
    engagements:  { label: 'Engagements',       fmt: 'int',      good: 'up' },
    linkClicks:   { label: 'Link Clicks',       fmt: 'int',      good: 'up' },
    followers:    { label: 'New Followers',     fmt: 'int',      good: 'up' },

    ctr:        { label: 'CTR',                 fmt: 'pct',       good: 'up',   needs: ['clicks', 'impressions'],      calc: t => div(t.clicks, t.impressions) },
    cpc:        { label: 'CPC',                 fmt: 'currency2', good: 'down', needs: ['spend', 'clicks'],            calc: t => div(t.spend, t.clicks) },
    cpm:        { label: 'CPM',                 fmt: 'currency2', good: 'down', needs: ['spend', 'impressions'],       calc: t => { const r = div(t.spend, t.impressions); return r == null ? null : r * 1000; } },
    cpa:        { label: 'Cost per Conversion', fmt: 'currency2', good: 'down', needs: ['spend', 'conversions'],       calc: t => div(t.spend, t.conversions) },
    roas:       { label: 'ROAS',                fmt: 'x',         good: 'up',   needs: ['revenue', 'spend'],           calc: t => div(t.revenue, t.spend) },
    cvr:        { label: 'Conversion Rate',     fmt: 'pct',       good: 'up',   needs: ['conversions', 'clicks'],      calc: t => div(t.conversions, t.clicks) },
    aov:        { label: 'Avg. Order Value',    fmt: 'currency2', good: 'up',   needs: ['revenue', 'conversions'],     calc: t => div(t.revenue, t.conversions) },
    cpl:        { label: 'Cost per Lead',       fmt: 'currency2', good: 'down', needs: ['spend', 'leads'],             calc: t => div(t.spend, t.leads) },
    cpv:        { label: 'Cost per View',       fmt: 'currency2', good: 'down', needs: ['spend', 'views'],             calc: t => div(t.spend, t.views) },
    viewRate:   { label: 'View Rate',           fmt: 'pct',       good: 'up',   needs: ['views', 'impressions'],       calc: t => div(t.views, t.impressions) },
    frequency:  { label: 'Frequency',           fmt: 'dec1',      good: 'neutral', needs: ['impressions', 'reach'],    calc: t => div(t.impressions, t.reach) },
    engagedRate:{ label: 'Engagement Rate',     fmt: 'pct',       good: 'up',   needs: ['engagedSessions', 'sessions'],calc: t => div(t.engagedSessions, t.sessions) },
    sessionCvr: { label: 'Session Conv. Rate',  fmt: 'pct',       good: 'up',   needs: ['conversions', 'sessions'],    calc: t => div(t.conversions, t.sessions) },
    newUserShare:{label: 'New User Share',      fmt: 'pct',       good: 'neutral', needs: ['newUsers', 'users'],       calc: t => div(t.newUsers, t.users) },
    leadToAppt: { label: 'Lead → Appointment',  fmt: 'pct',       good: 'up',   needs: ['appointments', 'leads'],      calc: t => div(t.appointments, t.leads) },
    winRate:    { label: 'Win Rate',            fmt: 'pct',       good: 'up',   needs: ['won', 'opportunities'],       calc: t => div(t.won, t.opportunities) },
    leadToWon:  { label: 'Lead → Won',          fmt: 'pct',       good: 'up',   needs: ['won', 'leads'],               calc: t => div(t.won, t.leads) },
    engagementRate: { label: 'Engagement Rate', fmt: 'pct',       good: 'up',   needs: ['engagements', 'reach'],       calc: t => div(t.engagements, t.reach) },
    avgDeal:    { label: 'Avg. Deal Value',     fmt: 'currency',  good: 'up',   needs: ['revenue', 'won'],             calc: t => div(t.revenue, t.won) }
  };
  function getMetric(ch, key) {
    const m = Object.assign({}, LIB[key] || { label: key, fmt: 'int', good: 'up' }, CFG.metrics && CFG.metrics[key], ch && ch.metrics && ch.metrics[key]);
    if (ch && ch.labels && ch.labels[key]) m.label = ch.labels[key];
    m.key = key; return m;
  }
  const isAvail = (keys, ch, key) => { const m = getMetric(ch, key); return m.calc ? (m.needs || []).every(k => keys.has(k)) : keys.has(key); };
  const val = (ch, key, t) => { const m = getMetric(ch, key); return m.calc ? m.calc(t) : (t[key] == null ? 0 : t[key]); };
  const isAdditive = (ch, key) => !getMetric(ch, key).calc;

  /* ------------------------------------------------------------- formatting */
  const _nf = {};
  const NF = (k, o) => _nf[k] || (_nf[k] = new Intl.NumberFormat(CFG.locale || 'en-US', o));
  function fmt(v, type, compact) {
    if (v == null || !isFinite(v)) return '—';
    const cur = CFG.currency || 'USD', a = Math.abs(v);
    switch (type) {
      case 'currency':
        if (compact) return NF('cc' + cur, { style: 'currency', currency: cur, notation: 'compact', maximumFractionDigits: 1 }).format(v);
        return NF('c' + cur + (a >= 1000), { style: 'currency', currency: cur, minimumFractionDigits: a >= 1000 ? 0 : 2, maximumFractionDigits: a >= 1000 ? 0 : 2 }).format(v);
      case 'currency2':
        if (compact && a >= 1000) return NF('cc' + cur, { style: 'currency', currency: cur, notation: 'compact', maximumFractionDigits: 1 }).format(v);
        return NF('c2' + cur + !!compact, { style: 'currency', currency: cur, minimumFractionDigits: compact ? 0 : 2, maximumFractionDigits: 2 }).format(v);
      case 'int':
        return compact ? NF('ic', { notation: 'compact', maximumFractionDigits: 1 }).format(v) : NF('i', { maximumFractionDigits: 0 }).format(v);
      case 'pct': return NF('p' + !!compact, { style: 'percent', minimumFractionDigits: compact ? 0 : 1, maximumFractionDigits: 1 }).format(v);
      case 'x': return v.toFixed(compact ? 1 : 2) + 'x';
      case 'dec1': return v.toFixed(1);
      default: return String(v);
    }
  }

  /* ------------------------------------------------------------------ dates */
  const DAY = 864e5;
  const dayOf = (y, m, d) => Math.floor(Date.UTC(y, m, d) / DAY);
  const dateOfDay = n => new Date(n * DAY);
  const todayNum = () => { const d = new Date(); return dayOf(d.getFullYear(), d.getMonth(), d.getDate()); };
  const isoOf = n => dateOfDay(n).toISOString().slice(0, 10);
  const DF = (k, o) => _nf['d' + k] || (_nf['d' + k] = new Intl.DateTimeFormat(CFG.locale || 'en-US', Object.assign({ timeZone: 'UTC' }, o)));
  const fmtDay = (n, year) => DF('s' + !!year, year ? { month: 'short', day: 'numeric', year: 'numeric' } : { month: 'short', day: 'numeric' }).format(dateOfDay(n));
  const fmtDayLong = n => DF('l', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(dateOfDay(n));
  function rangeLabel(s, e) {
    const sameYear = dateOfDay(s).getUTCFullYear() === dateOfDay(e).getUTCFullYear();
    return sameYear ? `${fmtDay(s)} – ${fmtDay(e, true)}` : `${fmtDay(s, true)} – ${fmtDay(e, true)}`;
  }
  function parseDate(v) {
    if (v == null || v === '') return null;
    if (v instanceof Date) return dayOf(v.getFullYear(), v.getMonth(), v.getDate());
    if (typeof v === 'number') return v > 20000 && v < 80000 ? Math.floor(v) - 25569 : null; // Sheets serial date
    const s = String(v).trim();
    let m = s.match(/^Date\((\d+),\s*(\d+),\s*(\d+)/);                 // gviz JSON
    if (m) return dayOf(+m[1], +m[2], +m[3]);
    m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);                        // 2026-11-04
    if (m) return dayOf(+m[1], +m[2] - 1, +m[3]);
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);                      // 11/4/2026 (set dateOrder:'DMY' for 4/11/2026)
    if (m) return (CFG.dateOrder || 'MDY') === 'DMY' ? dayOf(+m[3], +m[2] - 1, +m[1]) : dayOf(+m[3], +m[1] - 1, +m[2]);
    const t = Date.parse(s);
    if (!isNaN(t)) { const d = new Date(t); return dayOf(d.getFullYear(), d.getMonth(), d.getDate()); }
    return null;
  }
  const num = v => {
    if (typeof v === 'number') return isFinite(v) ? v : 0;
    if (v == null || v === '') return 0;
    const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
    return isFinite(n) ? n : 0;
  };
  const anchor = () => todayNum() - ((CFG.dates && CFG.dates.includeToday) ? 0 : 1);
  const PRESETS = [
    { id: '7d',  label: 'Last 7 days' }, { id: '14d', label: 'Last 14 days' }, { id: '30d', label: 'Last 30 days' },
    { id: '90d', label: 'Last 90 days' }, { id: 'mtd', label: 'Month to date' }, { id: 'lm', label: 'Last month' },
    { id: 'ytd', label: 'Year to date' }
  ];
  function presetRange(id) {
    const a = anchor(), d = dateOfDay(a), y = d.getUTCFullYear(), m = d.getUTCMonth();
    switch (id) {
      case '7d': return [a - 6, a]; case '14d': return [a - 13, a]; case '90d': return [a - 89, a];
      case 'mtd': return [dayOf(y, m, 1), a];
      case 'lm': return [dayOf(y, m - 1, 1), dayOf(y, m, 1) - 1];
      case 'ytd': return [dayOf(y, 0, 1), a];
      default: return [a - 29, a];
    }
  }

  /* ------------------------------------------------------------------ state */
  const CH = (CFG.channels || []).filter(c => c.enabled !== false);
  const HAS_OVERVIEW = CFG.overview !== false;
  const S = {
    route: HAS_OVERVIEW ? 'overview' : (CH[0] && CH[0].id),
    ch: {}, loadedAt: null, loading: false, firstLoad: true, fatal: null,
    range: { preset: (CFG.dates && CFG.dates.default) || '30d', custom: null },
    compare: !(CFG.dates && CFG.dates.compare === false),
    vs: { seg: {}, tables: {} },
    theme: 'light', health: [], density: 'glance', navCollapsed: false, printing: false
  };
  const GLANCE_MIN = 1180;   // below this viewport width the Detailed layout is always used
  const dens = () => (!S.printing && S.density === 'glance' && window.innerWidth >= GLANCE_MIN) ? 'glance' : 'detail';
  const store = {
    key: (CFG.storageKey || 'marketing-dashboard') + '.',
    get(k) { try { return JSON.parse(localStorage.getItem(this.key + k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(this.key + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  function currentRange() {
    let s, e;
    if (S.range.preset === 'custom' && S.range.custom) [s, e] = S.range.custom; else [s, e] = presetRange(S.range.preset);
    if (s > e) e = s;
    const len = e - s + 1;
    return { s, e, len, ps: s - len, pe: s - 1, step: len > 92 ? 7 : 1 };
  }

  /* ---------------------------------------------------------- data adapters */
  async function fetchGviz(tab) {
    const id = CFG.source.sheetId;
    const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(tab)}&_=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} — check the Sheet ID and sharing`);
    const txt = await res.text();
    const m = txt.match(/setResponse\(([\s\S]*)\);?\s*$/);
    if (!m) throw new Error('Sheet is private. Share it as “Anyone with the link → Viewer”, or switch to the Apps Script connection.');
    const j = JSON.parse(m[1]);
    if (j.status === 'error') throw new Error((j.errors && j.errors[0] && (j.errors[0].detailed_message || j.errors[0].message)) || 'Google returned an error');
    const cols = j.table.cols.map((c, i) => (c.label || '').trim() || `col${i}`);
    return j.table.rows.map(r => { const o = {}; cols.forEach((c, i) => { o[c] = r.c && r.c[i] ? r.c[i].v : null; }); return o; });
  }
  const ADAPTERS = {
    async demo(tabs) {
      await sleep(450);
      const data = window.DemoData.generate(CFG, anchor());
      return Object.fromEntries(tabs.map(t => [t, data[t] ? { rows: data[t] } : { error: `No demo data for tab "${t}"` }]));
    },
    async gviz(tabs) {
      const res = await Promise.allSettled(tabs.map(fetchGviz));
      return Object.fromEntries(tabs.map((t, i) => [t, res[i].status === 'fulfilled' ? { rows: res[i].value } : { error: res[i].reason.message || String(res[i].reason) }]));
    },
    async appsscript(tabs) {
      const u = new URL(CFG.source.appsScriptUrl);
      if (CFG.source.token) u.searchParams.set('token', CFG.source.token);
      u.searchParams.set('tabs', tabs.join('|'));
      u.searchParams.set('_', Date.now());
      const res = await fetch(u.toString(), { cache: 'no-store', redirect: 'follow' });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || 'Apps Script returned an error');
      return Object.fromEntries(tabs.map(t => [t, j.tabs && j.tabs[t] ? { rows: j.tabs[t] } : { error: `Tab "${t}" was not found in the spreadsheet` }]));
    }
  };
  const setupProblem = () => {
    const src = CFG.source || {};
    if (src.mode === 'gviz' && (!src.sheetId || /YOUR_/i.test(src.sheetId))) return 'gviz';
    if (src.mode === 'appsscript' && (!src.appsScriptUrl || /YOUR_/i.test(src.appsScriptUrl))) return 'appsscript';
    if (!ADAPTERS[src.mode]) return 'mode';
    return null;
  };

  /* ---------------------------------------------------- normalise sheet rows */
  const normH = s => String(s == null ? '' : s).toLowerCase().replace(/\s+/g, ' ').trim();
  function normalize(ch, rows) {
    const out = { rows: [], keys: new Set(), issues: [], latest: null, earliest: null, total: rows.length };
    if (!rows.length) { out.issues.push({ level: 'error', msg: 'The tab is empty. It needs a header row plus data rows.' }); return out; }
    const hmap = {}; Object.keys(rows[0]).forEach(h => { hmap[normH(h)] = h; });
    const find = n => (n ? hmap[normH(n)] : undefined);
    const C = ch.columns || {};
    const dH = find(C.date);
    if (!dH) { out.issues.push({ level: 'error', msg: `Date column “${C.date}” not found. Headers found: ${Object.keys(rows[0]).slice(0, 8).join(', ')}` }); return out; }
    const map = {};
    Object.keys(C).forEach(k => {
      if (k === 'date') return;
      const h = find(C[k]);
      if (h) { map[k] = h; if (k !== 'dimension' && k !== 'dimension2') out.keys.add(k); }
      else out.issues.push({ level: 'warn', msg: `Column “${C[k]}” (${k}) not found — metrics that need it are hidden.` });
    });
    let bad = 0;
    for (const r of rows) {
      const d = parseDate(r[dH]);
      if (d == null) { bad++; continue; }
      const m = {}; out.keys.forEach(k => { m[k] = num(r[map[k]]); });
      out.rows.push({
        d, m,
        dim: map.dimension ? (String(r[map.dimension] == null ? '' : r[map.dimension]).trim() || '(not set)') : '',
        dim2: map.dimension2 ? (String(r[map.dimension2] == null ? '' : r[map.dimension2]).trim() || '(not set)') : ''
      });
      if (out.latest == null || d > out.latest) out.latest = d;
      if (out.earliest == null || d < out.earliest) out.earliest = d;
    }
    out.hasDim = !!map.dimension; out.hasDim2 = !!map.dimension2;
    if (bad) out.issues.push({ level: 'warn', msg: `${bad} row(s) skipped — date could not be read.` });
    return out;
  }
  function buildHealth() {
    S.health = CH.map(c => {
      const d = S.ch[c.id] || { issues: [], rows: [] };
      const issues = d.issues.slice();
      if (d.error) issues.unshift({ level: 'error', msg: d.error });
      else if (d.latest != null && anchor() - d.latest > (CFG.staleAfterDays || 3)) issues.push({ level: 'warn', msg: `Latest data is ${anchor() - d.latest} days old (${fmtDay(d.latest, true)}).` });
      const level = issues.some(i => i.level === 'error') ? 'error' : issues.length ? 'warn' : 'ok';
      return { id: c.id, label: c.label, tab: c.tab, level, issues, rows: d.rows ? d.rows.length : 0, latest: d.latest };
    });
  }

  /* ------------------------------------------------------------ aggregation */
  const inRange = (rows, s, e) => rows.filter(r => r.d >= s && r.d <= e);
  function sumRows(rows, keys) {
    const t = {}; keys.forEach(k => { t[k] = 0; });
    for (const r of rows) for (const k of keys) t[k] += r.m[k] || 0;
    return t;
  }
  function dayMap(rows, keys) {
    const mp = new Map();
    for (const r of rows) {
      let t = mp.get(r.d); if (!t) { t = {}; keys.forEach(k => { t[k] = 0; }); mp.set(r.d, t); }
      for (const k of keys) t[k] += r.m[k] || 0;
    }
    return mp;
  }
  function seriesOf(mp, keys, start, end, step, fn) {
    const out = [];
    for (let b = start; b <= end; b += step) {
      const t = {}; keys.forEach(k => { t[k] = 0; });
      let any = false;
      for (let d = b; d < b + step && d <= end; d++) { const x = mp.get(d); if (x) { any = true; keys.forEach(k => { t[k] += x[k]; }); } }
      out.push(any ? fn(t) : (step === 1 ? null : null));
    }
    return out;
  }
  function groupBy(rows, field, keys) {
    const g = new Map();
    for (const r of rows) {
      const k = r[field]; let t = g.get(k);
      if (!t) { t = {}; keys.forEach(x => { t[x] = 0; }); g.set(k, t); }
      for (const x of keys) t[x] += r.m[x] || 0;
    }
    return g;
  }
  const pctChange = (c, p) => (c == null || p == null || p === 0 ? null : (c - p) / Math.abs(p));

  /* ------------------------------------------------------------- UI pieces */
  function deltaChip(d, good) {
    if (d == null) return '<span class="delta delta--none" title="No prior-period data">—</span>';
    const flat = Math.abs(d) < 0.0005, up = d > 0;
    let cls = '';
    if (!flat && good !== 'neutral') cls = ((good === 'up') === up) ? 'good' : 'bad';
    const txt = Math.abs(d) > 9.99 ? '>999%' : (Math.abs(d) * 100).toFixed(1) + '%';
    const sr = flat ? 'No change' : `${up ? 'Up' : 'Down'} ${txt}${cls === 'good' ? ', favorable' : cls === 'bad' ? ', unfavorable' : ''}`;
    return `<span class="delta ${cls ? 'delta--' + cls : ''}">${flat ? '' : icon(up ? 'up' : 'down', 12)}${txt}<span class="sr-only"> ${sr}</span></span>`;
  }
  function spark(vals) {
    const v = vals.filter(x => x != null); if (v.length < 2) return '';
    const mn = Math.min(...v), mx = Math.max(...v), r = mx - mn || 1, w = 96, h = 32, n = vals.length;
    const pts = vals.map((x, i) => x == null ? null : `${(i * w / (n - 1)).toFixed(1)},${(h - 3 - ((x - mn) / r) * (h - 6)).toFixed(1)}`).filter(Boolean).join(' ');
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}"/></svg>`;
  }
  function kpiCard(k, primary) {
    return `<article class="kpi ${primary ? 'kpi--primary' : ''}">
      <h3 class="kpi-label" title="${esc(k.label)}">${esc(k.label)}</h3>
      <div class="kpi-value">${fmt(k.value, k.fmt)}</div>
      <div class="kpi-foot">${S.compare ? deltaChip(k.delta, k.good) + (k.prev != null ? `<span>vs ${fmt(k.prev, k.fmt)}</span>` : '') : ''}</div>
      ${primary ? spark(k.series || []) : ''}
    </article>`;
  }
  function kpiGrid(items) {
    const first = items.slice(0, 4), rest = items.slice(4, 8);
    return `<div class="kpis">${first.map(k => kpiCard(k, true)).join('')}</div>` + (rest.length ? `<div class="kpis" style="margin-top:16px">${rest.map(k => kpiCard(k, false)).join('')}</div>` : '');
  }
  function kpiGridGlance(items) {
    const list = items.slice(0, 8);
    return `<div class="kpis g-kpis" style="--n:${Math.max(1, list.length)}">${list.map(k => kpiCard(k, false)).join('')}</div>`;
  }
  function glanceLayout(top, bottom, ratioTop, ratioBottom) {
    top = top.filter(Boolean); bottom = bottom.filter(Boolean);
    const rows = [[top, ratioTop], [bottom, ratioBottom]].filter(r => r[0].length);
    if (!rows.length) return '';
    const cols = (r, ratio) => (r.length > 1 ? ratio.replace(/(\d+)fr/g, 'minmax(0,$1fr)') : 'minmax(0,1fr)');
    const tpl = rows.length === 2 ? 'minmax(0,1.12fr) minmax(0,1fr)' : 'minmax(0,1fr)';
    return `<div class="g-main" style="grid-template-rows:${tpl}">${rows.map(([r, ratio]) => `<div class="g-row" style="grid-template-columns:${cols(r, ratio)}">${r.join('')}</div>`).join('')}</div>`;
  }
  function seg(id, options, active) {
    if (options.length < 2) return '';
    return `<div class="seg" role="group" aria-label="Metric">${options.map(o => `<button type="button" data-seg="${id}" data-val="${esc(o.key)}" aria-pressed="${o.key === active}">${esc(o.label)}</button>`).join('')}</div>`;
  }
  const stateCard = (kind, ic, title, body, action) => `<div class="state ${kind}">${icon(ic, 40)}<h2>${esc(title)}</h2><div>${body}</div>${action || ''}</div>`;

  function narrate(items, label, compact) {
    const ok = items.filter(i => i.value != null);
    if (!ok.length) return '';
    const dtxt = (i, short) => (!S.compare || i.delta == null) ? '' : ` (${i.delta > 0 ? 'up' : 'down'} ${(Math.abs(i.delta) * 100).toFixed(1)}%${short ? '' : ' vs prior period'})`;
    const b = i => `<strong>${esc(i.label)} ${fmt(i.value, i.fmt)}</strong>`;
    let t = compact ? `${b(ok[0])}${dtxt(ok[0])}` : `${label}: ${b(ok[0])}${dtxt(ok[0])}`;
    if (ok[1]) t += ` and ${b(ok[1])}${dtxt(ok[1], compact)}`;
    t += '.';
    if (S.compare) {
      const mv = ok.filter(i => i.good !== 'neutral' && i.delta != null && Math.abs(i.delta) >= 0.01).map(i => Object.assign({ fav: i.good === 'up' ? i.delta : -i.delta }, i));
      const best = mv.filter(i => i.fav > 0).sort((a, c) => c.fav - a.fav)[0];
      const worst = mv.filter(i => i.fav < 0).sort((a, c) => a.fav - c.fav)[0];
      const m = i => `<strong>${esc(i.label)}</strong> (${i.delta > 0 ? 'up' : 'down'} ${(Math.abs(i.delta) * 100).toFixed(1)}%)`;
      if (best) t += ` Strongest improvement: ${m(best)}.`;
      if (worst) t += ` Needs attention: ${m(worst)}.`;
      if (!best && !worst) t += ' Performance is steady versus the prior period.';
    }
    return `<div class="insight"><span class="insight-tag">Summary</span><p>${t}</p></div>`;
  }

  /* --------------------------------------------------------- chart: bars/funnel */
  function barsBody(items, fmtType, showShare) {
    if (!items.length) return '<p style="color:var(--text-3)">No data for this selection.</p>';
    const max = Math.max(...items.map(i => i.v || 0), 0) || 1;
    return `<div class="bars">${items.map(i => {
      const pct = i.v > 0 ? Math.max(1, i.v / max * 100) : 0;
      const tip = `${i.name}: ${fmt(i.v, fmtType)}${showShare && i.share != null ? ` (${(i.share * 100).toFixed(0)}%)` : ''}`;
      return `<div class="bar-row" title="${esc(tip)}"><span class="bar-name">${esc(i.name)}</span><span class="bar-track"><span class="bar" style="display:block;width:${pct.toFixed(1)}%"></span></span><span class="bar-val">${fmt(i.v, fmtType)}${showShare ? `<small>${i.share != null ? (i.share * 100).toFixed(0) + '%' : ''}</small>` : ''}</span></div>`;
    }).join('')}</div>`;
  }
  function barsCard(o) {
    // o: {id,title,sub,metrics:[{key,label}], compute(metricKey)->{items,fmt,share}}
    const active = S.vs.seg[o.id] && o.metrics.some(m => m.key === S.vs.seg[o.id]) ? S.vs.seg[o.id] : o.metrics[0].key;
    const r = o.compute(active);
    return `<section class="card"><div class="card-head"><div><h2>${esc(o.title)}</h2>${o.sub ? `<p>${esc(o.sub)}</p>` : ''}</div>${seg(o.id, o.metrics, active)}</div>${barsBody(r.items, r.fmt, r.share)}</section>`;
  }
  function funnelCard(ch, o, T) {
    const steps = o.steps.filter(k => ch.__keys.has(k));
    if (steps.length < 2) return '';
    const base = T[steps[0]] || 0;
    const mixes = [100, 80, 62, 48, 40];
    return `<section class="card"><div class="card-head"><div><h2>${esc(o.title || 'Funnel')}</h2><p>Conversion from each stage to the next</p></div></div><div class="funnel">${steps.map((k, i) => {
      const v = T[k] || 0, prev = i ? (T[steps[i - 1]] || 0) : null;
      const w = base ? Math.max(1.5, v / base * 100) : 0;
      const conv = prev ? (v / prev * 100).toFixed(1) + '% of previous' : 'Top of funnel';
      return `<div class="f-step"><span class="f-name">${esc(getMetric(ch, k).label)}</span><span><span class="f-bar" style="display:block;width:${w.toFixed(1)}%;background:color-mix(in srgb,var(--accent) ${mixes[Math.min(i, 4)]}%,var(--surface))"></span></span><span class="f-val">${fmt(v, 'int')}<small>${conv}</small></span></div>`;
    }).join('')}</div></section>`;
  }

  /* ---------------------------------------------------------------- tables */
  const TABLES = {};
  function tableCard(o) {
    // o: {id,title,sub,nameLabel,rows:[{name,t,href}],cols:[{key,label,fmt}],totals,defaultSort,limit}
    const st = S.vs.tables[o.id] || (S.vs.tables[o.id] = { key: o.defaultSort || o.cols[0].key, dir: 'desc', all: false });
    const rows = o.rows.map(r => ({ name: r.name, href: r.href, v: o.cols.map(c => c.calc(r.t)) }));
    const ci = o.cols.findIndex(c => c.key === st.key);
    rows.sort((a, b) => {
      if (st.key === '__name') return st.dir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      const x = a.v[ci], y = b.v[ci];
      if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
      return st.dir === 'asc' ? x - y : y - x;
    });
    const limit = o.limit || 10, shown = st.all ? rows : rows.slice(0, limit);
    const th = (key, label, first) => {
      const on = st.key === key;
      return `<th scope="col" ${on ? `aria-sort="${st.dir === 'asc' ? 'ascending' : 'descending'}"` : ''}><button type="button" data-sort="${o.id}|${key}">${esc(label)}${on ? icon(st.dir === 'asc' ? 'sortUp' : 'sortDown', 14) : ''}</button></th>`;
    };
    const totals = o.totals ? o.cols.map(c => c.calc(o.totals)) : null;
    TABLES[o.id] = { headers: [o.nameLabel, ...o.cols.map(c => c.label)], rows: rows.map(r => [r.name, ...r.v.map((v, i) => (v == null ? '' : v))]), totals: totals && ['Total', ...totals.map(v => (v == null ? '' : v))] };
    return `<section class="card"><div class="card-head"><div><h2>${esc(o.title)}</h2>${o.sub ? `<p>${esc(o.sub)}</p>` : ''}</div>
      <div class="card-tools"><button type="button" class="btn btn--ghost" data-export="${o.id}">${icon('download', 16)}Export CSV</button></div></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr>${th('__name', o.nameLabel, true)}${o.cols.map(c => th(c.key, c.label)).join('')}</tr></thead>
      <tbody>${shown.map(r => `<tr><td title="${esc(r.name)}">${r.href ? `<a class="link" href="${r.href}">${esc(r.name)}</a>` : esc(r.name)}</td>${r.v.map((v, i) => `<td>${fmt(v, o.cols[i].fmt)}</td>`).join('')}</tr>`).join('')}</tbody>
      ${totals ? `<tfoot><tr><td>Total</td>${totals.map((v, i) => `<td>${fmt(v, o.cols[i].fmt)}</td>`).join('')}</tr></tfoot>` : ''}</table></div>
      <div class="tbl-foot"><span>Showing ${shown.length} of ${rows.length}</span>${rows.length > limit ? `<button type="button" class="btn btn--ghost" data-showall="${o.id}">${st.all ? 'Show top ' + limit : 'Show all ' + rows.length}</button>` : ''}</div></section>`;
  }
  function exportCsv(id) {
    const t = TABLES[id]; if (!t) return;
    const q = v => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const lines = [t.headers, ...t.rows, ...(t.totals ? [t.totals] : [])].map(r => r.map(q).join(','));
    const url = URL.createObjectURL(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `${(CFG.client.name || 'dashboard').replace(/\W+/g, '-').toLowerCase()}-${id}-${isoOf(currentRange().e)}.csv` });
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ------------------------------------------------------------ line chart */
  const CHARTS = {};
  function niceTicks(max, count) {
    const raw = max / count, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
    const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
    const top = Math.ceil(max / step - 1e-9) * step, ticks = [];
    for (let v = 0; v <= top + step / 1e6; v += step) ticks.push(v);
    return { ticks, top };
  }
  function trendCard(o) {
    // o: {id,title,sub,metrics:[{key,label}], build(metricKey)->{label,fmt,cur,prev,step,s,ps,e}}
    const active = S.vs.seg[o.id] && o.metrics.some(m => m.key === S.vs.seg[o.id]) ? S.vs.seg[o.id] : o.metrics[0].key;
    const sp = o.build(active); sp.id = o.id;
    CHARTS[o.id] = sp;
    const empty = sp.cur.every(v => v == null);
    return `<section class="card"><div class="card-head"><div><h2>${esc(o.title)}</h2><p>${esc(sp.label)} by ${sp.step === 1 ? 'day' : 'week'}</p></div>
      <div class="card-tools">${S.compare ? `<div class="legend" aria-hidden="true"><span class="lg"><i></i>This period</span><span class="lg"><i class="dash"></i>Previous period</span></div>` : ''}${seg(o.id, o.metrics, active)}</div></div>
      ${empty ? '<p style="color:var(--text-3)">No data for this selection.</p>' : `<div class="chart" data-chart="${o.id}"></div>`}</section>`;
  }
  function drawLine(el) {
    const sp = CHARTS[el.dataset.chart]; if (!sp) return;
    const W = Math.max(280, el.clientWidth), H = el.clientHeight || 288;
    const GL = document.body.classList.contains('d-glance') && S.compare;
    const m = { l: 52, r: 12, t: GL ? 28 : 20, b: 28 }, iw = W - m.l - m.r, ih = H - m.t - m.b, n = sp.cur.length;
    const prior = S.compare ? sp.prev : [];
    const vals = sp.cur.concat(prior).filter(v => v != null && isFinite(v));
    const { ticks, top } = niceTicks(Math.max(...vals, 0) || 1, 4);
    const x = i => m.l + (n < 2 ? iw / 2 : i * iw / (n - 1));
    const y = v => m.t + ih - (v / top) * ih;
    const path = arr => { let d = '', pen = false; arr.forEach((v, i) => { if (v == null) { pen = false; return; } d += (pen ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); pen = true; }); return d; };
    const solid = sp.cur.every(v => v != null);
    const gid = 'g' + sp.id.replace(/\W/g, '');
    const maxLabels = Math.max(2, Math.floor(iw / 88)), every = Math.max(1, Math.ceil((n - 1) / Math.max(1, maxLabels - 1)));
    const xi = []; for (let i = 0; i < n; i += every) xi.push(i);
    const cnt = xi.length;
    let peak = -1; sp.cur.forEach((v, i) => { if (v != null && (peak < 0 || v > sp.cur[peak])) peak = i; });
    const peakX = peak >= 0 ? clamp(x(peak), m.l + 24, W - m.r - 24) : 0;
    const lx = W - m.r - 206, showPeak = peak >= 0 && n > 3 && !(GL && peakX > lx - 24 && y(sp.cur[peak]) - 10 < 22);
    const svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" tabindex="0" aria-label="${esc(sp.label)} trend chart. Use left and right arrow keys to read values.">
      <defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".16"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
      ${ticks.map((t, i) => `<line class="${i ? 'grid' : 'axis0'}" x1="${m.l}" x2="${W - m.r}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"/><text x="${m.l - 8}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end">${esc(fmt(t, sp.fmt, true))}</text>`).join('')}
      ${xi.map((i, k) => `<text x="${x(i).toFixed(1)}" y="${H - 6}" text-anchor="${k === 0 && cnt > 1 ? 'start' : 'middle'}">${esc(fmtDay(sp.s + i * sp.step))}</text>`).join('')}
      ${solid && n > 1 ? `<path d="${path(sp.cur)} L${x(n - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z" fill="url(#${gid})"/>` : ''}
      ${prior.length ? `<path class="prior" d="${path(prior)}"/>` : ''}
      <path class="line" d="${path(sp.cur)}"/>
      ${GL ? `<g aria-hidden="true"><line class="line" x1="${lx}" x2="${lx + 16}" y1="8" y2="8"/><text x="${lx + 22}" y="12">This period</text><line class="prior" x1="${lx + 88}" x2="${lx + 104}" y1="8" y2="8"/><text x="${lx + 110}" y="12">Previous period</text></g>` : ''}
      ${showPeak ? `<text class="peak" x="${peakX.toFixed(1)}" y="${Math.max(10, y(sp.cur[peak]) - 10).toFixed(1)}" text-anchor="middle">${esc(fmt(sp.cur[peak], sp.fmt, true))}</text><circle cx="${x(peak).toFixed(1)}" cy="${y(sp.cur[peak]).toFixed(1)}" r="3" class="dot-cur" stroke-width="1.5"/>` : ''}
      <line class="xhair" y1="${m.t}" y2="${m.t + ih}" x1="0" x2="0" visibility="hidden"/>
      <circle class="dot-prior" r="4" visibility="hidden"/><circle class="dot-cur" r="5" visibility="hidden"/>
      <rect x="${m.l}" y="${m.t}" width="${iw}" height="${ih}" fill="transparent"/>
    </svg>
    <div class="tip" hidden></div>
    <div class="sr-only"><table><caption>${esc(sp.label)} by ${sp.step === 1 ? 'day' : 'week'}</caption><thead><tr><th>Date</th><th>This period</th><th>Previous period</th></tr></thead><tbody>${sp.cur.map((v, i) => `<tr><td>${esc(fmtDay(sp.s + i * sp.step, true))}</td><td>${esc(fmt(v, sp.fmt))}</td><td>${esc(fmt(sp.prev[i], sp.fmt))}</td></tr>`).join('')}</tbody></table></div>`;
    el.innerHTML = svg;
    const s = $('svg', el), tip = $('.tip', el), xh = $('.xhair', el), dc = $('.dot-cur[visibility]', el), dp = $('.dot-prior', el);
    const label = i => sp.step === 1 ? fmtDayLong(sp.s + i) : `${fmtDay(sp.s + i * sp.step)} – ${fmtDay(Math.min(sp.s + i * sp.step + sp.step - 1, sp.e), true)}`;
    const plabel = i => sp.step === 1 ? fmtDay(sp.ps + i, true) : `${fmtDay(sp.ps + i * sp.step)} – ${fmtDay(sp.ps + i * sp.step + sp.step - 1, true)}`;
    let cur = n - 1;
    const show = i => {
      cur = i; const px = x(i);
      xh.setAttribute('x1', px); xh.setAttribute('x2', px); xh.setAttribute('visibility', 'visible');
      const v = sp.cur[i], pv = prior[i];
      dc.setAttribute('visibility', v == null ? 'hidden' : 'visible'); if (v != null) { dc.setAttribute('cx', px); dc.setAttribute('cy', y(v)); }
      dp.setAttribute('visibility', pv == null ? 'hidden' : 'visible'); if (pv != null) { dp.setAttribute('cx', px); dp.setAttribute('cy', y(pv)); }
      tip.innerHTML = `<div class="tip-date">${esc(label(i))}</div><div class="tip-row"><i class="lk"></i><span>This period</span><strong>${esc(fmt(v, sp.fmt))}</strong></div>` +
        (prior.length ? `<div class="tip-row"><i class="lk prior"></i><span>${esc(plabel(i))}</span><strong>${esc(fmt(pv, sp.fmt))}</strong></div>` : '');
      tip.hidden = false;
      const tw = tip.offsetWidth; tip.style.left = (px + 16 + tw > W ? px - tw - 16 : px + 16) + 'px';
    };
    const hide = () => { tip.hidden = true; xh.setAttribute('visibility', 'hidden'); dc.setAttribute('visibility', 'hidden'); dp.setAttribute('visibility', 'hidden'); };
    s.addEventListener('pointermove', ev => { const r = s.getBoundingClientRect(); show(clamp(n < 2 ? 0 : Math.round((ev.clientX - r.left - m.l) / iw * (n - 1)), 0, n - 1)); });
    s.addEventListener('pointerleave', hide);
    s.addEventListener('focus', () => show(cur)); s.addEventListener('blur', hide);
    s.addEventListener('keydown', ev => { if (ev.key === 'ArrowRight') { show(clamp(cur + 1, 0, n - 1)); ev.preventDefault(); } if (ev.key === 'ArrowLeft') { show(clamp(cur - 1, 0, n - 1)); ev.preventDefault(); } });
  }
  function mountCharts() { $$('.chart[data-chart]').forEach(drawLine); }

  /* ----------------------------------------------------------------- views */
  function sourceOf(from) {
    const chs = CH.filter(c => c.id === from || c.group === from);
    const rows = [], keys = new Set();
    chs.forEach(c => { const d = S.ch[c.id]; if (!d || !d.rows) return; for (const r of d.rows) rows.push(r); d.keys.forEach(k => keys.add(k)); });
    return { rows, keys, chs, ch: chs.length === 1 ? chs[0] : null };
  }
  function kpiItems(defs, getTotals, R) {
    // defs: [{key,label?,from?,ch?}] ; getTotals(def)->{cur,prev,mapCur,keys,ch}
    const items = [];
    for (const d of defs) {
      const src = getTotals(d); if (!src || !isAvail(src.keys, src.ch, d.key)) continue;
      const m = getMetric(src.ch, d.key);
      const v = val(src.ch, d.key, src.T), pv = S.compare ? val(src.ch, d.key, src.P) : null;
      const ks = Array.from(src.keys);
      const series = seriesOf(src.mapCur, ks, R.s, R.e, R.step, t => val(src.ch, d.key, t));
      items.push({ label: d.label || m.label, fmt: m.fmt, good: m.good, value: v, prev: pv, delta: pctChange(v, pv), series });
    }
    return items;
  }
  function trendBuilder(src, ch, R) {
    const keys = Array.from(src.keys);
    const mapCur = dayMap(inRange(src.rows, R.s, R.e), keys), mapPrev = dayMap(inRange(src.rows, R.ps, R.pe), keys);
    return key => {
      const m = getMetric(ch, key);
      const fn = t => val(ch, key, t);
      return { label: m.label, fmt: m.fmt, step: R.step, s: R.s, e: R.e, ps: R.ps, cur: seriesOf(mapCur, keys, R.s, R.e, R.step, fn), prev: seriesOf(mapPrev, keys, R.ps, R.pe, R.step, fn) };
    };
  }
  const metricOpts = (keys, ch, list) => list.filter(k => isAvail(keys, ch, k)).map(k => ({ key: k, label: getMetric(ch, k).label }));

  function channelView(ch) {
    const cd = S.ch[ch.id];
    if (!cd) return '';
    if (cd.error || !cd.rows.length) {
      const msg = cd.error || (cd.issues[0] && cd.issues[0].msg) || 'No rows found.';
      return stateCard('error', 'alert', `Couldn’t load “${ch.tab}”`, `<p>${esc(msg)}</p>`, `<button class="btn btn--primary" type="button" data-action="refresh">${icon('refresh', 16)}Try again</button>`);
    }
    const G = dens() === 'glance';
    const R = currentRange(), keys = cd.keys; ch.__keys = keys;
    const cur = inRange(cd.rows, R.s, R.e), prev = inRange(cd.rows, R.ps, R.pe);
    if (!cur.length) {
      return stateCard('', 'inbox', 'No data in this date range', `<p>${esc(ch.label)} has data from ${fmtDay(cd.earliest, true)} to ${fmtDay(cd.latest, true)}. Pick a range inside that window.</p>`);
    }
    const ks = Array.from(keys), T = sumRows(cur, ks), P = sumRows(prev, ks);
    const mapCur = dayMap(cur, ks);
    const items = kpiItems((ch.kpis || []).map(k => ({ key: k })), () => ({ T, P, mapCur, keys, ch }), R);

    const tr = ch.trend || { metrics: (ch.kpis || []).slice(0, 4) };
    const tOpts = metricOpts(keys, ch, tr.metrics);
    const trendHtml = tOpts.length ? trendCard({ id: 'trend', title: tr.title || 'Performance trend', metrics: tOpts, build: trendBuilder({ rows: cd.rows, keys }, ch, R) }) : '';

    const mkBreakdown = (o, id, cap) => {
      const field = o.by === 'dimension2' ? 'dim2' : 'dim';
      if (!(field === 'dim2' ? cd.hasDim2 : cd.hasDim)) return '';
      const opts = metricOpts(keys, ch, o.metrics || ['spend']); if (!opts.length) return '';
      const limit = cap ? Math.min(cap, o.limit || 8) : (o.limit || 8);
      return barsCard({
        id, title: o.title, sub: G ? '' : o.sub, metrics: opts,
        compute: key => {
          const g = groupBy(cur, field, ks), m = getMetric(ch, key);
          let list = Array.from(g, ([name, t]) => ({ name, v: val(ch, key, t) })).filter(i => i.v != null);
          const additive = isAdditive(ch, key), total = list.reduce((a, i) => a + (i.v || 0), 0);
          list.sort((a, b) => b.v - a.v);
          list = list.slice(0, limit);
          if (additive) list.forEach(i => { i.share = total ? i.v / total : null; });
          return { items: list, fmt: m.fmt, share: additive };
        }
      });
    };
    const bd1 = ch.breakdown ? mkBreakdown(ch.breakdown, 'bars1', G ? 6 : 0) : '';
    const sec = ch.secondary;
    const sec2 = sec ? (sec.type === 'funnel' ? funnelCard(ch, sec, T) : mkBreakdown(sec, 'bars2', G ? 5 : 0)) : '';

    let tableHtml = '';
    const tb = ch.table;
    if (tb && cd.hasDim) {
      const want = G ? (tb.glanceColumns || (tb.columns || []).slice(0, 5)) : (tb.columns || []);
      const cols = want.filter(k => isAvail(keys, ch, k)).map(k => { const m = getMetric(ch, k); return { key: k, label: m.label, fmt: m.fmt, calc: t => val(ch, k, t) }; });
      if (cols.length) {
        const g = groupBy(cur, 'dim', ks);
        const dflt = (tb.sortBy && cols.some(c => c.key === tb.sortBy)) ? tb.sortBy : cols[0].key;
        tableHtml = tableCard({ id: 'detail', title: tb.title || 'Detail', sub: G ? '' : tb.sub, nameLabel: tb.nameLabel || ch.columns.dimension, rows: Array.from(g, ([name, t]) => ({ name, t })), cols, totals: T, defaultSort: dflt, limit: G ? (tb.glanceLimit || 5) : (tb.limit || 10) });
      }
    }

    if (G) return `<div class="g-sum">${narrate(items, '', true)}</div>` + kpiGridGlance(items) + glanceLayout([trendHtml, bd1], [sec2, tableHtml], '7fr 5fr', '5fr 7fr');

    let html = `<div class="sec">${narrate(items, `For ${rangeLabel(R.s, R.e)}`)}</div><div class="sec">${kpiGrid(items)}</div>`;
    if (trendHtml) html += `<div class="sec">${trendHtml}</div>`;
    const live = [bd1, sec2].filter(Boolean);
    if (live.length) html += `<div class="row ${live.length > 1 ? 'two' : ''}" style="margin-top:32px">${live.join('')}</div>`;
    if (tableHtml) html += `<div class="sec">${tableHtml}</div>`;
    return html;
  }

  function overviewView() {
    const O = CFG.overview || {}, R = currentRange(), G = dens() === 'glance';
    const loaded = CH.filter(c => S.ch[c.id] && S.ch[c.id].rows && S.ch[c.id].rows.length);
    if (!loaded.length) return stateCard('error', 'alert', 'No channel data loaded yet', '<p>Open the data status panel (bottom-left) to see what went wrong, then press Refresh.</p>', `<button class="btn btn--primary" type="button" data-action="refresh">${icon('refresh', 16)}Refresh data</button>`);
    const cache = {};
    const srcFor = from => cache[from] || (cache[from] = (() => {
      const s = sourceOf(from), ks = Array.from(s.keys);
      const cur = inRange(s.rows, R.s, R.e), prev = inRange(s.rows, R.ps, R.pe);
      return Object.assign(s, { ks, T: sumRows(cur, ks), P: sumRows(prev, ks), mapCur: dayMap(cur, ks), hasCur: cur.length > 0 });
    })());
    const defs = (O.kpis || []).map(k => Object.assign({ from: 'paid' }, k));
    const items = kpiItems(defs, d => { const s = srcFor(d.from); return s.hasCur ? { T: s.T, P: s.P, mapCur: s.mapCur, keys: s.keys, ch: s.ch } : null; }, R);

    const tr = O.trend || {}, tsrc = sourceOf(tr.from || 'paid');
    const tOpts = metricOpts(tsrc.keys, tsrc.ch, tr.metrics || ['spend', 'revenue', 'conversions', 'roas']);
    const trendHtml = tOpts.length ? trendCard({ id: 'otrend', title: tr.title || 'Paid media trend', metrics: tOpts, build: trendBuilder(tsrc, tsrc.ch, R) }) : '';

    const grp = O.byChannel || {}, gchs = CH.filter(c => c.id === (grp.from || 'paid') || c.group === (grp.from || 'paid'));
    const perCh = gchs.map(c => { const d = S.ch[c.id]; if (!d || !d.rows) return null; const rows = inRange(d.rows, R.s, R.e), ks = Array.from(d.keys); return { c, keys: d.keys, t: sumRows(rows, ks), has: rows.length > 0 }; }).filter(x => x && x.has);
    const gkeys = new Set(); perCh.forEach(x => x.keys.forEach(k => gkeys.add(k)));
    let barsHtml = '', scoreHtml = '';
    const bOpts = metricOpts(gkeys, null, grp.metrics || ['spend', 'revenue', 'conversions']);
    if (perCh.length && bOpts.length) barsHtml = barsCard({
      id: 'obars', title: grp.title || 'Performance by channel', sub: G ? '' : grp.sub, metrics: bOpts,
      compute: key => { const m = getMetric(null, key), add = isAdditive(null, key); let list = perCh.map(x => ({ name: x.c.label, v: val(x.c, key, x.t) })).filter(i => i.v != null); const tot = list.reduce((a, i) => a + i.v, 0); list.sort((a, b) => b.v - a.v); if (add) list.forEach(i => { i.share = tot ? i.v / tot : null; }); return { items: list, fmt: m.fmt, share: add }; }
    });
    const sc = O.scorecard;
    if (sc && perCh.length) {
      const cols = (sc.columns || []).filter(k => isAvail(gkeys, null, k)).map(k => { const m = getMetric(null, k); return { key: k, label: m.label, fmt: m.fmt, calc: t => val(null, k, t) }; });
      const tt = {}; gkeys.forEach(k => { tt[k] = perCh.reduce((a, x) => a + (x.t[k] || 0), 0); });
      if (cols.length) scoreHtml = tableCard({ id: 'score', title: sc.title || 'Channel scorecard', sub: G ? '' : sc.sub, nameLabel: 'Channel', rows: perCh.map(x => ({ name: x.c.label, t: x.t, href: '#' + x.c.id })), cols, totals: tt, defaultSort: sc.sortBy || cols[0].key, limit: 12 });
    }
    const snaps = (O.snapshot || []).map(id => CH.find(c => c.id === id)).filter(Boolean).map(c => {
      const d = S.ch[c.id]; if (!d || !d.rows || !d.rows.length) return '';
      const ks = Array.from(d.keys), T = sumRows(inRange(d.rows, R.s, R.e), ks), P = sumRows(inRange(d.rows, R.ps, R.pe), ks);
      const rowsHtml = (c.snapshot || c.kpis || []).filter(k => isAvail(d.keys, c, k)).slice(0, 3).map(k => { const m = getMetric(c, k), v = val(c, k, T), pv = val(c, k, P); return `<div class="snap-row"><span class="k">${esc(m.label)}</span><span class="v">${fmt(v, m.fmt)}</span>${S.compare ? deltaChip(pctChange(v, pv), m.good) : ''}</div>`; }).join('');
      return `<a class="snap" href="#${c.id}"><div class="snap-head">${icon(c.icon || 'grid', 18)}${esc(c.label)}<span class="go">View ${icon('arrowRight', 12)}</span></div>${rowsHtml}</a>`;
    }).filter(Boolean);

    if (G) {
      const snapCard = snaps.length ? `<section class="card g-snaps"><div class="card-head"><div><h2>Other channels at a glance</h2></div></div><div class="g-snaplist">${snaps.join('')}</div></section>` : '';
      return `<div class="g-sum">${narrate(items, '', true)}</div>` + kpiGridGlance(items) + glanceLayout([trendHtml, barsHtml], [scoreHtml, snapCard], '7fr 5fr', '6fr 6fr');
    }
    let html = `<div class="sec">${narrate(items, `Across all channels, ${rangeLabel(R.s, R.e)}`)}</div><div class="sec">${kpiGrid(items)}</div>`;
    if (trendHtml) html += `<div class="sec">${trendHtml}</div>`;
    const cards = [barsHtml, scoreHtml].filter(Boolean);
    if (cards.length) html += `<div class="row ${cards.length > 1 ? 'five-seven' : ''}" style="margin-top:32px">${cards.join('')}</div>`;
    if (snaps.length) html += `<div class="sec"><div class="sec-head"><h2>Other channels at a glance</h2><span>Click a card for the full view</span></div><div class="row three" style="margin-top:0">${snaps.join('')}</div></div>`;
    return html;
  }

  const skeleton = () => `<div class="skel" style="height:72px"></div><div class="kpis" style="margin-top:24px">${'<div class="skel" style="height:136px"></div>'.repeat(4)}</div><div class="skel" style="height:360px;margin-top:32px"></div>`;

  /* ---------------------------------------------------------------- chrome */
  const routeInfo = () => S.route === 'overview' ? { label: 'Overview', icon: 'grid' } : (CH.find(c => c.id === S.route) || { label: 'Not found' });
  function renderBrand() {
    const b = CFG.branding || {}, name = CFG.client.name || 'Client';
    const dark = S.theme === 'dark', src = (dark && b.logoDark) || b.logo;
    const initials = name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const mono = () => { const d = document.createElement('div'); d.className = 'monogram'; d.textContent = initials; return d; };
    const el = $('#brand'); el.innerHTML = `<div class="brand-mark ${b.logoWide ? 'wide' : ''}"></div>${b.showName === false ? '' : `<div class="brand-name">${esc(name)}<small>${esc(CFG.client.reportTitle || 'Marketing Dashboard')}</small></div>`}`;
    const mark = $('.brand-mark', el);
    if (src) { const img = new Image(); img.alt = `${name} logo`; img.onerror = () => { mark.innerHTML = ''; mark.appendChild(mono()); }; img.src = src; mark.appendChild(img); } else mark.appendChild(mono());
  }
  function renderNav() {
    const items = []; if (HAS_OVERVIEW) items.push({ id: 'overview', label: 'Overview', icon: 'grid', section: 'Dashboard' });
    CH.forEach(c => items.push({ id: c.id, label: c.label, icon: c.icon || 'grid', section: c.section || 'Channels' }));
    let last = null;
    $('#nav').innerHTML = items.map(i => {
      const h = S.health.find(x => x.id === i.id);
      const head = i.section !== last ? `<div class="nav-label">${esc(i.section)}</div>` : ''; last = i.section;
      return head + `<a class="nav-item" href="#${i.id}" title="${esc(i.label)}" ${S.route === i.id ? 'aria-current="page"' : ''}>${icon(i.icon)}<span class="lbl">${esc(i.label)}</span>${h && h.level === 'error' ? `<span class="warn" title="Data problem">${icon('alert', 16)}</span>` : ''}</a>`;
    }).join('');
  }
  function renderHeader() {
    const R = currentRange(), info = routeInfo(), ch = CH.find(c => c.id === S.route);
    $('#eyebrow').textContent = CFG.client.name || '';
    $('#title').textContent = info.label;
    const srcName = S.route === 'overview' ? 'All connected channels' : `Google Sheet › ${ch ? ch.tab : ''}`;
    $('#source').textContent = `${srcName} · ${rangeLabel(R.s, R.e)}${S.compare ? ` · compared with ${rangeLabel(R.ps, R.pe)}` : ''}`;
    document.title = `${info.label} · ${CFG.client.name || 'Marketing Dashboard'}`;
    const pl = S.range.preset === 'custom' ? rangeLabel(R.s, R.e) : (PRESETS.find(p => p.id === S.range.preset) || PRESETS[2]).label;
    $('#dateBtn').innerHTML = `${icon('calendar', 16)}<span>${esc(pl)}</span>${icon('chevron', 16)}`;
    const busy = S.loading;
    $('#refreshBtn').className = 'btn' + (busy ? ' spin' : ''); $('#refreshBtn').disabled = busy;
    $('#refreshBtn').innerHTML = `${icon('refresh', 16)}<span>${busy ? 'Syncing…' : 'Refresh data'}</span>`;
    document.body.classList.toggle('is-loading', busy && !S.firstLoad);
    // sidebar status
    const worst = S.health.some(h => h.level === 'error') ? 'error' : S.health.some(h => h.level === 'warn') ? 'warn' : 'ok';
    const okN = S.health.filter(h => h.level === 'ok').length;
    $('#healthBtn').innerHTML = S.loadedAt
      ? `<span class="dot ${worst}"></span><span><b>Synced ${S.loadedAt.toLocaleTimeString(CFG.locale || 'en-US', { hour: 'numeric', minute: '2-digit' })}</b>${okN}/${S.health.length} healthy${CFG.source.mode === 'demo' ? ' · demo data' : ''}</span>`
      : `<span class="dot warn"></span><span><b>Not synced</b>Waiting for data</span>`;
    $('#themeBtn').innerHTML = icon(S.theme === 'dark' ? 'sun' : 'moon');
    $('#navToggle').innerHTML = icon('panel');
    $('#navToggle').setAttribute('aria-label', S.navCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
    const dv = $('#densSeg'), canG = window.innerWidth >= GLANCE_MIN;
    dv.hidden = !canG;
    dv.innerHTML = [['glance', 'Glance'], ['detail', 'Detailed']].map(([k, l]) => `<button type="button" data-dens="${k}" aria-pressed="${S.density === k}">${l}</button>`).join('');
    document.body.classList.toggle('nav-collapsed', S.navCollapsed);
  }
  function renderView() {
    const el = $('#view'); const y = window.scrollY;
    document.body.classList.toggle('d-glance', dens() === 'glance');
    Object.keys(CHARTS).forEach(k => delete CHARTS[k]);
    const prob = setupProblem();
    if (prob) el.innerHTML = setupState(prob);
    else if (S.firstLoad && S.loading) el.innerHTML = skeleton();
    else if (S.fatal) el.innerHTML = stateCard('error', 'alert', 'Couldn’t reach your Google Sheet', `<p>${esc(S.fatal)}</p>`, `<button class="btn btn--primary" type="button" data-action="refresh">${icon('refresh', 16)}Try again</button>`);
    else {
      const ch = CH.find(c => c.id === S.route);
      el.innerHTML = S.route === 'overview' && HAS_OVERVIEW ? overviewView() : ch ? channelView(ch) : stateCard('', 'inbox', 'Page not found', '<p>That channel isn’t part of this dashboard.</p>');
    }
    mountCharts(); window.scrollTo(0, y);
  }
  function setupState(kind) {
    const steps = kind === 'gviz'
      ? '<li>Open <code>config.js</code> and paste your Google Sheet ID into <code>source.sheetId</code>.</li><li>In Google Sheets: Share → General access → <b>Anyone with the link → Viewer</b>.</li><li>Reload this page.</li>'
      : kind === 'appsscript'
        ? '<li>Deploy <code>apps-script/Code.gs</code> as a Web app (see README).</li><li>Paste the Web app URL into <code>source.appsScriptUrl</code> in <code>config.js</code>.</li><li>Reload this page.</li>'
        : '<li>Set <code>source.mode</code> in <code>config.js</code> to <code>"demo"</code>, <code>"gviz"</code> or <code>"appsscript"</code>.</li>';
    return stateCard('warn', 'settings', 'Connect a Google Sheet to get started', `<ol>${steps}</ol>`);
  }
  function render() { renderBrand(); renderNav(); renderHeader(); renderView(); }

  /* ---- popovers: date range + data health ---- */
  function openPop(id, btn, on) { const p = $(id); p.hidden = !on; $(btn).setAttribute('aria-expanded', String(on)); }
  function closePops() { openPop('#datePop', '#dateBtn', false); openPop('#healthPop', '#healthBtn', false); }
  function renderDatePop() {
    const R = currentRange(), a = anchor();
    $('#datePop').innerHTML = `<div role="listbox" aria-label="Date range">${PRESETS.map(p => `<button type="button" class="pop-row" role="option" data-preset="${p.id}" aria-selected="${S.range.preset === p.id}"><span class="pop-check">${S.range.preset === p.id ? icon('check', 16) : ''}</span>${p.label}</button>`).join('')}</div>
      <div class="pop-foot"><label class="check-row"><input type="checkbox" id="cmpToggle" ${S.compare ? 'checked' : ''}>Compare with previous period</label>
        <div class="row"><div class="field"><label for="cStart">From</label><input type="date" id="cStart" value="${isoOf(R.s)}" max="${isoOf(a)}"></div><div class="field"><label for="cEnd">To</label><input type="date" id="cEnd" value="${isoOf(R.e)}" max="${isoOf(a)}"></div><button type="button" class="btn btn--primary btn--sm" id="cApply">Apply</button></div></div>`;
  }
  function renderHealthPop() {
    const ic = { ok: 'checkCircle', warn: 'alert', error: 'xCircle' };
    $('#healthPop').innerHTML = `<div class="health-title">Data status</div><div class="health-sub">${S.loadedAt ? 'Last synced ' + S.loadedAt.toLocaleString(CFG.locale || 'en-US') : 'Not synced yet'} · source: ${esc(CFG.source.mode)}</div>` +
      S.health.map(h => `<div class="hrow ${h.level}">${icon(ic[h.level], 18)}<div><b>${esc(h.label)}</b><small>Tab “${esc(h.tab)}” · ${h.rows.toLocaleString()} rows${h.latest != null ? ' · latest ' + fmtDay(h.latest, true) : ''}</small>${h.issues.length ? `<ul>${h.issues.map(i => `<li>${esc(i.msg)}</li>`).join('')}</ul>` : ''}</div></div>`).join('');
  }
  function setRange(preset, custom) {
    S.range = { preset, custom: custom || null };
    store.set('range', { preset, custom: custom || null, compare: S.compare });
    closePops(); renderHeader(); renderView();
  }
  function toast(msg, type) {
    const t = $('#toast'); t.textContent = msg; t.className = 'toast show' + (type === 'error' ? ' error' : '');
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.className = 'toast'; }, type === 'error' ? 6000 : 2600);
  }
  function applyTheme(t) {
    S.theme = t; document.documentElement.dataset.theme = t; store.set('theme', t);
    const b = CFG.branding || {}, root = document.documentElement.style;
    root.setProperty('--accent', (t === 'dark' && b.accentDark) || b.accent || '#4338CA');
    renderBrand(); renderHeader();
  }

  /* ----------------------------------------------------------------- loading */
  async function loadAll(manual) {
    if (S.loading || setupProblem()) return;
    S.loading = true; renderHeader(); if (S.firstLoad) renderView();
    try {
      const tabs = Array.from(new Set(CH.map(c => c.tab)));
      const res = await ADAPTERS[CFG.source.mode](tabs);
      CH.forEach(c => {
        const r = res[c.tab];
        S.ch[c.id] = r && r.rows ? normalize(c, r.rows) : { error: (r && r.error) || 'Tab not returned', rows: [], keys: new Set(), issues: [] };
      });
      S.loadedAt = new Date(); S.fatal = null; buildHealth();
      const bad = S.health.filter(h => h.level === 'error').length;
      if (manual) toast(bad ? `Synced with ${bad} problem${bad > 1 ? 's' : ''} — see data status` : 'Data refreshed from your Google Sheet', bad ? 'error' : '');
    } catch (err) {
      if (S.firstLoad || !S.loadedAt) S.fatal = err.message || String(err);
      toast('Refresh failed: ' + (err.message || err), 'error');
      if (!S.health.length) buildHealth();
    } finally {
      S.loading = false; S.firstLoad = false; render();
    }
  }

  /* ------------------------------------------------------------------ events */
  function parseRoute() { const id = (location.hash.match(/^#\/?([\w-]+)/) || [])[1]; return id && (id === 'overview' ? HAS_OVERVIEW : CH.some(c => c.id === id)) ? id : (HAS_OVERVIEW ? 'overview' : CH[0].id); }
  function bind() {
    window.addEventListener('hashchange', () => { S.route = parseRoute(); S.vs = { seg: {}, tables: {} }; $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('open'); renderNav(); renderHeader(); renderView(); window.scrollTo(0, 0); });
    $('#refreshBtn').addEventListener('click', () => loadAll(true));
    $('#densSeg').addEventListener('click', e => { const b = e.target.closest('[data-dens]'); if (!b) return; S.density = b.dataset.dens; store.set('density', S.density); renderHeader(); renderView(); });
    $('#navToggle').addEventListener('click', () => { S.navCollapsed = !S.navCollapsed; store.set('nav', S.navCollapsed); renderHeader(); setTimeout(mountCharts, 220); });
    $('#themeBtn').addEventListener('click', () => applyTheme(S.theme === 'dark' ? 'light' : 'dark'));
    $('#menuBtn').addEventListener('click', () => { $('#sidebar').classList.add('open'); $('#scrim').classList.add('open'); });
    $('#scrim').addEventListener('click', () => { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('open'); });
    $('#dateBtn').addEventListener('click', e => { e.stopPropagation(); const on = $('#datePop').hidden; closePops(); if (on) { renderDatePop(); openPop('#datePop', '#dateBtn', true); } });
    $('#healthBtn').addEventListener('click', e => { e.stopPropagation(); const on = $('#healthPop').hidden; closePops(); if (on) { renderHealthPop(); openPop('#healthPop', '#healthBtn', true); } });
    document.addEventListener('click', e => { if (!e.target.closest('.popover')) closePops(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePops(); });
    $('#datePop').addEventListener('click', e => {
      const p = e.target.closest('[data-preset]'); if (p) return setRange(p.dataset.preset);
      if (e.target.id === 'cApply') { const s = parseDate($('#cStart').value), en = parseDate($('#cEnd').value); if (s == null || en == null) return; setRange('custom', s <= en ? [s, en] : [en, s]); }
    });
    $('#datePop').addEventListener('change', e => { if (e.target.id === 'cmpToggle') { S.compare = e.target.checked; store.set('range', { preset: S.range.preset, custom: S.range.custom, compare: S.compare }); renderHeader(); renderView(); } });
    $('#view').addEventListener('click', e => {
      const sg = e.target.closest('[data-seg]'), so = e.target.closest('[data-sort]'), sa = e.target.closest('[data-showall]'), ex = e.target.closest('[data-export]'), ac = e.target.closest('[data-action="refresh"]');
      if (sg) { S.vs.seg[sg.dataset.seg] = sg.dataset.val; renderView(); const b = $(`[data-seg="${sg.dataset.seg}"][data-val="${sg.dataset.val}"]`); if (b) b.focus({ preventScroll: true }); }
      else if (so) { const [id, key] = so.dataset.sort.split('|'), st = S.vs.tables[id]; st.dir = st.key === key ? (st.dir === 'asc' ? 'desc' : 'asc') : (key === '__name' ? 'asc' : 'desc'); st.key = key; renderView(); }
      else if (sa) { const st = S.vs.tables[sa.dataset.showall]; st.all = !st.all; renderView(); }
      else if (ex) exportCsv(ex.dataset.export);
      else if (ac) loadAll(true);
    });
    let lastW = 0, lastH = 0, lastD = dens(), tm;
    new ResizeObserver(() => {
      const w = $('#view').clientWidth, h = $('#view').clientHeight;
      if (w === lastW && h === lastH) return; lastW = w; lastH = h;
      clearTimeout(tm); tm = setTimeout(() => { if (dens() !== lastD) { lastD = dens(); renderHeader(); renderView(); } else mountCharts(); }, 80);
    }).observe($('#view'));
    window.addEventListener('resize', () => { if (dens() !== lastD) { lastD = dens(); renderHeader(); renderView(); } });
    window.addEventListener('beforeprint', () => { S.printing = true; renderView(); });   // print always uses the Detailed layout
    window.addEventListener('afterprint', () => { S.printing = false; renderView(); });
  }

  /* -------------------------------------------------------------------- boot */
  function boot() {
    const r = store.get('range');
    if (r && (r.preset === 'custom' ? Array.isArray(r.custom) : PRESETS.some(p => p.id === r.preset))) { S.range = { preset: r.preset, custom: r.custom || null }; if (typeof r.compare === 'boolean') S.compare = r.compare; }
    const th = store.get('theme') || (CFG.theme === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : (CFG.theme || 'light'));
    S.density = store.get('density') || (CFG.layout && CFG.layout.default) || 'glance';
    S.navCollapsed = !!store.get('nav');
    S.route = parseRoute(); bind(); applyTheme(th); render();
    loadAll(false);
    if (CFG.autoRefreshMinutes > 0) setInterval(() => loadAll(false), CFG.autoRefreshMinutes * 60000);
  }
  window.Dashboard = { refresh: () => loadAll(true), state: S, config: CFG };
  boot();
})();
