# Partner Safety Checklist

Purpose: Protect partners and vulnerable audiences when editing partner/pathway content.
When to run: Before/after any change to `js/partners.js` or partner-related pages, forms, or logos.

## Slugs and URLs (load-bearing)
- [ ] Never rename a slug — printed QR codes depend on them. Change the visible `name` field instead.
- [ ] Slugs remain exactly: cancer-care, ronald-mcdonald-house, nicu, senior-living, disability, schools-global.
- [ ] Partner still reachable via `partner.html?p=SLUG`.
- [ ] Redirect stubs for that partner intact (e.g. voices-of-love.html → cancer-care).

## Forms
- [ ] `data-form` on partner CTAs maps to a valid SITE.forms key (studentApplication, partnerInquiry, songRequest, letterSubmission, hopeCapsule, teachingVideoRequest).
- [ ] REPLACE_ME form keys route safely to the contact page — never a broken CTA.

## Tone and claims
- [ ] Language is appropriate for patients and grieving families ("Even Here. Even Now. We Are With You.").
- [ ] No overpromising outcomes, medical claims, or guarantees.
- [ ] No exposure of private/identifying details of patients or families.

## Logos and permissions
- [ ] Partner logo in `assets/logos` is correct and current.
- [ ] Permission exists to display the partner's name/logo and any photos.
- [ ] Alt text for the logo names the partner.

## Verify
- [ ] `node test/smoke.test.js` → "80 passed, 0 failed".
