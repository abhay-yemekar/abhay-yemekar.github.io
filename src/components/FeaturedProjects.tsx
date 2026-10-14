import { caseStudyBySlug } from '../data/caseStudies'
import { featuredProjects } from '../data/projects'
import { sections } from '../data/sections'
import { ForwardArrow } from './Icons'
import { LinkRow } from './LinkRow'
import { SectionShell } from './SectionShell'

/**
 * One entry per featured project. The full story lives on the case-study
 * page. The home page carries the claim, the pattern and the links, so the
 * work starts within a screen of the hero.
 */
export function FeaturedProjects() {
  return (
    <SectionShell section={sections.work}>
      <ol className="m-0 list-none p-0">
        {featuredProjects.map((project, i) => {
          const study = caseStudyBySlug(project.slug)
          const lead = i === 0
          return (
            <li
              key={project.slug}
              id={project.slug}
              aria-labelledby={`project-${project.slug}`}
              className="grid scroll-mt-24 gap-x-12 gap-y-3 border-t border-border py-8 first:border-t-0 first:pt-0 lg:grid-cols-[5fr_7fr]"
            >
              <div>
                <h3 id={`project-${project.slug}`} className={lead ? 'text-[2.25rem] leading-tight' : 'text-h3'}>
                  {project.name}
                </h3>
                <p className="u-meta mt-2 text-fg-subtle">
                  {project.period}
                  {project.context && ` · ${project.context}`}
                </p>
                {study && <p className="u-meta mt-1 text-accent">{study.pattern}</p>}
              </div>

              <div>
                <p className={`m-0 ${lead ? 'text-lede' : ''}`}>{study?.summary ?? project.tagline}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-6">
                  {study && (
                    <a href={`/work/${study.slug}/`} className="u-meta u-tap gap-1.5 text-fg no-underline">
                      <span className="u-link">Read the case study</span>
                      <ForwardArrow />
                    </a>
                  )}
                  <LinkRow links={project.links} />
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </SectionShell>
  )
}
