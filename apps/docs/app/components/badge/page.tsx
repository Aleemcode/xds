import { Badge } from '@afex/xds-react';
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
        <Badge tone="brand">AFEX</Badge>
        <Badge tone="success">Settled</Badge>
        <Badge tone="info">Delayed 15m</Badge>
        <Badge tone="warning">Stale</Badge>
        <Badge tone="danger">Failed</Badge>
      </div>
      <div className="prose">
        <pre><code>{`<Badge tone="warning">Stale</Badge>`}</code></pre>
      </div>
    </main>
  );
}
