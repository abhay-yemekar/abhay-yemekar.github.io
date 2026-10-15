# Copy review: Gate 3

All site copy in one place, generated from the built HTML (`npm run build`) on
2026-10-15, so it's exactly what would ship. TODOs are omitted from production,
so they don't appear in the copy below. They're listed under
[Needs your words](#needs-your-words).

Screenshots of every page are in [`screenshots/phase-3/`](screenshots/phase-3/).

## Decisions for Gate 3

1. **Approve the copy below.** Mark anything that doesn't sound like you. The
   About section is mostly your own sentences, condensed; the second paragraph
   is new and ties your voice to the projects.
2. **Do the case-study decisions match your reasoning?** Most are documented in
   your repos. A few of the rejected alternatives are my inference from the
   code, because the repo doesn't say:
   - HireLens: "Over: trusting offsets the model reports" (inferred).
   - ForecastGPT: "Over: asking the model to read figures from the PDFs" and
     "Over: holding an HTTP request open" (both inferred).
   - SearchScribe: all four come from its ADRs and `docs/ai-architecture.md`.
   - yDirect: all three come from the public docs repo.
3. **How should HireLens get real eval numbers?** The run against local
   `llama3.2:3b` (the only chat model installed) failed:
   - The model returned output that broke the scoring schema twice.
   - Ollama's OpenAI-compatible path doesn't enforce the JSON schema.
   - The harness stopped, as designed, rather than report partial numbers.
   Options:
   - **(a)** Pull a larger local model that handles structured output (e.g.
     `qwen2.5:7b`, about 4.7 GB) and rerun. No cost.
   - **(b)** Run once with your own hosted key (e.g. Gemini), set in the shell
     for one run and never stored.
   - **(c)** Keep the Evaluation section qualitative (method only) for now.
   I'd go with (a). Either way, HireLens's README probably needs a minimum-model
   note next to "run fully local via Ollama".
4. **Do these cuts work for you?**
   - The Kafka bootcamp, "Applied SDLC practice" and OTA/MDLR details are gone
     from Experience.
   - The McKinsey Forward programme and six certificates are off the home page.
     The LinkedIn link stays.
   - The soft-skill and "Strategic" chips are gone.
   - ForecastGPT's period changes from Oct – Nov 2025 to **Oct 2025 – Sep 2026**,
     based on its commit history.

## Needs your words

The build prints these as warnings. Each is visible in `npm run dev` and absent
from production until you fill it in.

| Where | Needed |
|---|---|
| About | One specific, personal line: what pulled you into AI engineering, or what you do away from the keyboard |
| Experience · Translytics | One outcome that's safe to share publicly, at a high level |
| HireLens · Evaluation | Real-model results (decision 3) |
| HireLens · What I'd change next | ≤ 60 words |
| SearchScribe · What I'd change next | ≤ 60 words |
| yDirect · What I'd change next | ≤ 60 words |

ForecastGPT's "next" comes from its README ("Designed, next up": visual-native
RAG over investor decks).

## Where the facts come from

| Project | Source | Commit or date |
|---|---|---|
| HireLens | `C:\Playground\hirelens` (README, ARCHITECTURE.md, `packages/core`, `packages/evals`) | `4ed4514`, 2026-10-14 |
| SearchScribe | `docs/ai-architecture.md`, ADR-002/004/005/006, README; tests counted with `git grep` | `7d14eae`, 2026-10-15 |
| ForecastGPT | README, `docs/DEPLOY.md`, `docs/PRODUCT_DECISIONS.md`, `app/agent.py`, `app/tools/financial_extractor.py` | `a7688ca`, 2026-09-17 |
| yDirect | Public docs repo only (`docs/ARCHITECTURE.md`, `PRIVACY-AND-PERMISSIONS.md`, `FAQ.md`, `CHANGELOG.md`). The private source was not read. | v1.3.3 docs |
| Experience | The existing `src/data/experience.ts`, condensed. No new claims | — |

The only measured numbers on the site are:
- the 3-Factor Login results (from that project's README)
- the SearchScribe and ForecastGPT test counts (counted on 2026-10-15)

## Length

| | Before (Phase 0) | Now |
|---|---|---|
| Home page, words | 1,739 | 934 |
| Words before the first project | 588 | 69 |
| Selected work, top edge on a 360px phone | 4,744 px | 870 px |

The Phase 1 target was 820 words. The remaining overage is mostly metadata (dates,
roles, tool names) that recruiters scan for.

# The copy

---

## Home


Full-stack AI engineer · Pune
### I build AI systems that show their work. 1

HireLens, my open-source ranking engine, ties every score to the exact resume text behind it. Agents, RAG pipelines, and the backends that ship them.
- 1 HireLens · glass-box ranking · MIT, npm v1.4.0
- 2 yDirect · on the Chrome Web Store
- 3 Translytics · software engineer · prev. Tata Elxsi

#### Selected work

**HireLens**

Nov 2025 – present · v1.4

The model proposes; code verifies

Scores a resume against a rubric you control. The model quotes its evidence, and code checks the quote is really in the resume before the score counts.
- Live demo
- Repository
- npm

**SearchScribe AI Studio**

Nov 2025 – present

Model output as untrusted input

A topic in, a researched draft out. The model picks source passages by ID and returns structured JSON; code owns the quotes, the HTML and the sanitising.
- Live site
- Repository

**ForecastGPT**

Oct 2025 – Sep 2026

Code extracts the numbers

Quarterly results and earnings calls in, a structured outlook out. Code extracts the numbers; the model writes the narrative from inputs it is handed.
- Live app (free tier, about 40 s to wake)
- Repository

**yDirect**

Shipped · v1.3.3

The server is the authorisation boundary

A published Chrome extension for reusable snippets and prompts. Copying stays on the device; anything that touches the cloud is authorised by the server, not the UI.
- Chrome Web Store
- Product & docs (source private)
- LinkedIn page

#### Also built
- WriteRight Aug – Sep 2026 Self-hosted grammar checks and AI rewrites, reviewed before anything changes.
- REFLEX-AI Dec 2025 – Apr 2026 A research agent that learns from its mistakes and won’t answer without a citation.
- News-to-Video Generator Sep – Oct 2025 Headlines and images in, narrated MP4 news videos out.
- CricketStat Pro Jul – Oct 2023 · PHN Technology internship A T20 World Cup analytics pipeline feeding a Power BI selection dashboard.
- AI-Powered 3-Factor Login Jan – May 2023 · Internship deliverable at BitMap Technology Face, then email OTP, then a voice phrase, with liveness checks against spoofing.

#### Experience

**Translytics**

Software Engineer · Mar 2026 – Present · On-site

AI and backend engineering on a multi-tenant supply-chain planning SaaS.
- Ship LLM-backed features and Python backend services, from design through QA and release.

**Tata Elxsi**

Software Engineer · Dec 2023 – Feb 2026 · On-site

Two years of production Python, then a deliberate move into generative AI.
- Built a tool that turns legacy test cases into Gherkin feature files, with a web UI to review and export, cutting the manual hand-off between QA and development.
- Built FastAPI apps on LLMs and RAG (LangChain, LlamaIndex, Chroma) in the Generative AI bootcamp.

Client: Mahindra & Mahindra · BE 6 and XEV 9E Mar – Jun 2025
- Wrote Python that turns OBD diagnostic data and trouble codes into reports with automatic OK / Not-OK status.
- Validated ECU configurations over UDS and traced faults to root cause with Center of Excellence engineers.

Proprietary client work: no public repository.

**PHN Technology**

Intern · Jul 2023 – Oct 2023 · Remote

An end-to-end sports analytics pipeline for the T20 World Cup.
- Scraped ESPN Cricinfo, cleaned it in pandas and modelled a star schema in Power BI.
- Shipped a selection dashboard with role filters, drill-downs and head-to-head comparison.

**BitMap Technology**

SDE Intern · Jan 2023 – May 2023 · Hybrid

A three-factor login for online banking: face, then email OTP, then a voice phrase.
- OpenCV detection and an LBPH recogniser, with a calibration tool for thresholds.
- In testing: about 95% correct identification, and 88% of spoof attempts blocked.

#### Capabilities
- *LLM applications:*

Schema-validated structured output, behind a provider layer that swaps models.

Gemini · Claude API · Groq · Ollama · Zod · Pydantic

Proof: HireLens SearchScribe
- *RAG and retrieval:*

Chunking, embeddings and vector search, tied back to source passages.

pgvector · FAISS · Chroma · LangChain · LlamaIndex · Tavily

Proof: ForecastGPT HireLens
- *Agents and evaluation:*

Agents that cite or refuse, and evals that measure bias instead of assuming it.

Tool use · Seeded benchmarks · Kendall τ · Name-swap tests

Proof: HireLens evals REFLEX-AI
- *Backend and data:*

Typed APIs, job queues, and auth with rotating refresh tokens.

Python · FastAPI · TypeScript · Hono · PostgreSQL · Redis / RQ

Proof: SearchScribe ForecastGPT
- *Shipping:*

Next.js, Chrome extensions, Docker and CI, released to npm and the Web Store.

Next.js · React · Chrome MV3 · Docker · GitHub Actions

Proof: yDirect HireLens on npm

#### About

I like building things that actually work.

Tools, workflows, AI systems, and small utilities that make someone’s day easier. I start from the root of a problem, simplify it, and shape it into something structured and dependable.

Most of what I build now follows one rule: the model proposes, and code checks. HireLens won’t count a score whose quote isn’t in the resume. SearchScribe never lets a model write HTML.

Good engineering is clarity, not complexity: predictable behaviour, and decisions I can explain.

Based in Pune, Maharashtra, India

**Education & credentials**

B.Tech, Computer Science

Shri Guru Gobind Singhji Institute of Engineering & Technology

Aug 2019 – May 2023 · CGPA 8.80 / 10

AI Fluency: Framework & Foundations

Anthropic

OCI 2025 Certified AI Foundations Associate

Oracle · 2025

#### Contact

Open to AI engineering roles and interesting problems.

The fastest way to reach me is email. I read everything and reply to anything specific.

---

## HireLens  `/work/hirelens/`


Selected work / HireLens
### HireLens

Glass-box candidate ranking: every score cites the exact evidence it came from.
- Live demo
- Repository
- npm
- *Role:*
  Solo
- *Status:*
  v1.4.0 · released 6 Oct 2026
- *License:*
  MIT, open source
- *Stack:*
  TypeScript · Next.js 16 · Hono · Postgres + pgvector · Drizzle · Turborepo

#### The problem

Most AI screening tools return a bare number. Recruiters can’t check it, candidates can’t question it, and nobody can tell whether it treats groups of people differently.

#### Constraints

Resumes are personal data. Scoring has to work with self-hosted models through Ollama, as well as hosted providers, so a recruiter can keep resumes on their own machine.

The recruiter stays in charge. The rubric is drafted from the job description, then reviewed and edited before anything is scored.

Free-tier hosting. Vercel for the app and the API, plus a scale-to-zero Postgres with pgvector.

#### Architecture

[Diagram] dashed = LLM step · solid = code · pill = data · amber = evidence path The model proposes; code verifies. Embeddings (pgvector) power search and Ask, never scoring.

#### Decisions

**The model quotes; code finds the quote.**
- *Chose:*
  The LLM returns a verbatim quote. Deterministic code locates it in the resume and records the character offsets: an exact match first, then a whitespace-collapsed one.
- *Over:*
  Trusting offsets or citations the model reports about itself.
- *Cost:*
  A sound judgement with a paraphrased quote is set to 0 and sent to a human.

**A framework-free core.**
- *Chose:*
  The engines live in a package with no dependency on Next.js, React or any hosting SDK.
- *Over:*
  Engine code inside the web app.
- *Gain:*
  The product, the public demo and the eval harness all run the same scoring engine.

#### Evaluation

A seeded synthetic benchmark runs through the same scoring engine as the product and measures direction accuracy, self-consistency, position bias (Kendall τ under shuffled order) and name-swap bias.

#### Outcome
- v1.4.0 released 6 October 2026.
- Ships as the hirelens CLI on npm and as container images on GHCR.
- Self-hosts with one docker compose command.

---

## SearchScribe AI Studio  `/work/searchscribe/`


Selected work / SearchScribe AI Studio
### SearchScribe AI Studio

One topic becomes a researched, structured draft with SEO metadata, exported as sanitised HTML or Markdown.
- Live site
- Repository
- *Role:*
  Solo
- *Status:*
  Free public beta
- *License:*
  MIT, open source
- *Stack:*
  FastAPI · Pydantic · SQLAlchemy 2 · Postgres · Next.js 16 · Gemini · Tavily

#### The problem

Getting from a topic to something publishable means research, drafting, metadata and safe HTML: four chores, each with a way to ship something wrong or unsafe.

#### Constraints

Model output is untrusted. The model never writes HTML and never retypes a source. It returns data that code checks and renders.

One deadline for everything. Research, retries, one fallback and the SEO repair share a 100-second budget, and nothing keeps generating after it expires.

Free-tier hosting. Vercel, Render and Neon Postgres, with the limits and cold starts that come with them.

#### Architecture

[Diagram] dashed = LLM step · solid = code · pill = data · amber = evidence path The model plans, selects and writes; code fetches, checks, renders and sanitises. No step lets model text reach the page as markup.

#### Decisions

**The model returns JSON; a template writes the HTML.**
- *Chose:*
  A structured article (title, sections, paragraphs, bullets) validated by Pydantic, rendered by Jinja2 with autoescape, sanitised by nh3 and previewed in a sandboxed iframe.
- *Over:*
  Sanitising HTML the model wrote: sanitiser bypasses exist, and there’s no output contract.
- *Gain:*
  The model has no way to write markup, so a whole class of injection risk is gone.

**The model cites passages by ID.**
- *Chose:*
  The server numbers each source passage and keeps its text. The model returns passage IDs; an unknown or cross-source ID stops the run before anything is saved.
- *Over:*
  Letting the model retype or paraphrase its quotations.
- *Cost:*
  It is model-assisted source selection, not proof of accuracy, and the docs say so.

**Cookies behind a same-origin proxy.**
- *Chose:*
  Next.js proxies /api to the backend, so HttpOnly refresh cookies stay same-origin and rotate on use, with theft detection.
- *Over:*
  Bearer tokens in localStorage, which hands token theft to any XSS bug.

**A modular monolith, on purpose.**
- *Chose:*
  One FastAPI app: routers, then services, then repositories. No broker, workers or agent framework.
- *Over:*
  Celery workers from day one, or a service per feature.
- *Gain:*
  A status field already marks long generations, so they can move behind a queue later without changing routes.

#### Outcome
- Live as a free, noncommercial beta with password and Google sign-in.
- 286 backend test functions (pytest) and 141 front-end and end-to-end tests (Vitest, Playwright), counted on 15 October 2026. Ruff, mypy and builds gate CI too.
- Six architecture decision records, each naming the alternatives it rejected.

---

## ForecastGPT  `/work/forecastgpt/`


Selected work / ForecastGPT
### ForecastGPT

Turns quarterly filings and earnings calls into structured next-quarter outlooks.
- Live app (free tier, about 40 s to wake)
- Repository
- *Role:*
  Solo
- *Status:*
  Live on a free tier · Indian listed companies
- *License:*
  MIT, open source
- *Stack:*
  Python · FastAPI · LangChain · FAISS · pdfplumber · Redis / RQ · SQLAlchemy

#### The problem

Analysts spend hours reading quarterly PDFs to pull out revenue and margin trends, management tone, and the risks worth flagging.

#### Constraints

A forecast is slow. It fetches and reads several PDFs and calls a model, so it runs as a job: the API answers 202 with a job ID and the client polls.

No GPU in production. Ollama is the local default. A hosted deploy swaps in a cloud provider through configuration, with no code change.

Documents come from the open web. Filings are discovered from each company’s Screener page and fetched through SSRF-hardened code.

#### Architecture

[Diagram] dashed = LLM step · solid = code · pill = data · amber = evidence path The numbers never pass through the model as raw text: code parses them out of the filings and hands them over.

#### Decisions

**Code extracts the numbers.**
- *Chose:*
  pdfplumber and regular expressions pull the figures out of the quarterly results. The model gets them already parsed, with retrieved transcript passages, and is told to use only those inputs.
- *Over:*
  Asking the model to read figures out of the PDFs itself.
- *Gain:*
  The model interprets numbers; it never has to find them. An ungrounded model will happily invent a margin figure.

**A job queue, with an embedded worker.**
- *Chose:*
  Forecasts run as Redis/RQ jobs. On one free instance the API process starts its own worker thread.
- *Over:*
  Holding an HTTP request open for the whole run.
- *Gain:*
  Moving to a dedicated worker later is a configuration change, not a rewrite.

**Transcript analysis may fail; the forecast may not.**
- *Chose:*
  Retrieval over earnings-call transcripts is best-effort. If it fails, the outlook proceeds on the financials and says so.
- *Over:*
  Failing the whole job when one input is missing.

#### Outcome
- Live on a free Render instance; the first request after idle takes about 40 seconds.
- Covers Indian listed companies with Screener coverage. Adding one is a single registry line.
- 122 test functions run in CI with Ruff and a front-end build.

#### What I’d change next

Visual-native retrieval over investor decks, so figures in charts can be read without OCR. It is designed, on ColPali-style models, but not started.

---

## yDirect  `/work/ydirect/`


Selected work / yDirect
### yDirect

Save once, reuse in seconds: a snippet and prompt manager in Chrome’s side panel.
- Chrome Web Store
- Product & docs (source private)
- LinkedIn page
- *Role:*
  Solo
- *Status:*
  v1.3.3 · 8 Sep 2026 · Chrome Web Store
- *License:*
  Source private · docs CC BY 4.0
- *Stack:*
  Chrome MV3 · JavaScript · Firebase Auth · Firestore · Cloud Functions · Node 22

#### The problem

The same replies, prompts and templates get retyped every day. Kept in scattered notes, they are slow to find and easy to lose.

#### Constraints

Websites can’t be trusted to host the UI. The app lives in Chrome’s own side panel, outside the page’s DOM and policies. An earlier injected iframe could be blocked by strict sites.

Every permission has to earn its place. Eight Chrome permissions plus one backend origin, each with a published reason.

No remote code. Everything that runs ships in the reviewed package.

#### Architecture

[Diagram] dashed = LLM step · solid = code · pill = data · amber = evidence path Copying never needs the network. Backup and sharing do, and the server validates every one of those requests.

#### Decisions

**A native side panel, not an injected iframe.**
- *Chose:*
  Chrome’s side panel, which the browser owns.
- *Over:*
  An iframe injected into the page, which restrictive sites could block.
- *Cost:*
  It needs Chrome 116 or later.

**Google sign-in without the identity permission.**
- *Chose:*
  A short-lived offscreen document and a hosted callback complete the flow.
- *Over:*
  Requesting the identity permission.
- *Gain:*
  One fewer permission to justify to users and to store review.

**The backend is the authorisation boundary.**
- *Chose:*
  Every backup and sharing request is validated on the server. UI state is never treated as a security control.
- *Over:*
  Checks that live in the extension’s interface.

#### Outcome
- Published on the Chrome Web Store; four releases from 1.3.0 to 1.3.3 (8 September 2026).
- Free, with no paid features.
- The source is private; the public repository carries the product docs, privacy explainer and changelog.
