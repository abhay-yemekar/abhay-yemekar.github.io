import { navItems } from '../data/sections'
import { profile } from '../data/profile'
import { ThemeToggle } from './ThemeToggle'

type NavProps = {
  /** Home links scroll within the page and track the section in view. */
  page: 'home' | 'case'
}

export function Nav({ page }: NavProps) {
  const onHome = page === 'home'

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
      <nav aria-label="Primary" className="u-container">
        <div className="flex h-16 items-center justify-between gap-4">
          <a
            href={onHome ? '#top' : '/'}
            className="whitespace-nowrap text-[1.0625rem] font-semibold text-fg no-underline"
          >
            {profile.name}
          </a>

          <div className="flex items-center gap-1">
            <ul className="u-meta flex items-center">
              {navItems.map((item) => (
                // Below 640px only Work and Contact fit beside the name and the
                // 44px theme toggle; About is one scroll away.
                <li key={item.id} className={item.id === 'about' ? 'hidden sm:block' : undefined}>
                  <a
                    href={onHome ? `#${item.id}` : `/#${item.id}`}
                    {...(onHome ? { 'data-spy': '' } : {})}
                    {...(!onHome && item.id === 'work' ? { 'aria-current': 'true' as const } : {})}
                    className="u-tap px-2 text-fg-muted no-underline transition-colors duration-(--duration-fast) hover:text-fg sm:px-3 [&[aria-current]]:text-fg [&[aria-current]]:underline [&[aria-current]]:decoration-mark [&[aria-current]]:decoration-2 [&[aria-current]]:underline-offset-[0.4em]"
                  >
                    {item.nav}
                  </a>
                </li>
              ))}
            </ul>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
