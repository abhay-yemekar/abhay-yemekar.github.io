/**
 * Renders every page to static HTML. This is the only place React runs.
 *
 * Used twice, through the same code path:
 * - in dev, by the render-in-dev plugin in vite.config.ts, on each request
 * - in production, by scripts/prerender.mjs, once per route after `vite build`
 *
 * The browser gets the HTML, the CSS and src/client/main.ts (a few hundred
 * bytes of behaviour). No React, no hydration, so there's no hydration
 * mismatch to get wrong.
 */
import type { ReactNode } from 'react'
import { prerender } from 'react-dom/static'
import * as about from './data/about'
import { caseStudies } from './data/caseStudies'
import * as credentials from './data/credentials'
import * as experience from './data/experience'
import { hero, homeSeo, personJsonLd, profile } from './data/profile'
import * as projects from './data/projects'
import * as skills from './data/skills'
import { renderHead, type PageMeta } from './lib/head'
import { collectTodos } from './lib/todo'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { HomePage } from './pages/HomePage'

type Route = { meta: PageMeta; element: ReactNode }

const routes: Route[] = [
  {
    meta: {
      path: '/',
      title: homeSeo.title,
      description: homeSeo.description,
      ogImage: homeSeo.ogImage,
      ogImageAlt: homeSeo.ogImageAlt,
      ogType: 'website',
      jsonLd: [personJsonLd],
    },
    element: <HomePage />,
  },
  ...caseStudies.map(
    (study): Route => ({
      meta: {
        path: `/work/${study.slug}/`,
        title: `${study.name} — case study · ${profile.name}`,
        description: `${study.tagline} ${study.summary}`,
        ogImage: homeSeo.ogImage,
        ogImageAlt: homeSeo.ogImageAlt,
        ogType: 'article',
      },
      element: <CaseStudyPage study={study} />,
    }),
  ),
]

export const paths = routes.map((route) => route.meta.path)

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
