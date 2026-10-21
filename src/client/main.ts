/**
 * The JavaScript every page loads. Every page arrives as complete HTML from the
 * prerender, so this only adds behaviour, and the site works fully without it:
 * - the theme and motion controls, the nav's current section, the Pune clock
 * - the HireLens explainer, a separate chunk, where one exists
 * - the motion layer (src/client/motion), loaded after first paint when
 *   <html data-motion="on">, or the moment someone presses "Play motion"
 */
import '../styles/globals.css'
import { initActiveSection } from './active-section'
import { initClock } from './clock'
import { initMotionToggle } from './motion-toggle'
import { initThemeToggle } from './theme'

initThemeToggle()
initActiveSection()
initClock()

const explainer = document.querySelector<HTMLElement>('[data-explainer]')
if (explainer) void import('./explainer').then(({ initExplainer }) => initExplainer(explainer))

const root = document.documentElement

// The first-visit intro (CSS) can be skipped: any key or click ends it at its final frame.
if (root.classList.contains('intro')) {
  const skip = () => root.classList.remove('intro')
  window.addEventListener('keydown', skip, { once: true })
  window.addEventListener('pointerdown', skip, { once: true })
}

let layer: Promise<typeof import('./motion/boot')> | undefined
const syncMotion = () => {
  if (root.dataset.motion === 'on') void (layer ??= import('./motion/boot')).then((motion) => motion.start())
  else void layer?.then((motion) => motion.stop())
}
// From the button, start or stop only after the next frame has painted, so the
// label flips at once. Tearing the whole layer down inside the click took
// pause to about 205 ms at 4x CPU throttle, past the 200 ms INP line.
initMotionToggle(() => requestAnimationFrame(() => setTimeout(syncMotion)))

/** After load and an idle moment, so the layer never competes with first paint. */
const afterFirstPaint = (run: () => void) => {
  const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(run, { timeout: 1200 }) : setTimeout(run, 200))
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
}
if (root.dataset.motion === 'on') afterFirstPaint(syncMotion)
