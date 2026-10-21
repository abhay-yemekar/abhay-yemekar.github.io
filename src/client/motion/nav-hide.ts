/**
 * The sticky nav slides away while you scroll down and returns the moment you
 * scroll up, so long reads get the whole screen. It never hides near the top,
 * or while keyboard focus is inside it (a Tab into the nav brings it back).
 */
export function initNavHide() {
  const header = document.querySelector<HTMLElement>('[data-nav]')
  if (!header) return () => {}

  let lastY = window.scrollY
  const set = (hidden: boolean) => {
    if (hidden) header.dataset.hidden = ''
    else delete header.dataset.hidden
  }

  const onScroll = () => {
    const y = window.scrollY
    const dy = y - lastY
    if (Math.abs(dy) < 8) return
    lastY = y
    set(dy > 0 && y > 320 && !header.matches(':focus-within'))
  }
  const onFocus = () => set(false)

  window.addEventListener('scroll', onScroll, { passive: true })
  header.addEventListener('focusin', onFocus)
  return () => {
    window.removeEventListener('scroll', onScroll)
    header.removeEventListener('focusin', onFocus)
    set(false)
  }
}
