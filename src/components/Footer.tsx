import { profile } from '../data/profile'

/** The visitor's clock, read once per page load. Fine for a copyright line. */
const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="u-container flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="u-micro text-fg-subtle">
          © {YEAR} {profile.name}
        </p>
        <p className="u-micro text-fg-subtle">
          Designed and built by {profile.shortName}.
        </p>
        <a
          href="#top"
          className="u-micro text-fg-subtle transition-colors duration-200 hover:text-accent"
        >
          Back to top
        </a>
      </div>
    </footer>
  )
}
