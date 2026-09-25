import { TYPE } from '@afex/xds-tokens/config';
import { FontCheck } from '../../../site/FontCheck';

export const metadata = { title: 'Typography' };

const FACES = [
  { name: 'Switzer', css: "'Switzer', system-ui, sans-serif" },
  { name: 'System stack', css: 'system-ui, -apple-system, sans-serif' },
  { name: 'IBM Plex Mono', css: "'IBM Plex Mono', ui-monospace, monospace" },
  { name: 'Georgia', css: 'Georgia, serif' },
];

export default function Typography() {
  const scale = Object.entries(TYPE.scale) as [string, [number, number]][];
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Foundations</p>
        <h1>Typography</h1>
        <p className="lede">
          Switzer for everything, a tabular face for every number. Line heights
          are absolute rather than ratios, so a row of mixed sizes still sits on
          one grid.
        </p>
      </div>

      <FontCheck />

      <div className="prose">
        <h2>The figures test</h2>
        <p>
          Two properties decide whether a face can carry a price column.{' '}
          <strong>Tabular width</strong> — every digit on the same advance, so
          decimal points stack. And <strong>lining figures</strong> — sitting on
          the baseline at cap height, not hopping above and below it.
        </p>
        <p>
          Each block stacks <code>1111111</code> over <code>0000000</code>. Same
          length means the face is tabular. A ragged right edge means a price
          column set in it will wander.
        </p>
      </div>

      <div className="figtest">
        {FACES.map(f => (
          <div className="face" key={f.name}>
            <div className="name">{f.name}</div>
            <div className="rows" style={{ fontFamily: f.css }}>
              <div>1111111</div>
              <div>0000000</div>
            </div>
          </div>
        ))}
      </div>


      <div className="prose"><h2>The scale</h2></div>
      <table className="spec">
        <thead><tr><th>Token</th><th className="n">Size</th><th className="n">Line</th><th>Specimen</th></tr></thead>
        <tbody>
          {scale.map(([name, [size, line]]) => (
            <tr key={name}>
              <td><code>--text-{name}-size</code></td>
              <td className="n">{size}px</td>
              <td className="n">{line}px</td>
              <td style={{ fontSize: size, lineHeight: `${line}px`, letterSpacing: size > 28 ? 'var(--tracking-tight)' : undefined }}>
                Maize White, Grade A
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="prose">
        <h2>Numbers</h2>
        <p>
          <code>font-variant-numeric: tabular-nums</code> goes on the column,
          never the value. Numbers right-align. Decimal places are fixed per
          column by instrument, not by value. Negatives use a true minus{' '}
          <code>−</code>, which shares a digit&apos;s width; a hyphen does not.
        </p>
      </div>
      <div className="demo demo--block">
        <table className="spec" style={{ marginTop: 0, maxWidth: '22rem' }}>
          <thead><tr><th>Commodity</th><th className="n">₦/MT</th></tr></thead>
          <tbody>
            <tr><td>Maize White</td><td className="n">344,720.00</td></tr>
            <tr><td>Sorghum</td><td className="n">343,000.00</td></tr>
            <tr><td>Sesame Seed</td><td className="n">2,300,000.00</td></tr>
            <tr><td>Paddy Rice</td><td className="n">—</td></tr>
          </tbody>
        </table>
      </div>

      <div className="note">
        <p><strong>Licence.</strong> Switzer is under the ITF Free Font License, not MIT. It permits free commercial use but has its own terms on redistribution and modification — and self-hosting the file in a public repository is redistribution. Worth ten minutes of legal time before this repo goes public.</p>
      </div>
    </main>
  );
}
