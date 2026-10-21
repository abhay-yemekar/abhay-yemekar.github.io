/*
 * Inline SVG icons. The latin font subset has no arrow glyphs (→ ↗), so arrows
 * are drawn rather than typed. All are decorative: the link text carries the
 * meaning.
 */

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/** Points up-right: the link leaves this site. */
export function ExternalArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" className="shrink-0" {...common}>
      <path d="M2.5 9.5 9.5 2.5M4.2 2.5h5.3v5.3" />
    </svg>
  )
}

/** Points right: the link goes somewhere on this site. */
export function ForwardArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0" {...common}>
      <path d="M2 6h8M6.8 2.8 10 6l-3.2 3.2" />
    </svg>
  )
}

/** Points up: back to the top of this page. */
export function ArrowUp() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0" {...common}>
      <path d="M6 10V2M2.8 5.2 6 2l3.2 3.2" />
    </svg>
  )
}

export function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="theme-moon" {...common} strokeWidth={1.7}>
      <path d="M20.5 14.4A8.6 8.6 0 1 1 9.6 3.5a6.9 6.9 0 0 0 10.9 10.9Z" />
    </svg>
  )
}

/** Pause bars, swapped for a play triangle while motion is paused. */
export function PauseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className="inline-block align-[-0.05em]" aria-hidden="true">
      <path className="icon-pause" d="M2 1.5h2v7H2zM6 1.5h2v7H6z" fill="currentColor" />
      <path className="icon-play" d="M2.5 1.2 8.6 5 2.5 8.8Z" fill="currentColor" />
    </svg>
  )
}
