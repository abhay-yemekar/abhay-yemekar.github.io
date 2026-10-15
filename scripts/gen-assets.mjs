/**
 * Generates the favicon set from one SVG monogram.
 *
 *   npm run gen:assets
 *
 * Run offline. The PNGs are committed, so the build and the CI runner never
 * need sharp. Re-run only when the mark changes. The Open Graph cards are made
 * by scripts/gen-og.mjs instead: sharp rasterises SVG through librsvg, which
 * can't use the site's web fonts.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

// The dark "Evidence" tokens: a favicon sits on browser chrome of either theme,
// and the dark tile holds its shape on both.
const INK = '#121110'
const AMBER = '#f0b54c'
const PAPER = '#ece8df'

/** Monogram: an A on ink, with an amber crossbar (the evidence mark). */
const monogram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${INK}"/>
  <path d="M32 14 46 50" fill="none" stroke="${PAPER}" stroke-width="5" stroke-linecap="round"/>
  <path d="M32 14 18 50" fill="none" stroke="${PAPER}" stroke-width="5" stroke-linecap="round"/>
  <path d="M24 38h16" fill="none" stroke="${AMBER}" stroke-width="5" stroke-linecap="round"/>
</svg>
`

const png = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer()

await mkdir(publicDir, { recursive: true })
await writeFile(join(publicDir, 'favicon.svg'), monogram)

for (const [name, size] of [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['favicon-192.png', 192],
  ['favicon-512.png', 512],
]) {
  await writeFile(join(publicDir, name), await png(monogram, size))
}

console.log('Wrote favicon.svg and 4 PNG icons to public/')
