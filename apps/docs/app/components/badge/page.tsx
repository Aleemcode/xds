import { Badge, Icon } from '@afex/xds-react';
export const metadata = { title: 'Badge' };
export default function Page() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Components</p>
        <h1>Badge</h1>
        <p className="lede">Status and metadata. System tones only — a badge never carries a market direction, because that is a different plane.</p>
      </div>
      <div className="demo">
        <Badge>Draft</Badge>
        <Badge tone="brand" icon={<Icon.Grade size="xs" />}>Grade A</Badge>
        <Badge tone="success" icon={<Icon.Success size="xs" />}>Settled</Badge>
        <Badge tone="info" icon={<Icon.Clock size="xs" />}>Delayed 15m</Badge>
        <Badge tone="warning" icon={<Icon.Warning size="xs" />}>Stale</Badge>
        <Badge tone="danger" icon={<Icon.Danger size="xs" />}>Failed</Badge>
        <Badge icon={<Icon.Warehouse size="xs" />}>Kaduna</Badge>
      </div>
      <div className="prose">
        <pre><code>{`<Badge tone="warning">Stale</Badge>`}</code></pre>
      </div>
    </main>
  );
}
