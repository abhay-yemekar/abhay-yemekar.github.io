import type { CSSProperties } from 'react'

/**
 * Names an element for a cross-document view transition, so a project's name
 * morphs between the page you leave and the page you land on (the work index
 * or the 404 list → the case-study title, and the "Next" link → the next title).
 *
 * Use it with className "vt" on an inline-block element: a name on an inline
 * box that wraps across lines would make the browser skip the whole transition.
 * motion.css applies the name only while <html data-motion="on">.
 */
export const vt = (slug: string) => ({ '--vt': `cs-${slug}` }) as CSSProperties
