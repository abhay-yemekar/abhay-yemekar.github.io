import { featuredProjects } from '../data/projects'
import { sections } from '../data/sections'
import { ProjectCard } from './ProjectCard'
import { SectionShell } from './SectionShell'

export function FeaturedProjects() {
  return (
    <SectionShell section={sections.work}>
      {/* Asymmetric on purpose: the two shipped products get full width; the two
          build-outs pair up. Keep the 'half' cards to an even count. */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {featuredProjects.map((project, i) => (
          <div
            key={project.slug}
            className={project.span === 'wide' ? 'lg:col-span-2' : undefined}
          >
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
