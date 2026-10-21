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

  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      const next: Theme = effectiveTheme() === 'dark' ? 'light' : 'dark'
      const root = document.documentElement
      /*
       * Switch with transitions suspended. Otherwise every link and button with
       * a colour transition starts its own animation at once. Measured at 4×
       * CPU throttle, that took the switch from about 60–130 ms to 260–740 ms.
       * Reading offsetWidth restyles the whole document while transitions are
       * suspended (getComputedStyle on the root would restyle the root only).
       * Transitions return only after the next frame has painted, so lifting
       * the suspension (another full restyle) never delays the switch itself.
       */
      root.setAttribute('data-theme-switching', '')
      root.dataset.theme = next
      void document.body.offsetWidth
      requestAnimationFrame(() => setTimeout(() => root.removeAttribute('data-theme-switching')))
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Private mode or blocked storage: the choice lasts for this page view.
      }
      sync()
    }),
  )

  sync()
}
