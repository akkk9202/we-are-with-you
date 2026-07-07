# Safe Refactor Prompts

> Prompts for refactors that must **not** change behavior or rendered output in the **WE ARE WITH YOU** repo. The golden rule: the site renders byte-identically and the smoke tests stay at **80 passed, 0 failed**.

**What "safe" means here**
- The rendered DOM of every page is unchanged (the smoke tests assert real rendered output).
- No partner slug renamed (`cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`, `disability`, `schools-global`).
- No redirect stub deleted (`voices-of-love.html`, `taps-of-love.html`, `gyco.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`, `about-gyco.html`).
- Navigation, forms (`data-form` → `SITE.forms`), Korean text, and encoded URLs unchanged.
- `REPLACE_ME` / `TODO` stay as-is (intentional safe fallbacks).

---

## 1. Behavior-preserving refactor (baseline-first)

```
I want a behavior-preserving refactor of <file/function>. Rendered output must not change.

Procedure:
1) BASELINE first: run `npm install jsdom --no-save` then `node test/smoke.test.js` and record the
   result (must be "80 passed, 0 failed"). If it's not green before you start, stop and tell me.
2) Refactor <file/function> for readability/structure ONLY. No behavior, no DOM output, no public
   shape change. Keep the same function names/exports unless I approve otherwise.
3) Re-run node test/smoke.test.js — must still be exactly 80 passed / 0 failed — and
   node --check js/site.js. Then `rm -rf node_modules`.
4) Show me the diff plus the before/after test output side by side.

Do not push or commit. If any test count changes, revert and explain.
```

## 2. Refactor the renderer engine (js/site.js) — high caution

```
Refactor js/site.js only for clarity (extract helpers, rename locals, dedupe), with ZERO change to
the DOM it produces for any page.

Guardrails:
- Do not change how nav, footer, cards, the carousel, or partner pages are assembled — only how the
  code reads.
- Do not touch slug handling or redirect logic.
- Keep every exported/global symbol that other files or the HTML rely on.

Verify: node --check js/site.js, then node test/smoke.test.js (expect 80/0). Show the diff.
If you're unsure whether a change is output-affecting, DON'T make it — list it as a proposal instead.
```

## 3. Refactor content data files without changing render

```
Reorganize <js/content/pages/... | js/content/global.js | js/content/media-assets.js | js/partners.js>
for readability (ordering, grouping, comments) without changing any value that reaches the page.

Rules:
- Keys, slugs, form keys, URLs, and text values must be byte-identical after render.
- No slug renames, no redirect stub changes, no REPLACE_ME/TODO substitutions.
- Preserve Korean strings and percent-encoded URLs exactly.

Verify with node test/smoke.test.js (80/0). Show the diff and confirm no rendered value changed.
```

## 4. De-duplicate / extract a shared helper

```
There's duplicated logic across <files>. Extract it into one helper without changing behavior.

- Prove equivalence: describe the inputs/outputs before and after in a short table.
- Keep the smoke tests at 80 passed / 0 failed and node --check js/site.js clean.
- Minimal diff; do not opportunistically refactor nearby code.

Show the diff and the test output. No commit.
```

## 5. Regression guard (diff the rendered DOM yourself)

```
Before and after your refactor, render the affected page(s) the same way the smoke tests do (jsdom)
and diff the resulting HTML. Report "no DOM difference" or paste the exact delta. If there is ANY
delta you did not intend, revert. Then run node test/smoke.test.js and confirm 80/0.
```

---

## Good vs. vague

| Vague | Good |
|---|---|
| "Clean up site.js." | "Extract the carousel builder in js/site.js into a helper, zero DOM change, keep 80/0." |
| "Modernize the code." | "Convert var→const/let in js/content/global.js only where scope is provably identical; verify 80/0." |

**If a refactor cannot be proven output-neutral, it is not a safe refactor — turn it into a proposal and stop.**
