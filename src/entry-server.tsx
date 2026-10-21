/**
 * Renders every page to static HTML. This is the only place React runs.
 *
 * Used twice, through the same code path:
 * - in dev, by the render-in-dev plugin in vite.config.ts, on each request
 * - in production, by scripts/prerender.mjs, once per route after `vite build`
 *
 * The browser gets the HTML, the CSS and src/client (about 1 kB of behaviour,
 * plus the 1 kB explainer chunk where it is used). No React, no hydration, so
 * there is no hydration mismatch to get wrong.
 *
 * Also exports what the build derives from the same data: sitemap entries,
 * llms.txt, and the OG card copy for scripts/gen-og.mjs.
 */
import type { ReactNode } from 'react'
import { prerender } from 'react-dom/static'
import * as about from './data/about'
import { caseStudies } from './data/caseStudies'
import * as credentials from './data/credentials'
import * as experience from './data/experience'
import { hero, homeSeo, profile } from './data/profile'
import * as projects from './data/projects'
import * as skills from './data/skills'
import { renderHead, type PageMeta } from './lib/head'
import { caseStudyJsonLd, homeJsonLd } from './lib/structured-data'
import { collectTodos } from './lib/todo'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

type Route = {
  meta: PageMeta
  element: ReactNode
  /** Output file relative to dist/. Defaults to <path>/index.html. */
  file?: string
  /** Left out of the sitemap and llms.txt (the 404 page). */
  unlisted?: boolean
}

const ogFor = (slug: string) => `/og/${slug}.png`

/** The site's address, for the prerender (sitemap, robots.txt, CNAME). */
export const siteUrl = profile.siteUrl
const host = new URL(profile.siteUrl).host

const routes: Route[] = [
  {
    meta: {
      path: '/',
      title: homeSeo.title,
      description: homeSeo.description,
      ogImage: ogFor('home'),
      ogImageAlt: `${profile.name}: ${hero.headline}`,
      ogType: 'website',
      jsonLd: homeJsonLd(),
    },
    element: <HomePage />,
  },
  ...caseStudies.map(
    (study): Route => ({
      meta: {
        path: `/work/${study.slug}/`,
        title: `${study.name}, a case study by ${profile.name}`,
        description: `${study.tagline} A case study by ${profile.name}.`,
        ogImage: ogFor(study.slug),
        ogImageAlt: `${study.name}: ${study.og.subtitle}`,
        ogType: 'article',
        jsonLd: caseStudyJsonLd(study),
      },
      element: <CaseStudyPage study={study} />,
    }),
  ),
  {
    meta: {
      path: '/404/',
      title: `Page not found · ${profile.name}`,
      description: 'This page does not exist. The work is linked from here.',
      ogImage: ogFor('home'),
      ogImageAlt: `${profile.name}: ${hero.headline}`,
      ogType: 'website',
      noindex: true,
    },
    element: <NotFoundPage />,
    file: '404.html',
    unlisted: true,
  },
]

export const pages = routes.map((route) => ({
  path: route.meta.path,
  file: route.file ?? (route.meta.path === '/' ? 'index.html' : `${route.meta.path.slice(1)}index.html`),
  listed: !route.unlisted,
}))

/** Paths the dev server answers. */
export const paths = pages.map((page) => page.path)

/** Renders one route into the index.html template. */
export async function renderPage(path: string, template: string): Promise<string> {
  const route = routes.find((candidate) => candidate.meta.path === path)
  if (!route) throw new Error(`No route for ${path}`)

  const { prelude } = await prerender(route.element)
  const body = await new Response(prelude).text()

  // Function replacers, so a "$" in content can't be read as a pattern token.
  return template
    .replace('<!--app-head-->', () => renderHead(route.meta))
    .replace('<!--app-html-->', () => body)
}

/** Every Todo left in the content, for the prerender's build warnings. */
export function listTodos() {
  return collectTodos({ hero, about, caseStudies, credentials, experience, projects, skills })
}

/**
 * llms.txt (llmstxt.org): a plain-text map of the site for language models,
 * built from the same data as the pages so it can't drift from them.
 */
export function llmsTxt(): string {
  const site = profile.siteUrl
  return [
    `# ${profile.name}`,
    '',
    `> ${profile.role} in ${profile.city}. ${hero.headline} ${hero.lede}`,
    '',
    `Currently ${profile.jobTitle} at ${profile.company}. Contact: ${profile.email}.`,
    '',
    '## Case studies',
    '',
    ...caseStudies.map((s) => `- [${s.name}](${site}/work/${s.slug}/): ${s.tagline} Pattern: ${s.pattern}.`),
    '',
    '## Elsewhere',
    '',
    `- [Home](${site}/): selected work, experience, capabilities, about, contact`,
    `- [GitHub](${profile.links.github})`,
    `- [LinkedIn](${profile.links.linkedin})`,
    '',
  ].join('\n')
}

/** Copy for the generated OG cards (scripts/gen-og.mjs), one per listed page. */
export const ogCards = [
  {
    slug: 'home',
    eyebrow: `${profile.role} · ${profile.city}`,
    title: hero.headline,
    mark: hero.evidence,
    footer: host,
  },
  ...caseStudies.map((s) => ({
    slug: s.slug,
    eyebrow: `Case study · ${profile.name}`,
    title: s.og.title,
    subtitle: s.og.subtitle,
    pattern: s.pattern,
    footer: `${host}/work/${s.slug}`,
  })),
]
