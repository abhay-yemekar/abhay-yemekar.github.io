import type { CaseStudy } from '../data/caseStudies'
import { personJsonLd, profile } from '../data/profile'

/**
 * JSON-LD for each page. Every fact here is already on the page, because
 * structured data that disagrees with the visible content is worse than none.
 * Nothing is invented: no ratings, no review counts, no download numbers.
 */
const SITE = profile.siteUrl
const PERSON_ID = `${SITE}/#person`
const author = { '@id': PERSON_ID }

export function homeJsonLd(): object[] {
  return [
    { ...personJsonLd, '@id': PERSON_ID },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: profile.name,
      inLanguage: 'en',
      author,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${SITE}/#profile`,
      url: `${SITE}/`,
      name: `${profile.name}, ${profile.role}`,
      mainEntity: author,
    },
  ]
}

export function caseStudyJsonLd(study: CaseStudy): object[] {
  const url = `${SITE}/work/${study.slug}/`
  const repo = study.links.find((link) => link.label === 'Repository')?.href
  const { structured } = study

  const work =
    structured.type === 'SoftwareSourceCode'
      ? {
          '@type': 'SoftwareSourceCode',
          codeRepository: repo,
          programmingLanguage: structured.languages,
          license: 'https://opensource.org/licenses/MIT',
          ...(structured.version ? { version: structured.version } : {}),
        }
      : {
          '@type': 'SoftwareApplication',
          applicationCategory: structured.category,
          operatingSystem: structured.operatingSystem,
          softwareVersion: structured.version,
          installUrl: structured.installUrl,
          // It is free (the product docs say so). No rating or review fields:
          // those would need numbers this site doesn't have.
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
        }

  return [
    {
      '@context': 'https://schema.org',
      ...work,
      name: study.name,
      description: study.tagline,
      url,
      author,
      creator: author,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: profile.name, item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Selected work', item: `${SITE}/#work` },
        { '@type': 'ListItem', position: 3, name: study.name, item: url },
      ],
    },
  ]
}
