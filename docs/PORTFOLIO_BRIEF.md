# Portfolio overhaul brief: abhayemekar.me

You're working in my portfolio repo (`C:\Playground\portfolio`), live at
https://abhayemekar.me/. You're the product designer, frontend engineer and
technical-SEO lead on this. The aim is a portfolio for an AI engineer that a hiring
manager still remembers after 90 seconds and that an engineer respects after reading
the source.

**`CLAUDE.md` is binding.** If this brief conflicts with it, `CLAUDE.md` wins until I
approve a change at a gate. Once I approve one, update `CLAUDE.md` in the same branch so
the two never drift apart.

---

## Goal

I'm a full-stack AI engineer in Pune. I currently work at Translytics and I'm moving
toward AI-engineering roles. A skeptical reader should come away thinking: *"this
person ships real AI systems and thinks clearly about them."*

**Audiences**
1. AI/ML hiring managers and recruiters. They skim for under 2 minutes and often
   arrive from LinkedIn on a phone.
2. Engineers and founders. They read the case studies, open the repos and view the
   page source.

**Conversions, in priority order:** contact (email or LinkedIn), then a HireLens
demo or repo click, then other project demos and repos, then a GitHub profile visit,
then a resume download (only once a resume exists).

---

## Baseline: already known, so re-measure it but don't rediscover it

- **Stack:** Vite 8, React 19, TypeScript 7 (strict), Tailwind v4 (CSS-first),
  `motion` v13 under `LazyMotion` + `domAnimation`, and `sharp` for offline asset
  generation. There is no router, no test suite and no linter. `npm run build`
  (typecheck, then bundle) is the gate.
- **Rendering is client-side only, confirmed from source.** The body of `index.html`
  is just `<div id="root"></div>`, so crawlers, link previews and recruiter tools get
  meta tags and nothing else. Phase 0 measures how much this costs; Phase 2 fixes it.
- **Motion hides content at load.** `Reveal` and `Hero` start at `opacity: 0`. A naive
  prerender would ship invisible HTML, and today the LCP headline sits hidden until JS
  runs.
- **Last measured on 2026-08-25, before the October content refresh:**
  - Lighthouse mobile 96/100/100/100; desktop 100 in all four categories
  - Mobile LCP 2.3 s, almost entirely render delay waiting on React
  - CLS 0.015
  - JS 98.7 kB gzip; fonts about 128 kB
  - axe: 0 violations
- **Design system ("Ink & Amber"):**
  - Type: Instrument Serif for the hero, Inter Tight for body text, JetBrains Mono
    for metadata.
  - Color: near-black and warm off-white, with one amber accent limited to a named
    list of places.
  - Theme: follows the OS with a dark fallback, set before first paint and persisted
    by a toggle.
- **Page sections, in order:** Hero, About, Experience, Selected work (4), More
  projects (5), Skills (5 clusters), Credentials, Contact. All copy lives in
  `src/data/*.ts`.
- **Deploy:** pushing to `main` runs GitHub Actions, which deploys to Pages on the apex
  domain with `base: '/'`. The `origin` remote is
  `git@github-personal:abhay-yemekar/abhay-yemekar.github.io.git`.
- **Docs to keep current:** `README.md`, `CLAUDE.md`, and `PROGRESS.md` (append-only,
  one entry per phase).

---

## Facts, and where to verify them

The current `src/data/*.ts` was checked against the repos in August and October 2026.
Re-verify any claim before you change it. **Local clones live in `C:\Playground\`:**
`hirelens`, `SearchScribe_AI_Studio`, `forecastgpt-financial-outlook-agent`,
`ycorrect`, `ydirect`. Treat them as read-only: don't edit, commit or pull. If a clone
looks stale, check GitHub instead.

**Never open:**
- `C:\Playground\keys_for_firebase.txt`.
- `C:\Playground\inksl_ay` (yDirect's private source). Never link to it, quote it or
  copy from it. The current yDirect copy was already checked against it.
- Anything else in `C:\Playground\` that isn't listed above. It's out of scope.

### Positioning
- I present as a **Full-stack AI Engineer** (AI agents, RAG pipelines, backend
  systems).
- My actual title at Translytics is **Software Engineer**. Wherever a title is stated
  as fact (the experience entry, JSON-LD `jobTitle`), use the real title.

### Projects

| Project | What it is | Links | Notes |
|---|---|---|---|
| **HireLens** (lead) | Glass-box candidate ranking: every per-criterion score cites evidence spans at exact character offsets. Built as a pnpm + Turborepo monorepo with Next.js, a Hono API, and Postgres/pgvector via Drizzle. Includes blind review, a four-fifths-rule bias audit, a hash-chained audit log, and an eval harness in CI. Model-agnostic, including local Ollama. | demo `https://hirelens-rosy.vercel.app/demo`, repo `github.com/abhay-yemekar/hirelens`, npm `hirelens` | Open source. Ships as a CLI on npm and as GHCR images. |
| **yDirect** | Chrome MV3 snippet and prompt manager in the side panel. Firebase Auth, Firestore rules and Cloud Functions on Node 22. | Chrome Web Store listing, `github.com/abhay-yemekar/ydirect`, LinkedIn page | **Source is private.** Label the repo link "source private" and never call it open source. `ydirect.tech` is still under development: **don't link it.** |
| **SearchScribe AI Studio** | Turns a topic into a researched, structured draft with SEO metadata. FastAPI and Next.js 16; Tavily research feeds Gemini. The LLM never emits HTML: Jinja2 renders it and nh3 sanitises it. | live `https://searchscribe-ai.vercel.app`, repo `github.com/abhay-yemekar/SearchScribe_AI_Studio` | |
| **ForecastGPT** | Async Python financial-outlook agent. FastAPI, LangChain, FAISS RAG over filings, local Ollama by default with a provider interface, a Redis/RQ job queue, and a MySQL audit log. | live on Render, repo `github.com/abhay-yemekar/forecastgpt-financial-outlook-agent` | The free tier has a cold start of about 40 s. Say so next to the link. |
| **WriteRight** (repo `ycorrect`) | Self-hosted writing assistant: Node.js, LanguageTool, Gemini, MV3 extension. | `github.com/abhay-yemekar/ycorrect` | |
| **REFLEX-AI** | Research agent that learns from its mistakes and refuses to answer without a citation. | `github.com/abhay-yemekar/reflex-ai` | |
| Older | News-to-Video Generator; CricketStat Pro (PHN internship); AI-Powered 3-Factor Login (BitMap internship) | repos in `projects.ts` | 3-Factor Login (about 95% correct identification, 88% of spoof attempts blocked, in testing) holds the **only measured numbers on the site today**. |

### Experience
Employer work is proprietary. Describe it at a high level, with no client names, no
internal numbers and no confidential detail.

- **Translytics**, Software Engineer, Mar 2026 to present. AI and backend work for a
  supply-chain planning SaaS. Keep it generic.
- **Tata Elxsi**, Software Engineer, Dec 2023 to Feb 2026. **Exception, approved
  2026-10-14:** the Mahindra & Mahindra engagement (BE 6 / XEV 9E) may be named.
  Everything else about it stays high level.
- **PHN Technology**, Intern, Jul–Oct 2023.
- **BitMap Technology**, SDE Intern, Jan–May 2023.
- **Education:** B.Tech in Computer Science, SGGSIE&T Nanded, 2019–2023, 8.80/10.

### Contact
- Public email: the address in `profile.ts`. Never use my work address.
- `github.com/abhay-yemekar`
- `linkedin.com/in/abhayyemekar/`

---

## Hard rules

1. **Never invent** metrics, testimonials, logos, awards, users or claims. When
   something is missing, add a `TODO` entry in the data. It must render visibly in
   `npm run dev`, be **left out of the production build**, and print as a build
   warning. That way a placeholder can't ship and can't be forgotten either. Every
   number on the site carries a code comment saying where and when it was measured.
2. **Privacy:** no phone number or home address anywhere: source, markup, meta, OG,
   JSON-LD, generated images or commit messages. Location is city-level only. Before
   you hand over any push command, grep `src/`, `dist/` and the full git history for
   phone patterns, `tel:`, `streetAddress`, `postalCode` and `telephone`.
3. **Git:**
   - GitHub Flow with Conventional Commits.
   - One branch per phase, each cut from the previous phase's branch so the work
     stacks.
   - **Never push and never merge into `main`.** Pushing `main` deploys.
   - Set git identity with `--local` only. Don't touch the remote.
   - **No AI attribution:** no `Co-Authored-By: Claude` trailer and no "Generated
     with Claude Code" line. The commits are mine alone.
   - `gh` is installed but may be logged in to my work account. Don't use it for
     anything that writes.
4. **Windows:**
   - Write build scripts in Node (`.mjs`).
   - npm scripts must run under cmd and PowerShell: no `rm -rf`, no `VAR=x cmd`, no
     single-quoted globs.
   - Build paths with `node:path` / `URL`.
5. **Dependencies:**
   - Ask before adding any runtime or dev dependency, paid service, API key or
     account.
   - One-off tools run through `npx` (lighthouse, @axe-core/cli, linkinator) are fine
     but must stay out of `package.json`.
   - Licenses must be MIT, Apache-2.0, BSD or ISC; fonts must be OFL.
6. **One animation library:** `motion`, which is already installed. No GSAP. Use plain
   CSS for anything simple.
7. **No analytics or tracking.** Phase 5 may *propose* an option. Installing one needs
   my explicit yes.
8. **Resume:** `profile.resumeUrl` stays `null` until I add `public/resume.pdf`. Don't
   generate a resume.
9. **Verify by running things.** "Done" means a command ran and you report its output
   or numbers. Reading the code is never enough.

---

## Working method

**Stop and wait for me** at Gates 1, 2 and 3. Also stop, at any point, if:
- you need a new dependency,
- you're considering a stack migration,
- a hard rule conflicts with the work, or
- the design depends on a fact you can't verify.

At each gate, give me a short summary, the decisions I need to make as numbered
questions (each with your recommendation), and links to the docs. After any other
phase, summarise and keep going.

**Every phase ends with:**
- `npm run build` green
- a `PROGRESS.md` entry
- the evidence: each command you ran and its numbers

**Verification toolkit** (run against `npm run build && npm run preview`):
- **Lighthouse,** using the command in `CLAUDE.md`, mobile and `--preset=desktop`. Run
  it **3 times and report the median**. Never pass `--preset=perf`: it isn't a real
  preset and produces junk numbers.
- **axe:**
  `npx @axe-core/cli http://localhost:4173 --tags wcag2a,wcag2aa,wcag21a,wcag21aa,best-practice`.
  If chromedriver won't cooperate, inject axe-core through the browser tool instead.
  Either way, record the axe version.
- **Raw-HTML check:** fetch each built page with no JS (curl or Node `fetch`). Assert
  that the `<h1>`, every featured project name and the email link are in the response
  body. Report the word count.
- **Links:** `npx linkinator http://localhost:4173 --recurse`. Check external links
  separately and note any that block bots.
- **Screenshots:** at 360, 768, 1280 and 1920 px, in both themes, plus one
  reduced-motion pass.
  - Use headless Chrome. In August the in-app preview pane didn't composite
    `whileInView` animations, so its screenshots can lie.
  - Save them as WebP under `docs/screenshots/<phase>/`, never under `public/`.
- **Contrast:** measure computed contrast in the browser for every fg/bg token pair in
  both themes. Don't eyeball it.

**Branches, stacked in this order:** `docs/audit`, `docs/strategy`,
`feat/foundation`, `feat/content`, `feat/signature`, `feat/seo`, `chore/quality`.

---

## Phase 0: Audit (docs only, branch `docs/audit`)

Score each area from 1 to 10 and cite evidence:

a. **First-5-seconds clarity:** who I am, what I build, why it matters. Test it at
   360 px, above the fold.
b. **Design distinctiveness:** does it read as a template?
c. **Copy:** quote the weakest lines verbatim from `src/data` and give a direction for
   each rewrite. Flag generic claims, filler and soft-skill lists that no project
   backs up.
d. **Project presentation:** are these case studies or cards?
e. **Performance:**
   - Lighthouse mobile and desktop
   - LCP broken into its phases, plus CLS and TBT (lab INP isn't measurable in a
     navigation run, so TBT stands in)
   - JS, CSS and font weight by file
f. **Accessibility:** axe, a keyboard walk-through, contrast, reduced motion.
g. **Crawlability:**
   - Quantify what a non-JS fetch of the live site sees.
   - Check what the OG and Twitter previews render.
   - Check whether the content is reachable by recruiter tools and LLM crawlers.
h. **Mobile experience.**
i. **Code quality and README.**

I haven't supplied reference sites. Pick 3 portfolios of AI/ML engineers that you'd
benchmark against and say what each does better than mine. Don't block on this.

**Deliverable:** `docs/AUDIT.md` with:
- findings ranked P0 to P3
- the scorecard
- the **five changes that matter most**

**→ GATE 1.**

---

## Phase 1: Strategy and design direction (docs only, branch `docs/strategy`)

- **Positioning:** a one-sentence positioning statement.
- **Hero copy:** 3 options, each a headline of 12 words or fewer plus a subhead of 25
  words or fewer. Recommend one.
- **Information architecture.** Decide between a single page and a home page plus
  static case-study pages at `/work/<slug>/`. I lean toward the case-study pages:
  shareable URLs, a per-page OG image, and crawlable depth, with no client router.
  Argue for or against.
- **Case-study template:** the section list, plus a sketch of how the `Project` type
  in `src/data/projects.ts` would extend to hold it.
- **Visual directions.** Two genuinely different ones, each covering:
  - type pairing (OFL fonts, self-hostable)
  - palette, with measured contrast pairs
  - grid
  - motion language
  - rationale
  - a static HTML mockup of the hero and of one case-study page, saved under `docs/`

  Recommend one. Say whether to **keep, evolve or replace** Ink & Amber, and which
  `CLAUDE.md` conventions would change (the accent list, the section layout).
- **Avoid:** the purple-gradient "AI startup" look, glassmorphism, stock
  illustrations, particle backgrounds, skill progress bars and percentage meters.

If a design skill is available, use it.

**→ GATE 2.**

---

## Phase 2: Foundation (branch `feat/foundation`)

- **Prerender. Every route must ship complete HTML in the first response.**
  - First choice, with no new dependency: React 19's `react-dom/static` `prerender()`
    in a Node build step after an SSR build, plus `hydrateRoot` on the client.
  - Migrating to another framework (Astro, for example) needs a written case at a
    gate.
  - Required:
    - Prerendered content is **visible without JS**. Entrance animations only enhance
      after hydration.
    - Zero hydration warnings.
    - No `window` or `localStorage` access during render.
    - The inline theme script keeps deciding the theme before paint.
    - The Footer's year comes from the build, on purpose.
- **Tokens** for the approved direction: color, type scale, spacing, radius, and
  motion durations and easings, in both themes. Commit a measured contrast table
  under `docs/`.
- **Fonts:**
  - self-hosted, latin subset only
  - `font-display: swap` with metric-matched fallbacks (`size-adjust`,
    `ascent-override`) so the font swap causes no CLS
  - preload only the LCP face, using the existing Vite plugin
- **Images:**
  - Architecture diagrams are inline SVG drawn with the tokens: theme-aware,
    accessible, almost no weight.
  - Raster screenshots go through `sharp` (already a devDep) as AVIF and WebP at 2–3
    widths in `<picture>`, with explicit dimensions, lazy-loaded below the fold.
- **Base components:** accessible link and button, tag, section shell, case-study
  layout, figure, and a diagram wrapper.
- **Budgets,** enforced by a small Node check that fails the build:
  - home page initial JS no larger than today's (about 99 kB gzip)
  - fonts at most 130 kB
  - signature-moment code only on the pages that use it

---

## Phase 3: Content and case studies (branch `feat/content`)

- **Hero:**
  - name and positioning
  - a proof strip built only from verifiable facts (open source on npm, published on
    the Chrome Web Store, and so on)
  - one primary CTA
- **Featured work:** HireLens leads, followed by 2–3 of yDirect, SearchScribe and
  ForecastGPT. Each case study covers:
  - problem and constraints
  - an architecture diagram drawn from the *real* repo structure
  - 2–4 key decisions, each naming the alternative I rejected (for example, why
    glass-box ranking, or why a queue-based async design)
  - the outcome, with real metrics only
  - stack
  - links: demo, repo, write-up
- **Where real numbers might come from:**
  - HireLens eval results in CI (direction accuracy, self-consistency, position bias,
    name-swap bias)
  - npm downloads
  - Chrome Web Store users and rating
  - test counts in the repos

  Propose them at the gate and I'll decide. Small numbers can hurt more than they
  help.
- **Experience:**
  - Write it as outcomes, not duties.
  - Keep Translytics generic.
  - The Mahindra & Mahindra client name stays (approved exception).
- **Skills:** group them by what I can do (LLM apps, RAG, agents, backend, infra and
  data). Link each group to the project or role that proves it. Cut anything nothing
  demonstrates. No percentages.
- **About:** the current text is in my own words. Keep my voice and make it shorter
  and more specific. If you need specifics, ask me up to 3 targeted questions instead
  of filling the gap with generic copy.
- **Contact:** email, LinkedIn and GitHub. Show the resume link only once the PDF
  exists.
- **Copy rules:**
  - Concrete and active.
  - Every sentence names a thing, a number or a decision.
  - Never use "passionate", "leveraging", "cutting-edge", "seamless", "robust" or
    "innovative".

**→ GATE 3.** Show me all the copy in one place (`docs/COPY.md`) along with
screenshots of the rendered pages.

---

## Phase 4: Motion and the signature moment (branch `feat/signature`)

- **Motion:**
  - The load sequence finishes within about 1 s.
  - Also: scroll reveals, plus hover and focus states.
  - **The LCP element is visible in the first paint.**
  - Animate only `transform` and `opacity`, hold 60 fps, and cause no layout shift.
  - Everything collapses under `prefers-reduced-motion`.
- **Signature moment: an interactive "How HireLens scores a candidate" explainer.**
  - **Data comes from actually running HireLens** on a clearly fictional job
    description and resume. It already runs on this machine from
    `C:\Playground\hirelens`, through Ollama. Commit both as fixtures, labelled
    as synthetic. Commit the output JSON with the HireLens version or commit and the
    model name.
  - **Never hand-author scores.** If HireLens can't run locally (for example, the
    model needs a large download), stop and ask me.
  - **Interaction:**
    - Pick a criterion, and the cited evidence spans highlight at their character
      offsets, next to the score and its rationale.
    - Toggle blind review to show what gets redacted.
    - Show the bias-audit output if HireLens produces it.
  - **Requirements:**
    - lazy-loaded when it scrolls into view
    - fully keyboard-operable
    - a text narrative for screen readers
    - works with reduced motion
    - a static figure when JS is off
    - about 25 kB gzip or less
- **Stretch: an "ask about my work" assistant. Propose it, don't build it.** The site
  is static hosting, so the options are:
  - (a) client-side retrieval over the site's content with no LLM: zero cost, no key
  - (b) an LLM behind a serverless function, with the key server-side, rate limiting,
    caching and a hard spend cap

  Option (b) means a new service, so it needs my yes.

---

## Phase 5: SEO and sharing (branch `feat/seo`)

- A unique title, description, canonical URL, OG tags and Twitter tags on every page.
- **Per-project OG images,** generated offline with the pattern in
  `scripts/gen-assets.mjs`, and committed.
  - sharp's SVG renderer only sees fonts installed on the machine, so CI can't
    reproduce these images. Generate them locally.
  - Proposing a better renderer means a new dependency, so ask.
- **Generated from `src/data` at build time, so they can't drift:** `sitemap.xml`
  (with `lastmod`), `robots.txt` and `llms.txt`.
- **JSON-LD:**
  - Home: `Person` with the real `jobTitle`, a city-level address and no telephone,
    plus `WebSite` and `ProfilePage`.
  - Open-source projects: `SoftwareSourceCode`.
  - yDirect: `SoftwareApplication`, with no code link.
  - Case-study pages: `BreadcrumbList`.
  - Validate that every block parses.
- Keep the full favicon set. Restyle `404.html` to match the new design.
- **Analytics:** propose 1–2 cookieless options and state each one's privacy
  trade-off. The default is still none. Don't install anything.

---

## Phase 6: Quality bar (branch `chore/quality`)

- **Mobile Lighthouse at least 95** in all four categories (median of 3 runs).
  Desktop at least 98.
- **Core Web Vitals:** LCP under 2.0 s, CLS under 0.05, TBT under 200 ms. Check INP
  manually against the signature moment in the Chrome performance panel; it must be
  under 200 ms.
- **axe:** 0 serious or critical issues.
- **Contrast:** WCAG AA on every token pair, measured in both themes.
- **Keyboard walk-through,** written up step by step: skip link, nav, every CTA, the
  signature moment, and the theme toggle.
- **Visual checks** at 360, 768, 1280 and 1920 px, in both themes and with reduced
  motion.
- **Console:** zero errors and zero hydration warnings.
- **Links:** zero broken internal links. Check external links and note any that block
  bots.
- **Privacy:** the grep gate passes on `src/`, `dist/` and the full history.
- **Docs:**
  - Update the `README.md` (stack, run, build, deploy, structure, and the key
    architecture decisions). It's part of the portfolio.
  - Update `CLAUDE.md` for the new commands and conventions.

---

## Final report (`docs/REPORT.md`)

1. **Before/after table:**
   - Lighthouse (both form factors, medians)
   - LCP, CLS and TBT
   - JS, CSS and font weight in kB
   - axe results
   - raw-HTML word count per page
2. Before and after screenshots at the four widths.
3. Decisions, each with its rationale and the alternative it beat.
4. **A TODO list of everything that needs my input:** metrics to approve, a resume
   PDF, About specifics, testimonials or references.
5. A suggested semver tag, with the reasoning. Don't create it.
6. **The branches in merge order, with the exact commands for me to run,** for
   example `git push -u origin docs/audit`, one per branch, then how to merge them.
   Note that merging into `main` deploys the site.
