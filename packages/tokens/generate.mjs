// AFEX token generator. Reads tokens.config.mjs, writes tokens.css.
//   node generate.mjs            -> writes tokens.css
//   node generate.mjs --stdout   -> prints instead
//
// The whole point: nobody hand-writes a token. ~120 lines of config produce the
// full set, so the grammar cannot drift and a duplicate cannot be introduced by
// hand. (The previous set had four `text-warning-*` tokens sitting inside the
// Information group, which is exactly the class of bug this removes.)

import { writeFileSync } from 'node:fs';
import { CORE } from './scales.mjs';
import { ROLES, LADDERS, MARKET, CHART, TYPE, RADIUS, SPACING, DENSITY, GAPS, GATES, SNAP } from './tokens.config.mjs';
import { contrast, toAlpha } from './color.mjs';

const step = (scale, theme, n) => CORE[scale][theme][n - 1];

// Alphas are generated for the brand and neutral scales, which are the two
// that appear under arbitrary content — overlays, hovers, the tick flash.
const ALPHA_SCALES = ['main', 'parasol'];
const lines = [];
const out = (s = '') => lines.push(s);
const snapLog = [];

// A solid fill has to carry a label. Try the wanted step first, then walk up,
// and for each pick whichever ink reads better. Both inks are theme-independent
// on purpose: a saturated fill is the same colour in both themes, so the label
// that works on it is too. This is why the dark-mode accents need near-black
// rather than white — the naive "white on a solid" assumption is what makes
// dark-mode buttons fail AA in most systems.
const INKS = ['#FFFFFF', '#241E1E'];
function solidFor(scale, theme, wanted) {
  const steps = SNAP.enabled ? SNAP.solidSteps : [wanted];
  for (const n of steps) {
    const fill = step(scale, theme, n);
    const scored = INKS.map(ink => [ink, contrast(fill, ink)]).sort((a, b) => b[1] - a[1]);
    if (scored[0][1] >= GATES.textContrast) {
      if (n !== wanted) snapLog.push(`${scale}/${theme}: solid snapped ${wanted} -> ${n} (${fill})`);
      return { fill, on: scored[0][0] };
    }
  }
  const fill = step(scale, theme, wanted);
  snapLog.push(`${scale}/${theme}: NO step carries a label at AA — left at ${wanted}`);
  return { fill, on: '#FFFFFF' };
}

function colorTokens(theme) {
  const t = [];
  for (const [role, def] of Object.entries(ROLES)) {
    const ladder = LADDERS[def.ladder];
    for (const [rung, n] of Object.entries(ladder)) {
      // neutral is the default role, so it drops its name: --bg-page, --text-primary
      const name = role === 'neutral' ? rung : rung.replace(/^(bg|text|border)/, `$1-${role}`);
      if (rung === 'bg-solid') {
        const s = solidFor(def.scale, theme, n);
        t.push([`--${name}`, s.fill]);
        t.push([`--${name.replace('bg-', 'text-on-')}`, s.on]);
        continue;
      }
      t.push([`--${name}`, step(def.scale, theme, n)]);
    }
  }
  const m = MARKET[theme];
  for (const dir of ['up', 'down', 'flat']) {
    t.push([`--text-${dir}`, m[dir].text]);
    t.push([`--bg-${dir}-subtle`, m[dir].subtle]);
    t.push([`--border-${dir}`, m[dir].border]);
  }
  // The tick flash is an alpha by necessity — it sits on whatever the row is.
  t.push(['--flash-up', toAlpha(step('success', theme, theme === 'light' ? 4 : 4), step('parasol', theme, 1)).css]);
  t.push(['--flash-down', toAlpha(step('error', theme, theme === 'light' ? 4 : 4), step('parasol', theme, 1)).css]);

  // Alpha scales. Derived, not authored: each is the translucent colour that
  // composites back to its solid exactly over that scale's own step 1, at the
  // lowest alpha that can do it. Use these when the background underneath is
  // not known — overlays, hover states on arbitrary surfaces, the tick flash.
  for (const scale of ALPHA_SCALES) {
    const bg = step(scale, theme, 1);
    for (let n = 1; n <= 12; n++) {
      t.push([`--${scale}-a${n}`, toAlpha(step(scale, theme, n), bg).css]);
    }
  }
  // Semantic alphas.
  t.push(['--overlay', toAlpha(step('parasol', theme, 11), step('parasol', theme, 1)).css]);
  t.push(['--scrim', theme === 'light' ? 'rgba(36, 30, 30, 0.45)' : 'rgba(0, 0, 0, 0.62)']);
  t.push(['--focus-ring', toAlpha(step('main', theme, 8), step('parasol', theme, 1)).css]);

  CHART.categorical[theme].forEach((c, i) => t.push([`--chart-${i + 1}`, c]));
  CHART.sequential[theme].forEach((c, i) => t.push([`--chart-seq-${i + 1}`, c]));
  CHART.diverging[theme].forEach((c, i) => t.push([`--chart-div-${i + 1}`, c]));
  t.push(['--chart-muted', CHART.muted[theme]]);
  return t;
}

function marketHighContrast(theme) {
  const hc = MARKET[theme].highContrast;
  return [['--text-up', hc.up], ['--text-down', hc.down]];
}

const emit = (pairs, indent = '  ') =>
  pairs.forEach(([k, v]) => out(`${indent}${k}: ${v};`));

// ---------------------------------------------------------------- header
out('/* AFEX design system tokens.');
out(' * GENERATED FILE — do not edit. Change tokens.config.mjs and re-run generate.mjs.');
out(` * Generated ${new Date().toISOString().slice(0, 10)}.`);
out(' *');
out(' * Open gaps carried into this build:');
GAPS.forEach(g => out(` *   - ${g}`));
out(' */');
out();

// ---------------------------------------------------------------- light
out('/* Light is the base. Every token is declared here and only redefined,');
out('   never introduced, in the theme blocks below. */');
out(':root {');
emit(colorTokens('light'));
out();
out('  /* type */');
Object.entries(TYPE.families).forEach(([k, v]) => out(`  --font-${k}: ${v};`));
Object.entries(TYPE.scale).forEach(([k, [size, lh]]) => {
  out(`  --text-${k}-size: ${(size / 16).toFixed(4).replace(/0+$/, '')}rem;`);
  out(`  --text-${k}-line: ${(lh / 16).toFixed(4).replace(/0+$/, '')}rem;`);
});
Object.entries(TYPE.weights).forEach(([k, v]) => out(`  --weight-${k}: ${v};`));
Object.entries(TYPE.tracking).forEach(([k, v]) => out(`  --tracking-${k}: ${v};`));
out();
out('  /* radius */');
Object.entries(RADIUS).forEach(([k, v]) => out(`  --radius-${k}: ${v === 9999 ? '9999px' : v + 'px'};`));
out();
out('  /* spacing */');
Object.entries(SPACING).forEach(([k, v]) => out(`  --space-${k}: ${v}px;`));
out();
out('  /* table density */');
Object.entries(DENSITY).forEach(([k, d]) => {
  out(`  --row-${k}-block: ${d.padBlock}px;`);
  out(`  --row-${k}-inline: ${d.padInline}px;`);
  out(`  --row-${k}-size: ${(d.fontSize / 16).toFixed(4).replace(/0+$/, '')}rem;`);
});
out('  --touch-min: 44px;');
out('}');
out();

// ---------------------------------------------------------------- dark
out('/* System dark. Guarded so an explicit light choice still wins. */');
out('@media (prefers-color-scheme: dark) {');
out('  :root:not([data-theme="light"]) {');
emit(colorTokens('dark'), '    ');
out('  }');
out('}');
out();
out('/* Explicit dark. Wins in the other direction. */');
out(':root[data-theme="dark"] {');
emit(colorTokens('dark'));
out('}');
out();

// ------------------------------------------------- market high contrast
out('/* Opt-in market pair with CVD-min 16.5 instead of 6.7. The down colour');
out('   reads as oxblood rather than red — that is the cost of the separation. */');
out(':root[data-market-contrast="high"] {');
emit(marketHighContrast('light'));
out('}');
out('@media (prefers-color-scheme: dark) {');
out('  :root[data-market-contrast="high"]:not([data-theme="light"]) {');
emit(marketHighContrast('dark'), '    ');
out('  }');
out('}');
out(':root[data-theme="dark"][data-market-contrast="high"] {');
emit(marketHighContrast('dark'));
out('}');
out();

// ---------------------------------------------------------------- base
out('/* Numeric columns. Set on the column, never on the value. */');
out('.afex-num, [data-numeric] {');
out('  font-family: var(--font-numeric);');
out('  font-variant-numeric: tabular-nums lining-nums;');
out('  text-align: right;');
out('}');
out();
out('@media (prefers-reduced-motion: reduce) {');
out('  /* The flash goes; the value and the glyph do not. */');
out('  :root { --flash-up: transparent; --flash-down: transparent; }');
out('}');

const css = lines.join('\n') + '\n';
if (process.argv.includes('--stdout')) process.stdout.write(css);
else {
  writeFileSync(new URL('./tokens.css', import.meta.url), css);
  const count = (css.match(/^\s+--/gm) || []).length;
  console.log(`tokens.css written — ${count} declarations from ${Object.keys(ROLES).length} roles.`);
  if (snapLog.length) {
    console.log('\nAuto-corrections applied (a fill that could not carry its label):');
    [...new Set(snapLog)].forEach(l => console.log('  ' + l));
  }
}
