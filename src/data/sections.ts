export type Section = {
  id: string
  /** Mono numeral shown before the heading. */
  index: string
  /** Section heading. */
  label: string
  /** Shown in the top nav; omitted sections stay out of the nav. */
  nav?: string
}

/**
 * Home page order (docs/STRATEGY.md §3, Gate 1). The work comes straight
 * after the hero: evidence before biography.
 */
export const sections = {
  work: { id: 'work', index: '01', label: 'Selected work', nav: 'Work' },
  more: { id: 'more', index: '02', label: 'Also built' },
  experience: { id: 'experience', index: '03', label: 'Experience' },
  skills: { id: 'skills', index: '04', label: 'Capabilities' },
  about: { id: 'about', index: '05', label: 'About', nav: 'About' },
  contact: { id: 'contact', index: '06', label: 'Contact', nav: 'Contact' },
} as const satisfies Record<string, Section>

export const sectionOrder: Section[] = [
  sections.work,
  sections.more,
  sections.experience,
  sections.skills,
  sections.about,
  sections.contact,
]

/** Sections that opted into the top nav, in document order. */
export const navItems = sectionOrder.flatMap((section) =>
  section.nav ? [{ id: section.id, nav: section.nav }] : [],
)
