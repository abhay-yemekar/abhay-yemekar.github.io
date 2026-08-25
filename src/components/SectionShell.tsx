import type { ReactNode } from 'react'
import type { Section } from '../data/sections'
import { Reveal } from './Reveal'

type SectionShellProps = {
  section: Section
  children: ReactNode
  /** Optional intro line rendered directly under the rail heading on mobile. */
  className?: string
}

/**
 * The repeating layout motif: a 160px left rail carrying the mono index and
 * label, with content in the right column. Below lg the rail collapses to an
 * inline row above the content.
 */
export function SectionShell({ section, children, className }: SectionShellProps) {
  const headingId = `${section.id}-heading`

  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className={`border-t border-border py-20 lg:py-32 ${className ?? ''}`}
    >
      <div className="u-container">
        <div className="lg:grid lg:grid-cols-[10rem_1fr] lg:gap-16">
          <Reveal className="mb-10 lg:mb-0">
            <div className="flex items-baseline gap-3 lg:sticky lg:top-28 lg:flex-col lg:items-start lg:gap-2">
              <span className="u-label text-accent" aria-hidden="true">
                {section.index}
              </span>
              <h2 id={headingId} className="u-label text-fg-subtle">
                {section.label}
              </h2>
              <span
                className="hidden h-px w-10 bg-accent lg:mt-2 lg:block"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  )
}
