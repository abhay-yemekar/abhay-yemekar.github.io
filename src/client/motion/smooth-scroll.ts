import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

/** Clears the 64px sticky nav, matching scroll-padding-top in globals.css. */
const NAV_OFFSET = -88

/**
 * Lenis smooth scrolling, for mouse and trackpad only (touch keeps native
 * scrolling). Lenis runs on GSAP's ticker so ScrollTrigger reads the same
 * scroll position in the same frame.
 *
 * In-page links are handled here. Lenis would otherwise fight the browser's
 * own jump, and the jump is also what moves keyboard focus, so focus is moved
 * to the target by hand once the scroll lands.
 */
export function initSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.11, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]')
    if (!link || link.origin !== location.origin || link.pathname !== location.pathname || !link.hash) return
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)))
    if (!target) return

    event.preventDefault()
    history.pushState(null, '', link.hash)
    lenis.scrollTo(target, {
      offset: NAV_OFFSET,
      duration: 1.2,
      onComplete: () => {
        if (!target.matches('a[href], button, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      },
    })
  }
  document.addEventListener('click', onClick)

  return () => {
    document.removeEventListener('click', onClick)
    gsap.ticker.remove(tick)
    lenis.destroy()
  }
}
