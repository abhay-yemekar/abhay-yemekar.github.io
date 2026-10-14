export type ProjectLink = {
  label: string
  href: string
  /** Clarifies what sits behind a link when the label alone would mislead. */
  note?: string
}

export type Metric = {
  value: string
  label: string
}

export type Project = {
  slug: string
  name: string
  /** One-line value proposition — never a tech-stack dump. */
  tagline: string
  period: string
  /** Attribution when the work was done inside a role. */
  context?: string
  problem: string
  built: string
  learned: string
  stack: string[]
  links: ProjectLink[]
  /** Measured numbers only — rendered as a stat strip. Omit when nothing is measured. */
  metrics?: Metric[]
  metricsNote?: string
  /** Drives the asymmetric layout: 'wide' spans the grid, 'half' pairs up. */
  span: 'wide' | 'half'
}

export const featuredProjects: Project[] = [
  {
    slug: 'hirelens',
    name: 'HireLens',
    tagline:
      'Glass-box candidate ranking: every score cites the exact evidence it came from.',
    period: 'Nov 2025 – Present · v1.4',
    problem:
      'Most AI screening tools return a bare number. Recruiters cannot check it, candidates cannot question it, and nobody can tell whether it treats groups of people differently.',
    built:
      'An open-source pnpm + Turborepo monorepo: Next.js over a Hono API, Postgres with pgvector through Drizzle. A rubric is derived from the job description, and every per-criterion score cites evidence spans at exact character offsets in the resume. Blind review, a four-fifths-rule bias audit and a hash-chained audit log are built in; an eval harness in CI tracks direction accuracy, self-consistency, position bias and name-swap bias. Model-agnostic, including local Ollama. Ships as the hirelens CLI on npm and as GHCR images, with an OpenAPI 3.1 contract.',
    learned:
      'A score people can check is worth more than a clever one. Tying each point to quoted text, and testing for bias in CI instead of assuming it away, ended up shaping most of the design.',
    stack: [
      'TypeScript',
      'Next.js',
      'Hono',
      'PostgreSQL',
      'pgvector',
      'Drizzle',
      'Turborepo',
      'Ollama',
    ],
    links: [
      { label: 'Live demo', href: 'https://hirelens-rosy.vercel.app/demo' },
      { label: 'Repository', href: 'https://github.com/abhay-yemekar/hirelens' },
      { label: 'npm', href: 'https://www.npmjs.com/package/hirelens' },
    ],
    span: 'wide',
  },
  {
    slug: 'searchscribe',
    name: 'SearchScribe AI Studio',
    tagline:
      'One topic becomes a researched, structured draft with SEO metadata, exported as sanitised HTML or Markdown.',
    period: 'Nov 2025 – Present',
    problem:
      'Getting from a topic to something publishable means drafting, then metadata, then sanitising HTML — three separate chores with three chances to ship something unsafe.',
    built:
      'A modular monolith: FastAPI with thin routers over services and repositories, Next.js 16 and React 19 on the front, SQLAlchemy 2 and Alembic over Postgres in production. Tavily researches the topic and passes bounded source excerpts to Gemini. Auth is Argon2id with rotating HttpOnly refresh cookies that detect theft. The LLM never emits HTML — Jinja2 renders it, nh3 sanitises it, and a sandboxed iframe previews it. Every save creates a new version. Ruff, mypy, pytest, Vitest and Playwright gate CI.',
    learned:
      'Treating model output as untrusted input changed the architecture. Once the LLM only produced structured data and deterministic code owned the rendering, a whole class of injection risk disappeared.',
    stack: [
      'FastAPI',
      'Next.js 16',
      'TypeScript',
      'PostgreSQL',
      'SQLAlchemy',
      'Gemini',
      'Tavily',
      'Playwright',
    ],
    links: [
      { label: 'Live site', href: 'https://searchscribe-ai.vercel.app' },
      {
        label: 'Repository',
        href: 'https://github.com/abhay-yemekar/SearchScribe_AI_Studio',
      },
    ],
    span: 'half',
  },
  {
    slug: 'forecastgpt',
    name: 'ForecastGPT',
    tagline:
      'Turns quarterly filings and earnings calls into structured next-quarter outlooks.',
    period: 'Oct – Nov 2025',
    problem:
      'Analysts spend hours reading quarterly PDFs to pull out revenue and margin trends, management tone, and the risks worth flagging.',
    built:
      'A FastAPI service that discovers filings, extracts text with PDFPlumber, indexes it in FAISS, and runs a document-grounded RAG pipeline through LangChain to emit a structured JSON outlook. Ollama with LLaMA 3.2 runs locally by default; OpenAI and Anthropic are env-only swaps behind one provider interface. Long jobs go through a Redis/RQ queue, with results logged to MySQL for auditability.',
    learned:
      'Grounding is everything — an ungrounded model will happily invent a margin figure. Forcing every claim back to a retrieved chunk, and putting the provider behind an interface, kept the system both honest and portable.',
    stack: [
      'Python',
      'FastAPI',
      'LangChain',
      'Ollama',
      'FAISS',
      'PDFPlumber',
      'Redis / RQ',
      'MySQL',
    ],
    links: [
      {
        label: 'Live app',
        href: 'https://forecastgpt-financial-outlook-agent.onrender.com/',
        note: 'free tier, ~40 s cold start',
      },
      {
        label: 'Repository',
        href: 'https://github.com/abhay-yemekar/forecastgpt-financial-outlook-agent',
      },
    ],
    span: 'half',
  },
  {
    slug: 'ydirect',
    name: 'yDirect',
    tagline: 'Save once, reuse in seconds — a snippet manager living in Chrome’s side panel.',
    period: 'Shipped · v1.3.3',
    problem:
      'The same replies, prompts and templates get retyped every day. Kept in scattered notes they are slow to find and easy to lose.',
    built:
      'A published Manifest V3 extension with no framework and no build step — plain ES modules, a service worker, and an offscreen document to run the Google auth flow that a service worker cannot. Firebase Functions on Node 22 back it, with Firestore rules enforcing authorisation server-side, and a strict per-page CSP with an explicit connect-src allowlist. 16 Node test suites plus a syntax gate over every entrypoint.',
    learned:
      'MV3’s lifecycle punishes assumptions about persistence. Designing for a service worker that dies at any moment, and pushing authorisation into Firestore rules rather than client code, is what made it trustworthy enough to publish.',
    stack: [
      'Chrome MV3',
      'JavaScript',
      'Firebase Auth',
      'Firestore',
      'Cloud Functions',
      'Node 22',
    ],
    links: [
      {
        label: 'Chrome Web Store',
        href: 'https://chromewebstore.google.com/detail/ehkahipeoahnbfbahlkedgdcjefejihg',
      },
      {
        label: 'Product & docs',
        href: 'https://github.com/abhay-yemekar/ydirect',
        note: 'source private',
      },
      {
        label: 'LinkedIn page',
        href: 'https://www.linkedin.com/company/ydirect/',
      },
    ],
    span: 'wide',
  },
]

export type SecondaryProject = {
  name: string
  tagline: string
  period: string
  context?: string
  stack: string[]
  href: string
}

export const secondaryProjects: SecondaryProject[] = [
  {
    name: 'WriteRight',
    tagline:
      'Self-hosted grammar checks and AI rewrites, reviewed in the page before anything changes.',
    period: 'Aug – Sep 2026',
    stack: ['JavaScript', 'Chrome MV3', 'Node.js', 'Gemini', 'LanguageTool'],
    href: 'https://github.com/abhay-yemekar/ycorrect',
  },
  {
    name: 'REFLEX-AI',
    tagline:
      'A research agent that learns from its own mistakes and refuses to answer without a citation.',
    period: 'Dec 2025 – Apr 2026',
    stack: ['Python', 'AI agents', 'Tool use', 'GitHub Actions'],
    href: 'https://github.com/abhay-yemekar/reflex-ai',
  },
  {
    name: 'News-to-Video Generator',
    tagline:
      'Turns headlines and images into narrated MP4 news videos with transitions and banners.',
    period: 'Sep – Oct 2025',
    stack: ['Flask', 'Google OAuth 2.0', 'MoviePy', 'Pillow', 'pyttsx3'],
    href: 'https://github.com/abhay-yemekar/Flask-Web-App-News-Video-Generator',
  },
  {
    name: 'CricketStat Pro',
    tagline:
      'T20 World Cup analytics pipeline feeding a Power BI dashboard for Playing XI selection.',
    period: 'Jul – Oct 2023',
    context: 'PHN Technology internship',
    stack: ['Python', 'pandas', 'Bright Data', 'Power Query', 'DAX', 'Power BI'],
    href: 'https://github.com/abhay-yemekar/CricketStat-Pro-Data-Engineering-Visualization-Project-Using-Python-and-Power-BI',
  },
  {
    name: 'AI-Powered 3-Factor Login',
    tagline:
      'Face, then email OTP, then voice phrase — with liveness detection to stop spoofing.',
    period: 'Jan – May 2023',
    context: 'Internship deliverable at BitMap Technology',
    stack: [
      'Python',
      'OpenCV',
      'TensorFlow',
      'Speech Recognition',
      'Tkinter',
      'SQLite',
    ],
    href: 'https://github.com/abhay-yemekar/Modern-Online-Banking-Authentication-System-using-AI',
  },
]
