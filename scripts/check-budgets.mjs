/**
 * Fails the build when a page goes over its weight budget.
 *
 * Sizes are gzip -9 of the built files, which is about what GitHub Pages
 * serves. Fonts are counted raw, because woff2 is already compressed.
 *
 * Budgets (docs/PORTFOLIO_BRIEF.md, Phase 2):
 * - JS loaded at page start: was 99 kB gzip when React ran in the browser.
 *   Now that React only renders at build time, 10 kB is generous headroom
 *   for small client behaviours.
 * - JS loaded after first paint (v3 motion layer, 2026-10-16): GSAP with
 *   ScrollTrigger, SplitText and CustomEase, plus Lenis, measured at 57.6 kB;
 *   the OGL particle chunk at 16.3 kB. 85 kB covers every deferred chunk
 *   together, and the particle chunk alone gets 20 kB.
 * - Fonts: 130 KiB for every face the site ships.
 * Raise a number only with a reason recorded next to it.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const BUDGET = {
  initialJsKb: 10,
  cssKb: 15,
  htmlKb: 40,
  fontsKib: 130,
  deferredJsKb: 85,
  particlesKb: 20,
}

const dist = resolve(import.meta.dirname, '..', 'dist')
const gz = (file) => gzipSync(readFileSync(file), { level: 9 }).length / 1000

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })

const files = walk(dist)
const pages = files.filter((file) => file.endsWith('index.html'))
const failures = []
const rows = []

for (const page of pages) {
  const html = readFileSync(page, 'utf8')
  const refs = (pattern) => [...html.matchAll(pattern)].map((match) => join(dist, match[1]))
  const js = refs(/<script[^>]+type="module"[^>]+src="\/([^"]+)"/g).concat(refs(/<link[^>]+rel="modulepreload"[^>]+href="\/([^"]+)"/g))
  const css = refs(/<link[^>]+rel="stylesheet"[^>]+href="\/([^"]+)"/g)

  const jsKb = js.reduce((sum, file) => sum + gz(file), 0)
  const cssKb = css.reduce((sum, file) => sum + gz(file), 0)
  const htmlKb = gz(page)
  const name = '/' + relative(dist, page).replace(/\\/g, '/').replace(/index\.html$/, '')
  rows.push({ page: name, 'JS kB': jsKb.toFixed(2), 'CSS kB': cssKb.toFixed(2), 'HTML kB': htmlKb.toFixed(2) })

  if (jsKb > BUDGET.initialJsKb) failures.push(`${name}: initial JS ${jsKb.toFixed(1)} kB > ${BUDGET.initialJsKb} kB`)
  if (cssKb > BUDGET.cssKb) failures.push(`${name}: CSS ${cssKb.toFixed(1)} kB > ${BUDGET.cssKb} kB`)
  if (htmlKb > BUDGET.htmlKb) failures.push(`${name}: HTML ${htmlKb.toFixed(1)} kB > ${BUDGET.htmlKb} kB`)
}

// Every JS file that no page loads at start is deferred: the explainer, the
// motion layer and the particle chunk.
const initial = new Set(
  pages.flatMap((page) =>
    [...readFileSync(page, 'utf8').matchAll(/(?:src|href)="\/(assets\/[^"]+\.js)"/g)].map((match) => join(dist, match[1])),
  ),
)
const deferred = files.filter((file) => file.endsWith('.js') && !initial.has(file))
const deferredKb = deferred.reduce((sum, file) => sum + gz(file), 0)
const particles = deferred.find((file) => /hero-particles-[\w-]+\.js$/.test(file))
const particlesKb = particles ? gz(particles) : 0
if (deferredKb > BUDGET.deferredJsKb) failures.push(`deferred JS ${deferredKb.toFixed(1)} kB > ${BUDGET.deferredJsKb} kB`)
if (particlesKb > BUDGET.particlesKb) failures.push(`particle chunk ${particlesKb.toFixed(1)} kB > ${BUDGET.particlesKb} kB`)

const fontsKib = files.filter((file) => file.endsWith('.woff2')).reduce((sum, file) => sum + statSync(file).size, 0) / 1024
if (fontsKib > BUDGET.fontsKib) failures.push(`fonts ${fontsKib.toFixed(1)} KiB > ${BUDGET.fontsKib} KiB`)

console.table(rows)
console.log(`fonts: ${fontsKib.toFixed(1)} KiB (budget ${BUDGET.fontsKib})`)
console.log(
  `deferred JS: ${deferredKb.toFixed(1)} kB in ${deferred.length} chunks (budget ${BUDGET.deferredJsKb}), particles ${particlesKb.toFixed(1)} kB (budget ${BUDGET.particlesKb})`,
)

if (failures.length > 0) {
  console.error('\nOver budget:\n' + failures.map((failure) => `  - ${failure}`).join('\n'))
  process.exit(1)
}
console.log('budgets: ok')
