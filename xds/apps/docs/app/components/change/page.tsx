import { Change } from '@afex/xds-react';
export const metadata = { title: 'Change' };
export default function Page() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Components</p>
        <h1>Change</h1>
        <p className="lede">
          The market direction indicator — and the place where an accessibility
          constraint is enforced by the type signature instead of by a paragraph
          somebody has to remember.
        </p>
      </div>

      <div className="demo" style={{ gap: 'var(--space-7)', alignItems: 'baseline' }}>
        <Change value={1.24} />
        <Change value={-0.87} />
        <Change value={0} />
        <Change value={null} />
        <Change value={-1720} format="absolute" unit="₦" decimals={2} />
      </div>

      <div className="prose">
        <pre><code>{`<Change value={1.24} />           {/* ▲ +1.24% */}
<Change value={-0.87} />          {/* ▼ −0.87% */}
<Change value={null} />           {/* — , never 0% */}`}</code></pre>

        <h2>There is no prop to turn the glyph off</h2>
        <p>
          The light-theme up/down pair separates by <strong>6.7</strong> in OKLab
          under protanopia, against a target of 8. That is permissible only where
          a second, non-colour encoding is present — so this component renders the
          triangle and the explicit sign unconditionally, and exposes no way to
          remove them.
        </p>
        <p>
          The alternative was a note in a document saying &ldquo;always add a
          glyph&rdquo;. Documents get skipped; a component that cannot be misused
          does not.
        </p>

        <h2>Null is not zero</h2>
        <p>
          A missing observation renders an em dash, never <code>0%</code> in a
          market colour. The live catalogue today shows <code>–</code> beside a
          green <code>0%</code> for commodities with no data — a reader cannot
          tell &ldquo;no data&rdquo; from &ldquo;unchanged&rdquo;, and on a
          product selling data integrity that single collision does more damage
          than any layout problem.
        </p>

        <h2>A true minus</h2>
        <p>
          Negative values use <code>−</code> (U+2212), not a hyphen. It has the
          same advance width as a digit in a tabular face, so a column of mixed
          signs stays aligned. The hyphen does not.
        </p>
      </div>
    </main>
  );
}
