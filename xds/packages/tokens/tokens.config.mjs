// AFEX design system — the whole configuration.
// Everything in tokens.css is generated from this file. Edit here, never there.
//
// Four planes, and the rule that makes them work: a plane owns its colours and
// never lends them out. Brand fills only. System chrome only. Market data cells
// only. Chart series only. This is what resolves the collision between a red
// brand and a red "price down" — they are never allowed to appear in each
// other's contexts, so they never have to be told apart.

export const PLANES = {
  brand:  'Identity. Fills, primary actions, links. Never a data value.',
  system: 'Interface state. Success / info / warning / danger chrome. Never a price.',
  market: 'Price direction only. Up / down / flat. Never a button, never a toast.',
  chart:  'Series identity in plots. Never a status, never a direction.',
};

// ---- Which scale backs each role, and how many rungs it needs ----
export const ROLES = {
  neutral: { scale: 'parasol',     plane: 'system', ladder: 'full'   },
  brand:   { scale: 'main',        plane: 'brand',  ladder: 'accent' },
  success: { scale: 'success',     plane: 'system', ladder: 'status' },
  info:    { scale: 'information', plane: 'system', ladder: 'status' },
  warning: { scale: 'warning',     plane: 'system', ladder: 'status' },
  danger:  { scale: 'error',       plane: 'system', ladder: 'status' },
};

// ---- Ladders: which scale step fills which semantic rung ----
export const LADDERS = {
  full: {
    'bg-page': 1, 'bg-raised': 2, 'bg-sunken': 3,
    'bg-subtle': 3, 'bg-subtle-hover': 4, 'bg-subtle-active': 5,
    'border': 6, 'border-strong': 7,
    'bg-solid': 9, 'bg-solid-hover': 10,
    'text-muted': 11, 'text-primary': 12,
  },
  // Brand gets every interactive rung but no page surfaces. Only the neutral
  // scale is allowed to paint a page — a brand-tinted app background is how a
  // product ends up looking like a landing page it cannot escape.
  accent: {
    'bg-subtle': 3, 'bg-subtle-hover': 4, 'bg-subtle-active': 5,
    'border': 6, 'border-strong': 7,
    'bg-solid': 9, 'bg-solid-hover': 10,
    'text': 11, 'text-strong': 12,
  },
  status: {
    'bg-subtle': 3, 'border': 6, 'bg-solid': 9, 'text': 11,
  },
};

// ---- Market plane -------------------------------------------------------
// Not ladder-derived. These exact pairs were chosen by measurement: each is the
// best available separation between an up-green and a down-red that still reads
// conventionally and clears 4.5:1 on its own surface.
//
// The default light pair scores CVD-min 6.7 (protanopia is the weak case). That
// sits in the 6–8 band, which is legal ONLY where a second, non-colour encoding
// is present. The table standard already makes the triangle and the explicit
// sign mandatory on every change cell, so the condition is met by construction —
// but it means this token may not be used without them. That constraint travels
// with the token; it is not advice.
//
// `highContrast` swaps in a pair scoring 16.5 for users who turn it on, at the
// cost of the down colour reading as oxblood rather than red.
export const MARKET = {
  light: {
    up:            { text: '#00814F', subtle: '#F4FBF7', border: '#ABDEC1' },
    down:          { text: '#CE2C31', subtle: '#FFF7F7', border: '#FDBDBE' },
    flat:          { text: '#686161', subtle: '#F2EFEF', border: '#DDD8D8' },
    flashUp:       'rgba(12, 143, 92, 0.16)',
    flashDown:     'rgba(206, 44, 49, 0.16)',
    highContrast:  { up: '#00814F', down: '#641723' },
  },
  dark: {
    up:            { text: '#64D199', subtle: '#0A130E', border: '#005B37' },
    down:          { text: '#E5484D', subtle: '#191111', border: '#72232D' },
    flat:          { text: '#B6B3B3', subtle: '#232222', border: '#3B3A3A' },
    flashUp:       'rgba(100, 209, 153, 0.20)',
    flashDown:     'rgba(229, 72, 77, 0.20)',
    highContrast:  { up: '#9CF7C5', down: '#E5484D' },
  },
};

// ---- Chart plane --------------------------------------------------------
// Generated, not chosen by eye. With a red brand, four status hues and a
// green/red market pair all reserved, only the arc from 204° to 330° is free —
// cyan through blue to magenta. Hue alone cannot carry more than two series in
// that space, because cyan-blue-magenta is exactly the axis dichromats compress.
// So these six separate on lightness as well as hue. Worst within-palette pair
// 8.5; worst against any reserved colour 9.2.
//
// Six is the ceiling, not a preference. For more series than this — eight
// commodities on one axis, say — do not add a seventh colour. Highlight one
// series and grey the rest, or facet into small multiples.
export const CHART = {
  categorical: {
    light: ['#006870', '#009DCC', '#313290', '#2076C9', '#00848E', '#005BA7'],
    dark:  ['#0095A0', '#40CBFF', '#545CBD', '#51A2F8', '#00B3C0', '#3386D9'],
  },
  // Single hue, light to dark. Magnitude only.
  sequential: {
    light: ['#D2E7FF', '#A4CFFF', '#84B2E6', '#6996C8', '#4E7AAB', '#35608F', '#1B4773'],
    dark:  ['#002E59', '#1E4976', '#3A6695', '#5783B5', '#75A2D5', '#93C2F6', '#C7E1FF'],
  },
  // Two hues with a neutral midpoint. Polarity — below/above a reference price.
  diverging: {
    light: ['#9A3936', '#C8635D', '#FF958D', '#EEEAEB', '#66D097', '#2B9D67', '#007044'],
    dark:  ['#FF958D', '#C8635D', '#8F4340', '#2A2929', '#1F6B52', '#2B9D67', '#66D097'],
  },
  muted: { light: '#C1B9B9', dark: '#4A4848' }, // the greyed-out series
};

// ---- Type ---------------------------------------------------------------
// The face is Switzer (ITF Free Font License — confirm bundling rights before
// shipping). The numeric face is UNRESOLVED pending the tabular-figures test;
// `numeric` below falls back through a stack that is tabular on every platform,
// so nothing breaks while that decision is open.
export const TYPE = {
  families: {
    sans:    "'Switzer', system-ui, -apple-system, 'Segoe UI', sans-serif",
    numeric: "'Switzer Tabular', 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace",
    mono:    "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  },
  // A 1.2 minor-third scale from a 16px base. Line heights are absolute, not
  // ratios, so a row of mixed sizes still sits on one grid.
  scale: {
    '2xs': [11, 16], xs: [12, 18], sm: [13, 20], base: [16, 24],
    lg:    [19, 28], xl: [23, 32], '2xl': [28, 36],
    '3xl': [33, 42], '4xl': [40, 48], '5xl': [48, 56],
  },
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  tracking: { tight: '-0.018em', normal: '0', wide: '0.06em', caps: '0.12em' },
};

// ---- Radius & spacing ---------------------------------------------------
// Radius is published as-is. Spacing is the published 22-step scale pruned to
// 12: every value the components actually use survives, the near-duplicates
// (6/8/10, 14/16/18/20) collapse. A scale nobody can hold in their head gets
// used at random, which is the problem the original 22 steps created.
export const RADIUS = { none: 0, xs: 2, sm: 4, md: 6, lg: 8, xl: 12, '2xl': 16, '3xl': 24, '4xl': 32, full: 9999 };

export const SPACING = {
  0: 0, 1: 2, 2: 4, 3: 8, 4: 12, 5: 16, 6: 24,
  7: 32, 8: 40, 9: 48, 10: 64, 11: 80, 12: 96,
};

// Density presets for the table standard (doc 05). Touch target is not a
// density concern — it stays 44px on coarse pointers at every setting.
export const DENSITY = {
  comfortable: { padBlock: 14, padInline: 16, fontSize: 15 },
  compact:     { padBlock: 11, padInline: 12, fontSize: 14 },
  dense:       { padBlock: 7,  padInline: 9,  fontSize: 13 },
};

// ---- Accessibility gates enforced by audit.mjs --------------------------
export const GATES = {
  textContrast: 4.5,      // WCAG 2.1 AA, body text
  largeText: 3.0,
  nonText: 3.0,           // borders, marks, focus rings
  chartPairCVD: 8.0,      // within-palette, worst of protan/deutan
  marketPairCVD: 6.0,     // floor; below 8 requires the mandatory glyph

  // Reserved-colour separation is tiered, because the risk is not uniform.
  // A chart series that looks like a price-down red, or like the brand, is a
  // misreading of the data. A chart series that resembles the blue of an info
  // toast is not — chrome never appears inside a plot area. Holding both to the
  // same number would reject a palette for a confusion that cannot occur.
  reservedData: 9.0,      // vs brand, error, market up/down
  reservedChrome: 5.0,    // vs info, warning
};

// When a generated fill cannot carry its own label at AA, the generator does
// not ship it — it walks up the scale to the first step that can, and records
// the substitution. A fill nobody can label is not a fill.
export const SNAP = {
  enabled: true,
  solidSteps: [9, 10, 11],  // tried in order
};

// Known gaps. Named, so nothing silently defaults.
export const GAPS = [
  'Mint and Sky scales were never supplied.',
  'Cyan dark column was never supplied.',
  'Type scale was never supplied — the scale above is proposed, not confirmed.',
  'Switzer tabular-figures test result outstanding; numeric face unresolved.',
  'Switzer licence is ITF Free Font License, not MIT — bundling rights unconfirmed.',
  'Elevation/shadow, motion and focus-ring styling await the moodboard.',
];
