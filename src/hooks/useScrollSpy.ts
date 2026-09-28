import { useEffect, useState } from 'react'

/**
 * Tracks which of the given section IDs is currently the most visible in the
 * viewport, using an IntersectionObserver.
 *
 * Visibility is measured in visible pixels (not intersectionRatio) so that
 * sections taller than the viewport are still selected correctly.
 */
export function useScrollSpy(sectionIds: readonly string[]): string {
  const [activeId, setActiveId] = useState<string>(() => sectionIds[0] ?? '')

  // Join to a primitive so an inline array literal at the call site does not
  // re-subscribe the observer on every render.
  const idsKey = sectionIds.join('|')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const elements = idsKey
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const visiblePixels = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visiblePixels.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRect.height : 0,
          )
        }

        let nextActiveId = ''
        let maxVisible = 0
        for (const [id, pixels] of visiblePixels) {
          if (pixels > maxVisible) {
            maxVisible = pixels
            nextActiveId = id
          }
        }

        if (nextActiveId) {
          setActiveId(nextActiveId)
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [idsKey])

  return activeId
}
