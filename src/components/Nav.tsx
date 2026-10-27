import { navItems } from '../data/sections'
import { profile } from '../data/profile'
import { ProfileLinks } from './ProfileLinks'
import { ThemeToggle } from './ThemeToggle'

type NavProps = {
  /**
   * home: links scroll within the page and track the section in view.
   * case: links go back to the home page, with Projects marked current.
   * other: links go back to the home page, nothing marked (the 404 page).
   */
  page: 'home' | 'case' | 'other'
}

/**
 * The sticky header. It stays in place while you scroll (v4), so the section
 * links and the profile links are always to hand.
 */
export function Nav({ page }: NavProps) {
  const onHome = page === 'home'

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md" data-nav>
      <nav aria-label="Primary" className="u-container">
        <div className="flex h-16 items-center justify-between gap-4">
          <a href={onHome ? '#top' : '/'} className="text-[1.0625rem] font-semibold whitespace-nowrap text-fg no-underline">
            {profile.name}
          </a>

          <div className="flex items-center">
            {/* Below 640px only the profile links fit beside the name; the theme toggle moves to the footer there. */}
            <ul className="m-0 hidden list-none items-center p-0 sm:flex">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={onHome ? `#${item.id}` : `/#${item.id}`}
                    {...(onHome ? { 'data-spy': '' } : {})}
                    {...(page === 'case' && item.id === 'work' ? { 'aria-current': 'true' as const } : {})}
                    className="u-tap px-2.5 text-small text-fg-muted no-underline transition-colors duration-(--duration-fast) hover:text-fg lg:px-3 [&[aria-current]]:text-fg [&[aria-current]]:underline [&[aria-current]]:decoration-mark [&[aria-current]]:decoration-2 [&[aria-current]]:underline-offset-[0.5em]"
                  >
                    {item.nav}
                  </a>
                </li>
              ))}
            </ul>
            <span className="mx-2 hidden h-5 w-px bg-border-strong sm:block lg:mx-3" aria-hidden="true" />
            <ProfileLinks />
            <span className="hidden sm:contents">
              <ThemeToggle />
            </span>
          </div>
        </div>
      </nav>
      {/* Reading progress: a CSS scroll-driven hairline, where supported. */}
      <div className="scroll-progress absolute inset-x-0 -bottom-px h-px bg-mark" aria-hidden="true" />
    </header>
  )
}
