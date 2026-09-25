'use client';
import * as React from 'react';

export type Density = 'comfortable' | 'compact' | 'dense';

/** The six data states. None of them is ever rendered as 0%. */
export type CellState = 'current' | 'delayed' | 'stale' | 'missing' | 'notcovered' | 'locked';

export interface Column<T> {
  key: string;
  header: string;
  /** Right-aligned with tabular figures. Set on the column, never the value. */
  numeric?: boolean;
  /** The identity column. Exactly one column should be pinned. */
  pin?: boolean;
  sortable?: boolean;
  width?: number;
  render?: (row: T) => React.ReactNode;
  value?: (row: T) => string | number | null;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  density?: Density;
  /** As-at timestamp and delay. A number without a time is not a market price. */
  provenance?: string;
  /** Per-cell state, keyed `${rowKey}:${columnKey}`. */
  states?: Record<string, CellState>;
  /** Cells flashing this tick, keyed the same way. */
  flashes?: Record<string, 'up' | 'down'>;
  caption?: string;
  toolbar?: React.ReactNode;
  emptyMessage?: string;
}

const EM_DASH = '—';

export function DataTable<T>({
  columns, rows, rowKey, density = 'comfortable', provenance,
  states = {}, flashes = {}, caption, toolbar,
  emptyMessage = 'Nothing to show yet.',
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // The pinned-column shadow appears only once the table is genuinely scrolled.
  const onScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (el) setPinned(el.scrollLeft > 0);
  }, []);

  React.useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find(c => c.key === sort.key);
    if (!col?.value) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = col.value!(a), bv = col.value!(b);
      // Missing observations sort last in both directions. They are not zero.
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      const d = typeof av === 'number' && typeof bv === 'number'
        ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === 'asc' ? d : -d;
    });
    return copy;
  }, [rows, sort, columns]);

  const toggleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    setSort(s => s?.key === col.key
      ? { key: col.key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
      : { key: col.key, dir: 'asc' });
  };

  return (
    <div className="xds-table-wrap" data-expanded={expanded} data-pinned={pinned}>
      <div className="xds-table-bar">
        {provenance && <span className="xds-table-prov">{provenance}</span>}
        <span className="xds-table-spacer" />
        {toolbar}
        <button
          type="button"
          className="xds-btn xds-btn--ghost xds-btn--sm"
          aria-pressed={expanded}
          onClick={() => setExpanded(v => !v)}
        >
          {expanded ? 'Collapse' : 'Full screen'}
        </button>
      </div>

      <div className="xds-table-scroll" ref={scrollRef} onScroll={onScroll}>
        <table className="xds-table" data-density={density} role="grid">
          {caption && <caption className="xds-hint" style={{ captionSide: 'bottom', textAlign: 'left', padding: 'var(--space-3)' }}>{caption}</caption>}
          <thead>
            <tr>
              {columns.map(col => {
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={col.pin ? 'xds-pin' : undefined}
                    style={col.width ? { minWidth: col.width } : undefined}
                    aria-sort={col.sortable ? (active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
                    onClick={() => toggleSort(col)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort(col); } }}
                    tabIndex={col.sortable ? 0 : undefined}
                  >
                    {col.header}
                    {active && <span aria-hidden="true">{sort!.dir === 'asc' ? ' ↑' : ' ↓'}</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={columns.length} style={{ color: 'var(--text-muted)' }}>{emptyMessage}</td></tr>
            )}
            {sorted.map(row => {
              const k = rowKey(row);
              return (
                <tr key={k}>
                  {columns.map(col => {
                    const cellKey = `${k}:${col.key}`;
                    const state = states[cellKey];
                    const flash = flashes[cellKey];
                    const cls = [col.pin && 'xds-pin', col.numeric && 'xds-num'].filter(Boolean).join(' ');
                    return (
                      <td
                        key={col.key}
                        className={cls || undefined}
                        data-state={state}
                        data-flash={flash}
                      >
                        {renderCell(col, row, state)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderCell<T>(col: Column<T>, row: T, state?: CellState) {
  if (state === 'missing') {
    return <><span>{EM_DASH}</span><span className="xds-table-note">No observation</span></>;
  }
  if (state === 'notcovered') {
    return <><span>{EM_DASH}</span><span className="xds-table-note">Outside coverage</span></>;
  }
  if (state === 'locked') {
    const v = col.render ? col.render(row) : String(col.value?.(row) ?? '');
    return (
      <span className="xds-locked">
        <span className="xds-locked__value" aria-hidden="true">{v}</span>
        <span className="xds-table-note">Locked</span>
      </span>
    );
  }
  const content = col.render ? col.render(row) : col.value?.(row);
  if (content === null || content === undefined) return EM_DASH;
  return <>
    {content}
    {state === 'stale' && <span className="xds-table-note">Stale</span>}
  </>;
}
