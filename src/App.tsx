import { Suspense, lazy, useEffect, useState } from 'react'
import About from './components/About/About'
import {
  isBlendAllowed,
  subscribeBlendAllowedChange,
} from './components/Background/blendMedia'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import Hero from './components/Hero/Hero'
import Navbar from './components/Navbar/Navbar'
import Projects from './components/Projects/Projects'
import Skills from './components/Skills/Skills'
import { useTheme } from './hooks/useTheme'

/**
 * GSAP chunk loads separately (step 10): the scroll background is a
 * progressive enhancement, so it must not block first paint — and on mobile
 * / reduced-motion it is never downloaded at all (blendMedia gate).
 */
const ScrollBackground = lazy(() => import('./components/Background/ScrollBackground'))

/**
 * All sections built (agent.md §4 steps 1–9) — no placeholders remain.
 * Footer sits outside <main>: it is site chrome, not page content.
 * ScrollBackground is a fixed additive layer (step 10) — it paints behind
 * everything and never affects layout or section components.
 */
function App() {
  // Initialized from the gate (no sync setState); listeners keep it live
  // across viewport resizes and motion-preference changes.
  const [bgEnabled, setBgEnabled] = useState<boolean>(isBlendAllowed)
  // Dark-only blend (wash-out fix — see ScrollBackground): light mode keeps
  // solid section bgs, so the GSAP chunk is never even downloaded there.
  // Toggling light→dark loads it on demand (Suspense null: solid bgs stay
  // correct-contrast until the wash mounts and paints pre-paint).
  const { theme } = useTheme()

  useEffect(
    () => subscribeBlendAllowedChange(() => setBgEnabled(isBlendAllowed())),
    [],
  )

  return (
    <>
      {bgEnabled && theme === 'dark' && (
        <Suspense fallback={null}>
          <ScrollBackground />
        </Suspense>
      )}
      {/* Skip link: visually hidden until keyboard-focused, letting Tab users
          bypass the Navbar straight to the content (tests.md §4). */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:font-body focus:text-base focus:font-semibold focus:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        Skip to content
      </a>
      <Navbar />
      {/* tabIndex -1 makes the skip-link target focusable without adding it
          to the Tab order; outline suppressed since the jump itself is the
          feedback. */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
