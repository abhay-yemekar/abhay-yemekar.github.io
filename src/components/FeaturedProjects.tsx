import { caseStudies } from '../data/caseStudies'
import { sections } from '../data/sections'
import { HireLensExplainer } from './HireLensExplainer'
import { ForwardArrow } from './Icons'
import { LinkRow } from './LinkRow'
import { SectionShell } from './SectionShell'

/**
 * One entry per case study. The full story lives on its page; the home page
 * carries the claim, the pattern and the links, so the work starts within a
 * screen of the hero.
 */
export function FeaturedProjects() {
  return (
    <SectionShell section={sections.work}>
      <ol className="m-0 list-none p-0">
        {caseStudies.map((study, i) => {
          const lead = i === 0
          return (
            <li
              key={study.slug}
              id={study.slug}
              aria-labelledby={`project-${study.slug}`}
              className="scroll-mt-24 border-t border-border py-8 first:border-t-0 first:pt-0"
            >
              <div className="grid gap-x-12 gap-y-3 lg:grid-cols-[5fr_7fr]">
                <div>
                  <h3 id={`project-${study.slug}`} className={lead ? 'text-[2.25rem] leading-tight' : 'text-h3'}>
                    {study.name}
                  </h3>
                  <p className="u-meta mt-2 text-fg-subtle">{study.period}</p>
                  <p className="u-meta mt-1 text-accent">{study.pattern}</p>
                </div>

                <div>
                  <p className={`m-0 ${lead ? 'text-lede' : ''}`}>{study.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-6">
                    <a href={`/work/${study.slug}/`} className="u-meta u-tap gap-1.5 text-fg no-underline">
                      <span className="u-link">Read the case study</span>
                      <ForwardArrow />
                    </a>
                    <LinkRow links={study.links} />
                  </div>
                </div>
              </div>

              {/* The signature moment sits under its project, not in a section of its own. */}
              {study.explainer && <HireLensExplainer />}
            </li>
          )
        })}
      </ol>
    </SectionShell>
  )
}
