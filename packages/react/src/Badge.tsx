import * as React from 'react';
export type BadgeTone = 'neutral' | 'brand' | 'success' | 'info' | 'warning' | 'danger';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> { tone?: BadgeTone }
export function Badge({ tone = 'neutral', className = '', ...rest }: BadgeProps) {
  return <span className={`xds-badge xds-badge--${tone} ${className}`.trim()} {...rest} />;
}
