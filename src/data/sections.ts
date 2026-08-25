export type Section = {
  id: string
  /** Mono index shown in the left rail. */
  index: string
  /** Section heading in the rail. */
  label: string
  /** Shown in the top nav; omitted sections stay out of the nav. */
  nav?: string
}

export const sections = {
  about: { id: 'about', index: '01', label: 'About', nav: 'About' },
  experience: { id: 'experience', index: '02', label: 'Experience' },
  work: { id: 'work', index: '03', label: 'Selected work', nav: 'Work' },
  more: { id: 'more', index: '04', label: 'More projects' },
  skills: { id: 'skills', index: '05', label: 'Skills', nav: 'Skills' },
  credentials: { id: 'credentials', index: '06', label: 'Credentials' },
  contact: { id: 'contact', index: '07', label: 'Contact', nav: 'Contact' },
} as const satisfies Record<string, Section>

export const sectionOrder: Section[] = [
  sections.about,
  sections.experience,
  sections.work,
  sections.more,
  sections.skills,
  sections.credentials,
  sections.contact,
]

/** Sections that opted into the top nav, in document order. */
export const navItems = sectionOrder.flatMap((section) =>
  section.nav ? [{ id: section.id, nav: section.nav }] : [],
)
