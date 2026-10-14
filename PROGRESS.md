# PROGRESS

Append-only build log. Newest entry at the bottom. Plain markdown on purpose — it
should stay readable in any editor, on GitHub, or as raw text.

---

## 2026-08-25 — Pass one: design system and sitemap

**What changed.** Explored the ground truth before designing anything, and several
findings changed the brief:

- `abhay-yemekar.github.io` already existed, holding only `CNAME` (= `abhayemekar.me`)
  and a placeholder `README.md`, with Pages live. So the site deploys into that repo
  rather than a new one — no domain conflict, no downtime, `base: '/'` correct.
- Namecheap DNS was already correct: apex resolves to all four GitHub IPs, `www` is
  a CNAME alias. No DNS work needed.
- HTTPS for `abhayemekar.me` was **not** provisioned — `SEC_E_WRONG_PRINCIPAL`, the
  certificate was never issued. This is the one genuinely outstanding infra task.
- `gh` CLI is not installed on this machine, so `gh repo create` was moot anyway.
- yDirect's real source lives in a **private** repo. The public `ydirect` repo is
  docs/product only. Read the private one to describe the architecture accurately,
  then linked and quoted nothing from it.
- SearchScribe's current README is far stronger than the brief described (Next.js
  App Router + FastAPI, PostgreSQL, Argon2id, rotating refresh cookies with theft
  detection, nh3 sanitization, 55 backend tests, Playwright). Used the accurate
  version — it's the best engineering story on the site.
- ForecastGPT's stack confirmed from `requirements.txt` rather than assumed.
- Two projects that the brief said had no repo links do have them.
- `ydirect.tech` does not resolve, so it stays off the site.

Design system settled as "Ink & Amber": editorial, warm, one amber accent confined
to a short list of named places, dark default with a light toggle. Eight sections on
a single anchor-scrolled page. Full token table, type scale and motion spec recorded
in the plan document.

**Why.** The brief's audience gives the page 15–30 seconds, across four different
role searches. One repeating layout motif (a 160px left rail with a mono index and
label) used eight times is what makes it read as designed rather than assembled, and
restraint on the accent is what keeps it from looking like a template.

**Next.** Scaffold and build all eight sections.

**Open questions.** Resume PDF — the CTA stays hidden until one exists at
`public/resume.pdf`. Whether the live SearchScribe deploy runs the current Next.js
build or an older one.

---

## 2026-08-25 — Build: scaffold through all eight sections

**What changed.** Vite 8 + React 19 + TypeScript 7 strict + Tailwind v4 + `motion`
v13. GSAP not installed. Content lives entirely in `src/data/*.ts`; components hold
no copy. All eight sections built and responsive, plus `Nav`, `Reveal`,
`SectionShell`, `ThemeToggle`, `useTheme`, `useActiveSection`. Favicons and the
1200×630 OG card generated offline by `scripts/gen-assets.mjs`. Actions workflow,
`CNAME`, `robots.txt`, `sitemap.xml`, `404.html`, webmanifest all in place.

Things that went wrong and how they were fixed:

- **TS2882** on the `globals.css` side-effect import — TypeScript 7 needs
  `src/vite-env.d.ts` with the Vite client reference.
- **Fonts shipped every subset.** The `@fontsource*` packages have no per-subset
  CSS, so importing their index files pulled cyrillic, greek and vietnamese —
  ~430KB. Replaced with four hand-authored `@font-face` rules using Fontsource's own
  latin `unicode-range`. 430KB → 128KB.
- **OG card rendered the sans line in a mono face.** sharp rasterises SVG through
  librsvg, which resolves only fonts installed on the machine and maps every generic
  family to the same default. Embedded base64 `@font-face` is ignored too. Switched
  to named Windows fonts and documented the limitation in the script.
- **`fg-subtle` failed WCAG AA.** Measured 3.23–3.66:1 (dark) and 3.68–3.98:1
  (light) on 11–12px metadata, which gets no large-text exemption. Darkened light to
  `#6b6862`, lightened dark to `#8b8680`. All 26 pairs now pass, worst case 4.71:1.
- **Scroll-spy decided from one IntersectionObserver batch.** IO reports only what
  *changed*, so a batch containing a single "left the band" entry had nothing to pick
  from and the highlight landed on the wrong section. Rewrote `useActiveSection` to
  keep an `inBand` map across callbacks.
- **Footer was inside `<main>`.** Moved out so it is a body-level landmark.
- A comment claimed the copyright year was baked in at build time. It is not — the
  page is not prerendered, so it is the visitor's clock. Comment corrected.

**Why.** The typed-data split means every future content edit is a one-file change
with no markup churn, which is the whole point of skipping a CMS.

**Next.** Audits.

---

## 2026-08-25 — Verification: axe clean, Lighthouse 95+ both form factors

**What changed.** axe-core 4.13 over wcag2a/2aa/21a/21aa/best-practice: **0
violations, 35 passes**. Two `incomplete` colour-contrast nodes, both footer micro
text, flagged only because axe could not resolve the stacking to determine a
background — those pairs measure 5.45:1 (dark) and 5.1:1 (light), so they pass.

Lighthouse first reported **performance 41** on mobile, with FCP 5.7s, LCP 5.9s and
TBT 1790ms. That was a measurement artifact: I had passed `--preset=perf`, which is
not a real Lighthouse preset, and it produced junk throttling. A clean run scored
**94**. Recording this because the bogus numbers sent me looking for a layout
pathology that did not exist.

The real gap was FCP 2.3s / LCP 2.5s, and LCP was **100% render delay** — nothing
paints until React boots, so the hero `<h1>` does not exist and its font is not even
requested until ~2.2s. Two fixes:

1. **Preload the hero font.** A small Vite plugin injects the `<link rel="preload">`
   at build time, because Vite content-hashes font filenames and the hash is only
   known once the bundle is emitted. Only that one face is preloaded — every extra
   preload competes with the JS bundle for bandwidth. LCP 2.5s → 2.3s, and CLS
   dropped 0.045 → 0.015 as the font-swap shift disappeared.
2. **Trim motion.** Components now import `m` from `motion/react-m` under
   `<LazyMotion features={domAnimation} strict>`. `domAnimation` covers animations,
   gestures and `whileInView` but drops drag and layout projection, neither of which
   this site uses. Bundle 110.18 → 98.68 kB gzip.

Verified `whileInView` still fires after the swap by pulling Lighthouse's full-page
screenshot (a real compositing browser, unlike the preview pane) and measuring ink
coverage across 26 horizontal bands of the 13,166px page — every band had content,
so nothing was stranded at `opacity: 0`.

Final: **mobile 96 / 100 / 100 / 100**, **desktop 100 / 100 / 100 / 100**.

**Privacy gate passed.** No phone patterns, `tel:` hrefs, or street/address tokens
in source, `dist/`, or git history. JSON-LD `PostalAddress` is city-level only —
no `streetAddress`, `postalCode` or `telephone`. Contact is the `mailto:` link.

**Why the flag mattered.** Worth remembering that an invalid Lighthouse preset fails
open rather than erroring, so it silently reports numbers that look like a real
regression.

**Next.** First commit, then deploy and fix HTTPS.

**Open questions.** Still waiting on the resume PDF and on whether the live
SearchScribe deploy is the current build. Neither blocks the deploy.

---

## 2026-08-25 — Committed, ready to push

**What changed.** Eight scoped commits on top of the repo's existing two, so the
push is a plain fast-forward with no unrelated histories and no force-push:
scaffold → styles → data → hooks → sections → head/assets → CI → docs.

Added `.gitattributes` pinning `* text=auto eol=lf`. This machine has
`core.autocrlf=true` globally, which stores LF and checks out CRLF — the right
outcome, but it depends on a machine-level setting, so a clone elsewhere would
commit different bytes. Two components had been rewritten with CRLF by an
earlier scripted edit; the attributes file normalised them on the way in.

`.claude/settings.local.json` is now gitignored — it is per-machine permission
state. `.claude/launch.json` stays committed, since it is shared preview config.

Verified before committing: `tsc --noEmit` clean, build clean at 98.68 kB gzip,
`dist/` untracked, privacy gate re-run across all eight new commits (the only
hits are the docs *describing* the constraint — no phone number, no address, no
`streetAddress`/`postalCode`/`telephone` keys anywhere).

Reduced motion and focus were verified structurally rather than by hand, because
the preview pane in this environment does not composite: a global
`prefers-reduced-motion` rule clamps animation and transition durations to
0.01ms, the three animated components each branch on `useReducedMotion()`, and a
bare `:focus-visible` rule gives every focusable element a 2px amber outline at
3px offset in both themes. A physical keyboard pass is still worth doing once the
site is live.

**Why the git split.** Eight commits rather than one because the history is the
only place a future reader can see *why* each piece is shaped the way it is —
the font subsetting, the IntersectionObserver rewrite, the `LazyMotion` scope.
Only the final commit yields a building tree, which is normal for an initial
import and not worth contorting the split to avoid.

**Next.** Push (Abhay runs it — needs the SSH passphrase), switch the repo's
Pages source from branch to GitHub Actions, then fix HTTPS: remove and re-add
`abhayemekar.me` in Pages settings to force certificate issuance, wait for
"Certificate created", tick Enforce HTTPS. DNS needs no changes. Then update the
Gamma placeholder link on LinkedIn.

**Open questions.** Unchanged: the resume PDF, and whether the live SearchScribe
deploy runs the current Next.js build. Neither blocks the deploy.

---

## 2026-10-13 — Content refresh: Translytics, HireLens, WriteRight, REFLEX-AI

**What changed.** Content only, all in `src/data/*.ts` plus the matching meta
description in `index.html`:

- **Hero and SEO.** New subhead for the current role; `seo.description` (and the
  `description` / `og:description` meta it mirrors) now names AI agents, RAG,
  backend systems, HireLens and yDirect, with no employer specifics.
- **Translytics.** Summary and bullets kept deliberately generic: no product
  architecture, component or feature names. Other roles unchanged.
- **Featured work** is now HireLens (wide), yDirect (wide), SearchScribe and
  ForecastGPT (paired halves). HireLens copy comes from its public README.
  yDirect is at v1.3.3 and links its LinkedIn page. ForecastGPT links its live
  Render app, noting the free-tier cold start.
- **SearchScribe** re-checked against the current README and repo: Next.js 16 /
  React 19, Tavily research feeding Gemini, Postgres in production, Ruff / mypy /
  pytest / Vitest / Playwright. The "55 backend tests" figure was stale (the repo
  now has far more test functions) and was dropped, not replaced. The live link
  moved to `searchscribe-ai.vercel.app`; the old URL only redirects.
- **More projects.** Added WriteRight and REFLEX-AI. Removed the Resume Screening
  Tool, whose repo became HireLens. AI-Powered 3-Factor Login moved here from
  featured; a secondary entry has no stat strip, so its measured numbers now live
  only in its repo README.
- **Skills.** Added LangGraph, Ollama, pgvector, Hono, Drizzle, Redis / RQ, MySQL,
  React, Next.js, JavaScript and Chrome Extensions (MV3); renamed Anthropic Claude
  to Claude API; dropped Cursor, GitHub Copilot and the Jira duplicate; folded
  CI/CD into the GitHub Actions chip. Every cluster stays at 14 or fewer.

**Why.** The site described the job and the project list as of August. HireLens
is now the strongest public project and belongs at the top.

**Open questions.** The BitMap experience bullet still says "see Projects for
measured results". Those numbers are no longer shown on the page now that the
3-Factor card is secondary, so the bullet needs a small reword or the card goes
back to featured. The earlier SearchScribe question is resolved: the live deploy
runs the current Next.js build.

---

## 2026-10-14 — Phase 0: audit (branch `docs/audit`)

**What changed.** Docs only. Added `docs/PORTFOLIO_BRIEF.md` (the overhaul brief),
`docs/AUDIT.md` (scorecard, findings P0–P3, the five changes that matter most), and a
"before" screenshot set under `docs/screenshots/phase-0/`. No product code changed.

Measured, not assumed:

- Lighthouse, median of 3: local mobile 95/100/100/100 with LCP 2.42 s, 81% of it
  render delay; live mobile 98, LCP 1.88 s; desktop 100 on both.
- The live HTML body contains 0 words.
- axe-core 4.14.0: 0 violations at 360 and 1280 px in both themes.
- Keyboard: 30 tab stops, every one with a visible focus ring.
- Worst token contrast: 4.71:1.
- On a phone, `#work` starts at 4,744 px (screen 6 of 19).

New findings since August:

- **`https://www.abhayemekar.me` serves the `*.github.io` certificate.** The apex
  certificate covers only `abhayemekar.me`. The `www` CNAME is correct, so the fix is
  to re-issue the certificate in Pages settings, not to change DNS.
- **`useTheme` persists the theme on mount.** A first visit therefore pins the
  OS-derived theme, and the site stops following OS changes afterwards. The audit
  harness hit this directly: without clearing `localStorage`, every run after the
  first rendered in the first run's theme.
- **`public/404.html` still uses the pre-August `--subtle` values** (3.66:1 / 3.98:1).
- **`og.png` still reads "SOFTWARE ENGINEER".**

Brief updates from Abhay: the Mahindra & Mahindra client may be named; `ydirect.tech`
is still in development and stays unlinked; HireLens runs locally from
`C:\Playground\hirelens`.

**Why.** The brief makes Gate 1 a measured baseline. Every later phase's "after"
numbers get compared against this one.

**Next.** Gate 1 review. Then Phase 1: positioning, IA and two visual directions.

**Open questions.** Whether to give case studies their own URLs (recommended). The
`www.` certificate needs Abhay in the GitHub Pages settings.

---

## 2026-10-14 — Phase 1: strategy and design direction (branch `docs/strategy`)

**What changed.** Docs only:

- `docs/STRATEGY.md`: positioning, three hero options, information architecture, a
  case-study template with its data shape, and two visual directions with a
  recommendation.
- Four static mockups under `docs/mockups/` (each direction's home and its HireLens
  case study).
- Sixteen screenshots under `docs/screenshots/phase-1/`.

Gate 1 decisions applied: work moves above About and Experience; Credentials are cut
to 3 entries plus LinkedIn; the benchmarks are eugeneyan.com, hamel.dev and jxnl.co.

Measured for the proposal:

- **Latin woff2 weights** (Google Fonts CSS API, HEAD requests):
  - Newsreader roman 56.7 KiB
  - Schibsted Grotesk 45.7 KiB
  - JetBrains Mono 39.5 KiB
  - Newsreader with the opsz axis is 128.9 KiB per style. Too heavy, so the
    wght-only file is proposed.
- **Contrast:** every text pair in both palettes, both themes, is ≥ 5.29:1. The light
  evidence mark was darkened from `#d99a1e` (2.24:1 non-text, a fail) to `#a86f0a`
  (3.90:1).
- **Mockups:** no horizontal overflow at 360 or 1280 px. The first pass had two mobile
  bugs, both fixed:
  - Direction A's hero lost its side padding because a `padding` shorthand overrode
    `.wrap`.
  - Direction B's 12-column spans leaked into the single-column phone layout.

Mapping the HireLens repo (read-only) changed some copy facts:

- CI runs the harness's unit tests, not the benchmark, so the live portfolio's "eval
  harness in CI" wording overclaims.
- The committed eval numbers are a mock-model run.
- Blind-review docs and code disagree.
- Embeddings are Google-only.
- `apps/web/src/lib/demo-data.ts` holds the 12 synthetic resumes for the explainer.

**Why.** The positioning ("AI systems that show their work") is the pattern already
present in HireLens, SearchScribe, ForecastGPT and REFLEX-AI. Direction A turns that
pattern into the visual language, so the explainer feels native to the site.

**Next.** Gate 2. Then Phase 2: prerender, tokens and fonts.

**Open questions.** Whether HireLens is solo work. Whether to run the HireLens
benchmark live against local Ollama for real numbers.

---

## 2026-10-14 — Phase 2: foundation (branch `feat/foundation`)

**What changed.**

- **Every route is prerendered**, and the browser gets no React.
  - `src/entry-server.tsx` renders `/` and `/work/hirelens/` with
    `react-dom/static` `prerender()`. `scripts/prerender.mjs` writes them to
    `dist/`.
  - The dev server renders through the same function, so dev and prod HTML match.
  - Client JS is `src/client/main.ts`: the theme toggle and the nav marker,
    0.84 kB gzip.
  - `motion` and `@vitejs/plugin-react` are removed. Vite 8 compiles TSX on its
    own.
  - This goes one step past the brief's "prerender plus hydrateRoot". Nothing on
    the site needs client React, so no page hydrates.
- **Evidence tokens.** Paper/ink/amber in both themes, with amber limited to
  evidence. There's a type scale with no text under 13px, plus radius and motion
  tokens. Unused `bg-elev-2` and `border-strong` were removed. The measured table
  is `docs/CONTRAST.md`.
- **Fonts.**
  - Newsreader (wght-only file, 58 KB) and JetBrains Mono. Instrument Serif and
    Inter Tight are removed.
  - Metric-matched local fallbacks, measured in Chrome: Newsreader against
    Georgia at 95.89% (400) and 98.25% (500); JetBrains Mono against Courier New
    at 99.98%.
- **TODO mechanism** (`src/lib/todo.ts`). Visible in dev, omitted from
  production, listed by the prerender.
- **Case-study template.** `CaseStudyPage`, typed `caseStudies.ts`, and a
  `Diagram` with one grammar (dashed LLM / solid code / pill data / amber trust
  path) that falls back to a stacked list below 1280px. HireLens is the first
  entry; its role is "Solo", confirmed by Abhay.
- **Home rebuilt in the approved order:** hero (Gate 2 copy plus the proof strip),
  work, also built, experience, capabilities, about (education plus 2 credentials
  plus LinkedIn), contact. The section-level copy is still the old copy; Phase 3
  rewrites it.
- **Budget gate.** `scripts/check-budgets.mjs` fails the build over: initial JS
  10 kB, CSS 15 kB, HTML 40 kB per page, fonts 130 KiB.
- **Audit fix:** the theme is no longer written to storage on first load. CSS
  follows the OS live until the visitor presses the toggle.

**Measured** (`npm run preview`, lighthouse@12, median of 3):

| | before (Phase 0) | after |
|---|---|---|
| `/` mobile | 95 / 100 / 100 / 100 | **100 / 100 / 100 / 100** |
| `/` LCP · CLS · TBT | 2.42 s · 0.026 · 18 ms | **1.66 s · 0 · 0 ms** |
| `/work/hirelens/` mobile | — | **100 / 100 / 100 / 100**, LCP 1.66 s |
| desktop, both pages | 100 | 100, LCP 0.41 s |
| JS per page (gzip) | 99.0 kB | **0.84 kB** |
| fonts | 128.4 KiB | **96.2 KiB** |
| page weight | 240.6 kB | **119.8 kB** |
| words in raw HTML | 0 | **1,131** (`/`), 643 (`/work/hirelens/`) |
| `#work` on a 360px phone | 4,744 px (screen 6) | **857 px (screen 2)** |

- **axe-core 4.14:** 0 violations on both pages, both themes, at 360 and 1280px.
- **Keyboard:** 33 stops on `/` and 17 on the case page, all with a visible focus
  ring.
- **Console and layout:** zero console errors, no horizontal overflow at 360, 768,
  1280 or 1920px. JS-off and reduced-motion captures are in
  `docs/screenshots/phase-2/`.

**What went wrong first.**

- The case page scored 91 for accessibility. Two causes:
  - `fg-subtle` on the evidence wash measures 3.54:1 in dark. Highlighted
    diagram nodes now use `fg-muted`, and the rule is recorded in
    `globals.css` and `CONTRAST.md`.
  - The stacked sidenote links were 19.5px tall. They're now ≥ 24px.
- `@font-face` descriptors can't take CSS variables, so the fallback metrics are
  literal values.
- The dev plugin needed Node types. Rather than add `@types/node` without asking,
  it reads the template through Vite's `?raw` import and types the request
  locally.

**Next.** Phase 3: copy rewrite, the other three case studies, the HireLens
benchmark against local Ollama. Then Gate 3.

**Open questions.** `npm audit` reports 2 high-severity advisories in build-time
dev dependencies (`sharp`, `source-map-js`). Neither ships to visitors; they're
handled in Phase 6.
