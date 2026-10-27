import { secondaryProjects } from '../data/projects'
import { ExternalArrow } from './Icons'

/**
 * Smaller work, under the case studies in the Projects section: a compact
 * two-column list where each whole row is the link out.
 */
export function MoreProjects() {
  return (
    <div className="mt-16 lg:mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border pb-4">
        <h3 className="m-0 text-h3">
          More projects
        </h3>
        <p className="m-0 text-small text-fg-subtle">{secondaryProjects.length} on GitHub</p>
      </div>
      <ul className="m-0 grid list-none p-0 md:grid-cols-2 md:gap-x-10">
        {secondaryProjects.map((project) => (
          <li key={project.name} className="border-b border-border" data-reveal>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-start justify-between gap-4 py-5 text-fg no-underline"
            >
              <span>
                <span className="block font-semibold underline decoration-transparent decoration-1 underline-offset-[0.22em] transition-colors duration-(--duration-fast) group-hover:decoration-mark">
                  {project.name}
                </span>
                <span className="mt-1 block text-small text-fg-muted">{project.tagline}</span>
                <span className="u-meta mt-1.5 block text-fg-subtle">
                  {project.period}
                  {project.context && ` · ${project.context}`}
                </span>
              </span>
              <span className="mt-1.5 text-fg-subtle transition-colors duration-(--duration-fast) group-hover:text-fg">
                <ExternalArrow />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
