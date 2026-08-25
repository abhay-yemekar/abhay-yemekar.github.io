import { profile } from '../data/profile'
import { sections } from '../data/sections'
import { Reveal } from './Reveal'
import { SectionShell } from './SectionShell'

const channels = [
  { label: 'Email', value: profile.email, href: profile.links.email },
  { label: 'GitHub', value: 'abhay-yemekar', href: profile.links.github },
  { label: 'LinkedIn', value: 'abhayyemekar', href: profile.links.linkedin },
]

/** Email opens the mail client in place; the rest are outbound. */
const isExternal = (label: string) => label !== 'Email'

export function Contact() {
  return (
    <SectionShell section={sections.contact}>
      <Reveal>
        <p className="max-w-[42ch] font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] tracking-[-0.015em]">
          Open to roles and interesting problems.
        </p>
      </Reveal>

      <Reveal order={1}>
        <p className="mt-6 max-w-[56ch] text-fg-muted">
          The fastest way to reach me is email. I read everything and reply to
          anything specific.
        </p>
      </Reveal>

      <Reveal order={2}>
        <p className="mt-10">
          <a
            href={profile.links.email}
            className="inline-flex items-center gap-3 rounded border border-accent px-6 py-3.5 text-accent transition-colors duration-200 hover:bg-accent hover:text-accent-fg"
          >
            <span className="u-label">Send an email</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 6h8M6.8 2.8 10 6l-3.2 3.2" />
            </svg>
          </a>
        </p>
      </Reveal>

      <ul className="mt-14 grid gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-3">
        {channels.map((channel, i) => (
          <Reveal as="li" key={channel.label} order={i + 3} className="bg-bg-elev">
            <a
              href={channel.href}
              {...(isExternal(channel.label)
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="group block px-5 py-5 transition-colors duration-200 hover:bg-bg-elev-2"
            >
              <span className="u-micro block text-fg-subtle">{channel.label}</span>
              <span className="mt-2 block break-words text-[0.9375rem] text-fg transition-colors duration-200 group-hover:text-accent">
                {channel.value}
              </span>
            </a>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  )
}
