-- ============================================================
-- 008 · Remove the Northside NICU community (Aug 19 2026, per Aaron —
--        no active partnership).
-- Run once in the Supabase SQL editor. Safe to re-run (idempotent).
--
-- Deleting the row is safe by schema design:
--   · content_communities / activity_communities rows CASCADE away
--   · profiles.primary_community_id, letters, requests, submissions,
--     and activity_events references become NULL (history is kept,
--     nothing breaks — any such member simply picks a new community
--     in Profile).
-- New installs no longer seed NICU (005_portal_seed.sql / setup.sql).
-- The removed seed row is saved in context/excluded/ — see RESTORE.md.
-- ============================================================

delete from public.communities where slug = 'northside-nicu';

-- close the display_order gap left behind (1..5)
update public.communities set display_order = 3 where slug = 'senior-living'   and display_order <> 3;
update public.communities set display_order = 4 where slug = 'schools-global'  and display_order <> 4;
update public.communities set display_order = 5 where slug = 'milal'           and display_order <> 5;
