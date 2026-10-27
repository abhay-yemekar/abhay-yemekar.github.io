/**
 * The motion layer (v4, the subtle set): GSAP with ScrollTrigger and
 * SplitText for one-shot reveals, the case-page films, and the project cards'
 * hover previews. main.ts imports this after first paint, only when
 * <html data-motion="on">, so none of it is on the critical path.
 *
 * start() and stop() are what the "Pause motion" control on the case pages
 * calls. stop() undoes everything start() did: splits reverted, inline styles
 * cleared, previews and films removed.
 */
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { initFilms } from './films'
import { initReveals } from './reveals'
import { initWorkPreview } from './work-preview'

gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText)
// The same curve as --ease-entrance in globals.css.
CustomEase.create('entrance', '0.16, 1, 0.3, 1')

type Teardown = () => void

const mouse = () => matchMedia('(hover: hover) and (pointer: fine)').matches

let running = false
let generation = 0
let teardowns: Teardown[] = []

export async function start() {
  if (running) return
  running = true
  const gen = ++generation
  // A stop() can land while start() awaits; anything set up after it is undone at once.
  const keep = (teardown: Teardown) => (gen === generation ? teardowns.push(teardown) : teardown())

  keep(initFilms())
  const list = document.querySelector<HTMLElement>('[data-work-index]')
  if (list && mouse()) keep(initWorkPreview(list))

  keep(await initReveals())
}

export function stop() {
  if (!running) return
  running = false
  generation++
  for (const teardown of teardowns.reverse()) teardown()
  teardowns = []
}
