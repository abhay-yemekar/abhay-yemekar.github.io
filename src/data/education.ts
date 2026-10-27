export type School = {
  institution: string
  /** Where it is, when the name doesn't say. Omitted where unknown. */
  place?: string
  qualification: string
  period: string
  grade?: string
  /** One line of achievement. */
  highlight?: string
}

/**
 * Newest first. From Abhay's LinkedIn education entries (screenshot shared
 * 2026-10-27), visible text only. Certifications were dropped from the site
 * at his request the same day; the full list stays on LinkedIn.
 */
export const education: School[] = [
  {
    institution: 'Shri Guru Gobind Singhji Institute of Engineering & Technology',
    place: 'Vishnupuri, Nanded',
    qualification: 'B.Tech, Computer Science',
    period: 'Aug 2019 – May 2023',
    grade: 'CGPA 8.80 / 10',
    highlight: '1st rank in second-year B.Tech, with a 9.88 SGPA.',
  },
  {
    institution: 'Cambridge Junior College',
    place: 'Nanded',
    // LinkedIn says "SSC, PCM"; Abhay confirmed it is HSC (2026-10-27).
    qualification: 'HSC (Class 12), PCM',
    period: 'Apr 2018 – Apr 2019',
    highlight: '97.17 percentile (PCM) in MHT-CET 2019: Physics 95.52, Chemistry 94.08, Mathematics 97.65.',
  },
  {
    institution: 'Kendriya Vidyalaya',
    qualification: 'SSC (CBSE)',
    period: 'Apr 2016 – Apr 2017',
    grade: 'CGPA 9.6 / 10',
    highlight: 'Top grades (A1/A2) across core subjects, including Mathematics, Science and English.',
  },
]
