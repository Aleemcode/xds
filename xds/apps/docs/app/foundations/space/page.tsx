import { SPACING, RADIUS, DENSITY } from '@afex/xds-tokens/config';

export const metadata = { title: 'Space & radius' };

export default function Space() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Foundations</p>
        <h1>Space &amp; radius</h1>
        <p className="lede">
          Twelve spacing steps, pruned from the published twenty-two. Every value
          the components actually use survives; the near-duplicates collapse.
        </p>
        <p>
          A scale nobody can hold in their head gets used at random, and a scale
          used at random is not a scale. Twelve is the number a person can
          remember.
        </p>
      </div>

      <table className="spec">
        <thead><tr><th>Token</th><th className="n">Value</th><th>Scale</th></tr></thead>
        <tbody>
          {Object.entries(SPACING).map(([k, v]) => (
            <tr key={k}>
              <td><code>--space-{k}</code></td>
              <td className="n">{v as number}px</td>
              <td><div style={{ height: 12, width: `${v as number}px`, background: 'var(--bg-brand-solid)', borderRadius: 2 }} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="prose"><h2>Radius</h2><p>Published as-is. The component radius is a taste decision that waits for the moodboard — change it in one place and every component follows.</p></div>
      <div className="grid grid--3">
        {Object.entries(RADIUS).map(([k, v]) => (
          <div className="card" key={k} style={{ padding: 'var(--space-4)' }}>
            <div style={{ height: 56, background: 'var(--bg-brand-subtle)', border: '1px solid var(--border-brand)', borderRadius: (v as number) === 9999 ? 9999 : `${v as number}px` }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs-size)', marginTop: 'var(--space-2)' }}>--radius-{k} · {v as number === 9999 ? 'full' : `${v}px`}</p>
          </div>
        ))}
      </div>

      <div className="prose">
        <h2>Density</h2>
        <p>
          Three settings for tabular data. The minimum touch target stays{' '}
          <strong>44px on coarse pointers at every density</strong> — density
          affects sight, never reach.
        </p>
      </div>
      <table className="spec">
        <thead><tr><th>Setting</th><th className="n">Padding block</th><th className="n">Padding inline</th><th className="n">Font size</th></tr></thead>
        <tbody>
          {Object.entries(DENSITY).map(([k, d]) => {
            const v = d as { padBlock: number; padInline: number; fontSize: number };
            return (
              <tr key={k}>
                <td><code>{k}</code></td>
                <td className="n">{v.padBlock}px</td>
                <td className="n">{v.padInline}px</td>
                <td className="n">{v.fontSize}px</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
