import { POSTER_WIDTHS, projectMedia } from '../data/media'

/**
 * A 16:10 project poster, AVIF first, from scripts/gen-media.mjs. Decorative
 * (alt=""): the project's name is always right beside it.
 *
 * `sizes` describes the slot it fills. `priority` is for the poster that is
 * the first screen's largest image: it skips lazy loading and fetches early.
 * `eager` only skips lazy loading, for posters that may peek into the first
 * screen on larger displays.
 */
export function Poster({
  slug,
  sizes,
  priority = false,
  eager = false,
}: {
  slug: string
  sizes: string
  priority?: boolean
  eager?: boolean
}) {
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
        loading={priority || eager ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        decoding="async"
        className="block h-auto w-full"
      />
    </picture>
  )
}
