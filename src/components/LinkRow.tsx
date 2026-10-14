import type { ProjectLink } from '../data/projects'
import { ExternalArrow } from './Icons'

/** Outbound project links, each a 44px tap target with the amber underline. */
export function LinkRow({ links }: { links: ProjectLink[] }) {
  return (
    <ul className="u-meta m-0 flex list-none flex-wrap gap-x-6 p-0">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="u-tap gap-1.5 text-fg no-underline">
            <span className="u-link">{link.label}</span>
            <ExternalArrow />
            {link.note && <span className="text-fg-subtle">({link.note})</span>}
          </a>
        </li>
      ))}
    </ul>
  )
}
