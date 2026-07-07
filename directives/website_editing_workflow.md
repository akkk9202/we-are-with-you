# Directive: Website editing workflow

How to make content and structural changes to this site safely. See also `EDITING-GUIDE.md` (the
plain-English version for non-technical editors).

## 1. Edit content in the data files, not the HTML

Most changes belong in **two files**:

- `js/config.js` — the `SITE` object: contact info, form URLs, navigation, homepage images, and the
  featured press item.
- `js/partners.js` — the `PARTNERS` object: each partner community's name, logo, hero text, cards,
  and closing lines.

`js/site.js` renders these onto every page. Change the data once and the whole site updates. Only edit
raw HTML for page-specific static sections that aren't data-driven.

## 2. Rules that protect existing links and QR codes

- **Never rename a partner slug.** Slugs (`cancer-care`, `nicu`, `disability`, `senior-living`,
  `ronald-mcdonald-house`, `schools-global`) are printed on physical QR codes and linked from old
  URLs. To change what's shown, edit the `name` field, not the key.
- **Don't remove redirect stubs** (`voices-of-love.html`, `gyco.html`, `taps-of-love.html`, …). They
  forward retired URLs to current pages.
- **Keep `#programs` and other anchors** that redirects target.

## 3. Preserve design and voice

- **Don't change design, layout, CSS tokens, images, or navigation** unless that is the task.
- Keep copy in the brand voice — see `context/brand_voice.md`. For rewrites use
  `skills/content_rewrite_for_website.md`.
- Preserve public partner names and any Korean text / encoded URLs exactly.

## 4. Placeholders are intentional

- `REPLACE_ME…` values (email, form URLs) render as safe fallbacks ("Email coming soon", buttons route
  to the contact page). Don't invent real values — leave placeholders until the maintainer supplies
  the real ones.
- Missing images fall back to monograms / styled placeholders automatically. Dropping a real file at
  the referenced path is all that's needed.

## 5. Verify every change

1. `node --check js/site.js` (if JS changed).
2. `node test/smoke.test.js` → expect `80 passed, 0 failed`
   (install `jsdom --no-save` transiently if needed; clean up after).
3. Eyeball the affected page(s) in a browser or via `python3 -m http.server`.
4. Run `directives/security_check_before_deploy.md` if anything touched links, scripts, or headers.
5. Show the diff. **Do not push** — see `directives/github_workflow.md`.

## 6. Keep it minimal and reversible

Small, focused edits. If a change is large or design-affecting, run
`skills/frontend_design_review.md` first and confirm scope with the maintainer.
