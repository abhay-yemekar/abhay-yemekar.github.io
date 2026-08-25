import { domAnimation, LazyMotion } from 'motion/react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Credentials } from './components/Credentials'
import { Experience } from './components/Experience'
import { FeaturedProjects } from './components/FeaturedProjects'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { MoreProjects } from './components/MoreProjects'
import { Nav } from './components/Nav'
import { Skills } from './components/Skills'

export function App() {
  return (
    <>
      {/* First focusable element in the DOM. */}
      <a
        href="#main"
        className="u-label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded focus:border focus:border-accent focus:bg-bg-elev focus:px-4 focus:py-2.5 focus:text-accent"
      >
        Skip to content
      </a>

      <Nav />

      {/*
       * domAnimation carries animations, gestures and whileInView, but not drag
       * or layout projection — neither of which this site uses, and together
       * they are the bulk of motion's weight. `strict` makes a stray `motion.*`
       * import throw instead of silently pulling the full bundle back in.
       */}
      <LazyMotion features={domAnimation} strict>
        <main id="main">
          <Hero />
          <About />
          <Experience />
          <FeaturedProjects />
          <MoreProjects />
          <Skills />
          <Credentials />
          <Contact />
        </main>
      </LazyMotion>

      <Footer />
    </>
  )
}
