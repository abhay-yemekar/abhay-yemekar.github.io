# Contrast

Measured on 2026-10-21 in headless Chrome from the built site (`npm run preview`),
for the v3 tokens. Each value was read from the computed custom properties, not
from the CSS source, using WCAG 2.x relative luminance. The harness is
`a11y.mjs` in `C:\Playground\claude-work\portfolio\harness`.

The amber evidence wash is translucent (30% in light, 20% in dark), so it is
composited over the surface beneath it (`bg` or `bg-elev`) before the text on it
is measured.

Dark is the default theme. Light is the paper theme behind the toggle.

Text needs **4.5:1** (WCAG AA; 13px metadata gets no large-text exemption).
Non-text marks need **3:1**. Re-run after changing any token in
`src/styles/globals.css`.

| Pair | Light | Dark | Use |
|---|---|---|---|
| fg on bg | 16.11 | 17.10 | body text, headlines |
| fg on bg-elev | 17.28 | 16.05 | text in cards |
| fg on bg-2 | 14.77 | 16.41 | |
| fg on wash | 13.17 | 11.75 | the evidence clause |
| fg on wash over bg-elev | 13.88 | 10.59 | evidence in a card |
| fg-muted on bg | 7.94 | 8.67 | secondary text, ledes |
| fg-muted on bg-elev | 8.52 | 8.13 | |
| fg-muted on wash | 6.49 | 5.95 | metadata on a highlighted node |
| fg-muted on wash over bg-elev | 6.84 | 5.37 | |
| fg-subtle on bg | 5.91 | 5.76 | 13px metadata, `[ labels ]` |
| fg-subtle on bg-elev | 6.34 | **5.40** | lowest text pair in use |
| fg-subtle on bg-2 | 5.42 | 5.53 | |
| accent on bg | 5.81 | 10.77 | citations, trust patterns, metric values |
| accent on bg-elev | 6.23 | 10.10 | |
| accent on wash | 4.74 | 7.40 | |
| bg on fg | 16.11 | 17.10 | primary button (light pill) |
| bg on accent | 5.81 | 10.77 | primary button on hover |
| mark on bg *(non-text)* | 3.90 | 10.77 | underlines, active nav, trust path, progress line |
| ring on bg *(non-text)* | 5.81 | 10.77 | focus outline |

**Not allowed:**
- **`fg-subtle` on the evidence wash.** It measures 4.83 in light but **3.96 in
  dark** (3.57 over `bg-elev`), which fails AA. Highlighted elements use `fg` or
  `fg-muted`, and the Diagram component enforces this for highlighted nodes.
- **`bg` on `mark` as button text.** It measures 3.90 in light, so the button
  hover fills with `accent` instead.

`border-strong` (1.9:1) is decorative: card and preview edges, the arrow rings.
Every control that uses it is also identified by its text or icon.

**axe-core 4.14.0** (wcag2a/2aa/21a/21aa/22aa/best-practice):
- **Result:** 0 violations on all six pages (`/`, the four case studies,
  `404.html`) in both themes at 360 and 1280px, with the motion layer running.
- **Incomplete (`color-contrast`):** the items are text over a background axe
  can't resolve: the evidence clause (a background image), the film-grain
  overlay and the SVG diagram labels. The rows above cover all of them.
