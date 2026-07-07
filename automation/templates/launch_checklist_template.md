# Launch / Major-Deploy Checklist Template

> **Purpose:** A final gate before launching or pushing a significant change to the live GitHub Pages site (`https://akkk9202.github.io/we-are-with-you/`).

## How to use this template

1. Copy this file per launch, e.g. `launches/2026-07-07-launch.md`.
2. Work top to bottom — do not skip. Every box must be checked (or explicitly marked N/A with a note).
3. The last item — commit/push authorization — is a hard stop.

---

## Launch details

- **Date:** ______
- **Branch:** ______
- **Change summary:** ______
- **Owner:** ______

## Content

- [ ] All new/changed copy reviewed for accuracy
- [ ] No leftover placeholder text that shouldn't ship (intentional `REPLACE_ME` / `TODO` render as safe fallbacks — confirm each is deliberate)
- [ ] Korean text and percent-encoded URLs preserved exactly

## Tone (audience includes patients and grieving families)

- [ ] Warm, humble, no overpromising / no medical or outcome claims
- [ ] Consistent with *"Even Here. Even Now. We Are With You."*
- [ ] Reviewed against `context/brand_voice.md`

## Media & accessibility

- [ ] All images load (correct paths under `assets/images` / `assets/logos`)
- [ ] Every image has meaningful `alt` text
- [ ] Mobile / responsive layout checked
- [ ] Basic accessibility check (headings, contrast, keyboard focus)
- [ ] Theme presets render correctly (`js/content/theme-options.js` / `css/theme.css`)

## Links, forms & routing

- [ ] All internal and external links resolve
- [ ] Every `data-form="key"` maps to a real `SITE.forms` key (`studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest`) or safely routes to contact
- [ ] All redirect stubs still resolve: `voices-of-love.html`, `taps-of-love.html`, `gyco.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`, `about-gyco.html`

## Invariants

- [ ] No partner **slug** renamed or removed (`cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`, `disability`, `schools-global`) — display changes done via `name` only
- [ ] No redirect stub deleted

## Tests

- [ ] `npm install jsdom --no-save`
- [ ] `node test/smoke.test.js` → **80 passed, 0 failed**
- [ ] `node --check js/site.js` → ok
- [ ] `rm -rf node_modules`

## Security & approval

- [ ] Security check completed (`directives/security_check_before_deploy.md`)
- [ ] Diff shown to and approved by: ______
- [ ] **Commit / push explicitly authorized by:** ______  **On:** ______  <!-- never push/PR/merge without this -->

---

**Launch decision:** [ ] GO   [ ] NO-GO   — Notes: ______
