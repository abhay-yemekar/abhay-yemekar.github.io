import { profile } from '../data/profile'
import { ArrowUp, ForwardArrow } from './Icons'

/**
 * Set when the page is prerendered, so every visitor sees the same HTML.
 * The next build after New Year picks up the new year.
 */
const BUILD_YEAR = new Date().getFullYear()

/** Bookends the page: the name again, at display size, over the small print. */
export function Footer({ page }: { page: 'home' | 'case' }) {
  return (
    <footer className="border-t border-border">
      <div className="u-container pt-14 pb-10 lg:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-8">
          {/* Decorative: the name is the nav's first link and the copyright line below. */}
          <p className="u-display m-0 text-[clamp(2.75rem,9vw,8.5rem)] leading-[0.85] tracking-[-0.03em] uppercase [font-stretch:75%]" aria-hidden="true" data-chars>
            {profile.name}
          </p>
          <a href={page === 'home' ? '#top' : '/'} className="group u-meta u-tap gap-3 text-fg-muted no-underline hover:text-fg">
            <span className="u-link">{page === 'home' ? 'Back to top' : 'Home'}</span>
            <span className="u-arrow-ring">{page === 'home' ? <ArrowUp /> : <ForwardArrow />}</span>
          </a>
        </div>
        <div className="u-meta mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-border pt-6 text-fg-subtle">
          <p className="m-0">
            © {BUILD_YEAR} {profile.name}
          </p>
          <p className="m-0">Designed and built by {profile.shortName}. No tracking.</p>
        </div>
      </div>
    </footer>
  )
}
