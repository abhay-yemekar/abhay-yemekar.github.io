export type SkillCluster = {
  /** Label stays visible — the grouping is the signal. */
  label: string
  /** Which recruiter search this cluster answers. */
  caption: string
  skills: string[]
  /** Small highlighted sub-group rendered as accented chips. */
  highlight?: {
    label: string
    skills: string[]
  }
}

export const skillClusters: SkillCluster[] = [
  {
    label: 'Software Engineering',
    caption: 'Core craft',
    skills: [
      'Python',
      'TypeScript',
      'JavaScript',
      'SQL',
      'C',
      'HTML / CSS',
      'React',
      'Next.js',
      'Chrome Extensions (MV3)',
      'Git',
      'GitHub',
      'SDLC',
      'Unit & integration testing',
      'Automation',
    ],
  },
  {
    label: 'Backend',
    caption: 'Services & APIs',
    skills: [
      'FastAPI',
      'Flask',
      'Django',
      'Hono',
      'REST APIs',
      'SQLAlchemy',
      'Drizzle',
      'PostgreSQL',
      'MySQL',
      'SQLite',
      'Redis / RQ',
      'JWT auth',
      'Docker',
      'CI/CD (GitHub Actions)',
    ],
  },
  {
    label: 'AI / LLM',
    caption: 'Applied intelligence',
    skills: [
      'LLM & AI agents',
      'RAG',
      'Prompt engineering',
      'LangGraph',
      'LangChain',
      'LlamaIndex',
      'Vector DBs (pgvector, FAISS, Chroma)',
      'Claude API',
      'Google Gemini',
      'Ollama',
      'NLP',
      'TensorFlow',
      'OpenCV',
    ],
  },
  {
    label: 'Product-adjacent',
    caption: 'Ownership & communication',
    skills: [
      'Structured problem-solving',
      'Stakeholder communication',
      'Requirements clarification',
      'Agile with Jira',
      'Cross-functional collaboration',
      'Root-cause analysis',
    ],
    highlight: {
      label: 'Strategic',
      skills: ['AI Strategy', 'AI Literacy', 'Responsible AI'],
    },
  },
  {
    label: 'Data & Cloud',
    caption: 'Pipelines & platforms',
    skills: [
      'pandas',
      'NumPy',
      'Power BI',
      'Power Query',
      'DAX',
      'Data engineering',
      'Statistics',
      'Web scraping',
      'Vercel',
      'Render',
      'Oracle Cloud',
      'Azure AI',
    ],
  },
]
