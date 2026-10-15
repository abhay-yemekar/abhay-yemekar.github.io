import sample from '../data/hirelens-sample.json'

/**
 * Real HireLens output for the explainer: one fictional resume scored by the
 * production engine through the live demo. Provenance travels with the data;
 * see src/data/hirelens-sample.json.
 */
export type SampleCriterion = {
  key: string
  title: string
  weight: number
  score: number
  level: string | null
  rationale: string
  evidence: { start: number; end: number; quotedText: string }[]
}

export const hirelensSample = sample as typeof sample & { criteria: SampleCriterion[] }

/*
 * Verify at build time that every quote sits at its offsets, in both the
 * clear and the blind text. This is the same guarantee HireLens makes, and the
 * build fails rather than ship an explainer whose evidence doesn't line up.
 */
for (const criterion of hirelensSample.criteria) {
  for (const span of criterion.evidence) {
    if (hirelensSample.resumeText.slice(span.start, span.end) !== span.quotedText) {
      throw new Error(`hirelens-sample: quote for "${criterion.key}" is not at [${span.start}, ${span.end})`)
    }
  }
}
if (hirelensSample.blindText.length !== hirelensSample.resumeText.length) {
  throw new Error('hirelens-sample: blind text must keep every offset')
}

export type Segment = { text: string; start: number; keys: string[] }

/**
 * Splits text at every evidence boundary. Each segment lists the criteria
 * whose evidence covers it, so one span can light up for several criteria.
 * Works for the blind text too, because masking preserves offsets.
 */
export function segment(text: string, criteria: SampleCriterion[]): Segment[] {
  const cuts = new Set([0, text.length])
  for (const c of criteria) for (const e of c.evidence) cuts.add(e.start).add(e.end)
  const points = [...cuts].sort((a, b) => a - b)
  return points.slice(0, -1).map((start, i) => {
    const end = points[i + 1] ?? text.length
    const keys = criteria
      .filter((c) => c.evidence.some((e) => e.start <= start && e.end >= end))
      .map((c) => c.key)
    return { text: text.slice(start, end), start, keys }
  })
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-10-15" → "15 Oct 2026", without depending on the build machine's locale. */
export function shortDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`
}
