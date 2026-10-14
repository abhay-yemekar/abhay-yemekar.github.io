import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { Experience } from '../components/Experience'
import { FeaturedProjects } from '../components/FeaturedProjects'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { MoreProjects } from '../components/MoreProjects'
import { Nav } from '../components/Nav'
import { Skills } from '../components/Skills'
import { SkipLink } from '../components/SkipLink'

export function HomePage() {
  return (
    <>
      <SkipLink />
      <Nav page="home" />
      <main id="main">
        <Hero />
        <FeaturedProjects />
        <MoreProjects />
        <Experience />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer page="home" />
    </>
  )
}
