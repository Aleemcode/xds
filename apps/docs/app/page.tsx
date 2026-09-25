import Link from 'next/link';

export default function Home() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">AFEX · v1.0.0</p>
        <h1>xDS</h1>
        <p className="lede">
          The Xpert Design System. One set of tokens and components for
          africaexchange.com and the AFEX Intelligence Portal — measured against
          WCAG and three kinds of colour blindness, and gated in CI so it cannot
          quietly go wrong.
        </p>
      </div>

      <div className="grid grid--3">
        <div className="card"><h3>139 tokens</h3><p>Generated from about 120 lines of configuration. None written by hand.</p></div>
        <div className="card"><h3>4 planes</h3><p>Brand, system, market, chart. A plane owns its colours and never lends them out.</p></div>
        <div className="card"><h3>0 failures</h3><p>Contrast and colour-vision checks run on every build. A regression fails the deploy.</p></div>
      </div>

      <div className="prose">
        <h2>Why this exists</h2>
        <p>
          A commodity exchange shows red numbers. The AFEX brand is red. Measured,
          the brand red and the error red sit <strong>5.3 apart</strong> in OKLab
          against a floor of roughly 15 — under deuteranopia, 4.4. They are
          genuinely the same red, and no amount of palette tuning separates them.
        </p>
        <p>
          What separates them is never asking anyone to tell them apart. That is
          the whole architecture, and it is the first thing to read:{' '}
          <Link href="/foundations/planes" style={{ color: 'var(--text-brand)' }}>the four planes</Link>.
        </p>

        <h2>This site is made of the system</h2>
        <p>
          Every colour, size, radius and space on this page is a token from{' '}
          <code>@afex/xds-tokens</code>. There are no literal values in the site&apos;s own
          stylesheet. If a token is wrong, this page looks wrong — which is a
          cheaper way to find out than shipping it.
        </p>

        <h2>Start here</h2>
      </div>

      <div className="grid grid--2">
        <Link href="/install" className="card">
          <h3>Install →</h3><p>One import. Works with any styling approach.</p>
        </Link>
        <Link href="/foundations/color" className="card">
          <h3>Colour →</h3><p>Every scale, live, with the measurements that chose them.</p>
        </Link>
        <Link href="/components/table" className="card">
          <h3>Data table →</h3><p>The hardest thing in the product, and the proof the system carries it.</p>
        </Link>
        <Link href="/components/change" className="card">
          <h3>Change →</h3><p>Where an accessibility constraint is enforced by the type signature.</p>
        </Link>
      </div>
    </main>
  );
}
