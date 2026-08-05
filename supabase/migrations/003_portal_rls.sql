-- ============================================================
-- WE ARE WITH YOU · Community Portal
-- Migration 003 — Row Level Security
-- Idempotent: safe to re-run.
--
-- Model:
--   anon (logged out)  → active communities + content that is BOTH
--                        published AND explicitly public. Nothing else.
--   authenticated user → published content, own rows only everywhere.
--   admin              → verified through the profiles table via
--                        is_admin() (SECURITY DEFINER), never client-side.
-- ============================================================

alter table public.communities          enable row level security;
alter table public.profiles             enable row level security;
alter table public.portal_admin_emails  enable row level security;
alter table public.content              enable row level security;
alter table public.content_communities  enable row level security;
alter table public.letters              enable row level security;
alter table public.activity_requests    enable row level security;
alter table public.admin_private_notes  enable row level security;
alter table public.activity_definitions enable row level security;
alter table public.activity_communities enable row level security;
alter table public.activity_submissions enable row level security;
alter table public.video_progress       enable row level security;
alter table public.activity_events      enable row level security;

-- ── communities ─────────────────────────────────────────────
drop policy if exists communities_read  on public.communities;
create policy communities_read on public.communities for select
  using (is_active or public.is_admin());
drop policy if exists communities_admin_write on public.communities;
create policy communities_admin_write on public.communities
  for all using (public.is_admin()) with check (public.is_admin());

-- ── profiles ────────────────────────────────────────────────
drop policy if exists profiles_read_own  on public.profiles;
create policy profiles_read_own on public.profiles for select
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update
  using ((id = auth.uid() and not is_disabled) or public.is_admin())
  with check ((id = auth.uid()) or public.is_admin());
-- no insert policy (rows are created by the auth trigger only)
-- no delete policy (deletion happens via delete_own_account / admin workflow)

-- ── portal_admin_emails: admins read, nobody writes via API ─
drop policy if exists admin_emails_admin_read on public.portal_admin_emails;
create policy admin_emails_admin_read on public.portal_admin_emails for select
  using (public.is_admin());

-- ── content ─────────────────────────────────────────────────
drop policy if exists content_read on public.content;
create policy content_read on public.content for select
  using (
    (is_published and is_public)                                   -- approved public content, even logged out
    or (is_published and public.is_active_user())                  -- any signed-in, non-disabled user
    or public.is_admin()
  );
drop policy if exists content_admin_write on public.content;
create policy content_admin_write on public.content
  for all using (public.is_admin()) with check (public.is_admin());

-- ── content_communities ─────────────────────────────────────
drop policy if exists ccommunities_read on public.content_communities;
create policy ccommunities_read on public.content_communities for select
  using (
    exists (select 1 from public.content c
            where c.id = content_id
              and ((c.is_published and c.is_public)
                or (c.is_published and public.is_active_user())))
    or public.is_admin()
  );
drop policy if exists ccommunities_admin_write on public.content_communities;
create policy ccommunities_admin_write on public.content_communities
  for all using (public.is_admin()) with check (public.is_admin());

-- ── letters ─────────────────────────────────────────────────
drop policy if exists letters_read on public.letters;
create policy letters_read on public.letters for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    -- community-visible letters: only with the author's explicit
    -- public-display permission, only once approved/delivered, and the
    -- portal always renders them WITHOUT the author's name.
    or (is_public and status in ('approved','delivered') and public.is_active_user())
  );
drop policy if exists letters_insert_own on public.letters;
create policy letters_insert_own on public.letters for insert
  with check ((user_id = auth.uid() and public.is_active_user()) or public.is_admin());
drop policy if exists letters_update on public.letters;
create policy letters_update on public.letters for update
  using ((user_id = auth.uid() and status = 'draft' and public.is_active_user()) or public.is_admin())
  with check ((user_id = auth.uid()) or public.is_admin());
drop policy if exists letters_delete on public.letters;
create policy letters_delete on public.letters for delete
  using ((user_id = auth.uid() and status = 'draft') or public.is_admin());

-- ── activity_requests ───────────────────────────────────────
drop policy if exists requests_read on public.activity_requests;
create policy requests_read on public.activity_requests for select
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists requests_insert_own on public.activity_requests;
create policy requests_insert_own on public.activity_requests for insert
  with check ((user_id = auth.uid() and public.is_active_user()) or public.is_admin());
drop policy if exists requests_admin_update on public.activity_requests;
create policy requests_admin_update on public.activity_requests for update
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists requests_admin_delete on public.activity_requests;
create policy requests_admin_delete on public.activity_requests for delete
  using (public.is_admin());

-- ── admin_private_notes: admin only, all operations ─────────
drop policy if exists notes_admin_all on public.admin_private_notes;
create policy notes_admin_all on public.admin_private_notes
  for all using (public.is_admin()) with check (public.is_admin());

-- ── activity_definitions ────────────────────────────────────
drop policy if exists activities_read on public.activity_definitions;
create policy activities_read on public.activity_definitions for select
  using ((is_active and public.is_active_user()) or public.is_admin());
drop policy if exists activities_admin_write on public.activity_definitions;
create policy activities_admin_write on public.activity_definitions
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists acommunities_read on public.activity_communities;
create policy acommunities_read on public.activity_communities for select
  using (
    exists (select 1 from public.activity_definitions a
            where a.id = activity_id and a.is_active and public.is_active_user())
    or public.is_admin()
  );
drop policy if exists acommunities_admin_write on public.activity_communities;
create policy acommunities_admin_write on public.activity_communities
  for all using (public.is_admin()) with check (public.is_admin());

-- ── activity_submissions ────────────────────────────────────
drop policy if exists subs_read on public.activity_submissions;
create policy subs_read on public.activity_submissions for select
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists subs_insert_own on public.activity_submissions;
create policy subs_insert_own on public.activity_submissions for insert
  with check ((user_id = auth.uid() and public.is_active_user()) or public.is_admin());
drop policy if exists subs_update on public.activity_submissions;
create policy subs_update on public.activity_submissions for update
  using ((user_id = auth.uid() and public.is_active_user()) or public.is_admin())
  with check ((user_id = auth.uid()) or public.is_admin());
drop policy if exists subs_admin_delete on public.activity_submissions;
create policy subs_admin_delete on public.activity_submissions for delete
  using (public.is_admin());

-- ── video_progress ──────────────────────────────────────────
drop policy if exists vprogress_read on public.video_progress;
create policy vprogress_read on public.video_progress for select
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists vprogress_insert_own on public.video_progress;
create policy vprogress_insert_own on public.video_progress for insert
  with check ((user_id = auth.uid() and public.is_active_user()) or public.is_admin());
drop policy if exists vprogress_update_own on public.video_progress;
create policy vprogress_update_own on public.video_progress for update
  using ((user_id = auth.uid() and public.is_active_user()) or public.is_admin())
  with check ((user_id = auth.uid()) or public.is_admin());
drop policy if exists vprogress_delete_own on public.video_progress;
create policy vprogress_delete_own on public.video_progress for delete
  using (user_id = auth.uid() or public.is_admin());

-- ── activity_events: own events readable; insert own; immutable ──
drop policy if exists events_read on public.activity_events;
create policy events_read on public.activity_events for select
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists events_insert_own on public.activity_events;
create policy events_insert_own on public.activity_events for insert
  with check ((user_id = auth.uid() and public.is_active_user()) or public.is_admin());
-- no update/delete policies: the audit trail is append-only via the API
