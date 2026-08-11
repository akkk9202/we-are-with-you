# WE ARE WITH YOU — design system (v7, Aug 2026 editorial redesign)

The reference feel: a real student-led community organization documented by an
editor — calm, warm, photograph-driven, specific. White pages, navy as the one
brand color, gold as a restrained accent. Real photography does the visual work;
copy states facts instead of slogans. No gradients, no glows, no floating
shapes, no scroll-hiding animations.

## What v7 changed (and must stay changed)

- **Photos first.** Documentary photographs with plain captions
  (`.photo-figure`, `.photo-duo`) replaced diagram SVGs, card grids, and
  decorative figures. Missing images get a `.photo-placeholder` block that says
  exactly what photo is needed — never a stock or AI image.
- **Eyebrow labels are gone** except genuine navigation labels in the media
  archive ("Most recent", season labels). Budget: ≤1 per page (tested).
- **Cards are reserved for actual cards** — the six partner-page action cards.
  Everything list-like uses `.index-list` directory rows or plain text.
- **One brand line**: "Even Here. Even Now. WE ARE WITH YOU." Other slogans
  ("One Philosophy…", "One Shared Template…", "Every Ending Becomes…") were
  removed and are asserted dead by `test/smoke.test.js` [redesign guardrails].
- **Internal language never renders publicly**: platform model, template
  structure, brand-consistency talk. Visitors experience the system; they don't
  read about it.
- **Left-aligned by default.** Centered text is reserved for the final CTA band
  and the one quiet quote (`.quiet-quote`).
- Homepage = exactly 7 sections (tested). Most pages: 3–7 sections.

## Typography
- **Display** Fraunces 500 — h1–h3, pull quotes, the `.step-line`. Matches printed QR flyers.
- **Body** Instrument Sans 400/500/600, 17px base, 1.7 line height.
- Scale: h1 2.1–3.3rem · h2 1.6–2.3rem · h3 1.15–1.35rem (clamped).
- Buttons are sentence case, normal tracking.

## Color
- **Primary** navy `--ink #13233A` — headings, primary buttons, dark bands, footer.
- **Accent** gold `--gold #C4A24E` — accents on dark and hairline details; never small text on white (2.9:1).
- Neutrals: page `--paper`, alternate band `--mist #F6F4EF`, hairline `--line`, secondary `--muted`.
- `--blue #3E6B8F` is a utility tone (small labels, links inside pillars).
- Dark navy bands are limited to page heroes, the final CTA, and the footer.
- Photography provides the rest of the visual variety.

## Spacing & structure
- Container 1100px; text measure 62ch; sections 5rem block (4rem mobile).
- Sections alternate paper → mist → paper; whitespace or a hairline divides, not boxes.
- Asymmetry is deliberate: 60/40 photo pairs, two-col with unequal weight,
  full-width photo after text. Avoid three-equal-card rhythm everywhere.

## Surfaces
- Radius 10px; 1px hairline borders instead of shadows (max shadow `0 1px 2px`).
- Hover: color/border change only.

## Buttons (two styles)
- **Primary** `.btn--gold`: solid navy/white on light; solid gold/navy on dark.
- **Secondary** `.btn--ink` / `.btn--ghost`: 1px outline, fills on hover.

## Motion
- One signature animation: the NADO + NADO → WE merge (our-philosophy.html, once, on scroll).
- Press feedback on the down-stroke (scale 0.96/0.99, 100ms).
- The flyer carousel keeps its gesture-driven spring engine (drag, momentum,
  interruptible spring). No autoplay.
- Everything else: 150–200ms color/border transitions. No staggered reveals,
  no content hidden before scroll. `prefers-reduced-motion` gets static paths.

## Copy rules (enforced by the guardrail tests)
- Specific beats inspirational: name the partner, the activity, the year.
- No invented statistics, dates, testimonials, or partners — placeholders say
  what's missing instead.
- Restrict: impact, journey, empower, transformative, ecosystem, platform,
  meaningful. Banned phrases listed in `test/smoke.test.js`.
- Voice rules → `context/brand_voice.md` (unchanged and still authoritative).

Tokens live at the top of `css/style.css`; the portal (`css/portal.css`) layers
on the same tokens and, since Aug 2026, the same type system — Fraunces +
Instrument Sans only (Fredoka/Gochi Hand removed). Inside the portal:
action > explanation. The home page is a personal welcome plus a five-row
action directory (With You featured, deliberately larger); communities are a
logo directory with an understated "Your community" status; My Activity is a
dated feed with quiet underline tabs; empty states are compact, never giant
dashed boxes; the five poster illustrations stay small where they identify an
action, and decorative clip art (flowers, smiley) is gone. Do not rename tokens.
