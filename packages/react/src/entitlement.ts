/**
 * The four-outcome entitlement resolver (xDS doc 06).
 *
 * Deliberately not a boolean. `upgrade` must name the tier that unlocks the
 * thing, and the resolver verifies that tier actually grants it — an upgrade
 * prompt pointing at a tier that does not unlock the action is the single
 * worst bug this product can ship, because it sells a subscription that does
 * not deliver what the button sat beside.
 */
export type Tier = 'basic' | 'professional' | 'enterprise' | 'premium';
export type DataFamily = 'exchange-live' | 'exchange-history' | 'openmarket-history'
  | 'indices' | 'reports-dw' | 'reports-mm' | 'analysis';
export type Action = 'view' | 'graph-pdf' | 'exact-points' | 'api';

export type Outcome =
  | { kind: 'granted' }
  | { kind: 'upgrade'; tier: Tier }
  | { kind: 'request'; reason: string }
  | { kind: 'unavailable'; reason: string }
  | { kind: 'unassigned' };

const TIER_ORDER: Tier[] = ['basic', 'professional', 'enterprise'];

type Matrix = Partial<Record<DataFamily, Partial<Record<Tier, Partial<Record<Action, Outcome>>>>>>;

const G: Outcome = { kind: 'granted' };
const UP = (tier: Tier): Outcome => ({ kind: 'upgrade', tier });
const REQ = (reason: string): Outcome => ({ kind: 'request', reason });
const NO = (reason: string): Outcome => ({ kind: 'unavailable', reason });
const GAP: Outcome = { kind: 'unassigned' };

export const MATRIX: Matrix = {
  'exchange-history': {
    basic:        { view: UP('professional'), 'graph-pdf': UP('professional'), 'exact-points': UP('enterprise'), api: UP('enterprise') },
    professional: { view: G, 'graph-pdf': G, 'exact-points': UP('enterprise'), api: UP('enterprise') },
    enterprise:   { view: G, 'graph-pdf': G, 'exact-points': G, api: G },
    premium:      { view: GAP, 'graph-pdf': GAP, 'exact-points': REQ('Released under legal review, NDA and vetting'), api: NO('No API at this tier') },
  },
  'openmarket-history': {
    basic:        { view: UP('professional'), 'graph-pdf': UP('professional'), 'exact-points': REQ('No tier unlocks this'), api: GAP },
    professional: { view: G, 'graph-pdf': G, 'exact-points': REQ('Enterprise does not unlock it either'), api: GAP },
    enterprise:   { view: G, 'graph-pdf': G, 'exact-points': REQ('Protected file, sent by market control after payment'), api: GAP },
    premium:      { view: GAP, 'graph-pdf': GAP, 'exact-points': REQ('Protected file, after vetting'), api: NO('No API at this tier') },
  },
  indices: {
    basic: { view: GAP }, professional: { view: GAP }, enterprise: { view: GAP }, premium: { view: GAP },
  },
  'reports-dw': {
    basic: { view: G }, professional: { view: G }, enterprise: { view: G }, premium: { view: GAP },
  },
};

export function resolve(tier: Tier, family: DataFamily, action: Action): Outcome {
  const cell = MATRIX[family]?.[tier]?.[action];
  if (!cell) return GAP;
  if (cell.kind === 'upgrade') {
    // Verify the named tier genuinely grants it. If it does not, this is a
    // request, not an upgrade — and saying "upgrade" would be a lie.
    const target = MATRIX[family]?.[cell.tier]?.[action];
    if (!target || target.kind !== 'granted') {
      return REQ('No subscription tier unlocks this');
    }
  }
  return cell;
}

/** True when the UI may show an upsell. Never show one for request/unavailable. */
export const isUpsellable = (o: Outcome): o is Extract<Outcome, { kind: 'upgrade' }> =>
  o.kind === 'upgrade';
