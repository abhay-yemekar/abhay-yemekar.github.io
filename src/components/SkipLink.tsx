/** First focusable element on every page. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="u-meta sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-sm focus:border focus:border-accent focus:bg-bg-elev focus:px-4 focus:py-3 focus:text-fg"
    >
      Skip to content
    </a>
  )
}
