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
