import * as React from 'react';
export type ToastTone = 'success' | 'info' | 'warning' | 'danger';
export interface ToastProps {
  tone?: ToastTone;
  title: string;
  message?: string;
  action?: React.ReactNode;
}
export function Toast({ tone = 'info', title, message, action }: ToastProps) {
  // assertive only for danger — a success toast that interrupts a screen reader
  // mid-sentence is worse than one that waits its turn.
  return (
    <div className={`xds-toast xds-toast--${tone}`} role="status"
         aria-live={tone === 'danger' ? 'assertive' : 'polite'}>
      <div className="xds-toast__body">
        <p className="xds-toast__title">{title}</p>
        {message && <p className="xds-toast__msg">{message}</p>}
      </div>
      {action}
    </div>
  );
}
