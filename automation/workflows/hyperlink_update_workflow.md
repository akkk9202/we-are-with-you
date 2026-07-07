# Hyperlink Update Workflow

Purpose: Update links across **WE ARE WITH YOU** — internal page links, outbound links, and the Google Form links routed through `SITE.forms`.

## When to use
- A Google Form URL changed (applications, partner inquiry, song/letter submission, etc.).
- An internal link points to the wrong page.
- An outbound link (press, partner, social) needs updating.

## Preconditions / read first
- `automation/reference/form-keys.md` (the canonical `SITE.forms` keys and how `data-form` routing works).
- `automation/checklists/before-edit.md` and `checklists/hyperlink_checklist.md`.
- `automation/workflows/update-form-link.md` (the focused form-link procedure).

## The form-routing model (important)
- Forms are outbound Google Form links stored in `js/content/global.js` under `SITE.forms` with these keys: `studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest`.
- In the HTML/data, elements use `data-form="<key>"`; the renderer (`js/site.js`) resolves the key to the URL at runtime.
- **`REPLACE_ME` fallback:** a key whose value is `REPLACE_ME` (or missing) safely routes to the contact page instead of a dead link. This is intentional. Do NOT paste a fake URL to "fill it in" — leave `REPLACE_ME` until you have the real Google Form URL.

## Steps (UNDERSTAND → LOCATE → EDIT → VERIFY → SHOW → STOP)
1. **UNDERSTAND.** Which link, where, old target → new target. For a form, identify the `SITE.forms` key.
2. **LOCATE.**
   - Form links: `js/content/global.js` → `SITE.forms.<key>`.
   - Internal/outbound links in content: the owning file under `js/content/pages/` or `js/content/global.js`; partner card links live in `js/partners.js`.
3. **EDIT.**
   - Form: replace only the value for the correct key. Keep it a full `https://` Google Form URL.
   - Internal link: use the exact existing filename (e.g. `partner.html?p=cancer-care`). Preserve percent-encoded and Korean-bearing URLs exactly.
   - Prefer routing submission buttons via `data-form="<key>"` rather than hard-coding a raw URL in markup.
4. **VERIFY.** See below.
5. **SHOW.** Show old → new for each link. Do not deploy.
6. **STOP.** Await approval.

## Verify
- `npm install jsdom --no-save && node test/smoke.test.js` → **80 passed, 0 failed** → `rm -rf node_modules` (optional).
- `node --check js/site.js`.
- Manual: click each changed link/button; confirm form buttons open the right Google Form (or the contact page if still `REPLACE_ME`); confirm no `404`.
- Run `automation/workflows/broken_link_check_workflow.md` if you touched many links.

## Guardrails / do NOT
- Do NOT invent a Google Form URL to replace `REPLACE_ME`.
- Do NOT rename a partner slug in a link target (see reference/slugs.md).
- Do NOT break redirect stubs or their target anchors.
- Ensure outbound links are safe (`https`, trusted domains); no inline `javascript:` handlers.
- Do NOT commit/push/deploy unless explicitly asked.

## Done means
Correct link/key updated, no dead links introduced, tests 80/0, diff shown, nothing deployed.

## Related
- Checklist: `checklists/hyperlink_checklist.md`
- Reference: `automation/reference/form-keys.md`
- Workflow: `automation/workflows/update-form-link.md`, `broken_link_check_workflow.md`
