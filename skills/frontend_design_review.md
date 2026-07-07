# Skill: Frontend design review

Use this to review visual/UX/accessibility quality of a page or change on this static site. It is a
**review procedure** — produce findings, don't silently restyle. Keep the existing design system;
propose changes, apply only what's approved.

## Scope & inputs

- Pages: any `*.html` plus the rendered output of `js/site.js` (nav, footer, cards, carousel,
  partner pages).
- Design system: `css/style.css` (CSS custom-property tokens + components). Reuse tokens; avoid
  one-off hardcoded colors/spacing.

## Checklist

### Layout & responsiveness
- [ ] No horizontal scroll / overflow at 320px, 768px, 1024px, 1440px.
- [ ] Nav collapses correctly (hamburger); dropdown ("Programs") is reachable on touch and keyboard.
- [ ] Cards, carousel, and press card reflow cleanly; images use `max-width:100%`.
- [ ] Content stays within `.container` / `.measure` widths; long partner names don't break layout.

### Accessibility (this audience needs it)
- [ ] Every image has meaningful `alt`; decorative marks use `aria-hidden`.
- [ ] Color contrast meets WCAG AA (body text and buttons, incl. `--muted` on its backgrounds).
- [ ] Keyboard: skip link works, focus rings visible, carousel controllable by arrow keys, dropdown
      openable via focus.
- [ ] Carousel exposes `aria-roledescription`, per-slide labels, and `aria-current` on dots
      (already implemented — verify after edits).
- [ ] Heading order is logical (single `h1` per page, no skipped levels).
- [ ] Motion is calm; no autoplay on the carousel (verify none is added).

### Visual consistency
- [ ] Uses existing tokens (`--gold`, `--ink`, spacing scale) rather than new hardcoded values.
- [ ] Buttons use the existing classes (`btn btn--gold/ink/ghost/sm`); no ad-hoc button styles.
- [ ] Typography (Fraunces / Instrument Sans) unchanged unless the task is typography.
- [ ] Fallbacks look intentional: missing logos → monogram chip; missing press image → styled `♪`.

### Tone-aware design
- [ ] Quiet sections (NICU, closings) stay visually calm — restraint over decoration.
- [ ] Nothing reads as an ad or hard sell.

## Verify

- Run `node test/smoke.test.js` (it asserts rendered structure: nav labels, card order, carousel
  behavior, ARIA, logo fallback). Expect `80 passed, 0 failed`.
- Check the page(s) at multiple widths in a browser.

## Output

Findings as: area, `file:line` (or component), severity, why it matters (esp. a11y impact), exact
fix, safe-to-fix-now. Apply only what the maintainer approves; keep changes minimal and within the
design system.
