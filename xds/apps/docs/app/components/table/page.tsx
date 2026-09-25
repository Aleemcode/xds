import * as React from 'react';
import { TableDemo } from '../../../site/TableDemo';
export const metadata = { title: 'Data table' };

/** Behaviour map: one row per behaviour, the AFEX screen it serves, and the rule. */
const MAP: { group: string; intro: string; rows: [string, string, string][] }[] = [
  {
    group: 'Finding the row',
    intro: 'A reader arrives knowing which record they want, not which page it is on.',
    rows: [
      ['Saved views, as counted tabs',
       'Intelligence Portal commodity board — All commodities · Trading · No quote',
       'Every view carries its count. A view without a number asks the reader to guess whether it is worth opening.'],
      ['Free-text search across the row',
       'PayX merchants — found by trading name, merchant ID or phone',
       'Search reads each column’s own search(), so a code that is displayed small, or not at all, is still findable.'],
      ['Sortable headers with a resting state',
       'Transaction history — newest first, then by amount',
       'Both carets show at rest, dimmed. The column announces that it sorts before anyone hovers it.'],
      ['Windowed pagination and a page size',
       'WorkBench operational exceptions — 783 entries',
       'Never more than seven controls: 1 … 4 5 6 … 20. Page size is a control, because 12 rows and 50 rows are different jobs.'],
    ],
  },
  {
    group: 'Reading the row',
    intro: 'Everything here exists to stop two numbers being compared that should not be.',
    rows: [
      ['S/N column',
       'Every operational table in the products',
       'It numbers the page, not the dataset. It is never the record’s identity and never sorts.'],
      ['Pinned identity column',
       'Commodity stays fixed while the reader scrolls out to Volume',
       'Exactly one column pins: the one you would read aloud to say which row you mean.'],
      ['Right-aligned tabular figures',
       '₦/MT, Volume MT, every amount column in PayX',
       'Numeric is a property of the column, never of the value. Decimal points must stack down the column.'],
      ['Status as a pill with a leading dot',
       'WorkBench — Active, Inactive, Disabled',
       'The dot is the second encoding, not decoration. A pill reports lifecycle; a badge labels a thing.'],
      ['Row height: comfortable, compact, dense',
       'Operations reviewing 700 exception rows on a 13-inch laptop',
       'Density changes padding and type size only. It never drops a column or truncates a value.'],
      ['Number format: 10,500 or 10.5k',
       'Volume columns on a dense board',
       'The compact form is for quantities. A price never abbreviates — ₦1.7m is not a number anyone can settle against.'],
      ['Column visibility, with Reset',
       'Market is off by default and switched on when comparing locations',
       'The pinned column cannot be hidden. Reset returns the default set, not an empty table.'],
      ['Six data states, none of them zero',
       'Paddy Rice carries no quote today; Cocoa is outside coverage',
       'An em dash and the reason. A zero in a price column is a price, and someone will trade on it.'],
      ['Locked values are masked, not removed',
       'Volume withheld from a reader whose plan does not include it',
       'The reader must be able to see that something is there. A removed column cannot be bought.'],
    ],
  },
  {
    group: 'Acting on rows',
    intro: 'Selection and row actions are where a table stops being a report.',
    rows: [
      ['Checkbox selection with an indeterminate header',
       'Selecting merchants to export from PayX',
       'The header box governs the current page. The count in the selection bar is the true total across pages.'],
      ['Selection bar carrying the count and the verb',
       '12 selected · Clear · Export selection',
       'It appears only when something is selected, and it adds a strip rather than replacing the toolbar.'],
      ['Row actions in a menu pinned to the trailing edge',
       'View contract · Export history · Suspend trading · Delist commodity',
       'Pinned, because an action that scrolls out of view is an action nobody uses. Reversible destructive items are amber; irreversible ones are red; neither is ever first in the list.'],
      ['Export that respects the selection',
       'Export CSV becomes Export 12 once rows are ticked',
       'The label states what will actually leave the system.'],
      ['Full screen',
       'A board on the screen at the trading desk',
       'Escape exits. The provenance strip survives — a full-screen number with no as-at time is the worst version of this table.'],
    ],
  },
  {
    group: 'Trusting the numbers',
    intro: 'The difference between a table and a market board.',
    rows: [
      ['Provenance strip',
       'As at 14:32 WAT · delayed 15m · held',
       'It sits with the table, never in a footnote, and it states the delay rather than implying live.'],
      ['Change flashes on the cell',
       'A tick arriving while the board is open',
       'A short wash behind the changed value only. Flashing the row hides which field moved, and a dense board strobes.'],
      ['Rows hold still under the pointer',
       'Reaching for a row as new ticks arrive',
       'Re-sorting is deferred until the pointer leaves or the reader sorts deliberately. A row that jumps is how someone acts on the wrong commodity.'],
      ['Skeleton rows while loading',
       'First paint of any board',
       'The shape of the answer arrives before the answer. A spinner over a table tells the reader nothing about what is coming.'],
      ['Empty and no-results are different',
       'A filter that matches nothing versus a view with nothing in it',
       'No-results names the query and offers the way out. Empty explains what would put something here.'],
    ],
  },
];

export default function Page() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Components</p>
        <h1>Data table</h1>
        <p className="lede">
          The hardest thing in the product, and the reason the system exists.
          Search it, switch views, select rows, change what it shows, and expand
          it to full screen.
        </p>
      </div>

      <TableDemo />

      <div className="prose">
        <h2>Behaviour map</h2>
        <p>
          Every behaviour below is in the component, mapped to the screen in the
          AFEX products that needs it and the rule that governs it. A product
          that wants one of these does not build it — it passes the prop.
        </p>
      </div>

      {MAP.map(section => (
        <React.Fragment key={section.group}>
          <div className="prose">
            <h3>{section.group}</h3>
            <p>{section.intro}</p>
          </div>
          <table className="spec spec--map">
            <thead>
              <tr><th>Behaviour</th><th>Where it earns its place</th><th>The rule</th></tr>
            </thead>
            <tbody>
              {section.rows.map(([b, where, rule]) => (
                <tr key={b}>
                  <td><strong>{b}</strong></td>
                  <td>{where}</td>
                  <td>{rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      ))}

      <div className="prose">
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
        <h2>Props</h2>
      </div>

      <table className="spec">
        <thead><tr><th>Prop</th><th>Type</th><th>What it turns on</th></tr></thead>
        <tbody>
          <tr><td><code>columns</code></td><td><code>Column&lt;T&gt;[]</code></td><td>Headers, alignment, pinning, sorting, search and the optional set</td></tr>
          <tr><td><code>rows</code>, <code>rowKey</code></td><td><code>T[]</code>, <code>(row) =&gt; string</code></td><td>The data and its stable identity</td></tr>
          <tr><td><code>selectable</code></td><td><code>boolean</code></td><td>Checkbox column, indeterminate header, selection bar</td></tr>
          <tr><td><code>serialNumbers</code></td><td><code>boolean</code></td><td>The S/N column</td></tr>
          <tr><td><code>savedViews</code></td><td><code>SavedView[]</code></td><td>Counted view tabs above the toolbar</td></tr>
          <tr><td><code>rowActions</code></td><td><code>RowAction&lt;T&gt;[]</code></td><td>The pinned action column and its tiered menu</td></tr>
          <tr><td><code>states</code></td><td><code>Record&lt;string, CellState&gt;</code></td><td>Per-cell data state, keyed <code>rowKey:columnKey</code></td></tr>
          <tr><td><code>flashes</code></td><td><code>Record&lt;string, &apos;up&apos; | &apos;down&apos;&gt;</code></td><td>The tick wash, per cell</td></tr>
          <tr><td><code>provenance</code></td><td><code>string</code></td><td>The as-at strip</td></tr>
          <tr><td><code>pageSize</code>, <code>loading</code></td><td><code>number</code>, <code>boolean</code></td><td>Starting page size; skeleton rows</td></tr>
          <tr><td><code>onExport</code></td><td><code>(selected: T[]) =&gt; void</code></td><td>The export control, selection-aware</td></tr>
          <tr><td><code>toolbar</code></td><td><code>ReactNode</code></td><td>Product-specific controls, placed before the view menu</td></tr>
        </tbody>
      </table>

      <div className="prose">
        <pre><code>{`import { DataTable, StatusPill, Change } from '@afex/xds-react';

<DataTable
  rows={rows}
  rowKey={r => r.id}
  selectable
  serialNumbers
  savedViews={[
    { id: 'all',    label: 'All commodities' },
    { id: 'active', label: 'Trading', filter: r => r.status === 'Active' },
  ]}
  rowActions={[
    { label: 'View contract',  onSelect: open },
    { label: 'Suspend trading', tier: 'archive', onSelect: suspend },
    { label: 'Delist commodity', tier: 'delete', onSelect: delist },
  ]}
  provenance="As at 14:32 WAT · delayed 15m"
  states={{ 'PRL:price': 'missing' }}
  onExport={rows => queueExport(rows)}
  columns={[
    { key: 'name', header: 'Commodity', pin: true, sortable: true,
      value: r => r.name, search: r => \`\${r.name} \${r.code}\` },
    { key: 'status', header: 'Status',
      value: r => r.status,
      render: r => <StatusPill tone="success">{r.status}</StatusPill> },
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
