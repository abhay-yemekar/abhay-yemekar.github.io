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
  role: 'Software Engineer',
  company: 'Translytics',
  location: 'Pune, Maharashtra, India',
  email: EMAIL,

  siteUrl: 'https://abhayemekar.me',

  headline:
    'A software engineer who turns ambiguous, messy problems into clean, modular, reliable systems.',

  /** Rendered in amber serif italic inside the hero headline. */
  headlineEmphasis: 'clean, modular, reliable',

  subhead:
    'Currently building Python, AI/LLM and backend systems at Translytics in Pune.',

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
  title: 'Abhay Yemekar — Software Engineer',
  description:
    'Software engineer in Pune building Python, AI/LLM and backend systems. Chrome extensions, RAG pipelines, and production APIs.',
  ogImage: '/og.png',
} as const
