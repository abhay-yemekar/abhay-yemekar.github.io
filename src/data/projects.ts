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
  /** Only the 3-factor login has measured numbers; they get a stat strip. */
  metrics?: Metric[]
  metricsNote?: string
  /** Drives the asymmetric layout: 'wide' spans the grid, 'half' pairs up. */
  span: 'wide' | 'half'
}

export const featuredProjects: Project[] = [
  {
    slug: 'ydirect',
    name: 'yDirect',
    tagline: 'Save once, reuse in seconds — a snippet manager living in Chrome’s side panel.',
    period: 'Shipped · v1.3.2',
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
    ],
    span: 'wide',
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
        label: 'Repository',
        href: 'https://github.com/abhay-yemekar/forecastgpt-financial-outlook-agent',
      },
    ],
    span: 'half',
  },
  {
    slug: 'searchscribe',
    name: 'SearchScribe AI Studio',
    tagline:
      'One query becomes a structured article, validated SEO metadata, and publish-ready HTML.',
    period: 'Nov 2025 – Present',
    problem:
      'Getting from a topic to something publishable means drafting, then metadata, then sanitising HTML — three separate chores with three chances to ship something unsafe.',
    built:
      'A modular monolith: FastAPI with thin routers over services and repositories, Next.js 14 App Router on the front, PostgreSQL through SQLAlchemy 2.x and Alembic. Auth is Argon2id with short-lived access tokens and rotating HttpOnly refresh cookies that detect theft. The LLM never emits HTML — Jinja2 renders it, nh3 sanitises it, and a sandboxed iframe previews it. Every rewrite creates an immutable version. 55 backend tests, Vitest and Playwright, Docker and CI.',
    learned:
      'Treating model output as untrusted input changed the architecture. Once the LLM only produced structured data and deterministic code owned the rendering, a whole class of injection risk disappeared.',
    stack: [
      'FastAPI',
      'Next.js 14',
      'TypeScript',
      'PostgreSQL',
      'SQLAlchemy',
      'Gemini',
      'Playwright',
      'Docker',
    ],
    links: [
      { label: 'Live site', href: 'https://search-scribe-ai-studio.vercel.app' },
      {
        label: 'Repository',
        href: 'https://github.com/abhay-yemekar/SearchScribe_AI_Studio',
      },
    ],
    span: 'half',
  },
  {
    slug: 'three-factor-login',
    name: 'AI-Powered 3-Factor Login',
    tagline:
      'Face, then email OTP, then voice phrase — with liveness detection to stop spoofing.',
    period: 'Jan – May 2023',
    context: 'Internship deliverable at BitMap Technology',
    problem:
      'Single-factor login is weak, and a face check alone is trivially defeated by holding up a photo or a phone screen.',
    built:
      'A desktop authentication flow chaining three independent factors, with an on-device liveness model rejecting print and screen replays. An LBPH recognition model paired with a calibration tool that visualises confidence distributions so the threshold is chosen from data, not guesswork. The Tkinter GUI stays responsive via threads and async subprocesses, on a pinned, reproducible Windows environment.',
    learned:
      'Measuring the thing is what makes it real. Building the calibration tool first turned a vague “it usually works” into a defensible FRR/FAR trade-off I could actually justify.',
    stack: [
      'Python',
      'OpenCV',
      'TensorFlow',
      'Speech Recognition',
      'Tkinter',
      'SQLite',
    ],
    metrics: [
      { value: '~95%', label: 'Correct identification' },
      { value: '~88%', label: 'Spoof attempts blocked' },
      { value: '~92%', label: 'Voice first-try pass' },
      { value: '<50ms', label: 'Face inference / frame' },
    ],
    metricsNote:
      'Measured in a demo environment: ~200 attempts in indoor lighting, FRR ~4%, FAR ~1–2%, end-to-end auth 10–15s.',
    links: [
      {
        label: 'Repository',
        href: 'https://github.com/abhay-yemekar/Modern-Online-Banking-Authentication-System-using-AI',
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
    name: 'CricketStat Pro',
    tagline:
      'T20 World Cup analytics pipeline feeding a Power BI dashboard for Playing XI selection.',
    period: 'Jul – Oct 2023',
    context: 'PHN Technology internship',
    stack: ['Python', 'pandas', 'Bright Data', 'Power Query', 'DAX', 'Power BI'],
    href: 'https://github.com/abhay-yemekar/CricketStat-Pro-Data-Engineering-Visualization-Project-Using-Python-and-Power-BI',
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
    name: 'Resume Screening Tool',
    tagline:
      'Matches resumes against job descriptions using RAG and embedding similarity.',
    period: '2025',
    stack: ['FastAPI', 'TypeScript', 'RAG', 'Embeddings'],
    href: 'https://github.com/abhay-yemekar/Resume-Screening-Tool-with-RAG-LLM-Powered-',
  },
]
