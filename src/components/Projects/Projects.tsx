import ProjectCard from './ProjectCard'
import { projects, projectsHeading } from '../../data/projects'
import type { Project } from '../../data/projects'

/**
 * Bento placement (docs/ui-spec.md §3): a 4-column grid on desktop — the
 * Price Forecasting project (most content: 4 bullets + chart placeholder)
 * gets a 2×2 tile, Kan-Kluay and LINE Chatbot each take 2×1, filling the
 * rectangle with no holes. On tablet it degrades to 2 equal columns, on
 * mobile to a single column (docs/ui-spec.md §4).
 */
function tileClassFor(project: Project): string {
  switch (project.id) {
    case 'price-forecasting':
      return 'lg:col-span-2 lg:row-span-2'
    case 'kan-kluay':
      return 'lg:col-span-2'
    case 'line-chatbot-rag':
      return 'lg:col-span-2'
    default:
      return ''
  }
}

/**
 * Projects — docs/content.md §5.
 *
 * Section rhythm (docs/ui-spec.md §1): Hero = Navy, About = White, Skills =
 * Navy, so Projects is White — mirroring About's exact color treatment so the
 * alternation and dark-mode swap stay consistent.
 */
export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-[65px] bg-secondary-light text-primary dark:bg-primary dark:text-secondary-gray"
    >
      {/* Vertical padding: 48px mobile / 96px desktop (docs/ui-spec.md §3). */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-24 lg:px-8">
        <h2
          id="projects-heading"
          className="font-header text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.5rem]"
        >
          {projectsHeading}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} className={tileClassFor(project)} />
          ))}
        </div>
      </div>
    </section>
  )
}
