# Switzer

Drop the Switzer web files here and the whole site picks them up — the
`@font-face` rules in `app/globals.css` already point at these exact names.

    Switzer-Variable.woff2
    Switzer-Variable-Italic.woff2

Get them from Fontshare: https://www.fontshare.com/fonts/switzer

Two things worth knowing before you do.

**The licence is the ITF Free Font License, not MIT.** It permits free
commercial use but has its own terms on redistribution and modification. Self-
hosting the file in a public repo is redistribution. Worth ten minutes of legal
time before this repo goes public.

**Until the files are here, the typography page says so.** It checks
`document.fonts.check` at runtime and tells the reader whether they are looking
at real Switzer or a fallback, rather than quietly showing the wrong thing. That
is also what makes the tabular-figures test trustworthy — a test that silently
measures the fallback is worse than no test.
