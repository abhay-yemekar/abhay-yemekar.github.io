/**
 * The hero's WebGL particle field (OGL): the name, sampled from the SVG
 * wordmark's own <text> elements, assembles out of a curl-noise flow and moves
 * aside for the cursor.
 *
 * It only ever replaces a decorative layer. The SVG wordmark stays in the HTML
 * and is crossfaded back whenever this stops: motion paused, WebGL lost, or the
 * layer torn down.
 *
 * Cost control:
 * - 18k points on desktop, 6k on phones; device pixel ratio capped at 1.5 / 1.25
 * - paused off screen and in background tabs
 * - about 30 fps once the name has assembled and the pointer is still
 */
import { gsap } from 'gsap'
import { Geometry, Mesh, Program, Renderer } from 'ogl'

const VERTEX = /* glsl */ `
attribute vec2 target;
attribute vec2 start;
attribute float seed;

uniform float uTime;
uniform float uProgress;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uForce;
uniform float uSize;
uniform float uDpr;
uniform float uScroll;

varying float vSeed;
varying float vLife;

// 2D simplex noise: Ian McEwan, Ashima Arts (MIT licence).
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// The curl of the noise: a divergence-free flow, so particles swirl, never clump.
vec2 curl(vec2 p) {
  const float e = 0.01;
  float a = snoise(p + vec2(0.0, e)) - snoise(p - vec2(0.0, e));
  float b = snoise(p + vec2(e, 0.0)) - snoise(p - vec2(e, 0.0));
  return vec2(a, -b) / (2.0 * e);
}

void main() {
  // Each particle leaves on its own beat, so the name assembles as a wave.
  float t = clamp((uProgress - seed * 0.4) / 0.6, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - t, 3.0);
  vec2 p = mix(start, target, e);

  vec2 flow = curl(p * 0.0035 + vec2(uTime * 0.04, seed * 0.5));
  p += flow * mix(70.0, 0.8, e);

  // Scrolling past the hero lets the name go: particles drift back toward
  // their scattered starts and up, carried by the flow.
  float s = uScroll * uScroll;
  p += (start - target) * s * 0.35 + flow * s * 90.0 + vec2(0.0, -140.0 * s * (0.4 + seed));

  vec2 d = p - uMouse;
  float dist = length(d);
  float push = uForce * (1.0 - smoothstep(0.0, 120.0, dist));
  p += (d / max(dist, 0.001)) * push * 42.0 + flow * push * 10.0;

  vSeed = seed;
  // Depth: some particles sit dimmer, and each one breathes on its own phase.
  float depth = 0.55 + 0.45 * fract(seed * 3.7);
  float breathe = 0.8 + 0.2 * sin(uTime * 1.6 + seed * 50.0);
  vLife = (0.35 + 0.65 * e) * depth * breathe * (1.0 - s * 0.85);
  vec2 clip = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = uSize * uDpr * (0.75 + fract(seed * 13.7) * 0.5);
}
`

const FRAGMENT = /* glsl */ `
precision mediump float;

uniform vec3 uColor;
uniform vec3 uAccent;

varying float vSeed;
varying float vLife;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float a = (1.0 - smoothstep(0.2, 0.5, length(c))) * vLife;
  // About one particle in seventeen is amber: the evidence colour, scattered.
  vec3 col = fract(vSeed * 7.31) > 0.94 ? uAccent : uColor;
  gl_FragColor = vec4(col * a, a);
}
`

type Rgb = [number, number, number]

function hexToRgb(value: string): Rgb {
  let hex = value.trim().replace('#', '')
  if (hex.length === 3) hex = hex.replace(/./g, (c) => c + c)
  const n = Number.parseInt(hex, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/**
 * Fills the wordmark's glyph paths into a 2D canvas, at the size and place
 * they occupy on screen, and returns about `count` points inside them, in
 * hero-relative CSS pixels. Path2D takes the same path data the SVG draws, so
 * the particles land exactly on the static wordmark.
 */
function sample(svg: SVGSVGElement, hero: DOMRect, count: number): Float32Array {
  const box = svg.getBoundingClientRect()
  const view = svg.viewBox.baseVal
  const k = box.width / view.width
  const w = Math.ceil(box.width)
  const h = Math.ceil(box.height)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return new Float32Array()

  ctx.fillStyle = '#fff'
  for (const path of svg.querySelectorAll('path')) {
    const [tx = 0, ty = 0] = (path.getAttribute('transform')?.match(/-?[\d.]+/g) ?? []).map(Number)
    ctx.setTransform(k, 0, 0, k, (tx - view.x) * k, (ty - view.y) * k)
    ctx.fill(new Path2D(path.getAttribute('d') ?? ''))
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  const { data } = ctx.getImageData(0, 0, w, h)
  let filled = 0
  for (let i = 3; i < data.length; i += 16) if (data[i]! > 127) filled++
  const step = Math.max(1, Math.sqrt((filled * 4) / count))

  const points: number[] = []
  const ox = box.left - hero.left
  const oy = box.top - hero.top
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      // One random point per grid cell: even density, no visible lattice.
      const jx = x + (Math.random() - 0.5) * step
      const jy = y + (Math.random() - 0.5) * step
      const px = Math.min(w - 1, Math.max(0, Math.floor(jx)))
      const py = Math.min(h - 1, Math.max(0, Math.floor(jy)))
      if (data[(py * w + px) * 4 + 3]! > 127) points.push(jx + ox, jy + oy)
    }
  }
  return new Float32Array(points)
}

export async function initParticles(hero: HTMLElement): Promise<() => void> {
  const canvas = hero.querySelector<HTMLCanvasElement>('[data-particles]')
  const wordmarks = [...hero.querySelectorAll<SVGSVGElement>('[data-wordmark]')]
  if (!canvas || wordmarks.length === 0) return () => {}

  // OGL's Renderer throws when no WebGL context can be made, before its own
  // check runs, so probe on a scratch canvas first. The probe's context is
  // released at once.
  const probe = document.createElement('canvas')
  const probeGl = probe.getContext('webgl2') ?? probe.getContext('webgl')
  if (!probeGl) return () => {}
  probeGl.getExtension('WEBGL_lose_context')?.loseContext()

  const phone = matchMedia('(max-width: 767px)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, phone ? 1.25 : 1.5)
  let renderer: Renderer
  try {
    renderer = new Renderer({ canvas, dpr, alpha: true, premultipliedAlpha: true, antialias: false, depth: false })
  } catch {
    return () => {}
  }
  const gl = renderer.gl
  if (!gl) return () => {}
  gl.clearColor(0, 0, 0, 0)

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uRes: { value: [1, 1] },
    uMouse: { value: [-1e4, -1e4] },
    uForce: { value: 0 },
    uSize: { value: phone ? 1.9 : 2 },
    uDpr: { value: dpr },
    uScroll: { value: 0 },
    uColor: { value: [1, 1, 1] as Rgb },
    uAccent: { value: [1, 0.7, 0.3] as Rgb },
  }
  const program = new Program(gl, {
    vertex: VERTEX,
    fragment: FRAGMENT,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  })
  let mesh: Mesh | undefined
  let built = { width: 0, height: 0 }

  const applyTheme = () => {
    const css = getComputedStyle(document.documentElement)
    uniforms.uColor.value = hexToRgb(css.getPropertyValue('--color-fg'))
    uniforms.uAccent.value = hexToRgb(css.getPropertyValue('--color-mark'))
    // Light points add up to white on a light page, so paper gets ordinary blending.
    if (document.documentElement.dataset.theme === 'light') program.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    else program.setBlendFunc(gl.ONE, gl.ONE)
  }

  const build = () => {
    const rect = hero.getBoundingClientRect()
    const svg = wordmarks.find((el) => el.getBoundingClientRect().width > 0)
    if (!svg || rect.width === 0) return false
    renderer.setSize(rect.width, rect.height)
    uniforms.uRes.value = [rect.width, rect.height]
    built = { width: rect.width, height: rect.height }

    const target = sample(svg, rect, phone ? 6000 : 18000)
    const n = target.length / 2
    if (n === 0) return false
    const start = new Float32Array(n * 2)
    const seed = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      start[i * 2] = Math.random() * rect.width
      start[i * 2 + 1] = Math.random() * rect.height
      seed[i] = Math.random()
    }
    mesh?.geometry.remove()
    const geometry = new Geometry(gl, {
      target: { size: 2, data: target },
      start: { size: 2, data: start },
      seed: { size: 1, data: seed },
    })
    mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program })
    return true
  }

  applyTheme()
  if (!build()) {
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return () => {}
  }

  // Render loop: full rate while anything moves, about 30 fps once it settles.
  const mouse = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 }
  let force = 0
  let forceTarget = 0
  let lastInput = performance.now()
  let last = 0
  let raf = 0
  let onScreen = true
  const t0 = performance.now()

  const draw = (now: number) => {
    const rect = hero.getBoundingClientRect()
    const scroll = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.7)))
    if (Math.abs(scroll - uniforms.uScroll.value) > 0.001) lastInput = now
    uniforms.uScroll.value = scroll
    mouse.x += (mouse.tx - mouse.x) * 0.18
    mouse.y += (mouse.ty - mouse.y) * 0.18
    force += (forceTarget - force) * 0.08
    uniforms.uMouse.value = [mouse.x, mouse.y]
    uniforms.uForce.value = force
    uniforms.uTime.value = (now - t0) / 1000
    if (mesh) renderer.render({ scene: mesh })
  }
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    const settled = uniforms.uProgress.value >= 1 && now - lastInput > 2500 && force < 0.01
    if (settled && now - last < 33) return
    last = now
    draw(now)
  }
  const play = () => {
    if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(frame)
  }
  const pause = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }

  // Enter: the full assembly while the intro holds the wordmark back,
  // otherwise a short dissolve-and-settle over the visible wordmark.
  const shown = wordmarks.filter((el) => el.getBoundingClientRect().width > 0)
  const assembling = shown.every((el) => Number(getComputedStyle(el).opacity) < 0.5)
  uniforms.uProgress.value = assembling ? 0 : 0.78
  hero.dataset.gl = 'on'
  gsap.to(canvas, { opacity: 1, duration: assembling ? 0.3 : 0.8, ease: 'power1.out' })
  gsap.to(wordmarks, { opacity: 0, duration: assembling ? 0.01 : 0.8, ease: 'power1.out' })
  const assemble = gsap.to(uniforms.uProgress, {
    value: 1,
    duration: assembling ? 2.6 : 1.4,
    delay: assembling ? 0.1 : 0,
    ease: assembling ? 'power2.out' : 'power1.out',
  })
  play()

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    const rect = hero.getBoundingClientRect()
    mouse.tx = event.clientX - rect.left
    mouse.ty = event.clientY - rect.top
    if (mouse.x < -1e3) {
      mouse.x = mouse.tx
      mouse.y = mouse.ty
    }
    forceTarget = 1
    lastInput = performance.now()
  }
  const onLeave = () => {
    forceTarget = 0
    lastInput = performance.now()
  }
  // Touch: a ripple from the tap, since there's no hover to follow.
  const onDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') return
    const rect = hero.getBoundingClientRect()
    mouse.x = mouse.tx = event.clientX - rect.left
    mouse.y = mouse.ty = event.clientY - rect.top
    force = 1.4
    forceTarget = 0
    lastInput = performance.now()
  }
  hero.addEventListener('pointermove', onMove, { passive: true })
  hero.addEventListener('pointerleave', onLeave)
  hero.addEventListener('pointerdown', onDown, { passive: true })

  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? true
    if (onScreen) play()
    else pause()
  })
  io.observe(hero)

  const onVisibility = () => (document.hidden ? pause() : play())
  document.addEventListener('visibilitychange', onVisibility)

  let resizeTimer = 0
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      const rect = hero.getBoundingClientRect()
      if (rect.width === built.width && rect.height === built.height) return
      // A new layout means new targets; skip the assembly and show the name.
      if (build()) {
        uniforms.uProgress.value = 1
        assemble.progress(1)
        draw(performance.now())
      }
    }, 180)
  })
  ro.observe(hero)

  // Recolour after the theme switch has painted: done inside the click it
  // added a full redraw to the toggle's interaction (INP).
  const mo = new MutationObserver(() =>
    requestAnimationFrame(() =>
      setTimeout(() => {
        applyTheme()
        draw(performance.now())
      }),
    ),
  )
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  let disposed = false
  const teardown = () => {
    if (disposed) return
    disposed = true
    pause()
    assemble.kill()
    io.disconnect()
    ro.disconnect()
    mo.disconnect()
    clearTimeout(resizeTimer)
    hero.removeEventListener('pointermove', onMove)
    hero.removeEventListener('pointerleave', onLeave)
    hero.removeEventListener('pointerdown', onDown)
    document.removeEventListener('visibilitychange', onVisibility)
    delete hero.dataset.gl
    gsap.to(wordmarks, { opacity: 1, duration: 0.5, onComplete: () => gsap.set(wordmarks, { clearProps: 'opacity' }) })
    gsap.to(canvas, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        gl.getExtension('WEBGL_lose_context')?.loseContext()
        // A lost context can't be revived, so a later start gets a fresh canvas.
        canvas.replaceWith(canvas.cloneNode())
      },
    })
  }

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault()
    teardown()
  })

  return teardown
}
