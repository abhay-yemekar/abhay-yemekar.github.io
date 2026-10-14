# Strategy and design direction

This is Phase 1 of [`PORTFOLIO_BRIEF.md`](PORTFOLIO_BRIEF.md). It builds on
[`AUDIT.md`](AUDIT.md) and the Gate 1 decisions:

- the five priorities are approved
- Selected work moves to right after the hero
- Credentials are trimmed to 3 entries plus a LinkedIn link
- the benchmarks are eugeneyan.com, hamel.dev and jxnl.co

This phase is docs only. The mockups live in [`mockups/`](mockups/), and their
screenshots in [`screenshots/phase-1/`](screenshots/phase-1/).

---

## In one paragraph

Position the site around one specific, provable idea: **AI systems that show their
work.** It runs through the strongest projects:

- **HireLens:** the model quotes its evidence, and code verifies the quote.
- **SearchScribe:** the model emits data, and code renders the HTML.
- **ForecastGPT:** every claim is grounded in a retrieved chunk.
- **REFLEX-AI:** it refuses to answer without a citation.

The structure:
- A short home page whose first screen makes that claim and shows a piece of evidence
  next to it.
- Four case studies, each at its own URL.

I recommend **Direction A, "Evidence"**. It evolves Ink & Amber rather than replacing
it: amber stops being decoration and gets one job, marking evidence. The site's look
then demonstrates the claim it makes.

---

## 1. Positioning

> **Abhay Yemekar is a full-stack AI engineer who builds LLM systems that show their
> work: the model proposes, deterministic code verifies, and every output traces back
> to its evidence.**

**Why this one:**
- **It's specific.** "Full-stack AI engineer" alone describes thousands of people.
  This sentence describes the pattern behind HireLens, SearchScribe, ForecastGPT and
  REFLEX-AI, so it describes you.
- **It's provable on the page.** Every case study can show where the model is trusted
  and where it isn't. The diagram grammar below makes that visible at a glance.
- **It answers what hiring teams worry about:** hallucination, auditability and evals.
  hamel.dev wins on a single niche, and this is a niche you already occupy.
- **It loses nothing in search.** The words recruiters search for ("AI engineer",
  "agents", "RAG", "backend", Python, TypeScript) still appear in the eyebrow, the
  lede, the proof strip, `<title>` and the meta description.

**The weak link is yDirect.** It's a shipped product, but not an AI system. Present it
as proof of *shipping*: a published extension, MV3, server-side authorisation. Don't
present it as proof of the thesis.

---

## 2. Hero copy: three options

Each option has a headline of 12 words or fewer and a subhead of 25 words or fewer.
The proof strip under the hero is the same for all three:

**HireLens** · glass-box ranking · MIT, npm v1.4.0 | **yDirect** · on the Chrome Web
Store | **Translytics** · software engineer · prev. Tata Elxsi

| | Headline | Subhead |
|---|---|---|
| **A. Thesis** *(recommended)* | I build AI systems that show their work. *(8)* | HireLens, my open-source ranking engine, ties every score to the exact resume text behind it. Agents, RAG pipelines, and the backends that ship them. *(24)* |
| B. Keyword-first | AI engineer building agents, RAG and the backends behind them. *(10)* | Software engineer at Translytics. I built HireLens, open-source candidate ranking where every score cites the resume text behind it. *(19)* |
| C. Mechanism | The model proposes. The code verifies. *(6)* | I'm Abhay, a full-stack AI engineer in Pune. In HireLens, the model quotes its evidence and code confirms the quote exists before a score counts. *(25)* |

**Why A:**
- It passes the 90-second memory test: it's a phrase someone can repeat.
- The rest of the first screen proves it immediately. "Show their work" carries a
  citation marker that points at the proof strip, and the evidence card sits right
  beside it.
- B is the safe version, and it's a good fallback. Its wording goes into `<title>` and
  the meta description, so A doesn't cost anything in search.
- C is clever, but it only lands once the reader already knows the mechanism.

**CTAs:**
- The primary CTA is "See how HireLens scores a candidate". It jumps to the explainer:
  proof before the ask.
- "Email me" is the secondary CTA, and Contact stays one tap away in the nav.

At 360 px the primary label wraps to two lines (`a-home-360-light.webp`), so Phase 3
picks a shorter label for mobile.

---

## 3. Information architecture

**Recommendation: a home page plus four static case-study pages. No client router.**

```
/                      home
/work/hirelens/        case study (lead), with the interactive explainer
/work/searchscribe/    case study
/work/forecastgpt/     case study
/work/ydirect/         case study (source private: cites public docs only)
/404.html
```

**Home, top to bottom:**

| # | Section | Budget | Notes |
|---|---|---|---|
| 1 | Hero | ≤ 60 words | Thesis, lede, CTAs, a **static** evidence card (one criterion, prerendered, zero JS), the proof strip |
| 2 | Selected work | ≤ 260 words | HireLens large, with the explainer as a lazy-loaded island. SearchScribe, ForecastGPT and yDirect as compact entries, each naming its pattern ("model output as untrusted input") and linking to its case study |
| 3 | Also built | ≤ 90 words | WriteRight, REFLEX-AI and the three older projects, one line each |
| 4 | Experience | ≤ 180 words | Four roles, outcomes not duties. Mahindra & Mahindra named (approved) |
| 5 | Capabilities | ≤ 80 words | LLM apps · RAG · agents · backend · infra & data. Each group links to the project or role that proves it. No chip wall |
| 6 | About | ≤ 110 words | Specific and human, in your voice. Education plus 3 credentials and a LinkedIn link underneath (Gate 1) |
| 7 | Contact | ≤ 40 words | Email first, then LinkedIn and GitHub. Resume link only once the PDF exists |

**Targets against today's site:**
- Hero copy before the first project: **≤ 60 words** (today 588 words before the
  first project).
- Whole home page: **≤ 820** (today 1,739).
- On a phone, Selected work starts on **screen 2** (today screen 6).

**Why separate pages, not one long page:**
- **Shareable.** You can send a hiring manager `/work/hirelens/` directly, and each page
  gets its own OG card.
- **Crawlable depth.** Five real documents instead of one, which `llms.txt` and the
  sitemap can point to.
- **Focus.** A case study has room for a diagram and its decisions without making the
  home page longer.

**The costs, and how they're handled:**
- **More pages to maintain.** One data-driven template means a case study is a
  `src/data` entry, not new markup.
- **Navigating between pages.** These are plain static pages, so loads are fast. CSS
  cross-document View Transitions (`@view-transition { navigation: auto }`) give
  continuity where the browser supports it, with zero JS. The `CLAUDE.md` "no router"
  rule holds.

---

## 4. Case-study template

Every featured project fills the same sections. Claims in the margin cite the file in
the **public** repo that backs them. That is the "show your work" idea applied to the
writing itself. yDirect cites its public docs only.

| # | Section | Rule |
|---|---|---|
| — | Header | Name, one-line tagline, links (demo / repo / npm), then an at-a-glance strip: role · status · license · stack |
| 01 | Problem | ≤ 80 words. Whose problem it is, and why the obvious tool fails |
| 02 | Constraints | 3–4 items, each a bold claim plus one sentence |
| 03 | Architecture | An inline SVG diagram plus a one-line caption. **Diagram grammar:** dashed = LLM step, solid = deterministic code, pill = data, accent path = the trust path. A vertical variant below 768 px. Labels render at ≥ 13 px at every width (the mockup SVG scales its 11 px labels down, which production must not do) |
| 04 | Decisions | 2–4, each as **Chose / Over / Cost** (or Gain), each citing a file |
| 05 | Evaluation | AI projects only. Method, then results. Results are real or a visible TODO, never mock numbers |
| 06 | Outcome | Shipped facts (version, release, distribution), plus real metrics with a source and date |
| 07 | Next | ≤ 60 words: what I'd change and why |
| — | Footer | Stack grouped by layer; next case study |

**Data shape** (extends today's `Project` in `src/data/projects.ts`):

```ts
type SourceRef = { label: string; href: string }          // a file in the public repo, or a doc
type Measured = { value: string; label: string; source: SourceRef; measuredAt: string }
type Todo = { todo: string }                                // dev: visible; prod: omitted + build warning

type Decision = {
  title: string
  chose: string
  over: string
  cost?: string
  gain?: string
  cites?: SourceRef[]
}

type CaseStudy = {
  slug: string
  name: string
  tagline: string
  summary: string                                           // home entry, ≤ 30 words
  pattern?: string                                          // e.g. "Model output as untrusted input"
  glance: { role: string | Todo; status: string; license?: string; stack: string[] }
  links: ProjectLink[]
  problem: string
  constraints: { claim: string; detail: string; cites?: SourceRef[] }[]
  architecture: { diagram: DiagramId; caption: string }     // DiagramId → a typed node/edge spec, not raw SVG
  decisions: Decision[]
  evaluation?: { method: string; results: (Measured | Todo)[] }
  outcome: { facts: string[]; metrics?: Measured[] }
  next: string
  og: { title: string; subtitle: string }
}
```

Diagrams are stored as typed node/edge specs, and one component renders both the
desktop and the vertical layouts. The SVG in the mockups is hand-placed, as a stand-in.

---

## 5. Two visual directions

Both are mocked at the hero and at the HireLens case study, in both themes, at 1280 px
and 360 px. The mockups load fonts from Google Fonts for convenience; production
self-hosts the latin subset, per `CLAUDE.md`.

### Direction A: "Evidence" *(recommended; evolves Ink & Amber)*

**The idea:** the site reads like a careful technical document. The one motif is
**evidence**:
- an amber wash with an underline mark over a claim
- a citation numeral that points to its source

The hero's claim cites the proof strip. The case study's claims cite repo files in the
margin. The HireLens explainer uses the same marks for its evidence spans, so the
signature moment feels native rather than bolted on.

| | |
|---|---|
| **Type** | **Newsreader** (Production Type, OFL-1.1, variable 200–800) for display *and* text, and **JetBrains Mono** (kept) for metadata, citations and offsets. Two families instead of three |
| **Font weight** | Newsreader roman 56.7 KiB + JetBrains Mono 39.5 KiB = **96.2 KiB** (today 128.4). The italic is dropped (+63 KiB); emphasis comes from the evidence mark instead |
| **Palette** | Paper `#f7f5ef` / ink `#1a1917`; night `#121110` / `#ece8df`. Amber has one job: the evidence wash, the mark and the citations |
| **Grid** | 1200 px max. A text column (≤ 660 px, about 68 characters) plus a 260 px margin column for sidenotes at ≥ 1100 px. Sidenotes fall inline below that |
| **Type scale** | 80 / 40 / 30 / 22 / 19 (body) / 13 (smallest). **No text below 13 px** (today 11 px) |
| **Motion** | "Mark, don't move." No headline entrance, so the LCP text is visible at first paint. Evidence marks draw left to right as they scroll into view (CSS scroll-driven animation, progressive enhancement; static where unsupported). Citations and their sources highlight each other on hover and focus. Cross-document View Transitions. Reduced motion: every mark is drawn statically |
| **Screens** | [`a-home-1280-light`](screenshots/phase-1/a-home-1280-light.webp) · [`a-home-1280-dark`](screenshots/phase-1/a-home-1280-dark.webp) · [`a-home-360-light`](screenshots/phase-1/a-home-360-light.webp) · [`a-case-1280-light-full`](screenshots/phase-1/a-case-1280-light-full.webp) · [`a-case-1280-dark-full`](screenshots/phase-1/a-case-1280-dark-full.webp) |

### Direction B: "Systems" *(replaces Ink & Amber)*

**The idea:** a precise spec sheet. The architecture *is* the imagery:
- a live mini-diagram in the hero, where a signal dot travels the trust path
- a visible 12-column hairline grid
- numbered spec rows

| | |
|---|---|
| **Type** | **Schibsted Grotesk** (OFL-1.1, variable 400–900) for display and text, plus JetBrains Mono |
| **Font weight** | 45.7 + 39.5 = **85.2 KiB** |
| **Palette** | Cool paper `#f4f5f3` / `#0e1012`; graphite `#0e1011` / `#e8ebe9`. A single signal colour (`#b8390b` light, `#ff7d47` dark) for the active path and state only |
| **Grid** | A visible 12-column grid with 24 px gutters at ≥ 1024 px. Modules span 3, 5, 7 or 12 columns. Case studies use a sticky 3-column spec sidebar |
| **Motion** | "Trace the flow." Diagram paths draw on entry, and a packet travels input → output (CSS `offset-path`). Hovering a node highlights its spec row. Reduced motion: a static diagram with the active path drawn |
| **Screens** | [`b-home-1280-light`](screenshots/phase-1/b-home-1280-light.webp) · [`b-home-1280-dark`](screenshots/phase-1/b-home-1280-dark.webp) · [`b-home-360-dark`](screenshots/phase-1/b-home-360-dark.webp) · [`b-case-1280-light-full`](screenshots/phase-1/b-case-1280-light-full.webp) · [`b-case-1280-dark-full`](screenshots/phase-1/b-case-1280-dark-full.webp) |

### Contrast (WCAG; text needs ≥ 4.5:1, non-text marks ≥ 3:1)

| Pair | A light | A dark | B light | B dark |
|---|---|---|---|---|
| fg on bg | 16.11 | 15.43 | 17.43 | 15.89 |
| fg-muted on bg | 7.94 | 8.46 | 7.83 | 8.33 |
| fg-subtle on bg | 5.91 | 5.94 | 5.65 | 5.92 |
| fg-subtle on bg-elev (worst text) | 6.34 | **5.48** | 6.18 | **5.48** |
| accent on bg | 5.81 | 10.26 | **5.29** | 7.52 |
| fg on evidence wash | 13.17 | 10.24 | — | — |
| mark / signal (non-text) on bg | **3.90** | 10.26 | 5.29 | 7.52 |

**Worst text pair: 5.29:1** (today's worst is 4.71). These ratios were computed from
the hex values; Phase 2 re-measures them from computed styles in the browser, per
`CLAUDE.md`.

### Recommendation: A

| | A · Evidence | B · Systems |
|---|---|---|
| Memorable after 90 s | **The site demonstrates the claim** | A strong first screen, but a familiar dev-tool look |
| Distinct from templates | Paper, serif and citations are rare among engineer portfolios | Grotesk, grid and an orange signal are close to the Vercel/Linear look |
| Fits the signature moment | Same marks as the explainer | The diagram does, but the evidence UI would be a new language |
| Human About section | A serif in your voice reads warmly | Reads cooler, like a spec |
| Continuity | Evolves Ink & Amber | A full replacement |
| Fonts | 96.2 KiB | 85.2 KiB |

**What A borrows from B:**
- the diagram grammar (dashed = LLM, solid = code)
- the spec-style at-a-glance strip

**Keep, evolve or replace Ink & Amber? Evolve.**
- **Keep:** the ink and amber family, OS-following themes, mono metadata, and the
  restraint.
- **Change:**
  - The fonts become Newsreader plus JetBrains Mono.
  - Amber goes from decorative to semantic.
  - Section headings get real size; today all seven `<h2>`s render at 12 px.
  - The 160 px left rail is retired. It costs width and is the reason headings are
    tiny.
  - Paper becomes the designed-first theme. Dark stays equal, and the OS still
    decides.

**Explicitly avoided in both directions:**
- purple gradients and the "AI startup" look
- glassmorphism
- stock illustration
- particle backgrounds
- skill bars and percentage meters
- logo walls
- invented metrics: every number slot without a measured value is a visible TODO

---

## 6. What changes in `CLAUDE.md` if A is approved

Each change is written into `CLAUDE.md` in Phase 2, on the branch that implements it:

- **Fonts:**
  - Add Newsreader (`@fontsource-variable/newsreader`, OFL-1.1, v5.3.0). This is the
    **one new dependency** this direction needs.
  - Remove `@fontsource/instrument-serif` and `@fontsource-variable/inter-tight`.
  - The preload plugin targets the Newsreader roman face.
- **Accent rule:**
  - Replace the current list with *amber marks evidence*: the evidence wash and mark,
    citation numerals, link underlines, the active-nav underline, the diagram trust
    path, and section numerals.
  - "No accent fills" gains exactly one exception: the evidence wash, at ≤ 30% opacity.
- **Layout:** the `SectionShell` left-rail motif is retired. Metadata text is 13 px
  minimum.
- **Motion:**
  - CSS first: scroll-driven marks and View Transitions.
  - If, once Phase 4 is designed, nothing still needs the `motion` package, remove it
    and the `LazyMotion` scaffolding.
  - Phase 2 measures the JS saving before that decision; I'm not quoting a number I
    haven't measured.
- **Pages:** static HTML per route, still no router.

---

## 7. What mapping the HireLens repo changed

I mapped `C:\Playground\hirelens` read-only, at `4ed4514`. Five findings affect
Phase 3 copy:

1. **The live site overclaims CI.** The HireLens card says the eval harness "in CI
   tracks" the four metrics, and the learned line says bias is tested "in CI".
   - In fact, `ci.yml` runs the unit suite, which includes the harness's own tests,
     but not the benchmark (`evals:mock`).
   - Phase 3 rewords this to "a seeded benchmark runs through the same engine".
   - Alternatively, wire `evals:mock` into HireLens CI, and the original wording
     becomes true.
2. **No real-model eval numbers exist.** The committed `packages/eval-report.json` is a
   mock-model plumbing run from 2026-09-11, and the README says so. It also predates
   the 2026-10-09 evidence clamp.
3. **Blind review:**
   - The code masks email, phone, URLs and the name line, keeps the offsets, and runs
     before scoring when enabled.
   - HireLens's own docs say "at read time" and mention schools; the code does
     neither.
   - Copy follows the code.
4. **"Model-agnostic, including local Ollama"** holds for scoring. Embeddings are
   Google-only, so a fully local setup gets keyword search and loses semantic search.
   Copy must not imply otherwise.
5. **The explainer's data source exists.** `apps/web/src/lib/demo-data.ts` has 12
   synthetic resumes, a JD and a rubric.
   - Do **not** use `sample-data/resume_sample.txt`: it's an old copy of your own
     resume.
   - For Ollama, the base URL needs the `/v1` suffix. The docs disagree on this.

---

## 8. Decisions for Gate 2

1. **Should the site use Direction A, "Evidence"?** I recommend it. Approving it also
   approves adding `@fontsource-variable/newsreader` and removing the Instrument Serif
   and Inter Tight packages.
2. **Should the hero use option A,** "I build AI systems that show their work."? I
   recommend it, with B's wording in `<title>` and the meta description.
3. **Should the IA be a home page plus four case-study pages** at `/work/<slug>/`? I
   recommend it.
4. **Should I get real HireLens eval numbers?** I recommend running the HireLens
   benchmark live against your local Ollama in Phase 3 and publishing the results with
   the model name and date. It costs nothing and uses your machine. The alternative is
   to keep the Evaluation section qualitative until you run it yourself.
5. **Is HireLens solo work?** The case study's "Role" field needs an answer.
