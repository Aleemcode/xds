// AFEX token audit. Exit code 1 on any FAIL, so it can gate a merge.
//   node audit.mjs            human-readable report
//   node audit.mjs --quiet    failures only
//
// Checks the things a person cannot check by looking: text contrast on the
// surface each token actually sits on, colour-vision separation for every pair
// that carries meaning, and the invariants the scales are supposed to hold.

import { CORE, ADDITIONAL_RAW, SOLID_9 } from './scales.mjs';
import { MARKET, CHART, GATES, ROLES } from './tokens.config.mjs';
import { contrast, dE, cvd, lightness } from './color.mjs';

const quiet = process.argv.includes('--quiet');
let fails = 0, warns = 0;

const common = (a, b) => Math.min(dE(cvd(a, 'protan'), cvd(b, 'protan')), dE(cvd(a, 'deutan'), cvd(b, 'deutan')));
const sep = (a, b) => Math.min(common(a, b), dE(a, b));

function check(label, value, gate, unit = '') {
  const pass = value >= gate;
  if (!pass) fails++;
  if (!quiet || !pass) {
    console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${label.padEnd(46)} ${value.toFixed(1)}${unit} (min ${gate})`);
  }
  return pass;
}
function warn(label, condition, detail) {
  if (condition) return;
  warns++;
  console.log(`  WARN  ${label.padEnd(46)} ${detail}`);
}
const head = (s) => { if (!quiet) console.log(`\n${s}`); };

const S = (scale, theme, n) => CORE[scale][theme][n - 1];
const surface = { light: S('parasol', 'light', 1), dark: S('parasol', 'dark', 1) };

// ---------------------------------------------------------------- 1. text
head('TEXT CONTRAST ON ITS OWN SURFACE');
for (const theme of ['light', 'dark']) {
  const bg = surface[theme];
  check(`${theme} · body text`,       contrast(S('parasol', theme, 12), bg), GATES.textContrast, ':1');
  check(`${theme} · muted text`,      contrast(S('parasol', theme, 11), bg), GATES.textContrast, ':1');
  check(`${theme} · brand link`,      contrast(S('main', theme, 11), bg),    GATES.textContrast, ':1');
  for (const role of ['success', 'info', 'warning', 'danger']) {
    const scale = ROLES[role].scale;
    check(`${theme} · ${role} text`,  contrast(S(scale, theme, 11), bg),     GATES.textContrast, ':1');
  }
  // Solid fills, as the generator actually emitted them (post-snap).
  for (const role of ['brand', 'success', 'info', 'danger']) {
    const scale = ROLES[role].scale;
    let best = 0;
    for (const n of [9, 10, 11]) {
      const fill = S(scale, theme, n);
      best = Math.max(best, contrast(fill, '#FFFFFF'), contrast(fill, '#241E1E'));
      if (best >= GATES.textContrast) break;
    }
    check(`${theme} · label on ${role} solid`, best, GATES.textContrast, ':1');
  }
  check(`${theme} · default border`,  contrast(S('parasol', theme, 6), bg),  1.3, ':1');
}

// -------------------------------------------------------------- 2. market
head('MARKET PLANE — the pair that must never be confused');
for (const theme of ['light', 'dark']) {
  const m = MARKET[theme], bg = surface[theme];
  check(`${theme} · up text on surface`,   contrast(m.up.text, bg),   GATES.textContrast, ':1');
  check(`${theme} · down text on surface`, contrast(m.down.text, bg), GATES.textContrast, ':1');
  check(`${theme} · up on up-subtle`,      contrast(m.up.text, m.up.subtle),     GATES.textContrast, ':1');
  check(`${theme} · down on down-subtle`,  contrast(m.down.text, m.down.subtle), GATES.textContrast, ':1');

  const pair = sep(m.up.text, m.down.text);
  check(`${theme} · up/down separation`,   pair, GATES.marketPairCVD, ' dE');
  warn(`${theme} · up/down without a glyph`, pair >= 8,
       `${pair.toFixed(1)} dE — legal only because the triangle and sign are mandatory`);

  const hc = sep(m.highContrast.up, m.highContrast.down);
  check(`${theme} · high-contrast pair`,   hc, 12, ' dE');
  // Direction must never be confusable with a status colour.
  for (const [n, s] of Object.entries({ success: SOLID_9.success, danger: SOLID_9.error, brand: SOLID_9.main })) {
    warn(`${theme} · up vs ${n}`, sep(m.up.text, s) >= 5, `${sep(m.up.text, s).toFixed(1)} dE`);
  }
}

// --------------------------------------------------------------- 3. chart
head('CHART PLANE');
const RESERVED = {
  brand: SOLID_9.main, error: SOLID_9.error, warning: SOLID_9.warning,
  success: SOLID_9.success, info: SOLID_9.information,
};
for (const theme of ['light', 'dark']) {
  const p = CHART.categorical[theme], bg = surface[theme];
  let worst = Infinity, wp = '';
  for (let i = 0; i < p.length; i++) {
    check(`${theme} · series ${i + 1} on surface`, contrast(p[i], bg), GATES.nonText, ':1');
    for (let j = i + 1; j < p.length; j++) {
      const v = sep(p[i], p[j]);
      if (v < worst) { worst = v; wp = `${i + 1}/${j + 1}`; }
    }
  }
  check(`${theme} · worst series pair (${wp})`, worst, GATES.chartPairCVD, ' dE');

  const DATA = { brand: RESERVED.brand, error: RESERVED.error,
                 up: MARKET[theme].up.text, down: MARKET[theme].down.text };
  const CHROME = { info: RESERVED.info, warning: RESERVED.warning };
  for (const [tier, group, gate] of [['data', DATA, GATES.reservedData],
                                     ['chrome', CHROME, GATES.reservedChrome]]) {
    let wr = Infinity, wrn = '';
    for (const c of p) for (const [n, r] of Object.entries(group)) {
      const v = sep(c, r);
      if (v < wr) { wr = v; wrn = n; }
    }
    check(`${theme} · worst series vs ${wrn} (${tier})`, wr, gate, ' dE');
  }

  // A diverging ramp must have a genuinely neutral midpoint.
  const mid = CHART.diverging[theme][3];
  warn(`${theme} · diverging midpoint is neutral`, dE(mid, bg) < 12,
       `midpoint ${mid} sits ${dE(mid, bg).toFixed(1)} from the surface`);
}

// ----------------------------------------------------------- 4. integrity
head('SCALE INTEGRITY');
for (const k of Object.keys(CORE)) {
  if (k === 'parasol') continue; // neutrals legitimately differ at step 9
  warn(`${k} · step 9 constant across themes`,
       S(k, 'light', 9) === S(k, 'dark', 9),
       `${S(k, 'light', 9)} vs ${S(k, 'dark', 9)}`);
}
for (const [name, v] of Object.entries(ADDITIONAL_RAW)) {
  if (!v.light) continue;
  warn(`X-Additional/${name} · step 1 is an app background`,
       lightness(v.light[0]) > 95,
       `lightness ${lightness(v.light[0]).toFixed(0)} — not a usable light scale`);
}
warn('X-Additional/ruby · distinct from Error in dark',
     !(v => v)(ADDITIONAL_RAW.ruby.dark.every((h, i) => h.toUpperCase() === CORE.error.dark[i].toUpperCase())),
     'byte-identical to the Error dark scale');

// ----------------------------------------------------------------- done
console.log(`\n${fails} failed, ${warns} warnings.`);
if (fails) { console.log('Token audit FAILED.'); process.exit(1); }
console.log('Token audit passed.');
