import { capabilities } from '../data/skills'
import { sections } from '../data/sections'
import { ExternalArrow } from './Icons'
import { SectionShell } from './SectionShell'

/**
 * Skills as cards, about one screen in all: what each covers, the tools, and
 * "Used in" with the projects that show it, so the evidence sits right next
 * to the claim. No skill bars and no chip wall.
 */
export function Skills() {
  return (
    <SectionShell section={sections.skills}>
      <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability) => (
          <li key={capability.label} className="flex flex-col rounded-card border border-border bg-bg-elev p-6" data-reveal>
            <h3 className="m-0 text-name">{capability.label}</h3>
            <p className="m-0 mt-2 text-small text-fg-muted">{capability.does}</p>

            <ul aria-label="Tools" className="m-0 mt-4 mb-5 flex list-none flex-wrap gap-1.5 p-0">
              {capability.tools.map((tool) => (
                <li key={tool} className="u-meta rounded-sm border border-border bg-bg px-2 py-0.5 text-fg-muted">
                  {tool}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-x-4 border-t border-border pt-3">
              <span className="u-meta text-fg-subtle">Used in</span>
              {capability.proof.map((proof) => {
                const external = proof.href.startsWith('http')
                return (
                  <a
                    key={proof.href}
                    href={proof.href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="u-meta u-tap gap-1 font-medium text-fg no-underline"
                  >
                    <span className="u-link">{proof.label}</span>
                    {external && <ExternalArrow />}
                  </a>
                )
              })}
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
