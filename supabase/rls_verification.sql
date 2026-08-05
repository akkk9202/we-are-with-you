-- ============================================================
-- WE ARE WITH YOU · Community Portal
-- RLS + trigger behavior verification.
-- Runs as ONE transaction and ROLLS BACK — it never leaves data
-- behind. Requires a database with the 6 migrations applied and a
-- Supabase-like environment (auth schema + anon/authenticated roles).
-- Every check RAISEs NOTICE 'PASS …' or 'FAIL …' and the script
-- errors at the end if anything failed.
-- ============================================================

begin;

-- mimic Supabase's default API grants (Supabase itself does this in prod)
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

create temp table _results (label text, pass boolean);
grant all on _results to public;

create function pg_temp.chk(cond boolean, label text) returns void
language plpgsql as $$
begin
  insert into _results values (label, coalesce(cond, false));
  if coalesce(cond, false) then raise notice 'PASS %', label;
  else raise notice 'FAIL %', label;
  end if;
end $$;

create function pg_temp.as_user(uid uuid) returns void
language plpgsql as $$
begin
  execute 'set local role authenticated';
  perform set_config('request.jwt.claim.sub', uid::text, true);
end $$;

create function pg_temp.as_anon() returns void
language plpgsql as $$
begin
  execute 'set local role anon';
  perform set_config('request.jwt.claim.sub', '', true);
end $$;

create function pg_temp.as_service() returns void
language plpgsql as $$
begin
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '', true);
end $$;

do $$
declare
  u_member uuid; u_other uuid; u_admin uuid;
  c_rmh uuid; c_hope uuid;
  content_hidden uuid; content_member uuid;
  letter_id uuid; other_letter uuid; req_id uuid;
  n int; t text; ev int; m jsonb;
begin
  select id into c_rmh  from communities where slug = 'ronald-mcdonald-house';
  select id into c_hope from communities where slug = 'city-of-hope';
  perform pg_temp.chk(c_rmh is not null and c_hope is not null, 'seed: communities present with stable slugs');
  perform pg_temp.chk((select count(*) from communities where is_active) = 6, 'seed: exactly 6 active communities');

  ------------------------------------------------------------
  -- sign-up trigger
  ------------------------------------------------------------
  insert into auth.users (email, raw_user_meta_data) values
    ('member@test.org', jsonb_build_object('full_name','Mia Member','account_type','family_member',
       'primary_community_id', c_rmh::text, 'email_consent', true)) returning id into u_member;
  insert into auth.users (email, raw_user_meta_data) values
    ('other@test.org', jsonb_build_object('full_name','Ollie Other','account_type','participant',
       'primary_community_id', c_hope::text)) returning id into u_other;
  insert into auth.users (email, raw_user_meta_data) values
    ('jakaus2029@gmail.com', jsonb_build_object('full_name','Aaron Admin','account_type','staff_member',
       'primary_community_id', c_rmh::text, 'role','admin'))  -- metadata role must be IGNORED
    returning id into u_admin;

  select count(*) into n from profiles where id in (u_member, u_other, u_admin);
  perform pg_temp.chk(n = 3, 'sign-up trigger creates a profile for every new auth user');
  perform pg_temp.chk((select role from profiles where id = u_member) = 'user',
    'normal sign-up gets role=user even if metadata claims otherwise');
  perform pg_temp.chk((select role from profiles where id = u_admin) = 'admin',
    'allow-listed email becomes admin at sign-up');
  perform pg_temp.chk((select account_type from profiles where id = u_member) = 'family_member',
    'account type stored from sign-up metadata');
  perform pg_temp.chk((select primary_community_id from profiles where id = u_member) = c_rmh,
    'primary community stored');
  select count(*) into n from activity_events where user_id = u_member and event_type = 'account_created';
  perform pg_temp.chk(n = 1, 'account_created event recorded once');

  ------------------------------------------------------------
  -- content visibility: member / anon
  ------------------------------------------------------------
  perform pg_temp.as_service();
  insert into content (title, content_type, is_published, is_public) values
    ('Members only story', 'community_story', true, false) returning id into content_member;
  insert into content (title, content_type, is_published, is_public) values
    ('Unpublished draft', 'community_story', false, false) returning id into content_hidden;

  perform pg_temp.as_user(u_member);
  select count(*) into n from content where id = content_member;
  perform pg_temp.chk(n = 1, 'member can read published member content');
  select count(*) into n from content where id = content_hidden;
  perform pg_temp.chk(n = 0, 'member cannot read unpublished drafts');

  perform pg_temp.as_anon();
  select count(*) into n from content where id = content_member;
  perform pg_temp.chk(n = 0, 'anon cannot read members-only content');
  select count(*) into n from content where is_published and is_public;
  perform pg_temp.chk(n >= 1, 'anon CAN read published+public content');
  select count(*) into n from communities;
  perform pg_temp.chk(n = 6, 'anon can list active communities (needed for sign-up)');
  select count(*) into n from profiles;
  perform pg_temp.chk(n = 0, 'anon cannot read any profile');
  select count(*) into n from activity_events;
  perform pg_temp.chk(n = 0, 'anon cannot read any engagement events');

  ------------------------------------------------------------
  -- profiles: own-row only, protected columns
  ------------------------------------------------------------
  perform pg_temp.as_user(u_member);
  select count(*) into n from profiles;
  perform pg_temp.chk(n = 1, 'member sees exactly one profile row (their own)');
  update profiles set full_name = 'Mia M.', role = 'admin', is_disabled = true where id = u_member;
  perform pg_temp.chk((select role from profiles where id = u_member) = 'user',
    'member CANNOT self-promote to admin (column protected)');
  perform pg_temp.chk((select is_disabled from profiles where id = u_member) = false,
    'member cannot disable/enable themselves');
  perform pg_temp.chk((select full_name from profiles where id = u_member) = 'Mia M.',
    'member CAN edit their own name');
  update profiles set full_name = 'Hacked' where id = u_other;
  perform pg_temp.as_service();
  perform pg_temp.chk((select full_name from profiles where id = u_other) = 'Ollie Other',
    'member cannot edit another profile');

  perform pg_temp.as_user(u_member);
  update profiles set primary_community_id = c_hope where id = u_member;
  perform pg_temp.as_service();
  select count(*) into n from activity_events where user_id = u_member and event_type = 'primary_community_changed';
  perform pg_temp.chk(n = 1, 'changing primary community creates an engagement event');
  update profiles set primary_community_id = c_rmh where id = u_member;

  ------------------------------------------------------------
  -- letters
  ------------------------------------------------------------
  perform pg_temp.as_user(u_member);
  insert into letters (user_id, community_id, recipient_type, title, body, status)
    values (u_member, c_rmh, 'parent', 'For a tired parent', 'You are stronger than today feels.', 'draft')
    returning id into letter_id;
  perform pg_temp.chk(letter_id is not null, 'member can create a letter draft');
  insert into letters (user_id, community_id, recipient_type, title, body, status, is_public, public_display_permission)
    values (u_member, c_rmh, 'child', 'Sneaky', 'x', 'approved', true, true) returning id into other_letter;
  perform pg_temp.chk((select status from letters where id = other_letter) = 'draft'
    and (select is_public from letters where id = other_letter) = false,
    'client-chosen approved/is_public on insert is forced back to a private draft');
  delete from letters where id = other_letter;

  update letters set body = 'You are stronger than today feels. We are with you.' where id = letter_id;
  perform pg_temp.chk((select body from letters where id = letter_id) like '%We are with you.%',
    'member can edit their own draft');
  update letters set status = 'submitted' where id = letter_id;
  perform pg_temp.chk((select status from letters where id = letter_id) = 'submitted',
    'member can submit a draft for review');
  update letters set status = 'approved' where id = letter_id;
  perform pg_temp.chk((select status from letters where id = letter_id) = 'submitted',
    'member CANNOT approve their own letter');

  perform pg_temp.as_service();
  select count(*) into n from activity_events where user_id = u_member and event_type = 'letter_submitted';
  perform pg_temp.chk(n = 1, 'letter_submitted event recorded once');

  perform pg_temp.as_user(u_other);
  select count(*) into n from letters where id = letter_id;
  perform pg_temp.chk(n = 0, 'another member cannot see the letter');

  perform pg_temp.as_user(u_admin);
  select count(*) into n from letters where id = letter_id;
  perform pg_temp.chk(n = 1, 'admin can see submitted letters');
  begin
    update letters set status = 'rejected' where id = letter_id;
    perform pg_temp.chk(false, 'rejecting without a reason is refused');
  exception when others then
    perform pg_temp.chk(true, 'rejecting without a reason is refused');
  end;
  update letters set status = 'approved', public_notes = 'Beautiful letter - thank you.' where id = letter_id;
  perform pg_temp.chk((select status from letters where id = letter_id) = 'approved', 'admin can approve a letter');
  begin
    update letters set is_public = true where id = letter_id;  -- author gave NO public permission
    perform pg_temp.chk((select is_public from letters where id = letter_id) = false,
      'letter without public permission cannot be made public');
  exception when check_violation then
    perform pg_temp.chk(true, 'letter without public permission cannot be made public');
  end;
  insert into admin_private_notes (subject_type, subject_id, note) values ('letter', letter_id, 'internal note');

  perform pg_temp.as_user(u_member);
  perform pg_temp.chk((select public_notes from letters where id = letter_id) = 'Beautiful letter - thank you.',
    'author sees the PUBLIC note');
  select count(*) into n from admin_private_notes;
  perform pg_temp.chk(n = 0, 'author can NEVER read private admin notes');

  ------------------------------------------------------------
  -- requests
  ------------------------------------------------------------
  perform pg_temp.as_user(u_member);
  insert into activity_requests (user_id, community_id, request_type, title, details, status, public_notes)
    values (u_member, c_rmh, 'song', 'Moon River', 'It reminds me of home.', 'completed', 'sneaky note')
    returning id into req_id;
  perform pg_temp.chk((select status from activity_requests where id = req_id) = 'submitted',
    'request status is forced to submitted on insert');
  perform pg_temp.chk((select public_notes from activity_requests where id = req_id) is null,
    'client cannot pre-fill admin notes');
  update activity_requests set status = 'completed' where id = req_id;
  perform pg_temp.chk((select status from activity_requests where id = req_id) = 'submitted',
    'member cannot change request status');
  perform pg_temp.as_service();
  select count(*) into n from activity_events where user_id = u_member and event_type = 'song_requested';
  perform pg_temp.chk(n = 1, 'song_requested event recorded');
  perform pg_temp.as_user(u_other);
  select count(*) into n from activity_requests where id = req_id;
  perform pg_temp.chk(n = 0, 'requests are private to the requester (and admins)');
  perform pg_temp.as_user(u_admin);
  update activity_requests set status = 'in_progress', public_notes = 'Students are rehearsing it!' where id = req_id;
  perform pg_temp.chk((select status from activity_requests where id = req_id) = 'in_progress',
    'admin can move a request along');

  ------------------------------------------------------------
  -- video progress: milestones fire once, completion needs >=90%
  ------------------------------------------------------------
  perform pg_temp.as_user(u_member);
  insert into video_progress (user_id, content_id, progress_seconds, total_seconds)
    values (u_member, content_member, 30, 300);
  perform pg_temp.chk((select completion_percentage::int from video_progress
    where user_id = u_member and content_id = content_member) = 10,
    'percentage computed server-side (10%)');
  perform pg_temp.chk((select completed from video_progress
    where user_id = u_member and content_id = content_member) = false,
    'opening/starting a video does NOT complete it');
  update video_progress set progress_seconds = 160, total_seconds = 300
    where user_id = u_member and content_id = content_member;
  perform pg_temp.as_service();
  select count(*) into ev from activity_events where user_id = u_member and event_type = 'video_progress_25';
  perform pg_temp.chk(ev = 1, '25% milestone event fired');
  select count(*) into ev from activity_events where user_id = u_member and event_type = 'video_progress_50';
  perform pg_temp.chk(ev = 1, '50% milestone event fired');
  perform pg_temp.as_user(u_member);
  update video_progress set progress_seconds = 140, total_seconds = 300
    where user_id = u_member and content_id = content_member;  -- scrub backwards
  perform pg_temp.as_service();
  select count(*) into ev from activity_events where user_id = u_member and event_type = 'video_progress_50';
  perform pg_temp.chk(ev = 1, 'scrubbing back/forward does NOT re-fire milestones');
  perform pg_temp.chk((select reached_50 from video_progress
    where user_id = u_member and content_id = content_member) = true, 'milestone flags are monotonic');
  perform pg_temp.as_user(u_member);
  update video_progress set progress_seconds = 280, total_seconds = 300
    where user_id = u_member and content_id = content_member;
  perform pg_temp.chk((select completed from video_progress
    where user_id = u_member and content_id = content_member) = true, 'completion at >=90% watched');
  perform pg_temp.as_service();
  select count(*) into ev from activity_events where user_id = u_member and event_type = 'video_completed';
  perform pg_temp.chk(ev = 1, 'video_completed event fired exactly once');
  perform pg_temp.as_user(u_member);
  update video_progress set progress_seconds = 300, total_seconds = 300
    where user_id = u_member and content_id = content_member;
  perform pg_temp.as_service();
  select count(*) into ev from activity_events where user_id = u_member and event_type = 'video_completed';
  perform pg_temp.chk(ev = 1, 'watching to the very end does not double-fire completion');
  perform pg_temp.as_user(u_other);
  select count(*) into n from video_progress where user_id = u_member;
  perform pg_temp.chk(n = 0, 'video progress is private per member');

  ------------------------------------------------------------
  -- events: identity is forced
  ------------------------------------------------------------
  perform pg_temp.as_user(u_other);
  insert into activity_events (user_id, event_type) values (u_member, 'logged_in');
  perform pg_temp.as_service();
  select count(*) into n from activity_events where user_id = u_other and event_type = 'logged_in';
  perform pg_temp.chk(n = 1, 'an event inserted as someone else is stamped with the real author');
  select count(*) into n from activity_events where user_id = u_member and event_type = 'logged_in';
  perform pg_temp.chk(n = 0, 'no forged login event landed on the victim');

  ------------------------------------------------------------
  -- events: portal hub event types (migration 006)
  ------------------------------------------------------------
  perform pg_temp.as_user(u_member);
  insert into activity_events (user_id, event_type, community_id, metadata)
    values (u_member, 'portal_home_viewed', c_rmh, '{}'::jsonb);
  insert into activity_events (user_id, event_type, metadata)
    values (u_member, 'portal_option_selected', jsonb_build_object('option', 'melody_box'));
  perform pg_temp.as_service();
  select count(*) into n from activity_events
    where user_id = u_member and event_type = 'portal_home_viewed' and community_id = c_rmh;
  perform pg_temp.chk(n = 1, 'portal_home_viewed event type accepted (migration 006)');
  select count(*) into n from activity_events
    where user_id = u_member and event_type = 'portal_option_selected'
      and metadata->>'option' = 'melody_box';
  perform pg_temp.chk(n = 1, 'portal_option_selected event carries the chosen option');
  begin
    insert into activity_events (user_id, event_type) values (u_member, 'not_a_real_event');
    perform pg_temp.chk(false, 'unknown event types are still rejected');
  exception when check_violation then
    perform pg_temp.chk(true, 'unknown event types are still rejected');
  end;

  ------------------------------------------------------------
  -- admin RPCs + disabled accounts
  ------------------------------------------------------------
  perform pg_temp.as_user(u_member);
  begin
    m := admin_summary_metrics();
    perform pg_temp.chk(false, 'summary metrics RPC refuses normal users');
  exception when others then
    perform pg_temp.chk(true, 'summary metrics RPC refuses normal users');
  end;
  perform pg_temp.as_user(u_admin);
  begin
    m := admin_summary_metrics();
    perform pg_temp.chk((m->>'total_accounts')::int >= 3, 'admin metrics RPC returns account totals');
  exception when others then
    perform pg_temp.chk(false, 'admin metrics RPC returns account totals');
  end;
  update profiles set is_disabled = true where id = u_other;
  perform pg_temp.chk((select is_disabled from profiles where id = u_other) = true,
    'admin can disable an account');
  perform pg_temp.as_user(u_other);
  select count(*) into n from content where id = content_member;
  perform pg_temp.chk(n = 0, 'a disabled account can no longer read member content');
  begin
    insert into letters (user_id, community_id, recipient_type, title, body)
      values (u_other, c_rmh, 'child', 'nope', 'nope');
    perform pg_temp.chk(false, 'a disabled account cannot submit letters');
  exception when others then
    perform pg_temp.chk(true, 'a disabled account cannot submit letters');
  end;
  perform pg_temp.as_user(u_admin);
  update profiles set is_disabled = false where id = u_other;
  perform pg_temp.chk((select is_disabled from profiles where id = u_other) = false,
    'admin can re-enable an account');

  ------------------------------------------------------------
  -- account deletion cascades personal data
  ------------------------------------------------------------
  perform pg_temp.as_user(u_member);
  perform delete_own_account();
  perform pg_temp.as_service();
  select count(*) into n from profiles where id = u_member;
  perform pg_temp.chk(n = 0, 'delete_own_account removes the profile');
  select count(*) into n from letters where user_id = u_member;
  perform pg_temp.chk(n = 0, 'deletion removes the member''s letters');
  select count(*) into n from activity_events where user_id = u_member;
  perform pg_temp.chk(n = 0, 'deletion removes the member''s engagement events');
  select count(*) into n from video_progress where user_id = u_member;
  perform pg_temp.chk(n = 0, 'deletion removes the member''s video progress');
  select count(*) into n from auth.users where id = u_member;
  perform pg_temp.chk(n = 0, 'deletion removes the auth user itself');
end $$;

do $$
declare p int; f int;
begin
  select count(*) filter (where pass), count(*) filter (where not pass) into p, f from _results;
  raise notice '=== RLS VERIFICATION: % passed, % failed ===', p, f;
  if f > 0 then
    raise exception 'RLS verification failed: % check(s)', f;
  end if;
end $$;

rollback;
