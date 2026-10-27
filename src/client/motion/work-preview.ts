/**
 * Hover previews for the project cards (mouse, motion on). Pointing at a card
 * plays its moving preview (animated WebP or muted WebM) inside the card's own
 * poster frame, over the poster; leaving fades it back out. A preview loads
 * on its card's first hover only.
 *
 * Decorative: the preview is aria-hidden and the poster underneath stays.
 * Keyboard and touch users see the posters.
 */
export function initWorkPreview(list: HTMLElement) {
  const cleanups = [...list.querySelectorAll<HTMLElement>('[data-work-row]')].map((row) => {
    const frame = row.querySelector<HTMLElement>('[data-work-frame]')
    const src = row.dataset.preview
    if (!frame || !src) return () => {}

    let media: HTMLImageElement | HTMLVideoElement | undefined
    const ready = (el: HTMLElement) => el.classList.add('is-ready')

    const load = () => {
      if (row.dataset.previewType === 'video/webm') {
        const video = document.createElement('video')
        if (!video.canPlayType('video/webm')) return undefined
        Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'auto', src })
        video.addEventListener('playing', () => ready(video), { once: true })
        return video
      }
      const img = new Image()
      img.alt = ''
      img.decoding = 'async'
      img.addEventListener('load', () => ready(img), { once: true })
      img.src = src
      return img
    }

    const enter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      if (!media) {
        media = load()
        if (!media) return
        media.className = 'work-card__preview'
        media.setAttribute('aria-hidden', 'true')
        frame.append(media)
      }
      row.dataset.previewing = ''
      if (media instanceof HTMLVideoElement) void media.play().catch(() => {})
    }
    const leave = () => {
      delete row.dataset.previewing
      if (media instanceof HTMLVideoElement) media.pause()
    }

    row.addEventListener('pointerenter', enter)
    row.addEventListener('pointerleave', leave)
    return () => {
      row.removeEventListener('pointerenter', enter)
      row.removeEventListener('pointerleave', leave)
      leave()
      media?.remove()
    }
  })

  return () => cleanups.forEach((cleanup) => cleanup())
}
