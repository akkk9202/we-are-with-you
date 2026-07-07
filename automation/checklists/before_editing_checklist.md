# Before Editing Checklist

Purpose: Make sure an edit is scoped, safe, and lands in the right file before you change anything.
When to run: Before starting ANY edit to the WE ARE WITH YOU site.

## Understand the task
- [ ] Restate the task in one sentence (what changes, on which page/partner).
- [ ] Confirm the change is in scope — don't touch design, layout, copy, images, or nav unless that IS the task.
- [ ] Note the tone: audience includes hospital patients and grieving families ("Even Here. Even Now. We Are With You.").

## Confirm it touches no invariant
- [ ] No partner slug is being renamed (cancer-care, ronald-mcdonald-house, nicu, senior-living, disability, schools-global) — change the `name` field instead.
- [ ] No redirect stub is being deleted (voices-of-love.html, taps-of-love.html, gyco.html, we-are-with-you.html, beat-and-breeze.html, winds-of-love.html, about-gyco.html).
- [ ] No form key invented — SITE.forms keys are studentApplication, partnerInquiry, songRequest, letterSubmission, hopeCapsule, teachingVideoRequest.
- [ ] REPLACE_ME / TODO values left as safe fallbacks — never fabricate a URL or contact value.
- [ ] Korean text and encoded URLs preserved exactly.

## Find the owning file (use EDITING-MAP.md)
- [ ] Page content → `js/content/pages/`
- [ ] Global settings (SITE object: contact, forms, nav) → `js/content/global.js`
- [ ] Images/videos → `js/content/media-assets.js`
- [ ] Theme presets → `js/content/theme-options.js` and `css/theme.css`
- [ ] Partner/pathway content (PARTNERS object) → `js/partners.js`
- [ ] Renderer engine `js/site.js` and base tokens `css/style.css` — edit only if unavoidable.

## Prefer data files over HTML
- [ ] Confirm the change belongs in a data file, not hand-edited HTML.
- [ ] If tempted to edit HTML directly, re-check whether a data file drives that content.

## Set up and plan verification
- [ ] Confirm you are on the intended working branch (not committing to main unless asked).
- [ ] Plan to keep the diff minimal.
- [ ] Plan the verification: `node test/smoke.test.js` (expect "80 passed, 0 failed") and `node --check js/site.js`.
