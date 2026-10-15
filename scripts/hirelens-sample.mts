/**
 * Rebuilds src/data/hirelens-sample.json: the explainer's data.
 *
 * The scores come from the HireLens production engine via its public demo,
 * not from this repo. The resume, rubric and blind-review masking come from a
 * HireLens checkout, so the explainer shows exactly what HireLens shows.
 * Nothing is written into the HireLens checkout.
 *
 *   1. Save one demo response:
 *        curl -X POST https://hirelens-rosy.vercel.app/api/demo/score \
 *          -H "content-type: application/json" -d '{"resumeId":"jordan-avery"}' -o demo.json
 *   2. Run with HireLens's own tsx, from its packages/evals directory:
 *        ./node_modules/.bin/tsx <portfolio>/scripts/hirelens-sample.mts \
 *          <hirelens-dir> demo.json <portfolio>/src/data/hirelens-sample.json YYYY-MM-DD
 *
 * It refuses a response from the demo's heuristic fallback, and it refuses any
 * quote that isn't at its offsets.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const [hirelensDir, responsePath, outPath, fetchedAt] = process.argv.slice(2)
if (!hirelensDir || !responsePath || !outPath || !fetchedAt) {
  throw new Error('usage: hirelens-sample.mts <hirelens-dir> <demo.json> <out.json> <YYYY-MM-DD>')
}
const load = (path: string) => import(pathToFileURL(join(hirelensDir, path)).href)
const { blindView } = await load('packages/core/src/mask/blind.ts')
const { DEMO_RESUMES, DEMO_RUBRIC } = await load('apps/web/src/lib/demo-data.ts')

const response = JSON.parse(readFileSync(responsePath, 'utf8'))
const resumeId = 'jordan-avery'
const resume = DEMO_RESUMES.find((r: { id: string }) => r.id === resumeId)

if (response.mode !== 'llm') throw new Error(`demo answered in ${response.mode} mode; refusing to use it`)

const blind: string = blindView(resume.text)
if (blind.length !== resume.text.length) throw new Error('blindView changed the text length')

const criteria = response.criteria.map((c: any) => {
  const rubric = DEMO_RUBRIC.criteria.find((r: any) => r.key === c.key)
  for (const e of c.evidence) {
    if (resume.text.slice(e.start, e.end) !== e.quotedText) throw new Error(`offset mismatch for ${c.key}`)
  }
  return {
    key: c.key,
    title: c.title,
    weight: rubric.weight,
    score: c.score,
    level: rubric.scale[c.score]?.label ?? null,
    rationale: c.rationale,
    evidence: c.evidence.map((e: any) => ({ start: e.start, end: e.end, quotedText: e.quotedText })),
  }
})

const fixture = {
  provenance: {
    source: 'https://hirelens-rosy.vercel.app/api/demo/score',
    request: { resumeId },
    fetchedAt,
    mode: response.mode,
    modelId: response.modelId,
    hirelensVersion: '1.4.0',
    note: 'Real output from the HireLens production engine via its public demo. The resume, company and job are fictional, from HireLens apps/web/src/lib/demo-data.ts. blindText is HireLens blindView() on the same text.',
  },
  job: { title: DEMO_RUBRIC.title.replace(' (demo)', ''), company: 'Meridian Pay (fictional)' },
  candidate: { name: resume.name, role: resume.role },
  resumeText: resume.text,
  blindText: blind,
  overall: response.overall,
  criteria,
}
writeFileSync(outPath, JSON.stringify(fixture, null, 2) + '\n')
console.log(`wrote ${criteria.length} criteria, overall ${response.overall}; every offset verified`)
