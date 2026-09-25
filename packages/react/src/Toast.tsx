'use client';
import * as React from 'react';
import { Icon } from './icons';

export type ToastTone = 'success' | 'info' | 'warning' | 'danger';

export interface ToastOptions {
  tone?: ToastTone;
  title: string;
  message?: string;
  /** One action, always optional, always secondary to dismissing. */
  action?: { label: string; onClick: () => void };
  /** ms before it leaves. 0 keeps it until dismissed — use for danger. */
  duration?: number;
}
interface ToastRecord extends ToastOptions { id: number }

const TONE_ICON = {
  success: Icon.Success, info: Icon.Info, warning: Icon.Warning, danger: Icon.Danger,
} as const;

const ToastCtx = React.createContext<((o: ToastOptions) => void) | null>(null);

/** Wrap the app once. Toasts stack bottom-right and manage their own life. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastRecord[]>([]);
  const next = React.useRef(0);

  const dismiss = React.useCallback((id: number) => {
    setItems(list => list.filter(t => t.id !== id));
  }, []);

  const push = React.useCallback((o: ToastOptions) => {
    const id = ++next.current;
    // A danger toast never disappears on its own. Something went wrong and the
    // reader decides when they have finished reading it.
    const duration = o.duration ?? (o.tone === 'danger' ? 0 : 6000);
    setItems(list => [...list.slice(-3), { ...o, id }]);
    if (duration > 0) window.setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export function ToastViewport({ items, onDismiss }:
  { items: ToastRecord[]; onDismiss: (id: number) => void }) {
  return (
    <div className="xds-toastport" role="region" aria-label="Notifications">
      {items.map(t => <Toast key={t.id} {...t} onDismiss={() => onDismiss(t.id)} />)}
    </div>
  );
}

export interface ToastProps extends ToastOptions { onDismiss?: () => void }

export function Toast({ tone = 'info', title, message, action, onDismiss }: ToastProps) {
  const Glyph = TONE_ICON[tone];
  return (
    <div className={`xds-toast xds-toast--${tone}`} role="status"
         aria-live={tone === 'danger' ? 'assertive' : 'polite'}>
      <span className="xds-toast__badge"><Glyph size="sm" /></span>
      <div className="xds-toast__body">
        <p className="xds-toast__title">{title}</p>
        {message && <p className="xds-toast__msg">{message}</p>}
        {action && (
          <button type="button" className="xds-toast__action" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button type="button" className="xds-toast__close" onClick={onDismiss} aria-label="Dismiss">
          <Icon.Close size="sm" />
        </button>
      )}
    </div>
  );
}
