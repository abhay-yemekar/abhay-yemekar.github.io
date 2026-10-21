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
npm run gen:media    # regenerate public/media/<slug>/ posters and previews (sharp)
python scripts/gen-wordmark.py   # regenerate src/data/wordmark.ts (fontTools, not a project dep)
```

There is no test suite and no linter. `npm run build` is the gate. It fails on a
type error, on an unfilled template marker, and on a page over its weight budget
(`scripts/check-budgets.mjs`). Any of those fails the deploy. The budgets:
- **Initial JS:** 10 kB.
- **Motion layer:** 85 kB of deferred JS, of which 20 kB for the particle chunk.
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
- `a11y.mjs`: axe, layout, keyboard, contrast, motion toggle, no-JS
- `checks-v3.mjs`
- `protoshots.mjs`: screenshots with motion on
- `lh.mjs`: Lighthouse, 3 runs plus the median

Results go to `runs/<date>-<label>/`. Pull requests into `main` run the same
`npm run build` gate (`.github/workflows/check.yml`).

## Stack

- **Vite 8** + **React 19** + **TypeScript 7** (strict). React renders at **build
  time only**: no React reaches the browser.
- **Tailwind CSS v4** via `@tailwindcss/vite`, CSS-first, with no
  `tailwind.config.js`.
- **Motion (v3, approved 2026-10-16):** GSAP 3.15 (ScrollTrigger, SplitText,
  CustomEase), Lenis smooth scroll and OGL for the WebGL hero. All of it loads after
  first paint from `src/client/motion/`; see Motion.
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
plain TypeScript: the theme and motion toggles, the nav's current-section marker,
and the Pune clock. Two more pieces load on demand:
- **The HireLens explainer** (`src/client/explainer.ts`, about 1 kB), only on
  pages that carry it.
- **The motion layer** (`src/client/motion/`, about 74 kB with GSAP, Lenis and
  OGL), after first paint, only when `<html data-motion="on">`.

Interactive behaviour goes in `src/client/` as small enhancers keyed on `data-*`
attributes. Pages must work fully without them. If something ever needs real
client state, hydrate that one component with `hydrateRoot`. Don't bring React
back for the whole page.

Never read `window`, `document` or `localStorage` in a component. Components run
in Node.

## Layout

```
src/data/          all content; editing these needs no markup changes
                   (media.ts = project posters; wordmark.ts is generated)
src/pages/         HomePage, CaseStudyPage, NotFoundPage
src/components/    sections plus Nav, SectionShell, Wordmark, MotionToggle, Poster, CaseMedia, Diagram, LinkRow, TodoMark, Icons
src/client/        the only browser JS: main, theme, motion-toggle, clock, active-section, explainer
src/client/motion/ the motion layer: boot, smooth-scroll, reveals, films, nav-hide, scramble, cursor, magnetic, work-preview, hero-particles
src/lib/           head.ts (per-page meta), todo.ts (placeholder mechanism)
src/styles/        globals.css (tokens) + fonts.css (@font-face + fallbacks) + motion.css
scripts/           prerender, check-budgets, gen-og, gen-assets, gen-media, gen-wordmark.py, hirelens-sample.mts
public/            site.webmanifest, favicons, og/*.png, media/<slug>/ (generated); robots.txt and CNAME come from the prerender
index.html         the template: static head tags, inline head script, markers
docs/              brief, audit, strategy, contrast table, mockups, screenshots, media-src (captures)
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

### Design tokens (v3 "Cinematic")

Colours are CSS custom properties in `src/styles/globals.css`, bridged to Tailwind
through `@theme inline`. Use the semantic utilities (`bg-bg-elev`,
`text-fg-muted`, `border-border`, `stroke-mark`, `fill-wash`), never raw hex in
components.

- **Palette:** a near-black canvas (`bg` #0a0a0a), warm off-white text and one
  amber, with a static film-grain overlay (`body::after`). The v2 paper palette
  lives on as the light theme.
- **Type tokens:**
  - `text-display`: the hero h1
  - `text-title`: case-study h1s
  - `text-h2`: section headings at display size
  - `text-work`: project names in the index
  - `text-h3`, `text-lede`
  - `.u-meta`: mono metadata
  - `.u-label`: the bracketed mono label `[ 01 ]`
- **Contrast:** every text pair in use clears WCAG AA (4.5:1) in both themes, and
  the non-text marks clear 3:1. The measured table is `docs/CONTRAST.md`. If you
  change a token, re-measure from computed styles in the browser (claude-work
  `a11y.mjs`). On the evidence wash use `fg` or `fg-muted` only.
- **Smallest text:** 13px (`.u-meta`), including `.u-cite` on phones.

**Amber marks evidence, and lights up on interaction.** It's allowed for:
- **Evidence:**
  - the evidence wash and underline (`.u-evidence`)
  - citation numerals (`.u-cite`)
  - link underlines (`.u-link`)
  - the active-nav underline
  - the diagram's trust path
  - each project's trust pattern line
  - measured metric values (a number on the page is evidence too)
- **Feedback:**
  - the primary button's hover fill and glow
  - the cursor ring over links
  - the reading-progress hairline
- **The hero:** about 6% of the particles

Nothing else. Use no amber fills except the evidence wash (≤ 30% opacity) and the
button hover. Use no gradients. The primary button (`.u-btn`) is a light pill:
`fg` fill and `bg` text. On hover it takes the `accent` fill (not `mark`, so its
text keeps AA in the light theme) and the `glow`.

**Headlines:** Instrument Sans condensed (`font-stretch: 80%`, weight 600). The
accent clause is Instrument Serif Italic (`.u-accent`): in the hero it's the
evidence clause, "show their work".

**Diagram grammar** (`Diagram.tsx`, typed specs in `caseStudies.ts`): dashed = LLM
step, solid = deterministic code, pill = data, amber = the trust path. The SVG
shows from 1280px, where its smallest label renders at 13px. Below that, the same
nodes render as a stacked list.

### Theme

**Dark is the designed default, whatever the OS says** (v3). The particles, glow
and media are tuned for black. The light theme applies only when the visitor
chooses it with the toggle: the inline head script reads `localStorage.theme`
and sets `data-theme`. `src/client/theme.ts` writes storage **only on click**.
The toggle is a pressed/unpressed "Dark theme" button and stays hidden without
JS. The particle field re-reads the colour tokens on a theme change. It blends
additively on dark and normally on paper.

### Motion

**A progressive-enhancement animation layer.** The HTML is complete without it,
and nothing is hidden unless the thing that reveals it is certain to run.

The inline head script in `index.html` sets two things before first paint:
- **`data-motion="on" | "paused"`.** Under `prefers-reduced-motion` the page
  starts `paused`, unless the visitor pressed "Play motion" (stored as
  `localStorage.motion = "on"`). An explicit choice beats the OS default in both
  directions.
- **`.intro`** on the first page of a session, when motion is on.

How the pieces fit:
- **The intro is CSS keyframes** (`motion.css`, `data-intro="rise|drift|settle|line|wordmark"`).
  They always end visible, and any key or click ends them.
  - The `<h1>` and the lede only move (`settle`, `drift`) and never fade: either
    can be the LCP element (the lede is, on phones).
- **The JS layer** (`src/client/motion/boot.ts`) loads after `load` plus idle:
  - Lenis (mouse and trackpad only, with a hand-rolled anchor and focus handler)
  - SplitText line reveals (`[data-split]`) and block reveals (`[data-reveal]`)
  - the cursor ring and the magnetic CTA
  - the work-index hover previews (≥1024px, mouse)
  - the particle field (its own chunk)

  `stop()` reverts all of it.
- **The particle field** samples the name's glyph outlines (`Wordmark.tsx`, from
  `scripts/gen-wordmark.py`).
  - **Static form:** a dot-filled SVG, kept as the fallback. It's paths, not
    `<text>`, because Chrome counts SVG text as an LCP candidate.
  - **Points:** 18k on desktop, 6k on phones. The device pixel ratio is capped at
    1.5 (desktop) and 1.25 (phones).
  - **Frame rate:** paused off screen; about 30 fps once settled.
  - **Skipped** when data saver is on, on fewer than 4 CPU cores, or when WebGL is
    unavailable.
- **Scroll choreography** (`motion/reveals.ts`, all inside one `gsap.context`):
  - `[data-split]` headings rise line by line out of masks (SplitText,
    `aria: 'auto'`). Use it only on elements without links inside.
  - `[data-reveal]` blocks rise and fade.
  - `[data-words]`: the About lede's words, which are build-time inline spans,
    light up in order, once. Never scrub opacity to the scroll position: text
    left half-lit fails contrast.
  - `[data-chars]`: the aria-hidden footer name rises letter by letter.
  - `[data-scramble-in]`: mono indices resolve out of random glyphs.
  - `svg[data-diagram]`: nodes pop in, then edges draw (`pathLength=1`), each
    arrowhead returning as its line lands.
- **Nav** (`motion/nav-hide.ts`): hides on scroll down and returns on scroll up.
  It never hides near the top or with focus inside it. Nav labels
  (`[data-scramble]`) scramble on hover, and their link carries a stable
  `aria-label`.
- **Page transitions:** cross-document View Transitions. A project's name
  (`.vt` + `vt(slug)` from `src/lib/view-transition.ts`, on an inline-block)
  morphs from the work index, the 404 list or a "Next" link into the case-study
  title. Names apply only under `html[data-motion='on']`. When paused, the root
  swaps without animating.
- **Media** (`src/data/media.ts`, built by `npm run gen:media`):
  - **Posters:** decorative, `alt=""`.
  - **Hover previews:** the work index, on hover only.
  - **Case-page films:** in each case study's "In the product" section. The
    HTML carries the film's still with real alt text. `motion/films.ts` fades
    the animated WebP over it only while it's in view (and never with data
    saver on), and removes it when it scrolls away or motion is paused.
  - **Stills:** 16:10, `[data-wipe]`.

  Captions state only what the media shows.
- **The HireLens showcase** on the home page (`[data-showcase]`) scales from
  0.86 to 1 with the scroll. It's a transform only, never opacity, so the text
  stays legible wherever the scroll stops.
- **Evidence marks** in the explainer (`.evidence-mark`) sweep their wash in
  as a criterion is chosen. This is CSS, and the final state is the same
  without it.
- **"Pause motion" / "Play motion"** (`MotionToggle.tsx`, WCAG 2.2.2) sits in the
  hero and in each case-study header, since the films loop. It starts and stops
  the layer live and stores the choice.
- **No count-ups:** metric values are evidence, so they never animate through
  numbers that weren't measured.
- **GSAP and CSS never share an element's transform.** GSAP folds the CSS
  `scale`/`translate` properties into its own transform, so GSAP moves an outer
  element and CSS sizes the inner one (see the cursor and the preview card).

Easings are `--ease-entrance`, `--ease-hover` and `--ease-expo`, with durations
150/250/500ms. The global reduce rule in `globals.css` collapses transitions,
unless the visitor opted in with "Play motion".

### Fonts

`src/styles/fonts.css` declares the faces by hand, latin subset only, 117 KiB in
total (budget 130):
- **Instrument Sans** (the wdth file: width 75–100%, weight 400–700; 57 KB).
  It's declared twice over the same file: `Instrument Sans Variable` for text and
  `Instrument Sans Display` for condensed headlines, so each gets its own fallback.
- **Instrument Serif Italic** (22 KB): the accent clause.
- **JetBrains Mono** (40 KB): labels and metadata.

Don't import the Fontsource index CSS: it ships subsets this site never renders.
The latin range has no arrow glyphs, so arrows are SVG (`Icons.tsx`).

Each face has a metric-matched local fallback (`size-adjust`, `ascent-override`)
measured in Chrome on 2026-10-16, so the swap causes no layout shift.

`vite.config.ts` preloads Instrument Sans and Instrument Serif Italic, the two
faces in the hero h1. It has to be a plugin because Vite content-hashes font
filenames.

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
- **Never run `git push` on your own initiative.** By default, hand the owner the
  command. When he explicitly asks you to push, run it in his Terminal panel,
  never in a background shell, so any SSH passphrase prompt reaches him. A push
  to `main` deploys the live site. v3 work goes through draft PR #1
  (`redesign/cinematic` → `main`).
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
`npm ci` → `npm run build` gate, with no deploy. Big changes (the v3 redesign)
go through a draft PR and ship by merging it.
