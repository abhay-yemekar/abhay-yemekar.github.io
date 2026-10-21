/**
 * Plays each case-page film ([data-film]) while it's on screen. The animated
 * WebP fades in over the still that the HTML carries, and is removed again
 * when it scrolls away, so it stops decoding and restarts from the top next
 * time. Skipped with data saver on.
 *
 * The still keeps the alt text. The moving copy is decorative (aria-hidden),
 * and "Pause motion" removes it with the rest of the layer (WCAG 2.2.2).
 */
export function initFilms() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
  const figures = [...document.querySelectorAll<HTMLElement>('[data-film]')]
  if (figures.length === 0 || nav.connection?.saveData) return () => {}

  const stop = (figure: HTMLElement) => figure.querySelector('.film-motion')?.remove()
  const play = (figure: HTMLElement) => {
    const frame = figure.querySelector<HTMLElement>('.film-frame')
    const src = figure.dataset.film
    if (!frame || !src || frame.querySelector('.film-motion')) return
    const img = new Image()
    img.className = 'film-motion'
    img.alt = ''
    img.setAttribute('aria-hidden', 'true')
    img.decoding = 'async'
    img.addEventListener('load', () => img.classList.add('is-ready'), { once: true })
    img.src = src
    frame.append(img)
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const figure = entry.target as HTMLElement
        if (entry.isIntersecting) play(figure)
        else stop(figure)
      }
    },
    { threshold: 0.35 },
  )
  figures.forEach((figure) => io.observe(figure))

  return () => {
    io.disconnect()
    figures.forEach(stop)
  }
}
