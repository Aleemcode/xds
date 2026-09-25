/**
 * The xDS conformance rules.
 *
 * Each rule is a regular expression run line by line over a product's source,
 * with the file patterns it applies to and the ones it forgives. A rule earns
 * its place here only if a machine can decide it; everything that needs
 * judgement lives in RUBRIC below and is answered by a reviewer — human or
 * agent — not by this file.
 *
 * severity:
 *   error  — ships a defect. The check exits 1.
 *   warn   — almost always wrong. Reported, does not fail the run.
 */

export const RULES = [
  {
    id: 'XDS-01',
    severity: 'error',
    title: 'Hard-coded colour',
    test: /#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*\d|\bhsla?\(\s*\d/,
    files: /\.(tsx?|jsx?|css|scss)$/,
    // A generated token file and the system's own colour maths are where the
    // hexes are supposed to live.
    exempt: /tokens\.css$|scales\.mjs$|color\.mjs$|tokens\.config\.mjs$/,
    rule: 'Colour enters a product through a semantic token, never as a literal.',
    fix: 'Replace with the token that names the job: var(--bg-raised), var(--text-muted), var(--border-strong).',
  },
  {
    id: 'XDS-02',
    severity: 'error',
    title: 'Raw scale step used as a token',
    // --main-9, --parasol-3, --success-11. The alpha steps (--main-a4) are public.
    test: /var\(\s*--(main|parasol|success|info|warning|error)-(?!a\d)\d{1,2}\b/,
    files: /\.(tsx?|jsx?|css|scss)$/,
    exempt: /tokens\.css$|\/packages\/tokens\//,
    rule: 'A scale step is an implementation detail. Products consume the semantic layer.',
    fix: 'Use the semantic token for the job — --bg-brand-solid, --border-success, --text-danger.',
  },
  {
    id: 'XDS-03',
    severity: 'error',
    title: 'Market direction colour outside Change',
    test: /var\(\s*--(text|bg|border)-(up|down|flat)\b|--flash-(up|down)/,
    files: /\.(tsx?|jsx?|css|scss)$/,
    exempt: /Change\.tsx$|DataTable\.tsx$|styles\.css$|tokens\.css$/,
    rule: 'Up and down separate by 6.7 under protanopia, which is only permissible beside a second encoding. Change renders a glyph and a sign unconditionally; nothing else does.',
    fix: 'Render <Change value={n} />, or carry your own non-colour encoding and state why.',
  },
  {
    id: 'XDS-04',
    severity: 'error',
    title: 'Brand colour on a data value',
    // A brand token inside something that is obviously a value cell or a figure.
    test: /(--(bg|text|border)-brand[a-z-]*)\s*[;)'"`].{0,80}\b(price|value|amount|quote|figure|delta|change)\b|\b(price|value|amount|quote|figure|delta)\b.{0,60}--(bg|text|border)-brand/i,
    files: /\.(tsx?|jsx?|css|scss)$/,
    exempt: /\/packages\/(tokens|react)\//,
    rule: 'AFEX brand red and a falling price are the same red — 5.3 apart in OKLab, 4.4 under deuteranopia. The planes are separated so the two never have to be told apart.',
    fix: 'A number is market plane or chart plane. Brand is for fills, primary actions and links.',
  },
  {
    id: 'XDS-05',
    severity: 'error',
    title: 'Icon imported from the vendor pack',
    test: /from\s+['"]iconsax-reactjs['"]/,
    files: /\.(tsx?|jsx?)$/,
    exempt: /\/packages\/react\/src\/icons\.tsx$/,
    rule: 'One file in the system names the icon vendor. That is what makes swapping it a one-file change.',
    fix: "import { Icon } from '@afex/xds-react' and use Icon.Up, Icon.Warehouse, Icon.Lock.",
  },
  {
    id: 'XDS-06',
    severity: 'error',
    title: 'Missing value defaulted to zero',
    test: /\?\?\s*0\b|\|\|\s*0\b/,
    files: /\.(tsx?|jsx?)$/,
    exempt: /\.test\.|\/packages\/tokens\//,
    rule: 'A zero in a price column is a price, and someone will trade on it. No observation is not zero.',
    fix: "Pass the cell's state — states={{ 'PRL:price': 'missing' }} — and let the table render the em dash and the reason.",
  },
  {
    id: 'XDS-07',
    severity: 'error',
    title: 'Entitlement resolved as a boolean',
    test: /\b(canAccess|hasAccess|isPro|isPremium|isPaid|isSubscribed|allowed)\b\s*(\?|&&|\)\s*\{)/,
    files: /\.(tsx?|jsx?)$/,
    rule: 'A boolean can only hide or show. It cannot tell a reader which tier unlocks the thing, or that the answer is request rather than buy.',
    fix: 'resolve(tier, family, action) returns granted | upgrade | request | unavailable. Branch on that.',
  },
  {
    id: 'XDS-08',
    severity: 'error',
    title: 'Market figures without provenance',
    // Match the whole element, then decide. A lookahead cannot do this: the
    // first `>` in a JSX table is inside an arrow function, not the tag.
    test: /<DataTable\b[\s\S]*?\/>/,
    assert: m => !/\bprovenance\s*=/.test(m),
    files: /\.(tsx?|jsx?)$/,
    multiline: true,
    rule: 'A number without an as-at time is not a market price.',
    fix: 'provenance="As at 14:32 WAT · delayed 15m".',
  },
  {
    id: 'XDS-09',
    severity: 'warn',
    title: 'Hard-coded spacing',
    // (?<!-) so border-left, border-top and friends are geometry, not spacing.
    test: /(?<!-)\b(padding|margin|gap|inset|top|right|bottom|left)(-[a-z]+)?\s*:\s*-?\d+px/,
    files: /\.(css|scss)$/,
    exempt: /tokens\.css$/,
    // Hairlines and optical nudges below the smallest rung are real.
    ignoreIf: /:\s*-?[0-3]px/,
    rule: 'Spacing comes from the scale so that two screens built by two teams line up.',
    fix: 'var(--space-2) … var(--space-9).',
  },
  {
    id: 'XDS-10',
    severity: 'warn',
    title: 'Literal colour set inline',
    test: /style=\{\{[^}]*\b(color|background|backgroundColor|borderColor|fill|stroke)\b[^}]*\}\}/,
    // An inline style that reads a token still switches theme and still audits.
    // What does not is a literal.
    assert: m => !/var\(\s*--/.test(m),
    files: /\.(tsx?|jsx?)$/,
    // The colour page paints the scales themselves; it has to name the hex.
    exempt: /ColorScales\.tsx$|Swatches\.tsx$|foundations\/color\/page\.tsx$/,
    rule: 'A literal colour set inline survives no theme switch and no audit.',
    fix: 'Move it to a class that reads a token, or pass the component its tone prop.',
  },
  {
    id: 'XDS-11',
    severity: 'warn',
    title: 'Transient surface carrying a persistent message',
    test: /toast\(\s*\{[^}]*duration:\s*0/,
    files: /\.(tsx?|jsx?)$/,
    multiline: true,
    rule: 'A message that is still true in a minute belongs on the page, not in a corner that disappears.',
    fix: '<Alert tone="…"> inline, where the condition is. Danger toasts already persist without asking.',
  },
  {
    id: 'XDS-12',
    severity: 'error',
    title: 'Colour alone carrying status',
    test: /<StatusPill(?![^>]*>[\s\S]{0,120}\S)/,
    files: /\.(tsx?|jsx?)$/,
    multiline: true,
    rule: 'The pill needs a label. Its dot is the second encoding, not the message.',
    fix: '<StatusPill tone="success">Active</StatusPill>.',
  },
];

/**
 * What a machine cannot decide.
 *
 * An agent answers each of these against the diff it is reviewing and states
 * the evidence. "Not applicable" is a valid answer; "looks fine" is not.
 */
export const RUBRIC = [
  {
    id: 'R-1',
    area: 'Planes',
    question: 'Does every colour in this change sit in the plane that owns it?',
    pass: 'Brand appears only on fills, primary actions and links. System appears only on success, info, warning and danger chrome. Market appears only on direction. Chart appears only on series.',
    fail: 'A brand red beside a price, a danger red on a falling value, a chart hue used for a status.',
  },
  {
    id: 'R-2',
    area: 'Second encoding',
    question: 'Can every meaning carried by colour also be read without it?',
    pass: 'Direction carries a glyph and a sign. Status carries a word. Series carry a label or a distinct lightness.',
    fail: 'A green dot alone, a red cell alone, a legend that is the only key to six hues.',
  },
  {
    id: 'R-3',
    area: 'Provenance',
    question: 'Does every figure on screen say when it was true?',
    pass: 'An as-at time and the delay sit with the figures and survive full screen.',
    fail: 'A price with no time, a delay disclosed only in a footnote or a tooltip.',
  },
  {
    id: 'R-4',
    area: 'Absence',
    question: 'Is every absent value distinguishable from a real zero, and does it say why?',
    pass: 'An em dash plus one of: no observation, outside coverage, stale with the true timestamp.',
    fail: 'A blank cell, a 0, a 0%, or an em dash with no reason.',
  },
  {
    id: 'R-5',
    area: 'Entitlement',
    question: 'Where access is refused, does the screen name the tier that grants it, and does that tier actually grant it?',
    pass: 'The upgrade outcome names a tier the resolver confirms unlocks that action.',
    fail: 'Upgrade to Enterprise beside something Enterprise does not unlock; a hidden control with no explanation.',
  },
  {
    id: 'R-6',
    area: 'Locked values',
    question: 'Are withheld values masked rather than removed?',
    pass: 'The shape of the value is visible and marked locked.',
    fail: 'The column is gone, so the reader cannot tell there is anything to buy.',
  },
  {
    id: 'R-7',
    area: 'Destructive actions',
    question: 'Is every destructive action tiered, separated and never first?',
    pass: 'Reversible actions are amber, irreversible ones red, both below the ordinary items.',
    fail: 'Delete at the top of a menu; delete and archive styled identically.',
  },
  {
    id: 'R-8',
    area: 'Motion',
    question: 'Does everything that moves stop under prefers-reduced-motion, without losing information?',
    pass: 'The wash is dropped; the value and the glyph still update.',
    fail: 'A change that is only announced by an animation.',
  },
  {
    id: 'R-9',
    area: 'Stability',
    question: 'Can a row move out from under the pointer?',
    pass: 'Re-sorting is deferred while the pointer is inside, or until the reader sorts deliberately.',
    fail: 'A live sort that reorders as data arrives.',
  },
  {
    id: 'R-10',
    area: 'Empty states',
    question: 'Do empty and no-results say different things?',
    pass: 'No-results names the query and offers the way back. Empty explains what would put something here.',
    fail: 'One message for both, or a blank area.',
  },
  {
    id: 'R-11',
    area: 'Contrast',
    question: 'Does every text-on-fill pair clear 4.5:1, in both themes?',
    pass: 'The generator’s --text-on-{role}-solid is used rather than an assumed white.',
    fail: 'White on a light-mode warning fill; a hand-picked ink.',
  },
  {
    id: 'R-12',
    area: 'Naming',
    question: 'Does anything customer-facing use an internal name?',
    pass: 'AFEX Intelligence Portal, in full, everywhere a customer can read it.',
    fail: 'An internal abbreviation in a title, a URL, a breadcrumb, a chart label or an export filename.',
  },
];
