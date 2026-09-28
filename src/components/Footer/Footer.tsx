import { CodeXml, Globe, Mail } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { contactChannels } from '../../data/contact'
import { footerText } from '../../data/footer'

/** Same generic glyphs as Contact — lucide-react ships no brand icons. */
const channelIcons: Record<string, LucideIcon> = {
  Email: Mail,
  GitHub: CodeXml,
  LinkedIn: Globe,
}

/**
 * Footer — docs/content.md §7.
 *
 * Understated closing bar: the darker navy `#001631` (already the dark-mode
 * Navy token from ui-spec §1, so no new colors) sets it apart from Contact's
 * `bg-primary` while keeping the Navy flow. Constant across themes —
 * footers don't need a light variant.
 *
 * No heading here: this is not a content section, so nothing disturbs the
 * h1→h2→h3 hierarchy (tests.md §5). The icon row reuses `contactChannels`
 * for compact reachability — it duplicates no Contact content (no intro,
 * no form), just the three links as icon buttons with accessible names.
 */
export default function Footer() {
  return (
    <footer className="bg-[#001631] text-secondary-gray">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-8">
        <p className="font-body text-sm text-secondary-gray/80">{footerText}</p>

        <ul aria-label="Social links" className="flex items-center gap-2">
          {contactChannels.map((channel) => {
            const Icon = channelIcons[channel.label] ?? Globe
            return (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  {...(channel.external
                    ? {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        'aria-label': `${channel.label} (opens in a new tab)`,
                      }
                    : { 'aria-label': channel.label })}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-secondary-gray/70 transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#001631]"
                >
                  <Icon size={20} aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </footer>
  )
}
