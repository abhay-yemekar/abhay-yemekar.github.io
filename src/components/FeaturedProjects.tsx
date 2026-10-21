import { caseStudies } from '../data/caseStudies'
import { projectMedia } from '../data/media'
import { sections } from '../data/sections'
import { HireLensExplainer } from './HireLensExplainer'
import { ForwardArrow } from './Icons'
import { vt } from '../lib/view-transition'
import { LinkRow } from './LinkRow'
import { Poster } from './Poster'
import { SectionShell } from './SectionShell'

/**
 * The work as a numbered index. With a fine pointer and motion on, hovering a
 * project name floats its poster (or a moving preview) beside the cursor
 * (src/client/motion/work-preview.ts). Otherwise the poster sits in the row.
 *
 * The full story lives on each case-study page. The HireLens explainer follows
 * the list as the section's showcase.
 */
export function FeaturedProjects() {
  return (
    <SectionShell section={sections.work} aside={`${caseStudies.length} case studies`}>
      <ol className="m-0 list-none border-t border-border p-0" data-work-index>
        {caseStudies.map((study, i) => {
          const media = projectMedia[study.slug]
          return (
            <li
              key={study.slug}
              id={study.slug}
              aria-labelledby={`project-${study.slug}`}
              className="work-row scroll-mt-24 border-b border-border"
              data-work-row={study.slug}
              {...(media?.preview ? { 'data-preview': media.preview.src, 'data-preview-type': media.preview.type } : {})}
              data-reveal
            >
              <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-6 py-10 lg:grid-cols-12 lg:gap-x-8 lg:py-14">
                <span className="u-meta pt-2 text-fg-subtle lg:col-span-1 lg:pt-4" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="lg:col-span-6" data-work-hit>
                  <h3 id={`project-${study.slug}`} className="work-title m-0 text-work">
                    <a href={`/work/${study.slug}/`} className="vt text-fg no-underline" style={vt(study.slug)} data-cursor="View">
                      {study.name}
                    </a>
                  </h3>
                  <p className="u-meta m-0 mt-5 text-fg-subtle">{study.period}</p>
                  <p className="u-meta m-0 mt-1 text-accent">{study.pattern}</p>
                </div>

                <div className="col-start-2 lg:col-span-5 lg:col-start-8">
                  <p className="m-0 text-fg-muted">{study.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-6">
                    <a href={`/work/${study.slug}/`} className="u-meta u-tap gap-1.5 text-fg no-underline">
                      <span className="u-link">Read the case study</span>
                      <ForwardArrow />
                    </a>
                    <LinkRow links={study.links} />
                  </div>
                  {media && (
                    <figure className="work-poster m-0 mt-8 overflow-hidden rounded-card border border-border">
                      {/* The row's text column: 5/12 of the container from 1024px, else the viewport less the gutters and numerals. */}
                      <Poster slug={study.slug} sizes="(min-width: 1024px) 34vw, calc(100vw - 5.5rem)" />
                    </figure>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      {/* The signature moment: real HireLens output, every score tied to its evidence. */}
      {caseStudies.some((study) => study.explainer) && (
        <div className="mt-20 lg:mt-28" data-reveal>
          <HireLensExplainer />
        </div>
      )}
    </SectionShell>
  )
}
