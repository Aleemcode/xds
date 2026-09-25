export const metadata = { title: 'Install' };

export default function Install() {
  return (
    <main className="page prose">
      <p className="eyebrow">Start</p>
      <h1>Install</h1>
      <p className="lede">Two packages. The tokens work anywhere; the components need React.</p>

      <h2>From the repository</h2>
      <p>Until these are published to a registry, install straight from git. No registry account needed, and the version is whatever the branch is.</p>
      <pre><code>{`npm i github:afex/xds#main --workspace-root
# or a single package
npm i "github:afex/xds#main:packages/tokens"`}</code></pre>

      <h2>From npm, once published</h2>
      <pre><code>{`npm i @afex/xds-tokens          # tokens only — any framework
npm i @afex/xds-react           # components, pulls tokens with it`}</code></pre>

      <h2>Wire it up</h2>
      <p>One import at the root of your app. That is the whole integration for tokens.</p>
      <pre><code>{`/* app/globals.css */
@import "@afex/xds-tokens/tokens.css";
@import "@afex/xds-react/styles.css";   /* only if using the components */`}</code></pre>

      <p>Then use the semantic names. Never a hex, never a raw scale step:</p>
      <pre><code>{`.panel {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  color: var(--text-primary);
}`}</code></pre>

      <h2>Theming</h2>
      <p>
        Light is the default and every token is declared there. Dark is applied by
        the system preference, and an explicit choice overrides it in both
        directions — so a user who picks light on a dark OS gets light.
      </p>
      <pre><code>{`document.documentElement.setAttribute('data-theme', 'dark');   // force dark
document.documentElement.removeAttribute('data-theme');        // follow the OS`}</code></pre>

      <h2>Components</h2>
      <pre><code>{`import { Button, Change, DataTable } from '@afex/xds-react';

<Button variant="primary">Place order</Button>
<Change value={-0.87} />`}</code></pre>

      <h2>The CI gate</h2>
      <p>
        Run the audit in your pipeline. It checks text contrast on the surface each
        token actually sits on, colour-vision separation for every pair that
        carries meaning, and the invariants the scales are supposed to hold. It
        exits non-zero on any failure.
      </p>
      <pre><code>{`# package.json
"scripts": { "audit": "npm run audit -w @afex/xds-tokens" }

# .github/workflows/ci.yml
- run: npm ci
- run: npm run audit -- --quiet`}</code></pre>

      <div className="note note--info">
        <p><strong>Changing the system.</strong> Never edit <code>tokens.css</code> — it is generated and your edit will be overwritten. Change <code>packages/tokens/tokens.config.mjs</code> and run <code>npm run tokens</code>, then <code>npm run audit</code> before you commit.</p>
      </div>
    </main>
  );
}
