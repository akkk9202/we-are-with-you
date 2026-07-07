# Security Audit Prompts

> Prompts for running the security review on the **WE ARE WITH YOU** static site. Scope is a **static GitHub Pages site**: no backend, no database, no auth, no secrets should ever be needed. References `directives/security_check_before_deploy.md` and `skills/security_review.md`.

**Threat model for a static site**
- Leaked secrets/tokens/keys committed to the repo (there should be none).
- XSS via unescaped content injected by `js/site.js` from data files.
- Unsafe external links (`target="_blank"` without `rel="noopener noreferrer"`).
- Inline event handlers (`onclick=`, `onerror=`, …) and `javascript:` URLs.
- Broken/removed redirect stubs or slugs (availability of printed QR links).

**Always**: read-only unless a fix is requested; never push/commit; minimal diffs; keep `REPLACE_ME`/`TODO` as safe fallbacks.

---

## 1. Full pre-deploy security check

```
Run the pre-deploy security review for this static site. Follow
directives/security_check_before_deploy.md and skills/security_review.md exactly, in order.
Report findings as a checklist with file:line references and a PASS/FAIL per item. This is
read-only — do not fix anything yet, just report. No commit.
```

## 2. Secret / credential scan

```
Scan the whole repo for anything that looks like a secret or credential that must never be in a
static public site: API keys, tokens, OAuth secrets, private URLs, passwords, .env contents,
Google API keys, service-account JSON.

- Search tracked files and report any hit with file:line and why it's suspicious.
- Remember: this site legitimately has NO backend and NO auth, so ANY secret is a red flag.
- REPLACE_ME/TODO placeholders are expected and safe — do not report them as secrets.
Read-only. Give me a findings table, no fixes yet.
```

## 3. XSS / unsafe-injection review of the renderer

```
Audit how js/site.js injects content from js/content/pages/, js/content/global.js,
js/content/media-assets.js, and js/partners.js into the DOM.

Look for: innerHTML/insertAdjacentHTML with unescaped data-file values, untrusted values in href/src,
javascript: URLs, and any place a partner/page string could inject markup.

For each risk: file:line, the tainted path (data file -> render), and the safest minimal fix
(e.g. textContent vs innerHTML, or escaping). Read-only report first — do not change code.
```

## 4. Unsafe external links + inline handlers

```
Scan all *.html and the rendered output for:
1) target="_blank" links missing rel="noopener noreferrer".
2) Inline event handlers (onclick=, onerror=, onload=, etc.).
3) javascript: or data: URLs in href/src.

List every occurrence with file:line. Then propose minimal fixes as a diff, but DO NOT apply them
until I approve. Keep changes scoped; don't touch nav or copy.
```

## 5. Redirect-stub & slug integrity check

```
Verify availability guarantees that our security/deploy checklist depends on:
- All redirect stubs still exist and point correctly: voices-of-love.html, taps-of-love.html,
  gyco.html, we-are-with-you.html, beat-and-breeze.html, winds-of-love.html, about-gyco.html.
- All partner slugs still resolve: cancer-care, ronald-mcdonald-house, nicu, senior-living,
  disability, schools-global.
Report any missing/renamed stub or slug (these break printed QR codes). Read-only. No commit.
```

## 6. Apply approved fixes (guarded)

```
Apply ONLY the security fixes I approved above. Minimal diffs, one concern at a time. Do not
refactor anything else. After changes:
  node --check js/site.js
  npm install jsdom --no-save && node test/smoke.test.js   (expect 80 passed, 0 failed)
  rm -rf node_modules
Show the diff and test output. Do not push or commit. Then re-run the pre-deploy checklist to
confirm the items now PASS.
```

---

## Good vs. vague

| Vague | Good |
|---|---|
| "Is the site secure?" | "Run directives/security_check_before_deploy.md read-only and give a PASS/FAIL checklist with file:line." |
| "Check for XSS." | "Audit js/site.js innerHTML usage against data-file inputs; list tainted paths and minimal fixes." |

**Reminder:** finding zero secrets is the expected outcome for this repo. Treat any secret, any inline handler, and any missing redirect stub as a real finding.
