import { Footer } from '../components/Footer'
import { ForwardArrow } from '../components/Icons'
import { Nav } from '../components/Nav'
import { SkipLink } from '../components/SkipLink'
import { caseStudies } from '../data/caseStudies'

/**
 * Served by GitHub Pages for any missing path. It is prerendered like every
 * other page, so it shares the fonts, tokens and nav rather than being a
 * standalone file that drifts (the old one had failed the contrast check).
 */
export function NotFoundPage() {
  return (
    <>
      <SkipLink />
      <Nav page="other" />
      <main id="main" className="u-container py-16 lg:py-24">
        <p className="u-label m-0 text-fg-subtle">404 · not found</p>
        <h1 className="mt-6 max-w-[16ch] text-title">
          There’s <span className="u-evidence u-accent">no evidence</span> of that page.
        </h1>
        <p className="mt-8 max-w-[48ch] text-lede text-fg-muted">
          It may have moved when the site was rebuilt. The work is all still here:
        </p>
        <ul className="m-0 mt-8 list-none border-t border-border p-0">
          {caseStudies.map((study) => (
            <li key={study.slug} className="border-b border-border">
              <a
                href={`/work/${study.slug}/`}
                className="group flex items-center justify-between gap-6 py-5 text-fg no-underline"
              >
                <span className="u-display text-[clamp(1.75rem,3.4vw,3rem)] leading-none tracking-[-0.02em] transition-transform duration-(--duration-slow) ease-(--ease-entrance) group-hover:translate-x-2">
                  {study.name}
                </span>
                <span className="u-arrow-ring">
                  <ForwardArrow />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a href="/" className="u-btn mt-12" data-magnetic>
          Home
          <ForwardArrow />
        </a>
      </main>
      <Footer page="case" />
    </>
  )
}
