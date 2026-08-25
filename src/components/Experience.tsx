import { experience } from '../data/experience'
import { sections } from '../data/sections'
import { Reveal } from './Reveal'
import { SectionShell } from './SectionShell'

export function Experience() {
  return (
    <SectionShell section={sections.experience}>
      <ol className="relative">
        {experience.map((job, i) => (
          <Reveal
            as="li"
            key={job.company}
            order={i}
            className="relative border-l border-border pb-12 pl-6 last:pb-0 sm:pl-8"
          >
            {/* Timeline node */}
            <span
              className="absolute -left-[3px] top-2 h-[5px] w-[5px] rounded-full bg-accent"
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-sans text-[1.125rem] font-semibold tracking-[-0.01em] text-fg">
                {job.role}
                <span className="text-fg-subtle"> · </span>
                <span className="font-normal text-fg-muted">{job.company}</span>
              </h3>
              <p className="u-micro shrink-0 text-fg-subtle">
                {job.start} — {job.end}
              </p>
            </div>

            <p className="u-micro mt-1.5 text-fg-subtle">
              {job.location} · {job.arrangement}
            </p>

            <p className="mt-4 max-w-[62ch] text-[0.9375rem] text-fg">{job.summary}</p>

            <ul className="mt-4 max-w-[68ch] space-y-2">
              {job.bullets.map((bullet, bi) => (
                <li key={bi} className="flex gap-3 text-[0.9375rem] text-fg-muted">
                  <span className="mt-[0.55rem] h-px w-3 shrink-0 bg-border-strong" aria-hidden="true" />
                  <span className="min-w-0">{bullet}</span>
                </li>
              ))}
            </ul>

            {job.client && (
              <div className="mt-6 rounded border border-border bg-bg-elev p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="u-label text-accent">{job.client.name}</h4>
                  <p className="u-micro shrink-0 text-fg-subtle">{job.client.period}</p>
                </div>

                <ul className="mt-4 space-y-2">
                  {job.client.bullets.map((bullet, bi) => (
                    <li key={bi} className="flex gap-3 text-[0.9375rem] text-fg-muted">
                      <span
                        className="mt-[0.55rem] h-px w-3 shrink-0 bg-border-strong"
                        aria-hidden="true"
                      />
                      <span className="min-w-0">{bullet}</span>
                    </li>
                  ))}
                </ul>

                <p className="u-micro mt-4 text-fg-subtle">{job.client.note}</p>
              </div>
            )}
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  )
}
