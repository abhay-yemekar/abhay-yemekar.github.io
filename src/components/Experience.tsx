import { experience } from '../data/experience'
import { isTodo } from '../lib/todo'
import { TodoMark } from './TodoMark'
import { sections } from '../data/sections'
import { SectionShell } from './SectionShell'

/**
 * A timeline, newest first. The role is the heading and the company sits
 * under it. From 1024px the dates run down the left of the line; below that
 * they sit above each role.
 */
export function Experience() {
  return (
    <SectionShell section={sections.experience}>
      <ol className="m-0 list-none p-0">
        {experience.map((job, i) => {
          const dates = `${job.start} – ${job.end}`
          const last = i === experience.length - 1
          return (
            <li key={job.company} className="grid gap-x-10 lg:grid-cols-[10rem_1fr]" data-reveal>
              <p className="u-meta m-0 hidden pt-1 text-right text-fg-subtle lg:block">{dates}</p>

              <div className={`relative border-l border-border-strong pl-7 sm:pl-9 ${last ? '' : 'pb-12'}`}>
                {/* The current role's dot is filled. */}
                <span
                  className={`absolute top-2 -left-[5px] size-[9px] rounded-full ${i === 0 ? 'bg-fg' : 'border border-fg-subtle bg-bg'}`}
                  aria-hidden="true"
                />
                <p className="u-meta m-0 mb-1 text-fg-subtle lg:hidden">{dates}</p>
                <h3 className="m-0 text-name">{job.role}</h3>
                <p className="m-0 mt-1 text-fg-muted">
                  <span className="font-medium text-fg">{job.company}</span> · {job.location} · {job.arrangement}
                </p>

                <div className="max-w-(--container-prose)">
                  <p className="m-0 mt-4">{job.summary}</p>
                  <ul className="mt-3 mb-0 list-disc space-y-1.5 pl-5 text-fg-muted marker:text-fg-subtle">
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
                    <div className="mt-5 rounded-card border border-border bg-bg-elev px-5 py-4">
                      <p className="m-0 flex flex-wrap justify-between gap-x-4 text-small">
                        <span className="font-semibold">Client: {job.client.name}</span>
                        <span className="u-meta text-fg-subtle">{job.client.period}</span>
                      </p>
                      <ul className="mt-2 mb-0 list-disc space-y-1 pl-5 text-small text-fg-muted marker:text-fg-subtle">
                        {job.client.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                      <p className="u-meta mt-2 mb-0 text-fg-subtle">{job.client.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </SectionShell>
  )
}
