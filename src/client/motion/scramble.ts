const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/'

const running = new WeakMap<Element, number>()

/**
 * Cycles an element's text through random glyphs and settles it left to right
 * on the real text. Used only on mono labels, where every glyph has the same
 * width, so nothing reflows while it runs.
 */
export function scramble(el: HTMLElement, text: string, duration = 420) {
  cancelAnimationFrame(running.get(el) ?? 0)
  const start = performance.now()
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / duration)
    const settled = Math.floor(progress * text.length)
    el.textContent = [...text]
      .map((char, i) => (i < settled || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
      .join('')
    if (progress < 1) running.set(el, requestAnimationFrame(step))
    else running.delete(el)
  }
  running.set(el, requestAnimationFrame(step))
}

/**
 * [data-scramble] labels scramble when the pointer enters their link. The
 * link gets an aria-label holding the real text, so its accessible name never
 * passes through the random glyphs.
 */
export function initScramble() {
  const cleanups = [...document.querySelectorAll<HTMLElement>('[data-scramble]')].map((el) => {
    const text = el.textContent ?? ''
    const host = el.closest<HTMLElement>('a, button') ?? el
    const labelled = host.hasAttribute('aria-label')
    if (!labelled) host.setAttribute('aria-label', host.textContent?.trim() ?? text)
    const run = (event: PointerEvent) => event.pointerType === 'mouse' && scramble(el, text)
    host.addEventListener('pointerenter', run)
    return () => {
      host.removeEventListener('pointerenter', run)
      cancelAnimationFrame(running.get(el) ?? 0)
      el.textContent = text
      if (!labelled) host.removeAttribute('aria-label')
    }
  })
  return () => cleanups.forEach((cleanup) => cleanup())
}
