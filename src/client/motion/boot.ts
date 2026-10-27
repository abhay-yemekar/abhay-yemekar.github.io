/**
 * The motion layer (v4, the subtle set): one-shot scroll reveals and the
 * project cards' hover previews, in plain TypeScript and CSS. main.ts imports
 * this after first paint, only when <html data-motion="on">, so none of it is
 * on the critical path. The case-page films are separate (src/client/films.ts):
 * they have their own buttons.
 *
 * stop() undoes everything start(): it runs if the OS turns reduced motion on
 * while the page is open.
 */
import { initReveals } from './reveals'
import { initWorkPreview } from './work-preview'

type Teardown = () => void

const mouse = () => matchMedia('(hover: hover) and (pointer: fine)').matches

let teardowns: Teardown[] | undefined

export function start() {
  if (teardowns) return
  teardowns = [initReveals()]
  const list = document.querySelector<HTMLElement>('[data-work-index]')
  if (list && mouse()) teardowns.push(initWorkPreview(list))
}

export function stop() {
  if (!teardowns) return
  for (const teardown of teardowns.reverse()) teardown()
  teardowns = undefined
}
