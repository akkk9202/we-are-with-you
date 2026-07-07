# Workflow — Update a Google Form link

All form buttons route through `SITE.forms` in `js/config.js`. A button's `data-form="<key>"` (or a
partner card's `form:"<key>"`) looks up the URL there. A key still set to `REPLACE_ME_GOOGLE_FORM_URL`
safely routes to the contact page instead of a dead link — that is by design.

1. **UNDERSTAND** — Which form, and the exact new URL the maintainer supplied. Do **not** invent one.
2. **LOCATE** — `js/config.js` → `SITE.forms.<key>`. Valid keys: see `../reference/form-keys.md`.
3. **EDIT** — Replace only that key's value with the supplied URL. Leave the others untouched.
   Keep any encoded characters in the URL exactly as given.
4. **VERIFY** — Run `../checklists/regression-gate.md`. Because a link changed, also run
   `../checklists/before-deploy.md` (security check). Click the button on the affected page(s).
5. **SHOW** the diff. 6. **STOP** — do not commit or push.
