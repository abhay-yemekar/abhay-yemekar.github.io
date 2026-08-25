import { secondaryProjects } from '../data/projects'
import { sections } from '../data/sections'
import { Reveal } from './Reveal'
import { SectionShell } from './SectionShell'

export function MoreProjects() {
  return (
    <SectionShell section={sections.more}>
      <ul className="grid gap-px overflow-hidden rounded border border-border bg-border">
        {secondaryProjects.map((project, i) => (
          <Reveal as="li" key={project.name} order={i} className="bg-bg-elev">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 transition-colors duration-200 hover:bg-bg-elev-2 sm:p-7"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="flex items-center gap-2 font-sans text-[1.0625rem] font-semibold tracking-[-0.01em] text-fg transition-colors duration-200 group-hover:text-accent">
                  {project.name}
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <path d="M2.5 9.5 9.5 2.5M4.2 2.5h5.3v5.3" />
                  </svg>
                </h3>
                <p className="u-micro shrink-0 text-fg-subtle">{project.period}</p>
              </div>

              {project.context && (
                <p className="u-micro mt-1.5 text-fg-subtle">{project.context}</p>
              )}

              <p className="mt-3 max-w-[64ch] text-[0.9375rem] text-fg-muted">
                {project.tagline}
              </p>

              <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="u-micro rounded-sm border border-border px-2 py-1 text-fg-subtle"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </a>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  )
}
