import { Toast, Button } from '@afex/xds-react';
export const metadata = { title: 'Toast' };
export default function Page() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Components</p>
        <h1>Toast</h1>
        <p className="lede">Transient feedback. Only the danger tone is announced assertively — a success message that interrupts a screen reader mid-sentence is worse than one that waits.</p>
      </div>
      <div className="demo" style={{ flexDirection: 'column' }}>
        <Toast tone="success" title="Order placed" message="250 MT Maize White at ₦344,720.00/MT." />
        <Toast tone="info" title="Prices are delayed" message="This board shows a 15-minute delay on your plan." />
        <Toast tone="warning" title="Live updates paused" message="The board is holding still while you read." action={<Button variant="ghost" size="sm">Resume</Button>} />
        <Toast tone="danger" title="Order rejected" message="Insufficient wallet balance." action={<Button variant="ghost" size="sm">Top up</Button>} />
      </div>
      <div className="prose">
        <pre><code>{`<Toast tone="danger" title="Order rejected" message="Insufficient wallet balance." />`}</code></pre>
      </div>
    </main>
  );
}
