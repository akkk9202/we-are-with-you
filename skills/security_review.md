# Skill: Security review

A repeatable procedure for auditing this repo. It is the review method; the deploy gate/checklist is
`directives/security_check_before_deploy.md`. **Report first, change nothing until asked.**

## Threat model (what actually applies here)

Static GitHub Pages site: **no backend, no server headers, no auth, no database, no cookies.** Forms
are outbound links to Google Forms. So the realistic risks are:

1. **Client-side injection (XSS/DOM)** — untrusted input reaching `innerHTML`/`href`.
2. **Unsafe outbound links** — `javascript:` URLs, missing `rel="noopener"`, open redirects.
3. **Leaked secrets / personal data** in the tree or git history.
4. **Third-party dependency risk** — Google Fonts (privacy/availability; no SRI on `@import`).
5. **Missing defense-in-depth headers** — referrer policy, CSP (the latter intentionally deferred).

## Method

### 1. Map the input surface
- Grep for sources of untrusted input: `location.search`, `location.hash`, `URLSearchParams`,
  `document.referrer`, and anything read from the DOM.
- Trace each to its sink. The only current input is `?p=` used as a `PARTNERS[slug]` lookup key
  (`js/site.js`) — never reflected. Confirm no new code reflects input into HTML.

### 2. Audit sinks
- Grep for `innerHTML`, `insertAdjacentHTML`, `outerHTML`, `document.write`, `eval`, `new Function`.
  Confirm the interpolated data is developer-controlled (`config.js`/`partners.js`), not user/third-party.

### 3. Audit links
- Confirm config-supplied URLs go through `safeUrl()` before becoming an `href`
  (`SITE.forms.*`, `SITE.instagram`, `SITE.youtube`, partner form buttons).
- `grep 'target="_blank"'` → each must have `rel="noopener"`.
- Verify redirect stubs point only to hardcoded internal targets.

### 4. Secrets & PII
- `grep -rniE 'api[_-]?key|secret|token|password|BEGIN .*PRIVATE|AIza|ghp_|AKIA'` over the tree.
- `git log -p --all | grep -iE 'AIza|ghp_|AKIA|-----BEGIN|api_key|password'` for history.
- Confirm `config.js` holds only placeholders / public URLs, and no personal data is committed.

### 5. Dependencies & headers
- Enumerate external references (`grep -rniE 'https?://' *.html css/*.css`). Currently just Google
  Fonts + og/canonical URLs. No JS CDNs → no SRI gap for scripts.
- Confirm `<meta name="referrer">` present on every page.
- Note CSP status (deferred; adding it needs `'unsafe-inline'` for inline scripts + `onerror`
  handlers and must be render-tested locally).

## Severity guidance

- **Critical/High:** exploitable XSS, leaked live secret, open redirect to attacker-controlled host.
- **Medium:** unvalidated sink that becomes exploitable if content model changes; missing
  `rel="noopener"` on external `_blank` links.
- **Low/Info:** hardening gaps (CSP absent, `@import` fonts, referrer policy), self-injection paths
  requiring the editor to paste malicious content.

## Reporting format

For each finding: **severity · `file:line` · why it matters · exact fix · safe-to-fix-now.** Lead
with the honest overall posture (for this site, typically "no High/Critical; low-severity hardening
only"). Make no edits until the maintainer approves specific fixes.

## Regression gate after any approved fix

- `node --check js/site.js`
- `node test/smoke.test.js` → `80 passed, 0 failed` (transient `jsdom --no-save`; clean up after)
- Show the diff. Don't push.
