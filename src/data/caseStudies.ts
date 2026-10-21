import type { Todo } from '../lib/todo'
import type { ProjectLink } from './projects'

/**
 * Case studies, one page each at /work/<slug>/ (docs/STRATEGY.md §4).
 *
 * Every claim should be checkable. `cites` points at the file in the project's
 * public repo that backs it. yDirect's source is private, so it cites public
 * docs only. Numbers are measured (with source and date) or a Todo; never
 * estimated.
 */

export type SourceRef = { label: string; href: string }

export type Measured = {
  value: string
  label: string
  source: SourceRef
  /** ISO date the number was produced. */
  measuredAt: string
}

export type Decision = {
  title: string
  chose: string
  over: string
  cost?: string
  gain?: string
  cites?: SourceRef[]
}

export type DiagramNode = {
  id: string
  /** llm = model step (dashed); code = deterministic (solid); data = artefact (pill). */
  kind: 'llm' | 'code' | 'data'
  title: string
  sub?: string
  /** Desktop layout, in viewBox units. Boxes are 210 × 58. */
  x: number
  y: number
  /** On the trust path, drawn in amber. */
  hot?: boolean
  /** A failure branch, drawn dotted. */
  warn?: boolean
}

export type DiagramEdge = {
  /** Hand-routed SVG path in viewBox units. */
  d: string
  hot?: boolean
  label?: { text: string; x: number; y: number }
}

export type DiagramSpec = {
  title: string
  /** Full prose description for screen readers and the no-SVG layout. */
  description: string
  width: number
  height: number
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  /** Node ids in reading order, for the stacked layout below 1024px. */
  order: string[]
  /** Short notes shown under a node in the stacked layout, e.g. a branch. */
  branches?: Record<string, string>
}

export type CaseStudy = {
  slug: string
  name: string
  tagline: string
  /** Shown under the name on the home page, e.g. "Nov 2025 – present · v1.4". */
  period: string
  /** Shown on the home page entry. ≤ 30 words. */
  summary: string
  /** The engineering pattern in a few words, e.g. "Model output as untrusted input". */
  pattern: string
  glance: { role: string | Todo; status: string; license?: string; stack: string[] }
  links: ProjectLink[]
  problem: string
  constraints: { claim: string; detail: string; cites?: SourceRef[] }[]
  architecture: { diagram: DiagramSpec; caption: string }
  /** Shows the interactive HireLens explainer (real engine output) after the architecture. */
  explainer?: boolean
  /** Set while decision wording awaits Abhay's confirmation (Gate 3). */
  decisionsDraft?: boolean
  decisions: Decision[]
  evaluation?: { method: string; results: (Measured | Todo)[]; note?: string }
  outcome: { facts: string[]; metrics?: Measured[] }
  next: string | Todo
  og: { title: string; subtitle: string }
  /** Drives the page's JSON-LD (src/lib/structured-data.ts). */
  structured:
    | { type: 'SoftwareSourceCode'; languages: string[]; version?: string }
    | { type: 'SoftwareApplication'; category: string; operatingSystem: string; version: string; installUrl: string }
}

const HIRELENS_REPO = 'https://github.com/abhay-yemekar/hirelens'
const hl = (path: string): SourceRef => ({ label: path, href: `${HIRELENS_REPO}/blob/main/${path}` })
const hlTree = (path: string): SourceRef => ({ label: path, href: `${HIRELENS_REPO}/tree/main/${path}` })

const hirelensDiagram: DiagramSpec = {
  title: 'HireLens scoring pipeline',
  description:
    'A job description becomes a rubric through an LLM step. A resume is extracted, parsed and optionally masked by deterministic code. An LLM scores each criterion and returns a quote. Deterministic code then locates that quote in the resume. If it is found, it becomes an evidence span with character offsets, which feeds a weighted overall score and a hash-chained audit log. If it is not found, the score is set to zero and flagged for review.',
  width: 1000,
  height: 420,
  nodes: [
    { id: 'jd', kind: 'data', title: 'Job description', sub: 'pasted text', x: 20, y: 24 },
    { id: 'derive', kind: 'llm', title: 'Derive rubric', sub: 'LLM · Zod-validated', x: 270, y: 24 },
    { id: 'rubric', kind: 'data', title: 'Rubric', sub: '5–8 weighted criteria', x: 520, y: 24 },
    { id: 'resume', kind: 'data', title: 'Resume', sub: 'PDF · DOCX · TXT', x: 20, y: 124 },
    { id: 'parse', kind: 'code', title: 'Extract + parse', sub: 'deterministic', x: 270, y: 124 },
    { id: 'mask', kind: 'code', title: 'Blind mask', sub: 'optional · offsets kept', x: 520, y: 124 },
    { id: 'score', kind: 'llm', title: 'Score each criterion', sub: 'LLM · temperature 0', x: 770, y: 74 },
    { id: 'locate', kind: 'code', title: 'Locate the quote', sub: 'exact match → offsets', x: 770, y: 240 },
    { id: 'zero', kind: 'code', title: 'Score set to 0', sub: 'flagged for review', x: 770, y: 350, warn: true },
    { id: 'span', kind: 'data', title: 'Evidence span', sub: 'chars [start, end)', x: 520, y: 240, hot: true },
    { id: 'overall', kind: 'code', title: 'Weighted overall', sub: '0–100', x: 270, y: 240 },
    { id: 'audit', kind: 'code', title: 'Audit log', sub: 'hash-chained', x: 20, y: 240 },
  ],
  edges: [
    { d: 'M230 53 H262' },
    { d: 'M480 53 H512' },
    { d: 'M230 153 H262' },
    { d: 'M480 153 H512' },
    { d: 'M730 53 H748 V92 H762' },
    { d: 'M730 153 H748 V116 H762' },
    { d: 'M875 133 V232', label: { text: 'quote', x: 885, y: 190 } },
    { d: 'M770 269 H738', hot: true, label: { text: 'found', x: 731, y: 258 } },
    { d: 'M875 298 V342', label: { text: 'not found', x: 885, y: 326 } },
    { d: 'M520 269 H488', hot: true },
    { d: 'M270 269 H238', hot: true },
  ],
  order: ['jd', 'derive', 'rubric', 'resume', 'parse', 'mask', 'score', 'locate', 'span', 'overall', 'audit'],
  branches: { locate: 'If the quote is not in the resume, the score is set to 0 and flagged for review.' },
}

const SEARCHSCRIBE_REPO = 'https://github.com/abhay-yemekar/SearchScribe_AI_Studio'
const FORECAST_REPO = 'https://github.com/abhay-yemekar/forecastgpt-financial-outlook-agent'
// Public docs repo only. yDirect's source is private and is never cited.
const YDIRECT_REPO = 'https://github.com/abhay-yemekar/ydirect'
const ss = (path: string): SourceRef => ({ label: path, href: `${SEARCHSCRIBE_REPO}/blob/main/${path}` })
const fg = (path: string): SourceRef => ({ label: path, href: `${FORECAST_REPO}/blob/main/${path}` })
const yd = (path: string): SourceRef => ({ label: path, href: `${YDIRECT_REPO}/blob/main/${path}` })

/*
 * The three diagrams below share one layout: columns at x = 20, 270, 520, 770
 * (boxes 210 × 58), read as a snake: left to right, down, right to left, down,
 * left to right.
 */

const searchscribeDiagram: DiagramSpec = {
  title: 'SearchScribe generation pipeline',
  description:
    'A topic goes to a research-planning model call, then to bounded Tavily searches that return at most five source records. A model selects relevant passages by ID; code checks every ID belongs to a fetched source and stops on unknown ones. A writer model returns a structured article as JSON, which Pydantic validates. Code then renders the article with a Jinja2 template, sanitises the HTML with nh3, saves it as a new version, and shows it in a sandboxed preview.',
  width: 1000,
  height: 340,
  nodes: [
    { id: 'topic', kind: 'data', title: 'Topic', sub: 'from the editor', x: 20, y: 24 },
    { id: 'plan', kind: 'llm', title: 'Plan research', sub: 'LLM · 15 s cap', x: 270, y: 24 },
    { id: 'search', kind: 'code', title: 'Tavily search', sub: 'byte-bounded', x: 520, y: 24 },
    { id: 'sources', kind: 'data', title: 'Source records', sub: 'at most 5', x: 770, y: 24 },
    { id: 'select', kind: 'llm', title: 'Select evidence', sub: 'LLM · returns IDs', x: 770, y: 144 },
    { id: 'check', kind: 'code', title: 'Check passage IDs', sub: 'server owns the text', x: 520, y: 144, hot: true },
    { id: 'write', kind: 'llm', title: 'Write article', sub: 'LLM · JSON schema', x: 270, y: 144 },
    { id: 'validate', kind: 'code', title: 'Validate', sub: 'Pydantic', x: 20, y: 144 },
    { id: 'render', kind: 'code', title: 'Render', sub: 'Jinja2 · autoescape', x: 20, y: 264, hot: true },
    { id: 'sanitise', kind: 'code', title: 'Sanitise', sub: 'nh3', x: 270, y: 264, hot: true },
    { id: 'save', kind: 'data', title: 'New version', sub: 'every save', x: 520, y: 264 },
    { id: 'preview', kind: 'code', title: 'Preview', sub: 'sandboxed iframe', x: 770, y: 264 },
  ],
  edges: [
    { d: 'M230 53 H262' },
    { d: 'M480 53 H512' },
    { d: 'M730 53 H762' },
    { d: 'M875 82 V136' },
    { d: 'M770 173 H738', hot: true },
    { d: 'M520 173 H488' },
    { d: 'M270 173 H238' },
    { d: 'M125 202 V256', hot: true },
    { d: 'M230 293 H262', hot: true },
    { d: 'M480 293 H512' },
    { d: 'M730 293 H762' },
  ],
  order: ['topic', 'plan', 'search', 'sources', 'select', 'check', 'write', 'validate', 'render', 'sanitise', 'save', 'preview'],
  branches: {
    check: 'An unknown or cross-source passage ID stops the run before anything is saved.',
    validate: 'Invalid output returns an error. No placeholder article is ever saved.',
  },
}

const forecastDiagram: DiagramSpec = {
  title: 'ForecastGPT job pipeline',
  description:
    'A request names a company. The API answers 202 with a job ID and puts the job on a Redis queue. A worker fetches filings from the company’s Screener page, extracts the financial figures with pdfplumber and regular expressions, and retrieves transcript passages from a FAISS index for six fixed themes. A model writes the outlook from those inputs only. Code parses the JSON, stores the result, and the client polls for it.',
  width: 1000,
  height: 340,
  nodes: [
    { id: 'request', kind: 'data', title: 'Request', sub: 'company + question', x: 20, y: 24 },
    { id: 'api', kind: 'code', title: 'API', sub: '202 + job ID', x: 270, y: 24 },
    { id: 'queue', kind: 'data', title: 'Job queue', sub: 'Redis · RQ', x: 520, y: 24 },
    { id: 'worker', kind: 'code', title: 'Worker', sub: 'embedded or separate', x: 770, y: 24 },
    { id: 'fetch', kind: 'code', title: 'Fetch filings', sub: 'SSRF-hardened', x: 770, y: 144 },
    { id: 'extract', kind: 'code', title: 'Extract figures', sub: 'pdfplumber + regex', x: 520, y: 144, hot: true },
    { id: 'rag', kind: 'code', title: 'Retrieve passages', sub: 'FAISS · 6 themes', x: 270, y: 144 },
    { id: 'write', kind: 'llm', title: 'Write outlook', sub: 'LLM · given inputs only', x: 20, y: 144 },
    { id: 'parse', kind: 'code', title: 'Parse JSON', sub: 'structured outlook', x: 20, y: 264 },
    { id: 'store', kind: 'data', title: 'Result', sub: 'logged to SQL', x: 270, y: 264 },
    { id: 'poll', kind: 'code', title: 'Poll', sub: 'GET /forecasts/{id}', x: 520, y: 264 },
  ],
  edges: [
    { d: 'M230 53 H262' },
    { d: 'M480 53 H512' },
    { d: 'M730 53 H762' },
    { d: 'M875 82 V136' },
    { d: 'M770 173 H738', hot: true },
    { d: 'M520 173 H488', hot: true },
    { d: 'M270 173 H238', hot: true },
    { d: 'M125 202 V256' },
    { d: 'M230 293 H262' },
    { d: 'M480 293 H512' },
  ],
  order: ['request', 'api', 'queue', 'worker', 'fetch', 'extract', 'rag', 'write', 'parse', 'store', 'poll'],
  branches: {
    rag: 'Best-effort: if transcript analysis fails, the outlook proceeds on the financials and says so.',
  },
}

const ydirectDiagram: DiagramSpec = {
  title: 'yDirect data flow',
  description:
    'The side panel stores snippets in per-account Chrome local storage, and copying writes to the clipboard with no network request; the user pastes. Signing in with Google goes through a short-lived offscreen document to Firebase Auth. Backup and folder sharing are authenticated requests to Cloud Functions, which validate each request on the server before reading or writing Firestore.',
  width: 1000,
  height: 220,
  nodes: [
    { id: 'panel', kind: 'code', title: 'Side panel', sub: 'browser-owned', x: 20, y: 24 },
    { id: 'local', kind: 'data', title: 'Local storage', sub: 'per account', x: 270, y: 24 },
    { id: 'clip', kind: 'code', title: 'Copy', sub: 'clipboard · no network', x: 520, y: 24 },
    { id: 'signin', kind: 'code', title: 'Google sign-in', sub: 'offscreen document', x: 20, y: 144 },
    { id: 'auth', kind: 'code', title: 'Firebase Auth', sub: 'session', x: 270, y: 144 },
    { id: 'functions', kind: 'code', title: 'Cloud Functions', sub: 'validates every request', x: 520, y: 144, hot: true },
    { id: 'store', kind: 'data', title: 'Firestore', sub: 'backups · shared folders', x: 770, y: 144 },
  ],
  edges: [
    { d: 'M230 53 H262' },
    { d: 'M480 53 H512' },
    { d: 'M125 82 V136' },
    { d: 'M230 173 H262' },
    { d: 'M480 173 H512', hot: true },
    { d: 'M730 173 H762', hot: true },
  ],
  order: ['panel', 'local', 'clip', 'signin', 'auth', 'functions', 'store'],
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'hirelens',
    name: 'HireLens',
    tagline: 'Glass-box candidate ranking: every score cites the exact evidence it came from.',
    period: 'Nov 2025 – present · v1.4',
    summary:
      'Scores a resume against a rubric you control. The model quotes its evidence, and code checks the quote is really in the resume before the score counts.',
    pattern: 'The model proposes; code verifies',
    explainer: true,
    glance: {
      role: 'Solo',
      status: 'v1.4.0 · released 6 Oct 2026',
      license: 'MIT, open source',
      stack: ['TypeScript', 'Next.js 16', 'Hono', 'Postgres + pgvector', 'Drizzle', 'Turborepo'],
    },
    links: [
      { label: 'Live demo', href: 'https://hirelens-rosy.vercel.app/demo' },
      { label: 'Repository', href: HIRELENS_REPO },
      { label: 'npm', href: 'https://www.npmjs.com/package/hirelens' },
    ],
    problem:
      'Most AI screening tools return a bare number. Recruiters can’t check it, candidates can’t question it, and nobody can tell whether it treats groups of people differently.',
    constraints: [
      {
        claim: 'Resumes are personal data.',
        detail:
          'Scoring has to work with self-hosted models through Ollama, as well as hosted providers, so a recruiter can keep resumes on their own machine.',
        cites: [hl('packages/core/src/llm/config.ts')],
      },
      {
        claim: 'The recruiter stays in charge.',
        detail:
          'The rubric is drafted from the job description, then reviewed and edited before anything is scored.',
        cites: [hl('packages/core/src/rubric/derive.ts')],
      },
      {
        claim: 'Free-tier hosting.',
        detail: 'Vercel for the app and the API, plus a scale-to-zero Postgres with pgvector.',
      },
    ],
    architecture: {
      diagram: hirelensDiagram,
      caption: 'The model proposes; code verifies. Embeddings (pgvector) power search and Ask, never scoring.',
    },
    decisionsDraft: true,
    decisions: [
      {
        title: 'The model quotes; code finds the quote.',
        chose:
          'The LLM returns a verbatim quote. Deterministic code locates it in the resume and records the character offsets: an exact match first, then a whitespace-collapsed one.',
        over: 'Trusting offsets or citations the model reports about itself.',
        cost: 'A sound judgement with a paraphrased quote is set to 0 and sent to a human.',
        cites: [hl('packages/core/src/evidence/textSpan.ts')],
      },
      {
        title: 'A framework-free core.',
        chose: 'The engines live in a package with no dependency on Next.js, React or any hosting SDK.',
        over: 'Engine code inside the web app.',
        gain: 'The product, the public demo and the eval harness all run the same scoring engine.',
        cites: [hl('ARCHITECTURE.md'), hlTree('packages/core')],
      },
    ],
    evaluation: {
      method:
        'A seeded synthetic benchmark runs through the same scoring engine as the product and measures direction accuracy, self-consistency, position bias (Kendall τ under shuffled order) and name-swap bias.',
      // Gate 3 decision: method only for launch. A run against local
      // ollama/llama3.2:3b (2026-10-15) broke the scoring schema twice and the
      // harness stopped, as designed. Publish numbers only from a live run.
      results: [],
      note: 'No benchmark numbers are published yet. The repo’s committed report is a mock-model plumbing run, and its README says so.',
    },
    outcome: {
      facts: [
        'v1.4.0 released 6 October 2026.',
        'Ships as the hirelens CLI on npm and as container images on GHCR.',
        'Self-hosts with one docker compose command.',
      ],
      metrics: [
        {
          value: '522',
          label: 'npm downloads of the hirelens CLI, 12 Sep – 11 Oct 2026',
          source: {
            label: 'npm downloads API',
            href: 'https://api.npmjs.org/downloads/point/2026-09-12:2026-10-11/hirelens',
          },
          measuredAt: '2026-10-15',
        },
      ],
    },
    // From the README roadmap, plus the CI gap found while writing this case study.
    next: 'Run the seeded benchmark in CI against a real model, so accuracy and name-swap bias are measured on every change rather than only unit-tested. Then the roadmap items for teams: SSO and SAML, finer-grained roles, and i18n.',
    og: { title: 'HireLens', subtitle: 'Every score cites the exact evidence it came from.' },
    structured: { type: 'SoftwareSourceCode', languages: ['TypeScript'], version: '1.4.0' },
  },
  {
    slug: 'searchscribe',
    name: 'SearchScribe AI Studio',
    tagline:
      'One topic becomes a researched, structured draft with SEO metadata, exported as sanitised HTML or Markdown.',
    period: 'Nov 2025 – present',
    summary:
      'A topic in, a researched draft out. The model picks source passages by ID and returns structured JSON; code owns the quotes, the HTML and the sanitising.',
    pattern: 'Model output as untrusted input',
    glance: {
      role: 'Solo',
      status: 'Free public beta',
      license: 'MIT, open source',
      stack: ['FastAPI', 'Pydantic', 'SQLAlchemy 2', 'Postgres', 'Next.js 16', 'Gemini', 'Tavily'],
    },
    links: [
      { label: 'Live site', href: 'https://searchscribe-ai.vercel.app' },
      { label: 'Repository', href: SEARCHSCRIBE_REPO },
    ],
    problem:
      'Getting from a topic to something publishable means research, drafting, metadata and safe HTML: four chores, each with a way to ship something wrong or unsafe.',
    constraints: [
      {
        claim: 'Model output is untrusted.',
        detail: 'The model never writes HTML and never retypes a source. It returns data that code checks and renders.',
        cites: [ss('docs/decisions/ADR-004-deterministic-html-rendering.md')],
      },
      {
        claim: 'One deadline for everything.',
        detail:
          'Research, retries, one fallback and the SEO repair share a 100-second budget, and nothing keeps generating after it expires.',
        cites: [ss('docs/ai-architecture.md')],
      },
      {
        claim: 'Free-tier hosting.',
        detail: 'Vercel, Render and Neon Postgres, with the limits and cold starts that come with them.',
        cites: [ss('README.md')],
      },
    ],
    architecture: {
      diagram: searchscribeDiagram,
      caption:
        'The model plans, selects and writes; code fetches, checks, renders and sanitises. No step lets model text reach the page as markup.',
    },
    decisionsDraft: true,
    decisions: [
      {
        title: 'The model returns JSON; a template writes the HTML.',
        chose:
          'A structured article (title, sections, paragraphs, bullets) validated by Pydantic, rendered by Jinja2 with autoescape, sanitised by nh3 and previewed in a sandboxed iframe.',
        over: 'Sanitising HTML the model wrote: sanitiser bypasses exist, and there’s no output contract.',
        gain: 'The model has no way to write markup, so a whole class of injection risk is gone.',
        cites: [ss('docs/decisions/ADR-004-deterministic-html-rendering.md')],
      },
      {
        title: 'The model cites passages by ID.',
        chose:
          'The server numbers each source passage and keeps its text. The model returns passage IDs; an unknown or cross-source ID stops the run before anything is saved.',
        over: 'Letting the model retype or paraphrase its quotations.',
        cost: 'It is model-assisted source selection, not proof of accuracy, and the docs say so.',
        cites: [ss('docs/ai-architecture.md')],
      },
      {
        title: 'Cookies behind a same-origin proxy.',
        chose:
          'Next.js proxies /api to the backend, so HttpOnly refresh cookies stay same-origin and rotate on use, with theft detection.',
        over: 'Bearer tokens in localStorage, which hands token theft to any XSS bug.',
        cites: [ss('docs/decisions/ADR-005-token-strategy-and-same-origin-proxy.md')],
      },
      {
        title: 'A modular monolith, on purpose.',
        chose: 'One FastAPI app: routers, then services, then repositories. No broker, workers or agent framework.',
        over: 'Celery workers from day one, or a service per feature.',
        gain: 'A status field already marks long generations, so they can move behind a queue later without changing routes.',
        cites: [ss('docs/decisions/ADR-006-modular-monolith-scope.md')],
      },
    ],
    outcome: {
      facts: [
        'Live as a free, noncommercial beta with password and Google sign-in.',
        '286 backend test functions (pytest) and 141 front-end and end-to-end tests (Vitest, Playwright), counted on 15 October 2026. Ruff, mypy and builds gate CI too.',
        'Six architecture decision records, each naming the alternatives it rejected.',
      ],
    },
    // From the README's beta status: features still planned or switched off.
    next: 'Turn on draft review in the live beta once it passes its quality gate, so every paragraph is checked against the excerpts it came from before a draft is saved. Then persistent daily quotas and rehearsed backup restores.',
    og: { title: 'SearchScribe', subtitle: 'The model never writes HTML.' },
    structured: { type: 'SoftwareSourceCode', languages: ['Python', 'TypeScript'] },
  },
  {
    slug: 'forecastgpt',
    name: 'ForecastGPT',
    tagline: 'Turns quarterly filings and earnings calls into structured next-quarter outlooks.',
    // Start from Abhay's original dates; end from the last commit (2026-09-17).
    period: 'Oct 2025 – Sep 2026',
    summary:
      'Quarterly results and earnings calls in, a structured outlook out. Code extracts the numbers; the model writes the narrative from inputs it is handed.',
    pattern: 'Code extracts the numbers',
    glance: {
      role: 'Solo',
      status: 'Live on a free tier · Indian listed companies',
      license: 'MIT, open source',
      stack: ['Python', 'FastAPI', 'LangChain', 'FAISS', 'pdfplumber', 'Redis / RQ', 'SQLAlchemy'],
    },
    links: [
      {
        label: 'Live app',
        href: 'https://forecastgpt-financial-outlook-agent.onrender.com/',
        note: 'free tier, about 40 s to wake',
      },
      { label: 'Repository', href: FORECAST_REPO },
    ],
    problem:
      'Analysts spend hours reading quarterly PDFs to pull out revenue and margin trends, management tone, and the risks worth flagging.',
    constraints: [
      {
        claim: 'A forecast is slow.',
        detail:
          'It fetches and reads several PDFs and calls a model, so it runs as a job: the API answers 202 with a job ID and the client polls.',
        cites: [fg('README.md'), fg('app/jobs.py')],
      },
      {
        claim: 'No GPU in production.',
        detail:
          'Ollama is the local default. A hosted deploy swaps in a cloud provider through configuration, with no code change.',
        cites: [fg('app/config.py')],
      },
      {
        claim: 'Documents come from the open web.',
        detail: 'Filings are discovered from each company’s Screener page and fetched through SSRF-hardened code.',
        cites: [fg('app/utils/fetcher.py')],
      },
    ],
    architecture: {
      diagram: forecastDiagram,
      caption:
        'The numbers never pass through the model as raw text: code parses them out of the filings and hands them over.',
    },
    decisionsDraft: true,
    decisions: [
      {
        title: 'Code extracts the numbers.',
        chose:
          'pdfplumber and regular expressions pull the figures out of the quarterly results. The model gets them already parsed, with retrieved transcript passages, and is told to use only those inputs.',
        over: 'Asking the model to read figures out of the PDFs itself.',
        gain: 'The model interprets numbers; it never has to find them. An ungrounded model will happily invent a margin figure.',
        cites: [fg('app/tools/financial_extractor.py'), fg('app/agent.py')],
      },
      {
        title: 'A job queue, with an embedded worker.',
        chose:
          'Forecasts run as Redis/RQ jobs. On one free instance the API process starts its own worker thread.',
        over: 'Holding an HTTP request open for the whole run.',
        gain: 'Moving to a dedicated worker later is a configuration change, not a rewrite.',
        cites: [fg('docs/DEPLOY.md'), fg('app/worker.py')],
      },
      {
        title: 'Transcript analysis may fail; the forecast may not.',
        chose:
          'Retrieval over earnings-call transcripts is best-effort. If it fails, the outlook proceeds on the financials and says so.',
        over: 'Failing the whole job when one input is missing.',
        cites: [fg('app/agent.py')],
      },
    ],
    outcome: {
      facts: [
        'Live on a free Render instance; the first request after idle takes about 40 seconds.',
        'Covers Indian listed companies with Screener coverage. Adding one is a single registry line.',
        '122 test functions run in CI with Ruff and a front-end build.',
      ],
    },
    next: 'Visual-native retrieval over investor decks, so figures in charts can be read without OCR. It is designed, on ColPali-style models, but not started.',
    og: { title: 'ForecastGPT', subtitle: 'Code extracts the numbers. The model writes.' },
    structured: { type: 'SoftwareSourceCode', languages: ['Python'] },
  },
  {
    slug: 'ydirect',
    name: 'yDirect',
    tagline: 'Save once, reuse in seconds: a snippet and prompt manager in Chrome’s side panel.',
    period: 'Shipped · v1.3.3',
    summary:
      'A published Chrome extension for reusable snippets and prompts. Copying stays on the device; anything that touches the cloud is authorised by the server, not the UI.',
    pattern: 'The server is the authorisation boundary',
    glance: {
      role: 'Solo',
      status: 'v1.3.3 · 8 Sep 2026 · Chrome Web Store',
      license: 'Source private · docs CC BY 4.0',
      stack: ['Chrome MV3', 'JavaScript', 'Firebase Auth', 'Firestore', 'Cloud Functions', 'Node 22'],
    },
    links: [
      // The product site, live since 2026-10 (was unlinked while in development).
      { label: 'Website', href: 'https://ydirect.tech/' },
      {
        label: 'Chrome Web Store',
        href: 'https://chromewebstore.google.com/detail/ehkahipeoahnbfbahlkedgdcjefejihg',
      },
      { label: 'Product & docs', href: YDIRECT_REPO, note: 'source private' },
      { label: 'LinkedIn page', href: 'https://www.linkedin.com/company/ydirect/' },
    ],
    problem:
      'The same replies, prompts and templates get retyped every day. Kept in scattered notes, they are slow to find and easy to lose.',
    constraints: [
      {
        claim: 'Websites can’t be trusted to host the UI.',
        detail:
          'The app lives in Chrome’s own side panel, outside the page’s DOM and policies. An earlier injected iframe could be blocked by strict sites.',
        cites: [yd('docs/FAQ.md'), yd('CHANGELOG.md')],
      },
      {
        claim: 'Every permission has to earn its place.',
        detail: 'Eight Chrome permissions plus one backend origin, each with a published reason.',
        cites: [yd('docs/PRIVACY-AND-PERMISSIONS.md')],
      },
      {
        claim: 'No remote code.',
        detail: 'Everything that runs ships in the reviewed package.',
        cites: [yd('docs/PRIVACY-AND-PERMISSIONS.md')],
      },
    ],
    architecture: {
      diagram: ydirectDiagram,
      caption:
        'Copying never needs the network. Backup and sharing do, and the server validates every one of those requests.',
    },
    decisionsDraft: true,
    decisions: [
      {
        title: 'A native side panel, not an injected iframe.',
        chose: 'Chrome’s side panel, which the browser owns.',
        over: 'An iframe injected into the page, which restrictive sites could block.',
        cost: 'It needs Chrome 116 or later.',
        cites: [yd('CHANGELOG.md'), yd('docs/FAQ.md')],
      },
      {
        title: 'Google sign-in without the identity permission.',
        chose: 'A short-lived offscreen document and a hosted callback complete the flow.',
        over: 'Requesting the identity permission.',
        gain: 'One fewer permission to justify to users and to store review.',
        cites: [yd('docs/ARCHITECTURE.md')],
      },
      {
        title: 'The backend is the authorisation boundary.',
        chose: 'Every backup and sharing request is validated on the server. UI state is never treated as a security control.',
        over: 'Checks that live in the extension’s interface.',
        cites: [yd('docs/ARCHITECTURE.md'), yd('docs/PRODUCT.md')],
      },
    ],
    outcome: {
      facts: [
        'Published on the Chrome Web Store; four releases from 1.3.0 to 1.3.3 (8 September 2026).',
        'Free, with no paid features.',
        'The source is private; the public repository carries the product docs, privacy explainer and changelog.',
      ],
    },
    // From the public roadmap's Now and Next columns.
    next: 'A smoother first run and a fully keyboard-first side panel, then an accessibility review against current WCAG guidance and faster search for large libraries.',
    og: { title: 'yDirect', subtitle: 'Snippets and prompts in Chrome’s side panel.' },
    structured: {
      type: 'SoftwareApplication',
      category: 'BrowserApplication',
      operatingSystem: 'Chrome',
      version: '1.3.3',
      installUrl: 'https://chromewebstore.google.com/detail/ehkahipeoahnbfbahlkedgdcjefejihg',
    },
  },
]

export const caseStudyBySlug = (slug: string) => caseStudies.find((study) => study.slug === slug)
