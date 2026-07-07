# Partner Page Update Workflow

Purpose: Edit a partner / pathway page in `js/partners.js` safely — without ever breaking the slug that printed QR codes depend on.

## When to use
- Updating a partner community's name, description, images, or call-to-action.
- Adjusting a pathway's cards or links.
- (Adding a brand-new partner: see also `automation/workflows/add-partner.md`.)

## Preconditions / read first
- `automation/reference/slugs.md` and `reference/QR_AND_SLUG_PROTECTION_GUIDE.md` — READ FIRST.
- `templates/partner-entry.md` / `templates/partner_profile_template.md`.
- `checklists/partner_safety_checklist.md`.

## The load-bearing rule (do not violate)
- Each partner entry in the `PARTNERS` object is keyed by a **slug**. Printed QR codes and old URLs point at these slugs. The slugs are:
  `cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`, `disability`, `schools-global`.
- **NEVER rename a slug key.** To change the visible label, edit the entry's **`name`** field instead. The slug stays; the name changes.

## Steps (UNDERSTAND → LOCATE → EDIT → VERIFY → SHOW → STOP)
1. **UNDERSTAND.** Which partner (by slug), what changes, and does it touch the display name, body copy, images, or CTAs?
2. **LOCATE.** Open `js/partners.js` and find the entry by its slug key.
3. **EDIT.**
   - Display label → change the `name` field, never the key.
   - Body/description → edit the relevant text fields; keep tone calm and respectful.
   - Images → reference assets that exist under `assets/`; include alt text.
   - Cards / CTAs → each card uses either `form:"<key>"` (must be a real `SITE.forms` key — see `automation/reference/form-keys.md`) or `href:"page.html"` (must be a real page). A `form` key that is `REPLACE_ME` falls back to the contact page — that is safe.
4. **VERIFY.** See below.
5. **SHOW.** Show the diff; explicitly confirm the slug key is unchanged. Do not deploy.
6. **STOP.** Await approval.

## Verify
- `npm install jsdom --no-save && node test/smoke.test.js` → **80 passed, 0 failed** → `rm -rf node_modules` (optional).
- `node --check js/site.js` and `node --check js/partners.js`.
- Manual: open `partner.html?p=<slug>` for the edited partner; confirm it renders, the new name shows, cards/links work, and the QR-linked URL still resolves.

## Guardrails / do NOT
- Do NOT rename or delete a slug key. Do NOT delete redirect stubs (e.g. `voices-of-love.html`) or their anchors.
- Do NOT point a card `form:` at a non-existent key, or `href:` at a non-existent page.
- Do NOT invent real Google Form URLs for `REPLACE_ME`.
- Do NOT commit/push/deploy unless explicitly asked.

## Done means
Partner entry updated by slug, slug key untouched, cards route to valid keys/pages, tests 80/0, QR URL still resolves, diff shown, nothing deployed.

## Related
- Template: `templates/partner-entry.md`, `templates/partner_profile_template.md`
- Reference: `reference/QR_AND_SLUG_PROTECTION_GUIDE.md`, `automation/reference/slugs.md`
- Checklist: `checklists/partner_safety_checklist.md`
- Workflow: `automation/workflows/add-partner.md`
