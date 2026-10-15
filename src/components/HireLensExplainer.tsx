import { hirelensSample, segment, shortDate, type SampleCriterion } from '../lib/hirelens'

const { criteria, resumeText, blindText, provenance, candidate, job, overall } = hirelensSample
const first = criteria[0] as SampleCriterion

/** One clear or blind copy of the resume, cut at every evidence boundary. */
function ResumeText({ text, variant }: { text: string; variant: 'clear' | 'blind' }) {
  return (
    <pre
      data-resume={variant}
      hidden={variant === 'blind'}
      className="m-0 font-mono text-[0.8125rem] leading-[1.75] whitespace-pre-wrap text-fg-muted"
    >
      {segment(text, criteria).map((part) =>
        part.keys.length === 0 ? (
          part.text
        ) : (
          <mark
            key={part.start}
            data-keys={part.keys.join(' ')}
            {...(part.keys.includes(first.key) ? { 'data-active': '' } : {})}
            className="rounded-[2px] bg-transparent text-fg-muted underline decoration-fg-subtle decoration-dotted decoration-1 underline-offset-[0.25em] [&[data-active]]:bg-wash [&[data-active]]:text-fg [&[data-active]]:decoration-mark [&[data-active]]:decoration-solid [&[data-active]]:decoration-2"
          >
            {part.text}
          </mark>
        ),
      )}
    </pre>
  )
}

/**
 * The signature moment: how HireLens scored one fictional candidate, using
 * real output from its production engine.
 *
 * Everything is in the prerendered HTML: every criterion, every rationale and
 * both resume variants. Without JS it shows the first criterion with all
 * evidence underlined. src/client/explainer.ts (loaded only where this
 * component exists) switches criteria and toggles blind review.
 */
export function HireLensExplainer({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <figure
      id="how-hirelens-scores"
      data-explainer
      aria-labelledby="explainer-title"
      className="m-0 mt-8 scroll-mt-24 rounded-card border border-border bg-bg-elev"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-border px-5 py-4 lg:px-6">
        <Heading id="explainer-title" className="m-0 text-[1.375rem]">
          How HireLens scored a candidate
        </Heading>
        <button
          type="button"
          data-blind-toggle
          aria-pressed="false"
          className="u-meta u-tap gap-2 text-fg-muted [html:not(.js)_&]:hidden"
        >
          <span
            aria-hidden="true"
            className="grid h-4 w-7 items-center rounded-full border border-fg-subtle px-0.5 [[aria-pressed=true]_&]:justify-items-end [[aria-pressed=true]_&]:border-mark"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-fg-subtle [[aria-pressed=true]_&]:bg-mark" />
          </span>
          Blind review
        </button>
      </header>

      <div className="grid lg:grid-cols-[5fr_7fr]">
        <div className="border-border px-5 py-5 lg:border-r lg:px-6">
          <p className="u-meta mt-0 mb-3 text-fg-subtle">
            {job.title} · {job.company}
          </p>
          <ul className="m-0 list-none p-0" aria-label="Criteria">
            {criteria.map((c) => (
              <li key={c.key}>
                <button
                  type="button"
                  data-criterion={c.key}
                  aria-pressed={c.key === first.key}
                  aria-controls="explainer-detail"
                  className="flex min-h-11 w-full items-baseline justify-between gap-4 rounded-sm px-3 py-2 text-left text-small text-fg-muted transition-colors duration-(--duration-fast) hover:text-fg [&[aria-pressed=true]]:bg-wash [&[aria-pressed=true]]:text-fg"
                >
                  <span>{c.title}</span>
                  <span className="u-meta shrink-0">
                    {c.score}/5{c.weight !== 1 && ` · ×${c.weight}`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="u-meta mt-4 mb-0 flex justify-between border-t border-border px-3 pt-3 text-fg-muted">
            <span>Weighted overall</span>
            <span className="font-semibold text-fg">{overall} / 100</span>
          </p>
        </div>

        <div className="px-5 py-5 lg:px-6">
          <div id="explainer-detail" aria-live="polite">
            {criteria.map((c) => (
              <div key={c.key} data-detail={c.key} hidden={c.key !== first.key}>
                <p className="m-0 flex flex-wrap items-baseline gap-x-3 text-small">
                  <span className="font-semibold">{c.title}</span>
                  <span className="u-meta text-fg-muted">
                    {c.score} of 5{c.level && ` · ${c.level}`}
                  </span>
                </p>
                <blockquote className="m-0 mt-2 border-l-2 border-mark pl-3 text-small text-fg-muted">
                  {c.rationale}
                </blockquote>
                {c.evidence.map((e) => (
                  <p key={e.start} className="u-meta mt-2 mb-0 text-fg-subtle">
                    Evidence: characters [{e.start}, {e.end}), located in the resume by code, not by the model
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-5 max-h-[22rem] overflow-y-auto rounded-sm border border-border bg-bg px-4 py-3"
            role="region"
            tabIndex={0}
            aria-label={`Resume of ${candidate.name}, fictional`}
            data-resume-box
          >
            <ResumeText text={resumeText} variant="clear" />
            <ResumeText text={blindText} variant="blind" />
          </div>
        </div>
      </div>

      <figcaption className="u-meta border-t border-border px-5 py-3 text-fg-subtle lg:px-6">
        Real output from the HireLens engine ({provenance.modelId}), fetched from the live demo on{' '}
        {shortDate(provenance.fetchedAt)}. The candidate, company and job are fictional. Every quote is checked
        against its offsets when this site is built.
      </figcaption>
    </figure>
  )
}
