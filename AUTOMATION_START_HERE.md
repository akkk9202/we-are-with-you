# AUTOMATION_START_HERE.md — The Automation Operating System

**Read this first if you are an AI assistant (or a human) about to do work in this repo.**

This is the "operating system" for how work gets done here: the order to read things,
the guardrails that are never crossed, and the exact loop to follow for any change.
It does **not** replace `CLAUDE.md` — it sits next to it and tells you *how to operate*.

> **What this file is / is not.** This is documentation only. There is no automation *engine*,
> no scripts, no build step, and no server in this repo — it is a static website (see `CLAUDE.md`).
> "Automation operating system" here means a **repeatable operating procedure** for making safe,
> minimal, reversible edits. If someone asks you to "run the automation," they mean *follow this loop*.

---

## 0. Boot sequence (read in this order)

1. **`CLAUDE.md`** — what the project is and the non-negotiables.
2. **This file** — how to operate.
3. **`EDITING-MAP.md`** — where every piece of content lives ("I want to change X → edit Y").
4. The relevant **`directives/`** for your task (rules that MUST be followed):
   - `directives/website_editing_workflow.md`
   - `directives/security_check_before_deploy.md`
   - `directives/github_workflow.md`
5. The relevant **`context/`** (project background, brand voice, how the maintainer likes work done):
   - `context/project.md`, `context/brand_voice.md`, `context/user_preferences.md`
6. The relevant **`skills/`** if you are reviewing or rewriting:
   - `skills/content_rewrite_for_website.md`, `skills/frontend_design_review.md`, `skills/security_review.md`

If a `directive/` and anything else ever disagree, the **directive wins**.

---

## 1. Prime directives (never crossed without an explicit, in-the-moment request)

- **Never `git push`, open a PR, or merge** unless the maintainer explicitly asks. Committing is
  also opt-in. (`directives/github_workflow.md`)
- **Never rename a partner slug.** `cancer-care`, `nicu`, `disability`, `senior-living`,
  `ronald-mcdonald-house`, `schools-global` are printed on physical QR codes. Change the visible
  `name` field instead. (`js/partners.js`)
- **Never delete redirect stubs** (`voices-of-love.html`, `taps-of-love.html`, `gyco.html`,
  `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`) or the anchors they target.
- **Don't touch design, layout, CSS tokens, copy, images, or navigation** unless that *is* the task.
- **Don't invent real values** for `REPLACE_ME…` / `TODO` placeholders — they render as safe
  fallbacks by design. Leave them until the maintainer supplies real ones.
- **Keep changes minimal, show the diff, run the tests.** (`context/user_preferences.md`)
- **Tone matters** — the audience includes patients and grieving families.
  (`context/brand_voice.md`)

---

## 2. The operating loop (run this for every change)

```
  UNDERSTAND ─▶ LOCATE ─▶ EDIT ─▶ VERIFY ─▶ SHOW ─▶ STOP
```

1. **UNDERSTAND** — Restate the task in one sentence. Confirm it doesn't touch a prime directive.
2. **LOCATE** — Open `EDITING-MAP.md` and find the single file/field that owns the content.
   Prefer editing the **data files** (`js/config.js`, `js/partners.js`) over hand-editing HTML.
3. **EDIT** — Make the smallest change that satisfies the task. Match the surrounding style.
4. **VERIFY** — Run the regression gate (Section 3). Fix until green.
5. **SHOW** — Present the diff and the test result to the maintainer.
6. **STOP** — Do **not** commit or push. Wait for an explicit instruction.

> When in doubt about scope, size, or tone: **ask before editing**, not after.

---

## 3. The regression gate (the only "automation" you run)

Run after any change to `js/`, `partners.js`, `config.js`, or page structure:

```bash
node --check js/site.js            # syntax check (if JS changed)
npm install jsdom --no-save        # transient; node_modules is gitignored
node test/smoke.test.js            # expect: 80 passed, 0 failed
rm -rf node_modules                # optional cleanup
```

- Green means: `80 passed, 0 failed`. Anything else is a failure — do not proceed.
- If links, scripts, or headers changed, also run `directives/security_check_before_deploy.md`.
- Eyeball the affected page(s): open the HTML directly or `python3 -m http.server`.

---

## 4. Decision table (what to do when asked to…)

| Request | Where it lives | Notes |
|---|---|---|
| Change contact email / socials / location | `js/config.js` → `SITE` | Leave `REPLACE_ME` if no real value yet |
| Update a Google Form link | `js/config.js` → `SITE.forms` | Keys are referenced by `data-form` / partner cards |
| Reorder or rename a nav item | `js/config.js` → `SITE.nav` | Don't change hrefs that redirects target |
| Change homepage images / captions | `js/config.js` → `SITE.home` | Overwrite the asset file or repoint `src` |
| Edit the featured press article | `js/config.js` → `SITE.press` | Preserve Korean text / encoded URLs exactly |
| Change a partner's visible name | `js/partners.js` → entry `name` | **Never** change the slug (the object key) |
| Edit a partner's cards / hero / closing | `js/partners.js` → entry fields | Card `form` must match a `SITE.forms` key, or use `href` |
| Add a new partner community | `js/partners.js` (copy a block) | New slug + `order`; nav/cards/footer update automatically |
| Change rendering behavior / engine | `js/site.js` | Rare. High-risk. Re-run full gate + security check |
| Anything design / layout / CSS | `css/style.css` | Only if that *is* the task; run design review skill first |

If a request isn't in this table, find it in **`EDITING-MAP.md`** before touching anything.

---

## 5. Escalate / ask before acting when…

- The change would touch **design, layout, CSS, or navigation structure**.
- The change is **large**, spans many files, or is hard to reverse.
- You're tempted to fill in a **placeholder** with a real value.
- The task implies a **push, PR, commit, or deploy**.
- The **tone** of copy for a sensitive audience is uncertain — check `context/brand_voice.md`.

---

## 6. Related maps and rules

- **`EDITING-MAP.md`** — the field-by-field "change X → edit Y" map.
- **`EDITING-GUIDE.md`** — the plain-English version for non-technical editors.
- **`directives/`** — the rules that must be followed (security, git, editing workflow).
- **`context/`** — project background, brand voice, maintainer preferences.
- **`skills/`** — reusable review/rewrite procedures.

*This is a documentation file. It changes no website behavior.*
