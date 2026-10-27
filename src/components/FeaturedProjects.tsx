import { caseStudies } from '../data/caseStudies'
import { projectMedia } from '../data/media'
import { sections } from '../data/sections'
import { ForwardArrow } from './Icons'
import { vt } from '../lib/view-transition'
import { LinkRow } from './LinkRow'
import { MoreProjects } from './MoreProjects'
import { Poster } from './Poster'
import { SectionShell } from './SectionShell'

/**
 * The four case studies as a 2×2 grid of cards (one column on phones), then
 * the smaller projects as a compact list. With a mouse and motion on, hovering
 * a card plays its moving preview inside the poster frame
 * (src/client/motion/work-preview.ts).
 *
 * The full story lives on each case-study page, the HireLens explainer
 * included.
 */
export function FeaturedProjects() {
  return (
    <SectionShell section={sections.work} aside={`${caseStudies.length} case studies`}>
      <ol className="m-0 grid list-none gap-x-8 gap-y-14 p-0 md:grid-cols-2 lg:gap-x-10" data-work-index>
        {caseStudies.map((study, i) => {
          const media = projectMedia[study.slug]
          return (
            <li
              key={study.slug}
              id={study.slug}
              aria-labelledby={`project-${study.slug}`}
              className="work-card flex scroll-mt-24 flex-col"
              data-work-row={study.slug}
              {...(media?.preview ? { 'data-preview': media.preview.src, 'data-preview-type': media.preview.type } : {})}
              data-reveal
            >
              {media && (
                // The name below is the card's real link; this one only widens the target for pointers.
                <a
                  href={`/work/${study.slug}/`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="work-card__frame relative block overflow-hidden rounded-card border border-border bg-bg-elev"
                  data-work-frame
                >
                  {/* Half the container from 768px (less the gutter), else the viewport less its gutters. */}
                  <Poster
                    slug={study.slug}
                    sizes="(min-width: 1360px) 620px, (min-width: 1024px) calc(50vw - 3.75rem), (min-width: 768px) calc(50vw - 2.25rem), calc(100vw - 2.5rem)"
                    eager={i < 2}
                  />
                </a>
              )}

              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 id={`project-${study.slug}`} className="work-title m-0 text-work">
                  <a href={`/work/${study.slug}/`} className="vt inline-block text-fg" style={vt(study.slug)}>
                    {study.name}
                  </a>
                </h3>
                <p className="u-meta m-0 text-fg-subtle">{study.period}</p>
              </div>
              <p className="u-meta m-0 mt-1.5 font-medium text-accent">{study.pattern}</p>
              <p className="m-0 mt-3 text-fg-muted">{study.summary}</p>

              {/* The case study on its own line, then the links out: the same two rows on every card. */}
              <div className="mt-auto flex flex-col items-start pt-3">
                <a href={`/work/${study.slug}/`} className="u-meta u-tap gap-1.5 font-medium text-fg no-underline">
                  <span className="u-link">Read the case study</span>
                  <ForwardArrow />
                </a>
                <LinkRow links={study.links} />
              </div>
            </li>
          )
        })}
      </ol>

      <MoreProjects />
    </SectionShell>
  )
}
