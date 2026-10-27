export type Section = {
  id: string
  /** Section heading. */
  label: string
  /** Shown in the top nav; omitted sections stay out of the nav. */
  nav?: string
}

/**
 * Home page sections, in order (docs/V4-PLAN.md). The ids are the page's
 * anchors, so `work` keeps its id under the "Projects" label: /#work links
 * from case pages and search results still land on it.
 */
export const sections = {
  work: { id: 'work', label: 'Projects', nav: 'Projects' },
  experience: { id: 'experience', label: 'Experience', nav: 'Experience' },
  skills: { id: 'skills', label: 'Skills' },
  about: { id: 'about', label: 'About', nav: 'About' },
  contact: { id: 'contact', label: 'Contact' },
} as const satisfies Record<string, Section>

export const sectionOrder: Section[] = [
  sections.work,
  sections.experience,
  sections.skills,
  sections.about,
  sections.contact,
]

/** Sections that opted into the top nav, in document order. */
export const navItems = sectionOrder.flatMap((section) =>
  section.nav ? [{ id: section.id, nav: section.nav }] : [],
)
