/* Live health check for the Community Portal's Supabase project.
   Run AFTER supabase/PORTAL-SETUP.md steps 1–2, from any machine with
   internet access:  node test/portal-live-check.js
   Uses ONLY the public publishable key (read from js/portal/portal-config.js),
   so it can verify what an anonymous visitor can and cannot see. */
const fs = require('fs');
const path = require('path');

const cfgSrc = fs.readFileSync(path.join(__dirname, '..', 'js', 'portal', 'portal-config.js'), 'utf8');
const URL_ = cfgSrc.match(/supabaseUrl:\s*"([^"]+)"/)[1];
const KEY = cfgSrc.match(/supabaseKey:\s*"([^"]+)"/)[1];

let passed = 0, failed = 0;
const ok = (cond, msg) => {
  if (cond) { passed++; console.log('  ✓', msg); }
  else { failed++; console.log('  ✗ FAIL:', msg); }
};

const rest = async (p, opts = {}) => {
  const res = await fetch(URL_ + '/rest/v1/' + p, {
    ...opts,
    headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  let body = null;
  try { body = await res.json(); } catch { /* empty */ }
  return { status: res.status, body };
};

(async () => {
  console.log('Checking', URL_, 'as an anonymous visitor…\n');

  const comms = await rest('communities?select=slug,name,is_active&order=display_order');
  ok(comms.status === 200 && Array.isArray(comms.body), 'REST API reachable with the publishable key');
  const slugs = (comms.body || []).map((c) => c.slug);
  ok(slugs.length === 6, `six communities seeded (found ${slugs.length})`);
  ok(['city-of-hope', 'ronald-mcdonald-house', 'northside-nicu', 'senior-living', 'schools-global', 'milal']
      .every((s) => slugs.includes(s)), 'community slugs match the portal routes');

  const profiles = await rest('profiles?select=id');
  ok(profiles.status === 200 && Array.isArray(profiles.body) && profiles.body.length === 0,
     'anonymous visitors can read ZERO profiles (RLS)');

  const events = await rest('activity_events?select=id&limit=5');
  ok(Array.isArray(events.body) && events.body.length === 0, 'anonymous visitors can read ZERO engagement events (RLS)');

  const letters = await rest('letters?select=id&limit=5');
  ok(Array.isArray(letters.body) && letters.body.length === 0 || (letters.body || []).length === 0,
     'anonymous visitors can read no private letters (RLS)');

  const notes = await rest('admin_private_notes?select=id&limit=1');
  ok(Array.isArray(notes.body) && notes.body.length === 0, 'admin private notes are invisible (RLS)');

  const secret = await rest('content?select=id,title&is_published=eq.false');
  ok(Array.isArray(secret.body) && secret.body.length === 0, 'unpublished content is invisible (RLS)');

  const pub = await rest('content?select=id,title,is_public,is_published&is_public=eq.true&is_published=eq.true');
  ok(Array.isArray(pub.body), `published+public content is readable (${(pub.body || []).length} item(s)) — expected for the portal intro page`);

  const forge = await rest('activity_events', {
    method: 'POST', body: JSON.stringify({ user_id: '00000000-0000-4000-8000-000000000000', event_type: 'logged_in' }),
  });
  ok(forge.status >= 400, 'anonymous visitors cannot insert events');

  // Prefer: return=representation makes PostgREST return the rows it
  // actually modified — with RLS in force that list must be empty.
  const promote = await rest('profiles?id=eq.00000000-0000-4000-8000-000000000000', {
    method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ role: 'admin' }),
  });
  ok(promote.status >= 400 || (Array.isArray(promote.body) && promote.body.length === 0),
     'anonymous visitors cannot modify profiles (0 rows affected)');

  const rpc = await fetch(URL_ + '/rest/v1/rpc/admin_summary_metrics', {
    method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: '{}',
  });
  ok(rpc.status >= 400, 'admin metrics RPC refuses anonymous callers');

  const health = await fetch(URL_ + '/auth/v1/health', { headers: { apikey: KEY } });
  ok(health.status === 200, 'Auth service healthy');

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('Could not reach the project:', e.message); process.exit(1); });
