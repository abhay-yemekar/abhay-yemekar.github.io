export type ProjectLink = {
  label: string
  href: string
  /** Clarifies what sits behind a link when the label alone would mislead. */
  note?: string
}

/*
 * The four featured projects live in caseStudies.ts: one entry each drives
 * both the home page and its /work/<slug>/ page. This file holds the shorter
 * "Also built" list.
 */

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
    name: 'WriteRight',
    tagline:
      'Self-hosted grammar checks and AI rewrites, reviewed before anything changes.',
    period: 'Aug – Sep 2026',
    stack: ['JavaScript', 'Chrome MV3', 'Node.js', 'Gemini', 'LanguageTool'],
    href: 'https://github.com/abhay-yemekar/ycorrect',
  },
  {
    name: 'REFLEX-AI',
    tagline:
      'A research agent that learns from its mistakes and won’t answer without a citation.',
    period: 'Dec 2025 – Apr 2026',
    stack: ['Python', 'AI agents', 'Tool use', 'GitHub Actions'],
    href: 'https://github.com/abhay-yemekar/reflex-ai',
  },
  {
    name: 'News-to-Video Generator',
    tagline:
      'Headlines and images in, narrated MP4 news videos out.',
    period: 'Sep – Oct 2025',
    stack: ['Flask', 'Google OAuth 2.0', 'MoviePy', 'Pillow', 'pyttsx3'],
    href: 'https://github.com/abhay-yemekar/Flask-Web-App-News-Video-Generator',
  },
  {
    name: 'CricketStat Pro',
    tagline:
      'A T20 World Cup analytics pipeline feeding a Power BI selection dashboard.',
    period: 'Jul – Oct 2023',
    context: 'PHN Technology internship',
    stack: ['Python', 'pandas', 'Bright Data', 'Power Query', 'DAX', 'Power BI'],
    href: 'https://github.com/abhay-yemekar/CricketStat-Pro-Data-Engineering-Visualization-Project-Using-Python-and-Power-BI',
  },
  {
    name: 'AI-Powered 3-Factor Login',
    tagline:
      'Face, then email OTP, then a voice phrase, with liveness checks against spoofing.',
    period: 'Jan – May 2023',
    context: 'Internship deliverable at BitMap Technology',
    stack: [
      'Python',
      'OpenCV',
      'TensorFlow',
      'Speech Recognition',
      'Tkinter',
      'SQLite',
    ],
    href: 'https://github.com/abhay-yemekar/Modern-Online-Banking-Authentication-System-using-AI',
  },
]
