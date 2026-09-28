import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark'

/** Matches the key read by the anti-FOUC script in index.html. */
const STORAGE_KEY = 'theme'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getStoredTheme(): Theme {
  // First-time visitors default to dark; a saved value (light OR dark) from
  // prior manual toggling always wins and is never overridden here.
  if (typeof window === 'undefined') return 'dark'
  return window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
}

function applyThemeClass(theme: Theme) {
  // Tailwind is configured with `darkMode: 'class'` (tailwind.config.ts).
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme)

  useEffect(() => {
    applyThemeClass(theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// The provider and its consumer hook are intentionally co-located in this module.
// oxlint-disable-next-line react/only-export-components
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
