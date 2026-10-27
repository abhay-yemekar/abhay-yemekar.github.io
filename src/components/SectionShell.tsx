import type { ReactNode } from 'react'
import type { Section } from '../data/sections'

type SectionShellProps = {
  section: Section
  children: ReactNode
  /** Optional note beside the heading, e.g. a count. */
  aside?: ReactNode
}

/**
 * A section with a real heading, with an optional note on the same line. With
 * the motion layer on, the heading rises from a mask as it scrolls in
 * (data-split, src/client/motion/reveals.ts).
 */
export function SectionShell({ section, children, aside }: SectionShellProps) {
  const headingId = `${section.id}-heading`

  return (
    <section id={section.id} aria-labelledby={headingId} className="border-t border-border py-16 lg:py-24">
      <div className="u-container">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 lg:mb-10">
          <h2 id={headingId} className="m-0 text-h2" data-split>
            {section.label}
          </h2>
          {aside && <p className="m-0 text-small text-fg-subtle">{aside}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
