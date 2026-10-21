/**
 * The motion layer: GSAP (ScrollTrigger, SplitText, CustomEase), Lenis and,
 * in its own chunk, the OGL particle field. main.ts imports this after first
 * paint, only when <html data-motion="on">, so none of it is on the critical
 * path, and under prefers-reduced-motion it runs only after "Play motion".
 *
 * start() and stop() are what the "Pause motion" control calls. stop() undoes
 * everything start() did: splits reverted, inline styles cleared, Lenis
 * destroyed, the particle field crossfaded back to the SVG wordmark.
 */
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { initCursor } from './cursor'
import { initFilms } from './films'
import { initMagnetic } from './magnetic'
import { initNavHide } from './nav-hide'
import { initReveals } from './reveals'
import { initScramble } from './scramble'
import { initSmoothScroll } from './smooth-scroll'
import { initWorkPreview } from './work-preview'

gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText)
// The same curve as --ease-entrance in globals.css.
CustomEase.create('entrance', '0.16, 1, 0.3, 1')

type Teardown = () => void

const mouse = () => matchMedia('(hover: hover) and (pointer: fine)').matches

/** No particles where they'd cost more than they give. */
function particlesWelcome() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return false
  return (nav.hardwareConcurrency ?? 8) >= 4
}

let running = false
let generation = 0
let teardowns: Teardown[] = []

export async function start() {
  if (running) return
  running = true
  const gen = ++generation
  // A stop() can land while start() awaits; anything set up after it is undone at once.
  const keep = (teardown: Teardown) => (gen === generation ? teardowns.push(teardown) : teardown())

  keep(initNavHide())
  keep(initFilms())
  if (mouse()) {
    keep(initSmoothScroll())
    keep(initCursor())
    keep(initMagnetic())
    keep(initScramble())
    const list = document.querySelector<HTMLElement>('[data-work-index]')
    if (list && matchMedia('(min-width: 1024px)').matches) keep(initWorkPreview(list))
  }

  const hero = document.querySelector<HTMLElement>('[data-hero]')
  // The particle field is a garnish: if its chunk or WebGL fails, the SVG
  // wordmark stays and the rest of the layer carries on.
  const particles =
    hero && particlesWelcome()
      ? import('./hero-particles')
          .then(({ initParticles }) => initParticles(hero))
          .catch((): Teardown => () => {})
      : undefined

  keep(await initReveals())
  if (particles) keep(await particles)
}

export function stop() {
  if (!running) return
  running = false
  generation++
  for (const teardown of teardowns.reverse()) teardown()
  teardowns = []
}
