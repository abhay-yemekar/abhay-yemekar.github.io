import { hirelensSample, shortDate } from '../lib/hirelens'

/** The criterion shown in the hero: its evidence is a single, self-contained line. */
const FEATURED = 'postgres-at-scale'

/**
 * Proof next to the claim: one criterion from real HireLens output, with its
 * quote marked in the line it came from. Static HTML, no JS. The full
 * interactive version sits under the HireLens entry (#how-hirelens-scores).
 */
export function HeroEvidence() {
  const { criteria, resumeText, provenance, candidate } = hirelensSample
  const criterion = criteria.find((c) => c.key === FEATURED)
  const span = criterion?.evidence[0]
  if (!criterion || !span) return null

  // The whole line the quote sits on, so the mark has context either side.
  const lineStart = resumeText.lastIndexOf('\n', span.start) + 1
  const lineEnd = resumeText.indexOf('\n', span.end)
  const before = resumeText.slice(lineStart, span.start)
  const after = resumeText.slice(span.end, lineEnd === -1 ? undefined : lineEnd)

  return (
    <figure className="m-0 self-end rounded-card border border-border bg-bg-elev" aria-label="Sample HireLens output">
      <p className="u-meta m-0 flex justify-between gap-4 border-b border-border px-5 py-3 text-fg-subtle">
        <span>HireLens · real output</span>
        <span>{candidate.name} (fictional)</span>
      </p>
      <div className="px-5 py-4">
        <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-4">
          <span className="font-semibold">{criterion.title}</span>
          <span className="u-meta text-fg-muted">
            {criterion.score} of 5{criterion.level && ` · ${criterion.level}`}
          </span>
        </p>
        <p className="m-0 mt-3 font-mono text-[0.8125rem] leading-[1.75] text-fg-muted">
          {before}
          <mark className="rounded-[2px] bg-wash text-fg underline decoration-mark decoration-2 underline-offset-[0.25em]">
            {span.quotedText}
          </mark>
          {after}
        </p>
        <p className="u-meta mt-3 mb-0 text-fg-subtle">
          characters [{span.start}, {span.end}), located by code, not by the model
        </p>
      </div>
      <figcaption className="u-meta flex flex-wrap justify-between gap-x-4 border-t border-border px-5 py-3 text-fg-subtle">
        <span>
          {provenance.modelId} · {shortDate(provenance.fetchedAt)}
        </span>
        <a href="#how-hirelens-scores" className="u-tap">
          <span className="u-link text-fg">All six criteria</span>
        </a>
      </figcaption>
    </figure>
  )
}
