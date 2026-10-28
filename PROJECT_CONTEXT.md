# WE ARE WITH YOU: Project Context

Review date: October 28, 2026. Maintainer: Aaron Kim.

## Review baseline and boundaries

- Repository: https://github.com/akkk9202/we-are-with-you
- Reviewed main commit: `2d7fe8b5627ec08c6a4258526fcd988cac942b43` (September 2, 2026).
- A complete local checkout was obtained. Main has 102 commits. Recent history and major portal/security milestones were reviewed, not every historical diff.
- A second branch, `design-upgrade`, exists at `8a1b102e80c690011905d0dedf7766bbde54c9ee`; its differences have not been audited. Do not assume it is the current working branch.
- This is an initial source and connection review, not a complete live security or browser audit. No source files, remote branches, deployments, databases, or auth settings were changed. This document is a separate draft, not committed to the repository.
- Treat statements about SQL below as repository definitions until compared with the live database.

## Purpose and design constraints

WE ARE WITH YOU is GYCO's student-led platform for music, encouragement, learning, and community service. Audiences include patients, caregivers, older adults, students, and disability communities. Preserve the calm, warm tone and current visual identity.

Five active community definitions are present in the code: City of Hope Atlanta, Ronald McDonald House in Atlanta, Senior Living, Schools & Global, and Wheat Mission Atlanta (Milal).

Preserve legacy URLs and partner slugs because printed QR codes depend on them. NADO School, Join Us, and Northside NICU have intentionally excluded content under `context/excluded/`; do not restore them accidentally. NICU was removed because there was no active partnership.

## Architecture and stack

The project uses plain HTML, CSS, and JavaScript. There is no React, Next.js, TypeScript, or application build script in the reviewed branch.

- Public pages render static HTML plus shared navigation, footer, partner content, and archive sections from JavaScript data files.
- Community and admin pages are thin HTML shells rendered by `js/portal/`.
- The portal connects directly from the browser to Supabase Auth and its database API using a public publishable key. No application server or API routes were found in the source tree.
- Database RLS, authorization helpers, and triggers are the security boundary. Browser route guards only control the interface.
- Supabase JavaScript v2 is vendored under `js/vendor/supabase.js`.
- `package.json` declares `jsdom ^29.1.1`, used by tests, and test/preview scripts. There is no build script.
- External services include Google Forms, email links, Google Fonts, YouTube embeds and thumbnails, and external social/press links. Personalized fundraising-video requests currently compose an email; they are not saved to Supabase or sent by a server.

## Important file map

| Location | Responsibility |
|---|---|
| `index.html` | Public homepage, mission, posters, brochures, impact, support teaser |
| `student-community.html` | GYCO story and performance/activity archive |
| `media.html` | Media galleries, press, letters of support |
| `our-philosophy.html` | Philosophy page |
| `partner.html?p=SLUG` | Shared legacy partner landing-page template |
| `contact.html` | Contact and ways to support |
| `fundraising/index.html` | Card sponsorship, personalized videos, donation details |
| `fundraising/video-request.html` | Email-composing personalized-video request form |
| `js/config.js` | Contact, forms, navigation, homepage media, press, fundraising settings |
| `js/partners.js` | Legacy partner definitions and slugs |
| `js/site.js` | Public rendering and shared navigation/footer |
| `js/archive.js`, `js/archive-ui.js` | Archive data and rendering |
| `js/i18n.js` | Language-related interface code |
| `css/style.css`, `css/portal.css` | Public design system and portal styles |
| `community/` | Authentication, hub, community, content, activity, profile, request, letter pages |
| `admin/community.html` | Admin dashboard shell |
| `js/portal/portal-config.js` | Supabase project, public key, vocabulary, communities, hub options |
| `js/portal/portal-core.js` | Client, session/profile helpers, guards, navigation, forms, content fetching |
| `js/portal/portal-pages.js` | Intro, authentication, home, community and content views |
| `js/portal/portal-pages2.js` | Profile, activity, submissions, letters, requests and participation |
| `js/portal/portal-hub.js` | Hub destination views |
| `js/portal/portal-video.js` | YouTube/native player and saved progress |
| `js/portal/portal-admin.js` | Metrics, moderation, accounts, content, activities, CSV exports |
| `supabase/migrations/001...008` | Schema, functions, policies, RPCs, seed, hub events and community changes |
| `supabase/setup.sql` | Combined setup script; do not run against an existing project without review |
| `supabase/rls_verification.sql` | Database security verification script; not executed during this review |
| `test/` | DOM tests, live anonymous checks, offline preview and fixtures |
| `CLAUDE.md`, `context/`, `directives/` | Existing development guidance and preferences |

## Implemented functionality found in source

Public features include partner landing pages, legacy redirects, GYCO history, a multi-year performance archive, media/press galleries, letters of support, contact links, sponsorship/donation information, and email/Google Form request paths.

Portal features include email/password signup/login, email verification flow, password recovery, profile editing, account deletion, community selection, and the five-option hub: With You, Melody Box, Wish Pocket, Bloom Bank, and Hope Capsule. Source implements published content, video resume/completion data, letter drafts/submissions, song/video/letter requests, configurable activities, personal activity history, and engagement events.

Admin code includes overview metrics, account search and disable/re-enable, letter moderation and delivery statuses, request review, public/private notes, content publishing and community assignment, activity management, and CSV export. Presence in code does not establish that these features currently work on the live project.

## Database and authentication design in source

Migration 001 defines 13 public tables, not the 10 stated in the setup guide:

| Table | Purpose and relationships |
|---|---|
| `communities` | Community definitions |
| `profiles` | One profile per `auth.users` entry; optional primary community |
| `portal_admin_emails` | Server-side signup admin allow-list |
| `content` | Published/private content; optional author profile |
| `content_communities` | Many-to-many content/community assignment |
| `letters` | Author-owned letters, moderation status, public-sharing consent |
| `activity_requests` | Author-owned letter, video and song requests |
| `admin_private_notes` | Separate admin-only notes attached by subject type and ID |
| `activity_definitions` | Configurable activities |
| `activity_communities` | Many-to-many activity/community assignment |
| `activity_submissions` | User activity responses |
| `video_progress` | Unique user/content progress and milestone flags |
| `activity_events` | Engagement events and metadata |

Roles are `user` and `admin`; account type is a separate descriptive field, not an authorization role. Signup uses a database trigger to create the profile and consult the admin email allow-list. Profile triggers protect role and disabled status. Admin helpers check the profile role and disabled flag. The frontend uses persistent sessions, automatic refresh, and PKCE.

Migration 003 enables RLS on all 13 tables. Logged-out readers can access active communities and content that is both published and public. Active signed-in members can access published content and their own private records, plus approved/delivered shared letters. Admin policies authorize moderation and management. Content-community assignments organize content; they do not create private tenant isolation between communities. Private notes are stored separately with admin-only policies.

Admin metrics and activity-feed RPCs check admin authorization. Account deletion deletes the auth record and cascades through related user records. Private notes use a generic subject UUID rather than a foreign key, so their retention after user deletion deserves a separate review.

## Connected services and deployment evidence

### GitHub

Access confirmed. The repository is public. The latest main commit has a successful Vercel status linking to https://vercel.com/gyco/we-are-with-you/Eaz4qp63rwrTypTDwChH2MDiRxA2.

GitHub Pages also successfully deployed that commit on September 2, 2026. The five most recent Pages runs returned success. Latest run: https://github.com/akkk9202/we-are-with-you/actions/runs/33653981957.

### Vercel

Integration installed and tools available. The project request under team `gyco` returned 403 because the connection needs team authorization. A temporary consent link was issued separately. Team ID returned by Vercel: `team_Pxz4AIddxLtvTl4alKzEkHgu`.

Project name from the commit-status URL: `we-are-with-you`. Project ID, production domain, production branch setting, build settings, environment configuration, deployment logs and preview behavior remain unverified. No `vercel.json`, `.vercel/project.json`, or checked-in GitHub Actions workflow was found in the reviewed tree. GitHub's Pages workflow is platform-generated.

The code's `SITE.baseUrl`, README and setup guide still point to `https://akkk9202.github.io/we-are-with-you/`. Both hosts have deployment evidence; do not assume which one is canonical. Confirm Vercel settings and Supabase redirect allow-lists before changing URLs.

### Supabase

Access confirmed to the exact project configured by the frontend:

- Project reference: `umnlnmjzsbhlxqldmubj`
- Name: `gyco page community`
- Region: `ca-central-1`
- Reported state: **INACTIVE**
- Database engine reported: PostgreSQL 17
- Table inspection failed with: `Database is possibly not accessible at the moment`.
- Edge Function listing returned an empty list.

No resume, migration, policy change, auth update, or user-record write was attempted. Live schema, RLS, applied migrations, auth confirmation/redirect settings, storage buckets, and database advisories remain unverified. Repository SQL must not be assumed to match the deployed database. Inactivity is a likely blocker for live portal operations; the cause and current end-user behavior have not been established.

## Findings and follow-ups

1. **Live portal availability:** Supabase is inactive and database inspection fails. Investigate and agree on resuming the existing project before attempting production auth/data checks. Do not create a replacement database.
2. **Confirmed admin redirect defect:** `Portal.requireAuth()` in `js/portal/portal-core.js` uses `login.html` relative to the current folder. A local execution of the real guard from `/admin/community.html` resolved to `/admin/login.html?next=community.html`; the login page is under `/community/`. Shared portal navigation and logout also use same-folder links, so admin-context routes require review. No fix applied.
3. **Content filtering can omit valid results:** `fetchContent()` applies the database limit (default 60) before filtering by community in the browser. Older items for a community can be omitted even when that community has few items. This follows from code ordering; no production-data reproduction was performed.
4. **Admin relationship saves can partially succeed:** content and activity updates delete community assignments and insert replacements as separate API requests. A failed insert can leave assignments removed; some response errors are ignored. A future transactional database function would make these operations atomic, subject to approval.
5. **Video-save failures can be silent:** `portal-video.js` awaits an upsert without checking its returned `error`, then records the progress as saved locally. This can hide rejected writes.
6. **Playback metrics are position-based:** the player reports current playback position, not accumulated watch time. Seeking near the end can satisfy completion thresholds. The SQL also accepts a supplied completion percentage when total duration is missing. Do not describe this data as verified watch time or use it as proof of attendance.
7. **Shared-letter privacy needs review:** RLS permits active users to read shared-letter rows, while author-name hiding occurs in the UI. Row access is not column redaction; fields such as author IDs and review metadata remain part of the underlying table unless live grants differ. No live exposure was tested.
8. **CSV export hardening:** CSV quoting exists, but formula-leading cell values are not neutralized. User-supplied values could be interpreted as formulas by spreadsheet applications. Source finding only.
9. **Documentation drift:** `context/project.md` predates the portal and current contact/forms; test counts differ between guides; setup says 10 tables while migration 001 defines 13; some comments still say six communities. Existing commit instructions also include Claude-specific attribution that must not be copied for future work by another assistant.
10. **Intentional incomplete configuration:** `js/config.js` still contains placeholder form URLs. Several support actions intentionally fall back to email, and video-request uses its built-in email composer. Assess each visible action before treating a placeholder as a broken feature. Suggested contribution fields are intentionally empty. Some archive venue labels await exact names.

## Verification performed

- Complete checkout matched `2d7fe8b5627ec08c6a4258526fcd988cac942b43`.
- Installed locked test dependencies in a separate review directory with lifecycle scripts disabled.
- Ran existing `npm test` against the complete checkout using those dependencies: **527 public-site checks passed, 0 failed; 173 portal checks passed, 0 failed**.
- Ran `node --check` on all 13 first-party JavaScript files: no syntax failures.
- Reproduced the logged-out admin redirect using the real route-guard code with a minimal local auth/document stub.
- Confirmed the source checkout remained clean after tests.
- An earlier portal test attempt on a partial text-only copy stopped because the preview launcher file was absent. The subsequent full-checkout run above completed successfully.
- No live login/signup/submission tests, browser layout/accessibility testing, live RLS tests, SQL verification script, or deployment was performed. Passing mocked DOM tests does not establish live auth, database security, or email delivery.

## Recent development history

- Earlier work added static-site security hardening, then the Supabase community portal and five-option hub.
- August changes revised portal design/signup, archived NADO/Join Us, added fundraising and email request paths, updated brochures/community naming, and removed NICU.
- Latest main commit adds 2023–2026 archive records, Times-Herald press, and letters of support.

## Working agreement and next steps

Preserve design, layout, branding, working features and legacy QR paths. Read the relevant source before each change. Explain the proposed files and risks, make minimal maintainable edits, test affected behavior, and report exact results. Obtain approval before production database/auth/deployment-configuration changes. Establish a separate branch and record the starting commit before significant edits. Never expose or commit secrets. The publishable Supabase key is intentionally public; it does not replace RLS.

Do not push, open/merge a PR, or deploy without the requested authorization. Prefer preview validation before a production release. Do not execute the existing setup script merely because documentation calls it idempotent.

Next: complete Vercel team authorization; inspect its actual project/settings/logs; resolve Supabase inactivity with Aaron; compare live schema and policies against repository migrations; verify canonical domain and auth redirects; then ask Aaron to select the first feature or repair. The initial recommendation is portal availability, followed by admin navigation. Keep this document updated with verified changes, test results and outstanding unknowns.


## Visitor-first redesign: October 28, 2026

User explicitly authorized a substantial visual redesign, a separate Git branch, and Vercel preview deployment. Production release and Supabase changes remain excluded.

- Branch: `redesign/visitor-first`.
- Production rollback baseline: `2d7fe8b5627ec08c6a4258526fcd988cac942b43`.
- First redesign commit: `168adc5b98fa1e7f5807cbee4cb8bbf8f78ac3fa`.
- Preview deployment: `dpl_4pEfHX9XDcpa92F13mr4fvsVeEAi`, Vercel READY.
- Preview URL: https://we-are-with-esczg69sc-gyco.vercel.app/
- Vercel project access now confirmed: `prj_x1cUGn3SLucovuPeBHJnndmCSTrS`, team `team_Pxz4AIddxLtvTl4alKzEkHgu`.
- Verified production custom domain: https://www.we-are-with-you.org/ (bare domain redirects here).
- Production deployment remained the baseline `dpl_Eaz4qp63rwrTypTDwChH2MDiRxA2` when inspected.
- Preview protection is enabled (`all_except_custom_domains`). A temporary public share-link request was rejected by automatic approval review because sharing to anyone with the link had not been explicitly authorized. No share link was created. Do not bypass this; obtain approval for the specific audience/duration or use authorized private access.

### Visual review and direction

Inspected actual production homepage, Media and portal entry in a desktop browser. Observed: homepage primary action falls below long introductory copy; printed brochures dominate the first screen; inner pages repeat a large dark banner; portal entry prioritizes account creation without a clear public browsing path. Mobile live review and post-change visual review are still pending, not passed. A local preview server could not be reached by the cloud browser.

Selected direction: warm editorial presentation using existing Fraunces and Instrument Sans, cream surfaces, navy brand text, restrained olive and gold accents, square-corner photography, fine dividers and readable sentence-case navigation. Considered retaining the formal navy bands versus a highly decorative scrapbook approach; chose a restrained photograph-led layout to suit both community visitors and older adults.

### Implemented

Homepage now starts with the canonical slogan, an existing Ronald McDonald House performance photo, a short invitation, an experience anchor and the existing public GYCO video. Five direct links reuse Melody Box, With You, Wish Pocket, Bloom Bank and Hope Capsule destinations. Community links retain legacy partner slugs. The story follows visitor choices. Brochures and the original poster remain available in an expandable section. Founder attribution and existing service history remain in the story details. Support/contact links remain.

The shared stylesheet applies warmer surfaces, larger navigation, clear focus states, 48px primary buttons and responsive layouts to public pages. Portal stylesheet applies the same system to forms, navigation, content and hub. Portal entry now offers the public Media page and GYCO video without signing in, and explains why accounts are useful. Existing auth guards, queries, policies and stored data were not changed. Shared menus now support Escape-to-close and explicit aria-controls.

Files changed: `index.html`, `css/style.css`, `css/portal.css`, `js/site.js`, `js/portal/portal-core.js`, `js/portal/portal-pages.js`, `test/smoke.test.js`. Added `test/visual-review.html` for same-origin iframe checks at 320/390/768/1024/1440px; this is a development review route, not linked in the public navigation.

### Verification and limitations

- 495 public DOM checks and 173 portal DOM checks passed on the first redesign commit.
- Replaced obsolete homepage copy/layout assertions with visitor-path, asset, legacy-link, content-order and keyboard-navigation checks. Other public-page tests and existing portal tests remain in place. The lower test count reflects retired layout assertions, not a claim of identical coverage.
- First-party JS syntax checks and `git diff --check` passed.
- Vercel automatically created a READY preview from the new branch.
- No production release, schema migration, auth update or policy change was performed.
- Desktop/mobile screenshot verification, visual refinement, full keyboard interaction and signed-in live flows remain outstanding. Do not call the redesign final or production-ready until these are completed.

### Future Supabase plan, after visual approval

1. Resolve existing project inactivity with approval, then inspect live schema, RLS, grants, functions, storage and auth redirects. Compare with repository migrations before any changes.
2. Existing capabilities: published/public content, user profiles and primary community, personal requests/letters, video progress, activities and admin metrics. Keep public browsing separate from private submissions.
3. Near-term improvement requiring development: a small public content feed on the homepage using only `is_published AND is_public` data, with static fallbacks and no user-specific requests. Reuse existing content detail routes and validate actual RLS first.
4. Optional visitor-chosen interests/community can be local-only, without collecting health details. For signed-in members, existing profile and progress can support a resume area. Do not infer diagnoses or expose private letters in a public feed.
5. Partner-specific management roles are a new authorization feature, not currently implemented. Define permissions and test isolation before adding them.
6. Known reliability/security findings in the initial review remain separate follow-up work, including admin route paths, relationship save transactions, video error handling and shared-letter column privacy. They have not been silently fixed during the visual redesign.

Next action: gain authorized preview-browser access, review the responsive harness and real pages, resolve visual issues, and update this document with exact verified results. Keep production untouched until Aaron reviews and approves.
