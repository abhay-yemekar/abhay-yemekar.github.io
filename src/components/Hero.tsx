import type { CSSProperties } from 'react'
import { hero, profile } from '../data/profile'
import { HeroEvidence } from './HeroEvidence'
import { ExternalArrow, ForwardArrow } from './Icons'
import { MotionToggle } from './MotionToggle'
import { Wordmark } from './Wordmark'

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

/** Stagger position for the first-visit intro (motion.css). */
const order = (n: number) => ({ '--intro-order': n }) as CSSProperties

/**
 * The first screen: the name as a particle field, then the claim. The
 * headline's claim cites source 1 in the proof strip below it, so the page
 * shows its work the way the projects do.
 *
 * The <h1> (the lede on phones) is the LCP element. It paints with the first
 * frame. The intro only settles it into place (a transform) and never fades it.
 */
export function Hero() {
  const { before, evidence, after } = splitHeadline()

  return (
    <section id="top" aria-labelledby="hero-heading" className="relative isolate overflow-hidden" data-hero>
      {/* The WebGL particle field draws here once it runs; until then, the SVG wordmark. */}
      <canvas className="hero-canvas pointer-events-none absolute inset-0 -z-10 h-full w-full" aria-hidden="true" data-particles />

      <div className="u-container pt-8 lg:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-x-6" data-intro="rise" style={order(0)}>
          <p className="u-label m-0 whitespace-nowrap text-fg-muted">{hero.eyebrow}</p>
          <MotionToggle className="-my-3" />
        </div>
      </div>

      <div className="mx-auto mt-5 w-full max-w-[1880px] px-4 lg:mt-7 lg:px-6" data-wordmark-box>
        <Wordmark />
      </div>

      <div className="u-container">
        <div className="mt-8 h-px bg-border lg:mt-12" aria-hidden="true" data-intro="line" />
        <div className="grid gap-x-10 gap-y-8 pt-8 lg:grid-cols-12 lg:pt-12">
          <h1 id="hero-heading" className="max-w-[17ch] text-display lg:col-span-7" data-intro="settle">
            {before}
            <span className="u-evidence u-accent">{evidence}</span>
            {after}
            <a href="#source-1" className="u-cite" aria-label="Source 1">
              1
            </a>
          </h1>

          <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
            {/* On phones the lede is the largest text on screen, so it may be the LCP element: it only moves. */}
            <p className="m-0 max-w-[44ch] text-lede text-fg-muted" data-intro="drift" style={order(2)}>
              {hero.lede}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3" data-intro="rise" style={order(3)}>
              <a href={hero.primaryCta.href} className="u-btn" data-magnetic>
                <span className="sm:hidden">{hero.primaryCta.shortLabel}</span>
                <span className="hidden sm:inline">{hero.primaryCta.label}</span>
                <ForwardArrow />
              </a>
              <a href={hero.secondaryCta.href} className="u-meta u-tap">
                <span className="u-link text-fg">{hero.secondaryCta.label}</span>
              </a>
              {/* Appears only once public/resume.pdf exists and resumeUrl points at it. */}
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} className="u-meta u-tap">
                  <span className="u-link text-fg">Resume (PDF)</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-10 pb-16 lg:mt-20 lg:grid-cols-12 lg:pb-24" data-intro="rise" style={order(4)}>
          <div className="lg:col-span-5">
            <p className="u-label m-0 text-fg-subtle">Sources</p>
            <ol aria-label="Sources" className="u-meta m-0 mt-5 grid list-none gap-y-4 p-0 text-fg-muted">
              {hero.sources.map((source, i) => {
                const external = source.href.startsWith('http')
                return (
                  <li key={source.name} id={`source-${i + 1}`} className="grid scroll-mt-28 grid-cols-[1.75rem_1fr] border-t border-border pt-4">
                    <span className="text-accent">{i + 1}</span>
                    <span>
                      <a
                        href={source.href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="inline-flex min-h-6 items-center gap-1 font-semibold text-fg no-underline"
                      >
                        <span className="u-link">{source.name}</span>
                        {external && <ExternalArrow />}
                      </a>{' '}
                      · {source.detail}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <HeroEvidence />
          </div>
        </div>
      </div>
    </section>
  )
}
