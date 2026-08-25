import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import type { Project } from '../data/projects'

const ARROW = (
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
    className="shrink-0"
  >
    <path d="M2.5 9.5 9.5 2.5M4.2 2.5h5.3v5.3" />
  </svg>
)

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion()
  const titleId = `project-${project.slug}`

  return (
    <m.article
      aria-labelledby={titleId}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduced ? 0.001 : 0.6,
        delay: reduced ? 0 : (index % 2) * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={reduced ? undefined : { y: -2 }}
      className="group relative flex h-full flex-col overflow-hidden rounded border border-border bg-bg-elev p-6 transition-colors duration-200 hover:border-border-strong focus-within:border-border-strong sm:p-8"
    >
      {/* Amber hairline draws in from the left on hover or keyboard focus. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-within:scale-x-100"
      />

      <header>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3
            id={titleId}
            className="font-display text-[1.625rem] leading-tight tracking-[-0.01em]"
          >
            {project.name}
          </h3>
          <p className="u-micro shrink-0 text-fg-subtle">{project.period}</p>
        </div>

        {project.context && (
          <p className="u-micro mt-2 text-fg-subtle">{project.context}</p>
        )}

        <p className="mt-3 max-w-[56ch] text-[1.0625rem] text-fg">{project.tagline}</p>
      </header>

      {project.metrics && (
        <div className="mt-7">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-4">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="bg-bg-elev-2 px-4 py-4">
                <dt className="u-micro text-fg-subtle">{metric.label}</dt>
                <dd className="mt-1.5 font-display text-[1.75rem] leading-none text-accent">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
          {project.metricsNote && (
            <p className="u-micro mt-3 text-fg-subtle">{project.metricsNote}</p>
          )}
        </div>
      )}

      <div className="mt-7 grid gap-5 sm:grid-cols-3">
        <CaseStudyBlock label="The problem" body={project.problem} />
        <CaseStudyBlock label="What I built" body={project.built} />
        <CaseStudyBlock label="What I learned" body={project.learned} />
      </div>

      <footer className="mt-auto pt-8">
        <ul className="flex flex-wrap gap-x-2 gap-y-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="u-micro rounded-sm border border-border px-2 py-1 text-fg-subtle"
            >
              {tech}
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {project.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="u-label inline-flex items-center gap-1.5 text-fg transition-colors duration-200 hover:text-accent"
              >
                {link.label}
                {ARROW}
                {link.note && (
                  <span className="u-micro ml-1 normal-case text-fg-subtle">
                    ({link.note})
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </m.article>
  )
}

function CaseStudyBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <h4 className="u-micro text-fg-subtle">{label}</h4>
      <p className="mt-2 text-[0.9375rem] leading-[1.6] text-fg-muted">{body}</p>
    </div>
  )
}
