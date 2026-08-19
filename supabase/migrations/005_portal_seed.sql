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
