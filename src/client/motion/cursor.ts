import { gsap } from 'gsap'

const INTERACTIVE = '[data-cursor], a[href], button, summary, [role="tab"]'

/**
 * A trailing ring for mouse users. The system cursor stays, so pointer size
 * and contrast settings still apply; this only adds feedback. The ring grows
 * over anything interactive and shows a label over [data-cursor] targets
 * ("View" on the project names). It's decorative: aria-hidden, no pointer
 * events.
 */
export function initCursor() {
  // GSAP moves the outer element; CSS sizes and colours the inner ring. GSAP
  // folds the CSS scale/translate properties into its own transform, so the
  // two never share an element.
  const ring = document.createElement('div')
  ring.className = 'cursor'
  ring.setAttribute('aria-hidden', 'true')
  const inner = document.createElement('div')
  inner.className = 'cursor__ring'
  const label = document.createElement('span')
  label.className = 'cursor__label'
  inner.append(label)
  ring.append(inner)
  document.body.append(ring)

  const x = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
  const y = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })
  let shown = false

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    if (!shown) {
      gsap.set(ring, { x: event.clientX, y: event.clientY })
      ring.dataset.visible = ''
      shown = true
    }
    x(event.clientX)
    y(event.clientY)
  }
  const onOver = (event: PointerEvent) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>(INTERACTIVE)
    const text = target?.dataset.cursor ?? ''
    ring.dataset.state = text ? 'label' : target ? 'link' : ''
    label.textContent = text
  }
  const onLeave = () => {
    delete ring.dataset.visible
    shown = false
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerover', onOver, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)

  return () => {
    window.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerover', onOver)
    document.documentElement.removeEventListener('pointerleave', onLeave)
    ring.remove()
  }
}
