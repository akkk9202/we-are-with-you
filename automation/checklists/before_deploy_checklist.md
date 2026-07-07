# Before Deploy Checklist

Purpose: Final gate that must fully pass before any deploy or commit of the WE ARE WITH YOU site.
When to run: Immediately before deploying/committing, after edits are complete.

## Tests and syntax
- [ ] `npm install jsdom --no-save` (jsdom is not committed).
- [ ] `node test/smoke.test.js` → "80 passed, 0 failed".
- [ ] `node --check js/site.js` → no output (clean).
- [ ] `rm -rf node_modules` afterward (optional cleanup; node_modules is gitignored).

## Security
- [ ] Ran `directives/security_check_before_deploy.md` and it passed.
- [ ] No secrets, tokens, or API keys added.
- [ ] No inline event handlers (onclick, etc.) or unsafe inline scripts introduced.

## Content integrity
- [ ] Internal links resolve; external links open safely.
- [ ] Forms open correctly — SITE.forms keys valid; REPLACE_ME keys route safely to the contact page.
- [ ] `data-form="key"` routing points at real keys.
- [ ] Redirect stubs still resolve (voices-of-love.html, taps-of-love.html, gyco.html, we-are-with-you.html, beat-and-breeze.html, winds-of-love.html, about-gyco.html).
- [ ] Partner slugs untouched (cancer-care, ronald-mcdonald-house, nicu, senior-living, disability, schools-global).
- [ ] REPLACE_ME / TODO left as safe fallbacks — no invented values.
- [ ] Korean + encoded URLs intact.

## Authorization
- [ ] Diff reviewed and shown to the user.
- [ ] Deploy/commit has been EXPLICITLY authorized — never push/PR/merge/commit otherwise.
