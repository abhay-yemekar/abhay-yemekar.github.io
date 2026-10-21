type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

/** Dark is the designed default (v3); light applies only once chosen. */
function effectiveTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/**
 * A toggle button ("Dark theme", aria-pressed). Only a click writes to
 * localStorage, so a visitor who never touches it keeps getting the default.
 */
export function initThemeToggle() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')
  if (buttons.length === 0) return

  const sync = () => {
    const pressed = String(effectiveTheme() === 'dark')
    buttons.forEach((button) => button.setAttribute('aria-pressed', pressed))
  }

  /*
   * Switch with transitions suspended. Otherwise every link and button with a
   * colour transition starts its own animation at once. Measured at 4× CPU
   * throttle, that took the switch from about 60–130 ms to 260–740 ms. Reading
   * offsetWidth restyles the whole document while transitions are suspended
   * (getComputedStyle on the root would restyle the root only). Transitions
   * return only after the next frame has painted, so lifting the suspension
   * (another full restyle) never delays the switch itself.
   */
  const apply = (next: Theme) => {
    const root = document.documentElement
    root.setAttribute('data-theme-switching', '')
    root.dataset.theme = next
    void document.body.offsetWidth
    requestAnimationFrame(() => setTimeout(() => root.removeAttribute('data-theme-switching')))
  }

  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      // From the button, which updates at once: the page's theme lags a frame
      // behind, so a quick double-click must not read the stale one.
      const next: Theme = button.getAttribute('aria-pressed') === 'false' ? 'dark' : 'light'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Private mode or blocked storage: the choice lasts for this page view.
      }
      /*
       * The button answers first, then the page switches. The restyle of
       * every element is the whole cost of a theme change (about 80–220 ms at
       * 4× CPU throttle in v3, layout about 0). Doing it inside the click put
       * the toggle past the 200 ms INP line. Yielding a frame keeps the
       * interaction itself fast; the new theme lands one frame later.
       */
      const pressed = String(next === 'dark')
      buttons.forEach((b) => b.setAttribute('aria-pressed', pressed))
      requestAnimationFrame(() => setTimeout(() => apply(next)))
    }),
  )

  sync()
}
