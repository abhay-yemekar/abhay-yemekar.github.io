/**
 * Renders the 1200×630 Open Graph cards into public/og/<slug>.png.
 *
 *   npm run gen:og
 *
 * The cards are HTML screenshotted by headless Chrome, so they use the site's
 * real fonts and tokens. (sharp/librsvg, used for the favicons, only sees fonts
 * installed on the machine.) The copy comes from src/entry-server.tsx
 * (`ogCards`), loaded through Vite, so a card can't disagree with its page.
 *
 * Run offline after changing a title or a case study. The PNGs are committed,
 * so CI never needs a browser. Set CHROME_PATH if Chrome isn't found.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'
import { createServer } from 'vite'

const root = resolve(import.meta.dirname, '..')
const outDir = join(root, 'public', 'og')
const font = (path) => pathToFileURL(join(root, 'node_modules', path)).href

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)
const chrome = CHROME_CANDIDATES.find((path) => existsSync(path))
if (!chrome) throw new Error('No Chrome or Edge found. Set CHROME_PATH.')

// The light "paper" theme: these cards are read on white feeds.
const T = { bg: '#f7f5ef', fg: '#1a1917', muted: '#4f4b45', subtle: '#625e57', accent: '#8a5300', mark: '#a86f0a', wash: 'rgb(227 165 42 / 0.3)', rule: '#dcd6ca' }

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function cardHtml(card) {
  const title = card.mark
    ? escape(card.title).replace(escape(card.mark), `<span class="ev">${escape(card.mark)}</span>`)
    : escape(card.title)
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: N; src: url('${font('@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2')}'); font-weight: 200 800; }
@font-face { font-family: M; src: url('${font('@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}'); font-weight: 100 800; }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { background: ${T.bg}; color: ${T.fg}; font-family: N, Georgia, serif; padding: 72px 88px; display: flex; flex-direction: column; }
.eyebrow { font: 400 24px/1 M, monospace; letter-spacing: 0.02em; color: ${T.subtle}; }
h1 { font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin-top: 40px; }
.home h1 { font-size: 92px; max-width: 15ch; }
.case h1 { font-size: 112px; }
.sub { font-size: 44px; line-height: 1.2; color: ${T.muted}; margin-top: 22px; max-width: 26ch; }
.pattern { font: 500 24px/1 M, monospace; color: ${T.accent}; margin-top: 26px; }
.ev { background: ${T.wash}; box-shadow: inset 0 -4px 0 ${T.mark}; padding: 0 0.06em; border-radius: 3px; }
footer { margin-top: auto; display: flex; justify-content: space-between; align-items: baseline; border-top: 2px solid ${T.rule}; padding-top: 22px; font: 400 24px/1 M, monospace; color: ${T.subtle}; }
footer b { font: 600 30px/1 N, serif; color: ${T.fg}; letter-spacing: 0; }
</style></head><body class="${card.subtitle ? 'case' : 'home'}">
<p class="eyebrow">${escape(card.eyebrow)}</p>
<h1>${title}</h1>
${card.subtitle ? `<p class="sub">${escape(card.subtitle)}</p>` : ''}
${card.pattern ? `<p class="pattern">${escape(card.pattern)}</p>` : ''}
<footer><b>Abhay Yemekar</b><span>${escape(card.footer)}</span></footer>
</body></html>`
}

const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' })
let cards
try {
  ;({ ogCards: cards } = await vite.ssrLoadModule('/src/entry-server.tsx'))
} finally {
  await vite.close()
}

mkdirSync(outDir, { recursive: true })
const work = mkdtempSync(join(tmpdir(), 'og-'))
try {
  for (const card of cards) {
    const html = join(work, `${card.slug}.html`)
    const raw = join(work, `${card.slug}.png`)
    writeFileSync(html, cardHtml(card))
    execFileSync(chrome, [
      '--headless=new',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--force-color-profile=srgb',
      '--allow-file-access-from-files',
      '--virtual-time-budget=4000',
      '--window-size=1200,630',
      `--screenshot=${raw}`,
      pathToFileURL(html).href,
    ], { stdio: 'ignore' })
    const out = join(outDir, `${card.slug}.png`)
    await sharp(raw).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out)
    console.log(`og/${card.slug}.png`)
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}
