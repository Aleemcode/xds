'use client';
import * as React from 'react';
import { Icon } from '@afex/xds-react';

type Mode = 'system' | 'light' | 'dark';
const MODES: { id: Mode; label: string; Glyph: typeof Icon.Sun }[] = [
  { id: 'system', label: 'System', Glyph: Icon.Monitor },
  { id: 'light', label: 'Light', Glyph: Icon.Sun },
  { id: 'dark', label: 'Dark', Glyph: Icon.Moon },
];

export function ThemeToggle() {
  const [mode, setMode] = React.useState<Mode>('system');

  React.useEffect(() => {
    let saved: Mode = 'system';
    try { saved = (localStorage.getItem('xds-theme') as Mode) || 'system'; } catch {}
    apply(saved); setMode(saved);
  }, []);

  function apply(m: Mode) {
    const root = document.documentElement;
    if (m === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', m);
    try { localStorage.setItem('xds-theme', m); } catch {}
  }

  return (
    <div className="themetoggle" role="group" aria-label="Theme">
      {MODES.map(({ id, label, Glyph }) => (
        <button key={id} type="button" aria-pressed={mode === id} title={label}
                onClick={() => { setMode(id); apply(id); }}>
          <Glyph size="sm" variant={mode === id ? 'Bold' : 'Linear'} label={label} />
        </button>
      ))}
    </div>
  );
}
