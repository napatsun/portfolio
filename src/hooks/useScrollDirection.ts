import { useEffect, useState } from 'react'

export type ScrollDirection = 'up' | 'down'

interface UseScrollDirectionOptions {
  /** Minimum scroll delta (px) before a direction change is registered. */
  threshold?: number
  /** scrollY below this counts as "at the top" (navbar always shown). */
  topOffset?: number
  /** scrollY above this marks the page as scrolled (enables the blur backdrop). */
  scrolledOffset?: number
}

/**
 * Detects scroll direction so the Navbar can hide on scroll-down and reveal on
 * scroll-up (docs/ui-spec.md §3). A single passive, rAF-throttled listener is
 * used for all three signals.
 */
export function useScrollDirection({
  threshold = 8,
  topOffset = 50,
  scrolledOffset = 8,
}: UseScrollDirectionOptions = {}) {
  const [direction, setDirection] = useState<ScrollDirection>('up')
  // Initialized from the live scroll position (not hardcoded): on a fresh
  // load this is scrollY≈0 → visible navbar on the very first paint, with no
  // scroll event needed to "wake up" the state; on a browser-restored
  // mid-page reload it starts correct too (the mount effect below then keeps
  // it live). 'up' stays the safe direction default (navbar visible).
  const [isAtTop, setIsAtTop] = useState<boolean>(
    () => typeof window === 'undefined' || window.scrollY < topOffset,
  )
  const [isScrolled, setIsScrolled] = useState<boolean>(
    () => typeof window !== 'undefined' && window.scrollY > scrolledOffset,
  )

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY
      const atTop = y < topOffset

      setIsAtTop(atTop)
      setIsScrolled(y > scrolledOffset)

      if (atTop) {
        // Near the top the navbar is always visible, regardless of direction.
        setDirection('up')
      } else if (Math.abs(delta) >= threshold) {
        setDirection(delta > 0 ? 'down' : 'up')
      }

      lastY = y
    }

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [threshold, topOffset, scrolledOffset])

  return {
    direction,
    isAtTop,
    isScrolled,
    /** Hide only when scrolling down and not near the top. */
    isVisible: isAtTop || direction === 'up',
  }
}
