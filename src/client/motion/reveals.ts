import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

/** Already on screen when the layer starts: leave it be rather than hide it. */
const inView = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.92

/**
 * Scroll reveals:
 * - [data-split] headings: lines rise out of masks (SplitText, aria: 'auto'
 *   keeps the heading's accessible name whole)
 * - [data-reveal] blocks: a short rise and fade
 *
 * Each plays once. Everything runs inside a gsap.context, so stopping the
 * layer reverts every split and inline style and kills its ScrollTriggers.
 */
export async function initReveals() {
  // Lines are measured from rendered text, so the real fonts must be in.
  await document.fonts.ready

  const ctx = gsap.context(() => {
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
  })

  return () => ctx.revert()
}
