import { secondaryProjects } from '../data/projects'
import { sections } from '../data/sections'
import { ExternalArrow } from './Icons'
import { SectionShell } from './SectionShell'

/** Smaller work, one row each: the whole row is the link out. */
export function MoreProjects() {
  return (
    <SectionShell section={sections.more} aside={`${secondaryProjects.length} projects`}>
      <ul className="m-0 list-none border-t border-border p-0">
        {secondaryProjects.map((project) => (
          <li key={project.name} className="border-b border-border" data-reveal>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 py-7 text-fg no-underline lg:grid-cols-12 lg:gap-x-8"
            >
              <span className="lg:col-span-5">
                <span className="u-display block text-[clamp(1.625rem,2.6vw,2.25rem)] leading-[1.05] tracking-[-0.015em] transition-transform duration-(--duration-slow) ease-(--ease-entrance) group-hover:translate-x-2">
                  {project.name}
                </span>
                <span className="u-meta mt-2 block text-fg-subtle">
                  {project.period}
                  {project.context && ` · ${project.context}`}
                </span>
              </span>
              <span className="col-span-2 text-fg-muted lg:col-span-5 lg:col-start-7">{project.tagline}</span>
              <span className="col-start-2 row-start-1 lg:col-span-1 lg:col-start-12 lg:justify-self-end">
                <span className="u-arrow-ring">
                  <ExternalArrow />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
