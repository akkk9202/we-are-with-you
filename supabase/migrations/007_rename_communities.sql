-- ============================================================
-- 007 · Rename displayed community names (Aug 2026, per Aaron)
--   · Ronald McDonald House  →  RMH (Ronald McDonald House in Atlanta)
--   · Milal                  →  Wheat Mission Atlanta (Milal)
-- Slugs are load-bearing (QR codes, URLs) and DO NOT change.
-- Run once in the Supabase SQL editor. Safe to re-run (idempotent).
-- New installs already get these names from 005_portal_seed.sql / setup.sql.
-- ============================================================

update public.communities
   set name = 'RMH (Ronald McDonald House in Atlanta)'
 where slug = 'ronald-mcdonald-house';

update public.communities
   set name        = 'Wheat Mission Atlanta (Milal)',
       description = 'Inclusive music, participation, and encouragement with Wheat Mission Atlanta (Milal), serving people with disabilities and their families.'
 where slug = 'milal';
