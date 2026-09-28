import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

/**
 * Sun in dark mode, Moon in light mode (docs/ui-spec.md §5.4).
 * Keyboard-accessible: a real <button> with a visible focus ring.
 *
 * `light` forces the light-on-dark icon treatment for contexts where the
 * navbar floats over a navy background while in light mode (unscrolled top
 * over the Hero) — otherwise the navy icon would sit on navy (fails AA).
 */
export default function ThemeToggle({ light = false }: { light?: boolean }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 transition-colors duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-light dark:border-secondary-light/20 dark:text-secondary-light dark:hover:text-accent dark:focus-visible:ring-offset-[#001631] ${light ? 'text-secondary-light' : 'text-primary dark:text-secondary-light'}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.75 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.75 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex items-center justify-center"
        >
          {isDark ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
