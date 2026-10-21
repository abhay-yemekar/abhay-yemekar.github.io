/**
 * Generates the project media in public/media/<slug>/ from Abhay's own public
 * repos, cloned beside this one (../hirelens, ../ydirect, ...), and from
 * captures kept in docs/media-src when no clone has the image. The output is
 * committed, so CI never runs this.
 *
 *   npm run gen:media                 # sources under ..
 *   MEDIA_SRC=/path/to/clones npm run gen:media
 *
 * Each project gets a 16:10 poster at 640 and 1024 wide, as AVIF and WebP.
 * Crops are chosen by hand to leave out browser chrome, OS taskbars, dev-tool
 * badges and anything personal. Re-check a new source image for a phone
 * number, an address or a secret before adding it here.
 *
 * Never read from the private inksl_ay repo.
 */
import { copyFileSync, mkdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'

const root = resolve(import.meta.dirname, '..')
const src = resolve(root, process.env.MEDIA_SRC ?? '..')
const out = join(root, 'public', 'media')

const WIDTHS = [640, 1024]
const ASPECT = 10 / 16

/** crop: a region of the source in its own pixels, or undefined for the whole frame. */
const posters = [
  {
    slug: 'hirelens',
    // Frame 13 of the demo: six criteria scored, the evidence marked in the resume.
    from: 'hirelens/docs/demo.gif',
    page: 13,
    crop: { left: 110, top: 52, width: 920, height: 575 },
  },
  {
    slug: 'searchscribe',
    // The studio's home hero, without the Next.js dev badge in the corner.
    from: 'SearchScribe_AI_Studio/screenshots/redesign-home-hero.png',
    crop: { left: 440, top: 190, width: 3000, height: 1875 },
  },
  {
    slug: 'forecastgpt',
    // The live app's "solution" section with its real sample-run card. The
    // repo's screenshots show the older FastAPI-only UI, so this was captured
    // from forecastgpt-financial-outlook-agent.onrender.com at 1440x900 in
    // headless Chrome on 2026-10-16 and kept in docs/media-src.
    from: './docs/media-src/forecastgpt-solution.png',
    crop: { left: 170, top: 50, width: 1100, height: 688 },
  },
  {
    slug: 'ydirect',
    from: 'ydirect/assets/screenshots/01-everyday-reuse-1280x800.png',
  },
]

/** Moving previews, played on hover only and never preloaded. */
const previews = [
  // Animated WebP from the HireLens demo GIF (17 frames).
  { slug: 'hirelens', from: 'hirelens/docs/demo.gif', to: 'preview.webp', animated: true },
  // A scroll through the live ForecastGPT site, hero to sample report: 46 CDP
  // frames joined by sharp on 2026-10-16 (docs/media-src), served as-is.
  { slug: 'forecastgpt', from: './docs/media-src/forecastgpt-scroll.webp', to: 'preview.webp' },
  // yDirect's own product tour, served as-is (CC BY 4.0, Abhay's).
  { slug: 'ydirect', from: 'ydirect/assets/demo/ydirect-product-tour.webm', to: 'tour.webm' },
]

const kb = (file) => `${(statSync(file).size / 1024).toFixed(1)} KiB`
/** "./x" is inside this repo; anything else is under MEDIA_SRC. */
const source = (from) => (from.startsWith('./') ? join(root, from) : join(src, from))

for (const poster of posters) {
  const dir = join(out, poster.slug)
  mkdirSync(dir, { recursive: true })
  const input = source(poster.from)

  for (const width of WIDTHS) {
    const base = () => {
      let image = sharp(input, poster.page === undefined ? {} : { page: poster.page })
      if (poster.crop) image = image.extract(poster.crop)
      return image.resize({ width, height: Math.round(width * ASPECT), fit: 'cover', position: 'top' })
    }
    const avif = join(dir, `poster-${width}.avif`)
    const webp = join(dir, `poster-${width}.webp`)
    await base().avif({ quality: 52, effort: 6 }).toFile(avif)
    await base().webp({ quality: 74, effort: 6 }).toFile(webp)
    console.log(`${poster.slug} ${width}: avif ${kb(avif)}, webp ${kb(webp)}`)
  }
}

for (const preview of previews) {
  const dir = join(out, preview.slug)
  mkdirSync(dir, { recursive: true })
  const input = source(preview.from)
  const target = join(dir, preview.to)

  if (preview.animated) {
    await sharp(input, { animated: true })
      .resize({ width: 640 })
      .webp({ quality: 62, effort: 6, loop: 0 })
      .toFile(target)
  } else {
    copyFileSync(input, target)
  }
  console.log(`${preview.slug} ${preview.to}: ${kb(target)}`)
}
