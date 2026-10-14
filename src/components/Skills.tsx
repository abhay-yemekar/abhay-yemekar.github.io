import { skillClusters } from '../data/skills'
import { sections } from '../data/sections'
import { SectionShell } from './SectionShell'

/** Interim layout on the existing clusters. Phase 3 regroups them by capability, with proof links. */
export function Skills() {
  return (
    <SectionShell section={sections.skills}>
      <dl className="m-0 grid gap-x-12 gap-y-6 lg:grid-cols-2">
        {skillClusters.map((cluster) => (
          <div key={cluster.label} className="border-t border-border pt-4">
            <dt className="text-[1.25rem] font-medium">{cluster.label}</dt>
            <dd className="u-meta m-0 mt-2 text-fg-muted">
              {[...cluster.skills, ...(cluster.highlight?.skills ?? [])].join(' · ')}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  )
}
