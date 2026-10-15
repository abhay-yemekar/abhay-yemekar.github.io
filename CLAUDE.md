# CLAUDE.md

Personal portfolio for Abhay Yemekar. A home page plus one static page per case
study, prerendered at build time and deployed to GitHub Pages at the apex domain
`abhayemekar.me`. The overhaul plan is `docs/PORTFOLIO_BRIEF.md`. Decisions so
far are in `docs/AUDIT.md` and `docs/STRATEGY.md`.

## Commands

```bash
npm run dev          # Vite on :5173; pages rendered per request by src/entry-server.tsx
npm run build        # typecheck → client build → SSR build → prerender → budget check
npm run preview      # serve dist/ on :4173 (production check)
npm run typecheck    # tsc --noEmit alone
npm run gen:assets   # regenerate the favicons from the SVG monogram (sharp)
npm run gen:og       # regenerate public/og/*.png share cards (headless Chrome, real fonts)
```

There is no test suite and no linter. `npm run build` is the gate. It fails on a
type error, on an unfilled template marker, and on a page over its weight budget
(`scripts/check-budgets.mjs`). Any of those fails the deploy.

Audits, run against `npm run preview`:

```bash
npx lighthouse@12 http://localhost:4173/ --chrome-flags="--headless=new --no-sandbox"
```

Add `--preset=desktop` for the desktop pass. Run 3 times and take the median. Both
form factors must stay at 95+ in all four categories. Don't pass `--preset=perf`:
it isn't a real preset and silently produces junk numbers.

## Stack

- **Vite 8** + **React 19** + **TypeScript 7** (strict). React renders at **build
  time only**: no React reaches the browser.
- **Tailwind CSS v4** via `@tailwindcss/vite`, CSS-first, with no
  `tailwind.config.js`.
- No animation library. Motion is CSS (see Motion).
- **sharp** (devDep) for offline asset generation.
- No router, no CMS, no analytics, no tracking. Content lives in typed TS files.

## Rendering

`src/entry-server.tsx` owns the routes: `/`, `/work/<slug>/` per entry in
`src/data/caseStudies.ts`, and `404.html`. It renders each one with `react-dom/static`
`prerender()` into `index.html`, replacing `<!--app-head-->` and
`<!--app-html-->`.

- **Build:** `scripts/prerender.mjs` writes `dist/<route>/index.html` and
  `dist/404.html`. It also generates `sitemap.xml` and `llms.txt` from the same
  data, and prints any TODOs.
- **Dev:** the `render-in-dev` plugin in `vite.config.ts` runs the same function
  per request. Dev and prod HTML are identical. Editing a TSX file reloads the
  page, since there is no client component to hot-swap.

The browser gets HTML, CSS, fonts and `src/client/main.ts`, about 1 kB gzip of
plain TypeScript: the theme toggle and the nav's current-section marker. On pages
with the HireLens explainer, `main.ts` also imports `src/client/explainer.ts`
(about 1 kB) on demand.
Interactive behaviour goes in `src/client/` as small enhancers keyed on `data-*`
attributes. Pages must work fully without them. If something ever needs real
client state, hydrate that one component with `hydrateRoot`. Don't bring React
back for the whole page.

Never read `window`, `document` or `localStorage` in a component. Components run
in Node.

## Layout

```
src/data/          all content; editing these needs no markup changes
src/pages/         HomePage, CaseStudyPage
src/components/    sections plus Nav, SectionShell, Diagram, LinkRow, TodoMark, Icons
src/client/        the only browser JS: theme.ts, active-section.ts
src/lib/           head.ts (per-page meta), todo.ts (placeholder mechanism)
src/styles/        globals.css (tokens) + fonts.css (@font-face + fallbacks)
scripts/           prerender.mjs, check-budgets.mjs, gen-og.mjs, gen-assets.mjs, hirelens-sample.mts
public/            CNAME, robots.txt, site.webmanifest, favicons, og/*.png (generated)
index.html         the template: static head tags, inline theme script, markers
docs/              brief, audit, strategy, contrast table, mockups, screenshots
```

**Content changes belong in `src/data/*.ts`.** That split is the point of the
architecture: copy, projects, case studies and credentials are data, not JSX.

## Conventions

### The HireLens explainer

`HireLensExplainer.tsx` and `HeroEvidence.tsx` render real HireLens output from
`src/data/hirelens-sample.json`: one fictional resume, scored by the production
engine through the public demo. Provenance travels inside the JSON.

- `src/lib/hirelens.ts` checks every quote against its offsets at build time, and
  the build fails if one is off.
- Regenerate the sample with `scripts/hirelens-sample.mts` (usage is in its
  header). Never hand-edit scores or rationales.
- The prerendered markup holds every criterion and both the clear and the blind
  resume. The script only switches which is shown, so without JS the first
  criterion shows with all evidence underlined.

### Missing facts: `todo()`

Never invent a metric or a detail. Put `todo('what is needed')` in the data. It
renders as a dashed chip in `npm run dev`, is left out of production HTML, and is
listed as a warning by the prerender. A field that can be missing is typed
`string | Todo`. Render it through `TodoMark` / `isTodo`.

### Design tokens ("Evidence", docs/STRATEGY.md)

Colours are CSS custom properties in `src/styles/globals.css`, bridged to Tailwind
through `@theme inline`. Use the semantic utilities (`bg-bg-elev`,
`text-fg-muted`, `border-border`, `stroke-mark`, `fill-wash`), never raw hex in
components. Type sizes are tokens too (`text-display`, `text-h2`, `text-lede`,
`.u-meta`).

- **Contrast:** every text pair clears WCAG AA (4.5:1) in both themes, and the
  non-text marks clear 3:1. The measured table is `docs/CONTRAST.md`. If you
  change a token, re-measure from computed styles in the browser.
- **Smallest text:** 13px (`.u-meta`).

**Amber marks evidence.** It's allowed for:
- the evidence wash and underline (`.u-evidence`)
- citation numerals (`.u-cite`)
- link underlines (`.u-link`)
- the active-nav underline
- the diagram's trust path
- section numerals
- measured metric values (a number on the page is evidence too)

Nothing else. No amber fills except the evidence wash (≤ 30% opacity), and no
gradients. The primary button is an ink fill (`.u-btn`).

**Diagram grammar** (`Diagram.tsx`, typed specs in `caseStudies.ts`): dashed = LLM
step, solid = deterministic code, pill = data, amber = the trust path. The SVG
shows from 1280px, where its smallest label renders at 13px. Below that, the same
nodes render as a stacked list.

### Theme

CSS decides by default: `prefers-color-scheme`, live. The inline script in
`index.html` only applies a theme the visitor chose with the toggle
(`localStorage.theme`), and adds `.js` to `<html>`. `src/client/theme.ts` writes
storage **only on click**. Persisting on load would pin a first-time visitor to
their OS setting from that day. The toggle is a pressed/unpressed "Dark theme"
button and stays hidden without JS.

### Motion

**"Mark, don't move."** No entrance animations, and nothing on the LCP element.
Motion is limited to:
- evidence marks drawing on scroll (CSS scroll-driven animation inside
  `@supports`; static where unsupported)
- hover and focus transitions
- cross-document View Transitions

Easings are `--ease-entrance` and `--ease-hover`, with durations 150/250/500ms. All
motion sits under `prefers-reduced-motion: no-preference`, backed by a global
reduce rule.

### Fonts

`src/styles/fonts.css` declares the faces by hand, latin subset only:
- **Newsreader** (wght-only file, 58 KB; the opsz file is 132 KB per style)
- **JetBrains Mono**

Don't import the Fontsource index CSS: it ships subsets this site never renders.
The latin range has no arrow glyphs, so arrows are SVG (`Icons.tsx`).

Each face has a metric-matched local fallback (`size-adjust`, `ascent-override`)
measured in Chrome, so the swap causes no layout shift. Newsreader gets two
fallback faces, because it's wider at 500 than at 400.

`vite.config.ts` preloads the Newsreader face. It has to be a plugin because Vite
content-hashes font filenames.

### SEO and sharing

- **Per-page tags** (title, description ≤ 160 characters, canonical, OG,
  Twitter) come from `src/lib/head.ts`.
- **JSON-LD** comes from `src/lib/structured-data.ts`: Person, WebSite and
  ProfilePage on the home page; SoftwareSourceCode or SoftwareApplication plus a
  BreadcrumbList on each case study. Structured data repeats only what the page
  says, with no ratings and no counts.
- **Share cards:** the copy is `ogCards` in the entry. After changing a title,
  run `npm run gen:og` and commit the PNGs.

### Accessibility

- Semantic sectioning elements and exactly one `<h1>` per page.
- A skip link as the first focusable node.
- A visible `:focus-visible` outline on everything interactive.
- Standalone links and buttons are 44px tap targets (`.u-tap`, `.u-btn`).
- External links carry `target="_blank" rel="noopener noreferrer"`; the mailto
  link does not.

## Hard constraints

These are the owner's rules, not preferences.

- **Never commit a phone number or home address**: not in source, markup, meta,
  OG tags, JSON-LD, or commit messages. Public contact is the `mailto:` link only.
  **One exception, chosen by the owner on 2026-10-15:** his phone number may appear
  inside `public/resume.pdf` (his own resume, served as-is), knowing it stays in the
  public git history. It must never be copied into a page, meta tag, JSON-LD or
  commit message. Before replacing the PDF, check it for a home address.
  The JSON-LD `PostalAddress` is city-level (Pune / Maharashtra / IN) on purpose:
  no `streetAddress`, no `postalCode`, no `telephone`.
- **Never link to or copy anything from the private `inksl_ay` repo.** It is
  yDirect's real source. The public `abhay-yemekar/ydirect` repo is docs/product
  only and must stay labelled "source private".
- **Never run `git push`.** Hand the owner the command; they run it, since it needs
  their SSH passphrase.
- **No AI attribution in commits or PRs:** no `Co-Authored-By` trailer and no
  "Generated with" line.
- Git identity is set with `--local` only, never `--global`.
- The remote uses the `github-personal` SSH alias, never plain `github.com`. The
  default host resolves to a work identity on this machine.
- No invented projects or metrics. Numbers on the site are measured or absent.
- No analytics or tracking.
- `profile.resumeUrl` points at `public/resume.pdf`, Abhay's own resume. Set it back
  to `null` if the file is removed, so the link can never 404. Don't generate or
  edit the resume's content.
- Ask before adding a dependency (`docs/PORTFOLIO_BRIEF.md`, hard rule 5).

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`: `npm ci` →
`npm run build` → `upload-pages-artifact` → `deploy-pages`. The build includes the
prerender and the budget check, all plain Node, so it runs the same on the Linux
runner. Pages source is set to GitHub Actions. `base` is `/` because the site is
served from an apex domain, and `public/CNAME` carries the domain into the
artifact.
