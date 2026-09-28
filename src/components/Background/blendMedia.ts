/**
 * Shared activation gate for the scroll background (step 10, part 1).
 *
 * Kept in a component-free module so App can check it without importing
 * GSAP: the ScrollBackground chunk (GSAP + ScrollTrigger, ~115 kB) is only
 * downloaded on viewports where the effects will actually run. This is the
 * mobile performance gate (agent.md §2, tests.md §3) — not just disabling
 * the animation, but skipping the bytes entirely.
 */

/** Mobile breakpoint — effects off below this (ui-spec §4). */
export const BLEND_MOBILE_QUERY = '(max-width: 639px)'
export const BLEND_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** False on mobile viewports and under prefers-reduced-motion. */
export function isBlendAllowed(): boolean {
  if (typeof window === 'undefined') return false
  return (
    !window.matchMedia(BLEND_MOBILE_QUERY).matches &&
    !window.matchMedia(BLEND_REDUCED_MOTION_QUERY).matches
  )
}
// NOTE (wash-out fix): the dark-mode half of the gate lives in App.tsx /
// ScrollBackground.tsx via useTheme, not here — this module stays
// component-free (no React context) so App can check it without importing
// GSAP.

/** Re-checks the gate on viewport/motion-preference changes. */
export function subscribeBlendAllowedChange(callback: () => void): () => void {
  const mobile = window.matchMedia(BLEND_MOBILE_QUERY)
  const reduced = window.matchMedia(BLEND_REDUCED_MOTION_QUERY)
  mobile.addEventListener('change', callback)
  reduced.addEventListener('change', callback)
  return () => {
    mobile.removeEventListener('change', callback)
    reduced.removeEventListener('change', callback)
  }
}
