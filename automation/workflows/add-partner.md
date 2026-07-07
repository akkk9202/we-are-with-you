# Workflow — Add a new partner community

A partner entry becomes a page at `partner.html?p=SLUG`, plus a homepage card, a Programs card, a nav
dropdown item, and a footer link — all rendered automatically from `js/partners.js`.

1. **UNDERSTAND** — Confirm the new community, its public name, and what actions its page offers.
2. **LOCATE** — Open `js/partners.js` (the `PARTNERS` object).
3. **EDIT** — Copy `../templates/partner-entry.md` and fill it in:
   - Choose a **new slug** (the object key). It is load-bearing forever — pick carefully; never
     rename it later. See `../reference/slugs.md` for the existing slugs (do not collide).
   - Set a unique `order` (lower = earlier).
   - Each card needs **either** `form:"<key>"` matching a key in `SITE.forms`
     (`../reference/form-keys.md`) **or** `href:"page.html"` for a direct internal link.
   - Leave any unknown form as an existing safe key or a placeholder; don't invent a Google Form URL.
4. **VERIFY** — Run `../checklists/regression-gate.md`. Confirm the new card, page, nav item, and
   footer link all render. Expect `80 passed, 0 failed` (or the updated count if tests were added).
5. **SHOW** the diff. 6. **STOP** — do not commit or push.

**Never** rename a slug once it exists — printed QR codes and old URLs depend on it. To change what
shows publicly, edit the `name` field.
