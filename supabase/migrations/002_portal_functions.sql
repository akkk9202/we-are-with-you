-- ============================================================
-- WE ARE WITH YOU · Community Portal
-- Migration 002 — helper functions + triggers
-- Idempotent: safe to re-run.
-- ============================================================

-- ── updated_at maintenance ──────────────────────────────────
create or replace function public.portal_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['communities','profiles','content','letters','activity_requests',
                           'activity_definitions','activity_submissions','video_progress']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I
                    for each row execute function public.portal_set_updated_at()', t);
  end loop;
end $$;

-- ── authorization helpers ───────────────────────────────────
-- SECURITY DEFINER so they can read profiles regardless of RLS.
-- Admin status comes from the database row, never from the client.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and not is_disabled
  );
$$;

create or replace function public.is_active_user()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and not is_disabled
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
revoke all on function public.is_active_user() from public;
grant execute on function public.is_active_user() to anon, authenticated;

-- ── internal event logger (bypasses RLS via definer) ────────
create or replace function public.portal_log_event(
  p_user uuid, p_type text, p_community uuid default null,
  p_content uuid default null, p_submission uuid default null,
  p_metadata jsonb default '{}'::jsonb)
returns void language sql security definer set search_path = public as $$
  insert into public.activity_events (user_id, event_type, community_id, content_id, submission_id, metadata)
  values (p_user, p_type, p_community, p_content, p_submission, coalesce(p_metadata, '{}'::jsonb));
$$;
revoke all on function public.portal_log_event(uuid,text,uuid,uuid,uuid,jsonb) from public, anon, authenticated;

-- ── new-user profile trigger ────────────────────────────────
-- Creates the profile row from sign-up metadata. Account type and
-- community are validated server-side; role comes ONLY from the
-- portal_admin_emails allow-list — never from client metadata.
create or replace function public.portal_handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_name  text;
  v_type  text;
  v_comm  uuid;
  v_role  text := 'user';
  v_consent boolean;
begin
  v_name := coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), split_part(coalesce(new.email,''), '@', 1));
  v_type := new.raw_user_meta_data->>'account_type';
  if v_type is null or v_type not in ('participant','family_member','student_volunteer','staff_member','community_member') then
    v_type := 'community_member';
  end if;
  select id into v_comm from public.communities
    where id = nullif(new.raw_user_meta_data->>'primary_community_id','')::uuid and is_active;
  v_consent := coalesce((new.raw_user_meta_data->>'email_consent')::boolean, false);
  if exists (select 1 from public.portal_admin_emails where lower(email) = lower(coalesce(new.email,''))) then
    v_role := 'admin';
  end if;

  insert into public.profiles (id, full_name, email, account_type, primary_community_id, role, email_consent)
  values (new.id, v_name, new.email, v_type, v_comm, v_role, v_consent)
  on conflict (id) do nothing;

  perform public.portal_log_event(new.id, 'account_created', v_comm);
  if v_comm is not null then
    perform public.portal_log_event(new.id, 'community_selected', v_comm);
  end if;
  return new;
end $$;

drop trigger if exists portal_on_auth_user_created on auth.users;
create trigger portal_on_auth_user_created
  after insert on auth.users
  for each row execute function public.portal_handle_new_user();

-- ── profile column protection ───────────────────────────────
-- Users may edit their own profile, but can NEVER change id, role,
-- is_disabled, email, or created_at. Only admins can. Users can never
-- change their own role even if they are an admin-in-the-making.
create or replace function public.portal_protect_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.id          := old.id;
    new.role        := old.role;
    new.is_disabled := old.is_disabled;
    new.email       := old.email;
    new.created_at  := old.created_at;
  else
    -- even admins cannot change their OWN role/disabled flag (no self-demotion accidents,
    -- and definitely no self-promotion path anywhere).
    if old.id = auth.uid() then
      new.role        := old.role;
      new.is_disabled := old.is_disabled;
    end if;
    new.id := old.id;
  end if;

  if new.primary_community_id is distinct from old.primary_community_id then
    perform public.portal_log_event(old.id, 'primary_community_changed', new.primary_community_id,
      null, null, jsonb_build_object('from', old.primary_community_id, 'to', new.primary_community_id));
  end if;
  if (new.full_name, new.account_type, new.email_consent) is distinct from
     (old.full_name, old.account_type, old.email_consent) then
    perform public.portal_log_event(old.id, 'profile_updated');
  end if;
  return new;
end $$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile before update on public.profiles
  for each row execute function public.portal_protect_profile();

-- ── letters guard: safe status transitions + events ─────────
create or replace function public.portal_letters_guard()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_admin boolean := public.is_admin();
begin
  if tg_op = 'INSERT' then
    if not v_admin then
      new.user_id          := auth.uid();
      if new.status not in ('draft','submitted') then new.status := 'draft'; end if;
      new.reviewed_by      := null;
      new.reviewed_at      := null;
      new.rejection_reason := null;
      new.public_notes     := null;
      new.is_public        := false;
    end if;
    if new.status = 'draft' then
      perform public.portal_log_event(new.user_id, 'letter_draft_created', new.community_id, null, new.id);
    elsif new.status = 'submitted' then
      perform public.portal_log_event(new.user_id, 'letter_written',   new.community_id, null, new.id);
      perform public.portal_log_event(new.user_id, 'letter_submitted', new.community_id, null, new.id);
    end if;
    return new;
  end if;

  -- UPDATE
  if not v_admin then
    -- authors may only edit their own drafts, and may only move draft → submitted
    if old.user_id <> auth.uid() or old.status <> 'draft' then
      raise exception 'letters: only your own drafts can be edited';
    end if;
    if new.status not in ('draft','submitted') then
      raise exception 'letters: invalid status change';
    end if;
    new.user_id          := old.user_id;
    new.reviewed_by      := old.reviewed_by;
    new.reviewed_at      := old.reviewed_at;
    new.rejection_reason := old.rejection_reason;
    new.public_notes     := old.public_notes;
    new.is_public        := old.is_public;
    if old.status = 'draft' and new.status = 'submitted' then
      perform public.portal_log_event(new.user_id, 'letter_written',   new.community_id, null, new.id);
      perform public.portal_log_event(new.user_id, 'letter_submitted', new.community_id, null, new.id);
    end if;
  else
    if new.status = 'rejected' and coalesce(trim(new.rejection_reason),'') = '' then
      raise exception 'letters: a rejection reason is required';
    end if;
    if new.status is distinct from old.status and new.status in ('under_review','approved','delivered','rejected') then
      new.reviewed_by := coalesce(new.reviewed_by, auth.uid());
      new.reviewed_at := coalesce(new.reviewed_at, now());
    end if;
  end if;
  return new;
end $$;

drop trigger if exists letters_guard on public.letters;
create trigger letters_guard before insert or update on public.letters
  for each row execute function public.portal_letters_guard();

-- ── requests guard: force ownership + request events ────────
create or replace function public.portal_requests_guard()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_event text;
begin
  if tg_op = 'INSERT' then
    if not public.is_admin() then
      new.user_id      := auth.uid();
      new.status       := 'submitted';
      new.public_notes := null;
    end if;
    v_event := case
      when new.request_type = 'letter' then 'letter_requested'
      when new.request_type = 'song'   then 'song_requested'
      else 'video_requested' end;
    perform public.portal_log_event(new.user_id, v_event, new.community_id, null, new.id,
      jsonb_build_object('request_type', new.request_type));
  end if;
  return new;
end $$;

drop trigger if exists requests_guard on public.activity_requests;
create trigger requests_guard before insert on public.activity_requests
  for each row execute function public.portal_requests_guard();

-- ── activity submissions guard + events ─────────────────────
create or replace function public.portal_submissions_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if not public.is_admin() then
      new.user_id := auth.uid();
      if new.status not in ('started','submitted','completed') then new.status := 'started'; end if;
    end if;
    if new.status = 'completed' then new.completed_at := coalesce(new.completed_at, now()); end if;
    if new.status in ('submitted','completed') then new.submitted_at := coalesce(new.submitted_at, now()); end if;
    perform public.portal_log_event(new.user_id, 'activity_started', new.community_id, null, new.id,
      jsonb_build_object('activity_id', new.activity_id));
    if new.status = 'completed' then
      perform public.portal_log_event(new.user_id, 'activity_completed', new.community_id, null, new.id,
        jsonb_build_object('activity_id', new.activity_id));
    end if;
    return new;
  end if;

  if not public.is_admin() then
    if old.user_id <> auth.uid() then
      raise exception 'submissions: not yours';
    end if;
    new.user_id     := old.user_id;
    new.activity_id := old.activity_id;
  end if;
  if new.status = 'completed' and old.status <> 'completed' then
    new.completed_at := coalesce(new.completed_at, now());
    perform public.portal_log_event(new.user_id, 'activity_completed', new.community_id, null, new.id,
      jsonb_build_object('activity_id', new.activity_id));
  end if;
  if new.status in ('submitted','completed') then
    new.submitted_at := coalesce(new.submitted_at, old.submitted_at, now());
  end if;
  return new;
end $$;

drop trigger if exists submissions_guard on public.activity_submissions;
create trigger submissions_guard before insert or update on public.activity_submissions
  for each row execute function public.portal_submissions_guard();

-- ── video progress guard: real playback only, milestones once ──
-- The client only ever reports progress_seconds / total_seconds.
-- Percentages, milestone flags, completion, and milestone EVENTS are
-- computed here — monotonic, and fired exactly once per user+video.
create or replace function public.portal_video_progress_guard()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_pct numeric;
  v_old_25 boolean := false; v_old_50 boolean := false; v_old_75 boolean := false; v_old_done boolean := false;
begin
  if not public.is_admin() then
    new.user_id := auth.uid();
  end if;

  if tg_op = 'UPDATE' then
    if new.user_id <> old.user_id or new.content_id <> old.content_id then
      raise exception 'video_progress: key columns are immutable';
    end if;
    v_old_25 := old.reached_25; v_old_50 := old.reached_50; v_old_75 := old.reached_75; v_old_done := old.completed;
    -- progress never moves backwards for milestone purposes
    new.progress_seconds := greatest(coalesce(new.progress_seconds,0), 0);
  end if;

  if coalesce(new.total_seconds, 0) > 0 then
    v_pct := least(100, round((new.progress_seconds / new.total_seconds) * 100, 1));
  else
    v_pct := coalesce(new.completion_percentage, 0);
  end if;
  -- percentage may display current position, but milestone flags are monotonic
  new.completion_percentage := v_pct;

  new.reached_25 := v_old_25 or v_pct >= 25;
  new.reached_50 := v_old_50 or v_pct >= 50;
  new.reached_75 := v_old_75 or v_pct >= 75;
  -- completion requires ≥90% actually watched (or an explicit ended signal
  -- from the player, which the client reports as progress = total).
  new.completed  := v_old_done or v_pct >= 90;
  new.last_watched_at := now();

  if new.reached_25 and not v_old_25 then
    perform public.portal_log_event(new.user_id, 'video_progress_25', null, new.content_id);
  end if;
  if new.reached_50 and not v_old_50 then
    perform public.portal_log_event(new.user_id, 'video_progress_50', null, new.content_id);
  end if;
  if new.reached_75 and not v_old_75 then
    perform public.portal_log_event(new.user_id, 'video_progress_75', null, new.content_id);
  end if;
  if new.completed and not v_old_done then
    perform public.portal_log_event(new.user_id, 'video_completed', null, new.content_id);
  end if;
  return new;
end $$;

drop trigger if exists video_progress_guard on public.video_progress;
create trigger video_progress_guard before insert or update on public.video_progress
  for each row execute function public.portal_video_progress_guard();

-- ── events guard: clients can only write their own events ───
create or replace function public.portal_events_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.user_id := auth.uid();
  end if;
  return new;
end $$;

drop trigger if exists events_guard on public.activity_events;
create trigger events_guard before insert on public.activity_events
  for each row execute function public.portal_events_guard();

-- ── account deletion (confirmed, self-service) ──────────────
-- Deleting the auth user cascades to the profile, and from the profile
-- to letters, requests, submissions, video progress, and events —
-- personal data is fully removed. Program content (content table) only
-- loses its created_by reference (set null).
create or replace function public.delete_own_account()
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
