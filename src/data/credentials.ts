export type Certification = {
  name: string
  issuer: string
  year?: string
}

/** Curated to the strongest signal per role cluster. Full list lives on LinkedIn. */
export const certifications: Certification[] = [
  { name: 'AI Fluency: Framework & Foundations', issuer: 'Anthropic' },
  { name: 'Claude 101', issuer: 'Anthropic' },
  {
    name: 'OCI 2025 Certified AI Foundations Associate',
    issuer: 'Oracle',
    year: '2025',
  },
  { name: 'Azure AI Essentials Professional Certificate', issuer: 'Microsoft' },
  { name: 'Career Essentials in Generative AI', issuer: 'Microsoft', year: '2024' },
  { name: 'Career Essentials in GitHub', issuer: 'Microsoft', year: '2025' },
  { name: 'Software Engineer Certificate', issuer: 'HackerRank', year: '2025' },
  {
    name: 'Forward Program — Super Learner',
    issuer: 'McKinsey.org',
    year: '2025',
  },
]

export const certificationsNote = {
  label: 'Full list on LinkedIn',
  href: 'https://www.linkedin.com/in/abhayyemekar/details/certifications/',
}

export type Program = {
  name: string
  issuer: string
  period: string
  description: string
}

export const programs: Program[] = [
  {
    name: 'Forward Program',
    issuer: 'McKinsey.org',
    period: 'Oct – Dec 2025',
    description:
      'Structured problem-solving, communication for impact, adaptability and digital fluency. Completed 100% of the Core Skills Level and earned the Super Learner Certificate.',
  },
]

export const education = {
  degree: 'B.Tech, Computer Science',
  institution: 'Shri Guru Gobind Singhji Institute of Engineering & Technology',
  location: 'Vishnupuri, Nanded',
  period: 'Aug 2019 – May 2023',
  grade: '8.80 / 10',
  highlights: ['1st Rank in Second Year B.Tech — 9.88 SGPA.'],
  /** Leadership compressed to a single line so it reads as context, not a résumé. */
  leadershipLine:
    'Student Coordinator for Team Pragyaa, one of the institute’s largest national socio-technical fests; Class Representative 2021–22; volunteer at Smart India Hackathon 2020.',
} as const

/**
 * The home page shows education plus these two (Gate 1: three entries and a
 * LinkedIn link). They're the two with the most signal for AI engineering roles.
 */
export const featuredCertifications = certifications.filter((c) =>
  ['OCI 2025 Certified AI Foundations Associate', 'AI Fluency: Framework & Foundations'].includes(
    c.name,
  ),
)
