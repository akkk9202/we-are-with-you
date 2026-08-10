# WE ARE WITH YOU — design system (v6, Aug 2026)

The reference feel: a well-run nonprofit / healthcare organization — calm, warm,
editorial. White pages, navy as the single brand color, gold as a restrained
accent, real photography and the hand-drawn program diagrams doing the visual
work. No gradients, no glows, no floating shapes, no scroll-hiding animations.

## Typography
- **Display** Fraunces 500 — h1–h3 and pull quotes only. Matches printed QR flyers.
- **Body** Instrument Sans 400/500/600, 17px base, 1.7 line height.
- Scale: h1 2.1–3.3rem · h2 1.6–2.3rem · h3 1.15–1.35rem (clamped).
- Small caps (eyebrows, nav, tags): 0.72–0.78rem, tracking ≤0.14em, used as
  labels only — never gold-on-white (contrast).
- Buttons are sentence case, normal tracking.

## Color
- **Primary** navy `--ink #13233A` — headings, primary buttons, dark bands, footer.
- **Accent** gold `--gold #C4A24E` — backgrounds/borders/underlines and text on
  dark only; never small text on white (2.9:1).
- Neutrals: page `--paper #FFFFFF`, alternate band `--mist #F6F4EF`,
  hairline `rgba(19,35,58,0.12)`, secondary text `--muted #5B6472`.
- `--blue #3E6B8F` is a utility tone (tags, small labels); not a second accent.
- Dark bands stay flat navy — the "quiet evening" register of the brand — and
  are limited to hero, one philosophy band, Circle of Love, final CTA, footer.

## Spacing & structure
- Container 1100px; text measure 62ch; sections 5rem block (3.25rem mobile).
- Section heads are left-aligned editorial; figures/diagrams center; centered
  text is reserved for short statements and the Circle of Love.
- Grids only where content is truly a set (6 partners, 4 series, form options).
  Menu-like content uses the `.index-list` directory rows instead of cards.

## Surfaces
- Radius 10px everywhere (cards, images, buttons, inputs).
- 1px hairline borders instead of shadows. Max shadow anywhere: `0 1px 2px`.
- Hover: color/border change only — no translateY lifts, no glow.
- Images: radius + hairline, no frames or drop shadows; photography sized
  generously (media grid, invitation figure, carousel).

## Buttons (two styles only)
- **Primary** (`.btn--gold`): solid navy / white text on light surfaces;
  solid gold / navy text on dark surfaces.
- **Secondary** (`.btn--ghost`, `.btn--ink`): 1px outline in the surface's
  text color; fills on hover.
- Same padding (0.7rem 1.4rem), same radius, sentence case, 0.92rem.

## Motion (fluid-interface layer)
- One signature animation: the NADO + NADO → WE merge (scroll-triggered, once).
- Press feedback is instant and on the down-stroke: buttons/arrows/dots scale
  to 0.96, rows and cards to 0.99, 100ms ease-out.
- The carousel is gesture-driven, not scripted: 1:1 pointer tracking from the
  grab point, rubber-banding past the ends, momentum projection on release
  (decay 0.998) choosing the target slide, and an interruptible spring
  (response 0.35s; critically damped, bounce 0.85 only after a real flick)
  with the release velocity handed off — a moving carousel can be grabbed
  mid-flight. Rest state returns to percent transforms so resize stays exact.
- Nav is a translucent material once scrolled (blur 18px, saturate 160%) with
  a soft scroll-edge fade instead of a hard divider; dropdowns materialize
  from their trigger (top-left origin, 160ms); the mobile drawer enters with
  a 220ms ease-out slide.
- Everything else: 150–200ms color/border transitions. No infinite loops,
  no staggered reveals, no content hidden before scroll.
- `prefers-reduced-motion` gets the instant static paths (spring engine off);
  `prefers-reduced-transparency` and `prefers-contrast` get a solid nav.

Tokens live at the top of `css/style.css`; the portal (`css/portal.css`) layers
its own playful theme on the same tokens — do not rename tokens.
