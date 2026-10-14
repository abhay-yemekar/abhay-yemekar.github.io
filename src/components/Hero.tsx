import { hero } from '../data/profile'
import { ExternalArrow, ForwardArrow } from './Icons'

/** Splits the headline so the evidence clause can carry the mark and citation. */
function splitHeadline() {
  const at = hero.headline.indexOf(hero.evidence)
  if (at === -1) return { before: hero.headline, evidence: '', after: '' }
  return {
    before: hero.headline.slice(0, at),
    evidence: hero.evidence,
    after: hero.headline.slice(at + hero.evidence.length),
  }
}

/**
 * The first screen. The headline's claim cites source 1 in the proof strip
 * below it: the page shows its work the way the projects do. There's no
 * entrance animation, so the headline (the LCP element) is painted with the
 * first frame.
 */
export function Hero() {
  const { before, evidence, after } = splitHeadline()

  return (
    <section id="top" aria-labelledby="hero-heading" className="u-container pt-14 pb-12 lg:pt-20 lg:pb-14">
      <p className="u-meta mb-7 text-fg-subtle">{hero.eyebrow}</p>
      <h1 id="hero-heading" className="max-w-[15ch] text-display">
        {before}
        <span className="u-evidence">{evidence}</span>
        {after}
        <a href="#source-1" className="u-cite" aria-label="Source 1">
          1
        </a>
      </h1>
      <p className="mt-7 max-w-[34ch] text-lede text-fg-muted lg:max-w-[44ch]">{hero.lede}</p>

      <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
        <a href={hero.primaryCta.href} className="u-btn">
          <span className="sm:hidden">{hero.primaryCta.shortLabel}</span>
          <span className="hidden sm:inline">{hero.primaryCta.label}</span>
          <ForwardArrow />
        </a>
        <a href={hero.secondaryCta.href} className="u-meta u-tap">
          <span className="u-link text-fg">{hero.secondaryCta.label}</span>
        </a>
      </div>

      <ol aria-label="Sources" className="u-meta mt-14 grid list-none gap-x-8 gap-y-3 border-t border-border p-0 pt-5 text-fg-muted md:grid-cols-3">
        {hero.sources.map((source, i) => {
          const external = source.href.startsWith('http')
          return (
            <li key={source.name} id={`source-${i + 1}`} className="scroll-mt-28">
              <span className="mr-2 text-accent">{i + 1}</span>
              <a
                href={source.href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex min-h-6 items-center gap-1 font-semibold text-fg no-underline"
              >
                <span className="u-link">{source.name}</span>
                {external && <ExternalArrow />}
              </a>{' '}
              · {source.detail}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
