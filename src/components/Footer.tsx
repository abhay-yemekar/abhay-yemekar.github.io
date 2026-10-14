import { profile } from '../data/profile'

/**
 * Set when the page is prerendered, so every visitor sees the same HTML.
 * The next build after New Year picks up the new year.
 */
const BUILD_YEAR = new Date().getFullYear()

export function Footer({ page }: { page: 'home' | 'case' }) {
  return (
    <footer className="border-t border-border py-10">
      <div className="u-container u-meta flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-fg-subtle">
        <p>
          © {BUILD_YEAR} {profile.name}
        </p>
        <p>Designed and built by {profile.shortName}. No tracking.</p>
        <a href={page === 'home' ? '#top' : '/'} className="u-tap u-link text-fg-muted">
          {page === 'home' ? 'Back to top' : 'Home'}
        </a>
      </div>
    </footer>
  )
}
