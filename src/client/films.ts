/**
 * The case-page films ([data-film]), each with its own Pause / Play button
 * (WCAG 2.2.2). A playing film runs only while it's on screen: the animated
 * WebP fades in over the still the HTML carries, and is removed when it
 * scrolls away, so it stops decoding and restarts from the top next time.
 *
 * Films start playing when motion is on and data saver is off. Under
 * prefers-reduced-motion (or with data saver on) they start paused, and the
 * button offers "Play film": the visitor can opt in, one film at a time.
 *
 * The still keeps the alt text. The moving copy is decorative (aria-hidden).
 */
export function initFilms(figures: HTMLElement[]) {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
  const autoplay = document.documentElement.dataset.motion === 'on' && !nav.connection?.saveData

  const show = (figure: HTMLElement) => {
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
  const hide = (figure: HTMLElement) => figure.querySelector('.film-motion')?.remove()

  const playing = new Map<HTMLElement, boolean>()
  const visible = new Set<HTMLElement>()
  const sync = (figure: HTMLElement) => {
    const on = playing.get(figure) ?? false
    if (on && visible.has(figure)) show(figure)
    else hide(figure)
    const button = figure.querySelector<HTMLButtonElement>('[data-film-toggle]')
    if (!button) return
    button.dataset.state = on ? 'playing' : 'paused'
    const label = button.querySelector('[data-film-label]')
    if (label) label.textContent = on ? 'Pause film' : 'Play film'
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const figure = entry.target as HTMLElement
        if (entry.isIntersecting) visible.add(figure)
        else visible.delete(figure)
        sync(figure)
      }
    },
    { threshold: 0.35 },
  )

  for (const figure of figures) {
    playing.set(figure, autoplay)
    figure.querySelector('[data-film-toggle]')?.addEventListener('click', () => {
      playing.set(figure, !playing.get(figure))
      sync(figure)
    })
    sync(figure)
    io.observe(figure)
  }
}
