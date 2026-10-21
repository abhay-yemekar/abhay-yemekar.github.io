import { experience } from '../data/experience'
import { isTodo } from '../lib/todo'
import { TodoMark } from './TodoMark'
import { sections } from '../data/sections'
import { SectionShell } from './SectionShell'

/**
 * One row per role. From 1024px the company column stays pinned (CSS sticky,
 * no JS) while its details scroll past.
 */
export function Experience() {
  return (
    <SectionShell section={sections.experience}>
      <ol className="m-0 list-none border-t border-border p-0">
        {experience.map((job) => (
          <li key={job.company} className="grid gap-x-8 gap-y-6 border-b border-border py-12 lg:grid-cols-12 lg:py-16" data-reveal>
            <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
              <p className="u-meta m-0 text-fg-subtle">
                {job.start} – {job.end}
              </p>
              <h3 className="mt-3 text-name">{job.company}</h3>
              <p className="u-meta m-0 mt-4 text-fg-muted">
                {job.role} · {job.arrangement}
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="m-0 text-lede">{job.summary}</p>
              <ul className="mt-6 mb-0 list-disc space-y-2.5 pl-5 text-fg-muted marker:text-fg-subtle">
                {job.bullets.map((bullet) =>
                  isTodo(bullet) ? (
                    import.meta.env.DEV && (
                      <li key={bullet.todo}>
                        <TodoMark item={bullet} />
                      </li>
                    )
                  ) : (
                    <li key={bullet}>{bullet}</li>
                  ),
                )}
              </ul>

              {job.client && (
                <div className="mt-8 rounded-card border border-border bg-bg-elev px-6 py-5">
                  <p className="u-meta m-0 flex flex-wrap justify-between gap-x-4 text-fg-subtle">
                    <span className="font-semibold text-fg">Client: {job.client.name}</span>
                    <span>{job.client.period}</span>
                  </p>
                  <ul className="mt-4 mb-0 list-disc space-y-2 pl-5 text-small text-fg-muted marker:text-fg-subtle">
                    {job.client.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <p className="u-meta mt-4 mb-0 text-fg-subtle">{job.client.note}</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}
