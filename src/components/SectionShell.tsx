import type { ReactNode } from 'react'
import type { Section } from '../data/sections'

type SectionShellProps = {
  section: Section
  children: ReactNode
  /** Optional line under the heading, e.g. a count or a link. */
  aside?: ReactNode
}

/**
 * A section with a real heading: an amber mono numeral and a serif h2 at full
 * size. This replaces the 160px left rail, which cost width and shrank every
 * section heading to a 12px label.
 */
export function SectionShell({ section, children, aside }: SectionShellProps) {
  const headingId = `${section.id}-heading`

  return (
    <section id={section.id} aria-labelledby={headingId} className="border-t border-border py-16 lg:py-24">
      <div className="u-container">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 lg:mb-14">
          <h2 id={headingId} className="flex items-baseline gap-3.5 text-h2">
            <span className="u-meta text-accent" aria-hidden="true">
              {section.index}
            </span>
            {section.label}
          </h2>
          {aside && <div className="u-meta text-fg-subtle">{aside}</div>}
        </div>
        {children}
      </div>
    </section>
  )
}
