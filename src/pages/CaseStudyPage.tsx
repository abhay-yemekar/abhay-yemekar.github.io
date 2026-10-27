import type { ReactNode } from 'react'
import type { CaseStudy, SourceRef } from '../data/caseStudies'
import { caseStudies } from '../data/caseStudies'
import { projectMedia } from '../data/media'
import { CaseMedia } from '../components/CaseMedia'
import { Diagram } from '../components/Diagram'
import { Footer } from '../components/Footer'
import { HireLensExplainer } from '../components/HireLensExplainer'
import { ForwardArrow } from '../components/Icons'
import { LinkRow } from '../components/LinkRow'
import { Poster } from '../components/Poster'
import { Nav } from '../components/Nav'
import { SkipLink } from '../components/SkipLink'
import { TodoMark } from '../components/TodoMark'
import { isTodo } from '../lib/todo'
import { vt } from '../lib/view-transition'

/**
 * A text column plus a margin for sidenotes, inside a section's 8-column body.
 * The margin folds inline below 1100px.
 */
const ROW = 'grid gap-x-10 min-[1100px]:grid-cols-[minmax(0,1fr)_220px]'

function Sidenote({ cites, children }: { cites?: SourceRef[]; children?: ReactNode }) {
  if (!cites?.length && !children) return null
  return (
    <aside className="u-meta mt-1 mb-6 self-start border-l-2 border-mark pl-3 text-fg-subtle min-[1100px]:mb-0">
      {children}
      {cites?.map((cite) => (
        <a
          key={cite.href}
          href={cite.href}
          target="_blank"
          rel="noopener noreferrer"
          className="u-link block w-fit py-[3px] break-all text-fg-muted"
        >
          {cite.label}
        </a>
      ))}
    </aside>
  )
}

/**
 * A section: the heading sits in its own column (pinned while the section
 * scrolls, from 1024px), the body in the other eight. Wide sections (the
 * diagram, the explainer) take the full width under their heading. `index`
 * only keys the heading's id; v4 shows no section numerals.
 */
function CaseSection({ index, title, children, wide }: { index: string; title: string; children: ReactNode; wide?: boolean }) {
  return (
    <section aria-labelledby={`s-${index}`} className="grid gap-x-8 gap-y-6 border-t border-border py-12 lg:grid-cols-12 lg:py-16">
      <div className={wide ? 'lg:col-span-12' : 'lg:sticky lg:top-24 lg:col-span-4 lg:self-start'}>
        <h2 id={`s-${index}`} className="m-0 text-section" data-split>
          {title}
        </h2>
      </div>
      <div className={wide ? 'min-w-0 lg:col-span-12' : 'min-w-0 lg:col-span-8'} data-reveal>
        {children}
      </div>
    </section>
  )
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const position = caseStudies.indexOf(study)
  const next = caseStudies.length > 1 ? caseStudies[(position + 1) % caseStudies.length] : undefined
  const glance: [string, ReactNode][] = [
    ['Role', isTodo(study.glance.role) ? <TodoMark item={study.glance.role} /> : study.glance.role],
    ['Status', study.glance.status],
    ...(study.glance.license ? [['License', study.glance.license] as [string, ReactNode]] : []),
    ['Stack', study.glance.stack.join(' · ')],
  ]
  let n = 0
  const idx = () => String(++n).padStart(2, '0')

  return (
    <>
      <SkipLink />
      <Nav page="case" />
      <main id="main" className="u-container">
        <header className="pt-10 pb-12 lg:pt-14 lg:pb-16">
          <p className="u-label m-0 text-fg-subtle">
            <a href="/#work" className="u-link text-fg-muted">
              Projects
            </a>{' '}
            / {study.name}
          </p>
          <div className="mt-6 grid gap-x-8 gap-y-10 lg:mt-8 lg:grid-cols-12">
            <div className="lg:col-span-7 lg:self-center">
              <h1 className="m-0 text-title">
                {/* The project's name morphs here from its card on the home page (cross-document view transition). */}
                <span className="vt inline-block" style={vt(study.slug)}>
                  {study.name}
                </span>
              </h1>
              <p className="m-0 mt-4 max-w-[40ch] text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug">{study.tagline}</p>
              <div className="mt-6">
                <LinkRow links={study.links} />
              </div>
            </div>
            <figure className="m-0 overflow-hidden rounded-card border border-border lg:col-span-5 lg:self-end">
              <Poster slug={study.slug} sizes="(min-width: 1024px) 38vw, calc(100vw - 2.5rem)" priority />
            </figure>
          </div>
          <dl className="mt-12 grid gap-x-8 border-t border-border sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {glance.map(([label, value]) => (
              <div key={label} className="border-b border-border py-5 lg:border-b-0">
                <dt className="u-label text-fg-subtle">{label}</dt>
                <dd className="m-0 mt-2 text-small">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div>
          <CaseSection index={idx()} title="The problem">
            <p className="max-w-(--container-prose)">{study.problem}</p>
          </CaseSection>

          {(projectMedia[study.slug]?.film || projectMedia[study.slug]?.stills?.length) && (
            <CaseSection index={idx()} title="In the product" wide>
              <CaseMedia slug={study.slug} />
            </CaseSection>
          )}

          <CaseSection index={idx()} title="Constraints">
            <ul className="m-0 list-none p-0">
              {study.constraints.map((constraint) => (
                <li key={constraint.claim} className={ROW}>
                  <p className="m-0 border-t border-border py-3">
                    <strong className="font-semibold">{constraint.claim}</strong> {constraint.detail}
                  </p>
                  <Sidenote cites={constraint.cites} />
                </li>
              ))}
            </ul>
          </CaseSection>

          <CaseSection index={idx()} title="Architecture" wide>
            <Diagram spec={study.architecture.diagram} caption={study.architecture.caption} />
          </CaseSection>

          {study.explainer && (
            <CaseSection index={idx()} title="In action" wide>
              <p className="max-w-(--container-prose)">
                One fictional resume, scored by the production engine. Pick a criterion to see the evidence it cited;
                switch on blind review to see what reviewers get instead.
              </p>
              <HireLensExplainer />
            </CaseSection>
          )}

          <CaseSection index={idx()} title="Decisions">
            {study.decisionsDraft && import.meta.env.DEV && (
              <p className="u-meta mb-4 text-fg-subtle">
                <span className="u-todo">TODO: confirm decision wording with Abhay (Gate 3)</span>
              </p>
            )}
            {study.decisions.map((decision) => (
              <div key={decision.title} className={`${ROW} mb-5`}>
                <div className="rounded-card border border-border bg-bg-elev px-6 py-5">
                  <h3 className="mb-4 text-h3">{decision.title}</h3>
                  <dl className="m-0 grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-2 text-small">
                    <dt className="u-meta pt-1 text-fg-subtle">Chose</dt>
                    <dd className="m-0">{decision.chose}</dd>
                    <dt className="u-meta pt-1 text-fg-subtle">Over</dt>
                    <dd className="m-0">{decision.over}</dd>
                    {decision.cost && (
                      <>
                        <dt className="u-meta pt-1 text-fg-subtle">Cost</dt>
                        <dd className="m-0">{decision.cost}</dd>
                      </>
                    )}
                    {decision.gain && (
                      <>
                        <dt className="u-meta pt-1 text-fg-subtle">Gain</dt>
                        <dd className="m-0">{decision.gain}</dd>
                      </>
                    )}
                  </dl>
                </div>
                <Sidenote cites={decision.cites} />
              </div>
            ))}
          </CaseSection>

          {study.evaluation && (
            <CaseSection index={idx()} title="Evaluation">
              <div className={ROW}>
                <div>
                  <p>{study.evaluation.method}</p>
                  <ul className="m-0 list-none p-0">
                    {study.evaluation.results.map((result, i) =>
                      isTodo(result) ? (
                        import.meta.env.DEV && (
                          <li key={i} className="border-t border-border py-3">
                            <TodoMark item={result} />
                          </li>
                        )
                      ) : (
                        <li key={result.label} className="flex justify-between gap-4 border-t border-border py-3">
                          <span>{result.label}</span>
                          <span className="font-semibold">{result.value}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                {study.evaluation.note && <Sidenote>{study.evaluation.note}</Sidenote>}
              </div>
            </CaseSection>
          )}

          <CaseSection index={idx()} title="Outcome">
            {study.outcome.metrics && study.outcome.metrics.length > 0 && (
              // Measured numbers only, each with its source and the date it was read.
              <ul className="m-0 mb-8 grid list-none gap-x-8 gap-y-6 p-0 sm:grid-cols-2">
                {study.outcome.metrics.map((metric) => (
                  <li key={metric.label} className="border-t border-border pt-5">
                    <p className="u-display m-0 text-[clamp(2rem,3.4vw,2.75rem)] leading-none tracking-[-0.02em] text-accent">{metric.value}</p>
                    <p className="m-0 mt-2 text-small">{metric.label}</p>
                    <p className="u-meta m-0 mt-2 text-fg-subtle">
                      Source:{' '}
                      <a href={metric.source.href} target="_blank" rel="noopener noreferrer" className="u-link">
                        {metric.source.label}
                      </a>
                      , read {metric.measuredAt}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <ul className="max-w-(--container-prose) list-disc pl-5 marker:text-fg-subtle">
              {study.outcome.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </CaseSection>

          {(!isTodo(study.next) || import.meta.env.DEV) && (
            <CaseSection index={idx()} title="What I’d change next">
              <p className="max-w-(--container-prose)">
                {isTodo(study.next) ? <TodoMark item={study.next} /> : study.next}
              </p>
            </CaseSection>
          )}

          <nav aria-label="More case studies" className="border-t border-border py-12 lg:py-16">
            <a href="/#work" className="u-meta u-tap u-link text-fg-muted">
              All projects
            </a>
            {next && (
              <a
                href={`/work/${next.slug}/`}
                className="group mt-6 flex items-center justify-between gap-6 rounded-card border border-border bg-bg-elev px-6 py-5 text-fg no-underline transition-colors duration-(--duration-base) hover:border-border-strong"
              >
                <span className="min-w-0">
                  <span className="u-label block text-fg-subtle">Next case study</span>
                  <span className="mt-1 block">
                    <span className="vt u-display inline-block text-h2" style={vt(next.slug)}>
                      {next.name}
                    </span>
                  </span>
                </span>
                <span className="u-arrow-ring">
                  <ForwardArrow />
                </span>
              </a>
            )}
          </nav>
        </div>
      </main>
      <Footer page="case" />
    </>
  )
}
