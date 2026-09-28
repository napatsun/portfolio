# PROGRESS — Build State Reference

> Read this first in a fresh session, then `agent.md` + `docs/` (source of truth).
> BUILD COMPLETE: steps 1–10 done (all 4 polish parts). Remaining work is
> human-only: the live-verification checklist in §4 — nothing left to code
> before it except EmailJS credentials + og:url/og:image pre-launch TODOs.

## 1. Build Order Status (agent.md §4)

- [x] 1. Scaffold + Tailwind config (`tailwind.config.ts`, exact ui-spec tokens/fonts)
- [x] 2. Theme context — `src/hooks/useTheme.tsx` (see §2)
- [x] 3. Navbar (sticky, scroll-hide/show, scroll-spy, hamburger, ThemeToggle)
- [x] 4. Hero (+ `NeuralNetwork` decorative visual, see §2)
- [x] 5. About
- [x] 6. Skills
- [x] 7. Projects (bento grid + cards + equity-chart + chat demo, see §3)
- [x] 8. Contact section + form (EmailJS, see §3)
- [x] 9. Footer (`src/data/footer.ts` + `src/components/Footer/Footer.tsx`)
- [x] 10. Global polish — ALL 4 PARTS ✅ (scroll bg blend + pattern parallax,
  responsive audit, accessibility audit, SEO meta tags; see §3)

`App.tsx` renders all sections plus `<Footer />` after `<main>` — no
placeholders remain.

## 1b. Pre-launch verification — PASSED (headless-Chrome pixel + DOM sweep, 2026-09-27)

Full end-to-end sweep on the production build (`npm run build` → `dist/` served
over 127.0.0.1, driven by headless Chrome over CDP). Every check was confirmed
with a real PNG screenshot decoded pixel-by-pixel in Node (a small zlib PNG
decoder) **together with** a DOM/computed-style inspection — never
DOM-correctness alone. **Result: 94/94 checks PASS, 0 FAIL, 0 WARN.**
Screenshots (disposable) were written to `/tmp/codebuff-prelaunch/` and the
temp harness scripts were removed after the pass.

- **Regression re-checks (all PASS):**
  - Horizontal overflow: `documentElement.scrollWidth == clientWidth` at
    320/375/768/1024/1440/1920, at scroll-top AND deep at Contact; zero
    unclipped offending elements (Bug 1 + the Contact `minmax(0,1fr)` fix hold).
  - Navbar contrast at scroll-top, light AND dark: logo, each link, theme
    toggle and hamburger sampled from actual pixels — 7.93:1 to 18.12:1, none
    invisible. The ThemeToggle fix holds.
  - Nav click landings: section top 65–69px, heading 113–165px (below the 65px
    bar) on desktop and mobile; scroll-spy highlights the current section;
    hide-on-scroll-down / show-on-scroll-up both work.
  - Mobile hamburger: opens (height 221px), link contrast 10.97:1, link scroll
    lands on Projects + panel closes, Escape closes (and returns focus).
  - Background wash: dark mode blend active; 22 scroll positions sampled along
    the left edge — only navy tones (`#001631` / `#002856` + tween
    intermediates `0,27,59` / `0,34,74` / `0,40,85`), zero gray/seam pixels;
    identical colour after a 30px nudge at rest. Light mode has no `bg-blend`
    and no wash layer (hard-cut only), as designed.
  - Contact: no overflow at 320–1440, form + channels side-by-side at lg, empty
    submit yields all three field errors, invalid email yields the email error.
  - Theme × viewport (375/768/1440) × section = 30 screenshots: no overflow,
    headings in view at 13.61:1–18.12:1, no blank frames (515–1412 unique
    colours).
  - Interactive: toggle flips + persists across reload; the 3 project GitHub
    URLs match content.md exactly; equity chart renders (520×511) with a
    working hover tooltip ("Mar 2025 -1.39%"); chat demo renders (520×180);
    contact + footer hrefs (mailto/GitHub/LinkedIn) correct; zero runtime
    console errors.
  - Hero `NeuralNetwork` renders 36 lines / 13 circles / 49 fire-animated
    elements — the staggered-flicker refactor is intact.
- **Findings (no site code bug found — nothing needed fixing):**
  - **A real `.env` now exists** with the EmailJS service/template/public key,
    so the production build is CONFIGURED: the "isn't configured yet" notice
    does NOT render, the fieldset is enabled, and inline validation works.
    This supersedes the older "no real IDs exist yet" wording in §3/§4. The
    unconfigured path was verified separately by building with the EmailJS
    vars blanked (`VITE_EMAILJS_*=  npx vite build`): the notice renders
    cleanly with **no text bleed** at 320/375/768/1440 and disables the
    fieldset. A real end-to-end SEND was deliberately NOT fired this pass (it
    would email a real recipient) — still a human/manual item.
  - `.gitignore` did NOT ignore `.env` despite that file's own "never commit"
    header → fixed (added `.env` / `.env.*` with `!.env.example`). No git repo
    exists here so nothing was ever exposed; this is future-proofing.
  - `og:image` is still absent (known pre-launch TODO) — confirmed present:
    title, meta description, `og:title`, `og:description`; absent: `og:image`.
  - Disposable prior-session `pixel-evidence-*.png` files removed from the
    repo root.

**Conclusion: the site is READY for the non-code launch tasks only** — set
`og:url` to the deployed URL, add a real `og:image` share asset, choose the
domain/hosting (specification.md §7), and do one manual end-to-end Contact
send. No further code work is required.

## 2. Stack Decisions (differ from / clarify agent.md §3 + specification.md §2)

- **React 19.2 kept** — not downgraded to 18. (`react`/`react-dom` `^19.2.8`.)
- **Tailwind v3.4.19, config-file paradigm** (`tailwind.config.ts`) — not v4.
- **Charts: Recharts only** (`^3.10.1`, no Chart.js). Lazy-loaded per card via the
  `visualization.kind` component map in `ProjectCard.tsx`; recharts stays in its
  own ~355 kB lazy chunk, out of the initial bundle.
- **Hero visual uses `d3-scale` only** (`scalePoint` in `NeuralNetwork.tsx`) —
  not full D3.
- **`useTheme` lives in `src/hooks/useTheme.tsx`** (not `.ts`) — it returns JSX
  (provider), so the extension is required.
- Scroll-spy/scroll-hide are custom Intersection Observer hooks
  (`useScrollSpy`, `useScrollDirection`, `useScrollToSection`) — no react-scroll.

## 3. Per-Section Decisions

- **Skills:** pill tags, not progress bars — `content.md` has no proficiency data
  (choice documented in `Skills.tsx` header comment).
- **Projects:** GitHub URLs are real links from `content.md` §5 (3/3 cards) — they
  were never `[TODO]` placeholders, despite agent.md §2's example wording.
- **Projects / equity curve** (`src/data/equityCurve.ts` + `EquityCurveChart.tsx`):
  the curve shape is **illustrative** — a seeded deterministic generator
  constrained to the real reported stats (20.66% total return, 53.76% win rate,
  −3.16% max drawdown, Jan 2024–Mar 2026). Stats exact, day-by-day shape
  approximated. Always-visible caption + aria-label disclose this.
- **Projects / LINE Chatbot card** (`src/data/chatDemo.ts` + `ChatDemo.tsx`):
  animated mock chat (4 Thai-language café bubbles, staggered fade-in + typing
  indicator loop, Framer Motion, no API). Registered in the **same**
  `visualization.kind` map — no second mechanism. Captioned
  "mock conversation, not a real customer log." Reduced-motion renders statically.
- **Hero NeuralNetwork ambient flicker (design refinement, `NeuralNetwork.tsx`
  + `tailwind.config.ts`).** Replaces the old uniform `nn-pulse` (one keyframe
  set, all 13 nodes/36 edges swinging `0.12↔0.55` in near-lockstep) with a
  sparse per-element "neuron fire". Two keyframe tokens: `nn-node-fire`
  (`0.30` rest → `0.82` spike) and `nn-edge-fire` (`0.10` → `0.45`); each rests
  for most of its cycle and spikes over a ~6% window (74→77→80%), so only ~3
  elements are lit at any instant — one-at-a-time flicker, not a wave. Every
  element gets its OWN `animation-duration` (nodes 5.2–7.8s, edges 6.2–9.9s)
  and a NEGATIVE `animation-delay` (start mid-cycle, no dead lead-in) emitted
  inline; different durations mean phases drift and never re-align, so the
  pattern looks organic and effectively never repeats. Randomisation is a
  seeded `mulberry32` PRNG (mirrors `equityCurve.ts`) with fixed seeds
  (`0x51f7a3c9` / `0x7c1b9e2d`) — NO `Math.random()` in render, so it is
  deterministic/identical every load (StrictMode-safe, SSR-safe). Pure CSS
  infinite animations — no JS interval, no render loop. Node/edge count and
  `d3-scale` layout unchanged; `sm:motion-safe:` gate preserved (mobile +
  reduced-motion keep the static `opacity-20`/`opacity-40` graph, the inline
  duration/delay are inert without `animation-name`). No new dependency; CSS
  bundle delta ≈ +0.1 kB (one extra `@keyframes`), 0 JS bytes.
- **Section rhythm confirmed:** Hero=Navy, About=White, Skills=Navy,
  Projects=White, Contact=Navy (built).
- **Scroll background: DISCRETE state machine** (`gsap@^3.15.0` — resolves
  the §5 open item; first and only GSAP usage). REPLACES all zone/percentage/
  settle-snap iterations below (white-flash → stuck-mid-blend → seam), which
  are kept as one-line history only — do not revive that machinery.
  `src/components/Background/ScrollBackground.tsx`: fixed additive layer
  (color wash + gold equation-glyph SVG at 7% opacity, glyphs-only). The wash
  holds ONE state, `activeSectionId`, from a dedicated `useScrollSpy`
  instance (own observer; Navbar's instance untouched): color is a static
  id→hex lookup, never a computed blend. Section change → 0.5s GSAP tween
  iff the incoming id is in `SMOOTH_INTO` (`about`, `skills`), else instant
  snap (hard-cut; those sections cover the wash opaquely anyway). No per-scroll
  writes exist, so rests AND nudges always show exact flat color and seams are
  structurally impossible — the layer is only ever settled-flat or mid-tween
  between two known endpoints. Mount paints synchronously pre-paint (incl.
  restored scroll); theme swap repaints instantly under the 0.5s CSS fade;
  reduced-motion can only unmount, plus an explicit no-tween guard. Sections
  UNEDITED (`bg-blend` transparentizes home/about/skills; footer excluded).
  OFF (hard-cut fallback, zero GSAP bytes) on `prefers-reduced-motion` and
  `<640px`: `blendMedia.ts` gate + lazy chunk in `App.tsx` (≈116 kB / 46 kB
  gzip, desktop-only). Pattern parallax unchanged (own scrubbed tween,
  separate property).
- **Bug fixes (live device testing, iPhone 12 Pro / desktop).**
  - Bug 1 retake (navbar invisible at top on mobile): the hypothesized
    false-default does NOT exist — `useScrollDirection` already defaulted
    `isAtTop=true`/`direction='up'` (visible) AND ran a sync `update()` on
    mount. Most likely explanation is a stale tested build predating the
    step-10.3 tone flip (transparent bar + navy-on-navy text = fully invisible
    bar). Hardened anyway: state now initializes lazily from live
    `window.scrollY` (correct first paint even on restored mid-page reloads;
    'up'/visible stays the safe direction default). No behavior change on
    fresh loads by construction.
  - Wash history (SUPERSEDED by the state machine above — kept as one line
    each): per-boundary scrubbed fromTos fought over one property (white flash
    at mount) → single-writer procedural wash with sync init → settle-snap to
    dominant color (flickered on nudge) → narrowed plateau zones (still
    slope-sensitive). None of that code remains.
  - Change 3 (dark default): `getStoredTheme()` returns dark unless stored
    value is exactly `'light'` — returning visitors keep their saved light OR
    dark untouched. Companion fix in `index.html` anti-flash script (now adds
    `dark` unless stored is `'light'`) so first paint matches with no flash.
  - Bug 1 (mobile horizontal scroll + white gutters): two sources. (a) The
    Hero `NeuralNetwork` SVG is a grid item with only `w-full` — its
    automatic minimum size (intrinsic 480px canvas) could force its cell past
    narrow viewports; fixed with `min-w-0` (zero visual change otherwise).
    ScrollBackground was ruled OUT (never downloaded <640px via the
    blendMedia gate; parallax is Y-only anyway). (b) Card `hover:scale-1.02`:
    touch taps stick `:hover`, and transformed visual overflow counts toward
    page scrollable overflow → persistent gutters; scale moved to `.card-lift`
    in `global.css`, gated behind `(hover: hover)` + no-preference (sweep and
    shadow unchanged — clipped/non-overflowing).
  - Bug 2 (mobile menu taps didn't scroll): NOT a separate handler — mobile
    links already called the same `handleNavigate`. Root cause was a reflow
    race: closing the panel collapses ~200px of sticky-header height DURING
    the native smooth scroll, corrupting its destination (desktop has no
    collapsing panel, so it worked). Fixed by sequencing: mobile taps queue
    the id and scroll on `AnimatePresence onExitComplete`; manual toggle
    clears a stale queue.
  - Bug 3 (desktop landing tucked under navbar): off-by-one — the bar renders
    65px (h-16 + 1px border-b) but sections used `scroll-mt-16` (64px). All
    four sections now `scroll-mt-[65px]` (Hero exempt: top-of-page clamp).
  - Bug 4 (residual gutters at 320–414px): no further deterministic source
    found after Bug 1 (fieldset min-content ≈200px < 272px min content width;
    tooltips clipped by card `overflow-hidden`; no w-screen/neg-margins
    anywhere). If gutters persist live, suspect Safari-specific rendering —
    needs live DOM inspection.
- **Narrow-section-background report (investigated — hypothesis DISPROVEN, no
  code change).** A ~440px screenshot showed section bgs as narrow centered
  boxes with white gutters; suspected `max-w-*` on outer `<section>`s.
  Exhaustive audit: EVERY outer section/footer (`Hero/About/Skills/Projects/
  Contact/Footer`, plus bare `<main>`/`<header>`) is an unconstrained block
  with the bg on itself — all 12 `max-w-*`/`mx-auto` hits in `src/` are inner
  content divs, chat bubbles, or the navbar row. Full-bleed is structural, so
  no fix was applied (a `w-full` sprinkle would be a visual no-op). NOT a
  regression from the `min-w-0`/card-lift/scroll-mt fixes either — none touch
  widths, and Bug 1's overflow could only ever paint bgs WIDER, never
  narrower. To identify the true cause live: confirm the tested build matches
  this source (stale cache), check browser zoom level, re-test outside
  DevTools emulation, and inspect computed `width`/`margin` of `section#home`
  plus `document.body.scrollWidth` vs `window.innerWidth`.
- **Contact horizontal overflow (real device — root cause found + fixed).**
  The mobile grid (`grid` + `lg:grid-cols-5`) had NO explicit template below
  lg → single implicit `auto` column, whose minimum is the largest item
  min-content. The `truncate`d LinkedIn URL (~60ch, nowrap ≈ 420px) propagates
  upward — `overflow:hidden` and the inner `min-w-0` do NOT cap min-content
  (they govern clipping/shrinkability, not intrinsic size; this corrects the
  Bug 4-era assumption) — forcing the shared track to ~510px on a 390px
  viewport. Both grid items share that track, so inputs/cards/buttons all
  extended past the edge by the SAME amount + page scrollbar. Mobile-only
  because Tailwind's `lg:grid-cols-5` is already `minmax(0,1fr)`; only the
  implicit mobile column was `auto`. Fix: one class,
  `grid-cols-[minmax(0,1fr)]` (explicit 0-minimum single column; truncate
  still clips the URL by design). The notice-box "ghost text" is attributed
  to the same overwide box (border rendered off-screen) — confirm gone on
  re-test; if it persists independently, it needs its own screenshot.
  Audit: Contact's implicit-`auto` mobile grid was the only vulnerable grid
  left (Skills/Hero base columns max out ~185px/~100px; Projects uses explicit
  `grid-cols-1` = minmax-0; NN svg already has `min-w-0`).
- **Responsive pass (step 10.2): static class audit, no browser harness.**
  One fix: `Skills` was missing `scroll-mt-16` (anchor jumps hid its heading
  under the sticky navbar; About/Projects/Contact already had it). Everything
  else passed inspection — bento 1col→`md:`2col→`lg:`4col with lg-only spans
  (clean tablet reflow), cards `overflow-hidden` (no grid blowout), chart uses
  ResizeObserver sizing (no %-height collapse), inputs `w-full` + textarea
  `resize-y`, channel values `truncate`+`min-w-0`, SVGs scale via viewBox.
  NEEDS HUMAN VISUAL CHECK (no browser here): real rendering at
  320/375/768/1024/1440/1920 (overflow, bento reflow, chart/caption legibility
  at tablet width, 11–13px captions/chat bubbles on small screens, glyph
  coverage at 320px and ultrawide), Safari grid/backdrop-filter, mobile FPS.
- **Accessibility pass (step 10.3): static audit + computed contrast, no
  screen reader / live keyboard session.**
  - Contrast (exact ratios computed): fixed REAL fails — navbar floated over
    the navy Hero in light mode with navy text (~1:1, logo/links/toggle/
    hamburger all unreadable at top); active gold link on light backdrops
    (1.97:1). Navbar now flips tone on `isScrolled` (light text over Hero,
    navy on its whitish backdrop; `ThemeToggle light` prop; mobile panel
    keeps navy-on-light since it has its own backdrop). Bumped token-opacity
    text that failed AA: skeleton/placeholder/year/captions
    (`primary/40→/70`, `/50→/70`, `/60→/70`, dark sides `/40→/60`, `/50→/60`)
    and form placeholders (`secondary-gray/50→/60`, was 4.44). Everything else
    ≥4.5 by computation. RESIDUAL (spec-mandated, flagged not fixed): gold
    `hover:text-accent` over white backdrops (~2:1, ui-spec §1 requires gold
    hover states) and gold focus rings on light sections (~2:1 vs 3:1
    AAA-only criterion; AA size criterion met by 2px rings).
  - Keyboard/focus: ADDED skip-to-content link (`App.tsx` → `#main-content`,
    `tabIndex -1`); Escape now RETURNS focus to the hamburger (was left on
    the unmounted link). Panel is a non-modal disclosure → deliberately NO
    focus trap; Tab flows in DOM order, Escape restores trigger. Field errors
    now `role="alert"` (were visual + describedby only). Verified complete:
    chart/chat `role="img"` + describedby captions + aria-hidden innards,
    labels/htmlFor/invalid/describedby, aria-current, icon aria-hidden,
    40px touch targets, DOM order = visual order, zero `<img>` (alt N/A).
  - NEEDS HUMAN CHECK: live Tab walkthrough, SR announcement of errors/live
    regions/chart descriptions (VoiceOver/NVDA), focus-ring visibility
    judgment on light sections, theme-toggle persistence already covered.
- **SEO meta tags (step 10.4):** `index.html` has identity/field title,
  `meta description` (derived from content.md Hero/About, nothing invented),
  OG `title`/`description`/`type=website`; `og:url` + `og:image` are TODO
  comments (no deployed URL, no share-image asset in `public/` — nothing
  faked). `lang="en"` confirmed (site content is English; Thai appears only
  in mock chat bubbles), `viewport` present since scaffold. Heading hierarchy
  re-verified by grep: 1× `h1` (Hero) → 4× section `h2` → `h3` for Skills
  categories + project titles under Projects; Footer has no heading.
- **Lighthouse follow-up (fixes + re-run, same method, 2026-09-26).**
  - Fixes: (1) fonts self-hosted — 3 variable woff2 (latin) in `public/fonts/`,
    8 `@font-face` rules (header 600/700, body+mono 400/500/600 = weights used
    in src), `font-display: swap`, Google `<link>`s deleted (zero external
    font refs in dist); (2) EmailJS `await import()` on submit — VERIFIED via
    dummy-env build that it splits into a 3.5KB async chunk (`es-*.js`); in
    the real unconfigured build Vite folds missing env to `undefined` and
    DCEs the whole send path, so EmailJS contributes 0 bytes either way (the
    old 54KB "unused" was fw/animation internals, not removable);
    (3) channel `aria-label`s now start with the exact visible text (colon
    removed).
  - AFTER — MOBILE: Perf **81→90** ✅ (≥85 PASS) · A11y 96→**100** ✅ ·
    FCP **3.4→2.7s** ❌ (still >2s) · LCP 3.9→3.1 · TBT 0→40ms · CLS 0.001.
    DESKTOP: Perf 98→**99** ✅ · A11y still **96** · FCP 0.9→**0.6s** ✅.
  - Fonts fully cleared from render-blocking list (only own index.css ~152ms
    remains); remaining mobile FCP bottleneck un-isolated (JS payload/parse
    on throttled CPU is the standing suspect — needs profiling, not guessing).
  - Desktop-only a11y anomaly (deterministic ×2 runs, mobile clean, same DOM):
    24 Skills pills flagged for contrast + 3 channel links for label-mismatch.
    Pills compute 13.6:1 statically, so this smells like axe resolving their
    backdrop past the transparent `bg-blend` sections to body-white — EXCEPT
    hero white text passes under the same theory, so the mechanism is NOT
    fully derivable statically (leading theory: the pills' own translucent
    `bg-secondary-light/5` interacts with axe's compositing; isolation test
    for follow-up). Same viewport-correlation puzzle on the links (mobile
    cleared, desktop persists). Human-verified contrast still passes; this caps
    LH-desktop-a11y at 96, not tests.md §4 itself.
  - BASELINE (before fixes, same method) for comparison:
    MOBILE: Perf **81** ❌ (target ≥85) · A11y 96 · BP 100 · SEO 91.
    FCP **3.4s** ❌ (target <2s) · LCP 3.9s · CLS 0.001 ✅ · TBT 0ms · SI 3.4s.
  - DESKTOP: Perf **98** ✅ · A11y 96 · BP 100 · SEO 91.
    FCP **0.9s** ✅ · LCP 0.9s · CLS 0.001 ✅ · TBT 0ms.
  - Top flagged audits (both runs): `render-blocking-insight` (Google Fonts
    CSS ~900ms mobile / ~580ms desktop; index.css ~156ms) · `unused-javascript`
    (main bundle ~54KB wasted/44%; EquityCurveChart chunk ~49KB/48%; desktop
    also ScrollBackground ~21KB) · `color-contrast` (ONE node: ChatDemo bot
    bubble caught at `opacity: 0` mid-loop-fade — measurement artifact, static
    ratio ≈15.9:1 passes) · `label-content-name-mismatch` (3 Contact channel
    links: aria-label vs visible text) · `robots-txt` (preview-server artifact:
    SPA fallback serves index.html for /robots.txt; passes on static hosts
    with 404). `llms-txt`/`ard-schema` scored 0 but are unweighted
    experimental (agentic-browsing category 50 — out of scope for tests.md).
    SEO 91 explained ENTIRELY by robots-txt (sole failing weighted SEO audit).
  - Verdict: desktop passes everything; mobile needs a perf follow-up (fonts
    render-blocking + JS payload are the quantified causes). NOT fixed in this
    pass (measurement-only by design).
- **Mobile FCP gap closed as ARCHITECTURAL LIMIT (profiled, no code change).**
  Fresh mobile trace (prod+preview): FCP 2.8s = ~207KB critical bytes
  (125KB-gzip main JS + CSS + Playfair/Inter woff2, all firing at t=0) on
  simulated slow-4G + 486ms scripting + empty-`<div id="root">` (ZERO paint
  possible before React mounts). Main thread NOT saturated (TBT 30ms), CSS
  blocking only 152ms, fonts swap — so no trim fixes it: only cutting
  ~100KB+ critical JS (framer-motion — invasive, underpins the Bug 2
  exit-sequencing) or SSR/prerender (out of scope) would move it. Below-fold
  chunks (recharts/GSAP/demo, ~218KB) do fire at t=0 — real waste, but
  post-execute, so gating them wouldn't move FCP either (noted, not done).
  DECISION: accept ~2.7–2.8s simulated FCP; tests.md's headline target
  (Performance ≥85) passes at 90, desktop FCP is 0.6s, real devices beat the
  Moto-G4-class simulation. FCP<2s stays officially open but will-not-fix
  without an architecture change.
- **Wash-out of outgoing section mid-crossing (root cause found + fixed —
  NOT a z-index bug).** Symptom: during a Hero→About crossing, Hero's
  foreground (CTA buttons, tagline, NeuralNetwork SVG) faded toward
  invisibility while About's heading/paragraph in the same viewport stayed
  full-contrast; at rest (e.g. inside Skills) everything was normal.
  - Stacking hypothesis DISPROVEN by audit: the wash wrapper is still
    `fixed inset-0 -z-10` (`ScrollBackground.tsx`), painting above the canvas
    but strictly below all section content (Hero `relative` z-auto + all
    in-flow section boxes paint above negative z-index per spec). The
    `opacity-[0.07]` pattern layer's stacking context is a *child* of the
    wash wrapper and cannot lift it; no ancestor carries transform/opacity/
    filter; GSAP writes only `backgroundColor` (wash) + `translateY` (pattern
    child); Framer Motion is confined to Navbar-panel/ThemeToggle/ChatDemo
    subtrees that never contain the wash. No section carries an opacity
    animation, and `.bg-blend` transparency is a binary `<html>` class — so
    there is no per-frame "double fade" either. (No git repo exists, so
    history-diffing was impossible; the current source matches this doc's
    description exactly — no ordering regression is present to revert.)
  - Actual mechanism (contrast physics, not paint order): `useScrollSpy`
    flips on most-visible-pixels (~50% crossing), so at flip moment ~half the
    viewport is still the outgoing section while the single flat wash tweens
    navy `#002856` → white `#FFFFFF` (mid-tween ≈ light steel `#8094AA`).
    That one floor sits under BOTH foregrounds: Hero's white/gold
    foregrounds collapse against it (white-on-mid ≈ 3:1 and falling,
    gold-on-light ≈ 2:1, NN strokes already at 20–40% opacity) — reading as
    a white overlay fading Hero only — while About's navy foreground gains
    contrast on the same floor. Settled-straddle is equally unsound
    statically (e.g. settled About-white + Hero tail visible = white-on-
    white); the 0.5s tween just animates it so the eye catches it as fading.
    Architectural rule: a flat wash + transparent sections cannot serve
    opposite-tone (Navy ↔ White) neighbors sharing one viewport — and in
    light mode EVERY adjacent pair is opposite-tone. Dark mode (all-navy
    palette, white foregrounds) is immune by construction.
  - Fix (minimal, preserves ui-spec §5.1 where sound): the blend is now
    dark-mode only. `ScrollBackground` gates `blendOn` on `theme === 'dark'`
    (renders null otherwise — same path as mobile/reduced-motion); `App.tsx`
    adds the same condition to the lazy-chunk gate so light mode never
    downloads the ~116 kB GSAP chunk; `global.css` `.bg-blend` comment
    updated (also corrected the stale `SMOOTH_BOUNDARIES` symbol name to
    `SMOOTH_INTO`). Light mode keeps the designed solid alternating section
    bgs — hard-cut boundaries scroll with the content, always correct
    contrast. Default theme is dark (Change 3), so most visitors still get
    the blend. Side benefit: may resolve the Lighthouse-desktop-a11y-96
    anomaly (axe resolving pill backdrops past transparent sections only
    existed in light-mode runs) — confirm on next live run. `tsc` + `vite
    build` + `oxlint` all clean.
- **ThemeToggle invisible over Hero in light mode — ROOT CAUSE FOUND +
  FIXED (third investigation; the first two were wrong).** Pixel screenshot,
  not computed styles, settled it.
  - Symptom: light mode, scroll-top — toggle rendered as an empty circle
    while "Home" showed gold.
  - **Why the first two investigations missed it:** both checked the icon's
    OWN computed properties (`color`, `opacity`, the real `<svg>`), which
    were all CORRECT — and computed style cannot see what is painted *behind*
    the element. Investigation 1 additionally *assumed* the backdrop was the
    navy Hero and computed 14.6:1 from that assumption; the assumption was
    never verified. Investigation 2 (a candidate Framer-Motion stuck-at-
    `opacity: 0` bug) was genuinely disproven and is retained below only as a
    ruled-out note.
  - **Actual root cause (pixel-proven):** `Navbar`'s `<header>` is
    `position: sticky`, i.e. IN FLOW, so at scroll-top it does NOT overlay
    the navy Hero — it occupies the top 65px and `#home` starts at y=65
    (rect.top=65; body bg = `#FFFFFF` in light mode). The tone logic
    `barTone = isScrolled ? 'onLight' : 'onDark'` therefore painted LIGHT
    text on the WHITE page background at scroll-top in light mode: a white
    moon icon on a white body = invisible (1:1), leaving only the faint
    `border-primary/15` ring — the "empty circle". The WHOLE light-mode
    navbar was affected (logo, idle links, hamburger, toggle all
    `text-secondary-light`); only the gold active link stayed visible, which
    is exactly what the screenshot showed. Dark mode never broke because the
    body is `#001631`.
  - **Pixel evidence** (headless Chrome via CDP `Page.captureScreenshot`
    clipped to the button rect @8×; PNG decoded by an in-page `<canvas>` so
    the actual painted RGBA values are read):
    - BEFORE fix, light, scroll-top: button region 100% light — **dark pixels
      0/102400**, center pixel `[255,255,255]`, edge `[255,255,255]`,
      uniqueColors 55 (border AA only). A 40×160 strip read white for y=0–64
      and navy `[0,40,86]` from y=65 down — independently proving the navbar
      sits on the white body, not on Hero navy.
    - Dark mode (same clip): region reads `[0,22,49]` with visible icon
      strokes — dark mode always painted correctly.
    - AFTER fix: **dark pixels 5094/102400 (4.97%)**, uniqueColors 265 — a
      real navy crescent on the white button (≈ the expected stroke area of
      the 20px icon in a 40px button).
  - **Fix (`Navbar.tsx`):** read the theme and set `barTone = theme ===
    'dark' ? 'onDark' : 'onLight'` (was `isScrolled ? 'onLight' :
    'onDark'`). Both the transparent top state (page background) and the
    scrolled state (the bar's own translucent backdrop) follow the THEME, so
    the readable tone is theme-based; the `isScrolled` flip rested on a layout
    assumption that was false. `isScrolled` still drives the bar's backdrop /
    blur / border, and dark-mode behaviour is unchanged. The `light` prop on
    `ThemeToggle` is now only ever true on the dark scheme (where
    `dark:text-secondary-light` already applied), so it is effectively
    redundant but harmless.
  - Verified: `tsc` + `vite build` + `oxlint` clean; pixel re-check above.
  - Ruled out along the way (so a future session need not retry them): no
    overlapping/covering sibling (only one child `SPAN`; `::before`/`::after`
    `content: none` on button and span; `elementsFromPoint` lists the `<svg>`
    topmost); no SVG corruption (moon `d` is the full 110-char lucide path,
    `getBBox` ≈ 18×18 in the 20px box); no clipping (`overflow: visible`, SVG
    rect 20×20 at (1218,22)); not a DPR/engine artifact (dpr=1; same result on
    desktop 1280×900 and mobile 390×844). Framer-Motion lifecycle (the second
    investigation's hypothesis) is NOT the cause: with the real library, the
    first render emits `style="opacity:1;transform:none"` and
    `initial={false}` suppresses the mount animation, so the icon never sits
    at `opacity: 0`.
- **Contact / backend decision: EmailJS** (`@emailjs/browser`, client-side — fits
  the static SPA, no server). Credentials via `VITE_EMAILJS_SERVICE_ID` /
  `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` (see `.env.example`);
  real IDs are now present in `.env` (see §1b), so the form is enabled on the
  production build; the "isn't configured yet" notice + disabled fieldset is
  the fallback path when any var is missing. Template params sent:
  `from_name`, `reply_to`, `message`. Validation is custom inline (noValidate +
  per-field errors, aria-describedby). **Live send unverified** — credentials
  now exist in `.env`; only a manual end-to-end test remains.

## 4. Final Gate — tests.md Status + Remaining Live-Verification Checklist

**Status key:** ✅ pass (verified in code/build) · 🔲 needs live browser/device
check · ➖ not applicable. Full table (tests.md order):

| # | Item | Status |
|---|---|---|
| 1 Nav smooth-scroll to section | scrollIntoView + 65px offset in code | 🔲 feel/landing |
| 1 Nav scroll-spy highlight | IO logic in code | 🔲 live |
| 1 Nav hide/show | direction logic in code | 🔲 live |
| 1 Hamburger open/close | AnimatePresence + Escape in code | 🔲 live |
| 1 Dark/light toggle transition | classes in code | 🔲 visual |
| 1 Persist theme on refresh | pre-paint script + STORAGE_KEY sync | ✅ |
| 1 Contrast readable both modes | computed ratios ≥4.5 | ✅ |
| 1 Smooth bg color change | scrub triggers in code | 🔲 stutter check |
| 1 Pattern shifts, low opacity | 7%, parallax, aria-hidden in code | 🔲 feel |
| 1 Card glass hover | pseudo-element in code | 🔲 feel |
| 1 Chart displays per data | deterministic data + code | 🔲 render |
| 1 Chart tooltip on hover | headless hover rendered tooltip | ✅ |
| 1 NN visual, no slowdown | seeded per-element CSS fire, no JS loop | 🔲 FPS |
| 1 Form incomplete → errors | validation + role=alert in code | 🔲 render |
| 1 Bad email → error | regex + role=alert in code | 🔲 render |
| 1 Valid send → success | creds now in `.env`; live send NOT fired | 🔲 manual |
| 1 Social links correct | hrefs verbatim, target/rel in code | ✅ |
| 2 Widths 320–1920, no overflow | class audit, overflow fixes landed | 🔲 render |
| 2 Charts scale w/o distortion | viewBox/RO sizing in code | 🔲 render |
| 2 Bento 1–2 col mobile/tablet | 1→md:2→lg:4 in code | 🔲 render |
| 3 Lighthouse ≥85 | MEASURED: mobile **81→90** ✅ / desktop 98→**99** ✅ | ✅ PASS both (was: mobile ❌) |
| 3 FCP <2s | MEASURED: mobile **2.7–2.8s** / desktop **0.6s** ✅ | Accepted architectural limit (SPA empty-root; see §3). Real devices beat simulation. |
| 3 Low CLS | MEASURED: **0.001** both runs, before and after | ✅ |
| 3 Mobile animations reduced | blendMedia/CSS gates in code | ✅ |
| 4 Contrast AA | computed, fixes landed | ✅ |
| 4 Keyboard nav, no traps | DOM order, skip link, Escape-return in code | 🔲 walkthrough |
| 4 Visible focus states | 2px rings in code | 🔲 judgment |
| 4 Images have alt | zero `<img>` in src | ➖ |
| 5 Title + meta description | in index.html, in dist | ✅ |
| 5 OG tags | title/desc/type ✅; url/image = pre-launch TODOs | ✅* |
| 5 Heading hierarchy | grep-verified h1→h2→h3 | ✅ |
| 6 Chrome / Safari / Firefox | — | 🔲 all three |
| 7 Content matches content.md | verbatim pipeline | ✅ |
| 7 No TODO links outstanding | no TODOs in content.md | ✅ |

**Remaining live-verification checklist (human-only rollup, nothing to code):**
- Render pass 320/375/768/1024/1440/1920: overflow, bento reflow, tablet
  chart/caption legibility, 11–13px microcopy, glyph coverage extremes.
- Scroll feel: blend smoothness, parallax non-interference, card hover,
  tooltip hover, NN FPS, mobile FPS ≥30, Lighthouse/FCP/CLS numbers.
  Hard-reload wash check: Hero navy (not white) before first scroll.
- Nav/menu: smooth landings vs 65px offset, spy, hide/show, hamburger,
  mobile-link sequencing (Bug 2 fix), theme visual transition.
- Keyboard + SR: full Tab walkthrough, error/live-region/chart announcements
  (VoiceOver/NVDA), focus-ring judgment on light sections, skip link.
- Contact end-to-end send — creds now present in `.env`; do one manual send.
- Open `./docs/tests.md` items above marked 🔲, one by one.
- Open threads to close live: notice "ghost text" retest, narrow-bg report
  items (build freshness, zoom, computed widths), Safari grid/backdrop-filter.

**Pre-launch TODOs (not code defects):** manual end-to-end Contact send test
(EmailJS creds are now in `.env`); `og:url` deployed URL; `og:image` share
asset; domain + hosting choice (specification.md §7 was never filled in).

## 5. Former Open Item: GSAP — RESOLVED

**GSAP (`^3.15.0`, incl. ScrollTrigger) is now installed and used** — first
real usage in the codebase (grep `gsap` under `src/` shows only step-10.1
files: `Background/ScrollBackground.tsx`, `Background/blendMedia.ts`,
`App.tsx` lazy wiring). Per spec (agent.md §3) for scroll-linked background
and parallax; Framer Motion remains the UI/mount-animation library. No
further GSAP work is planned unless a later polish part needs it.
