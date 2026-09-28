# agent.md — Instructions for the Coding Agent

You are building a personal portfolio website for **Napat Kasemweerasan**. This file is your operating manual. Before writing any code, read every file in `docs/` — they are the source of truth and override any assumption you might otherwise make.

## 1. Required Reading (in this order)

1. `docs/specification.md` — project goals, tech stack, folder structure, functional/non-functional requirements
2. `docs/content.md` — the actual real text/data to put on the site (names, project descriptions, contact info)
3. `docs/ui-spec.md` — design system (colors, fonts, layout, animations, breakpoints)
4. `docs/tests.md` — acceptance criteria you must satisfy before considering any feature "done"

Do not proceed to implementation until you have read all four.

## 2. Ground Rules

- **Never invent content.** If a field in `docs/content.md` is marked `[TODO: ...]`, leave a clearly marked placeholder in the code instead of making up a URL, statistic, or project detail.
- **Follow `docs/ui-spec.md` exactly** for colors, fonts, spacing, and breakpoints. Do not substitute your own default theme, spacing scale, or font choices.
- **Follow the folder structure in `docs/specification.md`.** Do not restructure the project (e.g. do not switch to Next.js, do not rename `src/components` to `src/Components`) without asking first.
- **Treat `docs/tests.md` as Definition of Done.** After implementing each section, self-check it against the relevant checklist items in `tests.md` before moving to the next section.
- **Keep content and code separated.** Real text/data belongs in `src/data/*.ts` (derived from `content.md`), not hardcoded inside JSX/TSX components.
- **Performance first on mobile.** Any animation described in `ui-spec.md` (parallax, D3 network graph, scroll-linked background) must degrade gracefully or be reduced on mobile viewports (<640px) — do not sacrifice the Lighthouse performance target from `specification.md` for visual flourish.

## 3. Tech Stack (must use — do not substitute without asking)

- React 18 + Vite + TypeScript
- Tailwind CSS
- Framer Motion (UI/hover/mount animations)
- GSAP + ScrollTrigger (scroll-linked background and parallax effects)
- D3.js (custom decorative visuals: neural network / data stream)
- Recharts or Chart.js (data charts: model accuracy, trading backtest)
- react-scroll or Intersection Observer (scroll-spy navigation)
- lucide-react (icons)

If a requirement in `docs/ui-spec.md` cannot reasonably be built with this stack, stop and flag it instead of silently adding a new dependency.

## 4. Build Order

Work section by section, in this order, and treat each as complete only once it passes the relevant checks in `docs/tests.md`:

1. Project scaffold + Tailwind config with the exact color tokens and fonts from `ui-spec.md`
2. Global layout: theme (dark/light) context, `src/hooks/useTheme.ts`
3. Navbar (sticky, scroll-hide/show, scroll-spy) — `src/hooks/useScrollSpy.ts`
4. Hero section
5. About section
6. Skills section
7. Projects section (bento grid + project cards + at least one interactive chart)
8. Contact section (form with validation)
9. Footer
10. Global polish: background scroll-color transitions, background pattern parallax, responsive pass, accessibility pass, SEO meta tags

Do not start a later section before the current one satisfies its checklist in `docs/tests.md`.

## 5. When Something Is Ambiguous

If `docs/specification.md`, `docs/content.md`, `docs/ui-spec.md`, or `docs/tests.md` conflict, or a requirement is unclear:

- Do not guess silently.
- State the ambiguity explicitly and propose the most reasonable interpretation, then continue — unless the ambiguity affects real content (e.g. a missing project detail), in which case leave a `[TODO]` placeholder instead of guessing.

## 6. Definition of Done (project-level)

The project is done when:

- [ ] Every checklist item in `docs/tests.md` passes
- [ ] No hardcoded content lives outside `src/data/`
- [ ] No `[TODO]` placeholder from `docs/content.md` was silently replaced with invented data
- [ ] The folder structure matches `docs/specification.md`, including `docs/` itself remaining in the repo
- [ ] Lighthouse performance, accessibility, and SEO targets from `docs/specification.md` are met