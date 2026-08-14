# CLAUDE.md — Working guide for this repository

This file orients any AI assistant (and any human) working in this repo. Read it first.

## What this is

**WE ARE WITH YOU** is a student-led platform by the **Greater Youth Collaborative Opus (GYCO)**
that brings music, learning, encouragement, and human connection into hospitals, family spaces,
senior communities, schools, and global partner communities.

Tagline: **"Even Here. Even Now. We Are With You."**

The site is a **static website** hosted on **GitHub Pages** — plain HTML, one CSS file, and small
vanilla-JS files. The public site has no build step and no backend. The **Community Portal**
(`community/`, `admin/`) is the one dynamic area: it talks to a **Supabase** project (auth +
Postgres) from the browser, with **Row Level Security as the entire security boundary** — there is
still no server code in this repo. Public-page "forms" remain outbound links to Google Forms.

Live URL: `https://akkk9202.github.io/we-are-with-you/`

## Repository map

```
*.html                     One file per page (index, partner, learning, media, …)
                           plus redirect stubs (programs.html → community/, voices-of-love.html → partner.html?p=cancer-care, …)
community/*.html           Community Portal pages (intro, auth, the five-option hub at home.html,
                           its destinations with-you / melody-box / bloom-bank / hope-capsule,
                           the All Communities chooser, 6 community pages, letters, requests,
                           activities, profile, content player). Thin shells — all logic in js/portal/.
admin/community.html       Admin dashboard (metrics, letters review, requests, content, activities, accounts, CSV).
css/style.css              The public design system (tokens, components). Imports Google Fonts.
css/portal.css             Portal components layered on the same tokens. Never changes public pages.
js/config.js               EDIT HERE: contact info, form URLs, nav, homepage images, featured press.
js/partners.js             EDIT HERE: every partner/pathway's page content (slugs are load-bearing).
js/site.js                 Engine for public pages: nav + footer, homepage poster/brochures/logo strip, partner pages. Rarely edit.
js/archive.js              EDIT HERE: the GYCO Performances & Activities archive data (dates, events, photos).
js/archive-ui.js           Engine for the archive (year tabs, pagination, detail view). Rarely edit.
js/portal/                 Portal engine: portal-config.js (publishable key + vocabulary +
                           the five-option hub config), portal-core.js (client, guards, chrome,
                           forms, events), portal-pages.js + portal-pages2.js (page renderers,
                           incl. the hub), portal-hub.js (hub destination pages),
                           portal-video.js (real playback tracking), portal-admin.js (dashboard).
js/vendor/supabase.js      Vendored @supabase/supabase-js v2 UMD build (update deliberately).
supabase/migrations/       Ordered, idempotent SQL: schema, functions/triggers, RLS, admin RPCs, seed.
supabase/setup.sql         The five migrations concatenated for one-paste setup. Regenerate when migrations change.
supabase/rls_verification.sql  66 security checks; runs in a transaction and ROLLS BACK.
supabase/PORTAL-SETUP.md   The 3-step Supabase setup + admin how-to.
assets/images, assets/logos  Photos and partner logos.
test/smoke.test.js         404 jsdom DOM tests for the public site (incl. redesign guardrails).
test/preview.js            Zero-dependency local preview server (npm run preview): offline sample data.
test/portal.test.js        172 jsdom DOM tests for the portal (stubbed Supabase).
test/portal-live-check.js  Live anonymous-visitor checks against the real project.
EDITING-GUIDE.md           Plain-English guide for non-technical editors.
context/                   Background: project, brand voice, user preferences.
context/excluded/          Content excluded from the site for now (NADO School, Join Us) + RESTORE.md.
directives/                Rules that MUST be followed (security, git, editing workflow).
skills/                    Reusable review/rewrite procedures.
sources/                   Raw source material (see sources/README.md).
```

## Community Portal rules (important)

- The `sb_publishable_…` key in `js/portal/portal-config.js` is public by design.
  The `sb_secret_…` key and the database password must NEVER appear in this repo.
- Never weaken an RLS policy or a trigger guard without re-running
  `supabase/rls_verification.sql`. Database changes go through NEW numbered files in
  `supabase/migrations/` (additive; never edit applied ones), then regenerate `setup.sql`.
- Admins are granted ONLY via the `portal_admin_emails` table / a manual SQL update —
  there is deliberately no path to admin from the app, and clients cannot change roles.
- Legacy partner pages and their slugs stay untouched: printed QR codes depend on them.
  `programs.html` is a redirect stub into the portal — keep it that way.

## The content model (important)

Almost all editable content lives in **two data files**, not in the HTML:

- `js/config.js` — the `SITE` object (contact, forms, nav, home images, press).
- `js/partners.js` — the `PARTNERS` object (one entry per partner community).

`js/site.js` reads those objects and injects nav, footer, the homepage poster/brochure/logo-strip
sections, and each partner page at runtime. (A third data file, `js/archive.js`, holds the GYCO
performance archive rendered by `js/archive-ui.js`.) **Change content in the data files and every page updates together.** Prefer editing
`config.js`/`partners.js` over hand-editing HTML. See `directives/website_editing_workflow.md`.

Legacy partner **slugs are load-bearing** (`cancer-care`, `nicu`, `disability`, …): printed QR codes
and old URLs depend on them. Never rename a slug — change the visible `name` field instead.

## How to run / test

Two ways to run the site locally:

```bash
npm run preview                  # PORTAL PREVIEW: http://localhost:8010/community/home.html
                                 # offline, sample data, "signed in" already, nothing saved —
                                 # the real Supabase project is never contacted (test/preview.js)
python3 test/preview.py          # the SAME preview without Node (python3 ships with macOS);
                                 # or skip the Terminal entirely: double-click
                                 # "Preview Portal.command" in Finder (opens the browser itself)
python3 -m http.server 8000      # REAL thing: talks to the live Supabase project
                                 # (localhost:8000 is registered in Supabase Auth redirect URLs)
```

To run the tests you need `jsdom` (`node_modules/` is gitignored):

```bash
npm install                      # jsdom only; node_modules is gitignored
npm test                         # expect "404 passed" + "172 passed"
node --check js/site.js          # syntax check (same for js/portal/*.js)
rm -rf node_modules              # optional cleanup
```

Run `npm test` after any change to `js/`, `partners.js`, `config.js`, portal files, or page
structure. After Supabase setup, `npm run test:live` verifies what anonymous visitors can see.

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
