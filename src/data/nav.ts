/**
 * Navigation content — source: docs/content.md §1 "Navbar".
 * `id` values must match the `id` of the corresponding page section.
 */
export interface NavItem {
  id: string
  label: string
}

/** content.md offers "NK" or "Napat K."; the wordmark option is used here. */
export const SITE_NAME = 'Napat K.'

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]
