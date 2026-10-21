import { profile } from '../data/profile'
import { sections } from '../data/sections'
import { ExternalArrow, ForwardArrow } from './Icons'
import { SectionShell } from './SectionShell'

const channels = [
  { label: 'GitHub', value: 'abhay-yemekar', href: profile.links.github },
  { label: 'LinkedIn', value: 'abhayyemekar', href: profile.links.linkedin },
]

/** The close: the offer, then the email address at display size as the link itself. */
export function Contact() {
  return (
    <SectionShell section={sections.contact}>
      <div className="grid gap-x-8 gap-y-8 lg:grid-cols-12">
        <p className="u-display m-0 text-[clamp(2.25rem,5.2vw,4.75rem)] leading-[0.98] tracking-[-0.025em] lg:col-span-9">
          Open to AI engineering roles and <span className="u-accent">interesting problems.</span>
        </p>
        <p className="m-0 max-w-[44ch] text-lede text-fg-muted lg:col-span-5">
          The fastest way to reach me is email. I read everything and reply to anything specific.
        </p>
      </div>

      {/* mailto opens in place, so no target="_blank" (CLAUDE.md). */}
      <a
        href={profile.links.email}
        className="group mt-14 flex items-center justify-between gap-6 border-y border-border py-8 text-fg no-underline lg:mt-20 lg:py-10"
      >
        <span className="u-display min-w-0 text-[clamp(1.375rem,5.6vw,6rem)] leading-none tracking-[-0.02em] [overflow-wrap:anywhere]">
          <span className="u-link">{profile.email}</span>
        </span>
        <span className="u-arrow-ring transition-transform duration-(--duration-slow) ease-(--ease-entrance) group-hover:-rotate-45">
          <ForwardArrow />
        </span>
      </a>

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2">
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
