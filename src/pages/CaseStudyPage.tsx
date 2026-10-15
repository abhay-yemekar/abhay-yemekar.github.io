import type { ReactNode } from 'react'
import type { CaseStudy, SourceRef } from '../data/caseStudies'
import { caseStudies } from '../data/caseStudies'
import { Diagram } from '../components/Diagram'
import { Footer } from '../components/Footer'
import { HireLensExplainer } from '../components/HireLensExplainer'
import { ForwardArrow } from '../components/Icons'
import { LinkRow } from '../components/LinkRow'
import { Nav } from '../components/Nav'
import { SkipLink } from '../components/SkipLink'
import { TodoMark } from '../components/TodoMark'
import { isTodo } from '../lib/todo'

/** A text column plus a margin for sidenotes. The margin folds inline below 1100px. */
const ROW = 'grid gap-x-12 min-[1100px]:grid-cols-[minmax(0,660px)_260px]'

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

function CaseSection({ index, title, children, wide }: { index: string; title: string; children: ReactNode; wide?: boolean }) {
  return (
    <section aria-labelledby={`s-${index}`} className="mt-14 first:mt-0">
      <h2 id={`s-${index}`} className={`mb-4 flex items-baseline gap-3 text-[1.875rem] leading-tight ${wide ? '' : 'max-w-(--container-prose)'}`}>
        <span className="u-meta text-accent" aria-hidden="true">
          {index}
        </span>
        {title}
      </h2>
      {children}
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
        <header className="border-b border-border pt-12 pb-10 lg:pt-16">
          <p className="u-meta mb-7 text-fg-subtle">
            <a href="/#work" className="u-link text-fg-muted">
              Selected work
            </a>{' '}
            / {study.name}
          </p>
          <h1 className="text-title">{study.name}</h1>
          <p className="mt-5 max-w-[32ch] text-[clamp(1.25rem,2vw,1.625rem)] leading-snug">{study.tagline}</p>
          <div className="mt-5">
            <LinkRow links={study.links} />
          </div>
          <dl className="mt-9 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {glance.map(([label, value]) => (
              <div key={label}>
                <dt className="u-meta text-fg-subtle">{label}</dt>
                <dd className="m-0 mt-1 text-small">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="py-14 lg:py-20">
          <CaseSection index={idx()} title="The problem">
            <p className="max-w-(--container-prose)">{study.problem}</p>
          </CaseSection>

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
                  <h3 className="mb-3 text-[1.25rem] font-semibold">{decision.title}</h3>
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
              <ul className="m-0 mb-6 grid max-w-(--container-prose) list-none gap-4 p-0 sm:grid-cols-2">
                {study.outcome.metrics.map((metric) => (
                  <li key={metric.label} className="rounded-card border border-border bg-bg-elev px-5 py-4">
                    <p className="m-0 text-[2.25rem] leading-none text-accent">{metric.value}</p>
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

          <nav aria-label="More case studies" className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
            <a href="/#work" className="u-meta u-tap u-link text-fg-muted">
              All selected work
            </a>
            {next && (
              <a href={`/work/${next.slug}/`} className="u-tap gap-2 text-[1.25rem] no-underline">
                <span className="u-link">Next: {next.name}</span>
                <ForwardArrow />
              </a>
            )}
          </nav>
        </div>
      </main>
      <Footer page="case" />
    </>
  )
}
