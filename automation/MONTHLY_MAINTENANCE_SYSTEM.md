# MONTHLY_MAINTENANCE_SYSTEM.md

> **Purpose:** A repeatable monthly upkeep routine that keeps the **WE ARE WITH YOU** static site healthy — links alive, images loading, placeholders tracked, tone intact — without any running automation.

Because this is a static GitHub Pages site with **no backend and no monitoring**, nothing tells you when something breaks. This routine is the monitoring. Run it once a month; run the deploy-gated parts (tests, security) before any deploy.

---

## Cadence

- **Monthly:** the full checklist below (about 30–45 minutes).
- **Before any deploy:** items marked **[DEPLOY GATE]** — smoke tests, `node --check`, and the security check — regardless of the calendar.
- **After outreach or a press mention:** run the broken-link check early, since new links arrive out of cycle.

---

## Monthly checklist

Work top to bottom. Note results in the log at the bottom.

### 1. Tests **[DEPLOY GATE]**
```bash
npm install jsdom --no-save
node test/smoke.test.js          # expect "80 passed, 0 failed"
node --check js/site.js
rm -rf node_modules              # optional cleanup
```
See `reference/TESTING_GUIDE.md`. If the count is not `80 passed, 0 failed`, stop and investigate before anything else.

### 2. Broken-link check
Follow `workflows/broken_link_check.md`. Cover all three link classes:
- **Internal pages** — every `*.html` loads.
- **Outbound Google Forms** — each live `SITE.forms` key opens its form; keys still at `REPLACE_ME` should route to the **contact page** (that is correct, not a bug).
- **Press links** — including Korean-language and percent-encoded URLs (e.g. Newswave25). Confirm the URLs are byte-for-byte intact.

### 3. Redirect stubs resolve
Confirm each stub still loads and lands on its target anchor:
`voices-of-love.html`, `taps-of-love.html`, `gyco.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`, `about-gyco.html`.
These are load-bearing (old URLs + QR codes) — none may be missing.

### 4. Images load + alt text present
Per `checklists/image_upload.md` and `reference/MEDIA_ASSET_GUIDE.md`: every image referenced in `js/content/media-assets.js` (homepage images, cards, carousel, partner photos) actually renders and has meaningful `alt` text.

### 5. Placeholder review
Search for `REPLACE_ME` and `TODO` across `js/content/global.js` (live: `js/config.js`), `js/content/pages/`, `js/partners.js`, and `js/content/media-assets.js`. For each one, **ask the maintainer** whether a real value now exists — **do not invent values**. Leaving a placeholder is fine; it renders as a safe fallback by design.

### 6. Accessibility spot-check
Per `checklists/accessibility.md`: heading order, color contrast, image alt text, keyboard focus on nav and cards. Sample a few pages, not all.

### 7. Mobile spot-check
Per `checklists/mobile_design.md`: load the homepage, a partner page, and the media page at a narrow width; confirm nav, carousel, and cards behave.

### 8. Theme / preview sanity
Per `workflows/theme_preview.md` and `reference/THEME_SYSTEM_GUIDE.md`: the active theme in `js/content/theme-options.js` + `css/theme.css` renders correctly across a couple of pages. No unintended global shift.

### 9. Security check **[DEPLOY GATE]**
Only if a deploy will follow this cycle, run `directives/security_check_before_deploy.md` (and `workflows/predeploy_security.md`). No deploy without it.

### 10. Changelog
Record what you checked and any fixes using `templates/changelog.md`. Even a clean month gets a "clean" entry so the history is unbroken.

---

## Monthly log template

Copy this block into your running log (or a dated file) each month:

```
## Monthly maintenance — YYYY-MM
Run by: <name>
Branch: <e.g. design-upgrade / main>

1. Tests ............... [ ] 80 passed, 0 failed   node --check OK: [ ]
2. Broken links ........ [ ] internal  [ ] forms  [ ] press (Korean/encoded intact)
3. Redirect stubs ...... [ ] all 7 resolve
4. Images + alt ........ [ ] load  [ ] alt text present
5. Placeholders ........ count REPLACE_ME/TODO: ___  asked maintainer: [ ]
6. Accessibility ....... [ ] spot-check OK
7. Mobile .............. [ ] spot-check OK
8. Theme/preview ....... [ ] OK
9. Security (if deploy)  [ ] ran security_check_before_deploy.md
10. Changelog updated .. [ ]

Findings / fixes:
- ...

Deploy this cycle? [ ] no   [ ] yes (requires explicit maintainer approval — see HUMAN_APPROVAL_RULES.md)
```

---

## Referenced procedures

- Workflows: `broken_link_check.md`, `theme_preview.md`, `predeploy_security.md`, `github_commit_push.md`
- Checklists: `before_deploy.md`, `after_deploy.md`, `image_upload.md`, `hyperlink.md`, `accessibility.md`, `mobile_design.md`
- Reference: `TESTING_GUIDE.md`, `MEDIA_ASSET_GUIDE.md`, `THEME_SYSTEM_GUIDE.md`, `QR_AND_SLUG_PROTECTION_GUIDE.md`
- Templates: `changelog.md`, `test_report.md`
- Directives: `security_check_before_deploy.md`, `github_workflow.md`
- Approvals: `HUMAN_APPROVAL_RULES.md`
