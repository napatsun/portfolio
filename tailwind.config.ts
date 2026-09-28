import type { Config } from 'tailwindcss'

/**
 * Design tokens sourced from docs/ui-spec.md.
 * Do not substitute colors or fonts without updating that spec.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // Manual dark/light toggle: the ThemeToggle flips the `dark` class on <html>.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary (Deep Navy) — 60% usage
        primary: '#002856',
        // Secondary (White / Cool Gray) — 30% usage
        'secondary-light': '#FFFFFF',
        'secondary-gray': '#F5F7FA',
        // Accent (Ring Gold) — 10% usage
        accent: '#EDAE17',
      },
      fontFamily: {
        header: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      // Decorative neural-network firing (Hero visual, docs/ui-spec.md §5.3).
      // Each node/edge spends most of its cycle at a faint resting opacity and
      // briefly spikes (~6% of the cycle) before falling back — so at any instant
      // only a couple of elements are lit, reading as neurons firing one at a
      // time. Per-element duration/delay are set inline from a seeded generator
      // (NeuralNetwork.tsx) so the flicker is deterministic, not `Math.random()`.
      // Both tokens are consumed behind `motion-safe:`; reduced-motion users get
      // the static low-opacity graph. The duration baked into `animation` is only
      // a fallback — every element overrides it with its own inline duration.
      keyframes: {
        'nn-node-fire': {
          '0%, 74%, 100%': { opacity: '0.3' },
          '77%': { opacity: '0.82' },
          '80%': { opacity: '0.32' },
        },
        'nn-edge-fire': {
          '0%, 74%, 100%': { opacity: '0.1' },
          '77%': { opacity: '0.45' },
          '80%': { opacity: '0.1' },
        },
      },
      animation: {
        'nn-node-fire': 'nn-node-fire 6.5s ease-in-out infinite',
        'nn-edge-fire': 'nn-edge-fire 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
