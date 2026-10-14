# Portfolio audit: abhayemekar.me

Phase 0 of [`PORTFOLIO_BRIEF.md`](PORTFOLIO_BRIEF.md). This is an audit only; no
product code changed.

- **Audited:** `main` at `4bdee70` on 2026-10-14. That is the same build that is live,
  because `origin/main` equals `main`.
- **Method:** every number below comes from a command that ran during this audit. The
  [Method](#method) section lists them.

---

## Verdict

The site is technically sound and badly aimed.

**What works:** it is fast, accessible and well built. Lighthouse scores 95–100,
axe finds no violations, the focus order is clean, and the codebase is tidy.

**What doesn't:**
- **The first screen makes a generic claim with no proof.** The first project appears
  six phone screens and about 590 words down.
- **The projects are cards, not case studies.** The strongest engineering story on the
  site (HireLens) is a 90-word stack paragraph in 15 px grey text.
- **A crawler, an LLM or a recruiter tool that doesn't run JavaScript sees an empty
  page.**

Each of these is fixable without changing the stack.

---

## Scorecard

| | Area | Score | Why |
|---|---|---|---|
| a | First-5-seconds clarity | **4/10** | Who: yes. What: vague. Proof: none. The headline would fit any engineer. |
| b | Design distinctiveness | **5/10** | Restrained and consistent, but it's the default "tasteful dev portfolio" look, and nothing on the page is visibly *AI engineering*. |
| c | Copy quality | **5/10** | The project copy is strong. The hero and About repeat one generic idea four times. Experience mixes training with work. 62 skill chips. |
| d | Project presentation | **4/10** | A good problem / built / learned skeleton, but no diagrams, decisions, outcomes, visuals or per-project URLs. |
| e | Performance | **8/10** | Mobile 95 locally, 98 live; desktop 100. LCP is 2.42 s locally (target < 2.0 s), and 81% of that is render delay. |
| f | Accessibility | **9/10** | axe 0 violations, clean keyboard flow, every token pair ≥ 4.71:1. Gaps: the 404 page's contrast, tiny tap targets, 11 px text. |
| g | Crawlability | **2/10** | The initial HTML body holds **0 words**. A stale OG image, one URL, no `llms.txt`, and HTTPS on `www.` is broken. |
| h | Mobile experience | **6/10** | No overflow and the hero fits, but the page is 19 screens long, the work starts at screen 6, the cards are walls of text, and tap targets are 12 px tall. |
| i | Code quality and README | **8/10** | Typed data split, comments that explain *why*, strict TS. One real bug (theme persistence), small duplication, stale README numbers. |

**Overall: about 5.5/10.** The engineering is at about 8/10; the communication is at
about 4/10.

---

## The five changes that matter most

1. **Prerender the full HTML** (Phase 2). One change fixes P0-1, most of P1-4 and part
   of P1-5. Crawlers, LLMs and recruiter tools then get the real page, LCP stops
   waiting on React, and the content becomes shareable.
2. **Rebuild the first screen around proof, and move the work up** (Phases 1 and 3).
   - A specific positioning line.
   - HireLens named above the fold.
   - A proof strip of verifiable facts (open source on npm, published on the Chrome
     Web Store, and so on).
   - Selected work placed directly after the hero, ahead of About and Experience.
3. **Turn the featured projects into case studies at their own URLs** (Phases 1 and 3).
   Each gets the problem, an architecture diagram, 2–4 decisions with the alternative
   that was rejected, the outcome, and links. HireLens leads.
4. **Build the HireLens explainer** (Phase 4). It's the one thing on the page that
   only an AI engineer could show: real scores, each tied to the exact evidence in the
   resume. It does more than any adjective.
5. **Cut the words before the work by about half** (Phase 3).
   - Say the About idea once, specifically.
   - Write Experience as outcomes, not bootcamps.
   - Group Skills by capability and link each group to the project that proves it,
     instead of 62 chips.
   - Trim Credentials to the few that signal something.

**Outside the five, but quick and needs you:** fix the `www.` certificate (P1-2). It
takes about 10 minutes in the GitHub Pages settings.

---

## Findings

Ranked P0 (blocks the goal) to P3 (polish). The **Phase** column says where each
finding is fixed.

### P0: blocks the goal

**P0-1. The page is empty without JavaScript.** *(g; Phase 2)*

- **Evidence:**
  - The live `index.html` is 4,251 bytes, and its `<body>` contains 0 visible words:
    just `<div id="root">` and a script tag.
  - "HireLens", "Translytics" and the email address appear only in `<meta>` tags and
    JSON-LD. The `<h1>` isn't in the HTML at all.
  - Screenshot with JS disabled: `screenshots/phase-0/fold-1280-dark-nojs.webp` (a
    blank page).
- **Impact:**
  - Most LLM crawlers and many recruiter and ATS link scrapers read the HTML without
    running JS. To them this site is a title and a description.
  - Google renders JS, but in a second, deferred pass.
  - Link previews still work, but only because they read the OG tags, and the OG image
    is stale (P1-5).
- **Fix:** prerender at build time with React 19's `react-dom/static` and
  `hydrateRoot`. No new dependency. Entrance animations must enhance visible HTML,
  never hide it. Today `Reveal`, `Hero` and `ProjectCard` all start at `opacity: 0`,
  so a naive prerender would ship invisible text.

**P0-2. The first screen has no proof, and the work starts six screens down.**
*(a, h; Phases 1 and 3)*

- **Evidence:**
  - At 360 px the first screen holds:
    - an eyebrow: "Full-stack AI engineer / Pune"
    - a headline repeating "full-stack AI engineer"
    - one subhead
    - a keyword line: "Python · AI / LLMs · Backend · Data"
    - two text links

    No project, artifact or number is visible.
  - `#work` starts at **4,744 px** on a phone (screen 6 of 19.1) and at 3,528 px on
    desktop (screen 4.4).
  - About and Experience come first, with 588 words before the first project. At
    230 wpm that is about 2.6 minutes, longer than the whole skim budget.
- **Impact:** the recruiter audience leaves before the evidence appears. The hero says
  *what kind* of engineer you are; nothing says *which* one.
- **Fix:** put HireLens in the hero, add a proof strip, and place Selected work right
  after the hero.

### P1: major

**P1-1. The projects are cards, not case studies.** *(d; Phases 1 and 3)*

- **Evidence:**
  - Each featured project is a single card with three equal-weight columns (problem /
    built / learned) set at 15 px in `fg-muted`.
  - HireLens's "What I built" is about 90 words of stack names and features in one
    paragraph.
  - No card has an architecture diagram, a screenshot, a list of decisions, or an
    outcome.
  - No project has its own URL.
  - At 360 px the HireLens card alone is about 1,150 px tall.
- **Impact:**
  - The engineer audience can't see *how you think*: which trade-offs you made and
    what you rejected.
  - The skimmer can't extract anything without reading prose.
  - The substance is excellent (see the [Copy](#copy) section). It's the presentation
    that buries it.
- **Fix:** a case-study template and static pages at `/work/<slug>/`, with a short
  summary card on the home page.

**P1-2. `https://www.abhayemekar.me` shows a certificate error.** *(g; you, about 10
minutes)*

- **Evidence:**
  - The apex certificate's SAN is `DNS:abhayemekar.me` only.
  - `www.` is served GitHub's `*.github.io` certificate, so browsers raise
    `SEC_E_WRONG_PRINCIPAL` and show a warning page.
  - `http://www.` redirects correctly. The `www` CNAME record correctly points to
    `abhay-yemekar.github.io`, so DNS is not the problem.
- **Impact:** anyone who types `www.` lands on a security warning. That is
  unrecoverable for a recruiter.
- **Likely fix:**
  1. In repo Settings → Pages, remove the custom domain and save.
  2. Re-add `abhayemekar.me`.
  3. Wait for the DNS check to pass, so GitHub reissues a certificate covering both
     names.
  4. Re-test with `curl -I https://www.abhayemekar.me/`.

  If that doesn't work, it's a GitHub support ticket, not code.

**P1-3. The hero and About copy are generic and say the same thing four times.**
*(c; Phase 3)*

- The same idea (messy or ambiguous problems turned into clean, reliable systems)
  appears in the hero headline, the About lede, the first About paragraph and the
  About closing line. Quotes are in the [Copy](#copy) section.
- None of these sentences names a project, a number or a decision.

**P1-4. LCP is above target and the JS weight is out of proportion.** *(e; Phase 2)*

- **Evidence:**
  - Local mobile LCP is **2.42 s** (median of 3): TTFB 453 ms, then **render delay
    1,966 ms (81%)**. The LCP element is a hero headline span that doesn't exist until
    React mounts.
  - The live site does better (1.88 s), but the brief's gate is the local build.
  - It takes **99.0 kB gzip / 306 kB raw of JS** to render static text, and Lighthouse
    flags 43 KiB of it as unused at load.
- **Fix:** prerendering removes the render delay. The JS budget only becomes
  meaningful once the HTML no longer depends on it.

**P1-5. Sharing metadata is stale and singular.** *(g; Phase 5)*

- `og.png` reads **"SOFTWARE ENGINEER"**, while the title, description and `og:image:alt`
  say "Full-stack AI Engineer". (Viewed directly: `public/og.png`.)
- Every share of every project produces the same card.
- `site.webmanifest` still describes "Software engineer building Python, AI/LLM and
  backend systems."
- `sitemap.xml` has one URL and no `lastmod`.
- There is no `llms.txt` (it returns 404).

### P2: significant

**P2-1. Skills are a chip wall.** *(c; Phase 3)*
- There are **62 chips** in 5 clusters, including soft skills ("Structured
  problem-solving", "Stakeholder communication") and a "Strategic" trio ("AI
  Strategy", "AI Literacy", "Responsible AI") styled in amber.
- No chip links to anything that proves it.
- Filler entries ("C", "HTML / CSS", "SDLC", "Automation", "Statistics") dilute the
  AI-engineering signal.

**P2-2. Experience reads as duties and training, not outcomes.** *(c; Phase 3)*
- At 398 words it's the second-longest section.
- Two of the four Tata Elxsi bullets are bootcamps ("Generative AI Bootcamp…",
  "Completed a Kafka Bootcamp…"), and one is a duty list ("Applied SDLC practice end to
  end: Python development, Git, Jira…").
- The Gherkin-converter bullet is the only one with an outcome, and that outcome is
  unquantified.
- The Mahindra & Mahindra engagement stays named (approved), but its four bullets
  describe activities, not results.

**P2-3. The Credentials section outweighs Contact.** *(c; Phase 3)*
- It runs 147 words with 8 certifications, including "Claude 101" and "Career
  Essentials in GitHub".
- For an engineering audience, low-signal certificates read as padding.
- Education (8.80/10, first rank in second year) is the strongest item here, and it's
  half-hidden.

**P2-4. The theme stops following the OS after the first visit.** *(i; Phase 2)*
- **Evidence:** on a first visit with no toggle click, `localStorage.theme` was already
  set to the OS-derived value at all 8 viewport and theme combinations measured.
- **Cause:** `useTheme`'s effect writes the theme on mount, not only when the toggle is
  pressed.
- **Impact:** a visitor who first came in dark mode stays dark after switching their OS
  to light.
- **Fix:** persist only from `toggle()`.

**P2-5. The 404 page fails contrast.** *(f; Phase 5)*
- `public/404.html` still uses the pre-August `--subtle` values on its 12 px eyebrow:
  **3.66:1** dark and **3.98:1** light.
- The main site fixed these in August; the standalone 404 never got the fix.

**P2-6. Tap targets and type are small on phones.** *(f, h; Phases 2 and 3)*
- At 360 px, the hero CTAs and every project link are **12–17 px tall**: "Get in
  touch" 98×12, "Live demo" 90×12, "npm" 41×12.
- axe passes these under WCAG 2.5.8's spacing exception, but they are well below the
  44 px touch guidance.
- The smallest text on the page is **11 px** (`u-micro`). It's used for every date,
  stack tag and card label.

**P2-7. Skimmers can't scan by section heading.** *(b; Phase 1)*
- All 7 `<h2>`s render as **12 px** mono labels in `fg-subtle`. The structure is
  correct for screen readers, but visually the page is one long column of similar grey
  blocks.
- On mobile the nav offers only "Work".

**P2-8. The ForecastGPT demo takes 42.5 s to respond.** *(d; Phase 3)*
- The cold start was measured during this audit. It is labelled ("~40 s cold start"),
  but it's still the primary link for a featured project.
- Consider a recorded demo or screenshot as the primary link, with the live app as the
  secondary one.

### P3: polish

- **P3-1. Accent drift.** `CLAUDE.md` limits amber to a named list. It also appears
  on:
  - the About principle titles
  - the Experience client label and timeline nodes
  - the Skills "Strategic" label and chip borders
  - the Contact CTA, which **fills** with amber on hover. "No accent fills" is an
    explicit rule.
- **P3-2. The hero eyebrow repeats the headline.** At ≥ 1024 px it also wraps to two
  lines in the 10 rem rail ("FULL-STACK AI / ENGINEER / PUNE").
- **P3-3. The README is stale and plain.**
  - It claims mobile performance of 96 (measured median today: 95).
  - It has no screenshot and no section on architecture decisions.
  - The reader the brief targets ("an engineer who reads the source") gets a setup
    guide, not a design document.
- **P3-4. Small code duplication.**
  - `ProjectCard` re-implements `Reveal`'s entrance.
  - The arrow SVG is copied into three components.
  - `Footer` reads the visitor's clock for the year, which will need to change once
    prerendered.
- **P3-5. No automated guardrails** beyond `tsc`: no size budget, link check or privacy
  grep in CI. Typecheck-only was a fine choice for v1. Phase 2 adds a size budget.

---

## Copy

### Weakest lines (verbatim, from `src/data`)

| Where | Line | Problem |
|---|---|---|
| Hero h1 | "A full-stack AI engineer who turns ambiguous, messy problems into clean, modular, reliable systems." | It fits any engineer. No noun specific to you. |
| Hero focus | "Python · AI / LLMs · Backend · Data" | A keyword list where proof should be. |
| About lede | "I'm someone who enjoys turning messy problems into clean, reliable solutions." | Repeats the h1. |
| About ¶1 | "My strength is understanding the root of a problem, simplifying it, and shaping it into something structured and dependable." | A self-assessment with no example. |
| About ¶2 | "I approach everything with clarity, modular thinking, and long-term maintainability in mind." | Filler. |
| Principle | "Good engineering isn't about complexity — it's about clarity." | A platitude. The projects already *show* this better. |
| About close | "I enjoy solving ambiguous problems, improving workflows, and leaving behind systems that keep running smoothly…" | The fourth repetition. |
| Tata Elxsi | "Applied SDLC practice end to end: Python development, Git, Jira, and unit and integration testing…" | A duty list. |
| Tata Elxsi | "Completed a Kafka Bootcamp alongside continuing work in advanced Python, data analytics and cloud." | Training, not work. |
| Translytics | "Working across LLM integration, API design and data-heavy processing, from design through QA and release." | Generic by necessity, but it could name *kinds* of problems without breaching confidentiality. |

### Strongest lines (keep them and promote them)

- HireLens: "Glass-box candidate ranking: every score cites the exact evidence it came
  from." This is the best line on the site. It belongs in the hero.
- HireLens: "A score people can check is worth more than a clever one."
- SearchScribe: "Treating model output as untrusted input changed the architecture."
  This is exactly the kind of insight a senior reader looks for.
- ForecastGPT: "an ungrounded model will happily invent a margin figure."
- Contact: "I read everything and reply to anything specific." It sounds human and
  specific.

The pattern: **your best writing is about decisions inside projects; your weakest is
about yourself in general.** The redesign should give the first kind more room and
cut the second.

---

## Benchmarks

You haven't supplied reference sites, so I've proposed these. They were checked live on
2026-10-14, and all of them ship their content in the initial HTML.

| Site | What it does better | What to take |
|---|---|---|
| **eugeneyan.com** | The first screen *counts* the evidence (posts, talks, prototypes) instead of describing the person, and every item is dated. | Replace adjectives with countable, dated artifacts. A one-line hook per project. |
| **hamel.dev** | The identity is one specific problem (evaluating AI systems), and the proof is long-form write-ups a reviewer can judge. | One niche claim, backed by a write-up per project: eval method, failure modes, cost. |
| **jxnl.co** | One flagship open-source artifact carries the page, and a "Start Here" path routes readers to the best few pieces. | Lead with HireLens. Give readers a curated path instead of a flat grid. |
| *brittanychiang.com* (template reference) | The most-cloned developer portfolio: single page, numbered sections, timeline, chips, cards. | **This is what the current site structurally resembles.** The AI benchmarks escape it by putting evidence and writing first. |

**Scale caveat:** the three AI benchmarks belong to engineers with a decade or more of
public output. Borrow their *structures*, not their volume.

---

## Measurements

### Lighthouse (lighthouse@12, median of 3; desktop live is a single run)

| Target | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Local preview, mobile | **95** | 100 | 100 | 100 | 2.26 s | **2.42 s** | 18 ms | 0.026 |
| Local preview, desktop | 100 | 100 | 100 | 100 | 0.49 s | 0.53 s | 0 ms | 0.016 |
| Live, mobile | 98 | 100 | 100 | 100 | 1.79 s | 1.88 s | 53 ms | 0.028 |
| Live, desktop | 100 | 100 | 100 | 100 | 0.40 s | 0.42 s | 0 ms | 0.009 |

- **LCP phases** (local mobile): TTFB 453 ms · load delay 0 · load time 0 · render
  delay 1,966 ms.
- **INP** can't be measured in a navigation run; TBT stands in for it. There are no
  interactions worth profiling yet.

### Weight (build output)

| Asset | Raw | Transfer |
|---|---|---|
| JS (`index-*.js`) | 306.4 kB | 99.0 kB gzip (43 KiB unused at load) |
| CSS | 24.0 kB | 5.7 kB gzip |
| Fonts (4 × woff2, latin) | 128.4 kB | 128.4 kB |
| HTML | 4.3 kB | 1.5 kB gzip |
| **Page total** (per Lighthouse) | | **240.6 kB** |

### Accessibility

- **axe-core 4.14.0,** tags wcag2a/2aa/21a/21aa/22aa/best-practice, run at 1280 px and
  360 px in both themes after scrolling: **0 violations**, 35 passes. There are 5
  `incomplete` colour-contrast nodes, the same footer micro-text as in August. axe
  couldn't resolve the background behind them; the pairs measure ≥ 5.1:1.
- **Keyboard** (1280 px): 30 tab stops, then focus wraps to the body.
  - The skip link comes first, then the brand, the 4 nav links, the theme toggle, the
    hero CTAs, the 10 project links, the 5 more-project rows, the LinkedIn
    certifications link, the 4 contact links, and back-to-top.
  - Every stop matched `:focus-visible` with a 2 px solid outline.
  - No stop sat on an invisible (`opacity: 0`) element.
- **Reduced motion:** the hero renders at opacity 1 with no transform. 0 elements stay
  invisible after scrolling. See `fold-360-light-reduced.webp`.
- **Token contrast** (computed in the browser), worst case per theme:

| Pair | Dark | Light |
|---|---|---|
| fg on bg | 16.39 | 16.63 |
| fg-muted on bg-elev-2 | 6.83 | 6.60 |
| fg-subtle on bg | 5.45 | 5.10 |
| fg-subtle on bg-elev-2 (worst) | **4.81** | **4.71** |
| accent on bg-elev-2 | 8.05 | 4.90 |
| accent-fg on accent | 9.12 | 5.78 |
| 404 page eyebrow | **3.66 ✗** | **3.98 ✗** |

### Layout (headless Chrome, both themes identical)

| Width | Page height | Screens | `#work` starts at | h1 font size | Horizontal overflow |
|---|---|---|---|---|---|
| 360 | 15,316 px | 19.1 | 4,744 px | 44 px | none |
| 768 | 10,635 px | 10.4 | 3,297 px | 53.8 px | none |
| 1280 | 10,058 px | 12.6 | 3,528 px | 72 px | none |
| 1920 | 10,061 px | 9.3 | 3,532 px | 72 px | none |

There were zero console errors or warnings across all 9 page loads.

### Words per section

There are 1,739 words in total, about 7.6 minutes of reading.

| Section | Words |
|---|---|
| Hero | 38 |
| About | 152 |
| Experience | 398 |
| Work | 697 |
| More | 147 |
| Skills | 127 (62 chips) |
| Credentials | 147 |
| Contact | 33 |

### Links

All 21 URLs in `src/data` and `index.html` were checked:

| Link | Result |
|---|---|
| 17 links | 200 |
| ForecastGPT live app | 200, after **42.5 s** |
| LinkedIn profile and certifications | 429 (blocks bots; fine in a browser) |
| npm | 403 (blocks bots; fine in a browser) |

`https://abhayemekar.me` returns 200. `http://` and `http://www.` both 301 to the apex.
`https://www.` fails TLS (P1-2).

---

## Method

All of this runs on Windows with Node 24. Nothing was added to `package.json`.

- `npm run build` (typecheck and bundle), then `npm run preview` on :4173.
- `npx lighthouse@12 <url> --chrome-flags="--headless=new --no-sandbox"`, plus
  `--preset=desktop` for desktop. Three runs per row, median reported.
- A dependency-free headless-Chrome harness over the DevTools protocol, which:
  - captured screenshots at 360, 768, 1280 and 1920 px in both themes, plus reduced
    motion and JS-off
  - ran the layout metrics
  - did the keyboard walk
  - injected axe-core 4.14.0 (the copy bundled with Lighthouse)
  - measured token contrast from computed custom properties
- Before each load, `localStorage` was cleared. Without that, `useTheme`'s
  write-on-mount (P2-4) makes every later run inherit the first run's theme.
- `curl` for the raw live HTML, headers, redirects and certificate; `openssl s_client`
  for the certificate SANs; `nslookup` for the `www` CNAME.
- Node `fetch` over every URL in `src/data` and `index.html`.

The screenshots are in [`screenshots/phase-0/`](screenshots/phase-0/):
- `fold-<width>-<theme>.webp`: the first screen at each width.
- `full-360-dark.webp` and `full-1280-dark.webp`: whole pages.
- `fold-360-light-reduced.webp`: reduced motion.
- `fold-1280-dark-nojs.webp`: what a crawler sees.
