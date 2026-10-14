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
      document.documentElement.dataset.theme = next
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
