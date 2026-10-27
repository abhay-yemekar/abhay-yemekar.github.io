import { education } from '../data/education'
import { sections } from '../data/sections'
import { SectionShell } from './SectionShell'

/**
 * Its own short section (v4, at the owner's request): degree, junior college
 * and school as three cards, in one row from 1024px. No certifications.
 */
export function Education() {
  return (
    <SectionShell section={sections.education}>
      <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
        {education.map((school, i) => (
          <li
            key={school.institution}
            className={`rounded-card border border-border bg-bg-elev p-6 ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            data-reveal
          >
            <p className="u-meta m-0 text-fg-subtle">{school.period}</p>
            <h3 className="m-0 mt-2 text-[1.0625rem] leading-snug">{school.institution}</h3>
            <p className="m-0 mt-1 font-medium">{school.qualification}</p>
            {(school.place || school.grade) && (
              <p className="u-meta m-0 mt-1 text-fg-subtle">{[school.place, school.grade].filter(Boolean).join(' · ')}</p>
            )}
            {school.highlight && <p className="m-0 mt-3 text-small text-fg-muted">{school.highlight}</p>}
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}
