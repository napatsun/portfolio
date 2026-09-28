# Specification — Napat Kasemweerasan's Portfolio Website

## 1. Project Overview

A personal portfolio website built as a Single Page Application (SPA) with one-page scroll navigation, designed to present the author as a Computer Engineering student with an interest in Machine Learning and Quantitative Finance. The overall tone conveys the credibility of high-end finance (Navy + Gold) blended with a Tech/Data feel through graphic flourishes and data visualization.

**Target audience:**
- HR / Recruiters in Tech, Data, and Quant fields
- Professors / scholarship committee members
- Peers in the ML/Quant field

**Website goals:**
1. Clearly present identity, capabilities, and tech stack
2. Showcase work/projects in an engaging format, not just a plain list
3. Create a strong first impression through premium design and interactive flourishes
4. Provide an easily accessible contact channel

---

## 2. Recommended Tech Stack

### Frontend
| Area | Recommended Technology | Reason |
|---|---|---|
| Framework | **React 18 + Vite** | Fast builds, large ecosystem, well-suited for an SPA with heavy interaction |
| Language | **TypeScript** | Reduces bugs from type errors, suits a project with defined data structures (project data, chart data) |
| Styling | **Tailwind CSS** | Precise control over design tokens (color/font/spacing) matching the design system, easy responsiveness |
| Animation (UI) | **Framer Motion** | Declarative animation, good for hover effects, transitions, mount/unmount animation |
| Animation (Scroll) | **GSAP + ScrollTrigger** | Fine-grained control of scroll-linked animation (background color changes, patterns moving with scroll), more detailed than Framer Motion |
| Data Visualization | **D3.js** (custom graphics such as neural network, data stream) + **Recharts or Chart.js** (standard statistical charts such as model accuracy, trading chart) | Split by complexity: D3 for custom art, Recharts/Chart.js for real data charts needing fast interactive tooltips |
| Routing/Scroll-spy | **react-scroll** or a custom Intersection Observer | Used for a nav that highlights the current section and smooth-scrolls to a section |
| Icon | **lucide-react** | Lightweight, syncs easily with the design system |

### Backend / Data
- This project is a **static portfolio** and does not need a full backend.
- **Contact Form**: recommend a serverless service such as **EmailJS** or **Formspree** (no need to write a backend), or if more control is desired, use **Flask** (matches the existing tech stack) deployed as a serverless function.
- PostgreSQL/Pinecone are not needed for this site (keep them for other ML/RAG projects instead), unless a "Live Demo" of a model is wanted directly on the site.

### Deployment
- **Vercel** or **Netlify** — free deployment, direct support for React/Vite, automatic CI/CD from GitHub

### Recommended Project Structure
```
portfolio/
├── docs/
│   ├── specification.md
│   ├── content.md
│   ├── ui-spec.md
│   └── tests.md
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Hero/
│   │   ├── About/
│   │   ├── Skills/
│   │   ├── Projects/
│   │   ├── Contact/
│   │   └── shared/ (Button, Section, ThemeToggle, etc.)
│   ├── data/ (content.md converted into projects.ts, skills.ts)
│   ├── hooks/ (useScrollSpy, useTheme)
│   ├── styles/ (tailwind config, global.css)
│   ├── App.tsx
│   └── main.tsx
├── public/
├── tailwind.config.ts
└── package.json
```

> `docs/` holds all project reference documents (specification, content, ui-spec, tests) as a source of truth for the agent to reference during development, and for reviewers to check the result against the spec at any time.

---

## 3. Page Structure (Sections)

All sections live on a single page, in this order:

1. **Navbar** — sticky, hides on scroll down, reappears on scroll up, has a Dark/Light toggle
2. **Hero** — name, title/field, tagline, CTA to scroll to Projects
3. **About** — self-introduction content, education, areas of interest (Bridging CompEng x Quant x ML)
4. **Skills / Tech Stack** — grouped by category (Languages, Data & ML, NLP & LLM, MLOps & Backend, Database, Tools)
5. **Projects** — asymmetric grid layout, with accompanying data visualization (for projects related to ML/Trading)
6. **Contact** — contact form + social links (GitHub, LinkedIn, Email)
7. **Footer** — copyright, secondary links

---

## 4. Functional Requirements

- [ ] Navbar smooth-scrolls to the correct section with the current section highlighted (scroll-spy)
- [ ] Navbar hides on scroll down, shows on scroll up (sticky behavior)
- [ ] Dark / Light mode toggle that remembers the user's choice (localStorage)
- [ ] Background changes color with a smooth transition when scrolling past each section
- [ ] Background has a subtle pattern (grid lines / gold mathematical equations) that shifts with scroll (light parallax)
- [ ] Project cards have a glass/reflection hover effect (glassmorphism/reflection)
- [ ] At least one interactive chart (e.g. model accuracy or trading simulation) that shows statistics on hover
- [ ] Contact form actually sends email, with validation (required fields, email format)
- [ ] Fully responsive across all screen sizes (Mobile / Tablet / Desktop)

## 5. Non-Functional Requirements

- **Performance**: Lighthouse Performance score ≥ 85, First Contentful Paint < 2s
- **SEO**: appropriate meta tags, Open Graph tags, title/description per section
- **Accessibility**: contrast ratio at least WCAG AA, keyboard navigation works for nav and forms
- **Cross-browser**: works normally on the latest versions of Chrome, Safari, Firefox
- **Maintainability**: content (text, projects) kept separate from components in dedicated data files, for easy future edits

## 6. Constraints

- Avoid a heavier-than-necessary backend (except for the contact form)
- Animation must not hurt performance on mobile (effects can be disabled/reduced on small screens if needed)
- Any placeholder data used in sample charts (if no real project data is available yet) must be clearly marked as a placeholder — the agent must not fabricate false information about work that doesn't exist

## 7. Open Items (must be filled in before real development begins)

- Real project details (name, description, results, GitHub/Demo links) — not yet in the source document, must be added to content.md
- Backend framework for the form (EmailJS / Formspree / Flask) — must be decided before development
- The actual domain name and hosting to be used