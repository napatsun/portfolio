# Napat Kasemweerasan — Portfolio

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)

Personal portfolio of **Napat Kasemweerasan**, a Computer Engineering student at KMUTT interested in Machine Learning and Quantitative Finance — a single-page responsive site with a Navy/Gold design, dark/light mode, and interactive data visualizations.

## 🔗 Live demo

🔗 **Live site:** https://napat-sun-portfolio.vercel.app/

## 📸 Screenshots

<!-- TODO: capture screenshots after deploying and save them under docs/screenshots/ -->
<!-- ![Hero section](docs/screenshots/hero.png) -->
<!-- ![Projects section](docs/screenshots/projects.png) -->

## ✨ Features

- Sticky navbar with scroll-spy section highlighting and hide-on-scroll-down / show-on-scroll-up behavior, plus a mobile hamburger menu
- Dark/light theme (dark by default), persisted to `localStorage` and applied pre-paint to avoid a flash of the wrong theme
- Animated neural-network hero visual (seeded, deterministic CSS flicker — no render loop)
- Skills grid grouped by category (pill tags)
- Bento-grid project cards (gold-price forecasting, e-commerce database, LINE RAG chatbot)
- Interactive equity-curve chart with hover tooltips — **the day-by-day curve shape is illustrative** (seeded generator constrained to the real reported stats: 20.66% total return, 53.76% win rate, −3.16% max drawdown); the stats themselves are exact and the chart is captioned as illustrative
- Animated mock chat demo for the LINE chatbot project (clearly captioned as a mock, not a real customer log)
- Contact form with inline validation (required fields, email format) that sends via EmailJS; shows a "not configured" state when credentials are absent
- Scroll-linked background color transition with subtle equation-glyph parallax (dark mode on desktop only — disabled on mobile and with `prefers-reduced-motion` by design)
- Accessibility work: skip-to-content link, focus management (Escape returns focus to the menu button), `role="alert"` form errors, aria-labelled chart/chat regions, AA-contrast text
- SEO/Open Graph tags including `og:image` (`public/og-image.png`, 1200×630) and Twitter/X card tags

## 🛠 Tech stack

| Area | Technology |
|---|---|
| Framework | React 19 (`^19.2.8`) + Vite 8 (`^8.3.0`) |
| Language | TypeScript (`~6.0.2`) |
| Styling | Tailwind CSS v3 (`^3.4.19`, config-file setup in `tailwind.config.ts`) |
| UI animation | Framer Motion (`^13.4.4`) |
| Scroll animation | GSAP (`^3.15.0`, scroll-linked background + parallax only) |
| Charts | Recharts (`^3.10.1`, lazy-loaded per project card); `d3-scale` (`^4.0.2`) for the hero neural-network layout only |
| Icons | lucide-react (`^1.48.0`) |
| Contact form | EmailJS (`@emailjs/browser ^4.4.1`, loaded on submit) |
| Linting | Oxlint (`npm run lint`) |

## 📁 Project structure

```
portfolio/
├── docs/                  # Source-of-truth specs (see Documentation below)
├── src/
│   ├── components/
│   │   ├── Navbar/        # Sticky bar, scroll-spy, hamburger, theme toggle wiring
│   │   ├── Hero/          # Headline, CTAs + NeuralNetwork decorative visual
│   │   ├── About/         # Bio + education
│   │   ├── Skills/        # Category-grouped pill grid
│   │   ├── Projects/      # Bento grid, cards, EquityCurveChart, ChatDemo
│   │   ├── Contact/       # Validated EmailJS form + contact channels
│   │   ├── Footer/        # Copyright + secondary links
│   │   ├── Background/    # Scroll-linked wash + parallax pattern (desktop dark mode)
│   │   └── shared/        # Button, Section wrapper, ThemeToggle
│   ├── data/              # Site content (hero, about, skills, projects, contact, footer) — edit text here, not in components
│   ├── hooks/             # useTheme, useScrollSpy, useScrollDirection, useScrollToSection
│   ├── styles/            # global.css (@font-face, tokens, utilities)
│   ├── App.tsx            # Section composition
│   └── main.tsx           # Entry point
├── public/                # Static assets copied verbatim to dist (favicon, fonts, icons, og-image.png)
├── index.html             # Title, meta/OG/Twitter tags, pre-paint theme script
├── tailwind.config.ts     # Navy/Gold tokens, fonts, neural-network keyframes
├── vite.config.ts         # Vite + React plugin
└── package.json           # Scripts and dependencies
```

## 🚀 Getting started

**Prerequisites:** no Node version is pinned in `package.json` (`engines` field absent); the site was last built with Node v24. Any recent LTS Node (18+) with npm should work.

```bash
npm install     # install dependencies
npm run dev     # start the Vite dev server
npm run build   # type-check (tsc -b) + production build to dist/
npm run preview # serve the production build locally
npm run lint    # run Oxlint
```

## 🔑 Environment variables

The contact form sends mail through [EmailJS](https://www.emailjs.com) (free tier works). Three variables are required — names only, no secrets are stored in this repo:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

Setup:

1. Create an EmailJS account, add an email **service** and a **template** exposing the variables `{{from_name}}`, `{{reply_to}}`, and `{{message}}` (see `.env.example` for details).
2. Copy the example file and fill in your values: `cp .env.example .env`
3. Get the IDs from the EmailJS dashboard (Email Services / Email Templates / Account → General).

Without all three variables, the form renders a visible "Contact form isn't configured yet" notice and disables itself instead of pretending to send. Never commit `.env` with real keys (`.gitignore` already excludes it).

## ▲ Deployment

The site is a static SPA, ready for Vercel:

1. Import the repo in Vercel with the **Vite** framework preset.
2. Build command: `npm run build` · Output directory: `dist/`
3. Add `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` in the Vercel dashboard (Project → Settings → Environment Variables).
4. Production URL: https://napat-sun-portfolio.vercel.app/

## 📚 Documentation

The `docs/` folder holds the specification documents the site was built against: `specification.md` (goals, stack, structure), `content.md` (real site text), `ui-spec.md` (design system), `tests.md` (acceptance criteria), and `PROGRESS.md` (build-state log). `agent.md` at the repo root is the contributor operating manual. This project was built by AI coding agents guided by these specification documents.

## ⚠️ Known limitations

- **Mobile FCP above target on simulated slow 4G:** measured ~2.7–2.8s vs the <2s target — accepted as an architectural limit of the client-rendered SPA (empty `#root` until React mounts); Lighthouse Performance still passes at **90 mobile / 99 desktop** (from 81 / 98 before the font/EmailJS fixes).
- **Scroll-linked background blend is dark-mode desktop only by design:** disabled below 640px, under `prefers-reduced-motion`, and in light mode (where sections keep their solid alternating backgrounds for correct contrast).
- **Equity curve is illustrative:** the day-by-day shape is a seeded approximation; only the reported stats (20.66% return, 53.76% win rate, −3.16% max drawdown) are real figures, as disclosed in the on-site caption.
- Some checks still need live human verification (real-device rendering, screen-reader walkthrough, end-to-end contact send) — see `docs/PROGRESS.md` §4.

## 📬 Contact

- Email: sunnapat1689@gmail.com
- GitHub: https://github.com/napatsun
- LinkedIn: https://www.linkedin.com/in/napat-kasemweerasan-32a444358/

## 📄 License

<!-- TODO: choose a license -->
