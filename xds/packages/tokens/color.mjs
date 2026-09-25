// AFEX colour science utilities — OKLab distance, WCAG contrast, CVD simulation.
// No dependencies. Used by the token generator and the CI contrast gate.

export const hex2rgb = (h) => {
  const s = h.replace('#', '').trim();
  return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16));
};
export const rgb2hex = (r) =>
  '#' + r.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();

const srgb2lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lin2srgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055) * 255;

// ---- OKLab ----
export function oklab(hex) {
  const [r, g, b] = hex2rgb(hex).map(srgb2lin);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}
// Perceptual distance, ×100 so the numbers read like Delta-E.
export function dE(h1, h2) {
  const A = oklab(h1), B = oklab(h2);
  return Math.hypot(A.L - B.L, A.a - B.a, A.b - B.b) * 100;
}
export const chroma = (hex) => { const o = oklab(hex); return Math.hypot(o.a, o.b) * 100; };
export const lightness = (hex) => oklab(hex).L * 100;

// ---- WCAG 2.1 ----
export function luminance(hex) {
  const [r, g, b] = hex2rgb(hex).map(srgb2lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(h1, h2) {
  const a = luminance(h1), b = luminance(h2);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// ---- CVD simulation (Viénot / Brettel / Mollon, LMS plane projection) ----
const RGB2LMS = [
  [0.31399022, 0.63951294, 0.04649755],
  [0.15537241, 0.75789446, 0.08670142],
  [0.01775239, 0.10944209, 0.87256922],
];
const LMS2RGB = [
  [ 5.47221206, -4.64196010,  0.16963708],
  [-1.12524190,  2.29317094, -0.16789520],
  [ 0.02980165, -0.19318073,  1.16364789],
];
const SIM = {
  protan:  [[0, 1.05118294, -0.05116099], [0, 1, 0], [0, 0, 1]],
  deutan:  [[1, 0, 0], [0.9513092, 0, 0.04866992], [0, 0, 1]],
  tritan:  [[1, 0, 0], [0, 1, 0], [-0.86744736, 1.86727089, 0]],
};
const mul = (M, v) => M.map(row => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);

export function cvd(hex, kind) {
  if (kind === 'normal') return hex;
  const lin = hex2rgb(hex).map(srgb2lin);
  const lms = mul(RGB2LMS, lin);
  const sim = mul(SIM[kind], lms);
  return rgb2hex(mul(LMS2RGB, sim).map(lin2srgb));
}

export const CVD_KINDS = ['normal', 'protan', 'deutan', 'tritan'];

// Worst-case separation across normal vision and the three dichromacies.
export function cvdMin(h1, h2) {
  return Math.min(...CVD_KINDS.map(k => dE(cvd(h1, k), cvd(h2, k))));
}
// Separation for full-colour readers only.
export const normalDE = (h1, h2) => dE(h1, h2);

export function pairReport(h1, h2) {
  const out = {};
  for (const k of CVD_KINDS) out[k] = +dE(cvd(h1, k), cvd(h2, k)).toFixed(1);
  out.min = Math.min(...Object.values(out));
  return out;
}

// ---- OKLCH -> sRGB (with in-gamut chroma search) ----
function oklab2rgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
     4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}
const inGamut = (rgb) => rgb.every(c => c >= -0.0005 && c <= 1.0005);
const toSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(Math.max(c,0), 1/2.4) - 0.055) * 255;

// L in 0..1, C in OKLab chroma units, H in degrees. Chroma is reduced until in gamut.
export function oklch(L, C, H) {
  const rad = H * Math.PI / 180;
  let lo = 0, hi = C;
  if (inGamut(oklab2rgb(L, C * Math.cos(rad), C * Math.sin(rad)))) lo = C;
  else { for (let i = 0; i < 28; i++) { const mid = (lo + hi) / 2;
      if (inGamut(oklab2rgb(L, mid * Math.cos(rad), mid * Math.sin(rad)))) lo = mid; else hi = mid; } }
  const rgb = oklab2rgb(L, lo * Math.cos(rad), lo * Math.sin(rad));
  return rgb2hex(rgb.map(toSrgb));
}

// ---- Alpha derivation ----------------------------------------------------
// Given a solid colour C that sits on background B, find the translucent
// colour A and the smallest alpha a such that compositing A over B reproduces
// C exactly. Minimising alpha is the point: the lower it is, the better the
// token survives being placed on a background other than the one it was
// derived against, which is the whole reason alphas exist.
//
//   a·A + (1−a)·B = C   →   solve per channel, take the largest a required.
export function toAlpha(hexC, hexB) {
  const C = hex2rgb(hexC), B = hex2rgb(hexB);
  let a = 0;
  for (let i = 0; i < 3; i++) {
    if (C[i] === B[i]) continue;
    const bound = C[i] < B[i] ? 0 : 255;          // the channel is heading to black or white
    const need = (C[i] - B[i]) / (bound - B[i]);
    if (need > a) a = need;
  }
  a = Math.ceil(a * 1000) / 1000;                  // 3dp, and never round down
  if (a <= 0) return { hex: '#000000', alpha: 0, css: 'rgba(0, 0, 0, 0)' };
  const A = C.map((c, i) => (c - B[i] * (1 - a)) / a);
  const r = A.map(v => Math.round(Math.max(0, Math.min(255, v))));
  return { hex: rgb2hex(r), alpha: a, css: `rgba(${r[0]}, ${r[1]}, ${r[2]}, ${a})` };
}

/** Round-trip check: composite an alpha token back over its background. */
export function composite(css, hexB) {
  const m = css.match(/rgba?\(([^)]+)\)/);
  if (!m) return css;
  const [r, g, b, a = 1] = m[1].split(',').map(s => parseFloat(s.trim()));
  const B = hex2rgb(hexB);
  return rgb2hex([r, g, b].map((c, i) => c * a + B[i] * (1 - a)));
}
