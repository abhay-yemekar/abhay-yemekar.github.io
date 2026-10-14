import { MoonIcon } from './Icons'

/**
 * A toggle button: the label stays "Dark theme" and aria-pressed carries the
 * state. src/client/theme.ts sets aria-pressed on load and wires the click.
 * Without JS it stays hidden (see globals.css), because it couldn't do
 * anything.
 */
export function ThemeToggle() {
  return (
    <button
      type="button"
      data-theme-toggle
      aria-label="Dark theme"
      title="Toggle dark theme"
      className="group grid h-11 w-11 place-items-center rounded-full text-fg-muted transition-colors duration-(--duration-fast) hover:text-fg [&[aria-pressed=true]_.theme-moon]:fill-current"
    >
      <MoonIcon />
    </button>
  )
}
