/** Already on screen when the layer starts: leave it be rather than hide it. */
const inView = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.92

/**
 * One-shot scroll reveals: CSS transitions (motion.css) switched on by an
 * IntersectionObserver, with no animation library (v4). Each piece plays once
 * and ends fully visible.
 * - [data-reveal] blocks and [data-split] headings: a short rise and fade
 * - [data-wipe]: a media frame's clip opens upward
 * - svg[data-diagram]: nodes pop in, then edges draw in order, each arrowhead
 *   arriving with its line
 *
 * Only what is below the fold gets hidden, and only by this code, which is
 * also what reveals it. The teardown puts everything back.
 */
export function initReveals() {
  const restore: (() => void)[] = []
  const pending = [...document.querySelectorAll<Element>('[data-reveal], [data-split], [data-wipe], svg[data-diagram]')].filter(
    // A zero-width element is hidden at this size (the diagram below 1280px).
    (el) => el.getBoundingClientRect().width > 0 && !inView(el),
  )

  // Hide with transitions off, or each element would animate out first (and a
  // diagram's edges would fire transitionend before they ever drew).
  const root = document.documentElement
  root.setAttribute('data-reveals-setup', '')
  for (const svg of pending) if (svg instanceof SVGSVGElement) prepareDiagram(svg, restore)
  for (const el of pending) el.classList.add('is-pending')
  void document.body.offsetWidth
  root.removeAttribute('data-reveals-setup')
  for (const svg of pending) if (svg instanceof SVGSVGElement) holdArrowheads(svg, restore)

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.remove('is-pending')
        io.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  )
  pending.forEach((el) => io.observe(el))

  return () => {
    io.disconnect()
    pending.forEach((el) => el.classList.remove('is-pending'))
    restore.forEach((fn) => fn())
  }
}

/** Numbers the diagram's nodes, edges and labels for their staggered delays (--i). */
function prepareDiagram(svg: SVGSVGElement, restore: (() => void)[]) {
  svg.setAttribute('data-draw', '')
  const stagger = (selector: string) =>
    svg.querySelectorAll<SVGElement>(selector).forEach((el, i) => el.style.setProperty('--i', String(i)))
  stagger('[data-node]')
  stagger('[data-edge]')
  stagger('[data-edge-label]')
  restore.push(() => svg.removeAttribute('data-draw'))
}

/**
 * Takes each arrowhead off until its line has drawn: an arrowhead would
 * otherwise sit at the end of a line not yet there.
 */
function holdArrowheads(svg: SVGSVGElement, restore: (() => void)[]) {
  for (const edge of svg.querySelectorAll<SVGPathElement>('[data-edge]')) {
    const marker = edge.getAttribute('marker-end')
    if (!marker) continue
    edge.removeAttribute('marker-end')
    const land = () => edge.setAttribute('marker-end', marker)
    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName !== 'stroke-dashoffset') return
      edge.removeEventListener('transitionend', onEnd)
      land()
    }
    edge.addEventListener('transitionend', onEnd)
    restore.push(() => {
      edge.removeEventListener('transitionend', onEnd)
      land()
    })
  }
}
