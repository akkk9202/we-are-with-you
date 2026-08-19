-- ============================================================
-- WE ARE WITH YOU · Community Portal — ONE-PASTE SETUP
-- Paste this entire file into the Supabase SQL Editor and Run.
-- It is idempotent: running it twice is safe.
-- Generated from supabase/migrations/001–006 on 2026-08-04.
-- ============================================================

-- ▶▶ supabase/migrations/001_portal_schema.sql
-- ============================================================
-- WE ARE WITH YOU · Community Portal
-- Migration 001 — schema (tables + indexes)
-- Idempotent: safe to re-run.
-- ============================================================

create extension if not exists pgcrypto;

-- ── communities ─────────────────────────────────────────────
create table if not exists public.communities (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  image_url     text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── profiles (1:1 with auth.users) ──────────────────────────
create table if not exists public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  full_name            text not null default '',
  email                text,
  account_type         text not null default 'community_member'
                       check (account_type in
                         ('participant','family_member','student_volunteer','staff_member','community_member')),
  primary_community_id uuid references public.communities(id) on delete set null,
  role                 text not null default 'user' check (role in ('user','admin')),
  email_consent        boolean not null default false,
  is_disabled          boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Admin allow-list consulted at signup (server-side; users can never
-- write to it — see RLS). Adding an email here makes that account an
-- admin on its NEXT sign-up (not retroactively).
create table if not exists public.portal_admin_emails (
  email      text primary key,
  note       text,
  created_at timestamptz not null default now()
);

-- ── content ─────────────────────────────────────────────────
create table if not exists public.content (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  content_type text not null check (content_type in
    ('performance_video','teaching_video','letter','encouraging_message','song_performance',
     'educational_resource','community_story','community_update','program_announcement',
     'event','activity')),
  video_url    text,
  image_url    text,
  body         text,
  language     text,
  created_by   uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  is_published boolean not null default false,
  is_featured  boolean not null default false,
  is_public    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.content_communities (
  content_id   uuid not null references public.content(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (content_id, community_id)
);

-- ── letters ─────────────────────────────────────────────────
create table if not exists public.letters (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references public.profiles(id) on delete cascade,
  community_id              uuid references public.communities(id) on delete set null,
  recipient_type            text not null check (recipient_type in
    ('child','parent','patient','caregiver','senior','student','staff_member','person_with_disability')),
  title                     text not null,
  body                      text not null,
  status                    text not null default 'draft' check (status in
    ('draft','submitted','under_review','approved','delivered','rejected')),
  public_display_permission boolean not null default false,
  is_public                 boolean not null default false,
  reviewed_by               uuid references public.profiles(id) on delete set null,
  reviewed_at               timestamptz,
  rejection_reason          text,
  public_notes              text,        -- visible to the letter's author
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  constraint letters_public_requires_permission check ((not is_public) or public_display_permission)
);

-- ── activity_requests (letter / video / song requests) ──────
create table if not exists public.activity_requests (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references public.profiles(id) on delete cascade,
  community_id              uuid references public.communities(id) on delete set null,
  request_type              text not null check (request_type in
    ('letter','teaching_video','musical_performance','encouragement_message',
     'rhythm_activity','breathing_activity','storytelling_video','song')),
  title                     text not null,
  details                   text,
  preferred_language        text,
  intended_audience         text,
  recipient_name            text,
  recipient_email           text,
  public_display_permission boolean not null default false,
  email_permission          boolean not null default false,
  contact_permission        boolean not null default false,
  extra                     jsonb not null default '{}'::jsonb,
  status                    text not null default 'submitted' check (status in
    ('submitted','under_review','in_progress','completed','declined')),
  public_notes              text,        -- visible to the requester
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- Private administrator notes live in their OWN table (not a column),
-- so Row Level Security can guarantee normal users never read them.
create table if not exists public.admin_private_notes (
  id           uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('letter','request','submission','profile','content')),
  subject_id   uuid not null,
  note         text not null,
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ── activities (admin-defined, config-driven) ───────────────
create table if not exists public.activity_definitions (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  activity_type text not null default 'activity',
  instructions  text,
  configuration jsonb not null default '{}'::jsonb,
  is_active     boolean not null default true,
  created_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.activity_communities (
  activity_id  uuid not null references public.activity_definitions(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (activity_id, community_id)
);

create table if not exists public.activity_submissions (
  id            uuid primary key default gen_random_uuid(),
  activity_id   uuid not null references public.activity_definitions(id) on delete restrict,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  community_id  uuid references public.communities(id) on delete set null,
  status        text not null default 'started' check (status in ('started','submitted','completed')),
  response_data jsonb not null default '{}'::jsonb,
  submitted_at  timestamptz,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── video progress (one row per user × content) ─────────────
create table if not exists public.video_progress (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  content_id            uuid not null references public.content(id) on delete cascade,
  progress_seconds      numeric not null default 0,
  total_seconds         numeric,
  completion_percentage numeric not null default 0,
  completed             boolean not null default false,
  reached_25            boolean not null default false,
  reached_50            boolean not null default false,
  reached_75            boolean not null default false,
  last_watched_at       timestamptz not null default now(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (user_id, content_id)
);

-- ── engagement events ───────────────────────────────────────
create table if not exists public.activity_events (
  id            bigint generated always as identity primary key,
  user_id       uuid references public.profiles(id) on delete cascade,
  community_id  uuid references public.communities(id) on delete set null,
  event_type    text not null check (event_type in
    ('account_created','logged_in','logged_out','community_selected','primary_community_changed',
     'community_page_visited','content_opened','video_opened','video_started',
     'video_progress_25','video_progress_50','video_progress_75','video_completed',
     'letter_opened','letter_draft_created','letter_written','letter_submitted',
     'letter_requested','video_requested','song_requested',
     'activity_started','activity_completed','event_registration_submitted',
     'feedback_submitted','profile_updated')),
  content_id    uuid references public.content(id) on delete set null,
  submission_id uuid,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

-- ── indexes for common filters ──────────────────────────────
create index if not exists idx_events_user_created   on public.activity_events (user_id, created_at desc);
create index if not exists idx_events_community      on public.activity_events (community_id);
create index if not exists idx_events_type_created   on public.activity_events (event_type, created_at desc);
create index if not exists idx_events_created        on public.activity_events (created_at desc);
create index if not exists idx_events_content        on public.activity_events (content_id);
create index if not exists idx_letters_user          on public.letters (user_id, created_at desc);
create index if not exists idx_letters_status        on public.letters (status);
create index if not exists idx_letters_community     on public.letters (community_id);
create index if not exists idx_requests_user         on public.activity_requests (user_id, created_at desc);
create index if not exists idx_requests_status       on public.activity_requests (status);
create index if not exists idx_requests_community    on public.activity_requests (community_id);
create index if not exists idx_content_published     on public.content (is_published, published_at desc);
create index if not exists idx_content_type          on public.content (content_type);
create index if not exists idx_ccommunities_comm     on public.content_communities (community_id);
create index if not exists idx_vprogress_user        on public.video_progress (user_id, last_watched_at desc);
create index if not exists idx_subs_user             on public.activity_submissions (user_id, created_at desc);
create index if not exists idx_subs_activity         on public.activity_submissions (activity_id);
create index if not exists idx_profiles_community    on public.profiles (primary_community_id);
create index if not exists idx_profiles_role         on public.profiles (role);
create index if not exists idx_profiles_email_lower  on public.profiles (lower(email));
create index if not exists idx_notes_subject         on public.admin_private_notes (subject_type, subject_id);

-- ▶▶ supabase/migrations/002_portal_functions.sql
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

-- ▶▶ supabase/migrations/003_portal_rls.sql
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

-- ▶▶ supabase/migrations/004_portal_admin_rpcs.sql
-- ============================================================
-- WE ARE WITH YOU · Community Portal
-- Migration 004 — admin dashboard RPCs
-- Aggregations run in the database so the browser never has to
-- download every event to compute summary numbers.
--
-- Definitions (also documented in js/portal/portal-admin.js):
--   active user    = a user with ≥1 engagement event in the range
--   returning user = a user with events on ≥2 distinct days in the range
-- ============================================================

create or replace function public.admin_summary_metrics(
  p_from         timestamptz default null,
  p_to           timestamptz default null,
  p_community    uuid default null,
  p_account_type text default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_from timestamptz := coalesce(p_from, now() - interval '30 days');
  v_to   timestamptz := coalesce(p_to, now());
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  with ev as (
    select e.* from public.activity_events e
    left join public.profiles p on p.id = e.user_id
    where e.created_at >= v_from and e.created_at <= v_to
      and (p_community is null or e.community_id = p_community
           or p.primary_community_id = p_community)
      and (p_account_type is null or p.account_type = p_account_type)
  ),
  prof as (
    select * from public.profiles
    where (p_community is null or primary_community_id = p_community)
      and (p_account_type is null or account_type = p_account_type)
  )
  select jsonb_build_object(
    'range', jsonb_build_object('from', v_from, 'to', v_to),
    'total_accounts',  (select count(*) from prof),
    'new_accounts',    (select count(*) from prof where created_at >= v_from and created_at <= v_to),
    'disabled_accounts',(select count(*) from prof where is_disabled),
    'accounts_by_community', (
       select coalesce(jsonb_object_agg(coalesce(c.name,'No community yet'), n), '{}'::jsonb)
       from (select primary_community_id, count(*) n from prof group by 1) t
       left join public.communities c on c.id = t.primary_community_id),
    'accounts_by_type', (
       select coalesce(jsonb_object_agg(account_type, n), '{}'::jsonb)
       from (select account_type, count(*) n from prof group by 1) t),
    'active_users',    (select count(distinct user_id) from ev where user_id is not null),
    'returning_users', (
       select count(*) from (
         select user_id from ev where user_id is not null
         group by user_id having count(distinct created_at::date) >= 2) t),
    'videos_opened',    (select count(*) from ev where event_type = 'video_opened'),
    'videos_started',   (select count(*) from ev where event_type = 'video_started'),
    'videos_completed', (select count(*) from ev where event_type = 'video_completed'),
    'avg_video_completion', (
       select coalesce(round(avg(vp.completion_percentage),1), 0)
       from public.video_progress vp
       left join public.profiles p on p.id = vp.user_id
       where vp.last_watched_at >= v_from and vp.last_watched_at <= v_to
         and (p_account_type is null or p.account_type = p_account_type)
         and (p_community is null or p.primary_community_id = p_community)),
    'letters_written',   (select count(*) from ev where event_type = 'letter_submitted'),
    'letters_requested', (select count(*) from ev where event_type = 'letter_requested'),
    'video_requests',    (select count(*) from ev where event_type = 'video_requested'),
    'song_requests',     (select count(*) from ev where event_type = 'song_requested'),
    'activities_started',   (select count(*) from ev where event_type = 'activity_started'),
    'activities_completed', (select count(*) from ev where event_type = 'activity_completed'),
    'most_active_communities', (
       select coalesce(jsonb_agg(jsonb_build_object('name', c.name, 'events', t.n) order by t.n desc), '[]'::jsonb)
       from (select community_id, count(*) n from ev where community_id is not null
             group by 1 order by n desc limit 6) t
       join public.communities c on c.id = t.community_id),
    'most_viewed_content', (
       select coalesce(jsonb_agg(jsonb_build_object('title', c.title, 'views', t.n) order by t.n desc), '[]'::jsonb)
       from (select content_id, count(*) n from ev
             where event_type in ('content_opened','video_opened') and content_id is not null
             group by 1 order by n desc limit 5) t
       join public.content c on c.id = t.content_id),
    'most_completed_content', (
       select coalesce(jsonb_agg(jsonb_build_object('title', c.title, 'completions', t.n) order by t.n desc), '[]'::jsonb)
       from (select content_id, count(*) n from ev
             where event_type = 'video_completed' and content_id is not null
             group by 1 order by n desc limit 5) t
       join public.content c on c.id = t.content_id),
    'recent_submissions', (
       select coalesce(jsonb_agg(s order by s->>'created_at' desc), '[]'::jsonb) from (
         (select jsonb_build_object('kind','letter','id',l.id,'title',l.title,'status',l.status,
                 'created_at',l.created_at,'user',pr.full_name) s
            from public.letters l join public.profiles pr on pr.id = l.user_id
            where l.status <> 'draft' order by l.created_at desc limit 5)
         union all
         (select jsonb_build_object('kind','request','id',r.id,'title',r.title,'status',r.status,
                 'request_type',r.request_type,'created_at',r.created_at,'user',pr.full_name) s
            from public.activity_requests r join public.profiles pr on pr.id = r.user_id
            order by r.created_at desc limit 5)
       ) recent)
  ) into result;

  return result;
end $$;

revoke all on function public.admin_summary_metrics(timestamptz,timestamptz,uuid,text) from public, anon;
grant execute on function public.admin_summary_metrics(timestamptz,timestamptz,uuid,text) to authenticated;

-- ── filterable activity feed (drives the admin table + CSV export) ──
create or replace function public.admin_activity_feed(
  p_from         timestamptz default null,
  p_to           timestamptz default null,
  p_community    uuid default null,
  p_account_type text default null,
  p_event_type   text default null,
  p_user         uuid default null,
  p_limit        integer default 100,
  p_offset       integer default 0)
returns table (
  id bigint, created_at timestamptz, event_type text,
  user_id uuid, user_name text, user_email text, account_type text,
  community_name text, content_title text, submission_id uuid, metadata jsonb)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;
  return query
    select e.id, e.created_at, e.event_type,
           e.user_id, p.full_name, p.email, p.account_type,
           c.name, ct.title, e.submission_id, e.metadata
    from public.activity_events e
    left join public.profiles p on p.id = e.user_id
    left join public.communities c on c.id = e.community_id
    left join public.content ct on ct.id = e.content_id
    where (p_from is null or e.created_at >= p_from)
      and (p_to   is null or e.created_at <= p_to)
      and (p_community is null or e.community_id = p_community or p.primary_community_id = p_community)
      and (p_account_type is null or p.account_type = p_account_type)
      and (p_event_type is null or e.event_type = p_event_type)
      and (p_user is null or e.user_id = p_user)
    order by e.created_at desc
    limit least(greatest(coalesce(p_limit,100),1),1000)
    offset greatest(coalesce(p_offset,0),0);
end $$;

revoke all on function public.admin_activity_feed(timestamptz,timestamptz,uuid,text,text,uuid,integer,integer) from public, anon;
grant execute on function public.admin_activity_feed(timestamptz,timestamptz,uuid,text,text,uuid,integer,integer) to authenticated;

-- ▶▶ supabase/migrations/005_portal_seed.sql
-- ============================================================
-- WE ARE WITH YOU · Community Portal
-- Migration 005 — seed data
-- Idempotent: existing rows are left alone (on conflict do nothing).
-- ============================================================

-- ── the five communities (stable slugs — these are load-bearing) ──
insert into public.communities (name, slug, description, image_url, display_order) values
  ('City of Hope Atlanta', 'city-of-hope',
   'Music, messages, stories, and encouragement for patients, families, caregivers, survivors, and healthcare staff at City of Hope Atlanta (formerly CTCA).',
   'assets/logos/city-of-hope-atlanta.png', 1),
  ('RMH (Ronald McDonald House in Atlanta)', 'ronald-mcdonald-house',
   'Hope and meaningful moments for families staying close to hospitalized children — letters, cheerful music, and simple activities to share together.',
   'assets/logos/ronald-mcdonald-house.png', 2),
  ('Senior Living', 'senior-living',
   'Familiar songs, memories, stories, and intergenerational connection for residents, families, staff, and volunteers in senior communities.',
   'assets/logos/senior-living.png', 3),
  ('Schools & Global', 'schools-global',
   'Learning, music, stories, and encouragement for students, teachers, and partner schools — locally and around the world.',
   'assets/logos/schools-global.png', 4),
  ('Wheat Mission Atlanta (Milal)', 'milal',
   'Inclusive music, participation, and encouragement with Wheat Mission Atlanta (Milal), serving people with disabilities and their families.',
   'assets/logos/milal.png', 5)
on conflict (slug) do nothing;

-- ── admin allow-list ────────────────────────────────────────
-- Accounts that sign up with these emails become administrators.
-- (Managed by GYCO — add/remove rows in the Supabase dashboard.)
insert into public.portal_admin_emails (email, note) values
  ('jakaus2029@gmail.com', 'Aaron — maintainer'),
  ('gyco23@gmail.com',     'GYCO official account')
on conflict (email) do nothing;

-- ── starter activities (visible in every community) ─────────
insert into public.activity_definitions (name, slug, description, activity_type, instructions, configuration) values
  ('Simple Rhythm Activity', 'simple-rhythm',
   'Clap and tap along with a simple rhythm pattern you can do anywhere — no instruments needed.',
   'rhythm_activity',
   'Find a comfortable position. Tap the steady beat on your knee, then try the pattern: two slow taps, three quick taps. Repeat it slowly, then a little faster. Invite someone nearby to join you.',
   '{"steps":["Tap a steady beat on your knee","Try: two slow taps, three quick taps","Repeat slowly, then a little faster","Invite someone to join you"],"reflection":"How did the rhythm feel today?"}'),
  ('One-Minute Breathing', 'one-minute-breathing',
   'A calm, one-minute breathing exercise paired with quiet imagination of a favorite song.',
   'breathing_activity',
   'Sit comfortably. Breathe in slowly for four counts, hold for four, and breathe out for four. Repeat four times. As you breathe, imagine a song that brings you peace.',
   '{"steps":["Breathe in for 4 counts","Hold for 4 counts","Breathe out for 4 counts","Repeat 4 times, imagining a peaceful song"],"reflection":"What song came to mind while you breathed?"}'),
  ('Share a Musical Memory', 'musical-memory',
   'Think of a song that matters to you and write a few sentences about the memory it carries.',
   'reflection_activity',
   'Choose a song connected to a person, a place, or a moment in your life. Write two or three sentences about why it stays with you. You can keep it private or share it with your community.',
   '{"fields":[{"key":"song","label":"The song","type":"text"},{"key":"memory","label":"Your memory","type":"textarea"}],"reflection":"Every memory has value. Every story deserves to be heard."}')
on conflict (slug) do nothing;

-- attach every starter activity to all communities
insert into public.activity_communities (activity_id, community_id)
select a.id, c.id
from public.activity_definitions a
cross join public.communities c
where a.slug in ('simple-rhythm','one-minute-breathing','musical-memory')
on conflict do nothing;

-- ── a first piece of published content so the portal home is never
--    empty on day one (safe to edit or unpublish in the admin dashboard) ──
with new_content as (
  insert into public.content (title, description, content_type, body, is_published, is_public, is_featured, published_at)
  select
    'Welcome to the WE ARE WITH YOU Community Portal',
    'A new home for messages, music, videos, and activities — created for you.',
    'community_update',
    'Even Here, Even Now, WE ARE WITH YOU.' || chr(10) || chr(10) ||
    'This portal was created by GYCO students so that patients, families, students, seniors, and community members always have a place to receive encouragement — and to share it. Watch videos, read letters, request a song, or try a simple activity. Everything here was made for the person visiting right now: you.',
    true, true, true, now()
  where not exists (select 1 from public.content where title = 'Welcome to the WE ARE WITH YOU Community Portal')
  returning id
)
insert into public.content_communities (content_id, community_id)
select nc.id, c.id from new_content nc cross join public.communities c
on conflict do nothing;

-- ▶▶ supabase/migrations/006_portal_hub_events.sql
-- ============================================================
-- WE ARE WITH YOU · Community Portal
-- Migration 006 — portal hub engagement event types
-- Adds two event types for the five-option portal landing page:
--   · portal_home_viewed     — the member opened the portal hub
--   · portal_option_selected — the member chose one of the five
--     options (metadata.option = with_you | melody_box |
--     wish_pocket | bloom_bank | hope_capsule)
-- No new tables, columns, policies, or triggers — the existing
-- activity_events table, RLS policies, and events_guard trigger
-- already cover these rows. Idempotent: safe to re-run.
-- ============================================================

alter table public.activity_events
  drop constraint if exists activity_events_event_type_check;

alter table public.activity_events
  add constraint activity_events_event_type_check check (event_type in
    ('account_created','logged_in','logged_out','community_selected','primary_community_changed',
     'community_page_visited','content_opened','video_opened','video_started',
     'video_progress_25','video_progress_50','video_progress_75','video_completed',
     'letter_opened','letter_draft_created','letter_written','letter_submitted',
     'letter_requested','video_requested','song_requested',
     'activity_started','activity_completed','event_registration_submitted',
     'feedback_submitted','profile_updated',
     'portal_home_viewed','portal_option_selected'));
