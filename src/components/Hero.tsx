import { hero, profile } from '../data/profile'
import { ForwardArrow } from './Icons'

/** Splits the headline so the evidence clause can carry the mark. */
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
 * The first screen, kept short so the projects show beneath it: the role at
 * the largest size on the page, one line on what he builds, and two actions.
 * The name shows once, in the header. The <h1> still carries it for screen
 * readers and search, so the page's one heading says whose page this is. The
 * <h1> is the LCP element.
 */
export function Hero() {
  const { before, evidence, after } = splitHeadline()

  return (
    <section id="top" aria-labelledby="hero-heading" data-hero>
      <div className="u-container pt-14 pb-16 sm:pt-20 lg:pt-24 lg:pb-20">
        <h1 id="hero-heading" className="m-0 text-display">
          <span className="sr-only">{profile.name}, </span>
          {hero.role}
        </h1>

        <p className="m-0 mt-6 max-w-[34ch] text-lede text-fg-muted sm:max-w-[48ch] lg:mt-7">
          {before}
          <span className="u-evidence text-fg">{evidence}</span>
          {after} {hero.lede}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={hero.primaryCta.href} className="u-btn">
            {hero.primaryCta.label}
            <ForwardArrow />
          </a>
          {/* mailto opens in place, so no target="_blank" (CLAUDE.md). */}
          <a href={hero.secondaryCta.href} className="u-btn u-btn--ghost">
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  )
}
