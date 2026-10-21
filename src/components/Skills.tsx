import { capabilities } from '../data/skills'
import { sections } from '../data/sections'
import { SectionShell } from './SectionShell'

/** Capabilities, each with the project that proves it. No skill bars, no chip wall. */
export function Skills() {
  return (
    <SectionShell section={sections.skills}>
      <dl className="m-0 border-t border-border">
        {capabilities.map((capability, i) => (
          <div
            key={capability.label}
            className="grid gap-x-8 gap-y-4 border-b border-border py-10 lg:grid-cols-12 lg:py-12"
            data-reveal
          >
            <dt className="flex items-baseline gap-4 lg:col-span-5">
              <span className="u-meta text-fg-subtle" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="u-display text-name">{capability.label}</span>
            </dt>
            <dd className="m-0 lg:col-span-6 lg:col-start-7">
              <p className="m-0 text-lede">{capability.does}</p>
              <p className="u-meta mt-4 mb-0 text-fg-subtle">{capability.tools.join(' · ')}</p>
              <p className="u-meta m-0 mt-1 flex flex-wrap items-center gap-x-4 text-fg-subtle">
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
