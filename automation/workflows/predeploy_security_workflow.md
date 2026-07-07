# Pre-Deploy Security Workflow

Purpose: The mandatory safe-deploy gate for **WE ARE WITH YOU**. Nothing goes live until this passes.

## When to use
- Before ANY deploy / publish to GitHub Pages.
- After any change to `js/`, `css/`, HTML, or content data files.

## Preconditions / read first
- `directives/security_check_before_deploy.md` — the authoritative checklist.
- `skills/security_review.md` and `automation/prompts/security-review.md`.
- `automation/checklists/before-deploy.md` / `checklists/before_deploy_checklist.md`.
- `automation/checklists/regression-gate.md`.

## What to check (this is a static, no-backend, no-auth site)
1. **Run the directive.** Work through `directives/security_check_before_deploy.md` line by line.
2. **No secrets.** Grep the diff/tree for tokens, API keys, passwords, private emails, `.env` content. There is no backend — nothing secret should ever be in the repo.
3. **No injected/inline event handlers.** No new inline `onclick=`, `onerror=`, `javascript:` URLs, or inline `<script>` added by an edit. Submission buttons must route through `data-form="<key>"`, not raw handlers.
4. **External links are safe.** Outbound links use `https` and trusted domains (Google Forms, known press outlets). Verify no unexpected third-party script/host was introduced.
5. **No new external dependencies / trackers.** The site is plain HTML/CSS/vanilla JS with Google Fonts only. Flag any newly added remote script.
6. **Placeholders intact.** `REPLACE_ME` / `TODO` values are safe fallbacks — confirm none were replaced with fake or unsafe values.
7. **Slugs & stubs intact.** Partner slugs unchanged; redirect stubs and their anchors still present (see `automation/reference/slugs.md`).

## Verify (regression gate)
- `npm install jsdom --no-save && node test/smoke.test.js` → **80 passed, 0 failed**.
- `node --check js/site.js` (and any edited `js/content/*.js`, `js/partners.js`).
- `rm -rf node_modules` (optional cleanup).
- Manual spot-check of the changed pages in a browser.

## Guardrails / do NOT
- Do NOT deploy if tests are not 80/0, or if any security item fails.
- Do NOT skip the directive because "it's a small change."
- Passing this gate is NOT permission to push — pushing/deploying is still opt-in and requires an explicit request (see `github_commit_push_workflow.md`).

## Done means
Directive completed, no secrets/inline handlers/unsafe links, placeholders and slugs/stubs intact, tests 80/0 — the change is *eligible* to deploy once explicitly approved.

## Related
- Directive: `directives/security_check_before_deploy.md`
- Skill: `skills/security_review.md`
- Checklist: `automation/checklists/before-deploy.md`, `automation/checklists/regression-gate.md`
