export type Capability = {
  /** What I can do, not a tool name. */
  label: string
  /** One sentence on how, specific enough to check against the proof. */
  does: string
  tools: string[]
  /** Where it's demonstrated. Every capability links to at least one. */
  proof: { label: string; href: string }[]
}

/**
 * Grouped by capability, with no percentages and no chip wall
 * (docs/STRATEGY.md §3). A tool appears only if a project or role on this
 * site actually uses it.
 */
export const capabilities: Capability[] = [
  {
    label: 'LLM applications',
    does: 'Schema-validated structured output, behind a provider layer that swaps models.',
    tools: ['Gemini', 'Claude API', 'Groq', 'Ollama', 'Zod', 'Pydantic'],
    proof: [
      { label: 'HireLens', href: '/work/hirelens/' },
      { label: 'SearchScribe', href: '/work/searchscribe/' },
    ],
  },
  {
    label: 'RAG and retrieval',
    does: 'Chunking, embeddings and vector search, tied back to source passages.',
    tools: ['pgvector', 'FAISS', 'Chroma', 'LangChain', 'LlamaIndex', 'Tavily'],
    proof: [
      { label: 'ForecastGPT', href: '/work/forecastgpt/' },
      { label: 'HireLens', href: '/work/hirelens/' },
    ],
  },
  {
    label: 'Agents and evaluation',
    does: 'Agents that cite or refuse, and evals that measure bias instead of assuming it.',
    tools: ['Tool use', 'Seeded benchmarks', 'Kendall τ', 'Name-swap tests'],
    proof: [
      { label: 'HireLens evals', href: '/work/hirelens/' },
      { label: 'REFLEX-AI', href: 'https://github.com/abhay-yemekar/reflex-ai' },
    ],
  },
  {
    label: 'Backend and data',
    does: 'Typed APIs, job queues, and auth with rotating refresh tokens.',
    tools: ['Python', 'FastAPI', 'TypeScript', 'Hono', 'PostgreSQL', 'Redis / RQ'],
    proof: [
      { label: 'SearchScribe', href: '/work/searchscribe/' },
      { label: 'ForecastGPT', href: '/work/forecastgpt/' },
    ],
  },
  {
    label: 'Shipping',
    does: 'Next.js, Chrome extensions, Docker and CI, released to npm and the Web Store.',
    tools: ['Next.js', 'React', 'Chrome MV3', 'Docker', 'GitHub Actions'],
    proof: [
      { label: 'yDirect', href: '/work/ydirect/' },
      { label: 'HireLens on npm', href: 'https://www.npmjs.com/package/hirelens' },
    ],
  },
]
