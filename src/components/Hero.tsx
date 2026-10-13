import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { profile } from '../data/profile'

/** Splits the headline so the emphasised clause can be styled separately. */
function splitHeadline() {
  const { headline, headlineEmphasis } = profile
  const at = headline.indexOf(headlineEmphasis)
  if (at === -1) return { before: headline, emphasis: '', after: '' }
  return {
    before: headline.slice(0, at),
    emphasis: headlineEmphasis,
    after: headline.slice(at + headlineEmphasis.length),
  }
}

export function Hero() {
  const reduced = useReducedMotion()
  const { before, emphasis, after } = splitHeadline()

  const line = (order: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: '110%' },
    animate: reduced ? { opacity: 1 } : { opacity: 1, y: '0%' },
    transition: {
      duration: reduced ? 0.001 : 0.7,
      delay: reduced ? 0 : order * 0.08,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  })

  const fade = (order: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: reduced ? 0.001 : 0.6,
      delay: reduced ? 0 : 0.2 + order * 0.08,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  })

  return (
    <section id="top" className="u-container pt-32 pb-20 lg:pt-44 lg:pb-32">
      <div className="lg:grid lg:grid-cols-[10rem_1fr] lg:gap-16">
        <m.div {...fade(0)} className="mb-8 lg:mb-0">
          <p className="u-label text-fg-subtle">
            {profile.role}
            <span className="mx-2 text-accent" aria-hidden="true">
              /
            </span>
            {profile.city}
          </p>
        </m.div>

        <div className="min-w-0">
          <h1 className="max-w-[22ch] text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.02em]">
            <span className="block overflow-hidden">
              <m.span {...line(0)} className="block">
                {before.trim()}
              </m.span>
            </span>
            <span className="block overflow-hidden">
              <m.span {...line(1)} className="block">
                <em className="italic text-accent">{emphasis}</em>
              </m.span>
            </span>
            <span className="block overflow-hidden">
              <m.span {...line(2)} className="block">
                {after.replace(/^\s*/, '')}
              </m.span>
            </span>
          </h1>

          <m.p
            {...fade(3)}
            className="mt-8 max-w-[52ch] text-[clamp(1.0625rem,1.4vw,1.1875rem)] text-fg-muted"
          >
            {profile.subhead}
          </m.p>

          <m.p {...fade(4)} className="u-label mt-8 text-fg-subtle">
            {profile.focus.map((item, i) => (
              <span key={item}>
                {i > 0 && (
                  <span className="mx-2 text-border-strong" aria-hidden="true">
                    ·
                  </span>
                )}
                {item}
              </span>
            ))}
          </m.p>

          <m.div {...fade(5)} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#work"
              className="u-label border-b border-accent pb-1 text-fg transition-colors duration-200 hover:text-accent"
            >
              View projects
            </a>
            <a href={profile.links.email} className="u-label text-fg-muted u-link">
              Get in touch
            </a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                className="u-label text-fg-muted u-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            )}
          </m.div>
        </div>
      </div>
    </section>
  )
}
