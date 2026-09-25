# xDS — Xpert Design System

The AFEX design system. Tokens, React components, and a documentation site — for
africaexchange.com and the AFEX Intelligence Portal.

```
xds/
├── packages/
│   ├── tokens/     @afex/xds-tokens   generated CSS custom properties + the audit
│   └── react/      @afex/xds-react    components built on those tokens
└── apps/
    └── docs/       @afex/xds-docs     the documentation site (Next.js 16)
```

## Quick start

```bash
npm install          # installs all three workspaces
npm run dev          # docs site at localhost:3000
npm run tokens       # regenerate tokens.css from the config
npm run audit        # contrast + colour-vision gate; exits 1 on failure
npm run build        # tokens → audit → docs build, in that order
```

Node 20+. No global dependencies.

## Connecting it to Vercel

Import the repo and accept the defaults — `vercel.json` at the root already
points Vercel at the right build and output:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": "apps/docs/.next"
}
```

Leave **Root Directory** as the repository root. That matters: the root build
command runs the token generator and the audit *before* Next builds, so a
contrast regression fails the deploy rather than shipping. If you set Root
Directory to `apps/docs`, Next still builds but the gate is skipped.

**Deployment Protection** is worth turning on while the system is in review —
Vercel project settings, Deployment Protection, Vercel Authentication. The site
is public otherwise.

## Installing it in a product

```bash
# from the repo, before anything is published to a registry
npm i "github:afex/xds#main:packages/tokens"

# once published
npm i @afex/xds-tokens
npm i @afex/xds-react      # pulls tokens with it
```

```css
/* one import, at the root of your app */
@import "@afex/xds-tokens/tokens.css";
@import "@afex/xds-react/styles.css";
```

Then use the semantic names — never a hex, never a raw scale step:

```css
.panel {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  color: var(--text-primary);
}
```

## The one idea

**Four planes, and a plane never lends its colours out.**

| Plane | Owns | Never |
|---|---|---|
| Brand | fills, primary actions, links | a data value |
| System | success / info / warning / danger chrome | a price |
| Market | up / down / flat | a button or a toast |
| Chart | series identity | a status or a direction |

AFEX's brand is red and a falling price is red. Measured, `Main-9` `#E1261C`
and `Error-9` `#E5484D` are **5.3 apart** in OKLab against a floor of roughly
15 — under deuteranopia, 4.4. They are the same red and no palette tuning
separates them. Separating the *contexts* does: a brand red never appears in a
data cell, so the two never have to be told apart.

Everything else in this repo is an application of that.

## Things worth knowing before you change something

**Never edit `tokens.css`.** It is generated, CI fails if it drifts from the
config, and your edit will be overwritten. Edit `packages/tokens/tokens.config.mjs`
and run `npm run tokens`.

**The generator fixes fills that cannot carry a label.** A solid that can't reach
4.5:1 with either white or near-black ink is walked up the scale until one can,
and the substitution is printed on every run. Four snapped in this build. It also
emits `--text-on-{role}-solid` beside each fill, because in dark mode three of
four accents fail the usual white-on-solid assumption — which is why dark-mode
buttons fail AA in most design systems.

**`--text-up` and `--text-down` may not be used outside the `Change` component.**
The light-theme pair separates by 6.7 under protanopia, which is permissible only
where a second, non-colour encoding is present. `Change` renders a triangle and an
explicit sign unconditionally and exposes no prop to remove them, so the condition
holds by construction. Use the tokens directly and you have quietly broken it.

**Six chart colours is a ceiling, not a preference.** With four planes reserved,
only the 204°–330° hue arc is free, and that arc is exactly what dichromats
compress. For more series than six, highlight one and grey the rest with
`--chart-muted`, or facet into small multiples.

**The X-Additional scales are deliberately excluded.** Each one's light column is
a dark scale printed in reverse, so step 1 lands near lightness 90 instead of 99
and none of the step meanings survive. Ruby's dark scale is byte-identical to
Error's; Amber is Warning under another name. They stay in `scales.mjs` so the
audit keeps reporting them.

## Open

- **Switzer font files are not in the repo.** Drop them into
  `apps/docs/public/fonts/` — see the README there. The typography page checks at
  runtime and tells the reader whether they are seeing real Switzer or a
  fallback, so the figures test can't quietly measure the wrong thing.
- **Switzer is ITF Free Font License, not MIT.** Self-hosting the file in a
  public repo is redistribution. Worth ten minutes of legal time first.
- **The type scale is proposed, not confirmed** — a 1.2 minor third from 16px.
- **Elevation, motion and focus-ring styling are not in v1.** Those are
  expressive decisions and they wait for the moodboard. When it lands, they are
  config edits, not a rewrite.

## Reference

Full write-ups live in the project docs: the token architecture (04), the table
standard (05), the entitlement model (06), the domain primer (07), and the
finalised system (08).
