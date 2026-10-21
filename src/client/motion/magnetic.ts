import { gsap } from 'gsap'

/** [data-magnetic] elements lean toward the pointer and spring back on leave. */
export function initMagnetic() {
  const cleanups = [...document.querySelectorAll<HTMLElement>('[data-magnetic]')].map((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' })
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      // Measured without the current pull, so the pull doesn't feed back on itself.
      const rect = el.getBoundingClientRect()
      const cx = rect.left - (gsap.getProperty(el, 'x') as number) + rect.width / 2
      const cy = rect.top - (gsap.getProperty(el, 'y') as number) + rect.height / 2
      x((event.clientX - cx) * 0.28)
      y((event.clientY - cy) * 0.4)
    }
    const onLeave = () => {
      x(0)
      y(0)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.set(el, { clearProps: 'transform' })
    }
  })

  return () => cleanups.forEach((cleanup) => cleanup())
}
