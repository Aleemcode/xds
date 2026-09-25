import { CHART, MARKET } from '@afex/xds-tokens/config';
import { Scale, ContrastChecker } from '../../../site/ColorScales';
import { Icon } from '@afex/xds-react';

export const metadata = { title: 'Colour' };

const SCALES = [
  ['main', 'Brand. Step 9 is the AFEX red. Fills and links only — never a data value.'],
  ['parasol', 'Warm-tinted neutral. The only scale allowed to paint a page.'],
  ['success', 'Positive system state. Also the source of the market up colour.'],
  ['information', 'Informational system state.'],
  ['warning', 'Caution. The 9/10 accent steps sit lighter than 8 — that break is intentional.'],
  ['error', 'Destructive state, and the market down colour.'],
] as const;

export default function Colour() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Foundations</p>
        <h1>Colour</h1>
        <p className="lede">
          Six twelve-step scales. Every step has one job and one token, so what
          you copy is the token, not the hex — a hex in a component is a colour
          that can never follow a theme.
        </p>
        <p>
          Switch the theme in the bar above and everything on this page
          re-renders against it. Click any row to copy. Toggle a scale to{' '}
          <strong>Alpha</strong> to see the translucent form.
        </p>
      </div>

      <div className="scales">
        {SCALES.map(([name, note]) => (
          <Scale key={name} name={name as never} note={note} />
        ))}
      </div>

      <div className="prose">
        <h2>Check a pair</h2>
        <p>
          Two numbers matter and they measure different things. Contrast is
          whether text is legible. Colour-vision separation is whether two
          things can be told apart at all — a pair can pass AA and still read as
          one colour to eight percent of men.
        </p>
      </div>

      <ContrastChecker />

      <div className="prose">
        <h2>The market pair</h2>
        <p>
          Up comes from the Success scale, down from Error. Each pair clears
          4.5:1 on its own surface and holds the widest separation the scales
          allow while still reading as green and red.
        </p>
      </div>

      <table className="spec">
        <thead><tr><th>Theme</th><th>Up</th><th>Down</th><th className="n">Normal</th><th className="n">Worst CVD</th></tr></thead>
        <tbody>
          <tr><td>Light</td><td><Sw hex={MARKET.light.up.text} /></td><td><Sw hex={MARKET.light.down.text} /></td><td className="n">29.8</td><td className="n">6.7</td></tr>
          <tr><td>Dark</td><td><Sw hex={MARKET.dark.up.text} /></td><td><Sw hex={MARKET.dark.down.text} /></td><td className="n">33.9</td><td className="n">13.6</td></tr>
          <tr><td>Light · high contrast</td><td><Sw hex={MARKET.light.highContrast.up} /></td><td><Sw hex={MARKET.light.highContrast.down} /></td><td className="n">29.2</td><td className="n">16.5</td></tr>
          <tr><td>Dark · high contrast</td><td><Sw hex={MARKET.dark.highContrast.up} /></td><td><Sw hex={MARKET.dark.highContrast.down} /></td><td className="n">39.9</td><td className="n">25.4</td></tr>
        </tbody>
      </table>

      <div className="note note--warn">
        <p>
          <Icon.Warning size="sm" /> <strong>The light pair sits below the separation target.</strong>{' '}
          It is permitted only where a second, non-colour encoding is present.
        </p>
        <p>
          <code>Change</code> is that encoding: it renders an arrow and an
          explicit sign unconditionally, with no prop to remove them. So{' '}
          <code>--text-up</code> and <code>--text-down</code> are not used
          outside it. <code>data-market-contrast=&quot;high&quot;</code> on the root
          switches to the wider pair, at the cost of a down colour that reads
          oxblood rather than red.
        </p>
      </div>

      <div className="prose">
        <h2>Chart series</h2>
        <p>
          Six series, and six is the ceiling. Once the four planes have taken
          their hues, the arc left for chart colour is narrow — and it is the
          part of the spectrum colour-blind readers compress hardest. These six
          separate on lightness as well as hue so the order survives.
        </p>
      </div>

      <div className="chartrow">
        {CHART.categorical.light.map((_: string, i: number) => (
          <div key={i} className="chartrow__item">
            <span className="chartrow__chip" style={{ background: `var(--chart-${i + 1})` }} />
            <code>--chart-{i + 1}</code>
          </div>
        ))}
      </div>

      <div className="note">
        <p>
          <Icon.Info size="sm" /> <strong>Do not add a seventh.</strong> Eight
          commodities on one axis is an encoding problem, not a palette problem.
          Highlight one series and grey the rest with <code>--chart-muted</code>,
          or facet into small multiples.
        </p>
      </div>

    </main>
  );
}

function Sw({ hex }: { hex: string }) {
  return (
    <span className="inlineSw">
      <span style={{ background: hex }} />
      <code>{hex}</code>
    </span>
  );
}
