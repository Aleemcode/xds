'use client';
import * as React from 'react';

type Mode = 'system' | 'light' | 'dark';

export function ThemeToggle() {
  const [mode, setMode] = React.useState<Mode>('system');

  React.useEffect(() => {
    let saved: Mode = 'system';
    try { saved = (localStorage.getItem('xds-theme') as Mode) || 'system'; } catch {}
    apply(saved);
    setMode(saved);
  }, []);

  function apply(m: Mode) {
    const root = document.documentElement;
    if (m === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', m);
    try { localStorage.setItem('xds-theme', m); } catch {}
  }

  function pick(m: Mode) { setMode(m); apply(m); }

  return (
    <div role="group" aria-label="Theme" style={{ display: 'flex', gap: 'var(--space-1)' }}>
      {(['system', 'light', 'dark'] as Mode[]).map(m => (
        <button key={m} type="button"
          className={`xds-btn xds-btn--${mode === m ? 'secondary' : 'ghost'} xds-btn--sm`}
          aria-pressed={mode === m} onClick={() => pick(m)}>
          {m}
        </button>
      ))}
    </div>
  );
}
