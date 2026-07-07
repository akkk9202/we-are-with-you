# Workflow — Edit content (the core loop)

Use this for any content change: contact info, form links, copy, images, partner fields, nav.

```
  UNDERSTAND ─▶ LOCATE ─▶ EDIT ─▶ VERIFY ─▶ SHOW ─▶ STOP
```

1. **UNDERSTAND** — Restate the task in one sentence. Confirm it crosses no prime directive
   (`../reference/prime-directives.md`). If it touches design/layout/CSS/nav structure, **ask first**.
2. **LOCATE** — Open `../../EDITING-MAP.md` and find the single file/field that owns the content.
   Prefer the data files (`js/config.js`, `js/partners.js`) over hand-editing HTML.
3. **EDIT** — Make the smallest change that satisfies the task. Match the surrounding style.
   Don't invent real values for `REPLACE_ME…` / `TODO` placeholders.
4. **VERIFY** — Run `../checklists/regression-gate.md`. Fix until green (`80 passed, 0 failed`).
5. **SHOW** — Present the diff and the test result to the maintainer.
6. **STOP** — Do **not** commit or push. Wait for an explicit instruction
   (`../../directives/github_workflow.md`).

## Decision table (where common requests live)

| Request | Where it lives |
|---|---|
| Contact email / socials / location | `js/config.js` → `SITE` |
| A Google Form link | `js/config.js` → `SITE.forms` (see `workflows/update-form-link.md`) |
| Nav item order / label | `js/config.js` → `SITE.nav` |
| Homepage images / captions | `js/config.js` → `SITE.home` |
| Featured press | `js/config.js` → `SITE.press` |
| A partner's visible name | `js/partners.js` → entry `name` (**never** the slug) |
| A partner's cards / hero / closing | `js/partners.js` → entry fields |
| Add a new partner | `workflows/add-partner.md` |
| Swap a photo / logo | `workflows/image-swap.md` |
| Rendering behavior / engine | `js/site.js` — rare, high-risk; full gate + security check |

If a request isn't here, find it in `../../EDITING-MAP.md` before touching anything.
