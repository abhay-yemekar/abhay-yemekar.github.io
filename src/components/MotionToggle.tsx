import { PauseIcon } from './Icons'

/**
 * Pauses the moving parts: the particle field, smooth scroll, scroll reveals,
 * the cursor follower and the clock (WCAG 2.2.2). The choice is stored.
 *
 * The label names the action, "Pause motion" or "Play motion", and
 * src/client/motion-toggle.ts swaps it, so the visible text and the accessible
 * name always match. Under prefers-reduced-motion the page starts paused and
 * the button offers "Play motion", an explicit opt-in. Hidden without JS.
 */
export function MotionToggle({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      data-motion-toggle
      className={`u-tap whitespace-nowrap text-fg-muted transition-colors duration-(--duration-fast) hover:text-fg ${className}`}
    >
      <span className="u-label">
        <PauseIcon /> <span data-motion-label>Pause motion</span>
      </span>
    </button>
  )
}
