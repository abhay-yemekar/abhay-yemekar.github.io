# abhayemekar.me

The portfolio of Abhay Yemekar, a full-stack AI engineer who builds AI systems
that show their work. Live at **[abhayemekar.me](https://abhayemekar.me)**.

It has a home page and four case studies, each a static HTML page. React renders
them at build time. The browser gets complete HTML, CSS, fonts and about 2 kB of
JavaScript. After first paint, a motion layer adds the rest: a WebGL particle
field, smooth scroll, choreographed reveals, page transitions and project films.
Everything still reads and works without it. No framework runtime, no
analytics, no tracking.

## What's worth reading

- **[The motion layer](src/client/motion/boot.ts)** is progressive enhancement
  done strictly:
  - The HTML is complete without it, and nothing is hidden by default.
  - It loads after first paint and only when `<html data-motion="on">`.
  - Reduced motion starts paused, with an explicit "Play motion".
  - Pause undoes all of it, every split, label and film included.
- **[The particle name](src/client/motion/hero-particles.ts).** OGL point
  sprites sample the name's real glyph outlines
  ([`scripts/gen-wordmark.py`](scripts/gen-wordmark.py)), flow in on curl
  noise and part for the cursor. The static form is the same outlines in SVG.
  They're paths, not `<text>`, so the `<h1>` stays the LCP element.

- **[The HireLens explainer](src/components/HireLensExplainer.tsx).** Real output
  from the HireLens production engine: one fictional resume, six criteria, each
  score tied to the exact characters it cites. The build fails if a quote isn't
  at its offsets ([`src/lib/hirelens.ts`](src/lib/hirelens.ts)), and
  [`scripts/hirelens-sample.mts`](scripts/hirelens-sample.mts) regenerates the
  data.
- **[Prerendering without a framework](src/entry-server.tsx).** `react-dom/static`
  renders each route at build time. The dev server runs the same function, so dev
  and production HTML are identical, and with no hydration there's no mismatch to
  debug.
- **[Missing facts can't ship](src/lib/todo.ts).** An unmeasured number or an
  unknown detail is a `todo()` in the data. It shows in development, is omitted
  from production, and is listed by every build.
- **[The design tokens](src/styles/globals.css).** Dark by default. Amber marks
  evidence and lights up on interaction, nothing else. Every text pair is
  measured for contrast in both themes
  ([`docs/CONTRAST.md`](docs/CONTRAST.md)), and the font fallbacks are
  metric-matched so the font swap moves nothing.
- **[The budgets](scripts/check-budgets.mjs).** The build fails if a page goes
  over any of these:
  - 10 kB of JS at page start
  - 85 kB of deferred motion JS
  - 15 kB of CSS
  - 40 kB of HTML
  - 400 kB of images (the worst case)

  It also fails if the fonts total more than 130 KiB.

## Numbers

Measured on the production build (`npm run preview`, lighthouse@12, median of
three runs), October 2026, v3:

| | |
|---|---|
| Lighthouse, mobile | 99 / 100 / 100 / 100 on every page |
| Lighthouse, desktop | 100 / 100 / 100 / 100 on every page |
| Largest Contentful Paint, mobile | 1.96–2.18 s (simulated slow 4G) |
| Cumulative Layout Shift · Total Blocking Time | 0 · 0 ms |
| Interaction latency, 4× CPU throttle | every interaction under 200 ms |
| Particle hero | 60 fps on an integrated GPU (Intel Iris Xe) |
| JavaScript | 2 kB at page start, 75 kB of motion after first paint |
| Fonts | 117 KiB (Instrument Sans, Instrument Serif Italic, JetBrains Mono; latin subset) |
| axe-core 4.14 | 0 violations on every page, both themes, at 360px and 1280px, motion running |

## Stack

| | |
|---|---|
| Build | Vite 8, TypeScript 7 (strict) |
| Rendering | React 19, at build time only (`react-dom/static`) |
| Styling | Tailwind CSS v4 (CSS-first, no config file) |
| Motion | GSAP (ScrollTrigger, SplitText, CustomEase), Lenis, OGL for the particle hero; cross-document View Transitions |
| Fonts | Instrument Sans, Instrument Serif Italic, JetBrains Mono: self-hosted, latin subset, metric-matched fallbacks |
| Assets | favicons and project media with `sharp` (`npm run gen:media`); share cards screenshotted by headless Chrome (`npm run gen:og`); the wordmark's outlines with fontTools |
| Deploy | GitHub Actions to GitHub Pages |

## Running it

Requires Node 22 or later.

```bash
npm install
npm run dev        # http://localhost:5173, rendered by the same code as production
```

```bash
npm run build      # typecheck → client build → SSR build → prerender → budget check
npm run preview    # serve dist/ on :4173
```

`npm run build` is the gate. A type error, an unfilled template marker, a
misplaced quote in the HireLens sample, or a page over budget all fail it, and
so fail the deploy.

## Structure

```
src/data/          all content as typed TS: profile, case studies, experience, capabilities
src/pages/         HomePage, CaseStudyPage, NotFoundPage
src/components/    sections, the wordmark, the diagram, case-page media, the HireLens explainer
src/client/        the only browser JS: theme and motion toggles, nav marker, clock, explainer
src/client/motion/ the motion layer, loaded after first paint
src/lib/           head tags, JSON-LD, todo(), the HireLens sample checks
src/entry-server.tsx  routes, prerender, sitemap, llms.txt, share-card copy
scripts/           prerender, budgets, share cards, favicons, media, wordmark outlines, HireLens sample
docs/              the audit, strategy, contrast table, copy review, screenshots and media captures
```

Editing copy means editing `src/data/*.ts`; no markup changes are needed.
`CLAUDE.md` holds the working conventions. `docs/` records how the site got
here, from the [audit](docs/AUDIT.md) through the
[strategy](docs/STRATEGY.md) and the [v2 report](docs/REPORT.md) to the
[v3 redesign](docs/V3-REPORT.md).

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: `npm ci`, then
`npm run build`, then upload the Pages artifact and deploy. Everything is plain
Node, so the Linux runner builds exactly what Windows does. The share cards,
favicons and media are committed, so CI needs neither a browser nor sharp. Pull
requests into `main` run the same build as a check, without deploying.

## Reuse

The writing, case studies and images are mine; please don't reuse them as your
own. If something in the build setup is useful to you, take it.
