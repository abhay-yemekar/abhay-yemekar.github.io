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
      <main id="main" className="u-container py-20 lg:py-28">
        <p className="u-meta m-0 text-fg-subtle">404 · not found</p>
        <h1 className="mt-5 max-w-[18ch] text-title">
          There’s <span className="u-evidence">no evidence</span> of that page.
        </h1>
        <p className="mt-6 max-w-[48ch] text-lede text-fg-muted">
          It may have moved when the site was rebuilt. The work is all still here:
        </p>
        <ul className="m-0 mt-6 list-none p-0">
          {caseStudies.map((study) => (
            <li key={study.slug}>
              <a href={`/work/${study.slug}/`} className="u-tap gap-2 text-[1.25rem] no-underline">
                <span className="u-link">{study.name}</span>
                <ForwardArrow />
              </a>
            </li>
          ))}
        </ul>
        <a href="/" className="u-btn mt-10">
          Home
          <ForwardArrow />
        </a>
      </main>
      <Footer page="case" />
    </>
  )
}
