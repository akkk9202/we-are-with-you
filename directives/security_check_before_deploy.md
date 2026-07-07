# Directive: Security check before deploy

Run this checklist before any deploy (push to `main` / GitHub Pages publish). This is a **static
site** with no backend, so the surface is client-side injection, outbound links, leaked secrets, and
third-party dependencies. Report findings as: severity, `file:line`, why it matters, exact fix,
safe-to-fix-now. **Do not deploy with an unresolved High/Critical.**

## 1. Client-side injection (XSS)

- [ ] **No untrusted input reaches the DOM as HTML.** The only user-controlled input is the
  `?p=` query param (`js/site.js`), used solely as a `PARTNERS[slug]` lookup key and never echoed.
  If any new code reflects `location.search`, `location.hash`, or form input into `innerHTML` /
  `insertAdjacentHTML` / `document.write`, treat it as a finding.
- [ ] **`innerHTML` template content stays developer-controlled** (from `config.js` / `partners.js`).
  Flag any path where end-user or third-party data is interpolated without escaping.
- [ ] **No `eval` / `new Function` on dynamic strings** in shipped code (`test/` may use `eval` on
  trusted local files — that's fine).

## 2. Link & URL safety

- [ ] **Config-supplied URLs pass `safeUrl()`** before becoming an `href` (`js/site.js`). This blocks
  a pasted `javascript:` value from becoming a live link. Covers `SITE.forms.*`, `SITE.instagram`,
  `SITE.youtube`, and the partner form buttons.
- [ ] **Every `target="_blank"` link has `rel="noopener"`** (reverse-tabnabbing).
- [ ] **Redirect stubs** (`*-of-love.html`, `gyco.html`, …) point only to hardcoded internal targets —
  no open redirect driven by URL input.

## 3. Secrets & data hygiene

- [ ] **No secrets in the tree or git history** — API keys, tokens, private keys, passwords.
  `js/config.js` should contain only placeholders (`REPLACE_ME…`) or public URLs.
  Quick check: `git log -p --all | grep -iE 'AIza|ghp_|AKIA|-----BEGIN|api_key|password|secret|token'`
- [ ] **No personal data** (patient names, private emails) committed in content or assets.

## 4. Third-party & headers

- [ ] **Third-party dependencies are known and minimal.** Currently: Google Fonts via `@import` in
  `css/style.css` (privacy/availability note; no SRI possible on `@import`). No JS CDNs.
- [ ] **Referrer policy present** — each page's `<head>` has
  `<meta name="referrer" content="strict-origin-when-cross-origin" />`.
- [ ] **Content-Security-Policy** — currently DEFERRED (inline scripts + inline `onerror` handlers
  require `'unsafe-inline'`; needs local render testing before shipping). Note its absence; do not
  add it silently as part of an unrelated deploy.

## 5. Regression gate

- [ ] `node --check js/site.js` passes.
- [ ] `test/smoke.test.js` passes (`80 passed, 0 failed`). Install `jsdom --no-save` transiently if
  needed, then clean up.
- [ ] `git status` shows only intended changes; no stray `node_modules/` or secrets staged.

## Sign-off

Record: date, commit SHA, who ran it, and any accepted-risk items (e.g., "CSP deferred"). Only then
deploy — and only if the maintainer has explicitly approved the push (see
`directives/github_workflow.md`).
