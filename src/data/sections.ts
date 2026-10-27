export type Section = {
  id: string
  /** Section heading. */
  label: string
}

/**
 * Home page sections (docs/V4-PLAN.md). The ids are the page's anchors, so
 * `work` keeps its id under the "Projects" label: /#work links from case pages
 * and search results still land on it. Contact is the footer.
 */
export const sections = {
  about: { id: 'about', label: 'About' },
  work: { id: 'work', label: 'Projects' },
  experience: { id: 'experience', label: 'Experience' },
  education: { id: 'education', label: 'Education' },
  skills: { id: 'skills', label: 'Skills' },
  contact: { id: 'contact', label: 'Contact' },
} as const satisfies Record<string, Section>

/** The top nav, in its own order: the work first, then who did it. */
export const navItems = [
  { id: sections.work.id, nav: 'Projects' },
  { id: sections.experience.id, nav: 'Experience' },
  { id: sections.about.id, nav: 'About' },
]
