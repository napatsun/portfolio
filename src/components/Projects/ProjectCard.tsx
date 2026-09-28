import { lazy, Suspense } from 'react'
import {
  CHAT_DEMO_ARIA_LABEL,
  CHAT_DEMO_CAPTION,
  illustrativeChatDemo,
} from '../../data/chatDemo'
import {
  EQUITY_CURVE_ARIA_LABEL,
  EQUITY_CURVE_CAPTION,
  illustrativeEquityCurve,
} from '../../data/equityCurve'
import type { Project } from '../../data/projects'

// Lazy-loaded so recharts stays out of the initial bundle: the chart sits
// below the fold, and tests.md §3 targets FCP < 2s / Lighthouse ≥ 85.
// ChatDemo rides the same Suspense slot — framer-motion is already in the
// main bundle (Navbar/ThemeToggle), so its split chunk is just the bubbles.
const EquityCurveChart = lazy(() => import('./EquityCurveChart'))
const ChatDemo = lazy(() => import('./ChatDemo'))

interface ProjectCardProps {
  project: Project
  /** Extra placement classes from the bento grid, e.g. `lg:col-span-2`. */
  className?: string
}

/** Maps a project's declared visualization kind to its real component. */
function Visualization({ kind }: { kind: NonNullable<Project['visualization']>['kind'] }) {
  switch (kind) {
    case 'equity-curve':
      return (
        <EquityCurveChart
          data={illustrativeEquityCurve}
          ariaLabel={EQUITY_CURVE_ARIA_LABEL}
          caption={EQUITY_CURVE_CAPTION}
        />
      )
    case 'chat-demo':
      return (
        <ChatDemo
          messages={illustrativeChatDemo}
          ariaLabel={CHAT_DEMO_ARIA_LABEL}
          caption={CHAT_DEMO_CAPTION}
        />
      )
    default:
      return null
  }
}

/** Neutral skeleton shown while a lazily-imported visualization chunk loads. */
function ChartSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading visualization"
      className="flex min-h-[160px] flex-1 items-center justify-center rounded-lg border border-dashed border-primary/20 p-4 dark:border-secondary-light/15"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-primary/70 dark:text-secondary-gray/60">
        Loading visualization…
      </p>
    </div>
  )
}

const tagBase =
  'inline-flex rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 font-mono text-sm text-primary/80 transition-colors duration-300 hover:border-accent/60 dark:border-secondary-light/20 dark:bg-secondary-light/5 dark:text-secondary-gray'

/**
 * ProjectCard — docs/ui-spec.md §6 "Project card" and §5.2 hover spec:
 * a translucent gradient sweeps across the card (pseudo-element, so no extra
 * DOM), the card scales slightly, and a soft gold-tinted shadow appears.
 * The scale lives in `.card-lift` (global.css: hover-capable pointers and
 * no-preference motion only) so touch taps can't stick it and leak visual
 * overflow into page scroll (Bug 1).
 *
 * Gold stays inside the 10% accent budget: bullet markers, the hover shadow,
 * and the link focus ring — never a solid fill (docs/ui-spec.md §1).
 *
 * Links: content.md §5 supplies real GitHub URLs; when a URL is absent the
 * link is simply not rendered — no dead/invented links (agent.md §2).
 */
export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <article
      className={`group card-lift relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-[0_12px_40px_-12px_rgba(237,174,23,0.35)] focus-within:border-accent/50 dark:border-secondary-light/15 dark:bg-secondary-light/[0.04] ${className}`}
    >
      {/* Glass/reflection sweep — ui-spec §5.2. Overlay-only; pointer-events
          none keeps links clickable underneath. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/[0.07] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/10 motion-safe:transition-transform"
      />

      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-header text-xl font-semibold leading-snug text-primary dark:text-secondary-light">
          {project.title}
        </h3>
        <span className="shrink-0 font-mono text-sm text-primary/70 dark:text-accent">
          {project.year}
        </span>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Technologies used in ${project.title}`}>
        {project.tags.map((tag) => (
          <li key={tag}>
            <span className={tagBase} title={tag}>
              {tag}
            </span>
          </li>
        ))}
      </ul>

      <ul className="mt-4 list-outside list-disc space-y-2 pl-5 text-sm leading-relaxed text-primary/80 marker:text-accent dark:text-secondary-gray/85">
        {project.description.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      {/* Visualization slot: the real visualization when the project declares
          one, otherwise a neutral placeholder (no fabricated data, spec §6). */}
      {project.needsVisualization && (
        <div className="mt-5 flex min-h-[180px] flex-1 flex-col rounded-xl border border-primary/15 bg-primary/[0.03] p-3 dark:border-secondary-light/15 dark:bg-secondary-light/[0.03]">
          {project.visualization ? (
            <Suspense fallback={<ChartSkeleton />}>
              <Visualization kind={project.visualization.kind} />
            </Suspense>
          ) : (
            <div className="flex min-h-[140px] flex-1 items-center justify-center rounded-lg border border-dashed border-primary/25 p-4 text-center dark:border-secondary-light/20">
              <p className="font-mono text-xs uppercase tracking-wider text-primary/70 dark:text-secondary-gray/60">
                Interactive visualization — coming soon
              </p>
            </div>
          )}
        </div>
      )}

      {project.githubUrl && (
        <div className="mt-6 pt-2">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open the GitHub repository for ${project.title} (opens in a new tab)`}
            className="inline-flex items-center gap-1.5 rounded font-body text-sm font-semibold text-primary underline-offset-4 transition-colors duration-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-accent dark:focus-visible:ring-offset-primary"
          >
            GitHub
            <span aria-hidden="true" className="font-mono">
              ↗
            </span>
          </a>
        </div>
      )}
    </article>
  )
}
