import { navItems } from '../data/sections'
import { profile } from '../data/profile'
import { ThemeToggle } from './ThemeToggle'

type NavProps = {
  /**
   * home: links scroll within the page and track the section in view.
   * case: links go back to the home page, with Work marked current.
   * other: links go back to the home page, nothing marked (the 404 page).
   */
  page: 'home' | 'case' | 'other'
}

export function Nav({ page }: NavProps) {
  const onHome = page === 'home'

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/75 backdrop-blur-md" data-nav>
      <nav aria-label="Primary" className="u-container">
        <div className="flex h-16 items-center justify-between gap-4">
          <a
            href={onHome ? '#top' : '/'}
            className="font-display text-[1.0625rem] font-semibold whitespace-nowrap text-fg uppercase no-underline [font-stretch:80%] tracking-[0.02em]"
          >
            {profile.name}
          </a>

          <div className="flex items-center gap-1 lg:gap-6">
            {/* Local time for "where is he": static "IST" without JS, the live time with it. */}
            <p className="u-meta m-0 hidden text-fg-subtle lg:block">
              {profile.city} <span data-clock>IST</span>
            </p>
            <ul className="u-meta m-0 flex list-none items-center p-0 uppercase">
              {navItems.map((item) => (
                // Below 640px only Work and Contact fit beside the name and the
                // 44px theme toggle; About is one scroll away.
                <li key={item.id} className={item.id === 'about' ? 'hidden sm:block' : undefined}>
                  <a
                    href={onHome ? `#${item.id}` : `/#${item.id}`}
                    {...(onHome ? { 'data-spy': '' } : {})}
                    {...(page === 'case' && item.id === 'work' ? { 'aria-current': 'true' as const } : {})}
                    className="u-tap px-2 tracking-[0.08em] text-fg-muted no-underline transition-colors duration-(--duration-fast) hover:text-fg sm:px-3 [&[aria-current]]:text-fg [&[aria-current]]:underline [&[aria-current]]:decoration-mark [&[aria-current]]:decoration-2 [&[aria-current]]:underline-offset-[0.5em]"
                  >
                    <span data-scramble>{item.nav}</span>
                  </a>
                </li>
              ))}
            </ul>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      {/* Reading progress: a CSS scroll-driven hairline, where supported. */}
      <div className="scroll-progress absolute inset-x-0 -bottom-px h-px bg-mark" aria-hidden="true" />
    </header>
  )
}
