# Building AFEX interfaces with xDS

Instructions for an AI agent writing or reviewing code for africaexchange.com
or the AFEX Intelligence Portal. Copy this file to the root of the product
repository so the agent picks it up.

## Before writing

Install the system and import both stylesheets once, at the root:

```bash
npm i @afex/xds-tokens @afex/xds-react
```

```css
@import "@afex/xds-tokens/tokens.css";
@import "@afex/xds-react/styles.css";
```

## Non-negotiables

1. **Never write a colour.** Every colour comes from a semantic token —
   `var(--bg-raised)`, `var(--text-muted)`, `var(--border-strong)`. A hex, an
   `rgb()`, or a raw scale step such as `--main-9` in product code is a defect.
2. **Stay inside the plane.** Brand owns fills, primary actions and links.
   System owns success, info, warning and danger. Market owns up, down and
   flat. Chart owns series identity. A plane never lends its colours out —
   AFEX brand red and a falling price are the same red, and separating the
   contexts is the only thing that keeps them apart.
3. **Colour is never the only encoding.** Direction carries a glyph and a
   sign; status carries a word; series carry a label.
4. **No number without a time.** Any surface showing market figures states the
   as-at time and the delay, beside the figures.
5. **Absence is not zero.** A missing observation renders an em dash and its
   reason, never `0` and never `0%`.
6. **Entitlement is not a boolean.** `resolve(tier, family, action)` returns
   `granted | upgrade | request | unavailable`. An `upgrade` outcome names the
   tier that unlocks the action.
7. **The portal is the AFEX Intelligence Portal.** The internal short name
   never appears anywhere a customer can read it — titles, URLs, breadcrumbs,
   chart labels, export filenames.

## Reach for the component before building one

`Button` · `Badge` · `StatusPill` · `Input` · `Toast` · `Alert` · `Change` ·
`DataTable` · `Icon`.

`DataTable` already has saved views, search, sorting, pagination, selection,
row actions, density, number format, column visibility, the six data states,
locked values, flashing, skeletons and full screen. If a screen needs one of
those, it passes a prop.

`Toast` is for something that stops being true — a job queued, a row saved.
`Alert` is for something that stays true until it is fixed — a stale feed, a
failed reconciliation. A toast with no auto-dismiss is an alert in the wrong
place.

## Before opening a pull request

```bash
npx xds-eval .            # the rules a machine can decide
npx xds-eval . --rubric   # the twelve it cannot
```

The check exits 1 on any error-severity finding. A finding is fixed, not
silenced. Where a rule is genuinely wrong for one file, silence it with a
reason on the line above:

```js
// xds-eval-disable XDS-03 — this page is about the market plane itself
```

Then answer the rubric. For each of its twelve questions, state the answer and
the evidence — the file and line that makes it true. "Not applicable" is a
valid answer. "Looks fine" is not.

## Machine-readable

`npx xds-eval . --json` emits `{ findings: [{ id, severity, file, line,
evidence, rule, fix }], rubric: [...] }`, which is the shape to act on
directly.
