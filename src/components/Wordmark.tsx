import { capHeight, wordmark, type WordmarkLine } from '../data/wordmark'

/** Line gap in the stacked (phone) wordmark, as a fraction of the cap height. */
const STACK_GAP = 0.22

function Dots({ id, step, r }: { id: string; step: number; r: number }) {
  return (
    <defs>
      <pattern id={id} width={step} height={step} patternUnits="userSpaceOnUse">
        <circle cx={step / 2} cy={step / 2} r={r} fill="currentColor" />
      </pattern>
    </defs>
  )
}

function Glyphs({ line, baseline, fill }: { line: WordmarkLine; baseline: number; fill: string }) {
  return (
    <>
      {line.glyphs.map((glyph, i) => (
        <path key={i} d={glyph.d} transform={`translate(${glyph.x} ${baseline})`} fill={fill} />
      ))}
    </>
  )
}

/**
 * The name as a giant dot-matrix wordmark: the static form of the WebGL
 * particle field (src/client/motion/hero-particles.ts), which samples these
 * same paths and takes over once it runs.
 *
 * The glyphs are outlines (src/data/wordmark.ts, from scripts/gen-wordmark.py),
 * not <text>. Chrome counts SVG text as an LCP candidate, so text here would
 * take LCP from the <h1>. Paths also need no font, so there's nothing to swap.
 *
 * Decorative: aria-hidden, since the name is the nav's first link.
 */
export function Wordmark() {
  const wide = wordmark.wide
  const stackHeight = capHeight * (2 + STACK_GAP)
  // Dots of roughly the same on-screen size at both widths.
  const wideStep = wide.width / 300
  const stackStep = wordmark.last.width / 110

  return (
    <>
      <svg
        className="wordmark hidden w-full overflow-visible md:block"
        viewBox={`0 ${-capHeight} ${wide.width} ${capHeight}`}
        aria-hidden="true"
        focusable="false"
        data-intro="wordmark"
        data-wordmark
      >
        <Dots id="wm-dots-wide" step={wideStep} r={wideStep * 0.33} />
        <Glyphs line={wide} baseline={0} fill="url(#wm-dots-wide)" />
      </svg>
      <svg
        className="wordmark block w-full overflow-visible md:hidden"
        viewBox={`0 ${-capHeight} ${wordmark.last.width} ${stackHeight}`}
        aria-hidden="true"
        focusable="false"
        data-intro="wordmark"
        data-wordmark
      >
        <Dots id="wm-dots-stack" step={stackStep} r={stackStep * 0.33} />
        <Glyphs line={wordmark.first} baseline={0} fill="url(#wm-dots-stack)" />
        <Glyphs line={wordmark.last} baseline={capHeight * (1 + STACK_GAP)} fill="url(#wm-dots-stack)" />
      </svg>
    </>
  )
}
