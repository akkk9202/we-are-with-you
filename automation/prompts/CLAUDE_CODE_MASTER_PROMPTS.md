# Claude Code — Master Prompts

> The canonical "how to ask Claude Code to do work in this repo" prompt library for **WE ARE WITH YOU** (GYCO). Copy a block, paste it into Claude Code, fill the `<…>` slots. Every prompt already embeds this repo's guardrails so you don't have to remember them.

**Repo facts these prompts assume**
- Static site on GitHub Pages, **no backend / no build / no database / no auth**. Live: `https://akkk9202.github.io/we-are-with-you/`
- Audience includes hospital patients and grieving families — **tone matters**.
- Content lives in data files, not HTML: `js/content/pages/`, `js/content/global.js` (the `SITE` object), `js/content/media-assets.js`, `js/content/theme-options.js` + `css/theme.css`, `js/partners.js` (the `PARTNERS` object). The renderer `js/site.js` is rarely edited. Base tokens in `css/style.css`.
- **Never rename partner slugs** (`cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`, `disability`, `schools-global`) — they are on printed QR codes. Change the visible `name` instead.
- **Never delete redirect stubs**: `voices-of-love.html`, `taps-of-love.html`, `gyco.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`, `about-gyco.html`.
- Forms are `data-form="<key>"` attributes resolved through `SITE.forms`. Keys: `studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest`. `REPLACE_ME` / `TODO` are **intentional safe fallbacks** that route to the contact page — never fill them with invented URLs.
- Preserve Korean text and encoded URLs exactly.

---

## 1. Orient to the repo (read-only, run this first)

```
You are working in the "WE ARE WITH YOU" static site (GYCO). Before doing anything, orient
yourself read-only and report back — do not edit any file yet.

1. Read CLAUDE.md, then context/project.md, context/brand_voice.md, and context/user_preferences.md.
2. Skim the content model: js/content/pages/, js/content/global.js (SITE object),
   js/content/media-assets.js, js/content/theme-options.js, js/partners.js (PARTNERS object),
   and how js/site.js consumes them.
3. Summarize, in <15 lines: where page text lives, where forms/contact live, where images live,
   where partner content lives, and which files are "rarely edit."

Constraints: read-only this turn. No pushes, no commits. Ask me before touching anything.
```

## 2. Make a minimal, safe edit

```
Task: <describe the change in one sentence>.

Rules for this repo:
- Edit the DATA files, not the HTML: page copy in js/content/pages/, global/contact/forms in
  js/content/global.js, images in js/content/media-assets.js, partners in js/partners.js.
- Keep the diff minimal — change only what the task requires. Don't reformat, rename, or "tidy"
  unrelated lines.
- Do NOT rename any partner slug, delete any redirect stub, or invent form URLs (REPLACE_ME/TODO
  are intentional safe fallbacks).
- Preserve Korean text and any percent-encoded URLs exactly.

When done: show me the diff, then run the smoke tests (see the "Run the smoke tests" prompt).
Do not push or commit.
```

## 3. Propose before editing (plan-first)

```
Task: <describe the change>.

Do NOT edit anything yet. First give me a short plan:
- Which exact file(s) and which object/key you'll touch (e.g. js/content/pages/<page>.js, key `foo`).
- The before/after for each value you'll change.
- Any risk to slugs, redirect stubs, forms, nav, or rendered output.
- How you'll verify (smoke tests, node --check).

Wait for my "go" before making any change.
```

## 4. Show me the diff

```
Show me the exact diff of everything you changed since my last message, as a unified diff grouped
by file. For each hunk, add one line explaining why it changed. Do not make further edits and do
not commit — I want to review first.
```

## 5. Run the smoke tests

```
Run the repo's test procedure and paste the raw output:

  npm install jsdom --no-save
  node test/smoke.test.js      # expect exactly "80 passed, 0 failed"
  node --check js/site.js
  rm -rf node_modules          # cleanup; node_modules is gitignored

If the count is not 80 passed / 0 failed, stop and show me which assertions failed and the smallest
change that would restore green — do not "fix" tests by weakening them.
```

## 6. Follow the operating loop

```
Work in this loop for the task below, and narrate each step briefly:

  1) ORIENT   — restate the task + name the exact file/key you'll touch.
  2) PROPOSE  — show before/after; pause if the change touches slugs/redirects/forms/nav.
  3) EDIT     — minimal diff only.
  4) VERIFY   — run smoke tests (expect 80/0) and node --check js/site.js.
  5) REPORT   — show the diff and the test output.

Never push, commit, open, or merge a PR unless I explicitly say so. Run
directives/security_check_before_deploy.md before suggesting any deploy.

Task: <describe the change>
```

## 7. Stop-and-ask trigger (guardrail reminder)

```
For this task, treat these as STOP-and-ask-me situations — pause and confirm before proceeding:
- Any change to a partner slug, a redirect stub file, navigation structure, or js/site.js.
- Replacing a REPLACE_ME/TODO form key with a real value.
- Editing copy aimed at patients/grieving families (tone-sensitive).
- Anything that would change the rendered DOM in a way the smoke tests would notice.

Proceed on everything else, but show me the diff before running tests.
```

---

## Good prompt vs. vague prompt

| Vague (avoid) | Good (use) |
|---|---|
| "Update the homepage." | "In js/content/pages/index.js, change the hero subtitle from '<old>' to '<new>'. Minimal diff, then run smoke tests." |
| "Fix the forms." | "The partner inquiry button should open SITE.forms.partnerInquiry. Verify the data-form key without inventing a URL — if it's REPLACE_ME, leave it." |
| "Refactor site.js." | "Refactor js/site.js's card renderer with zero DOM output change; keep smoke tests at 80/0 and run node --check." |
| "Make it look nicer." | "Review responsive/mobile spacing per skills/frontend_design_review.md without changing any copy or nav." |

**Rule of thumb:** name the exact file + object/key, quote the before/after, state the verification step, and end with "show the diff; don't commit."
