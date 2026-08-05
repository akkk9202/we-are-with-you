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
