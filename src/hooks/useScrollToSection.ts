import { useCallback } from 'react'

/**
 * Shared smooth-scroll helper (docs/ui-spec.md §3).
 *
 * Uses native `scrollIntoView` rather than react-scroll, since react-scroll is
 * not a project dependency. Target sections carry `scroll-mt-[65px]` — the
 * sticky Navbar's exact rendered height (h-16 content + 1px border-b) — so
 * sections land just below the bar instead of tucking under it.
 */
export function useScrollToSection() {
  return useCallback((sectionId: string) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])
}
