'use client';
import * as React from 'react';
import { useTheme } from './useTheme';

export function ScaleRow({ name, meta, light, dark }:
  { name: string; meta: string; light: string[]; dark: string[] }) {
  const theme = useTheme();
  const steps = theme === 'dark' ? dark : light;
  const [copied, setCopied] = React.useState<number | null>(null);

  const copy = (hex: string, i: number) => {
    navigator.clipboard?.writeText(hex).then(() => {
      setCopied(i);
      window.setTimeout(() => setCopied(null), 1200);
    }).catch(() => {});
  };

  return (
    <div className="scalerow">
      <header>
        <h3>{name}</h3>
        <span className="meta">{copied !== null ? `${steps[copied]} copied` : meta}</span>
      </header>
      <div className="swatchgrid">
        {steps.map((hex, i) => (
          <button key={i} type="button" className="swatch" style={{ background: hex }}
                  title={`${name} ${i + 1} · ${hex}`}
                  aria-label={`${name} step ${i + 1}, ${hex}. Copy.`}
                  onClick={() => copy(hex, i)} />
        ))}
      </div>
      <div className="steplabels">
        {steps.map((_, i) => <span key={i}>{i + 1}</span>)}
      </div>
    </div>
  );
}

/** The market pair and chart series, rendered from the theme that is actually on. */
export function LiveHex({ light, dark }: { light: string; dark: string }) {
  const theme = useTheme();
  return <code>{theme === 'dark' ? dark : light}</code>;
}
