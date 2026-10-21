import { defineConfig, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'

/**
 * The faces in the hero headline, which is the page's LCP element: Instrument
 * Sans (the condensed display cut comes from the same file) and Instrument
 * Serif Italic for the accent clause.
 */
const HERO_FACES = ['instrument-sans-latin-wdth-normal', 'instrument-serif-latin-400-italic']

/**
 * Injects a <link rel="preload"> for each of the hero headline's fonts.
 *
 * This has to be a plugin rather than a literal tag in index.html: Vite
 * content-hashes font filenames, and the hash is only known once the bundle is
 * emitted. The mono face carries 13px labels, and its metric-matched fallback
 * swaps without visible movement, so it isn't preloaded.
 */
function preloadHeroFonts(): Plugin {
  return {
    name: 'preload-hero-fonts',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(_html, ctx) {
      const outputs = Object.values(ctx.bundle ?? {})
      return HERO_FACES.flatMap((face) => {
        const asset = outputs.find((out) => out.fileName.includes(face) && out.fileName.endsWith('.woff2'))
        if (!asset) {
          // Loud rather than silent: renaming a font package would otherwise
          // quietly cost LCP on every future build with nothing to show why.
          this.warn(`preload-hero-fonts: no emitted .woff2 matching "${face}"`)
          return []
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
            injectTo: 'head-prepend' as const,
          },
        ]
      })
    },
  }
}

/**
 * Dev-server rendering. Pages are rendered by src/entry-server.tsx, the same
 * module the production prerender uses, so dev and prod emit identical HTML.
 * React never runs in the browser. A change to anything outside src/client and
 * src/styles reloads the page, because there's no client component to
 * hot-swap.
 */
/**
 * The slice of Node's request/response this middleware uses. The project
 * doesn't depend on @types/node, so Connect's types resolve to empty
 * interfaces. The template is read through Vite's `?raw` import for the same
 * reason, instead of node:fs.
 */
type DevRequest = { url?: string; method?: string; headers: { accept?: string } }
type DevResponse = { setHeader(name: string, value: string): void; end(body: string): void }

function renderInDev(): Plugin {
  return {
    name: 'render-in-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (rawReq, rawRes, next) => {
        const req = rawReq as unknown as DevRequest
        const res = rawRes as unknown as DevResponse
        const url = (req.url ?? '/').split('?')[0] ?? '/'
        if (req.method !== 'GET' || !req.headers.accept?.includes('text/html')) return next()

        try {
          const entry = await server.ssrLoadModule('/src/entry-server.tsx')
          const path = url.endsWith('/') ? url : `${url}/`
          if (!entry.paths.includes(path)) return next()

          const { default: raw } = await server.ssrLoadModule('/index.html?raw')
          const template = await server.transformIndexHtml(url, raw)
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(await entry.renderPage(path, template))
        } catch (error) {
          server.ssrFixStacktrace(error as Error)
          next(error)
        }
      })
    },
    handleHotUpdate({ file, server }) {
      const normalized = file.replace(/\\/g, '/')
      if (/\/src\/(?!client\/|styles\/)/.test(normalized)) {
        server.ws.send({ type: 'full-reload' })
        return []
      }
    },
  }
}

export default defineConfig({
  // Apex custom domain (abhayemekar.me), so assets resolve from the root.
  base: '/',
  plugins: [tailwindcss(), preloadHeroFonts(), renderInDev()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    reportCompressedSize: true,
  },
})
