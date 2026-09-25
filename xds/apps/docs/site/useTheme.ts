'use client';
import * as React from 'react';

/** The effective theme, which is not the same as the user's setting: "system"
 *  resolves through prefers-color-scheme. Watches both the attribute and the
 *  media query, because either can change without the other. */
export function useTheme(): 'light' | 'dark' {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const resolve = () => {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'dark' || attr === 'light') return attr;
      return mq.matches ? 'dark' : 'light';
    };
    const update = () => setTheme(resolve());
    update();

    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    mq.addEventListener('change', update);
    return () => { obs.disconnect(); mq.removeEventListener('change', update); };
  }, []);

  return theme;
}
