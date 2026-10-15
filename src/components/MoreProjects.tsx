import { secondaryProjects } from '../data/projects'
import { sections } from '../data/sections'
import { ExternalArrow } from './Icons'
import { SectionShell } from './SectionShell'

export function MoreProjects() {
  return (
    <SectionShell section={sections.more}>
      <ul className="m-0 list-none p-0">
        {secondaryProjects.map((project) => (
          <li key={project.name} className="border-t border-border first:border-t-0">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-x-12 gap-y-1 py-5 text-fg no-underline lg:grid-cols-[5fr_7fr]"
            >
              <span>
                <span className="inline-flex items-center gap-2 text-[1.25rem] font-medium">
                  <span className="decoration-mark decoration-2 underline-offset-[0.22em] group-hover:underline group-focus-visible:underline">
                    {project.name}
                  </span>
                  <ExternalArrow />
                </span>
                <span className="u-meta block text-fg-subtle">
                  {project.period}
                  {project.context && ` · ${project.context}`}
                </span>
              </span>
              <span className="text-small text-fg-muted">
                {project.tagline}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
