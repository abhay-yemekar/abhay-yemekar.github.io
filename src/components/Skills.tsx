import { capabilities } from '../data/skills'
import { sections } from '../data/sections'
import { SectionShell } from './SectionShell'

/** Capabilities, each with the project that proves it. No skill bars, no chip wall. */
export function Skills() {
  return (
    <SectionShell section={sections.skills}>
      <dl className="m-0">
        {capabilities.map((capability) => (
          <div
            key={capability.label}
            className="grid gap-x-12 gap-y-1 border-t border-border py-6 first:border-t-0 first:pt-0 lg:grid-cols-[5fr_7fr]"
          >
            <dt className="text-h3">{capability.label}</dt>
            <dd className="m-0">
              <p className="m-0">{capability.does}</p>
              <p className="u-meta mt-2 mb-0 text-fg-subtle">{capability.tools.join(' · ')}</p>
              <p className="u-meta m-0 flex flex-wrap items-center gap-x-4 text-fg-subtle">
                <span>Proof:</span>
                {capability.proof.map((proof) => {
                  const external = proof.href.startsWith('http')
                  return (
                    <a
                      key={proof.href}
                      href={proof.href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="u-tap"
                    >
                      <span className="u-link text-fg">{proof.label}</span>
                    </a>
                  )
                })}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  )
}
