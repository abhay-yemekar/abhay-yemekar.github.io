import { About } from '../components/About'
import { Education } from '../components/Education'
import { Experience } from '../components/Experience'
import { FeaturedProjects } from '../components/FeaturedProjects'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Nav } from '../components/Nav'
import { Skills } from '../components/Skills'
import { SkipLink } from '../components/SkipLink'

/** The v4 order (docs/V4-PLAN.md): who, then the work, then the record. The footer is the contact. */
export function HomePage() {
  return (
    <>
      <SkipLink />
      <Nav page="home" />
      <main id="main">
        <Hero />
        <About />
        <FeaturedProjects />
        <Experience />
        <Education />
        <Skills />
      </main>
      <Footer page="home" />
    </>
  )
}
