import { Input } from '@afex/xds-react';
export const metadata = { title: 'Input' };
export default function Page() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Components</p>
        <h1>Input</h1>
        <p className="lede">The <code>numeric</code> prop is not cosmetic — it sets tabular figures and right alignment, which is what makes a column of prices readable.</p>
      </div>
      <div className="demo" style={{ gap: 'var(--space-6)' }}>
        <Input label="Commodity" placeholder="Maize White, Grade A" hint="Grade determines the contract." />
        <Input label="Quantity" numeric defaultValue="1,250.00" hint="MT" />
        <Input label="Limit price" numeric defaultValue="344,720.00" error="Below the exchange floor." />
      </div>
      <div className="prose">
        <pre><code>{`<Input label="Limit price" numeric defaultValue="344,720.00" />`}</code></pre>
        <p>Labels are bound with a generated id, and hints and errors are wired to <code>aria-describedby</code> so a screen reader announces the reason a field is invalid rather than just that it is.</p>
      </div>
    </main>
  );
}
