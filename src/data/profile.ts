/**
 * Personal details and site metadata.
 *
 * PRIVACY: phone number and home address must never appear in this repo —
 * not in source, markup, metadata, or commit history. Email only.
 */

const EMAIL = 'abhay.s.yemekar@gmail.com'

export const profile = {
  name: 'Abhay Yemekar',
  shortName: 'Abhay',
  /** How Abhay presents himself; his job title at Translytics stays in the subhead. */
  role: 'Full-stack AI Engineer',
  company: 'Translytics',
  city: 'Pune',
  location: 'Pune, Maharashtra, India',
  email: EMAIL,

  siteUrl: 'https://abhayemekar.me',

  headline:
    'A full-stack AI engineer who turns ambiguous, messy problems into clean, modular, reliable systems.',

  /** Rendered in amber serif italic inside the hero headline. */
  headlineEmphasis: 'clean, modular, reliable',

  subhead:
    'Currently a software engineer at Translytics in Pune, building AI and backend systems.',

  focus: ['Python', 'AI / LLMs', 'Backend', 'Data'],

  /**
   * Resume CTA stays hidden until a PDF exists at public/resume.pdf.
   * Set to '/resume.pdf' once the file is added — never point at a missing file.
   */
  resumeUrl: null as string | null,

  links: {
    github: 'https://github.com/abhay-yemekar',
    linkedin: 'https://www.linkedin.com/in/abhayyemekar/',
    email: `mailto:${EMAIL}`,
  },
} as const

export const seo = {
  title: 'Abhay Yemekar — Full-stack AI Engineer',
  description:
    'Full-stack AI engineer in Pune building AI agents, RAG pipelines and backend systems. Creator of HireLens, glass-box candidate ranking, and yDirect.',
  ogImage: '/og.png',
} as const
