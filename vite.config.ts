import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** The face that renders the hero headline — the page's LCP element. */
const HERO_FACE = 'instrument-serif-latin-400-normal'

/**
 * Injects a <link rel="preload"> for the hero headline's font.
 *
 * This has to be a plugin rather than a literal tag in index.html because Vite
 * content-hashes font filenames, and the hash is only known once the bundle is
 * emitted. Without it the font is not requested until React has rendered the
 * <h1>, which pushed LCP roughly 300ms behind first paint.
 *
 * Only this one face is preloaded. Every extra preload competes with the JS
 * bundle for bandwidth on a throttled connection, and the other three faces
 * carry smaller text that `font-display: swap` handles without a visible cost.
 */
function preloadHeroFont(): Plugin {
  return {
    name: 'preload-hero-font',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(_html, ctx) {
      const asset = Object.values(ctx.bundle ?? {}).find(
        (out) => out.fileName.includes(HERO_FACE) && out.fileName.endsWith('.woff2'),
      )

      if (!asset) {
        // Loud rather than silent: renaming the font package would otherwise
        // quietly cost LCP on every future build with nothing to show why.
        this.warn(`preload-hero-font: no emitted .woff2 matching "${HERO_FACE}"`)
        return
      }

      return [
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            href: `/${asset.fileName}`,
            as: 'font',
            type: 'font/woff2',
            // Fonts are fetched in CORS mode even same-origin; without this the
            // preload misses and the browser downloads the file twice.
            crossorigin: '',
          },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

export default defineConfig({
  // Apex custom domain (abhayemekar.me), so assets resolve from the root.
  base: '/',
  plugins: [react(), tailwindcss(), preloadHeroFont()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    reportCompressedSize: true,
  },
})
