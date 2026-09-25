'use client';
import * as React from 'react';

/** Says out loud whether the reader is looking at real Switzer or a fallback.
 *  A figures test that silently measures the fallback is worse than no test. */
export function FontCheck() {
  const [state, setState] = React.useState<'checking' | 'loaded' | 'missing'>('checking');
  React.useEffect(() => {
    let cancelled = false;
    const check = () => {
      try {
        const ok = document.fonts.check('16px Switzer');
        if (!cancelled) setState(ok ? 'loaded' : 'missing');
      } catch { if (!cancelled) setState('missing'); }
    };
    document.fonts?.ready?.then(check).catch(check) ?? check();
    return () => { cancelled = true; };
  }, []);

  if (state === 'checking') return null;
  return (
    <div className={`note ${state === 'loaded' ? 'note--info' : 'note--warn'}`}>
      {state === 'loaded' ? (
        <p><strong>Switzer is loading.</strong> The specimens below are the real face, so the figures test is trustworthy.</p>
      ) : (
        <p>
          <strong>Switzer is not loading — you are seeing a fallback.</strong> The
          font files are not in <code>public/fonts/</code> yet, so the specimens
          below measure the system stack instead. Drop{' '}
          <code>Switzer-Variable.woff2</code> in and this notice turns green.
        </p>
      )}
    </div>
  );
}
