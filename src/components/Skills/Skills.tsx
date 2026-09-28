import { skillCategories, skillsHeading } from '../../data/skills'

/**
 * Skills — docs/content.md §4 "Skills / Tech Stack Section".
 *
 * Section rhythm (docs/ui-spec.md §1): Hero = Navy, About = White, so Skills
 * is Navy, using Hero's exact dark-mode shade. Tag display follows content.md
 * §4's note ("icon/badge ต่อรายการ … พร้อม progress bar หรือ tag แบบ pill"):
 * pill tags were chosen over progress bars because the doc contains no skill
 * proficiency data to source bars from (agent.md §2 "Never invent content").
 *
 * Gold stays at the ~10% budget of the 60/30/10 rule (docs/ui-spec.md §1):
 * a thin category divider, tag hover borders, and focus rings only — never a
 * solid tag fill.
 *
 * Typography (docs/ui-spec.md §2): JetBrains Mono for technology tags,
 * Playfair Display for headings via the global h2/h3 rule.
 */
export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="scroll-mt-[65px] bg-primary text-secondary-light dark:bg-[#001631]"
    >
      {/* Vertical padding: 48px mobile / 96px desktop (docs/ui-spec.md §3). */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-24 lg:px-8">
        <h2
          id="skills-heading"
          className="font-header text-3xl font-semibold leading-tight text-secondary-light sm:text-4xl lg:text-[2.5rem]"
        >
          {skillsHeading}
        </h2>

        {/* Single column on mobile, 2 columns on large screens (docs/ui-spec.md §4). */}
        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:gap-x-16">
          {skillCategories.map((skillCategory) => (
            <div key={skillCategory.category}>
              <h3 className="font-header text-xl font-semibold text-secondary-light lg:text-[1.75rem]">
                {skillCategory.category}
              </h3>

              {/* Gold used sparingly: a thin accent rule per the 60/30/10 ratio. */}
              <div className="mt-3 h-px w-12 bg-accent" aria-hidden="true" />

              <ul className="mt-4 flex flex-wrap gap-2" aria-label={skillCategory.category}>
                {skillCategory.items.map((item) => (
                  <li key={item}>
                    <span
                      className="inline-flex rounded-full border border-secondary-light/20 bg-secondary-light/5 px-3.5 py-1.5 font-mono text-sm text-secondary-gray transition-colors duration-300 hover:border-accent/60 hover:text-secondary-light"
                      title={item}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
