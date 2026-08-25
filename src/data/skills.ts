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
      'SQL',
      'TypeScript',
      'C',
      'HTML / CSS',
      'Git',
      'GitHub',
      'SDLC',
      'Unit & integration testing',
      'Jira',
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
      'REST APIs',
      'SQLAlchemy',
      'PostgreSQL',
      'SQLite',
      'JWT auth',
      'Docker',
      'GitHub Actions',
      'CI/CD',
    ],
  },
  {
    label: 'AI / LLM',
    caption: 'Applied intelligence',
    skills: [
      'LLM & AI agents',
      'RAG',
      'Prompt engineering',
      'LangChain',
      'LlamaIndex',
      'Vector DBs (FAISS, Chroma)',
      'Google Gemini',
      'Anthropic Claude',
      'NLP',
      'TensorFlow',
      'OpenCV',
      'Cursor',
      'GitHub Copilot',
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
