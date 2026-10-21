const STORAGE_KEY = 'motion'

/**
 * The "Pause motion" / "Play motion" button (WCAG 2.2.2). It flips
 * <html data-motion> between "on" and "paused", stores the choice, and calls
 * onChange so main.ts can start or stop the motion layer.
 *
 * Under prefers-reduced-motion the page starts "paused", and the button offers
 * "Play motion". A stored choice, either way, beats the OS default.
 */
export function initMotionToggle(onChange: () => void) {
  const root = document.documentElement
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]')]
  if (buttons.length === 0 || !root.dataset.motion) return

  const sync = () => {
    const paused = root.dataset.motion === 'paused'
    for (const button of buttons) {
      button.dataset.state = paused ? 'paused' : 'on'
      const label = button.querySelector('[data-motion-label]')
      if (label) label.textContent = paused ? 'Play motion' : 'Pause motion'
    }
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      root.dataset.motion = root.dataset.motion === 'paused' ? 'on' : 'paused'
      root.classList.remove('intro')
      try {
        localStorage.setItem(STORAGE_KEY, root.dataset.motion)
      } catch {
        // Private mode or blocked storage: the choice lasts for this page view.
      }
      sync()
      onChange()
    })
  }

  sync()
}
