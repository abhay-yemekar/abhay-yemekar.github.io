# abhayemekar.me

The portfolio of Abhay Yemekar, a full-stack AI engineer who builds AI systems
that show their work. Live at **[abhayemekar.me](https://abhayemekar.me)**.

It has a home page and four case studies, each a static HTML page. React renders
them at build time; the browser gets HTML, CSS, two fonts and about 1.4 kB of
JavaScript. No framework runtime, no analytics, no tracking.

## What's worth reading

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
- **[The design tokens](src/styles/globals.css).** Amber has one job: marking
  evidence. Every text pair is measured for contrast in both themes
  ([`docs/CONTRAST.md`](docs/CONTRAST.md)), and the font fallbacks are
  metric-matched so the font swap moves nothing.
- **[The budgets](scripts/check-budgets.mjs).** The build fails if a page goes
  over 10 kB of initial JS, 15 kB of CSS or 40 kB of HTML (gzip), or if the
  fonts total more than 130 KiB.

## Numbers

Measured on the production build (`npm run preview`, lighthouse@12, median of
three mobile runs), October 2026:

| | |
|---|---|
| Lighthouse, mobile, every page | 100 / 100 / 100 / 100 |
| Largest Contentful Paint | 1.66 s (simulated slow 4G) |
| Cumulative Layout Shift · Total Blocking Time | 0 · 0 ms |
| JavaScript per page | 1.4 kB gzip, plus a 1 kB explainer chunk where it's used |
| Fonts | 96 KiB (Newsreader + JetBrains Mono, latin subset) |
| axe-core 4.14 | 0 violations on every page, both themes, at 360px and 1280px |

## Stack

| | |
|---|---|
| Build | Vite 8, TypeScript 7 (strict) |
| Rendering | React 19, at build time only (`react-dom/static`) |
| Styling | Tailwind CSS v4 (CSS-first, no config file) |
| Motion | CSS only: scroll-driven evidence marks and View Transitions, off under reduced motion |
| Fonts | Newsreader, JetBrains Mono: self-hosted, latin subset, metric-matched fallbacks |
| Assets | favicons with `sharp`; share cards screenshotted by headless Chrome (`npm run gen:og`) |
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
src/components/    sections, the diagram, the HireLens explainer
src/client/        the only browser JS: theme toggle, nav marker, explainer
src/lib/           head tags, JSON-LD, todo(), the HireLens sample checks
src/entry-server.tsx  routes, prerender, sitemap, llms.txt, share-card copy
scripts/           prerender, budgets, share cards, favicons, HireLens sample
docs/              the audit, strategy, contrast table, copy review and screenshots
```

Editing copy means editing `src/data/*.ts`; no markup changes are needed.
`CLAUDE.md` holds the working conventions. `docs/` records how the site got
here, from the [audit](docs/AUDIT.md) through the
[strategy](docs/STRATEGY.md) to the [final report](docs/REPORT.md).

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: `npm ci`, then
`npm run build`, then upload the Pages artifact and deploy. Everything is plain
Node, so the Linux runner builds exactly what Windows does. The share cards and
favicons are committed, so CI needs neither a browser nor sharp.

## Reuse

The writing, case studies and images are mine; please don't reuse them as your
own. If something in the build setup is useful to you, take it.
