import { aboutHeading, aboutParagraphs } from '../../data/about'

/**
 * About — docs/content.md §3.
 *
 * Section rhythm (docs/ui-spec.md §1): Hero = Navy, About = White/Cool Gray.
 * In dark mode the two swap to two different navy shades so the alternation
 * survives. Body copy is Navy on White in light mode, keeping contrast well
 * above WCAG AA (gold is deliberately NOT used for text here — it fails
 * contrast on white).
 */
export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-[65px] bg-secondary-light text-primary dark:bg-primary dark:text-secondary-gray"
    >
      {/* Vertical padding: 48px mobile / 96px desktop (docs/ui-spec.md §3). */}
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-24 lg:px-8">
        <h2
          id="about-heading"
          className="font-header text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.5rem]"
        >
          {aboutHeading}
        </h2>

        <div className="mt-8 space-y-5 font-body text-base leading-relaxed sm:text-lg">
          {aboutParagraphs.map((runs, paragraphIndex) => (
            <p key={paragraphIndex}>
              {runs.map((run, runIndex) =>
                run.emphasis ? (
                  <strong key={runIndex} className="font-semibold">
                    {run.text}
                  </strong>
                ) : (
                  <span key={runIndex}>{run.text}</span>
                ),
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
