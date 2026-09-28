import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { BLEND_MOBILE_QUERY, BLEND_REDUCED_MOTION_QUERY } from './blendMedia'

gsap.registerPlugin(ScrollTrigger)

/** Sections in page order — palette entries align by index. */
const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'contact'] as const

/**
 * Data-driven transition map: arriving INTO a listed section tweens the wash
 * over TRANSITION_S; arriving anywhere else snaps instantly (hard-cut
 * boundaries keep their own solid backgrounds anyway — see the `.bg-blend`
 * rules in global.css). Add or remove an incoming section id here to change
 * which transitions animate — no per-section branching needed.
 */
const SMOOTH_INTO: ReadonlySet<string> = new Set(['about', 'skills'])

/** Section bg colors, light mode — mirrors each section's bg-* class. */
const LIGHT_PALETTE = ['#002856', '#FFFFFF', '#002856', '#FFFFFF', '#002856']

/** Section bg colors, dark mode — mirrors each section's dark:bg-* class. */
const DARK_PALETTE = ['#001631', '#002856', '#001631', '#002856', '#001631']

/** Wash tween length on smooth transitions (ui-spec §5.1: smooth, brief). */
const TRANSITION_S = 0.5

/** Pattern drift range (±25px = 50px total, per ui-spec §5.1 "up to 50px"). */
const PARALLAX_FROM_Y = 25
const PARALLAX_TO_Y = -25

/** Reactive matchMedia hook (listener only — no sync setState, lint-clean). */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = (event: MediaQueryListEvent): void => setMatches(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * Faint gold equation glyphs + equation line art (ui-spec §5.1 math graphics
 * in gold at 5–10% opacity — the wrapping div sets opacity-[0.07]).
 * Glyphs-only: the grid-line layer was removed by design revision, so glyph
 * instances are spread across the canvas to keep coverage without any
 * grid/line structure. Purely decorative: aria-hidden at the layer root.
 */
function PatternArt() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="#EDAE17" strokeWidth="2">
        <path d="M 880 180 C 940 120, 1000 120, 1060 180 S 1180 240, 1240 180" />
        <circle cx="250" cy="680" r="70" />
        <path d="M 250 610 L 250 750 M 180 680 L 320 680" />
      </g>
      <g
        fill="#EDAE17"
        fontSize="30"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
      >
        <text x="120" y="160">∑</text>
        <text x="500" y="140">λ</text>
        <text x="780" y="110">∂</text>
        <text x="1150" y="120">{'e^{iπ}'}</text>
        <text x="700" y="300">∫</text>
        <text x="380" y="580">≈</text>
        <text x="860" y="470">θ</text>
        <text x="1330" y="420">π</text>
        <text x="180" y="430">√x</text>
        <text x="80" y="620">σ</text>
        <text x="1340" y="620">μ</text>
        <text x="980" y="640">φ</text>
        <text x="640" y="760">±</text>
        <text x="420" y="800">Δx</text>
        <text x="1230" y="780">∞</text>
      </g>
    </svg>
  )
}

/**
 * ScrollBackground — step 10, part 1 (ui-spec §5.1 "Background & Scroll
 * Effects"). An ADDITIVE fixed layer behind all content; no section
 * component is edited. Active only when `blendOn` — otherwise renders
 * nothing and sections keep their current hard-cut backgrounds.
 *
 * DARK-MODE ONLY (wash-out fix): the wash is a single flat color shared by
 * the whole viewport, while `bg-blend` makes home/about/skills transparent.
 * In light mode adjacent sections are opposite-tone (Navy ↔ White), so any
 * straddling viewport — settled or mid-tween — is wrong-contrast for one
 * side: during a Hero→About tween the mid-tween light-steel wash collapses
 * white/gold Hero foreground contrast (looks like a white overlay fading the
 * outgoing section) while navy About foreground gains contrast on that same
 * floor. In dark mode every palette entry is a navy tone, so one flat wash
 * is contrast-safe for all-white foregrounds everywhere. Hence the blend
 * runs in dark mode only; light mode keeps the designed solid alternating
 * section bgs (hard-cut boundaries scroll with the content, always correct).
 *
 * DISCRETE state machine (replaces all zone/percentage/settle-snap math,
 * which could strand or flicker partial blends): the wash color is a pure
 * function of `activeSectionId` (shared `useScrollSpy` logic — its own
 * independent instance, Navbar's is untouched). The layer is therefore ever
 * in exactly two states: settled on an exact static color, or briefly
 * tweening between two known endpoints mid-crossing. No third
 * "partial/stale" state exists, so seams are structurally impossible.
 * `bg-blend` on <html> makes the blended sections' backgrounds transparent
 * so the wash shows through (see global.css); hard-cut sections keep their
 * own solid bgs and simply cover the wash.
 * - Pattern: faint gold equation glyphs drifting ±25px with page scroll
 *   (own scrubbed tween on a separate property — never touches the wash).
 * - Theme toggle: palette swap repaints instantly; the brief CSS fade (not a
 *   tween) smooths it per ui-spec §5.4.
 * - Footer keeps its own solid bg (site chrome, excluded from the palette).
 */
export default function ScrollBackground() {
  const { theme } = useTheme()
  const prefersReduced = useMediaQuery(BLEND_REDUCED_MOTION_QUERY)
  const isMobile = useMediaQuery(BLEND_MOBILE_QUERY)
  // Dark-mode gate (wash-out fix): a flat wash is only contrast-safe when
  // every palette entry is same-tone (all-navy dark palette). In light mode
  // the component renders null and sections keep their solid alternating
  // bgs — same code path as mobile / reduced-motion.
  const blendOn = !prefersReduced && !isMobile && theme === 'dark'
  const activeSectionId = useScrollSpy(SECTION_IDS)

  const layerRef = useRef<HTMLDivElement>(null)
  const patternRef = useRef<HTMLDivElement>(null)
  /** True after the first blend build — gates the theme-swap fade. */
  const hasBlendedRef = useRef(false)
  /** Last section the wash painted for — distinguishes a real crossing (tween)
      from a palette-only rebuild like a theme toggle (instant repaint). */
  const paintedIdRef = useRef<string | null>(null)
  /** In-flight transition tween, killed when superseded or unmounted. */
  const washTweenRef = useRef<gsap.core.Tween | null>(null)

  const palette = theme === 'dark' ? DARK_PALETTE : LIGHT_PALETTE
  const activeIndex = SECTION_IDS.findIndex((id) => id === activeSectionId)
  const activeColor = (activeIndex >= 0 ? palette[activeIndex] : undefined) ?? palette[0]

  const paintWash = useCallback(
    (layer: HTMLDivElement, animate: boolean): void => {
      washTweenRef.current?.kill()
      washTweenRef.current = null
      if (animate) {
        washTweenRef.current = gsap.to(layer, {
          backgroundColor: activeColor,
          duration: TRANSITION_S,
          ease: 'power1.inOut',
          overwrite: 'auto',
        })
      } else {
        layer.style.backgroundColor = activeColor
      }
      paintedIdRef.current = activeSectionId
    },
    [activeColor, activeSectionId],
  )

  // Mount + theme: backdrop class, pattern parallax, synchronous initial
  // paint (pre-paint via useLayoutEffect — correct on fresh loads and
  // browser-restored mid-page scroll alike, never a white flash).
  useLayoutEffect(() => {
    if (!blendOn) {
      paintedIdRef.current = null
      return
    }
    const layer = layerRef.current
    if (!layer) return

    document.documentElement.classList.add('bg-blend')

    // Theme-swap smoothing only (skipped on first mount to avoid a
    // transparent→color flash on load).
    let fadeTimer = 0
    if (hasBlendedRef.current) {
      layer.classList.add('theme-fade-blend')
      fadeTimer = window.setTimeout(() => layer.classList.remove('theme-fade-blend'), 600)
    }
    hasBlendedRef.current = true

    const ctx = gsap.context(() => {
      if (patternRef.current) {
        gsap.fromTo(
          patternRef.current,
          { y: PARALLAX_FROM_Y },
          {
            y: PARALLAX_TO_Y,
            ease: 'none',
            scrollTrigger: {
              trigger: document.body,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          },
        )
      }
    })
    ScrollTrigger.refresh()

    return () => {
      window.clearTimeout(fadeTimer)
      washTweenRef.current?.kill()
      washTweenRef.current = null
      document.documentElement.classList.remove('bg-blend')
      ctx.revert()
    }
    // Layer/pattern setup only — color transitions live in the effect below
    // so scrolling never rebuilds ScrollTriggers.
  }, [blendOn, theme])

  // Wash transitions: runs on mount, palette swap, and section change.
  // Mount + palette-only rebuilds paint instantly (theme fade class smooths
  // swaps); genuine crossings tween iff the incoming section is smooth
  // (reduced-motion can only reach here while already unmounting, but the
  // guard documents the no-tween contract explicitly).
  useLayoutEffect(() => {
    if (!blendOn) return
    const layer = layerRef.current
    if (!layer) return

    const crossed = paintedIdRef.current !== null && paintedIdRef.current !== activeSectionId
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia(BLEND_REDUCED_MOTION_QUERY).matches
    paintWash(layer, crossed && !reduceMotion && SMOOTH_INTO.has(activeSectionId))
  }, [blendOn, activeSectionId, paintWash])

  if (!blendOn) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div
        ref={layerRef}
        className="absolute inset-0"
        style={{ backgroundColor: palette[0] }}
      />
      {/* Overscanned vertically so the ±25px drift never exposes an edge. */}
      <div
        ref={patternRef}
        className="absolute inset-x-0 -top-[60px] h-[calc(100%+120px)] opacity-[0.07]"
      >
        <PatternArt />
      </div>
    </div>
  )
}
