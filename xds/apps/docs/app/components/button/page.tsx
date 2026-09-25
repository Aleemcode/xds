import { Button, Icon } from '@afex/xds-react';
export const metadata = { title: 'Button' };
export default function Page() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Components</p>
        <h1>Button</h1>
        <p className="lede">Four variants. The primary fill and its label colour are both generated, because a fill that cannot carry its own label is not a fill.</p>
      </div>
      <div className="demo">
        <Button variant="primary" icon={<Icon.Check size="sm" />}>Place order</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="ghost" trailing={<Icon.External size="sm" />}>View contract</Button>
        <Button variant="danger" icon={<Icon.Close size="sm" />}>Cancel order</Button>
        <Button variant="primary" disabled icon={<Icon.Wallet size="sm" />}>Insufficient balance</Button>
        <Button variant="secondary" size="sm" icon={<Icon.Download size="xs" />}>Export</Button>
        <Button variant="ghost" iconOnly aria-label="Refresh prices" icon={<Icon.Refresh size="sm" />} />
        <Button variant="secondary" iconOnly aria-label="Filter" icon={<Icon.Filter size="sm" />} />
      </div>
      <div className="prose">
        <pre><code>{`import { Button, Icon } from '@afex/xds-react';

<Button variant="primary">Place order</Button>
<Button variant="danger" size="sm">Delete</Button>`}</code></pre>
        <h2>Why the label colour is a token</h2>
        <p>
          <code>--text-on-brand-solid</code> is generated alongside the fill. Four
          fills in this system could not reach 4.5:1 with white at step 9, so the
          generator walked them up the scale until one could and recorded the
          substitution. In dark mode, three of four accents fail the usual
          white-on-solid assumption — which is why dark-mode buttons fail AA in
          most design systems.
        </p>
      </div>
    </main>
  );
}
