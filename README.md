# WE ARE WITH YOU — Platform Website

A student-led platform bringing music, learning, encouragement, and human connection
into hospitals, family spaces, senior communities, schools, and global partner communities.

**Live site:** https://akkk9202.github.io/we-are-with-you/

## Structure
- **WE ARE WITH YOU** — the public front door and platform (this site)
- **Community Portal** (`community/`) — the members' area that replaced the Programs tab: accounts, videos with saved progress, letters, song/video requests, activities, and an admin dashboard (`admin/community.html`). Backed by Supabase (auth + Postgres with Row Level Security). See `supabase/PORTAL-SETUP.md`.
- **Partner pages** (`partner.html?p=…`) — the original partner landing pages, kept intact because printed QR codes point at them; they're linked from the footer, the programs redirect stub, and inside the portal
- **GYCO** — More Than Music: the student growth community behind the work
- **NADO School** — *excluded from the site for now* (Aug 2026); the full page is saved in `context/excluded/`
- **NOS** — the operating system that keeps every partner page personal but connected

## Tech
Plain HTML/CSS/JS — no framework, no build step. The public site has zero runtime dependencies.
Nav + footer are injected from `js/config.js`; pathway cards and all partner pages render from `js/partners.js`. Homepage images + the featured press card are configured in `js/config.js`.
The Community Portal (`community/`, `admin/`, `js/portal/`, `css/portal.css`) uses a vendored copy of `@supabase/supabase-js` (`js/vendor/supabase.js`) against a Supabase project; all authorization is enforced server-side by Row Level Security (`supabase/migrations/`).

## Editing
See **EDITING-GUIDE.md** — contact info, form links, nav, and all partner content
are centralized in `js/config.js` and `js/partners.js`.

## Run locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Tests
```bash
npm install          # jsdom (test-only; node_modules is gitignored)
npm test             # 415 site DOM tests + 172 portal DOM tests
npm run test:live    # live checks against the Supabase project (after setup)
```
`supabase/rls_verification.sql` additionally verifies all 66 security rules
inside a rolled-back transaction (see `supabase/PORTAL-SETUP.md`).

## Deploy
Push to `main` — GitHub Pages publishes automatically.

## AI assistant setup files
This repo also includes a few plain-text guide files for AI assistants (and humans) who help with the site. You don't need them for everyday editing, but they're worth knowing about:

- **`CLAUDE.md`** — the main working guide an AI reads first.
- **`context/`** — background: what the project is (`project.md`), how we write (`brand_voice.md`), and how the maintainer likes work done (`user_preferences.md`).
- **`directives/`** — step-by-step workflows to follow: the pre-deploy security check, the GitHub workflow, and the website editing workflow.
- **`skills/`** — reusable review methods for design, content, and security.

Two things to remember before publishing:
- **Run `directives/security_check_before_deploy.md` before every deploy.**
- **Be careful with partner slugs** (`cancer-care`, `nicu`, `disability`, …) **and the redirect stub pages** (`gyco.html`, `voices-of-love.html`, …). Renaming or deleting them can break old links and printed QR codes.
