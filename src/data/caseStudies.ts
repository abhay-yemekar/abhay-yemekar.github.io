import { todo, type Todo } from '../lib/todo'
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
  /** Shown on the home page entry. ≤ 30 words. */
  summary: string
  /** The engineering pattern in a few words, e.g. "Model output as untrusted input". */
  pattern: string
  glance: { role: string | Todo; status: string; license?: string; stack: string[] }
  links: ProjectLink[]
  problem: string
  constraints: { claim: string; detail: string; cites?: SourceRef[] }[]
  architecture: { diagram: DiagramSpec; caption: string }
  /** Set while decision wording awaits Abhay's confirmation (Gate 3). */
  decisionsDraft?: boolean
  decisions: Decision[]
  evaluation?: { method: string; results: (Measured | Todo)[]; note?: string }
  outcome: { facts: string[]; metrics?: Measured[] }
  next: string | Todo
  og: { title: string; subtitle: string }
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

export const caseStudies: CaseStudy[] = [
  {
    slug: 'hirelens',
    name: 'HireLens',
    tagline: 'Glass-box candidate ranking: every score cites the exact evidence it came from.',
    summary:
      'Scores a resume against a rubric you control. The model quotes its evidence, and code checks the quote is really in the resume before the score counts.',
    pattern: 'The model proposes; code verifies',
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
          'Scoring has to work with any provider, including Ollama on the recruiter’s own machine, so resumes never have to leave it.',
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
      results: [todo('real-model benchmark run against local Ollama (Phase 3)')],
      note: 'The repo’s committed report is a mock-model plumbing run, and its README says so. Only a live run produces numbers worth publishing.',
    },
    outcome: {
      facts: [
        'v1.4.0 released 6 October 2026.',
        'Ships as the hirelens CLI on npm and as container images on GHCR.',
        'Self-hosts with one docker compose command.',
      ],
    },
    next: todo('what Abhay would change next (≤ 60 words)'),
    og: { title: 'HireLens', subtitle: 'Every score cites the exact evidence it came from.' },
  },
]

export const caseStudyBySlug = (slug: string) => caseStudies.find((study) => study.slug === slug)
