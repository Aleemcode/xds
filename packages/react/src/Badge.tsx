import * as React from 'react';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'info' | 'warning' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: React.ReactNode;
}

export function Badge({ tone = 'neutral', icon, className = '', children, ...rest }: BadgeProps) {
  return (
    <span className={`xds-badge xds-badge--${tone} ${className}`.trim()} {...rest}>
      {icon}{children}
    </span>
  );
}
