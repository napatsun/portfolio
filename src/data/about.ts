/**
 * About content — source: docs/content.md §3 "About Section".
 *
 * The source doc gives only the heading and the two paragraphs below. §3
 * carries no `[TODO: ...]` marker of its own, and it contains no scholarship,
 * internship, award, or publication details — so none may be invented. If
 * docs/content.md later adds a `[TODO: ...]` for this section, reproduce it
 * here as a marker rather than filling it in.
 */

export interface AboutTextRun {
  text: string
  /** Rendered as <strong>; mirrors the **emphasis** in content.md §3. */
  emphasis?: boolean
}

export const aboutHeading = 'About Me'

export const aboutParagraphs: AboutTextRun[][] = [
  [
    {
      text: "My name is Napat Kasemweerasan, and I'm currently studying Computer Engineering at King Mongkut's University of Technology Thonburi (KMUTT).",
    },
  ],
  [
    { text: 'My core interests lie at the intersection of ' },
    { text: 'Computer Engineering', emphasis: true },
    { text: ', ' },
    { text: 'Machine Learning', emphasis: true },
    { text: ', and ' },
    { text: 'Quantitative Finance', emphasis: true },
    {
      text: ' — I believe that understanding both systems engineering and data modeling is key to building systems that aren\'t just "accurate," but genuinely "usable" in a financial world where data is constantly changing.',
    },
  ],
]
