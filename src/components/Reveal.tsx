import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Stagger index — each step delays entrance by 60ms. */
  order?: number
  className?: string
  as?: 'div' | 'li' | 'section'
}

/**
 * Scroll-triggered entrance. Under prefers-reduced-motion the transform is
 * dropped entirely and the element simply appears.
 */
export function Reveal({ children, order = 0, className, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion()
  const MotionTag = m[as]

  return (
    <MotionTag
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduced ? 0.001 : 0.6,
        delay: reduced ? 0 : order * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  )
}
