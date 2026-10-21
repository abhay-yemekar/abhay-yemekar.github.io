/**
 * Writes one static HTML file per route into dist/, plus sitemap.xml,
 * llms.txt, robots.txt and CNAME generated from the same data.
 *
 * The site's address lives in one place, profile.siteUrl (src/data/profile.ts).
 * Moving from the custom domain to abhay-yemekar.github.io is that one line:
 * CNAME is then left out, since a github.io address takes none.
 *
 * Runs after `vite build` (client: CSS, fonts, src/client/main.ts, and the
 * processed index.html template) and `vite build --ssr` (src/entry-server.tsx
 * into dist-ssr/). Each route renders into a copy of the template, so every
 * page ships complete HTML in the first response. Afterwards dist-ssr/ is
 * removed: it's build machinery, not output.
 *
 * Plain Node and fs, so it runs the same on Windows and on the Linux CI runner.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')
const template = readFileSync(join(dist, 'index.html'), 'utf8')
const entry = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)
const SITE = entry.siteUrl
const host = new URL(SITE).host

for (const page of entry.pages) {
  const html = await entry.renderPage(page.path, template)
  if (html.includes('<!--app-')) throw new Error(`Unfilled template marker in ${page.path}`)

  const file = join(dist, ...page.file.split('/'))
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  console.log(`prerendered ${page.file.padEnd(30)} ${(Buffer.byteLength(html) / 1024).toFixed(1)} kB`)
}

// The build date stands in for lastmod: every deploy rebuilds every page.
const today = new Date().toISOString().slice(0, 10)
const urls = entry.pages
  .filter((page) => page.listed)
  .map((page) => `  <url>\n    <loc>${SITE}${page.path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
)
writeFileSync(join(dist, 'llms.txt'), entry.llmsTxt())
writeFileSync(join(dist, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`)
if (!host.endsWith('.github.io')) writeFileSync(join(dist, 'CNAME'), `${host}
`)
console.log(`wrote sitemap.xml (${urls.length} URLs), llms.txt, robots.txt${host.endsWith('.github.io') ? '' : ` and CNAME (${host})`}`)

const todos = entry.listTodos()
if (todos.length > 0) {
  console.warn(`\n⚠ ${todos.length} TODO(s), omitted from this build. They need Abhay's input:`)
  for (const { path, text } of todos) console.warn(`  - ${path}: ${text}`)
  console.warn('')
}

rmSync(ssrDir, { recursive: true, force: true })
