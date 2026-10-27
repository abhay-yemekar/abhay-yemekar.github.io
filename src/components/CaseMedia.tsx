import { FILM_WIDTHS, projectMedia, STILL_WIDTHS } from '../data/media'
import { PauseIcon } from './Icons'

const srcSet = (base: string, widths: readonly number[], ext: string) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ')

function Picture({ base, widths, sizes, alt, width, height }: { base: string; widths: readonly number[]; sizes: string; alt: string; width: number; height: number }) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(base, widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(base, widths, 'webp')} sizes={sizes} />
      <img src={`${base}-${widths[0]}.webp`} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="block h-auto w-full" />
    </picture>
  )
}

/**
 * A case study's "In the product" media: the film (a still in the HTML, played
 * as an animated WebP while it's in view, with its own Pause / Play button,
 * src/client/films.ts) and any stills, each with a caption.
 */
export function CaseMedia({ slug }: { slug: string }) {
  const media = projectMedia[slug]
  const { film, stills = [] } = media ?? {}
  if (!film && stills.length === 0) return null

  return (
    <div className="grid items-end gap-x-8 gap-y-10 lg:grid-cols-12">
      {film && (
        <figure className={`m-0 ${stills.length ? 'lg:col-span-8' : 'lg:col-span-10'}`} data-film={`/media/${slug}/film.webp`} data-wipe>
          <div className="film-frame relative overflow-hidden rounded-card border border-border bg-bg-elev">
            <Picture
              base={`/media/${slug}/film`}
              widths={FILM_WIDTHS}
              sizes="(min-width: 1024px) 60vw, calc(100vw - 2.5rem)"
              alt={film.alt}
              width={film.width}
              height={film.height}
            />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
            <span className="u-meta text-fg-subtle">{film.caption}</span>
            {/* The film loops, so it has its own control (WCAG 2.2.2). src/client/films.ts sets the label; hidden without JS. */}
            <button type="button" className="u-pill-link -my-2 shrink-0 cursor-pointer" data-film-toggle data-state="playing">
              <span className="u-pill">
                <PauseIcon />
                <span data-film-label>Pause film</span>
              </span>
            </button>
          </figcaption>
        </figure>
      )}
      {stills.map((still) => (
        <figure key={still.name} className="m-0 lg:col-span-4" data-wipe>
          <div className="overflow-hidden rounded-card border border-border bg-bg-elev">
            <Picture
              base={`/media/${slug}/${still.name}`}
              widths={STILL_WIDTHS}
              sizes="(min-width: 1024px) 30vw, calc(100vw - 2.5rem)"
              alt={still.alt}
              width={800}
              height={500}
            />
          </div>
          <figcaption className="u-meta mt-3 text-fg-subtle">{still.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}
