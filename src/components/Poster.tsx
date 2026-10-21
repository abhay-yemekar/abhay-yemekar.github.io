import { POSTER_WIDTHS, projectMedia } from '../data/media'

/**
 * A 16:10 project poster, AVIF first, from scripts/gen-media.mjs. Decorative
 * (alt=""): the project's name is always right beside it.
 *
 * `sizes` describes the slot it fills. `priority` is for a poster in the
 * first screen: it skips lazy loading.
 */
export function Poster({ slug, sizes, priority = false }: { slug: string; sizes: string; priority?: boolean }) {
  const media = projectMedia[slug]
  if (!media) return null
  const srcSet = (ext: string) => POSTER_WIDTHS.map((w) => `${media.poster}-${w}.${ext} ${w}w`).join(', ')

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={`${media.poster}-640.webp`}
        alt=""
        width={640}
        height={400}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        decoding="async"
        className="block h-auto w-full"
      />
    </picture>
  )
}
