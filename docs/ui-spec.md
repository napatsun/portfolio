# UI Spec — Design System & Interaction

## 1. Color System

| Role | Hex | Usage Proportion | Application |
|---|---|---|---|
| Primary (Deep Navy) | `#002856` | 60% | Main background, Navbar, section background alternating with white |
| Secondary (White/Cool Gray) | `#FFFFFF` / `#F5F7FA` | 30% | Content section backgrounds, cards, text on Navy backgrounds |
| Accent (Ring Gold) | `#EDAE17` | 10% | CTA buttons, hover states, highlight borders, icons, background patterns |

**Dark Mode:**
- Main background is a darker Navy (e.g. `#001631`), text is white/light gray, Gold is used as the accent as before but with adjusted opacity to contrast against the darker background

**Light Mode:**
- Main background is White/Cool Gray, Navy is used as the primary text color and section dividers, Gold remains the accent as before

**Section color-alternation rule:**
- Alternate background Navy ↔ White every section to create rhythm and depth, e.g. Hero = Navy, About = White, Skills = Navy, Projects = White, Contact = Navy

## 2. Typography

| Type | Font | Weight | Usage |
|---|---|---|---|
| Header (H1–H3) | Playfair Display | 600–700 | Section titles, Hero headline |
| Body | Inter or Open Sans | 400–500 | General content, buttons, labels |
| Code/Algorithm | JetBrains Mono or SF Mono | 400 | Sections showing numbers, statistics, snippets, technology tags |

**Recommended scale (rem):** H1: 3.5–4.5 / H2: 2.5 / H3: 1.75 / Body: 1 / Small: 0.875

## 3. Layout & Navigation

- **Navbar**: `position: sticky; top: 0`, semi-transparent background + blur (backdrop-filter) on scroll, hides via `transform: translateY(-100%)` on scroll down, reappears on scroll up (using scroll direction detection)
- **Scroll-spy**: use Intersection Observer to detect the section within the viewport and highlight the matching menu item (e.g. a gold underline under the active menu item)
- **Section spacing**: minimum vertical padding of 96px on desktop, 48px on mobile
- **Projects grid**: use CSS Grid with `grid-template-columns: repeat(4, 1fr)`, then set some cards to `grid-column: span 2` or `grid-row: span 2` to create an asymmetric small-large layout (similar to a masonry/bento grid)

## 4. Responsive Breakpoints

| Breakpoint | Size | Behavior |
|---|---|---|
| Mobile | < 640px | Nav collapses into a hamburger menu, Projects grid becomes 1 column, heavy animations reduced/disabled for performance |
| Tablet | 640–1024px | Projects grid 2 columns, Navbar shown in full but with smaller font |
| Desktop | > 1024px | Full layout as designed, all animations active |

## 5. Interaction & Animation Spec

### 5.1 Background & Scroll Effects
- Background changes color with a smooth transition (`transition: background-color 0.6s ease`) as sections change, using GSAP ScrollTrigger to track scroll position and interpolate color
- Low-opacity background pattern (5–10%): thin grid lines and gold mathematical equation graphics, drawn in SVG and shifted slightly with scroll (parallax, translateY up to 50px)

### 5.2 Hover Effects
- **Project Card**: hovering triggers a glass/reflection effect — use a pseudo-element with `background: linear-gradient` in translucent white moving across the card on hover (similar to a shine effect), along with a slight card scale (`transform: scale(1.02)`) and a subtle gold-tinted shadow

### 5.3 Data Visualization
- **Neural Network / Data Stream Visual**: use D3.js to draw an animated node-edge graph (moving dots/pulsing connecting lines) placed as a decorative element in Hero or About
- **Model Accuracy / Trading Chart**: use Recharts or Chart.js to build a line/area chart; hovering over a data point shows a tooltip with statistics (accuracy, return %, timestamp) in a real-time style (counting up gradually with animation)

### 5.4 Dark/Light Mode Toggle
- Icon button (sun/moon) in the top-right corner of the Navbar, toggles the `dark` class on `<html>`, saves the value in `localStorage`, smooth transition for background/text colors (0.3–0.5s)

## 6. Component Checklist

- [ ] Navbar (sticky, scroll-hide, scroll-spy, dark/light toggle)
- [ ] Hero (headline, subheadline, CTA buttons, decorative neural-network SVG)
- [ ] About card/section
- [ ] Skills grid (grouped by category, using tags/badges)
- [ ] Project card (bento grid, glass hover, technology tags, GitHub/Demo links)
- [ ] Interactive chart component (reusable across multiple projects)
- [ ] Contact form (validation, success/error state)
- [ ] Footer
- [ ] Theme toggle (dark/light) as a global context