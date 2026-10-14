/**
 * Marks the nav link for the section currently in view (aria-current).
 *
 * Links opt in with data-spy and an in-page href. The rootMargin is
 * top-biased: a section becomes current once it reaches the upper part of the
 * viewport, not merely when it appears.
 */
export function initActiveSection() {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('a[data-spy]')]
  const sections = links
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter((el): el is HTMLElement => el !== null)
  if (sections.length === 0) return

  /*
   * State is kept across callbacks rather than read off each batch, because
   * IntersectionObserver reports only what *changed*. Choosing from a single
   * batch means a batch holding just one "left the band" entry has nothing to
   * choose from, and the highlight lands on the wrong section.
   */
  const inBand = new Map<string, boolean>()

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) inBand.set(entry.target.id, entry.isIntersecting)

      // Document order is enough to find the topmost: sections never overlap.
      const current = sections.find((el) => inBand.get(el.id))
      // Sections without a nav entry aren't observed, so the previous link
      // stays lit between them rather than clearing.
      if (!current) return

      for (const link of links) {
        if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'true')
        else link.removeAttribute('aria-current')
      }
    },
    { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
  )

  sections.forEach((section) => observer.observe(section))
}
