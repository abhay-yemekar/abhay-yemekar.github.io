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

/*
 * Profile icons, drawn in the same outline style as the arrows (GitHub after
 * Tabler's brand-github, MIT). Decorative: each link carries its own name.
 */
export function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0" {...common} strokeWidth={1.7}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  )
}

export function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0" {...common} strokeWidth={1.7}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0" />
    </svg>
  )
}

export function ResumeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0" {...common} strokeWidth={1.7}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
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
