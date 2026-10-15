import { about } from '../data/about'
import { isTodo } from '../lib/todo'
import { certificationsNote, education, featuredCertifications } from '../data/credentials'
import { profile } from '../data/profile'
import { sections } from '../data/sections'
import { ExternalArrow } from './Icons'
import { SectionShell } from './SectionShell'
import { TodoMark } from './TodoMark'

export function About() {
  return (
    <SectionShell section={sections.about}>
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[7fr_5fr]">
        <div className="max-w-(--container-prose)">
          <p className="m-0 text-[clamp(1.5rem,2.6vw,1.875rem)] leading-snug">{about.lede}</p>
          {about.paragraphs.map((text) => (
            <p key={text} className="mt-5 mb-0 text-fg-muted">
              {text}
            </p>
          ))}
          {isTodo(about.personal) ? (
            import.meta.env.DEV && (
              <p className="mt-5 mb-0">
                <TodoMark item={about.personal} />
              </p>
            )
          ) : (
            <p className="mt-5 mb-0 text-fg-muted">{about.personal}</p>
          )}
          <p className="u-meta mt-6 mb-0 text-fg-subtle">Based in {profile.location}</p>
        </div>

        <div>
          <h3 className="u-meta mb-3 text-fg-subtle">Education &amp; credentials</h3>
          <ul className="m-0 list-none p-0">
            <li className="border-t border-border py-3">
              <p className="m-0 font-medium">{education.degree}</p>
              <p className="m-0 text-small text-fg-muted">{education.institution}</p>
              <p className="u-meta m-0 text-fg-subtle">
                {education.period} · CGPA {education.grade}
              </p>
            </li>
            {featuredCertifications.map((cert) => (
              <li key={cert.name} className="border-t border-border py-3">
                <p className="m-0 font-medium">{cert.name}</p>
                <p className="u-meta m-0 text-fg-subtle">
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
            className="u-meta u-tap gap-1.5 text-fg-muted no-underline"
          >
            <span className="u-link">{certificationsNote.label}</span>
            <ExternalArrow />
          </a>
        </div>
      </div>
    </SectionShell>
  )
}
