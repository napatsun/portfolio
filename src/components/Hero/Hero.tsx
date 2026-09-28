import { heroActions, heroContent } from '../../data/hero'
import { useScrollToSection } from '../../hooks/useScrollToSection'
import NeuralNetwork from './NeuralNetwork'

const ctaBase =
  'inline-flex items-center justify-center rounded-full px-7 py-3 font-body text-base font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary dark:focus-visible:ring-offset-[#001631]'

const ctaStyles = [
  'bg-accent text-primary hover:bg-accent/90',
  'border border-accent/60 text-secondary-light hover:bg-accent/10 hover:text-accent',
]

/**
 * Hero — docs/content.md §2. Navy background per the section rhythm in
 * docs/ui-spec.md §1 (Hero = Navy). The `<h1>` lives here so the page keeps a
 * single, correctly-ordered top-level heading.
 */
export default function Hero() {
  const scrollToSection = useScrollToSection()

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-primary text-secondary-light dark:bg-[#001631]"
    >
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-8">
        <div className="max-w-2xl">
          <h1
            id="hero-heading"
            className="font-header text-4xl font-bold leading-tight text-secondary-light sm:text-5xl lg:text-[4.25rem]"
          >
            {heroContent.headline}
          </h1>

          <p className="mt-6 font-body text-lg font-medium text-accent sm:text-xl">
            {heroContent.subheadline}
          </p>

          <p className="mt-4 font-body text-base text-secondary-gray/80 sm:text-lg">
            {heroContent.tagline}
          </p>

          {/* Stacked on mobile, side-by-side from `sm` up (ui-spec §4). */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            {heroActions.map((action, index) => (
              <button
                key={action.targetId}
                type="button"
                onClick={() => scrollToSection(action.targetId)}
                className={`${ctaBase} ${ctaStyles[index]}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <NeuralNetwork className="mx-auto max-w-md lg:max-w-none" />
      </div>
    </section>
  )
}
