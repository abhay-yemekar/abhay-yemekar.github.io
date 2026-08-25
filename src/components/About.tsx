import { about } from '../data/about'
import { profile } from '../data/profile'
import { sections } from '../data/sections'
import { Reveal } from './Reveal'
import { SectionShell } from './SectionShell'

export function About() {
  return (
    <SectionShell section={sections.about}>
      <Reveal>
        <p className="max-w-[46ch] font-display text-[clamp(1.5rem,3vw,2rem)] leading-[1.25]">
          {about.lede}
        </p>
      </Reveal>

      <div className="mt-8 max-w-[64ch] space-y-5 text-fg-muted">
        {about.paragraphs.map((text, i) => (
          <Reveal key={i} order={i + 1}>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>

      <ul className="mt-12 grid gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-2">
        {about.principles.map((principle, i) => (
          <Reveal as="li" key={principle.title} order={i + 3} className="bg-bg-elev p-6">
            <h3 className="u-label text-accent">{principle.title}</h3>
            <p className="mt-3 text-[0.9375rem] text-fg-muted">{principle.body}</p>
          </Reveal>
        ))}
      </ul>

      <Reveal order={5}>
        <p className="mt-10 max-w-[64ch] text-fg-muted">{about.closing}</p>
      </Reveal>

      <Reveal order={6}>
        <p className="u-micro mt-10 text-fg-subtle">
          Based in {profile.location}
        </p>
      </Reveal>
    </SectionShell>
  )
}
