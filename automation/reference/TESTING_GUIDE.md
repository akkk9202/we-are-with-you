# TESTING_GUIDE.md

**Purpose:** The full testing reference for this repo — what the smoke tests do, the exact commands, the expected result, when to run them, and how to read a failure.

> This is a static site with **no dev server and no `package.json`**. The one test suite loads the **real HTML pages** into jsdom, runs the site's JS, and asserts the **actual rendered output**. It's fast, dependency-light, and the single gate before showing a diff.

---

## 1. What `test/smoke.test.js` does

- Spins up **jsdom** (a headless DOM in Node) and loads the **real** page HTML from the repo.
- Runs the site's scripts against it — `js/config.js` (the `SITE` global settings), `js/partners.js` (the `PARTNERS` data), and `js/site.js` (the renderer engine).
- Asserts the **rendered result**: that nav + footer built correctly, cards and the carousel rendered, partner pages resolve from `?p=SLUG`, form routing behaves, and fallbacks (missing email, missing logo, placeholder forms) work.

Because it exercises the real files, a green run means the data files and engine still agree — the thing most edits could break.

> **Current vs. target:** The suite loads **`js/config.js`** today. On the design-upgrade branch, global settings move to `js/content/global.js`; the test wiring follows that move. Either way the command and expected output below are the same.

---

## 2. The exact commands

```bash
# 1. Syntax-check the engine (and any JS you changed)
node --check js/site.js

# 2. Install jsdom transiently (node_modules is gitignored; nothing is committed)
npm install jsdom --no-save

# 3. Run the smoke tests
node test/smoke.test.js
#    expect: 80 passed, 0 failed

# 4. Optional cleanup (removes the transient dependency)
rm -rf node_modules
```

- **`--no-save`** keeps `jsdom` out of any lockfile — there is no `package.json` and `node_modules/` is gitignored, so this dependency is **transient** by design and must never be committed.
- `node --check <file>` parses a JS file for syntax errors without running it — cheap first line of defense after editing any `js/` file.

---

## 3. Expected result

```
80 passed, 0 failed
```

That exact line means the full suite is green. Any non-zero "failed" count, or a thrown error / stack trace, means **stop and fix before proceeding** — do not show a diff or (if asked) commit on a red suite.

---

## 4. When to run

Run the gate after **any** change to:

| Changed… | Run |
|---|---|
| `js/site.js` (engine) | `node --check js/site.js` **then** full smoke tests |
| `js/config.js` / `js/content/global.js` (global settings) | full smoke tests |
| `js/partners.js` (partner data) | full smoke tests |
| Page **structure** in any `*.html` | full smoke tests |
| Redirect stubs / nav destinations | full smoke tests (and verify the redirect manually) |
| Media/theme/docs only | tests still recommended after media/theme; docs-only changes need none |

Also run `directives/security_check_before_deploy.md` before any deploy, and whenever links, scripts, or headers changed.

---

## 5. Interpreting failures

| Symptom | Likely cause | Where to look |
|---|---|---|
| A specific assertion failed with expected vs. actual text | A content field changed and the test asserts the old value, **or** a real regression | The named field in `js/config.js` / `js/partners.js`; decide whether the test should update or the data should |
| `Cannot find module 'jsdom'` | Step 2 was skipped or `node_modules` was already cleaned | Re-run `npm install jsdom --no-save` |
| `SyntaxError` / stack trace on load | A typo/broken JS in a data file or the engine | Run `node --check` on the file you edited; fix the syntax |
| Partner page assertion fails | A **slug/key** was renamed or a required partner field removed | `js/partners.js` — restore the key; see QR_AND_SLUG_PROTECTION_GUIDE.md |
| Form/link assertion fails | A form key no longer matches a `SITE.forms` key, or a placeholder was replaced badly | `SITE.forms` keys vs. `cards[].form` values |
| Many tests fail at once | An engine (`js/site.js`) change broke rendering globally | Revert/inspect the engine change |

**Never edit `test/smoke.test.js` just to make a failure disappear** — that hides a real regression. Fix the underlying data/engine, or update the test only when the *intended* behavior genuinely changed.

---

## 6. After a green run

Show the diff. **Do not commit or push** unless explicitly asked (`directives/github_workflow.md`). Keep diffs minimal.

*This is a documentation file. It changes no website behavior.*
