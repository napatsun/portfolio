/**
 * Hero content — source: docs/content.md §2 "Hero Section".
 * Text is verbatim from the source doc; do not paraphrase.
 */
export interface HeroAction {
  label: string
  /** id of the section this CTA scrolls to. */
  targetId: string
}

export const heroContent = {
  headline: 'Napat Kasemweerasan',
  subheadline:
    'Computer Engineering Student — Bridging Engineering, Machine Learning & Quantitative Finance',
  tagline:
    'A Computer Engineering student passionate about applying Machine Learning to Quantitative Finance, in order to uncover patterns and generate value from data.',
} as const

export const heroActions: HeroAction[] = [
  { label: 'View Projects', targetId: 'projects' },
  { label: 'Contact Me', targetId: 'contact' },
]
