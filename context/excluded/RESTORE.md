# Excluded content — NADO School & Join Us (Aug 13, 2026)

Aaron asked to exclude **NADO School** and **Join Us** from the public site *for now*,
keeping the content saved so it can come back later. Everything removed lives in this
folder. Nothing here is linked from the site.

## What was removed and where it came from

| Saved file / fragment | Original location |
|---|---|
| `learning-nado-school.html` | Full `learning.html` page (NADO School) before it became a redirect stub |
| `join-us.html` | Full `join.html` page (Join Us) before it became a redirect stub |
| `homepage-nado-section.html` | Homepage section "NADO School" (was section 6 of index.html) |
| `fragments.html` | Every smaller removed piece: nav entries, footer links, homepage Teach-pillar copy, CTA buttons, philosophy paragraph, meta description |

## How to restore

1. **Pages**: copy `learning-nado-school.html` back over `learning.html`, and
   `join-us.html` back over `join.html`.
2. **Nav** (`js/config.js` → `SITE.nav`): re-insert the two entries from `fragments.html`
   (NADO School after GYCO; Join Us between Philosophy and Contact).
3. **Homepage** (`index.html`): paste `homepage-nado-section.html` back between the
   About GYCO section and the final CTA; restore the Teach pillar lines and the
   "Get involved" CTA button from `fragments.html`; renumber the section comments.
4. **Footers**: restore the two `<li>` lines in `js/site.js` (About column) and the one
   in `js/portal/portal-core.js` from `fragments.html`.
5. **Philosophy page** (`our-philosophy.html`): restore the meta description, the
   "Three Parts, One Practice" NADO School paragraph, and the "Get involved" button
   from `fragments.html`.
6. **GYCO page** (`student-community.html`): restore the "Other ways to get involved"
   button from `fragments.html`.
7. **Tests** (`test/smoke.test.js`): re-add `learning.html` + `join.html` to
   `PUBLIC_PAGES` and the word-budget list; restore the NADO page block, the nav/footer
   assertions, and remove the two entries from the redirect-stub map. Run `npm test`.
8. Docs to un-edit: CLAUDE.md, EDITING-MAP.md, EDITING-GUIDE.md, DESIGN.md, README.md
   (each notes the exclusion where relevant).
