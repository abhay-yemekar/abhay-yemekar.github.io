import { navItems } from '../data/sections'
import { profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { ThemeToggle } from './ThemeToggle'

const NAV_IDS = navItems.map((item) => item.id)

export function Nav() {
  const active = useActiveSection(NAV_IDS)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav aria-label="Primary" className="u-container">
        <div className="flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            className="u-label text-fg transition-colors duration-200 hover:text-accent"
          >
            {profile.name}
          </a>

          <div className="flex items-center gap-1 sm:gap-2">
            <ul className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`u-label rounded px-3 py-2 transition-colors duration-200 hover:text-fg ${
                        isActive ? 'text-accent' : 'text-fg-subtle'
                      }`}
                    >
                      {item.nav}
                    </a>
                  </li>
                )
              })}
            </ul>

            {/* Mobile keeps a single anchor rather than a hamburger. */}
            <a
              href="#work"
              className="u-label rounded px-3 py-2 text-fg-subtle transition-colors duration-200 hover:text-fg sm:hidden"
            >
              Work
            </a>

            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
