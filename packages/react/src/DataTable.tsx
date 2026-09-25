'use client';
import * as React from 'react';
import { Icon } from './icons';

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
  /** Hidden by default but offered in the column menu. */
  optional?: boolean;
  render?: (row: T) => React.ReactNode;
  value?: (row: T) => string | number | null;
  /** Free-text search reads this. Falls back to `value`. */
  search?: (row: T) => string;
}

export interface SavedView {
  id: string;
  label: string;
  /** Shown as a count beside the label — a view with no number is a guess. */
  filter?: (row: never) => boolean;
}

export interface RowAction<T> {
  label: string;
  icon?: React.ReactNode;
  onSelect: (row: T) => void;
  /** 'archive' is amber, 'delete' is red. Everything else is neutral. */
  tier?: 'normal' | 'archive' | 'delete';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  density?: Density;
  /** As-at timestamp and delay. A number without a time is not a market price. */
  provenance?: string;
  states?: Record<string, CellState>;
  flashes?: Record<string, 'up' | 'down'>;
  caption?: string;
  emptyMessage?: string;
  /** Turns on the checkbox column and the selection bar. */
  selectable?: boolean;
  /** Turns on the leading S/N column. */
  serialNumbers?: boolean;
  savedViews?: SavedView[];
  rowActions?: RowAction<T>[];
  pageSize?: number;
  loading?: boolean;
  onExport?: (selected: T[]) => void;
  toolbar?: React.ReactNode;
}

const EM_DASH = '—';
const PAGE_SIZES = [12, 25, 50];

export function DataTable<T>({
  columns, rows, rowKey, density: initialDensity = 'comfortable', provenance,
  states = {}, flashes = {}, caption, emptyMessage = 'Nothing to show yet.',
  selectable, serialNumbers, savedViews, rowActions, pageSize: initialPageSize = 12,
  loading, onExport, toolbar,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [pinnedShadow, setPinnedShadow] = React.useState(false);
  const [endShadow, setEndShadow] = React.useState(false);
  const [density, setDensity] = React.useState<Density>(initialDensity);
  const [query, setQuery] = React.useState('');
  const [view, setView] = React.useState(savedViews?.[0]?.id ?? 'all');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [hidden, setHidden] = React.useState<Set<string>>(
    () => new Set(columns.filter(c => c.optional).map(c => c.key))
  );
  const [viewMenu, setViewMenu] = React.useState(false);
  const [openAction, setOpenAction] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [compactNumbers, setCompactNumbers] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const headCheck = React.useRef<HTMLInputElement>(null);

  const visible = columns.filter(c => !hidden.has(c.key));

  // ---- filtering, sorting, paging -------------------------------------
  const viewed = React.useMemo(() => {
    const v = savedViews?.find(s => s.id === view);
    return v?.filter ? rows.filter(v.filter as unknown as (r: T) => boolean) : rows;
  }, [rows, savedViews, view]);

  const searched = React.useMemo(() => {
    if (!query.trim()) return viewed;
    const q = query.toLowerCase();
    return viewed.filter(r => columns.some(c => {
      const text = c.search ? c.search(r) : String(c.value?.(r) ?? '');
      return text.toLowerCase().includes(q);
    }));
  }, [viewed, query, columns]);

  const sorted = React.useMemo(() => {
    if (!sort) return searched;
    const col = columns.find(c => c.key === sort.key);
    if (!col?.value) return searched;
    const copy = [...searched];
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
  }, [searched, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const paged = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);

  React.useEffect(() => { setPage(0); }, [query, view, pageSize]);

  // ---- selection -------------------------------------------------------
  const pageKeys = paged.map(rowKey);
  const allOnPage = pageKeys.length > 0 && pageKeys.every(k => selected.has(k));
  const someOnPage = pageKeys.some(k => selected.has(k));

  React.useEffect(() => {
    // The indeterminate state cannot be set in markup — only through the DOM.
    if (headCheck.current) headCheck.current.indeterminate = someOnPage && !allOnPage;
  }, [someOnPage, allOnPage]);

  const toggleAll = () => setSelected(prev => {
    const next = new Set(prev);
    if (allOnPage) pageKeys.forEach(k => next.delete(k));
    else pageKeys.forEach(k => next.add(k));
    return next;
  });
  const toggleOne = (k: string) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(k)) next.delete(k); else next.add(k);
    return next;
  });

  const selectedRows = rows.filter(r => selected.has(rowKey(r)));

  // ---- chrome ----------------------------------------------------------
  const onScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setPinnedShadow(el.scrollLeft > 0);
    setEndShadow(el.scrollWidth - el.clientWidth - el.scrollLeft > 1);
  }, []);

  // Run it once on mount and on resize: a table can overflow before anyone
  // scrolls, and the pinned action column needs its edge either way.
  React.useEffect(() => {
    onScroll();
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onScroll, visible.length, density, pageSize]);

  React.useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  React.useEffect(() => {
    if (!viewMenu && !openAction) return;
    const close = () => { setViewMenu(false); setOpenAction(null); };
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [viewMenu, openAction]);

  const toggleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    setSort(s => s?.key === col.key
      ? { key: col.key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
      : { key: col.key, dir: 'asc' });
  };

  const colSpan = visible.length + (selectable ? 1 : 0) + (serialNumbers ? 1 : 0) + (rowActions ? 1 : 0);

  return (
    <div className="xds-table-wrap" data-expanded={expanded}
         data-pinned={pinnedShadow} data-pinned-end={endShadow}>

      {savedViews && savedViews.length > 0 && (
        <div className="xds-table-views" role="tablist">
          {savedViews.map(v => {
            const count = v.filter ? rows.filter(v.filter as unknown as (r: T) => boolean).length : rows.length;
            return (
              <button key={v.id} type="button" role="tab" aria-selected={view === v.id}
                      className="xds-table-view" onClick={() => setView(v.id)}>
                {v.label}<span className="xds-table-view__count">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="xds-table-bar">
        <label className="xds-table-search">
          <Icon.Search size="sm" />
          <input value={query} onChange={e => setQuery(e.target.value)}
                 placeholder="Search" aria-label="Search this table" />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
              <Icon.Close size="xs" />
            </button>
          )}
        </label>

        <span className="xds-table-spacer" />
        {toolbar}

        {/* Row height, number format and column visibility are one control.
            They are all the same decision — how this reader wants to look at
            the data — and three separate widgets in a toolbar is three chances
            to press the wrong one. */}
        <div className="xds-menuwrap" onClick={e => e.stopPropagation()}>
          <button type="button" className="xds-btn xds-btn--ghost xds-btn--sm"
                  aria-expanded={viewMenu} onClick={() => setViewMenu(v => !v)}>
            <Icon.Settings size="sm" /> View
          </button>
          {viewMenu && (
            <div className="xds-menu xds-menu--right xds-menu--view" role="menu">
              <p className="xds-menu__label">Row height</p>
              <div className="xds-seg" role="group" aria-label="Row height">
                {(['comfortable', 'compact', 'dense'] as Density[]).map(d => (
                  <button key={d} type="button" aria-pressed={density === d}
                          onClick={() => setDensity(d)}>
                    {d[0].toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>

              <p className="xds-menu__label">Numbers</p>
              <div className="xds-seg" role="group" aria-label="Number format">
                <button type="button" aria-pressed={!compactNumbers}
                        onClick={() => setCompactNumbers(false)}>10,500</button>
                <button type="button" aria-pressed={compactNumbers}
                        onClick={() => setCompactNumbers(true)}>10.5k</button>
              </div>

              <p className="xds-menu__label">Columns</p>
              {columns.map(c => (
                <label key={c.key} className="xds-menu__check">
                  <input type="checkbox" checked={!hidden.has(c.key)}
                         disabled={c.pin}
                         onChange={() => setHidden(prev => {
                           const n = new Set(prev);
                           if (n.has(c.key)) n.delete(c.key); else n.add(c.key);
                           return n;
                         })} />
                  {c.header}{c.pin && <em>pinned</em>}
                </label>
              ))}
              <button type="button" className="xds-menu__reset"
                      onClick={() => setHidden(new Set(columns.filter(c => c.optional).map(c => c.key)))}>
                Reset to defaults
              </button>
            </div>
          )}
        </div>

        {onExport && (
          <button type="button" className="xds-btn xds-btn--secondary xds-btn--sm xds-btn--export"
                  onClick={() => onExport(selectedRows.length ? selectedRows : sorted)}>
            <Icon.Download size="sm" />
            {selectedRows.length ? `Export ${selectedRows.length}` : 'Export CSV'}
          </button>
        )}

        <button type="button" className="xds-btn xds-btn--ghost xds-btn--sm"
                aria-pressed={expanded} onClick={() => setExpanded(v => !v)}
                aria-label={expanded ? 'Collapse table' : 'Expand table to full screen'}>
          {expanded ? <Icon.Collapse size="sm" /> : <Icon.Expand size="sm" />}
        </button>
      </div>

      {provenance && (
        <div className="xds-table-prov"><Icon.Clock size="xs" />{provenance}</div>
      )}

      {selectable && selected.size > 0 && (
        <div className="xds-table-selbar">
          <strong>{selected.size}</strong> selected
          <button type="button" onClick={() => setSelected(new Set())}>Clear</button>
          {onExport && (
            <button type="button" onClick={() => onExport(selectedRows)}>Export selection</button>
          )}
        </div>
      )}

      <div className="xds-table-scroll" ref={scrollRef} onScroll={onScroll}>
        <table className="xds-table" data-density={density} role="grid">
          {caption && <caption className="xds-table-caption">{caption}</caption>}
          <thead>
            <tr>
              {selectable && (
                <th className="xds-table-check xds-pin" scope="col">
                  <input ref={headCheck} type="checkbox" checked={allOnPage}
                         onChange={toggleAll} aria-label="Select all rows on this page" />
                </th>
              )}
              {serialNumbers && <th className="xds-table-sn" scope="col">S/N</th>}
              {visible.map(col => {
                const active = sort?.key === col.key;
                return (
                  <th key={col.key} scope="col"
                      className={col.pin && !selectable ? 'xds-pin' : undefined}
                      style={col.width ? { minWidth: col.width } : undefined}
                      aria-sort={col.sortable ? (active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
                      onClick={() => toggleSort(col)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort(col); } }}
                      tabIndex={col.sortable ? 0 : undefined}
                      data-sortable={col.sortable || undefined}>
                    <span className="xds-th">
                      {col.header}
                      {col.sortable && (
                        <span className={`xds-sortcaret${active ? ` is-${sort!.dir}` : ''}`} aria-hidden="true" />
                      )}
                    </span>
                  </th>
                );
              })}
              {rowActions && (
                <th className="xds-table-actions xds-pin-end" scope="col">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={`sk-${i}`} className="xds-skel">
                {Array.from({ length: colSpan }).map((__, j) => (
                  <td key={j}><span className="xds-skel__bar" /></td>
                ))}
              </tr>
            ))}

            {!loading && paged.length === 0 && (
              <tr><td colSpan={colSpan} className="xds-table-empty">
                <Icon.Search size="lg" />
                <p>{query ? `Nothing matches “${query}”.` : emptyMessage}</p>
                {query && <button type="button" onClick={() => setQuery('')}>Clear search</button>}
              </td></tr>
            )}

            {!loading && paged.map((row, i) => {
              const k = rowKey(row);
              const isSel = selected.has(k);
              return (
                <tr key={k} data-selected={isSel || undefined}>
                  {selectable && (
                    <td className="xds-table-check xds-pin">
                      <input type="checkbox" checked={isSel} onChange={() => toggleOne(k)}
                             aria-label={`Select row ${i + 1}`} />
                    </td>
                  )}
                  {serialNumbers && (
                    <td className="xds-table-sn">{safePage * pageSize + i + 1}</td>
                  )}
                  {visible.map(col => {
                    const cellKey = `${k}:${col.key}`;
                    const cls = [col.pin && !selectable && 'xds-pin', col.numeric && 'xds-num']
                      .filter(Boolean).join(' ');
                    return (
                      <td key={col.key} className={cls || undefined}
                          data-state={states[cellKey]} data-flash={flashes[cellKey]}>
                        {renderCell(col, row, states[cellKey], compactNumbers)}
                      </td>
                    );
                  })}
                  {rowActions && (
                    <td className="xds-table-actions xds-pin-end" onClick={e => e.stopPropagation()}>
                      <div className="xds-menuwrap">
                        <button type="button" className="xds-rowmenu"
                                aria-label={`Actions for row ${i + 1}`}
                                aria-expanded={openAction === k}
                                onClick={() => setOpenAction(v => v === k ? null : k)}>
                          <Icon.More size="sm" />
                        </button>
                        {openAction === k && (
                          <div className="xds-menu xds-menu--right" role="menu">
                            {rowActions.map(a => (
                              <button key={a.label} type="button" role="menuitem"
                                      className={`xds-menu__item xds-menu__item--${a.tier ?? 'normal'}`}
                                      onClick={() => { a.onSelect(row); setOpenAction(null); }}>
                                {a.icon}{a.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="xds-table-foot">
        <label className="xds-table-pagesize">
          Showing
          <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}
                  aria-label="Rows per page">
            {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          of {sorted.length.toLocaleString('en-NG')} entries
        </label>
        <span className="xds-table-spacer" />
        <nav className="xds-pager" aria-label="Pagination">
          <button type="button" disabled={safePage === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
          {pageWindow(safePage, pageCount).map((n, i) =>
            n === -1
              ? <span key={`gap-${i}`} className="xds-pager__gap">…</span>
              : <button key={n} type="button" aria-current={n === safePage ? 'page' : undefined}
                        onClick={() => setPage(n)}>{n + 1}</button>
          )}
          <button type="button" disabled={safePage >= pageCount - 1} onClick={() => setPage(p => p + 1)}>Next</button>
        </nav>
      </div>
    </div>
  );
}

/** 1 … 4 5 6 … 20 — never more than seven controls, never a jump you cannot see. */
function pageWindow(page: number, count: number): number[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i);
  const out = new Set<number>([0, count - 1, page, page - 1, page + 1]);
  const list = [...out].filter(n => n >= 0 && n < count).sort((a, b) => a - b);
  const withGaps: number[] = [];
  list.forEach((n, i) => {
    if (i > 0 && n - list[i - 1] > 1) withGaps.push(-1);
    withGaps.push(n);
  });
  return withGaps;
}

function renderCell<T>(col: Column<T>, row: T, state: CellState | undefined, compact: boolean) {
  if (state === 'missing') {
    return <><span>{EM_DASH}</span><span className="xds-table-note">No observation</span></>;
  }
  if (state === 'notcovered') {
    return <><span>{EM_DASH}</span><span className="xds-table-note">Outside coverage</span></>;
  }
  if (state === 'locked') {
    // The value is present and masked, not absent. A reader who cannot see it
    // should still know there is something to buy access to.
    const v = col.render ? col.render(row) : String(col.value?.(row) ?? '');
    return (
      <span className="xds-locked" title="Locked — not included in your plan">
        <span className="xds-locked__value" aria-hidden="true">{v}</span>
        <Icon.Lock size="xs" label="Locked" />
      </span>
    );
  }
  let content = col.render ? col.render(row) : col.value?.(row);
  if (compact && col.numeric && typeof content !== 'object') {
    const n = col.value?.(row);
    if (typeof n === 'number' && Math.abs(n) >= 1000) {
      content = `${(n / 1000).toFixed(1)}k`;
    }
  }
  if (content === null || content === undefined) return EM_DASH;
  return <>
    {content}
    {state === 'stale' && <span className="xds-table-note">Stale</span>}
  </>;
}
