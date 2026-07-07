# CLAUDE.md — Working guide for this repository

This file orients any AI assistant (and any human) working in this repo. Read it first.

## What this is

**WE ARE WITH YOU** is a student-led platform by the **Greater Youth Collaborative Opus (GYCO)**
that brings music, learning, encouragement, and human connection into hospitals, family spaces,
senior communities, schools, and global partner communities.

Tagline: **"Even Here. Even Now. We Are With You."**

The site is a **static website** hosted on **GitHub Pages** — plain HTML, one CSS file, and three
small vanilla-JS files. There is **no backend, no build step, no database, no server-side code, and
no authentication**. "Forms" are outbound links to external Google Forms.

Live URL: `https://akkk9202.github.io/we-are-with-you/`

## Repository map

```
*.html                     One file per page (index, programs, partner, learning, media, …)
                           plus redirect stubs (voices-of-love.html → partner.html?p=cancer-care, etc.)
css/style.css              The entire design system (tokens, components). Imports Google Fonts.
js/config.js               EDIT HERE: contact info, form URLs, nav, homepage images, featured press.
js/partners.js             EDIT HERE: every partner/pathway's page content.
js/site.js                 Engine: builds nav + footer, renders cards/carousel/partner pages. Rarely edit.
assets/images, assets/logos  Photos and partner logos.
test/smoke.test.js         jsdom DOM smoke tests (asserts the rendered output of the real pages).
EDITING-GUIDE.md           Plain-English guide for non-technical editors.
context/                   Background: project, brand voice, user preferences.
directives/                Rules that MUST be followed (security, git, editing workflow).
skills/                    Reusable review/rewrite procedures.
sources/                   Raw source material (see sources/README.md).
```

## The content model (important)

Almost all editable content lives in **two data files**, not in the HTML:

- `js/config.js` — the `SITE` object (contact, forms, nav, home images, press).
- `js/partners.js` — the `PARTNERS` object (one entry per partner community).

`js/site.js` reads those objects and injects nav, footer, cards, the carousel, and each partner page
at runtime. **Change content in the data files and every page updates together.** Prefer editing
`config.js`/`partners.js` over hand-editing HTML. See `directives/website_editing_workflow.md`.

Legacy partner **slugs are load-bearing** (`cancer-care`, `nicu`, `disability`, …): printed QR codes
and old URLs depend on them. Never rename a slug — change the visible `name` field instead.

## How to run / test

There is no dev server; open the HTML files directly or serve the folder statically
(`python3 -m http.server`). To run the smoke tests you need `jsdom`, which is **not** committed
(`node_modules/` is gitignored and there is no `package.json`):

```bash
npm install jsdom --no-save      # transient; node_modules is gitignored
node test/smoke.test.js          # expect "80 passed, 0 failed"
node --check js/site.js          # syntax check
rm -rf node_modules              # optional cleanup
```

Run the smoke tests after any change to `js/`, `partners.js`, `config.js`, or page structure.

## Non-negotiables

- **Never `git push` or open/merge a PR unless explicitly asked.** See `directives/github_workflow.md`.
- **Run `directives/security_check_before_deploy.md` before any deploy.**
- **Don't touch design, layout, copy, images, or navigation unless that is the task.**
- **Keep changes minimal**, show the diff, and run the smoke tests. See `context/user_preferences.md`.
- This audience includes patients and grieving families. **Tone matters** — see `context/brand_voice.md`.

## Pointers

- Background & goals → `context/project.md`
- Voice & language rules → `context/brand_voice.md`
- How the user likes work done → `context/user_preferences.md`
- Security checklist → `directives/security_check_before_deploy.md`
- Git rules → `directives/github_workflow.md`
- Editing workflow → `directives/website_editing_workflow.md`
- Review/rewrite procedures → `skills/`
