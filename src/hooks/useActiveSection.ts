import { useEffect, useState } from 'react'

/**
 * Tracks which section is currently in view, for the nav's aria-current.
 *
 * The rootMargin is deliberately top-biased: a section becomes active once it
 * reaches the upper third of the viewport, not merely when it appears.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    /*
     * State is kept across callbacks rather than read off each batch, because
     * IntersectionObserver reports only what *changed*. Picking the winner from
     * a single batch means a batch containing just one "left the band" entry
     * has nothing to choose from, and the highlight lands on the wrong section.
     */
    const inBand = new Map<string, boolean>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) inBand.set(entry.target.id, entry.isIntersecting)

        // Document order is enough to find the topmost — sections never overlap.
        const next = elements.find((el) => inBand.get(el.id))

        // Sections between two nav entries (Experience, More, Credentials) are
        // not observed, so leave the previous item lit rather than clearing it.
        if (next) setActive(next.id)
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
