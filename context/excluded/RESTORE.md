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

---

# Excluded content — Northside NICU (Aug 19, 2026)

Aaron removed **Northside NICU** from the site and portal — there is no
active partnership. Everything removed is saved in this folder; the
`nicu`/`northside-nicu` slugs were retired but old links and QR codes
degrade gracefully (partner.html?p=nicu → the community chooser fallback;
community/northside-nicu.html → redirect stub → communities.html).

## What was removed and where it came from

| Saved file / fragment | Original location |
|---|---|
| `nicu-partner-block.js` | The `"nicu"` block of `js/partners.js` (order 3) |
| `northside-nicu-portal-page.html` | Full `community/northside-nicu.html` portal page before it became a redirect stub |
| `northside-nicu-logo.png` | `assets/logos/northside-nicu.png` |
| `nicu-fragments.html` | Every smaller removed piece: config.js nav + home.communities entries, portal-config communities + legacyPartnerMap entries, programs.html link, hope-capsule sentence, the Supabase seed row |

## How to restore

1. **Partner page**: paste `nicu-partner-block.js` back into `js/partners.js`
   (after ronald-mcdonald-house) and bump the later `order` values back to 4/5/6.
2. **Config** (`js/config.js`): re-insert the nav dropdown item and the
   `home.communities` entry from `nicu-fragments.html`.
3. **Portal**: copy `northside-nicu-portal-page.html` over
   `community/northside-nicu.html`; re-insert the `communities` +
   `legacyPartnerMap` entries in `js/portal/portal-config.js`.
4. **Logo**: copy `northside-nicu-logo.png` back to `assets/logos/northside-nicu.png`.
5. **Database**: re-insert the seed row (in `nicu-fragments.html`) into
   `supabase/migrations/005_portal_seed.sql` + `supabase/setup.sql`, run the
   INSERT in the live SQL Editor, and restore display_order 4/5/6 for
   senior-living/schools-global/milal (reverse of `008_remove_nicu.sql`).
6. **Small copy**: programs.html link + hope-capsule.html sentence from
   `nicu-fragments.html`.
7. **Tests**: reverse the five→six count changes in `test/smoke.test.js`,
   `test/portal.test.js` (COMMS c3, signup c3, directory list, 26 pages),
   `test/portal-live-check.js`, and `test/preview-fixtures.json`; delete the
   "[northside NICU — removed]" block in smoke.test.js. Run `npm test`.
8. **Docs to un-edit**: CLAUDE.md, README.md, EDITING-GUIDE.md, EDITING-MAP.md,
   DESIGN.md, supabase/PORTAL-SETUP.md, context/, directives/, skills/, and the
   automation/ reference lists (six communities again).
