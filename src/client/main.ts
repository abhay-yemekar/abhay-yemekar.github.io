/**
 * The JavaScript every page loads. Every page arrives as complete HTML from the
 * prerender, so this only adds behaviour, and the site works fully without it:
 * - the theme toggle and the nav's current section
 * - the HireLens explainer and the case-page films, separate chunks, where
 *   the page has them
 * - the motion layer (src/client/motion), loaded after first paint when
 *   <html data-motion="on">, which follows the OS reduced-motion setting
 */
import '../styles/globals.css'
import { initActiveSection } from './active-section'
import { initThemeToggle } from './theme'

initThemeToggle()
initActiveSection()

// A mouse click on a link that opens a new tab leaves it focused, and Chrome
// redraws its focus ring when you come back to this tab. Keyboard activation
// (detail 0) keeps focus where it is, so keyboard users don't lose their place.
document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest('a[target="_blank"]') : null
  if (link instanceof HTMLElement && event.detail > 0) link.blur()
})

const explainer = document.querySelector<HTMLElement>('[data-explainer]')
if (explainer) void import('./explainer').then(({ initExplainer }) => initExplainer(explainer))

const films = [...document.querySelectorAll<HTMLElement>('[data-film]')]
if (films.length) void import('./films').then(({ initFilms }) => initFilms(films))

const root = document.documentElement

let layer: Promise<typeof import('./motion/boot')> | undefined
const syncMotion = () => {
  if (root.dataset.motion === 'on') void (layer ??= import('./motion/boot')).then((motion) => motion.start())
  else void layer?.then((motion) => motion.stop())
}

// The OS setting can change while the page is open: follow it.
const reduce = matchMedia('(prefers-reduced-motion: reduce)')
reduce.addEventListener('change', () => {
  root.dataset.motion = reduce.matches ? 'paused' : 'on'
  syncMotion()
})

/** After load and an idle moment, so the layer never competes with first paint. */
const afterFirstPaint = (run: () => void) => {
  const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(run, { timeout: 1200 }) : setTimeout(run, 200))
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
}
if (root.dataset.motion === 'on') afterFirstPaint(syncMotion)
