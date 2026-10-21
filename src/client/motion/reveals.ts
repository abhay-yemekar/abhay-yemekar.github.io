import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { scramble } from './scramble'

/** Already on screen when the layer starts: leave it be rather than hide it. */
const inView = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.92

/**
 * Scroll-driven choreography. Each piece plays once and ends fully visible.
 * - [data-split] headings: lines rise out of masks (SplitText, aria 'auto'
 *   keeps the heading's accessible name whole)
 * - [data-reveal] blocks: a short rise and fade
 * - [data-words]: the words of a statement (plain inline spans in the HTML)
 *   light up in reading order as it scrolls in
 * - [data-chars]: a decorative line's letters rise one by one (aria-hidden
 *   elements only)
 * - [data-scramble-in]: a mono label resolves out of random glyphs
 * - svg[data-diagram]: nodes pop in, then edges draw in order, each arrowhead
 *   arriving with its line
 *
 * Everything runs inside a gsap.context, so stopping the layer reverts every
 * split, inline style and attribute it touched and kills its ScrollTriggers.
 */
export async function initReveals() {
  // Lines are measured from rendered text, so the real fonts must be in.
  await document.fonts.ready

  const ctx = gsap.context(() => {
    // Undo for what gsap can't revert on its own: attributes and text we set by hand.
    const restore: (() => void)[] = []

    for (const el of document.querySelectorAll<HTMLElement>('[data-split]')) {
      if (inView(el)) continue
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        aria: 'auto',
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.15,
            ease: 'entrance',
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }),
      })
    }

    for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
      if (inView(el)) continue
      gsap.from(el, {
        y: 48,
        opacity: 0,
        duration: 1.1,
        ease: 'entrance',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    }

    for (const el of document.querySelectorAll<HTMLElement>('[data-words]')) {
      // Plays once and stays lit. A scroll-scrubbed version left dim words
      // (1.5:1) wherever the reader stopped, which fails contrast.
      gsap.fromTo(
        el.querySelectorAll('[data-word]'),
        { opacity: 0.16 },
        { opacity: 1, duration: 0.7, ease: 'power1.out', stagger: 0.07, scrollTrigger: { trigger: el, start: 'top 78%', once: true } },
      )
    }

    for (const el of document.querySelectorAll<HTMLElement>('[data-chars]')) {
      if (inView(el)) continue
      SplitText.create(el, {
        type: 'chars',
        mask: 'chars',
        aria: 'none',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 105,
            duration: 0.9,
            ease: 'entrance',
            stagger: 0.028,
            scrollTrigger: { trigger: el, start: 'top 94%', once: true },
          }),
      })
    }

    for (const el of document.querySelectorAll<HTMLElement>('[data-scramble-in]')) {
      if (inView(el)) continue
      const text = el.textContent ?? ''
      restore.push(() => (el.textContent = text))
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => scramble(el, text, 650) })
    }

    for (const svg of document.querySelectorAll<SVGSVGElement>('svg[data-diagram]')) {
      // Hidden below 1280px (the stacked list shows instead), or already in view.
      if (svg.getBoundingClientRect().width === 0 || inView(svg)) continue
      const nodes = svg.querySelectorAll('[data-node]')
      const labels = svg.querySelectorAll('[data-edge-label]')
      const edges = [...svg.querySelectorAll<SVGPathElement>('[data-edge]')]
      const markers = edges.map((edge) => edge.getAttribute('marker-end') ?? '')
      // An arrowhead would sit at the end of a line not yet drawn: hand each one back as its line lands.
      edges.forEach((edge) => edge.removeAttribute('marker-end'))
      restore.push(() => edges.forEach((edge, i) => edge.setAttribute('marker-end', markers[i]!)))
      if (edges.length) gsap.set(edges, { strokeDasharray: 1, strokeDashoffset: 1 })

      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 72%', once: true } })
      if (nodes.length) tl.from(nodes, { opacity: 0, scale: 0.94, transformOrigin: '50% 50%', duration: 0.6, ease: 'entrance', stagger: 0.07 })
      if (edges.length)
        tl.to(
          edges,
          {
            strokeDashoffset: 0,
            duration: 0.45,
            ease: 'power2.inOut',
            stagger: {
              each: 0.08,
              onComplete(this: gsap.core.Tween) {
                const edge = this.targets()[0] as SVGPathElement
                edge.setAttribute('marker-end', markers[edges.indexOf(edge)]!)
              },
            },
          },
          0.3,
        )
      // Not every diagram labels its edges; GSAP warns about an empty target.
      if (labels.length) tl.from(labels, { opacity: 0, duration: 0.4, stagger: 0.05 }, '-=0.5')
    }

    // Runs on revert: arrowheads come back even if a diagram never played.
    return () => restore.forEach((fn) => fn())
  })

  return () => ctx.revert()
}
