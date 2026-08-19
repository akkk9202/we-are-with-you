# Community Portal — one-time Supabase setup

The portal code is complete and lives in this repo. It talks to one Supabase
project. Three short steps connect them. Total time: about 5 minutes.

Project: `https://umnlnmjzsbhlxqldmubj.supabase.co`

---

## Step 1 — Create the database (one paste)

1. Open the Supabase dashboard → your project → **SQL Editor**.
2. Open `supabase/setup.sql` from this repo, select **all** of it, copy.
3. Paste into the SQL Editor and click **Run**.

That's everything: 10 tables, all Row Level Security policies, triggers,
admin dashboard functions, and seed data (the five communities, three starter
activities, a welcome post, and the admin allow-list). The script is
**idempotent** — running it twice is harmless.

> The same SQL also exists as ordered files in `supabase/migrations/`
> if you ever adopt the Supabase CLI. `setup.sql` is just those files
> concatenated (later one-off migrations like 007/008 are folded into
> the seed or listed below).

### Already ran setup before August 2026? Apply migration 006

If the database was created from an earlier `setup.sql` (migrations 001–005),
paste `supabase/migrations/006_portal_hub_events.sql` into the SQL Editor and
Run once. It adds the two event types used by the five-option portal hub
(`portal_home_viewed`, `portal_option_selected`). Without it the hub still
works, but those engagement events are rejected by the database. Re-running
the full `setup.sql` works too — it is idempotent and now includes 006.

### Database still lists Northside NICU? Apply migration 008

Northside NICU was removed from the site and portal on Aug 19 2026 (no
active partnership). Fresh installs no longer seed it, but an existing
database keeps its row until you paste
`supabase/migrations/008_remove_nicu.sql` into the SQL Editor and Run once
(idempotent). It deletes the community and renumbers the remaining five;
any member who had NICU as their primary community keeps their account and
simply picks a new community in Profile.

## Step 2 — Tell Supabase Auth where the site lives

Dashboard → **Authentication → URL Configuration**:

- **Site URL:** `https://akkk9202.github.io/we-are-with-you/`
- **Redirect URLs** — add both:
  - `https://akkk9202.github.io/we-are-with-you/community/login.html`
  - `https://akkk9202.github.io/we-are-with-you/community/reset-password.html`

> Tip: to click through the portal with sample data and **no** Supabase at all,
> run `npm run preview` instead — see "How to run / test" in CLAUDE.md.

While testing locally (`python3 -m http.server 8000`), also add:
  - `http://localhost:8000/community/login.html`
  - `http://localhost:8000/community/reset-password.html`

Then check **Authentication → Sign In / Providers → Email**:
- **Confirm email** should be **ON** (it is by default) — the portal's
  sign-up flow expects email verification.

## Step 3 — Become an administrator

Sign up in the portal (`community/signup.html`) using
**jakaus2029@gmail.com** or **gyco23@gmail.com** — those two addresses are
on the `portal_admin_emails` allow-list (seeded in Step 1), so the account
is created as an admin automatically. Verify the email, log in, and you'll
see **Admin** in the portal navigation → `/admin/community.html`.

To add another administrator later, run in the SQL Editor:

```sql
insert into portal_admin_emails (email, note) values ('person@example.org', 'who this is');
-- takes effect when that person signs up. For an EXISTING account instead:
update profiles set role = 'admin' where lower(email) = 'person@example.org';
```

(Only the database can grant admin — there is deliberately no way to do it
from the app, and users can never change their own role.)

---

## Verifying it works

- `node test/smoke.test.js` — 503 site DOM tests (needs `npm i jsdom --no-save`)
- `node test/portal.test.js` — 173 portal DOM tests (stubbed Supabase)
- `node test/portal-live-check.js` — live checks against the real project
  (run after Steps 1–2; uses only the public publishable key)
- `supabase/rls_verification.sql` — 66 security/behavior checks that run in a
  transaction and roll back. It was verified against these exact migrations;
  you can also paste it into the SQL Editor after setup — it will report
  PASS/FAIL for every rule and leave **no data behind**.

## Keys — what's public and what's secret

- `sb_publishable_…` (in `js/portal/portal-config.js`) — **public by design**,
  like a YouTube embed key. Safe in the repo. Row Level Security is the wall.
- `sb_secret_…` and the database password — **never** go in this repo or in
  any client file. They live only in the Supabase dashboard.

## Day-to-day admin

Everything happens at `/admin/community.html`: review letters (approve /
reject with a reason / mark delivered / public + private notes), respond to
song/video/letter requests, add content (paste a YouTube link — progress
tracking is automatic), create activities, assign anything to one or many
communities, search/disable/re-enable accounts, view engagement metrics,
and export CSV.
