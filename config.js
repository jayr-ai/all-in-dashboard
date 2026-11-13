/* ==========================================================================
   CLIENT CONFIG — the only file you edit when you onboard a new client.
   1. Branding + client name     2. Where the data lives (Google Sheet)
   3. Which channels appear in the left menu, and what each one shows
   Run it as-is to see the demo (source.mode = "demo").
   ========================================================================== */
window.DASHBOARD_CONFIG = {

  /* ---------- 1. CLIENT + BRANDING ---------- */
  client:   { name: 'AZ Marketing', reportTitle: 'Marketing Dashboard' },
  branding: {
    logo: 'assets/logo.svg',     // top-left. SVG/PNG. Falls back to a monogram if missing.
    logoDark: null,              // optional logo for dark mode
    logoWide: false,             // true for a wide wordmark logo (also set showName:false)
    showName: true,              // show client name next to the logo
    accent: '#FA421E',           // the ONE brand color: active nav, charts, buttons
    accentDark: '#ed9953'        // same accent, lightened for dark mode
  },
  theme: 'light',                // 'light' (print-friendly default) | 'dark' | 'auto'
  locale: 'en-US',               // number/date style, e.g. 'en-PH', 'en-AU'
  currency: 'AUD',               // 'PHP', 'AUD', 'GBP' ...
  dateOrder: 'MDY',              // for text dates like 4/11/2026: 'MDY' or 'DMY'
  storageKey: 'aaz-marketing',  // unique per client (remembers date range + theme)

  /* ---------- 2. DATA SOURCE ---------- */
  source: {
    mode: 'gviz',                // 'demo' | 'gviz' | 'appsscript'
    sheetId: '1J5ayMtPJxiwzhSZrbF56kj3JdqC4lUxB',    // gviz: the long ID in the Google Sheet URL (sheet shared "Anyone with link → Viewer")
    appsScriptUrl: 'YOUR_WEB_APP_URL', // appsscript: private sheets — see README
    token: ''                    // appsscript: optional shared secret (must match Code.gs)
  },
  layout: { default: 'glance' },   // 'glance' = everything on one screen (laptops) · 'detail' = roomy scrolling layout
  dates: { default: '30d', includeToday: false, compare: true },
  autoRefreshMinutes: 0,         // 0 = only when Refresh is pressed
  staleAfterDays: 3,             // warn in "Data status" if the newest row is older than this

  /* ---------- 3. CHANNELS (left menu, top to bottom) ----------
     tab      : exact name of the Google Sheet tab
     columns  : metric key → header in that tab. Rename headers here, never in the engine.
                Delete a line and every KPI/chart that needs it hides automatically.
     kpis     : first 4 = big cards with sparklines, next 4 = compact cards (max 8)
     group    : 'paid' channels are blended on the Overview page
     labels   : rename a metric for this channel only (e.g. conversions → Purchases)           */
  channels: [
    {
      id: 'meta', label: 'Meta Ads', icon: 'megaphone', section: 'Paid media', group: 'paid',
      tab: 'Meta Ads', demo: 'meta',
      columns: { date: 'Date', dimension: 'Campaign', dimension2: 'Objective', spend: 'Spend', impressions: 'Impressions', reach: 'Reach', clicks: 'Clicks', conversions: 'Purchases', revenue: 'Purchase Value' },
      labels: { conversions: 'Purchases', revenue: 'Purchase Value', cpa: 'Cost / Purchase' },
      kpis: ['spend', 'revenue', 'roas', 'cpa', 'impressions', 'clicks', 'ctr', 'cpc'],
      trend: { title: 'Performance trend', metrics: ['spend', 'revenue', 'roas', 'conversions'] },
      breakdown: { title: 'Top campaigns', sub: 'Ranked for the selected metric', by: 'dimension', metrics: ['spend', 'revenue', 'roas'], limit: 8 },
      secondary: { type: 'breakdown', title: 'Performance by objective', by: 'dimension2', metrics: ['spend', 'revenue', 'conversions'] },
      table: { glanceColumns: ['spend', 'conversions', 'cpa', 'revenue', 'roas'], title: 'Campaign detail', columns: ['spend', 'impressions', 'clicks', 'ctr', 'conversions', 'cpa', 'revenue', 'roas'], sortBy: 'spend' }
    },
    {
      id: 'google-ads', label: 'Google Ads', icon: 'target', section: 'Paid media', group: 'paid',
      tab: 'Google Ads', demo: 'google',
      columns: { date: 'Date', dimension: 'Campaign', dimension2: 'Campaign Type', spend: 'Cost', impressions: 'Impressions', clicks: 'Clicks', conversions: 'Conversions', revenue: 'Conv. Value' },
      kpis: ['spend', 'revenue', 'roas', 'cpa', 'impressions', 'clicks', 'ctr', 'cpc'],
      trend: { title: 'Performance trend', metrics: ['spend', 'revenue', 'roas', 'conversions'] },
      breakdown: { title: 'Top campaigns', by: 'dimension', metrics: ['spend', 'revenue', 'roas'], limit: 8 },
      secondary: { type: 'breakdown', title: 'Performance by campaign type', by: 'dimension2', metrics: ['spend', 'revenue', 'conversions'] },
      table: { glanceColumns: ['spend', 'conversions', 'cpa', 'revenue', 'roas'], title: 'Campaign detail', columns: ['spend', 'impressions', 'clicks', 'ctr', 'cpc', 'conversions', 'cpa', 'revenue', 'roas'], sortBy: 'spend' }
    },
    {
      id: 'linkedin-ads', label: 'Linkedin Ads', icon: 'target', section: 'Paid media', group: 'paid',
      tab: 'LinkedinAds', demo: 'linkedin',
      columns: { date: 'Date', dimension: 'Campaign', dimension2: 'Campaign Type', spend: 'Cost', impressions: 'Impressions', clicks: 'Clicks', conversions: 'Conversions', revenue: 'Conv. Value' },
      kpis: ['spend', 'revenue', 'roas', 'cpa', 'impressions', 'clicks', 'ctr', 'cpc'],
      trend: { title: 'Performance trend', metrics: ['spend', 'revenue', 'roas', 'conversions'] },
      breakdown: { title: 'Top campaigns', by: 'dimension', metrics: ['spend', 'revenue', 'roas'], limit: 8 },
      secondary: { type: 'breakdown', title: 'Performance by campaign type', by: 'dimension2', metrics: ['spend', 'revenue', 'conversions'] },
      table: { glanceColumns: ['spend', 'conversions', 'cpa', 'revenue', 'roas'], title: 'Campaign detail', columns: ['spend', 'impressions', 'clicks', 'ctr', 'cpc', 'conversions', 'cpa', 'revenue', 'roas'], sortBy: 'spend' }
    },
    {
      id: 'youtube-ads', label: 'YouTube Ads', icon: 'play', section: 'Paid media', group: 'paid',
      tab: 'YouTube Ads', demo: 'youtube',
      columns: { date: 'Date', dimension: 'Campaign', dimension2: 'Ad Format', spend: 'Cost', impressions: 'Impressions', views: 'Views', clicks: 'Clicks', conversions: 'Conversions', revenue: 'Conv. Value' },
      kpis: ['spend', 'views', 'cpv', 'viewRate', 'impressions', 'cpm', 'conversions', 'roas'],
      trend: { title: 'Performance trend', metrics: ['spend', 'views', 'cpv', 'conversions'] },
      breakdown: { title: 'Top campaigns', by: 'dimension', metrics: ['spend', 'views', 'cpv'], limit: 8 },
      secondary: { type: 'breakdown', title: 'Performance by ad format', by: 'dimension2', metrics: ['spend', 'views', 'conversions'] },
      table: { glanceColumns: ['spend', 'views', 'viewRate', 'cpv', 'conversions'], title: 'Campaign detail', columns: ['spend', 'impressions', 'views', 'viewRate', 'cpv', 'clicks', 'conversions', 'revenue'], sortBy: 'spend' }
    },
    {
      id: 'ga', label: 'Google Analytics', icon: 'chart', section: 'Website & CRM',
      tab: 'Google Analytics', demo: 'analytics',
      columns: { date: 'Date', dimension: 'Source / Medium', dimension2: 'Channel Group', sessions: 'Sessions', users: 'Users', newUsers: 'New Users', engagedSessions: 'Engaged Sessions', conversions: 'Key Events', revenue: 'Revenue' },
      labels: { conversions: 'Key Events', revenue: 'Revenue' },
      kpis: ['sessions', 'users', 'engagedRate', 'sessionCvr', 'newUsers', 'engagedSessions', 'conversions', 'revenue'],
      snapshot: ['sessions', 'engagedRate', 'conversions'],
      trend: { title: 'Traffic trend', metrics: ['sessions', 'users', 'conversions', 'engagedRate'] },
      breakdown: { title: 'Top sources / mediums', by: 'dimension', metrics: ['sessions', 'conversions', 'revenue'], limit: 8 },
      secondary: { type: 'breakdown', title: 'Traffic by channel group', by: 'dimension2', metrics: ['sessions', 'conversions', 'revenue'] },
      table: { glanceColumns: ['sessions', 'users', 'engagedRate', 'conversions', 'revenue'], title: 'Source / medium detail', columns: ['sessions', 'users', 'newUsers', 'engagedRate', 'conversions', 'sessionCvr', 'revenue'], sortBy: 'sessions' }
    },
    {
      id: 'ghl', label: 'GoHighLevel', icon: 'users', section: 'Website & CRM',
      tab: 'GHL', demo: 'crm',
      columns: { date: 'Date', dimension: 'Source', leads: 'Leads', appointments: 'Appointments', opportunities: 'Opportunities', won: 'Won', revenue: 'Won Value' },
      labels: { revenue: 'Won Value' },
      kpis: ['leads', 'appointments', 'won', 'revenue', 'leadToAppt', 'winRate', 'leadToWon', 'avgDeal'],
      snapshot: ['leads', 'won', 'revenue'],
      trend: { title: 'Pipeline trend', metrics: ['leads', 'appointments', 'won', 'revenue'] },
      breakdown: { title: 'Leads by source', by: 'dimension', metrics: ['leads', 'won', 'revenue'], limit: 8 },
      secondary: { type: 'funnel', title: 'Lead-to-sale funnel', steps: ['leads', 'appointments', 'opportunities', 'won'] },
      table: { glanceColumns: ['leads', 'appointments', 'won', 'leadToWon', 'revenue'], title: 'Source detail', nameLabel: 'Lead source', columns: ['leads', 'appointments', 'opportunities', 'won', 'leadToWon', 'revenue'], sortBy: 'leads' }
    },
    {
      id: 'organic', label: 'Organic Social', icon: 'heart', section: 'Social',
      tab: 'Organic Social', demo: 'social',
      columns: { date: 'Date', dimension: 'Content Type', dimension2: 'Platform', posts: 'Posts', reach: 'Reach', impressions: 'Impressions', engagements: 'Engagements', linkClicks: 'Link Clicks', followers: 'New Followers' },
      kpis: ['reach', 'engagements', 'engagementRate', 'followers', 'impressions', 'linkClicks', 'posts'],
      snapshot: ['reach', 'engagements', 'followers'],
      trend: { title: 'Organic trend', metrics: ['reach', 'engagements', 'engagementRate', 'followers'] },
      breakdown: { title: 'Reach by content type', by: 'dimension', metrics: ['reach', 'engagements', 'engagementRate'], limit: 8 },
      secondary: { type: 'breakdown', title: 'Reach by platform', by: 'dimension2', metrics: ['reach', 'engagements', 'followers'] },
      table: { glanceColumns: ['posts', 'reach', 'engagements', 'engagementRate', 'followers'], title: 'Content type detail', nameLabel: 'Content type', columns: ['posts', 'reach', 'impressions', 'engagements', 'engagementRate', 'linkClicks', 'followers'], sortBy: 'reach' }
    }
  ],

  /* ---------- 4. OVERVIEW PAGE (first item in the menu; set overview:false to remove) ---------- */
  overview: {
    kpis: [   // from: 'paid' = all channels with group:'paid' combined, or a channel id
      { key: 'spend', from: 'paid', label: 'Total Ad Spend' },
      { key: 'revenue', from: 'paid', label: 'Attributed Revenue' },
      { key: 'roas', from: 'paid', label: 'Blended ROAS' },
      { key: 'cpa', from: 'paid', label: 'Blended CPA' },
      { key: 'sessions', from: 'ga', label: 'Website Sessions' },
      { key: 'leads', from: 'ghl', label: 'New Leads' },
      { key: 'won', from: 'ghl', label: 'Won Deals' },
      { key: 'reach', from: 'organic', label: 'Organic Reach' }
    ],
    trend: { from: 'paid', title: 'Paid media trend', metrics: ['spend', 'revenue', 'roas', 'conversions'] },
    byChannel: { from: 'paid', title: 'Paid performance by channel', metrics: ['spend', 'revenue', 'conversions'] },
    scorecard: { title: 'Paid media scorecard', sub: 'Click a channel to open it', columns: ['spend', 'conversions', 'cpa', 'revenue', 'roas'], sortBy: 'spend' },
    snapshot: ['ga', 'ghl', 'organic']
  }
};
