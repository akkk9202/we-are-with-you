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
