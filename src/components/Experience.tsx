import { experience } from '../data/experience'
import { sections } from '../data/sections'
import { SectionShell } from './SectionShell'

export function Experience() {
  return (
    <SectionShell section={sections.experience}>
      <ol className="m-0 list-none p-0">
        {experience.map((job) => (
          <li
            key={job.company}
            className="grid gap-x-12 gap-y-2 border-t border-border py-8 first:border-t-0 first:pt-0 lg:grid-cols-[5fr_7fr]"
          >
            <div>
              <h3 className="text-h3">{job.company}</h3>
              <p className="u-meta mt-1 text-fg-subtle">
                {job.role} · {job.start} – {job.end}
              </p>
              <p className="u-meta text-fg-subtle">
                {job.location} · {job.arrangement}
              </p>
            </div>

            <div>
              <p className="m-0">{job.summary}</p>
              <ul className="mt-3 mb-0 list-disc space-y-1.5 pl-5 text-small text-fg-muted marker:text-fg-subtle">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>

              {job.client && (
                <div className="mt-5 rounded-card border border-border bg-bg-elev px-5 py-4">
                  <p className="u-meta m-0 flex flex-wrap justify-between gap-x-4 text-fg-subtle">
                    <span className="font-semibold text-fg">Client: {job.client.name}</span>
                    <span>{job.client.period}</span>
                  </p>
                  <ul className="mt-3 mb-0 list-disc space-y-1.5 pl-5 text-small text-fg-muted marker:text-fg-subtle">
                    {job.client.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <p className="u-meta mt-3 mb-0 text-fg-subtle">{job.client.note}</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}
