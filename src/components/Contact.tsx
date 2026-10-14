import { profile } from '../data/profile'
import { sections } from '../data/sections'
import { ExternalArrow, ForwardArrow } from './Icons'
import { SectionShell } from './SectionShell'

const channels = [
  { label: 'GitHub', value: 'abhay-yemekar', href: profile.links.github },
  { label: 'LinkedIn', value: 'abhayyemekar', href: profile.links.linkedin },
]

export function Contact() {
  return (
    <SectionShell section={sections.contact}>
      <p className="m-0 max-w-[24ch] text-[clamp(1.75rem,4vw,2.75rem)] leading-tight">
        Open to AI engineering roles and interesting problems.
      </p>
      <p className="mt-5 max-w-[52ch] text-fg-muted">
        The fastest way to reach me is email. I read everything and reply to anything specific.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        {/* mailto opens in place, so no target="_blank" (CLAUDE.md). */}
        <a href={profile.links.email} className="u-btn">
          {profile.email}
          <ForwardArrow />
        </a>
        {channels.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="u-meta u-tap gap-1.5 text-fg no-underline"
          >
            <span className="text-fg-subtle">{channel.label}</span>
            <span className="u-link">{channel.value}</span>
            <ExternalArrow />
          </a>
        ))}
        {profile.resumeUrl && (
          <a href={profile.resumeUrl} className="u-meta u-tap u-link text-fg">
            Resume (PDF)
          </a>
        )}
      </div>
    </SectionShell>
  )
}
