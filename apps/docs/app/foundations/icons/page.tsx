import { IconGallery } from '../../../site/IconGallery';

export const metadata = { title: 'Icons' };

export default function Icons() {
  return (
    <main className="page">
      <div className="prose">
        <p className="eyebrow">Foundations</p>
        <h1>Icons</h1>
        <p className="lede">
          The xDS icon set. Six weights, five sizes, wrapped so size is a token
          and colour is always inherited from the text beside it.
        </p>
        <p>
          Click any icon to copy its usage. Every one is named for its{' '}
          <em>job</em> rather than its picture — <code>Icon.Up</code>, not{' '}
          <code>Icon.ArrowUp2</code> — so swapping a glyph later does not ripple
          through products.
        </p>
      </div>

      <IconGallery />

      <div className="prose">
        <h2>How to use them</h2>
        <pre><code>{`import { Icon } from '@afex/xds-react';

<Icon.Warehouse size="md" />
<Icon.Up size="xs" variant="Bold" />

// icon-only buttons must carry a label — the icon is the whole meaning
<Button iconOnly aria-label="Refresh prices" icon={<Icon.Refresh size="sm" />} />`}</code></pre>

        <h2>Three rules</h2>

        <h3>Import from xDS, never from the pack</h3>
        <p>
          Products import from <code>@afex/xds-react</code>. One file —{' '}
          <code>packages/react/src/icons.tsx</code> — is the only place in the
          codebase that names the underlying pack, so replacing it is a
          single-file change rather than a search across every product.
        </p>

        <h3>Colour is inherited, never set</h3>
        <p>
          Every icon renders at <code>currentColor</code>. An icon coloured
          independently of the text beside it drifts the moment either changes.
          To colour an icon, colour its container.
        </p>

        <h3>Size is a token</h3>
        <p>
          <code>xs</code> 14 · <code>sm</code> 16 · <code>md</code> 20 ·{' '}
          <code>lg</code> 24 · <code>xl</code> 32. Sixteen is the default
          because it is what a dense table row can carry without changing the
          row height.
        </p>

        <div className="note note--info">
          <p>
            <strong>Bold for state, Linear for rest.</strong> The navigation and
            theme switcher on this site both use that rule — the active item is
            Bold, everything else Linear. It gives a second, non-colour signal
            for which thing is selected, which is the same principle the market
            plane runs on.
          </p>
        </div>
      </div>
    </main>
  );
}
