import { TableDemo } from '../../../site/TableDemo';
export const metadata = { title: 'Data table' };
export default function Page() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Components</p>
        <h1>Data table</h1>
        <p className="lede">
          The hardest thing in the product, and the reason the system exists.
          Scroll it sideways to pin the identity column, change density, and
          expand it to full screen.
        </p>
      </div>

      <TableDemo />

      <div className="prose">
        <h2>The rules a project tracker never needed</h2>

        <h3>A row never moves while the pointer is inside the table</h3>
        <p>
          New ticks update values in place; re-sorting is deferred until the
          pointer leaves or the user sorts deliberately. A row that jumps as you
          reach for it is how someone buys the wrong commodity.
        </p>

        <h3>Change is flashed on the cell, not the row</h3>
        <p>
          A short wash behind the changed value only. Flashing whole rows in a
          dense board makes the screen strobe and hides which field actually
          moved. Under <code>prefers-reduced-motion</code> the wash is dropped —
          the value and the glyph still update.
        </p>

        <h3>Provenance sits with the table, always visible</h3>
        <p>
          As-at timestamp plus the delay, in the toolbar, never in a footnote, and
          it survives full screen. A number without a time is not a market price.
        </p>

        <h2>The six states</h2>
        <p>None of them is ever <code>0%</code>.</p>
      </div>

      <table className="spec">
        <thead><tr><th>State</th><th>Value cell</th><th>Row treatment</th></tr></thead>
        <tbody>
          <tr><td><code>current</code></td><td>Value, tabular, ₦/MT</td><td>normal</td></tr>
          <tr><td><code>delayed</code></td><td>as normal</td><td>toolbar states the delay; no per-row mark</td></tr>
          <tr><td><code>stale</code></td><td>last known value, held not recomputed</td><td>Stale, with the true timestamp</td></tr>
          <tr><td><code>missing</code></td><td>em dash, never 0</td><td>No observation</td></tr>
          <tr><td><code>notcovered</code></td><td>em dash</td><td>Outside coverage</td></tr>
          <tr><td><code>locked</code></td><td>masked; the change stays visible</td><td>entitlement decides the action</td></tr>
        </tbody>
      </table>

      <div className="note">
        <p>
          <strong>Entitlement is orthogonal to data state.</strong> The six states
          above describe the <em>data</em>. Whether this reader may see it is a
          separate question, answered by <code>resolve(tier, family, action)</code>,
          which returns granted, upgrade, request or unavailable — never a boolean.
        </p>
        <p>
          An <code>upgrade</code> outcome must name the tier that unlocks the
          action, and the resolver verifies that tier actually grants it. Offering
          &ldquo;Upgrade to Enterprise&rdquo; beside something Enterprise does not
          unlock sells a subscription that does not deliver.
        </p>
      </div>

      <div className="prose">
        <pre><code>{`import { DataTable, Change } from '@afex/xds-react';

<DataTable
  rows={rows}
  rowKey={r => r.id}
  density="compact"
  provenance="As at 14:32 WAT · delayed 15m"
  states={{ 'PRL:price': 'missing' }}
  columns={[
    { key: 'name', header: 'Commodity', pin: true, sortable: true,
      value: r => r.name },
    { key: 'price', header: '₦/MT', numeric: true, sortable: true,
      value: r => r.price },
    { key: 'chg', header: 'Change', numeric: true,
      render: r => <Change value={r.chg} /> },
  ]}
/>`}</code></pre>
      </div>
    </main>
  );
}
