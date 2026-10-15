type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

/** An explicit choice wins; otherwise the OS preference, as CSS sees it. */
function effectiveTheme(): Theme {
  const chosen = document.documentElement.dataset.theme
  if (chosen === 'light' || chosen === 'dark') return chosen
  return darkQuery.matches ? 'dark' : 'light'
}

/**
 * A toggle button ("Dark theme", aria-pressed). Only a click writes to
 * localStorage. Until then the OS preference keeps deciding, including when it
 * changes mid-visit. The previous version persisted on first load, which pinned
 * a first-time visitor to whatever their OS said that day.
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

  darkQuery.addEventListener('change', sync)
  sync()
}
