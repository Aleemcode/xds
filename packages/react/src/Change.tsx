import * as React from 'react';

/**
 * Market direction indicator.
 *
 * The glyph and the explicit sign are NOT optional and there is no prop to
 * remove them. The light-theme up/down pair separates by 6.7 in OKLab under
 * protanopia, which is only permissible where a second, non-colour encoding is
 * present. This component IS that encoding — so the constraint is enforced by
 * the type signature rather than by a paragraph in a document.
 */
export interface ChangeProps {
  /** Signed value. null means no observation — renders an em dash, never 0%. */
  value: number | null;
  /** 'percent' appends %, 'absolute' prefixes the unit. */
  format?: 'percent' | 'absolute';
  unit?: string;
  decimals?: number;
}
export function Change({ value, format = 'percent', unit = '', decimals = 2 }: ChangeProps) {
  if (value === null || Number.isNaN(value)) {
    return <span className="xds-change xds-change--flat" aria-label="no observation">—</span>;
  }
  const dir = value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
  const glyph = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '—';
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  const magnitude = Math.abs(value).toFixed(decimals);
  const body = format === 'percent' ? `${magnitude}%` : `${unit}${magnitude}`;
  const label = `${dir === 'up' ? 'up' : dir === 'down' ? 'down' : 'unchanged'} ${magnitude}${format === 'percent' ? ' percent' : ''}`;
  return (
    <span className={`xds-change xds-change--${dir}`} aria-label={label}>
      <span className="xds-change__glyph" aria-hidden="true">{glyph}</span>
      <span>{sign}{body}</span>
    </span>
  );
}
