# Hyperlink Checklist

Purpose: Verify every link change resolves and routes safely.
When to run: After changing any link, form URL, or `data-form` reference.

## Internal links
- [ ] Internal links point to real pages and resolve (no 404).
- [ ] Redirect stubs still forward correctly (voices-of-love.html, taps-of-love.html, gyco.html, we-are-with-you.html, beat-and-breeze.html, winds-of-love.html, about-gyco.html).

## Forms (Google Forms via SITE.forms)
- [ ] Form URLs set in `js/content/global.js`, or intentionally left as REPLACE_ME.
- [ ] REPLACE_ME keys route safely to the contact page (never a broken link).
- [ ] `data-form="key"` values are valid keys: studentApplication, partnerInquiry, songRequest, letterSubmission, hopeCapsule, teachingVideoRequest.
- [ ] No invented/placeholder Google Form IDs.

## External links
- [ ] External links open with safe attributes (target/rel where appropriate).
- [ ] Press / featured links point to the correct source.
- [ ] Korean and percent-encoded URLs left intact and unaltered.

## Verify
- [ ] No dead links across changed pages.
- [ ] `node test/smoke.test.js` → "80 passed, 0 failed".
