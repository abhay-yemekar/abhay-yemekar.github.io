/**
 * Personal details, hero copy and site metadata.
 *
 * PRIVACY: phone number and home address must never appear in this repo:
 * not in source, markup, metadata, or commit history. Email only. Location is
 * city-level.
 */

const EMAIL = 'abhay.s.yemekar@gmail.com'
const SITE_URL = 'https://abhayemekar.me'

export const profile = {
  name: 'Abhay Yemekar',
  shortName: 'Abhay',
  /** How Abhay presents himself. His job title at Translytics is stated separately. */
  role: 'Full-stack AI engineer',
  /** The actual title, used wherever a title is stated as fact (JSON-LD, Experience). */
  jobTitle: 'Software Engineer',
  company: 'Translytics',
  city: 'Pune',
  location: 'Pune, Maharashtra, India',
  email: EMAIL,
  siteUrl: SITE_URL,

  /**
   * Resume CTA stays hidden until a PDF exists at public/resume.pdf.
   * Set to '/resume.pdf' once the file is added. Never point at a missing file.
   */
  resumeUrl: null as string | null,

  links: {
    github: 'https://github.com/abhay-yemekar',
    linkedin: 'https://www.linkedin.com/in/abhayyemekar/',
    email: `mailto:${EMAIL}`,
  },
} as const

/**
 * Hero copy, approved at Gate 2 (docs/STRATEGY.md §2, option A).
 * `evidence` is the clause inside the headline that carries the evidence mark
 * and cites source 1.
 */
export const hero = {
  eyebrow: 'Full-stack AI engineer · Pune',
  headline: 'I build AI systems that show their work.',
  evidence: 'show their work',
  lede: 'HireLens, my open-source ranking engine, ties every score to the exact resume text behind it. Agents, RAG pipelines, and the backends that ship them.',
  /** `shortLabel` is used below 640px, where the full label wraps to two lines. */
  primaryCta: { label: 'See how HireLens scores a candidate', shortLabel: 'See how HireLens scores', href: '#how-hirelens-scores' },
  secondaryCta: { label: 'Email me', href: `mailto:${EMAIL}` },
  /** The proof strip. Every item is a checkable public fact. */
  sources: [
    { name: 'HireLens', detail: 'glass-box ranking · MIT, npm v1.4.0', href: '#hirelens' },
    { name: 'yDirect', detail: 'on the Chrome Web Store', href: 'https://chromewebstore.google.com/detail/ehkahipeoahnbfbahlkedgdcjefejihg' },
    { name: 'Translytics', detail: 'software engineer · prev. Tata Elxsi', href: '#experience' },
  ],
} as const

/** Home page metadata. Option B's keyword wording lives here (Gate 2). */
export const homeSeo = {
  title: 'Abhay Yemekar — AI engineer building agents, RAG and backends',
  description:
    // ≤ 160 characters, so search results show it whole. The title carries the keywords.
    'Full-stack AI engineer in Pune. Creator of HireLens, open-source candidate ranking where every score cites the resume text behind it.',
} as const

/** JSON-LD Person. City-level address only: no street, no postal code, no telephone. */
export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og/home.png`,
  jobTitle: profile.jobTitle,
  email: `mailto:${EMAIL}`,
  worksFor: { '@type': 'Organization', name: profile.company },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Shri Guru Gobind Singhji Institute of Engineering & Technology',
  },
  knowsAbout: [
    'Large language models',
    'Retrieval-augmented generation',
    'AI agents',
    'Backend engineering',
    'Python',
    'TypeScript',
  ],
  sameAs: [profile.links.github, profile.links.linkedin],
} as const
