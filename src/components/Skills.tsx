import { skillClusters } from '../data/skills'
import { sections } from '../data/sections'
import { Reveal } from './Reveal'
import { SectionShell } from './SectionShell'

export function Skills() {
  return (
    <SectionShell section={sections.skills}>
      <ul className="grid gap-px overflow-hidden rounded border border-border bg-border md:grid-cols-2">
        {skillClusters.map((cluster, i) => (
          <Reveal
            as="li"
            key={cluster.label}
            order={i}
            className={`bg-bg-elev p-6 sm:p-7 ${
              // Five clusters into a two-column grid: the last one spans both.
              i === skillClusters.length - 1 ? 'md:col-span-2' : ''
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-sans text-[1.0625rem] font-semibold tracking-[-0.01em] text-fg">
                {cluster.label}
              </h3>
              <p className="u-micro shrink-0 text-fg-subtle">{cluster.caption}</p>
            </div>

            <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
              {cluster.skills.map((skill) => (
                <li
                  key={skill}
                  className="u-micro rounded-sm border border-border px-2 py-1 text-fg-muted"
                >
                  {skill}
                </li>
              ))}
            </ul>

            {cluster.highlight && (
              <div className="mt-5 border-t border-border pt-5">
                <h4 className="u-micro text-accent">{cluster.highlight.label}</h4>
                <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
                  {cluster.highlight.skills.map((skill) => (
                    <li
                      key={skill}
                      className="u-micro rounded-sm border border-accent/40 px-2 py-1 text-fg"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  )
}
