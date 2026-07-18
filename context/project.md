# Project context

## Summary

**WE ARE WITH YOU** is the public website for the **Greater Youth Collaborative Opus (GYCO)**, a
student-led nonprofit initiative. Students learn, create, serve, and lead — using music as the first
tool — and carry that into real communities: hospitals, family-support housing, NICUs, senior living,
disability communities, and partner schools.

The website's job is to **invite and connect**, not to transact. Its primary calls to action are
"open a partner page," "request a song / letter / teaching video," and "connect with us." Actual
intake happens through external Google Forms linked from the site.

## Audience

The people landing on these pages are often in hard moments: cancer patients and their caregivers,
parents in a NICU, families staying near a children's hospital, seniors and their families, people in
the disability community, and students/teachers. **Design and copy must be calm, warm, and never
clinical, salesy, or performative.**

## Information architecture

- **Home** (`index.html`) — mission, "why we exist," pathways overview, partner carousel.
- **Programs** (`programs.html`) — all partner pathways as cards.
- **Partner pages** (`partner.html?p=SLUG`) — one template, data-driven from `js/partners.js`.
  Current slugs (do not rename): `cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`,
  `disability`, `schools-global`.
- **GYCO** (`student-community.html`) — the student growth community.
- **NADO School** (`learning.html`) — the learning philosophy ("Nado / 나도" = "me too").
- **Media** (`media.html`) — featured bilingual press + gallery placeholders.
- **Join Us** (`join.html`), **Contact** (`contact.html`), **404**. (`about.html` is now a redirect stub → `index.html`; the philosophy content lives at the top of the homepage.)
- **Redirect stubs** — old URLs / printed QR codes (`voices-of-love.html`, `gyco.html`, …) forward
  to their new homes via `<meta http-equiv="refresh">`.

## Tech & constraints

- Static HTML/CSS/JS on GitHub Pages. **No backend, no build, no server headers.**
  (Security controls must be client-side or `<meta>`-based.)
- One stylesheet (`css/style.css`) with a token-based design system. Fonts load from Google Fonts.
- Content is centralized in `js/config.js` and `js/partners.js`; `js/site.js` renders it.
- Tests: `test/smoke.test.js` (jsdom). Requires transient `jsdom` install; see `CLAUDE.md`.
- Repo owner / GitHub: `akkk9202`. Default branch: `main`. Active work often on `design-upgrade`.

## Known open items (from config/partners TODOs)

- `SITE.email` and the six `SITE.forms.*` URLs are still `REPLACE_ME` placeholders.
- Several images are placeholders (`home-*.jpg`, `press-newswave25.jpg`, some partner logos) with
  automatic monogram/fallback rendering until real files are dropped in.
- Content-Security-Policy is intentionally **not** yet added (deferred; needs local render testing
  because of inline scripts and inline `onerror` handlers).

## What "done" looks like for changes here

Minimal, reversible edits; brand voice preserved; smoke tests green; legacy slugs and QR-code URLs
intact; nothing pushed without explicit approval.
