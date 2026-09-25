import * as React from 'react';
import { Icon } from './icons';

export type AlertTone = 'success' | 'info' | 'warning' | 'danger';

export interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const TONE_ICON = {
  success: Icon.Success, info: Icon.Info, warning: Icon.Warning, danger: Icon.Danger,
} as const;

/**
 * Inline, page-level message. Stays until the condition that caused it is
 * resolved — a delayed feed, a failed payment, a locked account.
 *
 * Not a toast. A toast is transient and floats; an alert belongs to a region of
 * the page and is part of its layout. Putting a persistent condition in a toast
 * means it scrolls away while still being true.
 */
export function Alert({ tone = 'info', title, children, action }: AlertProps) {
  const Glyph = TONE_ICON[tone];
  return (
    <div className={`xds-alert xds-alert--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>
      <span className="xds-alert__icon"><Glyph size="sm" /></span>
      <div className="xds-alert__body">
        {title && <p className="xds-alert__title">{title}</p>}
        <div className="xds-alert__text">{children}</div>
      </div>
      {action && <div className="xds-alert__action">{action}</div>}
    </div>
  );
}
