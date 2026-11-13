/* ==========================================================================
   Demo data generator — only used when config.source.mode === "demo".
   Produces rows shaped exactly like your Google Sheet tabs (using the header
   names from config.js), so you can demo the dashboard before any client data
   is connected. Deterministic: Refresh returns the same numbers.
   ========================================================================== */
(function (root) {
  'use strict';
  const DAY = 864e5;
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const WK = [0.84, 1.0, 1.05, 1.04, 1.0, 0.94, 0.80];            // Sun..Sat
  const iso = n => new Date(n * DAY).toISOString().slice(0, 10);

  // [campaign, dim2, dailySpend, cpm, ctr, cvr, aov, viewRate]
  const PAID = {
    meta: [
      ['Spring Promo – Prospecting', 'Sales', 420, 14, .014, .032, 96],
      ['Retargeting – Cart Abandoners', 'Sales', 190, 22, .024, .070, 112],
      ['Lookalike 1% – Past Buyers', 'Sales', 240, 13, .013, .028, 101],
      ['Catalog – Best Sellers', 'Sales', 150, 16, .016, .034, 88],
      ['Lead Gen – Free Guide', 'Leads', 120, 11, .018, .050, 40],
      ['Traffic – Blog Content', 'Traffic', 60, 8, .021, .006, 70],
      ['Brand Awareness – Video', 'Awareness', 45, 6, .004, .002, 60],
      ['Holiday Offer – Broad', 'Sales', 110, 15, .012, .026, 130]
    ],
    google: [
      ['Search – Brand', 'Search', 90, 38, .085, .110, 105],
      ['Search – Generic', 'Search', 280, 42, .036, .045, 98],
      ['Performance Max – All Products', 'Performance Max', 330, 20, .018, .038, 92],
      ['Shopping – Best Sellers', 'Shopping', 170, 24, .014, .042, 85],
      ['Display – Remarketing', 'Display', 70, 7, .006, .020, 80],
      ['Search – Competitors', 'Search', 80, 55, .028, .030, 110]
    ],
    youtube: [
      ['In-Stream – Brand Story', 'In-stream', 130, 9, .004, .016, 90, .32],
      ['Shorts – Product Demo', 'Shorts', 95, 6, .005, .024, 85, .41],
      ['Discovery – How-To Guides', 'Discovery', 60, 12, .008, .030, 88, .08],
      ['Bumper – Awareness', 'Bumper', 40, 5, .002, .004, 70, .55],
      ['In-Stream – Retargeting', 'In-stream', 70, 14, .006, .050, 104, .30]
    ]
  };
  const SOURCES = [['google / organic', 'Organic Search', 440], ['google / cpc', 'Paid Search', 270], ['(direct) / (none)', 'Direct', 310], ['facebook / paid', 'Paid Social', 230], ['instagram / referral', 'Organic Social', 95], ['newsletter / email', 'Email', 75], ['youtube / referral', 'Organic Video', 45]];
  const LEADSRC = [['Facebook Lead Form', 18], ['Google Ads', 14], ['Website Form', 12], ['Organic Search', 8], ['Referral', 6], ['Phone Call', 6]];
  const SOCIAL = [['Facebook', 'Image', 1700, .016], ['Facebook', 'Video', 2600, .020], ['Facebook', 'Link Post', 900, .009], ['Instagram', 'Reel', 5200, .034], ['Instagram', 'Carousel', 2300, .041], ['Instagram', 'Image', 1500, .028]];

  function generate(cfg, endDay, days) {
    days = days || 420;
    const out = {};
    (cfg.channels || []).forEach(ch => {
      if (!ch.demo) return;
      const R = rng(hash(ch.id)), g = () => Math.sqrt(-2 * Math.log(R() || 1e-9)) * Math.cos(2 * Math.PI * R());
      const pois = m => Math.max(0, Math.round(m + g() * Math.sqrt(Math.max(m, 0))));
      const C = ch.columns, rows = [];
      const push = o => {
        const r = {}; r[C.date] = iso(o.day);
        if (C.dimension) r[C.dimension] = o.dim; if (C.dimension2) r[C.dimension2] = o.dim2;
        Object.keys(o).forEach(k => { if (C[k] && k !== 'dimension' && k !== 'dimension2' && k !== 'date') r[C[k]] = o[k]; });
        rows.push(r);
      };
      for (let t = 0; t < days; t++) {
        const day = endDay - days + 1 + t, dow = (day + 4) % 7, p = t / days;
        const growth = 1 + 0.42 * p + 0.025 * Math.sin(t / 23), quality = 1 + 0.12 * p + 0.05 * Math.sin(t / 41 + 1);
        if (PAID[ch.demo]) {
          const key = ch.demo;
          (PAID[key] || PAID.meta).forEach(c => {
            if (R() < 0.04) return;
            const spend = c[2] * WK[dow] * growth * (0.88 + R() * 0.24);
            const impressions = Math.round(spend / (c[3] * (0.92 + R() * 0.16)) * 1000);
            const clicks = Math.round(impressions * c[4] * (0.85 + R() * 0.3));
            const conversions = pois(clicks * c[5] * quality);
            const o = { day, dim: c[0], dim2: c[1], spend: +spend.toFixed(2), impressions, clicks, conversions, revenue: +(conversions * c[6] * (0.85 + R() * 0.3)).toFixed(2), reach: Math.round(impressions / (1.25 + R() * 0.5)) };
            if (c[7]) o.views = Math.round(impressions * c[7] * (0.9 + R() * 0.2));
            push(o);
          });
        } else if (ch.demo === 'analytics') {
          SOURCES.forEach(s => {
            const sessions = pois(s[2] * WK[dow] * growth * (0.9 + R() * 0.2));
            const users = Math.round(sessions * (0.78 + R() * 0.08));
            push({ day, dim: s[0], dim2: s[1], sessions, users, newUsers: Math.round(users * (0.55 + R() * 0.12)), engagedSessions: Math.round(sessions * (0.56 + R() * 0.1 + 0.04 * p)), conversions: pois(sessions * 0.021 * quality), revenue: 0 });
            const last = rows[rows.length - 1]; if (C.revenue) last[C.revenue] = +(last[C.conversions] * (82 + R() * 30)).toFixed(2);
          });
        } else if (ch.demo === 'crm') {
          LEADSRC.forEach(s => {
            const leads = pois(s[1] * WK[dow] * growth * (0.9 + R() * 0.2));
            const appointments = Math.round(leads * (0.34 + R() * 0.1)), opportunities = Math.round(appointments * (0.62 + R() * 0.12));
            const won = pois(opportunities * 0.34 * quality);
            push({ day, dim: s[0], dim2: '', leads, appointments, opportunities, won, revenue: +(won * (1400 + R() * 900)).toFixed(2) });
          });
        } else if (ch.demo === 'social') {
          SOCIAL.forEach(s => {
            const posted = R() < (dow === 0 ? 0.25 : 0.55);
            const reach = Math.round(s[2] * WK[dow] * growth * (0.7 + R() * 0.6)), impressions = Math.round(reach * (1.2 + R() * 0.4));
            push({ day, dim: s[1], dim2: s[0], posts: posted ? 1 : 0, reach, impressions, engagements: Math.round(reach * s[3] * (0.8 + R() * 0.4)), linkClicks: Math.round(reach * 0.004 * (0.6 + R() * 0.8)), followers: pois(3 * growth) });
          });
        }
      }
      out[ch.tab] = rows;
    });
    return out;
  }
  root.DemoData = { generate };
})(typeof window !== 'undefined' ? window : globalThis);
