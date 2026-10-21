# v3 report: the cinematic redesign

v2 (October 2026, [`REPORT.md`](REPORT.md)) got the content, the engineering
and the accessibility right, but read as a document. v3 keeps all of that and
rebuilds the visual and motion layer: a dark canvas, condensed display type
with a serif-italic accent, the name as a WebGL particle field, choreographed
scroll, page transitions and project media.

It ran in five phases on `redesign/cinematic` from 2026-10-16 to 2026-10-21,
through draft PR #1. Every number below was measured on the production build
(`npm run build && npm run preview`) unless it says otherwise.

## v2 → v3

| | v2 | v3 |
|---|---|---|
| Lighthouse mobile, median of 3 | 100 / 100 / 100 / 100 on every page | **99 / 100 / 100 / 100 on every page** |
| Lighthouse desktop | 100 × 4 | **100 / 100 / 100 / 100 on every page** |
| LCP, mobile (simulated slow 4G) | 1.65–1.66 s | 1.96 s on `/` (the h1); 2.04–2.18 s on case studies (the header poster) |
| CLS · TBT | 0 · 0 ms | **0 · 0 ms** |
| Interaction latency, 4× CPU throttle | criterion 14–49 ms, blind review 10–43, theme 52–182 | criterion 31–177, blind review 14–53, theme 22–149, pause/play 5–150 |
| JavaScript at page start (gzip) | 1.4 kB | 1.95 kB |
| JavaScript after first paint | 0.5 kB explainer chunk | 75.0 kB in 3 chunks (budget 85), of which 16.3 kB for the particle chunk |
| CSS (gzip) | 7.0 kB | 9.8 kB |
| Fonts | 96.2 KiB (Newsreader, JetBrains Mono) | 117.1 KiB (Instrument Sans, Instrument Serif Italic, JetBrains Mono) |
| Images per page, worst case | 0 | 111 kB on `/`, 51–68 kB per case study (budget 400) |
| Particle hero frame rate | — | 60 fps, p95 16.9 ms, on Intel Iris Xe at 1440 and 1920@2x |
| axe-core 4.14 | 0 violations | **0 violations**: 6 pages × 2 themes × 360 / 1280 px, motion running |
| Lowest text contrast | 5.48:1 | 5.37:1 dark, 4.74:1 light, every pair AA ([table](CONTRAST.md)) |
| Content | — | every line of v2's text is still on the page, titles are identical, and the JSON-LD is a superset |

## The phases

| Phase | Commits | What it did |
|---|---|---|
| 1. Prototype | `bd28600` | Dark tokens, Instrument type, the particle name, the work index with hover previews, Lenis, the cursor, Pause/Play motion |
| — | `0b9f56f`, `8c1bdf9` | The PR build check; `CLAUDE.md` rewritten for v3; the domain made one constant |
| 2. Design rollout | `021686f`, `a3c454b`, `6cb44e6` | Every section, the case studies and the 404 restyled; ydirect.tech linked; share cards and contrast table redone |
| 3. Motion everywhere | `d6eed34` | Cross-document page transitions, diagram draw, nav hide and show, reveals |
| 4. Media | `0d8449b` | "In the product" films and stills on every case study, the HireLens showcase, the image budget |
| 5. Quality and release | this commit | The checks below, fixes they found, docs |

Screenshots: [`v3-phase-1`](screenshots/v3-phase-1/) through
[`v3-phase-4`](screenshots/v3-phase-4/), and [`v3-final`](screenshots/v3-final/)
at 390 / 768 / 1440 / 1920.

## How it's built so that nothing depends on the motion

- **The HTML is complete without JavaScript.** Every word is in the prerendered
  page, nothing is hidden by default, and the motion layer only adds.
- **The motion layer** (GSAP with ScrollTrigger, SplitText and CustomEase;
  Lenis; OGL) loads after `load` plus idle, and only when
  `<html data-motion="on">`.
- **Reduced motion starts paused.** "Play motion" is an explicit opt-in, stored
  either way.
- **"Pause motion"** sits in the hero and in every case-study header (WCAG
  2.2.2). It undoes everything the layer did.
- **LCP:** the `<h1>` (or, on phones, the lede) is the LCP element and is never
  faded. The giant name is SVG paths, not text, because Chrome counts SVG text
  as an LCP candidate.

## Fixes the checks found in Phase 5

- **Without WebGL, OGL's renderer threw an uncaught error** before its own "no
  context" check could run. The page already fell back correctly, but it
  logged. The particle module now probes WebGL on a scratch canvas first, and a
  failing particle chunk can no longer abort the rest of the layer.
- **"Pause motion" took about 205 ms at 4× CPU throttle,** because it tore the
  whole layer down inside the click. The layer now starts and stops after the
  next frame paints, which brought it to 41–150 ms.
- **The theme toggle took 216–458 ms at 4×.** Re-styling every element is the
  whole cost: style recalculation was 80–220 ms and layout about 0, with motion
  on or off. The button now answers first and the theme lands one frame later,
  which brought it to 22–149 ms. The next theme is read from the button, so a
  quick double-click can't act on the not-yet-applied one.
- **The particle field redrew inside the theme click.** Its recolour now
  happens after the switch paints.

Fixes found in earlier phases:
- **Phase 1:** SVG `<text>` was an LCP candidate, so the wordmark became paths.
  The lede faded during the intro and was the phone LCP element, so now it only
  moves. The light theme's button hover was 3.9:1, so it uses `accent`.
- **Phase 3:** a scroll-scrubbed word reveal left text at 1.5:1 wherever the
  reader stopped, so it now plays once.

## Robustness

| Condition | Result |
|---|---|
| No JavaScript | All content visible; no element hidden; the motion and theme controls hidden |
| Reduced motion | Starts paused, with no intro and no smooth scroll; "Play motion" opts in |
| No WebGL | The dot-matrix wordmark stays; no errors |
| 2 CPU cores | No particles; the rest of the layer runs |
| Data saver | No particles and no films |
| Paused | Every split, label, transition name and film reverted |

## Decisions, with the alternative each beat

- **Dark by default, whatever the OS says.** The particles, glow and media are
  tuned for black. The paper palette stays as the light theme, by choice only.
- **Reduced motion means paused, not motion-free forever.** An explicit "Play
  motion" beats the OS default, because the owner's own Windows had
  animations off.
- **Films are animated WebP over a still with real alt text, not autoplay
  video.** They work without JS, stop with Pause, and stay out of the page
  weight.
- **No number count-ups.** Metric values are evidence and never show numbers
  that weren't measured.
- **View Transitions** carry a project's name from the index into its case
  study. Names apply only with motion on. There's no SPA router, and the pages
  stay plain HTML.
- **Media from the live products.** ForecastGPT's and yDirect's sites showed
  the current product better than the repos' screenshots. Each capture is kept
  in `docs/media-src` with its date.

## Needs your input

1. **Check it on your phone.** Open the LAN preview on the same Wi-Fi, scroll
   every section, open a case study, and try Pause and Play.
2. **Release:** mark PR #1 ready and merge it. Merging deploys v3 to
   abhayemekar.me. Then tag it:
   `git tag -a v3.0.0 -m "v3: the cinematic redesign" && git push origin v3.0.0`.
3. **Optional:** create the free `abhayemekar` GitHub organisation so the site
   can later move to `abhayemekar.github.io`, and verify `abhayemekar.me` under
   GitHub → Settings → Pages (verified domains).
