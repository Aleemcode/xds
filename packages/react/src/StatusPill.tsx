import * as React from 'react';

export type StatusTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger' | 'brand';

export interface StatusPillProps {
  tone?: StatusTone;
  children: React.ReactNode;
}

/**
 * Record state, as a pill with a leading dot.
 *
 * The dot is not decoration. It is the second encoding that lets Active and
 * Inactive be told apart when the two greens or the two blues are close, and
 * it is what makes the pill readable at the size a dense row allows. A pill
 * without it is colour alone.
 *
 * Distinct from Badge: a Badge labels a thing ("Grade A", "Kaduna"), a
 * StatusPill reports where a record is in its lifecycle.
 */
export function StatusPill({ tone = 'neutral', children }: StatusPillProps) {
  return (
    <span className={`xds-status xds-status--${tone}`}>
      <span className="xds-status__dot" aria-hidden="true" />
      {children}
    </span>
  );
}
