# CLAUDE.md

Personal portfolio for Abhay Yemekar. A home page plus one static page per case
study, prerendered at build time and deployed to GitHub Pages at the apex domain
`abhayemekar.me`. The overhaul plan is `docs/PORTFOLIO_BRIEF.md`. Decisions so
far are in `docs/AUDIT.md` and `docs/STRATEGY.md`. The current design is v4
("Readable"): `docs/V4-PLAN.md` holds its decisions and `docs/V4-REPORT.md` its
measurements.

## Commands

```bash
npm run dev          # Vite on :5173; pages rendered per request by src/entry-server.tsx
npm run build        # typecheck → client build → SSR build → prerender → budget check
npm run preview      # serve dist/ on :4173 (production check)
npm run typecheck    # tsc --noEmit alone
npm run gen:assets   # regenerate the favicons from the SVG monogram (sharp)
npm run gen:og       # regenerate public/og/*.png share cards (headless Chrome, real fonts)
npm run gen:media    # regenerate public/media/<slug>/ posters and previews (sharp)
```

There is no test suite and no linter. `npm run build` is the gate. It fails on a
type error, on an unfilled template marker, and on a page over its weight budget
(`scripts/check-budgets.mjs`). Any of those fails the deploy. The budgets:
- **Initial JS:** 10 kB.
- **Deferred JS:** 10 kB for every chunk loaded after first paint together
  (the explainer, the films, the motion layer).
- **CSS:** 15 kB. **HTML:** 40 kB.
- **Fonts:** 130 KiB.
- **Images:** 400 kB per page, counted as the largest AVIF of every picture.
  Films and previews load on demand and aren't counted.

Audits, run against `npm run preview`:

```bash
npx lighthouse@12 http://localhost:4173/ --chrome-flags="--headless=new --no-sandbox"
```

Add `--preset=desktop` for the desktop pass. Run 3 times and take the median. Both
form factors must stay at 95+ in all four categories. Don't pass `--preset=perf`:
it isn't a real preset and silently produces junk numbers.

The CDP harnesses live outside the repo in `C:\Playground\claude-work\portfolio\harness`
(see its README):
- `axe-quick.mjs`: axe on given paths at 360 and 1280 in both themes
- `v4contrast.mjs`: token contrast from computed styles, both themes, plus the
  no-JS check
- `lh.mjs`: Lighthouse, 3 runs plus the median
- `inp.mjs`: click to next frame at 4× CPU throttle, plus Event Timing
- `v4motion.mjs`: reveals end visible, diagram arrowheads, film buttons, with
  motion on and under reduced motion
- `content-diff.mjs`: every line of the live site's text still present locally
  (`LOOSE=1` ignores CSS case and `[ ]`)
- `v4shots.mjs`, `v4header.mjs`, `v4section.mjs`, `fullpages.mjs`: first-screen
  shots, the header at phone widths, one section, full-page tiles
- `sitecap.mjs`, `site-scroll.mjs`: capture a live site (scroll film, stills)
- `a11y.mjs`, `fps.mjs`, `robust.mjs`, `phase3-check.mjs`, `phase4-check.mjs`:
  the v3 checks, kept for the record (they expect the retired motion toggle
  and particle hero)

Headless Chrome can't decode VP9 WebM, so the yDirect hover preview only plays
in a real browser. Under Git Bash, prefix harness runs with `MSYS_NO_PATHCONV=1`,
or a path argument like `/` turns into a Windows path.

Results go to `runs/<date>-<label>/`. Pull requests into `main` run the same
`npm run build` gate (`.github/workflows/check.yml`).

## Stack

- **Vite 8** + **React 19** + **TypeScript 7** (strict). React renders at **build
  time only**: no React reaches the browser.
- **Tailwind CSS v4** via `@tailwindcss/vite`, CSS-first, with no
  `tailwind.config.js`.
- **Motion (v4):** CSS transitions plus a few small TypeScript enhancers. No
  animation library: GSAP, Lenis and OGL were removed with v3's cinematic layer.
- **sharp** (devDep) for offline asset generation.
- No router, no CMS, no analytics, no tracking. Content lives in typed TS files.

## Rendering

`src/entry-server.tsx` owns the routes: `/`, `/work/<slug>/` per entry in
`src/data/caseStudies.ts`, and `404.html`. It renders each one with `react-dom/static`
`prerender()` into `index.html`, replacing `<!--app-head-->` and
`<!--app-html-->`.

- **Build:** `scripts/prerender.mjs` writes `dist/<route>/index.html` and
  `dist/404.html`. It also generates `sitemap.xml`, `llms.txt`, `robots.txt` and
  `CNAME` from the same data, and prints any TODOs.
- **Dev:** the `render-in-dev` plugin in `vite.config.ts` runs the same function
  per request. Dev and prod HTML are identical. Editing a TSX file reloads the
  page, since there is no client component to hot-swap.

The browser gets HTML, CSS, fonts and `src/client/main.ts`, about 2 kB gzip of
plain TypeScript: the theme toggle, the nav's current-section marker, and a fix
that stops a clicked new-tab link keeping its focus ring. Three more pieces load
on demand, about 2 kB together:
- **The HireLens explainer** (`src/client/explainer.ts`), only on pages that
  carry it.
- **The films** (`src/client/films.ts`), only on case pages with a film.
- **The motion layer** (`src/client/motion/`: reveals and card previews), after
  first paint, only when `<html data-motion="on">`.

Interactive behaviour goes in `src/client/` as small enhancers keyed on `data-*`
attributes. Pages must work fully without them. If something ever needs real
client state, hydrate that one component with `hydrateRoot`. Don't bring React
back for the whole page.

Never read `window`, `document` or `localStorage` in a component. Components run
in Node.

## Layout

```
src/data/          all content; editing these needs no markup changes
                   (media.ts = project posters and films; education.ts = schools)
src/pages/         HomePage, CaseStudyPage, NotFoundPage
src/components/    sections plus Nav, ProfileLinks, SectionShell, Poster, CaseMedia, Diagram, LinkRow, TodoMark, Icons
src/client/        the only browser JS: main, theme, active-section, explainer, films
src/client/motion/ the motion layer: boot, reveals, work-preview
src/lib/           head.ts (per-page meta), todo.ts (placeholder mechanism)
src/styles/        globals.css (tokens) + fonts.css (@font-face + fallbacks) + motion.css
scripts/           prerender, check-budgets, gen-og, gen-assets, gen-media, hirelens-sample.mts
public/            site.webmanifest, favicons, og/*.png, media/<slug>/ (generated); robots.txt and CNAME come from the prerender
index.html         the template: static head tags, inline head script, markers
docs/              brief, audit, strategy, v4 plan and report, contrast table, mockups, screenshots, media-src (captures)
```

**Content changes belong in `src/data/*.ts`.** That split is the point of the
architecture: copy, projects, case studies and education are data, not JSX.

The home page order is hero, About, Projects (the four case studies as cards,
then "More projects"), Experience, Education, Skills, then the footer, which is
also the page's `#contact`. The ids live in `src/data/sections.ts`; Projects
keeps the id `work` so old `/#work` links still land.

## Conventions

### The HireLens explainer

`HireLensExplainer.tsx` renders real HireLens output from
`src/data/hirelens-sample.json` on the HireLens case page: one fictional resume,
scored by the production engine through the public demo. Provenance travels
inside the JSON.

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

### Design tokens (v4 "Readable")

Colours are CSS custom properties in `src/styles/globals.css`, bridged to Tailwind
through `@theme inline`. Use the semantic utilities (`bg-bg-elev`,
`text-fg-muted`, `border-border`, `stroke-mark`, `fill-wash`), never raw hex in
components.

- **Palette (A, "paper and signal orange"):** warm paper (`bg` #faf8f3), warm ink
  (`fg` #171412) and one orange (`accent` #b4410c for text, `mark` #e85d14 for
  lines). Dark is the same palette inverted, behind the toggle. No grain, no
  gradients.
- **Type tokens:**
  - `text-display`: the hero's role, the largest text on the page (40–68px)
  - `text-title`: case-study h1s (36–60px)
  - `text-h2`: section headings (28–36px)
  - `text-work`: project names on the cards (24–28px)
  - `text-name`: roles, schools, skill labels (20–22px)
  - `text-section`, `text-h3`, `text-lede`
  - `.u-meta`: 14px sans metadata (dates, counts, tags)
  - `.u-label`: a 14px medium label; no brackets, no capitals
- **Contrast:** every text pair in use clears WCAG AA (4.5:1) in both themes, and
  the non-text marks clear 3:1. The measured table is `docs/CONTRAST.md`. If you
  change a token, re-measure from computed styles in the browser (claude-work
  `v4contrast.mjs`). On the evidence wash use `fg` or `fg-muted` only.
- **Smallest text:** 14px (`.u-meta`). The diagram's SVG labels render at 13px
  from 1280px, where the SVG shows.

**Orange marks evidence, and lights up on interaction.** It's allowed for:
- **Evidence:**
  - the evidence wash and underline (`.u-evidence`)
  - link underlines (`.u-link`)
  - the active-nav underline
  - the diagram's trust path
  - each project's trust pattern line
  - measured metric values (a number on the page is evidence too)
- **Feedback:**
  - the primary button's hover fill and glow
  - the focus ring (`ring`)
  - the reading-progress hairline

Nothing else. Use no orange fills except the evidence wash (≤ 30% opacity) and the
button hover. The primary button (`.u-btn`) is an ink pill: `fg` fill and `bg`
text, with `.u-btn--ghost` as its outlined twin. On hover it takes the `accent`
fill (not `mark`, so its text keeps AA) and the `glow`.

**Headings:** Instrument Sans at normal width, weight 600. The accent clause is
Instrument Serif Italic (`.u-accent`): the footer's "interesting problems." and
the 404's "no evidence".

**Diagram grammar** (`Diagram.tsx`, typed specs in `caseStudies.ts`): dashed = LLM
step, solid = deterministic code, pill = data, orange = the trust path. The SVG
shows from 1280px, where its smallest label renders at 13px. Below that, the same
nodes render as a stacked list.

### Header and profile links

The sticky header (`Nav.tsx`) never hides. From 640px it carries Projects,
Experience and About; it always carries GitHub and LinkedIn as round icon
buttons (`.u-icon-btn`) and the resume as an outlined pill (`.u-pill-link` /
`.u-pill`), from `ProfileLinks.tsx`. Each draws its focus ring on its own shape,
not on the 44px tap target. The theme toggle sits in the header from 640px and in
the footer below that, because the header has to fit in 320px.

### Theme

**Light is the default, whatever the OS says** (v4). The dark theme applies only
when the visitor chooses it with the toggle: the inline head script reads
`localStorage.theme` and sets `data-theme`. `src/client/theme.ts` writes storage
**only on click**. The toggle is a pressed/unpressed "Dark theme" button and stays
hidden without JS.

### Motion

**A small progressive enhancement.** The HTML is complete without it, and nothing
is hidden unless the thing that reveals it is certain to run.

The inline head script in `index.html` sets `data-motion="on" | "paused"` before
first paint, from the OS setting only: `prefers-reduced-motion` means paused.
`main.ts` follows the setting if it changes while the page is open. There is no
site-wide motion toggle.

How the pieces fit:
- **Reveals** (`motion/reveals.ts` + `motion.css`): `[data-reveal]` blocks and
  `[data-split]` headings rise and fade once; `[data-wipe]` media frames open
  upward; `svg[data-diagram]` nodes pop in, then the edges draw
  (`pathLength=1`), each arrowhead returning as its line lands. Only elements
  below the fold get `.is-pending`, and only while transitions are switched off,
  so nothing animates out first.
- **Card previews** (`motion/work-preview.ts`): with a mouse, hovering a project
  card plays its moving preview inside the card's own poster frame.
- **Films** (`src/client/films.ts`, not in the motion layer): each case page's
  "In the product" film has its own **Pause film / Play film** button (WCAG
  2.2.2). A playing film runs only while on screen: the animated WebP fades over
  the still that carries the real alt text, and is removed when it scrolls away.
  Films start playing when motion is on and data saver is off; otherwise they
  start paused and the visitor can play one.
- **Page transitions:** cross-document View Transitions. A project's name (`.vt`
  + `vt(slug)` from `src/lib/view-transition.ts`, on an inline-block) morphs from
  its card, the 404 list or the "Next case study" card into the case-study title.
  Names apply only under `html[data-motion='on']`.
- **Evidence marks** in the explainer (`.evidence-mark`) sweep their wash in as a
  criterion is chosen. This is CSS, and the final state is the same without it.
- **No count-ups:** metric values are evidence, so they never animate through
  numbers that weren't measured.

Easings are `--ease-entrance`, `--ease-hover` and `--ease-expo`, with durations
150/250/500ms. Under `prefers-reduced-motion` the global rule in `globals.css`
collapses every transition and animation.

### Fonts

`src/styles/fonts.css` declares the faces by hand, latin subset only, 117 KiB in
total (budget 130):
- **Instrument Sans** (the wdth file, weight 400–700; 57 KB): text and headings.
- **Instrument Serif Italic** (22 KB): the accent clause.
- **JetBrains Mono** (40 KB): code-like text only (the explainer, the diagram).
  A page downloads only the faces it renders, so the home page needs no mono.

Don't import the Fontsource index CSS: it ships subsets this site never renders.
The latin range has no arrow glyphs, so arrows are SVG (`Icons.tsx`).

Each face has a metric-matched local fallback (`size-adjust`, `ascent-override`)
measured in Chrome on 2026-10-16, so the swap causes no layout shift.

`vite.config.ts` preloads Instrument Sans, the face of the hero's `<h1>` (the LCP
element). It has to be a plugin because Vite content-hashes font filenames.

### SEO and sharing

- **Per-page tags** (title, description ≤ 160 characters, canonical, OG,
  Twitter) come from `src/lib/head.ts`.
- **JSON-LD** comes from `src/lib/structured-data.ts`: Person, WebSite and
  ProfilePage on the home page; SoftwareSourceCode or SoftwareApplication plus a
  BreadcrumbList on each case study. Structured data repeats only what the page
  says, with no ratings and no counts.
- **Share cards:** the copy is `ogCards` in the entry. After changing a title,
  run `npm run gen:og` and commit the PNGs.
- The hero's `<h1>` reads "Abhay Yemekar, Full-stack AI Engineer": the name is a
  screen-reader-only span, because the header already shows it.

### Accessibility

- Semantic sectioning elements and exactly one `<h1>` per page.
- A skip link as the first focusable node.
- A visible `:focus-visible` outline on everything interactive. A mouse click on a
  new-tab link drops its focus (`main.ts`), so the ring doesn't reappear when the
  visitor comes back; keyboard activation keeps it.
- Standalone links and buttons are 44px tap targets (`.u-tap`, `.u-btn`,
  `.u-icon-btn`, `.u-pill-link`).
- External links carry `target="_blank" rel="noopener noreferrer"`; the mailto
  link does not. The resume opens in a new tab.

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
- **Never run `git push` on your own initiative.** By default, hand the owner the
  command. When he explicitly asks you to push, run it in his Terminal panel,
  never in a background shell, so any SSH passphrase prompt reaches him. A push
  to `main` deploys the live site, so larger changes go through a PR into `main`
  (v3 shipped through PR #1 from `redesign/cinematic`, v4 through a PR from
  `redesign/v4-readable`).
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
served from the root of a domain. That's the apex abhayemekar.me today, and it
would equally be `abhay-yemekar.github.io`, which redirects there while the
custom domain is set. The address is one constant, `profile.siteUrl`. The
prerender derives the canonical URLs, sitemap, `robots.txt`, `llms.txt` and
`CNAME` from it. To drop the custom domain:
1. Set `siteUrl` to the github.io address.
2. Remove the domain in the repo's Pages settings.
3. Run `npm run gen:og`.

Pull requests into `main` run `.github/workflows/check.yml`: the same
`npm ci` → `npm run build` gate, with no deploy. Big changes (the v3 and v4
redesigns) go through a draft PR and ship by merging it.
