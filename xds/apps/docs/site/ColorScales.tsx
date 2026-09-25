'use client';
import * as React from 'react';
import { CORE } from '@afex/xds-tokens/scales';
import { ROLES, LADDERS } from '@afex/xds-tokens/config';
import { toAlpha, contrast, cvd, dE } from '@afex/xds-tokens/color';
import { Icon, Button, Badge } from '@afex/xds-react';
import { useTheme } from './useTheme';

type Theme = 'light' | 'dark';

/* ------------------------------------------------------------------ */
/* The xDS step contract: every step has one job, and the token that   */
/* consumes it is named beside it so a developer copies the token      */
/* rather than the hex.                                                */
/* ------------------------------------------------------------------ */
export const STEP_CONTRACT = [
  { step: 1,  group: 'Backgrounds',           job: 'App background' },
  { step: 2,  group: 'Backgrounds',           job: 'Raised surface' },
  { step: 3,  group: 'Component backgrounds', job: 'Component background' },
  { step: 4,  group: 'Component backgrounds', job: 'Component background, hover' },
  { step: 5,  group: 'Component backgrounds', job: 'Component background, active' },
  { step: 6,  group: 'Borders',               job: 'Subtle border, separator' },
  { step: 7,  group: 'Borders',               job: 'Interactive border' },
  { step: 8,  group: 'Borders',               job: 'Strong border, focus ring' },
  { step: 9,  group: 'Solid fills',           job: 'Solid background' },
  { step: 10, group: 'Solid fills',           job: 'Solid background, hover' },
  { step: 11, group: 'Text and icons',        job: 'Low-contrast text' },
  { step: 12, group: 'Text and icons',        job: 'High-contrast text' },
] as const;

/**
 * Which token, if any, a step of a given scale produces.
 *
 * Read from ROLES and LADDERS so this page cannot drift from the tokens it
 * documents. It is also why the brand scale shows no token for steps 1 and 2:
 * brand runs the `accent` ladder, which has no page rungs.
 */
const SCALE_TO_ROLE: Record<string, string> = Object.fromEntries(
  Object.entries(ROLES as unknown as Record<string, { scale: string }>)
    .map(([role, def]) => [def.scale, role])
);

function tokensFor(scale: string, step: number): string[] {
  const role = SCALE_TO_ROLE[scale];
  if (!role) return [];
  const ladders = LADDERS as unknown as Record<string, Record<string, number>>;
  const ladder = ladders[(ROLES as unknown as Record<string, { ladder: string }>)[role].ladder];
  if (!ladder) return [];
  // A step can feed more than one token — step 3 of the neutral scale is both
  // --bg-sunken and --bg-subtle. Showing one of them would be a half-truth.
  return Object.keys(ladder)
    .filter(k => ladder[k] === step)
    .map(rung => '--' + (role === 'neutral' ? rung : rung.replace(/^(bg|text|border)/, `$1-${role}`)));
}

const GROUPS = ['Backgrounds', 'Component backgrounds', 'Borders', 'Solid fills', 'Text and icons'] as const;

function useCopy() {
  const [copied, setCopied] = React.useState<string | null>(null);
  const copy = React.useCallback((text: string) => {
    navigator.clipboard?.writeText(text)
      .then(() => { setCopied(text); window.setTimeout(() => setCopied(null), 1400); })
      .catch(() => {});
  }, []);
  return { copied, copy };
}

/* ------------------------------------------------------------------ */
/* One scale, every step annotated with its job and its token.         */
/* ------------------------------------------------------------------ */
export function Scale({ name, note }: { name: keyof typeof CORE; note: string }) {
  const theme = useTheme() as Theme;
  const steps = CORE[name][theme];
  const bg = CORE[name][theme][0];
  const [alpha, setAlpha] = React.useState(false);
  const { copied, copy } = useCopy();

  return (
    <section className="scale">
      <header className="scale__head">
        <div>
          <h3>{name}</h3>
          <p className="scale__note">{note}</p>
        </div>
        <Button size="sm" variant={alpha ? 'secondary' : 'ghost'}
                aria-pressed={alpha} onClick={() => setAlpha(v => !v)}
                icon={<Icon.Layers size="xs" />}>
          {alpha ? 'Alpha' : 'Solid'}
        </Button>
      </header>

      {GROUPS.map(group => {
        const rows = STEP_CONTRACT.filter(s => s.group === group);
        return (
          <div className="scale__group" key={group}>
            <div className="scale__grouplabel">{group}</div>
            <div className="scale__rows">
              {rows.map(({ step, job }) => {
                const tokens = tokensFor(name, step);
                const solid = steps[step - 1];
                const a = toAlpha(solid, bg);
                const value = alpha ? a.css : solid;
                const isCopied = copied === value;
                return (
                  <button type="button" key={step}
                          className={`swatchrow${tokens.length ? '' : ' swatchrow--untokened'}`}
                          onClick={() => copy(value)}
                          title={`Copy ${value}`}>
                    <span className="swatchrow__chip"
                          style={{ background: alpha ? a.css : solid }} />
                    <span className="swatchrow__step">{step}</span>
                    <span className="swatchrow__job">{job}</span>
                    <span className="swatchrow__token">
                      {tokens.length
                        ? tokens.map(t => <span key={t}>{t}</span>)
                        : <span className="swatchrow__none">not exposed</span>}
                    </span>
                    <span className="swatchrow__value">{value}</span>
                    <span className="swatchrow__copy">
                      {isCopied ? <Icon.Check size="xs" /> : <Icon.Copy size="xs" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {name === 'main' && (
        <p className="scale__alphanote">
          Steps 1 and 2 produce no token. Brand runs on the <code>accent</code>{' '}
          ladder, which has no page rungs — a brand-tinted app background is how
          a product ends up looking like a landing page it cannot escape.
        </p>
      )}
      {alpha && (
        <p className="scale__alphanote">
          Each alpha composites back to its solid exactly over{' '}
          <code>{name}</code> step 1, at the lowest alpha that will do it. The
          lower the alpha, the better it holds on a surface it was not derived
          against.
        </p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contrast checker. Colour is the part of a system people are worst   */
/* at judging by eye, so xDS ships the measurement beside the swatch.  */
/* ------------------------------------------------------------------ */
const ALL_STEPS: { label: string; hex: (t: Theme) => string }[] = [];
(Object.keys(CORE) as (keyof typeof CORE)[]).forEach(scale => {
  for (let i = 1; i <= 12; i++) {
    ALL_STEPS.push({ label: `${scale}-${i}`, hex: (t) => CORE[scale][t][i - 1] });
  }
});

export function ContrastChecker() {
  const theme = useTheme() as Theme;
  const [fg, setFg] = React.useState('parasol-12');
  const [bg, setBg] = React.useState('parasol-1');

  const fgHex = ALL_STEPS.find(s => s.label === fg)!.hex(theme);
  const bgHex = ALL_STEPS.find(s => s.label === bg)!.hex(theme);
  const ratio = contrast(fgHex, bgHex);

  const checks = [
    { name: 'Body text', need: 4.5, pass: ratio >= 4.5 },
    { name: 'Large text (18.66px bold / 24px)', need: 3, pass: ratio >= 3 },
    { name: 'Borders, icons, marks', need: 3, pass: ratio >= 3 },
    { name: 'AAA body text', need: 7, pass: ratio >= 7 },
  ];

  // How far apart are they for someone who cannot see red or green?
  const cvdMin = Math.min(
    dE(cvd(fgHex, 'protan'), cvd(bgHex, 'protan')),
    dE(cvd(fgHex, 'deutan'), cvd(bgHex, 'deutan')),
  );

  return (
    <div className="checker">
      <div className="checker__controls">
        <label className="checker__field">
          <span>Foreground</span>
          <select value={fg} onChange={e => setFg(e.target.value)}>
            {ALL_STEPS.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
          </select>
        </label>
        <Button size="sm" variant="ghost" iconOnly aria-label="Swap foreground and background"
                icon={<Icon.Refresh size="sm" />}
                onClick={() => { setFg(bg); setBg(fg); }} />
        <label className="checker__field">
          <span>Background</span>
          <select value={bg} onChange={e => setBg(e.target.value)}>
            {ALL_STEPS.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
          </select>
        </label>
      </div>

      <div className="checker__preview" style={{ background: bgHex, color: fgHex }}>
        <p className="checker__big">₦344,720.00<span style={{ fontSize: '.5em' }}>/MT</span></p>
        <p className="checker__small">Maize White, Grade A · Kaduna · as at 14:32 WAT</p>
      </div>

      <div className="checker__result">
        <div className="checker__ratio">
          <b>{ratio.toFixed(2)}</b><span>:1</span>
        </div>
        <ul className="checker__checks">
          {checks.map(c => (
            <li key={c.name} className={c.pass ? 'ok' : 'no'}>
              {c.pass ? <Icon.Success size="xs" /> : <Icon.Danger size="xs" />}
              <span>{c.name}</span>
              <em>{c.need}:1</em>
            </li>
          ))}
        </ul>
      </div>

      <p className="checker__cvd">
        Colour-vision separation (worst of protanopia and deuteranopia):{' '}
        <b>{cvdMin.toFixed(1)}</b>{' '}
        <Badge tone={cvdMin >= 8 ? 'success' : cvdMin >= 6 ? 'warning' : 'danger'}>
          {cvdMin >= 8 ? 'clear' : cvdMin >= 6 ? 'needs a second cue' : 'too close'}
        </Badge>
        <br />
        <span className="checker__hint">
          Contrast is legibility. Separation is whether two things can be told
          apart at all — a pair can clear AA and still read as one colour to a
          colour-blind viewer.
        </span>
      </p>
    </div>
  );
}
