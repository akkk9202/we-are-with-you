# Website Section Edit Workflow

Purpose: Safely change the text or section content on a page of **WE ARE WITH YOU** by editing the data files, not the HTML.

## When to use
- A word, sentence, heading, list, or block of copy on a page needs to change.
- You are adding/removing a content section that the renderer already supports.
- Someone hands you a filled-in edit request and asks you to "make this live."

## Preconditions / read first
- `CLAUDE.md` (content model: content lives in data files, not HTML).
- `EDITING-MAP.md` and `automation/reference/file-map.md` (which file owns which page).
- `directives/website_editing_workflow.md` (the required editing loop).
- `automation/checklists/before-edit.md` before you touch anything.
- Tone matters — audience includes hospital patients and grieving families. See `context/brand_voice.md`.

## Steps (UNDERSTAND → LOCATE → EDIT → VERIFY → SHOW → STOP)
1. **UNDERSTAND.** Restate the request in one line: which page, which section, old text → new text. If ambiguous, ask before editing. Use `automation/prompts/task-intake.md`.
2. **LOCATE.** Find the owning page-content file under `js/content/pages/` (e.g. the file for the page in the URL). Global/shared text (nav labels, footer, contact, press) lives in `js/content/global.js` (the `SITE` object), not the page file.
   - Note: on the current live tree this content still lives in `js/config.js`; `js/content/*` is the design-upgrade target structure. Edit whichever exists in your branch.
   - Prefer the data file. Only hand-edit an `.html` file if the content is genuinely hard-coded there and has no data source.
3. **EDIT.** Change only the specific field/string. Keep JS syntax valid (quotes, commas, brackets). Do not restructure surrounding data. Preserve any Korean text and percent-encoded URLs exactly.
4. **VERIFY.** See below.
5. **SHOW.** Present the diff (old vs new) and a one-line summary. Do not deploy.
6. **STOP.** Wait for explicit approval before any commit/push/deploy.

## Verify
- `node --check js/site.js` (and `node --check` on any `js/content/*.js` you edited).
- `npm install jsdom --no-save && node test/smoke.test.js` → expect **"80 passed, 0 failed"** → `rm -rf node_modules` (optional).
- Manual: open the page in a browser (or `python3 -m http.server`) and confirm the section renders and reads well on mobile width.

## Guardrails / do NOT
- Do NOT touch design, layout, images, or navigation unless that is the task.
- Do NOT rename partner slugs or delete redirect stubs (see reference/slugs.md).
- Do NOT invent real values for `REPLACE_ME` / `TODO` placeholders — they render as safe fallbacks.
- Do NOT commit or push unless explicitly asked in the moment.

## Done means
Copy changed in the correct data file, syntax check passes, smoke tests report 80/0, diff shown to the requester, nothing deployed.

## Related
- Template: `automation/templates/config-entries.md`, `templates/website_edit_request_template.md`
- Checklist: `automation/checklists/before-edit.md`, `checklists/before_editing_checklist.md`
- Skill: `skills/content_rewrite_for_website.md`
