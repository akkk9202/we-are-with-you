# Broken Link Check Workflow

Purpose: Systematically verify that every link on **WE ARE WITH YOU** resolves — internal pages, outbound Google Forms, press links, and redirect stubs. This is a manual procedure (there is no crawler in the build).

## When to use
- Before a deploy that touched links, navigation, partners, or press.
- Periodically, as a health check.
- After renaming/moving any page (rare — usually forbidden).

## Preconditions / read first
- `checklists/hyperlink_checklist.md`.
- `automation/reference/form-keys.md` and `automation/reference/slugs.md`.

## Steps
1. **Internal page links.** For every `href` / nav item, confirm the target `.html` file exists in the repo root and (for partner pages) the `?p=<slug>` slug is one of: `cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`, `disability`, `schools-global`.
2. **Redirect stubs → live anchors.** Confirm each stub still exists AND its target anchor is still present on the destination page:
   - `voices-of-love.html` → `partner.html?p=cancer-care` (and similar)
   - Also verify: `taps-of-love.html`, `gyco.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`, `about-gyco.html`.
   - None of these stubs or their target anchors may be missing.
3. **Google Form links (`SITE.forms`).** In `js/content/global.js`, check each key: `studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest`.
   - A real value should be a working `https://` Google Form. Open each and confirm it loads.
   - A `REPLACE_ME` value is EXPECTED to route to the contact page — that is not a broken link, it is the safe fallback. Note it, don't "fix" it with a fake URL.
   - Confirm every `data-form="<key>"` in content points at a key that exists.
4. **Press links.** In the press data (`SITE`), open each article URL. Preserve percent-encoded and Korean-bearing URLs exactly — verify they load, do not rewrite them.
5. **Partner card links.** In `js/partners.js`, confirm each card `href:"page.html"` targets a real page and each `form:"<key>"` matches a real `SITE.forms` key.
6. **Outbound/social links.** Confirm `https` and that domains are trusted and live.

## Verify
- Record a pass/fail per category. Re-run `npm install jsdom --no-save && node test/smoke.test.js` (80/0) since smoke tests assert rendered structure.
- Manual browser click-through of the changed areas (or `python3 -m http.server`).

## Guardrails / do NOT
- Do NOT "fix" a `REPLACE_ME` form key by inventing a URL.
- Do NOT rename slugs or delete stubs to make a link resolve — fix the link instead.
- Do NOT alter encoded/Korean press URLs.
- Do NOT commit/push/deploy unless explicitly asked.

## Done means
Every internal link, stub→anchor, form key, press link, and partner card link is confirmed resolving (or is a known-safe `REPLACE_ME` fallback), findings listed, tests 80/0.

## Related
- Checklist: `checklists/hyperlink_checklist.md`
- Reference: `automation/reference/form-keys.md`, `automation/reference/slugs.md`
- Workflow: `hyperlink_update_workflow.md`
