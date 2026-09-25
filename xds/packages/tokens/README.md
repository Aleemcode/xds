# AFEX Design System — tokens

Generated colour, type, spacing and density tokens for africaexchange.com and the
AFEX Intelligence Portal. One theme, both surfaces.

```
npm run tokens     # node generate.mjs  -> tokens.css
npm run audit      # node audit.mjs     -> exits 1 on any failure
```

No dependencies. Node 18+.

## What to import

```css
@import "./tokens.css";
```

That is the whole integration. `tokens.css` declares every token on bare `:root`,
redefines the colour tokens under `@media (prefers-color-scheme: dark)` guarded by
`:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]` so an
explicit toggle wins in both directions. Nothing is introduced only inside a theme
block — that is the bug that makes an artifact render one theme's text on the
other theme's ground, and the audit checks for it.

## The rule that makes this work

**Four planes, and a plane never lends its colours out.**

| Plane | Owns | Never |
|---|---|---|
| Brand | fills, primary actions, links | a data value |
| System | success / info / warning / danger chrome | a price |
| Market | up / down / flat | a button or a toast |
| Chart | series identity | a status or a direction |

This is what resolves the problem that a red brand creates on a market product.
`Main-9` (#E1261C) and `Error-9` (#E5484D) are 5.3 apart in OKLab — far below the
15 a full-colour reader needs to tell two things apart. No amount of palette
tuning fixes that. Separating the *contexts* does: a brand red never appears in a
data cell, a market red never appears on a button, so the two never have to be
distinguished.

## Files

| File | Role |
|---|---|
| `tokens.config.mjs` | **The system.** Roles, ladders, market pairs, chart palette, type, spacing, gates. Edit this. |
| `scales.mjs` | Raw scale values transcribed from the published design system, with provenance notes. |
| `color.mjs` | OKLab distance, WCAG contrast, colour-vision simulation. No dependencies. |
| `generate.mjs` | Config → `tokens.css`. |
| `audit.mjs` | The gate. Run it in CI. |
| `tokens.css` | **Generated. Do not edit.** |

## Naming

`{property}-{role}-{prominence}-{state}`

The neutral role drops its name, because it is the default: `--bg-page`,
`--text-primary`, `--border`. Everything else carries it: `--bg-brand-solid`,
`--text-success`, `--border-down`.

Roles get a *ladder* — which scale step fills which semantic rung — so the
grammar cannot drift. 139 tokens come out of about 120 lines of config. The
previous hand-authored set had four `text-warning-*` tokens living inside the
Information group, duplicating Text/Warning while Information had no text tokens
at all. That class of bug is now unrepresentable.

## Things the generator does that you should know about

**It snaps a fill that cannot carry its own label.** A solid at step 9 that can't
reach 4.5:1 with either white or near-black ink is walked up the scale until one
can, and the substitution is printed. Four fills snapped in this build:

```
success/light: 9 -> 10 (#00834D)     error/light: 9 -> 11 (#CE2C31)
success/dark:  9 -> 10 (#00814F)     error/dark:  9 -> 10 (#EC5D5E)
```

It also emits the ink alongside each fill as `--text-on-{role}-solid`, so nobody
has to guess whether a button label is white or black. In dark mode three of the
four would have failed with the usual white-on-solid assumption.

**The market pair is measured, not chosen.** Down reuses the Error scale; up uses
Success. The pairs:

| | up | down | separation | note |
|---|---|---|---|---|
| light | `#00814F` | `#CE2C31` | 6.7 | requires the glyph — see below |
| dark | `#64D199` | `#E5484D` | 13.6 | replaces a pair scoring 4.4 |

The light pair sits in the 6–8 band, which is only legal where a second,
non-colour encoding is present. The table standard already makes the triangle and
the explicit sign mandatory on every change cell, so the condition holds by
construction — **but it means `--text-up` and `--text-down` may not be used
without them.** That constraint travels with the token.

`[data-market-contrast="high"]` swaps in a pair scoring 16.5 (light) and 25.4
(dark). The cost is that the down colour reads as oxblood rather than red.

**The chart palette is six, and six is a ceiling.** With a red brand, four status
hues and a green/red market pair reserved, only the arc from 204° to 330° is
free — cyan through blue to magenta. Hue alone carries at most two series there,
because that arc is exactly what dichromats compress. So the six separate on
lightness as well as hue: worst pair 8.5, worst against any data-carrying
reserved colour 9.2.

For more series than six — eight commodities on one axis, say — **do not add a
seventh colour.** Highlight one series and grey the rest with `--chart-muted`, or
facet into small multiples. That is what a market terminal does anyway.

## What is deliberately not in here

The **X-Additional scales** (Bronze, Cyan, Purple, Jade, Tomato, Ruby, Pink,
Amber, and the never-supplied Mint and Sky). They do not satisfy the step
contract. Each one's light column is a dark scale printed in reverse, so step 1
is a mid-tint
around lightness 90 rather than an app background, and none of the step meanings
survive. Two consequences worth naming:

- **Ruby's entire dark scale is byte-identical to Error's.** In dark mode a Ruby
  series and an error state are the same colour.
- **Amber is Warning under another name.** Amber light step 4 and Warning dark
  step 9 are both `#FFC53D`.

They are kept in `scales.mjs` for the audit and excluded from the generated
system. The chart palette replaces them.

## Open gaps

Named here rather than silently defaulted:

- Mint and Sky scales never supplied; Cyan's dark column never supplied.
- The type scale is **proposed, not confirmed** — a 1.2 minor third from 16px.
- Switzer's tabular-figures test is outstanding, so the numeric face is
  unresolved. `--font-numeric` falls through to a stack that is tabular on every
  platform, so nothing breaks while the decision is open.
- Switzer is under the **ITF Free Font License, not MIT**. Bundling and
  modification rights need a legal look before shipping.
- Elevation, motion and focus-ring styling are not here. Those are expressive
  decisions and they wait for the moodboard.

## CI

```yaml
- run: node audit.mjs --quiet
```

Fails the build on any contrast or colour-vision regression. A design system that
isn't checked by a machine goes wrong quietly, and colour is the part humans are
worst at checking by eye.
