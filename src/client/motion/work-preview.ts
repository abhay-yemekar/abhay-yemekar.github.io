import { gsap } from 'gsap'

/**
 * Hover previews for the work index (desktop, mouse, motion on). Pointing at a
 * project's name floats its poster beside the cursor, then swaps in the moving
 * preview (animated WebP or muted WebM) once that has loaded. Moving previews
 * load on first hover only.
 *
 * The posters are cloned from each row's own <picture>, which motion.css hides
 * in this mode. It's decorative: aria-hidden, no pointer events. Keyboard and
 * touch users get the inline posters instead.
 */
export function initWorkPreview(list: HTMLElement) {
  // GSAP moves and tilts the zero-size outer element at the cursor; the card
  // inside is centred and scaled by CSS. GSAP folds the CSS scale/translate
  // properties into its own transform, so the two never share an element.
  const frame = document.createElement('div')
  frame.className = 'work-preview'
  frame.setAttribute('aria-hidden', 'true')
  const card = document.createElement('div')
  card.className = 'work-preview__card'
  frame.append(card)

  const slides = new Map<HTMLElement, HTMLElement>()
  for (const row of list.querySelectorAll<HTMLElement>('[data-work-row]')) {
    const picture = row.querySelector('picture')
    if (!picture) continue
    const slide = document.createElement('div')
    slide.className = 'work-preview__slide'
    const clone = picture.cloneNode(true) as HTMLElement
    clone.querySelector('img')?.setAttribute('loading', 'eager')
    slide.append(clone)
    card.append(slide)
    slides.set(row, slide)
  }
  document.body.append(frame)

  const x = gsap.quickTo(frame, 'x', { duration: 0.65, ease: 'power3' })
  const y = gsap.quickTo(frame, 'y', { duration: 0.65, ease: 'power3' })
  const tilt = gsap.quickTo(frame, 'rotation', { duration: 0.8, ease: 'power3' })
  const settle = gsap.delayedCall(0.12, () => tilt(0)).pause()
  let active: HTMLElement | null = null
  let lastX = 0

  const media = (slide: HTMLElement) => slide.querySelector<HTMLVideoElement>('video')

  const loadPreview = (row: HTMLElement, slide: HTMLElement) => {
    const src = row.dataset.preview
    if (!src || slide.dataset.loaded !== undefined) return
    slide.dataset.loaded = ''
    const ready = (el: HTMLElement) => el.classList.add('is-ready')
    if (row.dataset.previewType === 'video/webm') {
      const video = document.createElement('video')
      if (!video.canPlayType('video/webm')) return
      Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'auto', src })
      video.className = 'work-preview__media'
      video.addEventListener('playing', () => ready(video), { once: true })
      slide.append(video)
    } else {
      const img = new Image()
      img.alt = ''
      img.decoding = 'async'
      img.className = 'work-preview__media'
      img.addEventListener('load', () => ready(img), { once: true })
      img.src = src
      slide.append(img)
    }
  }

  const show = (row: HTMLElement, event: PointerEvent) => {
    const slide = slides.get(row)
    if (!slide || active === row) return
    if (active) hide(false)
    if (!frame.classList.contains('is-visible')) gsap.set(frame, { x: event.clientX, y: event.clientY })
    active = row
    loadPreview(row, slide)
    slide.classList.add('is-active')
    void media(slide)?.play().catch(() => {})
    frame.classList.add('is-visible')
  }
  const hide = (all = true) => {
    if (active) {
      const slide = slides.get(active)
      slide?.classList.remove('is-active')
      if (slide) media(slide)?.pause()
    }
    active = null
    if (all) frame.classList.remove('is-visible')
  }

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    x(event.clientX)
    y(event.clientY)
    tilt(gsap.utils.clamp(-7, 7, (event.clientX - lastX) * 0.5))
    settle.restart(true)
    lastX = event.clientX
  }

  const cleanups = [...slides.keys()].map((row) => {
    const hit = row.querySelector<HTMLElement>('[data-work-hit]') ?? row
    const enter = (event: PointerEvent) => event.pointerType === 'mouse' && show(row, event)
    const leave = () => hide()
    hit.addEventListener('pointerenter', enter)
    hit.addEventListener('pointerleave', leave)
    return () => {
      hit.removeEventListener('pointerenter', enter)
      hit.removeEventListener('pointerleave', leave)
    }
  })
  window.addEventListener('pointermove', onMove, { passive: true })

  return () => {
    cleanups.forEach((cleanup) => cleanup())
    window.removeEventListener('pointermove', onMove)
    settle.kill()
    frame.remove()
  }
}
