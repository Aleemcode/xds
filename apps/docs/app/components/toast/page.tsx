import { Alert, Button, Icon } from '@afex/xds-react';
import { ToastDemo } from '../../../site/ToastDemo';

export const metadata = { title: 'Toast & Alert' };

export default function Page() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Components</p>
        <h1>Toast &amp; Alert</h1>
        <p className="lede">
          Two components for two different jobs. A toast reports something that
          just happened. An alert describes a condition that is still true.
        </p>
      </div>

      <div className="prose"><h2>Toast</h2>
        <p>
          Transient, floating, stacked bottom-right. Fires on an action the user
          took and leaves on its own — except a danger toast, which stays until
          dismissed, because something went wrong and the reader decides when
          they have finished reading it.
        </p>
      </div>

      <ToastDemo />

      <div className="prose">
        <pre><code>{`import { ToastProvider, useToast } from '@afex/xds-react';

// once, at the root
<ToastProvider>{app}</ToastProvider>

// anywhere below it
const toast = useToast();
toast({ tone: 'danger', title: 'Order rejected',
        message: 'Insufficient wallet balance.',
        action: { label: 'Top up wallet', onClick: openWallet } });`}</code></pre>

        <h2>Alert</h2>
        <p>
          Inline and part of the layout. Stays until the condition that caused
          it is resolved.
        </p>
      </div>

      <div className="demo demo--block" style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <Alert tone="info" title="Delayed prices">
          Your plan shows the board on a 15-minute delay. Live prices are included from Professional upward.
        </Alert>
        <Alert tone="warning" title="Two commodities have no observation today">
          Paddy Rice and Cocoa show no price. They are excluded from the index until a quote arrives.
        </Alert>
        <Alert tone="danger" title="Wallet balance below margin requirement"
               action={<Button size="sm" variant="danger" icon={<Icon.Wallet size="xs" />}>Top up</Button>}>
          Open positions will be closed at 16:00 WAT if the balance is not restored.
        </Alert>
        <Alert tone="success" title="Warehouse receipt verified">
          20 MT Maize White, Grade A, Kaduna. The receipt is now tradeable.
        </Alert>
      </div>

      <div className="prose">
        <h2>Choosing between them</h2>
      </div>

      <table className="spec">
        <thead><tr><th>Ask</th><th>Toast</th><th>Alert</th></tr></thead>
        <tbody>
          <tr><td>Did the user just do something?</td><td>Yes</td><td>Not necessarily</td></tr>
          <tr><td>Is it still true in a minute?</td><td>No</td><td>Yes</td></tr>
          <tr><td>Does it scroll with the page?</td><td>No — it floats</td><td>Yes — it is layout</td></tr>
          <tr><td>Can it be missed safely?</td><td>Yes</td><td>No</td></tr>
        </tbody>
      </table>

      <div className="note">
        <p>
          <Icon.Info size="sm" /> <strong>A persistent condition in a toast is a bug.</strong>{' '}
          &ldquo;Prices are delayed on your plan&rdquo; is true for the whole
          session. Put it in a toast and it scrolls away while still being true,
          and the reader has no way to get it back.
        </p>
      </div>

      <div className="prose">
        <h3>Rules</h3>
        <p>
          Tone picks the icon; there is no prop to override it, because a success
          message wearing a warning icon is a bug nobody catches in review. One
          action per toast, and it is never the only way to do the thing. Danger
          is announced assertively to a screen reader; everything else waits its
          turn rather than interrupting mid-sentence.
        </p>
      </div>
    </main>
  );
}
