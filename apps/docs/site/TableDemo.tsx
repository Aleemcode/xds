'use client';
import * as React from 'react';
import { DataTable, Change, Button, Badge } from '@afex/xds-react';
import type { Density, CellState } from '@afex/xds-react';

type Row = {
  id: string; name: string; code: string; market: string;
  price: number | null; chg: number | null; volume: number | null; updated: string;
};

// Figures are the live catalogue's, corrected to ₦'000/MT — see the research
// doc: per MT the published ticker is implausible by ~1000x and only resolves
// at this scale.
const BASE: Row[] = [
  { id: 'MAZ', name: 'Maize White',           code: 'MAZ', market: 'Kaduna',  price: 344720,  chg: 0.00,  volume: 1250, updated: '14:32' },
  { id: 'SGM', name: 'Sorghum',               code: 'SGM', market: 'Kano',    price: 343000,  chg: -0.13, volume: 880,  updated: '14:31' },
  { id: 'SBS', name: 'Soyabean',              code: 'SBS', market: 'Benue',   price: 750590,  chg: 0.41,  volume: 2100, updated: '14:32' },
  { id: 'GNG', name: 'Ginger Dried Split',    code: 'GNG', market: 'Kaduna',  price: 990000,  chg: 0.00,  volume: 145,  updated: '13:58' },
  { id: 'CSN', name: 'Raw Cashew Nuts',       code: 'CSN', market: 'Kwara',   price: 1719500, chg: 1.12,  volume: 620,  updated: '14:32' },
  { id: 'SSC', name: 'Sesame Seed Cleaned',   code: 'SSC', market: 'Jigawa',  price: 2300000, chg: -0.34, volume: 410,  updated: '14:30' },
  { id: 'PRL', name: 'Paddy Rice Long Grain', code: 'PRL', market: 'Kebbi',   price: null,    chg: null,  volume: null, updated: '—' },
  { id: 'CCO', name: 'Cocoa',                 code: 'CCO', market: 'Ondo',    price: null,    chg: null,  volume: null, updated: '—' },
];

const STATES: Record<string, CellState> = {
  'PRL:price': 'missing', 'PRL:chg': 'missing', 'PRL:volume': 'missing',
  'CCO:price': 'notcovered', 'CCO:chg': 'notcovered', 'CCO:volume': 'notcovered',
  'GNG:price': 'stale',
  'SSC:volume': 'locked',
};

const naira = (n: number) => '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function TableDemo() {
  const [density, setDensity] = React.useState<Density>('comfortable');
  const [rows, setRows] = React.useState(BASE);
  const [live, setLive] = React.useState(false);
  const [flashes, setFlashes] = React.useState<Record<string, 'up' | 'down'>>({});
  const hovering = React.useRef(false);

  React.useEffect(() => {
    if (!live) return;
    const t = window.setInterval(() => {
      // A row never moves while the pointer is inside. Values update in place.
      if (hovering.current) return;
      setRows(prev => prev.map(r => {
        if (r.price === null || Math.random() > 0.4) return r;
        const delta = (Math.random() - 0.5) * 0.02;
        const next = Math.round(r.price * (1 + delta));
        return { ...r, price: next, chg: +(((next - r.price) / r.price) * 100 + (r.chg ?? 0)).toFixed(2) };
      }));
      setRows(prev => {
        const f: Record<string, 'up' | 'down'> = {};
        prev.forEach((r, i) => {
          const was = BASE[i].price;
          if (r.price !== null && was !== null && r.price !== was) {
            f[`${r.id}:price`] = r.price > was ? 'up' : 'down';
          }
        });
        setFlashes(f);
        window.setTimeout(() => setFlashes({}), 450);
        return prev;
      });
    }, 2200);
    return () => window.clearInterval(t);
  }, [live]);

  return (
    <div
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}
      style={{ marginTop: 'var(--space-5)' }}
    >
      <DataTable<Row>
        rows={rows}
        rowKey={r => r.id}
        density={density}
        states={STATES}
        flashes={flashes}
        provenance={`As at 14:32 WAT · delayed 15m · ${live ? 'live' : 'held'}`}
        caption="Maize is quoted in ₦ per metric tonne. Two rows carry no observation — they show an em dash, never a zero."
        toolbar={
          <>
            <Badge tone={live ? 'success' : 'neutral'}>{live ? 'Live' : 'Paused'}</Badge>
            <Button variant="ghost" size="sm" onClick={() => setLive(v => !v)}>
              {live ? 'Pause' : 'Go live'}
            </Button>
            <div role="group" aria-label="Density" style={{ display: 'flex', gap: 2 }}>
              {(['comfortable', 'compact', 'dense'] as Density[]).map(d => (
                <Button key={d} size="sm"
                  variant={density === d ? 'secondary' : 'ghost'}
                  aria-pressed={density === d}
                  onClick={() => setDensity(d)}>
                  {d[0].toUpperCase() + d.slice(1)}
                </Button>
              ))}
            </div>
          </>
        }
        columns={[
          { key: 'name', header: 'Commodity', pin: true, sortable: true, width: 210,
            value: r => r.name,
            render: r => (
              <>
                <div style={{ fontWeight: 'var(--weight-medium)' as unknown as number }}>{r.name}</div>
                <span className="xds-table-note">{r.code} · {r.market}</span>
              </>
            ) },
          { key: 'price', header: '₦/MT', numeric: true, sortable: true, width: 150,
            value: r => r.price,
            render: r => (r.price === null ? null : naira(r.price)) },
          { key: 'chg', header: 'Change', numeric: true, sortable: true, width: 120,
            value: r => r.chg,
            render: r => <Change value={r.chg} /> },
          { key: 'volume', header: 'Volume MT', numeric: true, sortable: true, width: 130,
            value: r => r.volume,
            render: r => (r.volume === null ? null : r.volume.toLocaleString('en-NG')) },
          { key: 'updated', header: 'Updated', width: 110,
            value: r => r.updated, render: r => r.updated },
        ]}
      />
    </div>
  );
}
