import { about } from '../data/about'
import { isTodo } from '../lib/todo'
import { certificationsNote, education, featuredCertifications } from '../data/credentials'
import { profile } from '../data/profile'
import { sections } from '../data/sections'
import { ExternalArrow } from './Icons'
import { SectionShell } from './SectionShell'
import { TodoMark } from './TodoMark'

/** The lede as a serif-italic statement, the story beside it, credentials last. */
export function About() {
  return (
    <SectionShell section={sections.about}>
      <p className="u-accent m-0 max-w-[22ch] text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.04]" data-reveal>
        {about.lede}
      </p>

      <div className="mt-14 grid gap-x-8 gap-y-14 lg:mt-20 lg:grid-cols-12">
        <div className="max-w-(--container-prose) lg:col-span-6 lg:col-start-1">
          {about.paragraphs.map((text) => (
            <p key={text} className="mt-0 mb-5 text-fg-muted">
              {text}
            </p>
          ))}
          {isTodo(about.personal) ? (
            import.meta.env.DEV && (
              <p className="mt-0 mb-5">
                <TodoMark item={about.personal} />
              </p>
            )
          ) : (
            <p className="mt-0 mb-5 text-fg-muted">{about.personal}</p>
          )}
          <p className="u-label mt-8 mb-0 text-fg-subtle">Based in {profile.location}</p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <h3 className="u-label m-0 mb-4 font-normal text-fg-subtle">Education &amp; credentials</h3>
          <ul className="m-0 list-none border-b border-border p-0">
            <li className="border-t border-border py-4">
              <p className="u-display m-0 text-[1.375rem] leading-tight">{education.degree}</p>
              <p className="m-0 mt-1 text-small text-fg-muted">{education.institution}</p>
              <p className="u-meta m-0 mt-1 text-fg-subtle">
                {education.period} · CGPA {education.grade}
              </p>
            </li>
            {featuredCertifications.map((cert) => (
              <li key={cert.name} className="border-t border-border py-4">
                <p className="m-0 font-semibold">{cert.name}</p>
                <p className="u-meta m-0 mt-1 text-fg-subtle">
                  {cert.issuer}
                  {cert.year && ` · ${cert.year}`}
                </p>
              </li>
            ))}
          </ul>
          <a
            href={certificationsNote.href}
            target="_blank"
            rel="noopener noreferrer"
            className="u-meta u-tap mt-2 gap-1.5 text-fg-muted no-underline"
          >
            <span className="u-link">{certificationsNote.label}</span>
            <ExternalArrow />
          </a>
        </div>
      </div>
    </SectionShell>
  )
}
