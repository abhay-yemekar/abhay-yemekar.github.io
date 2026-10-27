import { about } from '../data/about'
import { isTodo } from '../lib/todo'
import { profile } from '../data/profile'
import { sections } from '../data/sections'
import { SectionShell } from './SectionShell'
import { TodoMark } from './TodoMark'

/**
 * Right after the hero: the opening line beside the story. Education has its
 * own section further down.
 */
export function About() {
  return (
    <SectionShell section={sections.about}>
      <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
        <p className="m-0 max-w-[22ch] text-h3 font-semibold text-balance lg:col-span-4" data-reveal>
          {about.lede}
        </p>

        <div className="max-w-(--container-prose) lg:col-span-7 lg:col-start-6" data-reveal>
          {about.paragraphs.map((text) => (
            <p key={text} className="mt-0 mb-4 text-fg-muted">
              {text}
            </p>
          ))}
          {isTodo(about.personal) ? (
            import.meta.env.DEV && (
              <p className="mt-0 mb-4">
                <TodoMark item={about.personal} />
              </p>
            )
          ) : (
            <p className="mt-0 mb-4 text-fg-muted">{about.personal}</p>
          )}
          <p className="u-meta m-0 mt-6 text-fg-subtle">Based in {profile.location}</p>
        </div>
      </div>
    </SectionShell>
  )
}
