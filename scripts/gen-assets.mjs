/**
 * Generates the favicon set and the 1200x630 OG card from one SVG source each.
 *
 * Run offline with `npm run gen:assets`; the PNGs are committed so the build
 * and the CI runner never need sharp. Re-run only when the mark or the OG copy
 * changes.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

const INK = '#0b0b0c'
const AMBER = '#e8a33d'
const PAPER = '#edeae4'

/*
 * sharp rasterises SVG through librsvg, which resolves only fonts installed on
 * the machine — generic families like `sans-serif` and any @font-face, embedded
 * base64 included, are ignored. So the OG card uses installed near-equivalents
 * of the site's three faces rather than the webfonts themselves. Verified by
 * rendering a probe sheet; these three resolve, the generic names do not.
 */
const SERIF = 'Georgia'
const SANS = 'Segoe UI'
const MONO = 'Consolas'

/** Monogram: an amber A over ink, with the crossbar left open. */
const monogram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${INK}"/>
  <path d="M32 14 46 50" fill="none" stroke="${PAPER}" stroke-width="5" stroke-linecap="round"/>
  <path d="M32 14 18 50" fill="none" stroke="${PAPER}" stroke-width="5" stroke-linecap="round"/>
  <path d="M24 38h16" fill="none" stroke="${AMBER}" stroke-width="5" stroke-linecap="round"/>
</svg>`

const ogCard = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${INK}"/>
  <rect x="0" y="0" width="1200" height="3" fill="${AMBER}"/>

  <text x="88" y="128" font-family="${MONO}" font-size="22"
        letter-spacing="3.5" fill="#6e6a63">SOFTWARE ENGINEER</text>

  <text x="86" y="288" font-family="${SERIF}" font-size="100"
        fill="${PAPER}">Abhay Yemekar</text>

  <text x="88" y="372" font-family="${SANS}" font-size="34"
        fill="#a6a29a">Turning ambiguous, messy problems into</text>
  <text x="88" y="422" font-family="${SERIF}" font-size="37"
        font-style="italic" fill="${AMBER}">clean, modular, reliable</text>
  <!-- Separate <text> rather than a <tspan>: librsvg drops the leading space
       inside a tspan, so the words collide. x=498 is measured against the
       italic run above — re-measure if that string changes. -->
  <text x="498" y="422" font-family="${SANS}" font-size="34"
        fill="#a6a29a">systems.</text>

  <rect x="88" y="486" width="52" height="2" fill="${AMBER}"/>
  <text x="88" y="548" font-family="${MONO}" font-size="23"
        letter-spacing="2" fill="#6e6a63">PYTHON · AI/LLM · BACKEND · DATA</text>
  <text x="1112" y="548" text-anchor="end" font-family="${MONO}"
        font-size="23" letter-spacing="2" fill="#6e6a63">abhayemekar.me</text>
</svg>`

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

await writeFile(
  join(publicDir, 'og.png'),
  await sharp(Buffer.from(ogCard)).png({ compressionLevel: 9 }).toBuffer(),
)

console.log('Wrote favicon.svg, 4 PNG icons and og.png to public/')
