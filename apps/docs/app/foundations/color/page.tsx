import { CORE } from '@afex/xds-tokens/scales';
import { CHART, MARKET } from '@afex/xds-tokens/config';
import { ScaleRow, LiveHex } from '../../../site/Swatches';

export const metadata = { title: 'Colour' };

const ROLE_META: Record<string, string> = {
  main: 'brand · step 9 is the AFEX red',
  parasol: 'neutral · warm-tinted, carries every surface',
  success: 'system · positive state',
  information: 'system · informational state',
  warning: 'system · caution state',
  error: 'system · destructive state, and market down',
};

export default function Colour() {
  const scales = Object.keys(CORE) as (keyof typeof CORE)[];
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Foundations</p>
        <h1>Colour</h1>
        <p className="lede">
          Six 12-step scales, light and dark. Click any swatch to copy its hex.
          Switch the theme in the bar above and every scale below re-renders.
        </p>
        <p>
          Step 9 is the solid, and it is held constant across themes on every
          scale except the neutral — which is correct, since a grey&apos;s solid step
          has to differ by theme to stay legible.
        </p>
      </div>

      <div style={{ marginTop: 'var(--space-7)' }}>
        {scales.map(name => (
          <ScaleRow key={name} name={name} meta={ROLE_META[name] ?? ''}
                    light={CORE[name].light} dark={CORE[name].dark} />
        ))}
      </div>

      <div className="prose">
        <h2>The market pair</h2>
        <p>
          Down reuses the Error scale. Up uses Success. Which steps was decided by
          search rather than by eye — each pair is the best separation available
          that still reads conventionally and clears 4.5:1 on its own surface.
        </p>
      </div>

      <table className="spec">
        <thead><tr><th>Theme</th><th>Up</th><th>Down</th><th className="n">Normal</th><th className="n">Worst CVD</th></tr></thead>
        <tbody>
          <tr><td>Light</td><td><code>{MARKET.light.up.text}</code></td><td><code>{MARKET.light.down.text}</code></td><td className="n">29.8</td><td className="n">6.7</td></tr>
          <tr><td>Dark</td><td><code>{MARKET.dark.up.text}</code></td><td><code>{MARKET.dark.down.text}</code></td><td className="n">33.9</td><td className="n">13.6</td></tr>
          <tr><td>Light · high contrast</td><td><code>{MARKET.light.highContrast.up}</code></td><td><code>{MARKET.light.highContrast.down}</code></td><td className="n">29.2</td><td className="n">16.5</td></tr>
          <tr><td>Dark · high contrast</td><td><code>{MARKET.dark.highContrast.up}</code></td><td><code>{MARKET.dark.highContrast.down}</code></td><td className="n">39.9</td><td className="n">25.4</td></tr>
        </tbody>
      </table>

      <div className="note note--warn">
        <p><strong>The light pair scores 6.7, below the target of 8.</strong> That band is permissible only where a second, non-colour encoding is present.</p>
        <p>The <code>Change</code> component is that encoding — it renders a triangle and an explicit sign unconditionally, with no prop to remove them. So <code>--text-up</code> and <code>--text-down</code> must not be used outside it. The constraint is enforced by the component rather than by this paragraph.</p>
        <p>Set <code>data-market-contrast=&quot;high&quot;</code> on the root to opt into the safer pair. The cost is that the down colour reads oxblood rather than red.</p>
      </div>

      <div className="prose">
        <h2>Chart series</h2>
        <p>
          Six, and six is a ceiling. With four planes reserved, only the 204°–330°
          arc is free — and that arc is exactly what dichromats compress, so three
          evenly-spaced hues inside it collapse to 2.7 under protanopia. These six
          separate on lightness as well as hue: worst pair 8.5.
        </p>
      </div>

      <div className="grid grid--3" style={{ marginTop: 'var(--space-4)' }}>
        {CHART.categorical.light.map((hex: string, i: number) => (
          <div key={hex} className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ height: 40, borderRadius: 'var(--radius-sm)', background: `var(--chart-${i + 1})` }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs-size)', marginTop: 'var(--space-2)' }}>
              --chart-{i + 1}
            </p>
          </div>
        ))}
      </div>

      <div className="note">
        <p><strong>Do not add a seventh.</strong> Eight commodities on one axis is an encoding problem, not a palette problem. Highlight one series and grey the rest with <code>--chart-muted</code>, or facet into small multiples.</p>
      </div>

      <div className="prose">
        <h2>What was removed</h2>
        <p>
          The ten X-Additional scales are not Radix scales — each one&apos;s light
          column is a dark scale printed in reverse, so step 1 lands near
          lightness 90 instead of 99 and none of the step meanings survive.
          Ruby&apos;s dark scale is byte-identical to Error&apos;s; Amber is Warning under
          another name. They are excluded from the generated system and still
          reported by the audit so nobody reintroduces them by accident.
        </p>
      </div>
    </main>
  );
}
