'use client';
import * as React from 'react';
import { Icon, ICON_NAMES, ICON_SIZE, ICON_VARIANTS } from '@afex/xds-react';
import type { IconName, IconVariant } from '@afex/xds-react';
import { Button, Input, Badge } from '@afex/xds-react';

const GROUPS: { title: string; note: string; names: IconName[] }[] = [
  { title: 'Market', note: 'Direction only. Never decorative — these carry meaning colour is not allowed to carry alone.',
    names: ['Up', 'Down', 'Flat', 'Trend', 'Chart'] },
  { title: 'Status', note: 'The only icons permitted to take a system tone. Toast picks these by tone, not by prop.',
    names: ['Success', 'Info', 'Warning', 'Danger'] },
  { title: 'Actions', note: 'Interface verbs.',
    names: ['Copy', 'Search', 'Filter', 'Download', 'Expand', 'Collapse', 'Refresh', 'Play', 'Pause', 'Check', 'Close', 'Settings', 'Lock', 'External'] },
  { title: 'Exchange', note: 'The domain vocabulary. Worth having as first-class names — a warehouse receipt is not a generic document.',
    names: ['Warehouse', 'Receipt', 'Wallet', 'Grade', 'Document', 'Clock'] },
  { title: 'Theme & navigation', note: '',
    names: ['Sun', 'Moon', 'Monitor', 'Home', 'Box', 'Palette', 'Type', 'Ruler', 'Layers', 'Grid', 'Component', 'Table', 'Book', 'Code'] },
];

export function IconGallery() {
  const [variant, setVariant] = React.useState<IconVariant>('Linear');
  const [size, setSize] = React.useState<keyof typeof ICON_SIZE>('lg');
  const [q, setQ] = React.useState('');
  const [copied, setCopied] = React.useState<string | null>(null);

  const copy = (name: string) => {
    navigator.clipboard?.writeText(`<Icon.${name} size="${size}" />`)
      .then(() => { setCopied(name); window.setTimeout(() => setCopied(null), 1400); })
      .catch(() => {});
  };

  const match = (n: string) => !q || n.toLowerCase().includes(q.toLowerCase());

  return (
    <>
      <div className="icontools">
        <div className="icontools__row" role="group" aria-label="Variant">
          {ICON_VARIANTS.map(v => (
            <Button key={v} size="sm" variant={variant === v ? 'secondary' : 'ghost'}
                    aria-pressed={variant === v} onClick={() => setVariant(v)}>{v}</Button>
          ))}
        </div>
        <div className="icontools__row" role="group" aria-label="Size">
          {(Object.keys(ICON_SIZE) as (keyof typeof ICON_SIZE)[]).map(s => (
            <Button key={s} size="sm" variant={size === s ? 'secondary' : 'ghost'}
                    aria-pressed={size === s} onClick={() => setSize(s)}>
              {s} · {ICON_SIZE[s]}
            </Button>
          ))}
        </div>
        <div className="icontools__search">
          <Input label="" placeholder="Filter by name" value={q}
                 onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      {GROUPS.map(g => {
        const names = g.names.filter(match);
        if (!names.length) return null;
        return (
          <section key={g.title} className="icongroup">
            <header>
              <h3>{g.title}</h3>
              <Badge>{names.length}</Badge>
            </header>
            {g.note && <p className="icongroup__note">{g.note}</p>}
            <div className="icongrid">
              {names.map(name => {
                const Glyph = Icon[name];
                return (
                  <button key={name} type="button" className="iconcell" onClick={() => copy(name)}
                          title={`Copy <Icon.${name} />`}>
                    <Glyph size={size} variant={variant} />
                    <span>{copied === name ? 'copied' : name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <p className="icongroup__note" style={{ marginTop: 'var(--space-6)' }}>
        {ICON_NAMES.length} names in the set, out of roughly 995 Iconsax ships.
      </p>
    </>
  );
}
