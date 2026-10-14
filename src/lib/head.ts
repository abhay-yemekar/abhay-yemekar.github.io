import { profile } from '../data/profile'

export type PageMeta = {
  /** Root-relative path with a trailing slash, e.g. "/work/hirelens/". */
  path: string
  title: string
  description: string
  ogImage: string
  ogImageAlt: string
  ogType: 'website' | 'article'
  jsonLd?: object[]
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// JSON inside <script> only needs "</" neutralised to stay inside the element.
const safeJson = (value: object) => JSON.stringify(value, null, 2).replace(/<\//g, '<\\/')

/** The per-page <head> tags that replace <!--app-head--> in index.html. */
export function renderHead(meta: PageMeta): string {
  const url = `${profile.siteUrl}${meta.path}`
  const image = meta.ogImage.startsWith('http') ? meta.ogImage : `${profile.siteUrl}${meta.ogImage}`

  const tags = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:site_name" content="${escapeAttr(profile.name)}" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeAttr(meta.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...(meta.jsonLd ?? []).map(
      (block) => `<script type="application/ld+json">\n${safeJson(block)}\n</script>`,
    ),
  ]

  return tags.join('\n    ')
}
