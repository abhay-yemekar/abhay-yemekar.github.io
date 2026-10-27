import { profile } from '../data/profile'
import { sections } from '../data/sections'
import { ArrowUp, ExternalArrow, ForwardArrow } from './Icons'
import { ThemeToggle } from './ThemeToggle'

/**
 * Set when the page is prerendered, so every visitor sees the same HTML.
 * The next build after New Year picks up the new year.
 */
const BUILD_YEAR = new Date().getFullYear()

const channels = [
  { label: 'GitHub', href: profile.links.github },
  { label: 'LinkedIn', href: profile.links.linkedin },
]

/**
 * The contact block and the small print in one compact footer, on every page
 * (v4). It's the page's #contact: the offer, the email address as a button,
 * and the profile links.
 */
export function Footer({ page }: { page: 'home' | 'case' }) {
  return (
    <footer id={sections.contact.id} aria-labelledby="contact-heading" className="border-t border-border">
      <div className="u-container pt-14 pb-8 lg:pt-16">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="contact-heading" className="m-0 max-w-[24ch] text-h2">
              Open to AI engineering roles and <span className="u-accent">interesting problems.</span>
            </h2>
            <p className="m-0 mt-3 max-w-[48ch] text-fg-muted">
              The fastest way to reach me is email. I read everything and reply to anything specific.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:col-span-5 lg:items-end">
            {/* mailto opens in place, so no target="_blank" (CLAUDE.md). */}
            <a href={profile.links.email} className="u-btn">
              {profile.email}
              <ForwardArrow />
            </a>
            <ul className="m-0 flex list-none flex-wrap items-center gap-x-6 p-0">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a href={channel.href} target="_blank" rel="noopener noreferrer" className="u-meta u-tap gap-1 font-medium text-fg no-underline">
                    <span className="u-link">{channel.label}</span>
                    <ExternalArrow />
                  </a>
                </li>
              ))}
              {profile.resumeUrl && (
                <li>
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="u-meta u-tap gap-1 font-medium text-fg no-underline">
                    <span className="u-link">Resume (PDF)</span>
                    <ExternalArrow />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="u-meta mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border pt-4 text-fg-subtle">
          <p className="m-0">
            © {BUILD_YEAR} {profile.name}. Designed and built by {profile.shortName}. No tracking.
          </p>
          <div className="flex items-center gap-2">
            <a href={page === 'home' ? '#top' : '/'} className="u-tap gap-1.5 text-fg-muted no-underline hover:text-fg">
              <span className="u-link">{page === 'home' ? 'Back to top' : 'Home'}</span>
              {page === 'home' ? <ArrowUp /> : <ForwardArrow />}
            </a>
            {/* Phones only: the header has no room for the theme toggle below 640px. */}
            <span className="sm:hidden">
              <ThemeToggle />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
