import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { navItems, SITE_NAME } from '../../data/nav'
import { useScrollDirection } from '../../hooks/useScrollDirection'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { useScrollToSection } from '../../hooks/useScrollToSection'
import { useTheme } from '../../hooks/useTheme'
import ThemeToggle from '../shared/ThemeToggle'

const linkBase =
  'relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-light lg:text-base dark:focus-visible:ring-offset-[#001631]'

/** Gold underline shown under the active section (docs/ui-spec.md §3). */
const activeUnderline =
  'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-center after:rounded-full after:bg-accent after:transition-transform after:duration-200'

export default function Navbar() {
  const sectionIds = useMemo(() => navItems.map((item) => item.id), [])
  const activeId = useScrollSpy(sectionIds)
  const { isVisible, isScrolled } = useScrollDirection()
  const { theme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  /**
   * Section queued while the mobile panel closes (Bug 2): collapsing the
   * panel removes ~200px of sticky-header height and reflows the document
   * mid-scroll, corrupting native smooth-scrollIntoView's destination — so
   * mobile taps scroll on exit-complete instead of immediately. Desktop
   * clicks (menu closed) scroll synchronously as before.
   */
  const [pendingSectionId, setPendingSectionId] = useState<string | null>(null)
  const scrollToSection = useScrollToSection()
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  /**
   * Navbar text tone (contrast, tests.md §4). The bar is `position: sticky`
   * — i.e. IN FLOW — so at scroll-top it does NOT overlay the navy Hero
   * (which begins below it at y=65px); it sits on the page background, which
   * follows the theme (white in light mode, #001631 in dark mode). Once
   * scrolled the bar gains its own translucent backdrop. Both states
   * therefore follow the THEME, not the scroll position: navy text on the
   * light scheme, light text on the dark scheme. (The old `isScrolled`-based
   * flip assumed the bar floated over the navy Hero, which painted WHITE
   * text/icon on the WHITE body at scroll-top in light mode — an invisible
   * logo, links, hamburger and ThemeToggle. Root-caused by pixel screenshot;
   * see docs/PROGRESS.md.) Active links are gold only on the dark scheme
   * (gold-on-white is 1.97:1).
   */
  const barTone = theme === 'dark' ? 'onDark' : 'onLight'
  const idleLinkTone =
    barTone === 'onDark'
      ? 'text-secondary-light/80'
      : 'text-primary/80 dark:text-secondary-gray/80'
  const activeLinkTone = barTone === 'onDark' ? 'text-accent' : 'text-primary dark:text-accent'

  const handleNavigate = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault()
      if (menuOpen) {
        setPendingSectionId(id)
        setMenuOpen(false)
      } else {
        scrollToSection(id)
      }
    },
    [menuOpen, scrollToSection],
  )

  const flushPendingSection = useCallback(() => {
    if (pendingSectionId) {
      scrollToSection(pendingSectionId)
      setPendingSectionId(null)
    }
  }, [pendingSectionId, scrollToSection])

  // Escape closes the mobile menu and returns focus to the trigger —
  // without this, focus is left on the unmounting panel link (body fallback).
  // The panel is a non-modal disclosure (page behind stays interactive), so
  // focus is not trapped; Tab order flows naturally from the toggle in DOM
  // order, and Escape restores the trigger.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header
      className={`sticky top-0 z-50 transition-transform duration-300 ease-out motion-reduce:transition-none ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav
        aria-label="Main"
        className={`border-b transition-colors duration-300 ${
          isScrolled
            ? 'border-primary/10 bg-secondary-light/80 backdrop-blur-md dark:border-secondary-light/10 dark:bg-[#001631]/80'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a
            href="#home"
            onClick={(event) => handleNavigate(event, 'home')}
            className={`rounded-md font-header text-lg font-semibold tracking-wide transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-light dark:text-secondary-light dark:hover:text-accent dark:focus-visible:ring-offset-[#001631] ${
              barTone === 'onDark' ? 'text-secondary-light' : 'text-primary'
            }`}
          >
            {SITE_NAME}
          </a>

          <ul className="hidden items-center gap-1 sm:flex lg:gap-2">
            {navItems.map((item) => {
              const isActive = item.id === activeId
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => handleNavigate(event, item.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`${linkBase} ${
                      isActive
                        ? `${activeLinkTone} ${activeUnderline} after:scale-x-100`
                        : `${idleLinkTone} hover:text-accent dark:hover:text-accent`
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle light={barTone === 'onDark'} />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => {
                // A manual toggle invalidates any queued post-exit scroll
                // (e.g. reopening mid-exit must not scroll to a stale target).
                setPendingSectionId(null)
                setMenuOpen((open) => !open)
              }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 transition-colors duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-light sm:hidden dark:border-secondary-light/20 dark:text-secondary-light dark:hover:text-accent dark:focus-visible:ring-offset-[#001631] ${
                barTone === 'onDark' ? 'text-secondary-light' : 'text-primary'
              }`}
            >
              {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>

        <AnimatePresence onExitComplete={flushPendingSection}>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="overflow-hidden sm:hidden"
            >
              <ul className="flex flex-col gap-1 border-t border-primary/10 bg-secondary-light/95 px-4 py-3 backdrop-blur-md dark:border-secondary-light/10 dark:bg-[#001631]/95">
                {navItems.map((item) => {
                  const isActive = item.id === activeId
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(event) => handleNavigate(event, item.id)}
                        aria-current={isActive ? 'location' : undefined}
                        // Panel carries its own light backdrop in both modes,
                        // so active links are navy-on-light (gold-on-white
                        // fails AA) — unlike the floating desktop bar above.
                        className={`block w-full ${linkBase} ${
                          isActive
                            ? 'text-primary dark:text-accent'
                            : 'text-primary/80 hover:text-accent dark:text-secondary-gray/80 dark:hover:text-accent'
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
