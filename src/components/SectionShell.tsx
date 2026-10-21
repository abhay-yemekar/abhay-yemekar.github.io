import type { ReactNode } from 'react'
import type { Section } from '../data/sections'

type SectionShellProps = {
  section: Section
  children: ReactNode
  /** Optional line under the heading, e.g. a count or a link. */
  aside?: ReactNode
}

/**
 * A section with a real heading: a bracketed mono index, then the h2 at
 * display size. With the motion layer on, the heading's lines rise from masks
 * as it scrolls in (data-split, src/client/motion/reveals.ts).
 */
export function SectionShell({ section, children, aside }: SectionShellProps) {
  const headingId = `${section.id}-heading`

  return (
    <section id={section.id} aria-labelledby={headingId} className="border-t border-border py-20 lg:py-32">
      <div className="u-container">
        <div className="mb-12 lg:mb-20">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-fg-subtle lg:mb-8">
            <span className="u-label" aria-hidden="true" data-scramble-in>
              {section.index}
            </span>
            {aside && <span className="u-label">{aside}</span>}
          </div>
          <h2 id={headingId} className="text-h2" data-split>
            {section.label}
          </h2>
        </div>
        {children}
      </div>
    </section>
  )
}
