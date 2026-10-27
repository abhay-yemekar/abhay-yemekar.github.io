# Contrast

Measured on 2026-10-27 in headless Chrome from the built site (`npm run preview`),
for the v4 tokens (palette A, "paper and signal orange"). Each value was read
from the computed custom properties, not from the CSS source, using WCAG 2.x
relative luminance. The harness is `v4contrast.mjs` in
`C:\Playground\claude-work\portfolio\harness`.

The orange evidence wash is translucent (18% in light, 22% in dark), so it is
composited over the surface beneath it (`bg` or `bg-elev`) before the text on it
is measured.

Light is the default theme. Dark is the same palette behind the toggle.

Text needs **4.5:1** (WCAG AA; 14px metadata gets no large-text exemption).
Non-text marks need **3:1**. Re-run after changing any token in
`src/styles/globals.css`.

| Pair | Light | Dark | Use |
|---|---|---|---|
| fg on bg | 17.28 | 16.46 | body text, headings |
| fg on bg-elev | 18.34 | 15.17 | text in cards |
| fg on wash | 14.38 | 11.60 | the evidence clause, the chosen criterion |
| fg on wash over bg-elev | 15.15 | 10.51 | evidence in a card |
| fg-muted on bg | 8.52 | 8.98 | secondary text, ledes |
| fg-muted on bg-elev | 9.05 | 8.28 | |
| fg-muted on wash | 7.10 | 6.33 | quotes in the explainer, highlighted diagram nodes |
| fg-muted on wash over bg-elev | 7.47 | 5.73 | |
| fg-subtle on bg | 5.68 | 6.21 | 14px metadata, labels |
| fg-subtle on bg-elev | 6.03 | **5.73** | metadata in cards; lowest dark pair in use |
| accent on bg | **5.34** | 8.08 | trust patterns, metric values; lowest pair in use |
| accent on bg-elev | 5.67 | 7.45 | |
| bg on fg | 17.28 | 16.46 | primary button (ink pill) |
| bg on accent | 5.34 | 8.08 | primary button on hover |
| mark on bg *(non-text)* | 3.29 | 7.26 | underlines, active nav, trust path, progress line |
| mark on bg-elev *(non-text)* | 3.50 | 6.69 | link underlines in cards |
| ring on bg *(non-text)* | 5.34 | 8.08 | focus outline |

**Not allowed** (and not used anywhere):
- **`fg-subtle` on the evidence wash.** 4.73 in light, but **4.38 in dark**
  (3.96 over `bg-elev`), which fails AA. Washed elements use `fg` or `fg-muted`,
  and the Diagram component enforces this for highlighted nodes.
- **`accent` on the evidence wash.** **4.45 in light** (4.69 over `bg-elev`),
  which fails AA. Orange text never sits on the wash.
- **`bg-2`** is defined but unused (`fg-subtle` on it is 5.25, `accent` 4.94 in
  light). Re-measure before using it for text.

`border-strong` (1.86:1 light, 1.98:1 dark) is decorative: card edges, the pill
outlines and the arrow rings. Every control that uses it is also identified by
its text or icon, and its focus ring is `ring`.

**axe-core 4.14.0** (wcag2a/2aa/21a/21aa/22aa/best-practice):
- **Result:** 0 violations on all six pages (`/`, the four case studies,
  `404.html`) in both themes at 360 and 1280px, with the motion layer running.
- **No JS:** no text hidden on `/` or a case page at 1280 or 390, and the theme
  toggle and film buttons stay hidden.
