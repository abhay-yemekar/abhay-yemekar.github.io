# Contrast

Measured on 2026-10-14 in headless Chrome from the built site (`npm run preview`).
Each value was read from the computed custom properties on `<html>`, not from
the CSS source, with WCAG 2.x relative luminance. The amber evidence wash is
translucent (30% in light, 20% in dark), so it is composited over the surface
beneath it (`bg` or `bg-elev`) before the text on it is measured.

Text needs **4.5:1** (WCAG AA; 13px metadata gets no large-text exemption).
Non-text marks need **3:1**. Re-run after changing any token in
`src/styles/globals.css`.

| Pair | Light | Dark | Use |
|---|---|---|---|
| fg on bg | 16.11 | 15.43 | body text |
| fg on bg-elev | 17.28 | 14.22 | text in cards |
| fg on wash | 13.15 | 10.24 | the evidence clause |
| fg on wash over bg-elev | 13.86 | 9.20 | evidence in a card |
| fg-muted on bg | 7.94 | 8.46 | secondary text |
| fg-muted on bg-elev | 8.52 | 7.80 | |
| fg-muted on wash | 6.48 | 5.61 | metadata on a highlighted node |
| fg-muted on wash over bg-elev | 6.83 | 5.05 | |
| fg-subtle on bg | 5.91 | 5.94 | 13px metadata |
| fg-subtle on bg-elev | 6.34 | **5.48** | worst text pair in use |
| accent on bg | 5.81 | 10.26 | citation numerals, section numerals |
| accent on bg-elev | 6.23 | 9.46 | |
| bg on fg | 16.11 | 15.43 | primary button (ink fill) |
| mark on bg *(non-text)* | 3.90 | 10.26 | underlines, active nav, trust path |
| ring on bg *(non-text)* | 5.81 | 10.26 | focus outline |

**Not allowed:** `fg-subtle` on the evidence wash. It measures 4.82 in light but
**3.94 in dark** (3.54 over `bg-elev`), which fails AA. Highlighted elements use
`fg` or `fg-muted`. The Diagram component enforces this for highlighted nodes.

axe-core 4.14.0 (wcag2a/2aa/21a/21aa/22aa/best-practice) reports 0 violations on `/`
and `/work/hirelens/` in both themes at 360 and 1280px. Its `incomplete` items are
the evidence clause (a background-image it can't resolve) and SVG diagram labels.
Both are covered by the rows above.
