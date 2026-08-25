import {
  certifications,
  certificationsNote,
  education,
  programs,
} from '../data/credentials'
import { sections } from '../data/sections'
import { Reveal } from './Reveal'
import { SectionShell } from './SectionShell'

export function Credentials() {
  return (
    <SectionShell section={sections.credentials}>
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        <div>
          <Reveal>
            <h3 className="u-label text-fg-subtle">Education</h3>
          </Reveal>

          <Reveal order={1}>
            <div className="mt-5 rounded border border-border bg-bg-elev p-6">
              <h4 className="font-sans text-[1.0625rem] font-semibold tracking-[-0.01em] text-fg">
                {education.degree}
              </h4>
              <p className="mt-1.5 text-[0.9375rem] text-fg-muted">
                {education.institution}
              </p>
              <p className="u-micro mt-2 text-fg-subtle">
                {education.location} · {education.period} · CGPA {education.grade}
              </p>

              <ul className="mt-5 space-y-2">
                {education.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex gap-3 text-[0.9375rem] text-fg-muted"
                  >
                    <span
                      className="mt-[0.55rem] h-px w-3 shrink-0 bg-accent"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">{highlight}</span>
                  </li>
                ))}
              </ul>

              <p className="u-micro mt-5 leading-[1.6] text-fg-subtle">
                {education.leadershipLine}
              </p>
            </div>
          </Reveal>

          {programs.map((program, i) => (
            <Reveal key={program.name} order={i + 2}>
              <div className="mt-6 rounded border border-border bg-bg-elev p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="font-sans text-[1.0625rem] font-semibold tracking-[-0.01em] text-fg">
                    {program.name}
                    <span className="text-fg-subtle"> · </span>
                    <span className="font-normal text-fg-muted">{program.issuer}</span>
                  </h4>
                  <p className="u-micro shrink-0 text-fg-subtle">{program.period}</p>
                </div>
                <p className="mt-3 text-[0.9375rem] text-fg-muted">
                  {program.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 lg:mt-0">
          <Reveal order={1}>
            <h3 className="u-label text-fg-subtle">Certifications</h3>
          </Reveal>

          <ul className="mt-5 overflow-hidden rounded border border-border">
            {certifications.map((certification, i) => (
              <Reveal
                as="li"
                key={certification.name}
                order={i + 2}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border bg-bg-elev px-5 py-4 last:border-b-0"
              >
                <span className="text-[0.9375rem] text-fg">{certification.name}</span>
                <span className="u-micro shrink-0 text-fg-subtle">
                  {certification.issuer}
                  {certification.year && ` · ${certification.year}`}
                </span>
              </Reveal>
            ))}
          </ul>

          <Reveal order={4}>
            <p className="mt-5">
              <a
                href={certificationsNote.href}
                target="_blank"
                rel="noopener noreferrer"
                className="u-label u-link text-fg-muted"
              >
                {certificationsNote.label}
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  )
}
