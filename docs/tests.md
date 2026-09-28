# Tests / Acceptance Criteria — Portfolio Website

## 1. Functional Tests

### Navigation
- [ ] Clicking a Navbar menu item smooth-scrolls to the correct section
- [ ] The menu item matching the section currently in view is automatically highlighted while scrolling
- [ ] The Navbar hides on scroll down and reappears on scroll up, at every position on the page (except at the very top, where it should always be shown)
- [ ] On mobile, the menu collapses into a hamburger and opens/closes correctly

### Dark / Light Mode
- [ ] Pressing the toggle button changes the background/text colors immediately with a smooth transition
- [ ] Refreshing the page preserves the selected dark/light setting (localStorage works correctly)
- [ ] Text contrast is easy to read in both modes, with no unreadable spots

### Background & Animation
- [ ] The background changes color smoothly when scrolling past each section, without stuttering
- [ ] The background pattern (grid/equations) shifts with scroll but does not obscure the main content, and its opacity is low enough not to interfere with reading
- [ ] Hovering over a Project Card shows the glass/reflection effect per spec, and does not freeze/stutter when hovered repeatedly and quickly

### Data Visualization
- [ ] The chart (model accuracy / trading chart) displays data correctly according to the data source
- [ ] Hovering over a data point in the chart shows a tooltip with correct statistics, without freezing
- [ ] The neural network/data-stream visual renders as a decorative element without significantly slowing down the page

### Contact Form
- [ ] Submitting the form with incomplete required fields shows the correct error message at the right spot
- [ ] Entering an improperly formatted email shows a validation error
- [ ] Filling out the form correctly and pressing Send successfully sends the email/data and shows a success message
- [ ] Social links (GitHub, LinkedIn, Email) open correctly and lead to the correct destination

## 2. Responsive Tests

- [ ] Test at screen widths: 320px, 375px, 768px, 1024px, 1440px, 1920px — no broken layout or horizontal overflow
- [ ] Images/charts scale with screen size without losing proportion
- [ ] The Projects bento grid adjusts to 1–2 columns on mobile/tablet as specified

## 3. Performance Tests

- [ ] Lighthouse Performance score ≥ 85 (mobile and desktop)
- [ ] First Contentful Paint < 2 seconds on a simulated 4G network
- [ ] No severe layout shift (low Cumulative Layout Shift) while fonts/images load
- [ ] Heavy animations (parallax, D3 network) are reduced or disabled on mobile to keep FPS from dropping below 30

## 4. Accessibility Tests

- [ ] The contrast ratio of primary text meets WCAG AA
- [ ] Using the keyboard (Tab) can navigate through the menu, buttons, and form completely without getting stuck
- [ ] All buttons/links have a clearly visible focus state
- [ ] Important images have `alt` text

## 5. SEO Tests

- [ ] Has a `<title>` and `meta description` that convey identity and field of study
- [ ] Has Open Graph tags for link sharing (og:title, og:description, og:image)
- [ ] Heading hierarchy (H1 → H2 → H3) is correct according to content importance

## 6. Cross-Browser Tests

- [ ] Chrome (latest) — all features work correctly
- [ ] Safari (latest) — specifically check backdrop-filter and CSS Grid, which sometimes behave differently from Chrome
- [ ] Firefox (latest) — check animation and scroll behavior

## 7. Content Integrity Tests

- [ ] All section content matches `content.md`, with no information fabricated by the agent without a source (in particular, project details still marked as placeholders must not be replaced with fictional data)
- [ ] All `[TODO]` links in content.md are replaced with real information before actual deployment