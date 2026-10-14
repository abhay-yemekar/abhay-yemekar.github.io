/**
 * Writes one static HTML file per route into dist/.
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

for (const path of entry.paths) {
  const html = await entry.renderPage(path, template)
  if (html.includes('<!--app-')) throw new Error(`Unfilled template marker in ${path}`)

  const file = path === '/' ? join(dist, 'index.html') : join(dist, ...path.split('/').filter(Boolean), 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  console.log(`prerendered ${path.padEnd(24)} ${(Buffer.byteLength(html) / 1024).toFixed(1)} kB`)
}

const todos = entry.listTodos()
if (todos.length > 0) {
  console.warn(`\n⚠ ${todos.length} TODO(s), omitted from this build. They need Abhay's input:`)
  for (const { path, text } of todos) console.warn(`  - ${path}: ${text}`)
  console.warn('')
}

rmSync(ssrDir, { recursive: true, force: true })
