/**
 * Contact content — source: docs/content.md §6 "Contact Section".
 *
 * Heading, intro text, and channel URLs are verbatim from the source doc;
 * do not paraphrase, reorder, or add entries (agent.md §2 "Never invent
 * content"). Display labels ("Name", "Email", "Message", "Send") also come
 * from the form spec in the same section.
 */

export interface ContactChannel {
  /** Channel name, e.g. "Email". */
  label: string
  /** Text shown for the link. */
  value: string
  /** Link target — `mailto:` for email, https for the rest. */
  href: string
  /** Whether the link leaves this site (opens in a new tab). */
  external: boolean
}

export const contactHeading = 'Get in Touch'

export const contactIntro =
  'Interested in collaborating, want to talk about a project, or just want to say hi? Reach out to me through the channels below.'

export const contactChannels: ContactChannel[] = [
  {
    label: 'Email',
    value: 'sunnapat1689@gmail.com',
    href: 'mailto:sunnapat1689@gmail.com',
    external: false,
  },
  {
    label: 'GitHub',
    value: 'https://github.com/napatsun',
    href: 'https://github.com/napatsun',
    external: true,
  },
  {
    label: 'LinkedIn',
    value: 'https://www.linkedin.com/in/napat-kasemweerasan-32a444358/',
    href: 'https://www.linkedin.com/in/napat-kasemweerasan-32a444358/',
    external: true,
  },
]

/** Form field labels, verbatim from content.md §6 ("Send button" → "Send"). */
export const contactFormLabels = {
  name: 'Name',
  email: 'Email',
  message: 'Message',
  send: 'Send',
} as const
