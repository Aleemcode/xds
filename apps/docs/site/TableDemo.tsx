'use client';
import * as React from 'react';
import {
  DataTable, Change, Button, Badge, StatusPill, Icon,
  ToastProvider, useToast,
} from '@afex/xds-react';
import type { Density, CellState, SavedView, RowAction } from '@afex/xds-react';

type Row = {
  id: string; name: string; code: string; market: string;
  price: number | null; chg: number | null; volume: number | null;
  updated: string; status: 'Active' | 'Suspended' | 'Delisted';
};

// Figures are the live catalogue's, corrected to ₦'000/MT.
const BASE: Row[] = [
  { id: 'MAZ', name: 'Maize White',           code: 'MAZ', market: 'Kaduna', price: 344720,  chg: 0.00,  volume: 1250, updated: '14:32', status: 'Active' },
  { id: 'SGM', name: 'Sorghum',               code: 'SGM', market: 'Kano',   price: 343000,  chg: -0.13, volume: 880,  updated: '14:31', status: 'Active' },
  { id: 'SBS', name: 'Soyabean',              code: 'SBS', market: 'Benue',  price: 750590,  chg: 0.41,  volume: 2100, updated: '14:32', status: 'Active' },
  { id: 'GNG', name: 'Ginger Dried Split',    code: 'GNG', market: 'Kaduna', price: 990000,  chg: 0.00,  volume: 145,  updated: '13:58', status: 'Active' },
  { id: 'CSN', name: 'Raw Cashew Nuts',       code: 'CSN', market: 'Kwara',  price: 1719500, chg: 1.12,  volume: 620,  updated: '14:32', status: 'Active' },
  { id: 'SSC', name: 'Sesame Seed Cleaned',   code: 'SSC', market: 'Jigawa', price: 2300000, chg: -0.34, volume: 410,  updated: '14:30', status: 'Active' },
  { id: 'PRL', name: 'Paddy Rice Long Grain', code: 'PRL', market: 'Kebbi',  price: null,    chg: null,  volume: null, updated: '—',     status: 'Suspended' },
  { id: 'CCO', name: 'Cocoa',                 code: 'CCO', market: 'Ondo',   price: null,    chg: null,  volume: null, updated: '—',     status: 'Delisted' },
  { id: 'MAY', name: 'Maize Yellow',          code: 'MAY', market: 'Kaduna', price: 338900,  chg: 0.22,  volume: 940,  updated: '14:32', status: 'Active' },
  { id: 'CWP', name: 'Cowpea Brown',          code: 'CWP', market: 'Kano',   price: 612400,  chg: -0.58, volume: 305,  updated: '14:29', status: 'Active' },
  { id: 'GNT', name: 'Groundnut',             code: 'GNT', market: 'Kano',   price: 1102000, chg: 0.77,  volume: 515,  updated: '14:31', status: 'Active' },
  { id: 'MLT', name: 'Millet',                code: 'MLT', market: 'Bauchi', price: 402150,  chg: -0.09, volume: 260,  updated: '14:28', status: 'Active' },
  { id: 'SYO', name: 'Soya Oil',              code: 'SYO', market: 'Lagos',  price: 1880000, chg: 1.94,  volume: 88,   updated: '14:32', status: 'Active' },
  { id: 'WHT', name: 'Wheat',                 code: 'WHT', market: 'Kano',   price: 921300,  chg: 0.03,  volume: 470,  updated: '14:30', status: 'Active' },
];

const STATES: Record<string, CellState> = {
  'PRL:price': 'missing', 'PRL:chg': 'missing', 'PRL:volume': 'missing',
  'CCO:price': 'notcovered', 'CCO:chg': 'notcovered', 'CCO:volume': 'notcovered',
  'GNG:price': 'stale',
  'SSC:volume': 'locked',
};

const VIEWS: SavedView[] = [
  { id: 'all', label: 'All commodities' },
  { id: 'active', label: 'Trading', filter: ((r: Row) => r.status === 'Active') as never },
  { id: 'noquote', label: 'No quote', filter: ((r: Row) => r.price === null) as never },
];

const naira = (n: number) =>
  '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STATUS_TONE = { Active: 'success', Suspended: 'warning', Delisted: 'neutral' } as const;

function Board() {
  const toast = useToast();
  const [rows, setRows] = React.useState(BASE);
  const [live, setLive] = React.useState(false);
  const [flashes, setFlashes] = React.useState<Record<string, 'up' | 'down'>>({});
  const hovering = React.useRef(false);

  React.useEffect(() => {
    if (!live) return;
    const t = window.setInterval(() => {
      // A row never moves while the pointer is inside. Values update in place.
      if (hovering.current) return;
      setRows(prev => {
        const f: Record<string, 'up' | 'down'> = {};
        const next = prev.map(r => {
          if (r.price === null || Math.random() > 0.35) return r;
          const delta = (Math.random() - 0.5) * 0.02;
          const price = Math.round(r.price * (1 + delta));
          f[`${r.id}:price`] = price > r.price ? 'up' : 'down';
          return { ...r, price, chg: +((r.chg as number) + delta * 100).toFixed(2) };
        });
        setFlashes(f);
        window.setTimeout(() => setFlashes({}), 450);
        return next;
      });
    }, 2200);
    return () => window.clearInterval(t);
  }, [live]);

  const actions: RowAction<Row>[] = [
    { label: 'View contract', icon: <Icon.Document size="sm" />, onSelect: () => {} },
    { label: 'Export history', icon: <Icon.Download size="sm" />, onSelect: () => {} },
    { label: 'Suspend trading', icon: <Icon.Pause size="sm" />, tier: 'archive',
      onSelect: r => toast({ tone: 'warning', title: `${r.name} suspended`,
        message: 'No new orders will be accepted.', action: { label: 'Undo', onClick: () => {} } }) },
    { label: 'Delist commodity', icon: <Icon.Close size="sm" />, tier: 'delete',
      onSelect: r => toast({ tone: 'danger', title: `Delist ${r.name}?`,
        message: 'Open positions must be settled first.' }) },
  ];

  return (
    <div
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}
      style={{ marginTop: 'var(--space-5)' }}
    >
      <DataTable<Row>
        rows={rows}
        rowKey={r => r.id}
        selectable
        serialNumbers
        savedViews={VIEWS}
        rowActions={actions}
        states={STATES}
        flashes={flashes}
        pageSize={12}
        provenance={`As at 14:32 WAT · delayed 15m · ${live ? 'live' : 'held'}`}
        caption="Quoted in ₦ per metric tonne. Two commodities carry no observation — they show an em dash, never a zero."
        onExport={sel => toast({ tone: 'success', title: 'Export queued',
          message: `${sel.length} rows will arrive by email.` })}
        toolbar={
          <>
            <Badge tone={live ? 'success' : 'neutral'}
                   icon={live ? <Icon.Play size="xs" /> : <Icon.Pause size="xs" />}>
              {live ? 'Live' : 'Held'}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setLive(v => !v)}
                    icon={live ? <Icon.Pause size="xs" /> : <Icon.Play size="xs" />}>
              {live ? 'Hold' : 'Go live'}
            </Button>
          </>
        }
        columns={[
          { key: 'name', header: 'Commodity', pin: true, sortable: true, width: 176,
            value: r => r.name, search: r => `${r.name} ${r.code} ${r.market}`,
            render: r => (
              <>
                <div style={{ fontWeight: 500 }}>{r.name}</div>
                <span className="xds-table-note">{r.code} · {r.market}</span>
              </>
            ) },
          { key: 'status', header: 'Status', sortable: true, width: 116,
            value: r => r.status,
            render: r => <StatusPill tone={STATUS_TONE[r.status]}>{r.status}</StatusPill> },
          { key: 'price', header: '₦/MT', numeric: true, sortable: true, width: 140,
            value: r => r.price, render: r => (r.price === null ? null : naira(r.price)) },
          { key: 'chg', header: 'Change', numeric: true, sortable: true, width: 104,
            value: r => r.chg, render: r => <Change value={r.chg} /> },
          { key: 'volume', header: 'Volume MT', numeric: true, sortable: true, width: 116,
            value: r => r.volume,
            render: r => (r.volume === null ? null : r.volume.toLocaleString('en-NG')) },
          { key: 'updated', header: 'Updated', width: 92, sortable: true,
            value: r => r.updated, render: r => r.updated },
          { key: 'market', header: 'Market', width: 120, optional: true,
            value: r => r.market, render: r => r.market },
        ]}
      />
    </div>
  );
}

export function TableDemo() {
  return <ToastProvider><Board /></ToastProvider>;
}
