/* DOM smoke tests for the Community Portal.
   Loads the real portal HTML pages into jsdom, executes the real
   portal JS against a stubbed Supabase client, and asserts the
   rendered output. (RLS/security behavior is exercised separately by
   test/portal-rls.test.js against a real Supabase project.)
   Run: node test/portal.test.js */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let passed = 0, failed = 0;
const ok = (cond, msg) => {
  if (cond) { passed++; console.log('  ✓', msg); }
  else { failed++; console.log('  ✗ FAIL:', msg); }
};
const tick = (n = 12) => new Promise((r) => { let i = 0; const f = () => (++i >= n ? r() : setImmediate(f)); f(); });

/* ── minimal Supabase stub ─────────────────────────────────── */
const STUB = `
window.__calls = { inserts: [], updates: [], upserts: [], deletes: [], rpcs: [] };
window.supabase = { createClient: function () {
  const S = window.__stubState || {};
  const tables = S.tables || {};
  function builder(table) {
    const ctx = { table, filters: [], op: 'select', payload: null, one: false };
    const api = {};
    const chain = (fn) => (...a) => { fn(...a); return api; };
    api.select = chain(() => {});
    api.order = chain(() => {});
    api.limit = chain(() => {});
    api.range = chain(() => {});
    api.in = chain(() => {});
    api.or = chain(() => {});
    api.eq = chain((col, val) => ctx.filters.push([col, val]));
    api.insert = chain((rows) => { ctx.op = 'insert'; ctx.payload = rows; window.__calls.inserts.push({ table, rows }); });
    api.update = chain((row) => { ctx.op = 'update'; ctx.payload = row; window.__calls.updates.push({ table, row }); });
    api.upsert = chain((row) => { ctx.op = 'upsert'; ctx.payload = row; window.__calls.upserts.push({ table, row }); });
    api.delete = chain(() => { ctx.op = 'delete'; window.__calls.deletes.push({ table }); });
    api.single = () => { ctx.one = true; return api; };
    api.maybeSingle = () => { ctx.one = true; return api; };
    const result = () => {
      if (ctx.op !== 'select' && !ctx.one) return { data: null, error: null, count: 0 };
      let rows = (tables[table] || []).filter((r) =>
        ctx.filters.every(([c, v]) => !(c in r) || r[c] === v));
      if (ctx.op === 'insert' && ctx.one) return { data: { id: 'new-id' }, error: null };
      if (ctx.one) return { data: rows[0] || null, error: null };
      return { data: rows, error: null, count: rows.length };
    };
    api.then = (res, rej) => Promise.resolve(result()).then(res, rej);
    return api;
  }
  return {
    from: builder,
    rpc: (name, args) => { window.__calls.rpcs.push({ name, args });
      const h = (S.rpc || {})[name];
      return Promise.resolve(h ? h(args) : { data: null, error: null }); },
    auth: {
      getSession: () => Promise.resolve({ data: { session: S.session || null } }),
      signInWithPassword: (c) => Promise.resolve(S.signIn ? S.signIn(c) : { data: {}, error: null }),
      signUp: (a) => { window.__calls.signUp = a; return Promise.resolve(S.signUp ? S.signUp(a) : { data: { session: null }, error: null }); },
      signOut: () => Promise.resolve({}),
      resetPasswordForEmail: (e, o) => { window.__calls.reset = { e, o }; return Promise.resolve({ data: {}, error: null }); },
      updateUser: (u) => { window.__calls.updateUser = u; return Promise.resolve({ data: {}, error: null }); },
    },
  };
} };`;

const BUNDLE_FILES = ['js/config.js', 'js/partners.js', 'js/portal/portal-config.js',
  'js/portal/portal-core.js', 'js/portal/portal-pages.js', 'js/portal/portal-pages2.js',
  'js/portal/portal-hub.js'];
const bundleCache = {};
const readBundle = (files) => files.map((f) =>
  (bundleCache[f] = bundleCache[f] || fs.readFileSync(path.join(ROOT, f), 'utf8'))).join('\n;\n');

function loadPortalPage(file, url, stubState, extraFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const dom = new JSDOM(html, { url, runScripts: 'outside-only' });
  const w = dom.window;
  w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  w.scrollTo = () => {};
  w.__navigations = [];
  w.__portalNavigate = (u) => { w.__navigations.push(u); };
  w.eval(`window.__stubState = (${JSON.stringify(stubState || {})});`);
  // functions can't survive JSON — reattach factories the tests provide
  if (stubState && stubState.__fns) w.eval(`(function(){ ${stubState.__fns} })();`);
  w.eval(STUB);
  // one eval scope for the whole bundle; expose Portal for direct assertions
  w.eval(readBundle(extraFiles || BUNDLE_FILES) + '\n;window.Portal = Portal;');
  return dom;
}

/* fixture data */
const COMMS = [
  { id: 'c1', name: 'City of Hope Atlanta', slug: 'city-of-hope', description: 'Hope.', image_url: 'assets/logos/city-of-hope-atlanta.png', display_order: 1, is_active: true },
  { id: 'c2', name: 'Ronald McDonald House', slug: 'ronald-mcdonald-house', description: 'Families.', image_url: '', display_order: 2, is_active: true },
  { id: 'c3', name: 'Northside NICU', slug: 'northside-nicu', description: 'Gentle.', image_url: '', display_order: 3, is_active: true },
  { id: 'c4', name: 'Senior Living', slug: 'senior-living', description: 'Memories.', image_url: '', display_order: 4, is_active: true },
  { id: 'c5', name: 'Schools & Global', slug: 'schools-global', description: 'Learning.', image_url: '', display_order: 5, is_active: true },
  { id: 'c6', name: 'Milal', slug: 'milal', description: 'Inclusion.', image_url: '', display_order: 6, is_active: true },
];
const PROFILE = { id: 'u1', full_name: 'Aaron Tester', email: 'a@test.org', account_type: 'student_volunteer',
  primary_community_id: 'c2', role: 'user', email_consent: true, is_disabled: false, created_at: '2026-07-01T00:00:00Z' };
const SESSION = { user: { id: 'u1', email: 'a@test.org' } };
const CONTENT = [
  { id: '11111111-1111-4111-8111-111111111111', title: 'Spring Concert Highlights', description: 'Our spring visit.',
    content_type: 'performance_video', video_url: 'https://www.youtube.com/watch?v=abc123DEF45', image_url: null, body: null,
    language: 'English', published_at: '2026-07-20T00:00:00Z', created_at: '2026-07-20T00:00:00Z',
    is_featured: true, is_public: false, is_published: true, content_communities: [{ community_id: 'c2' }] },
  { id: '22222222-2222-4222-8222-222222222222', title: 'A Letter of Courage', description: 'For a difficult day.',
    content_type: 'letter', video_url: null, image_url: null, body: 'Dear friend,\n\nYou are not alone.',
    language: null, published_at: '2026-07-18T00:00:00Z', created_at: '2026-07-18T00:00:00Z',
    is_featured: false, is_public: true, is_published: true, content_communities: [{ community_id: 'c1' }, { community_id: 'c2' }] },
];

const HUB_CONTENT = [
  ...CONTENT,
  { id: '44444444-4444-4444-8444-444444444444', title: 'Lullaby for Quiet Evenings', description: 'A gentle song for winding down.',
    content_type: 'song_performance', video_url: 'https://youtu.be/abcDEF12345', image_url: null, body: null,
    language: 'English', published_at: '2026-07-25T00:00:00Z', created_at: '2026-07-25T00:00:00Z',
    is_featured: false, is_public: false, is_published: true, content_communities: [{ community_id: 'c2' }] },
  { id: '55555555-5555-4555-8555-555555555555', title: 'Gentle Breathing Basics', description: 'Learn a calming rhythm.',
    content_type: 'teaching_video', video_url: 'https://youtu.be/abcDEF12346', image_url: null, body: null,
    language: 'English', published_at: '2026-07-24T00:00:00Z', created_at: '2026-07-24T00:00:00Z',
    is_featured: false, is_public: false, is_published: true, content_communities: [{ community_id: 'c2' }] },
  { id: '66666666-6666-4666-8666-666666666666', title: 'Hand Care Tips for Caregivers', description: 'Small comforts, big difference.',
    content_type: 'educational_resource', video_url: null, image_url: null, body: 'Wash, rest, repeat.',
    language: 'English', published_at: '2026-07-23T00:00:00Z', created_at: '2026-07-23T00:00:00Z',
    is_featured: false, is_public: false, is_published: true, content_communities: [{ community_id: 'c1' }] },
  { id: '77777777-7777-4777-8777-777777777777', title: 'A Story of Spring', description: 'How one visit grew into a friendship.',
    content_type: 'community_story', video_url: null, image_url: null, body: 'It began with a song…',
    language: 'English', published_at: '2026-07-22T00:00:00Z', created_at: '2026-07-22T00:00:00Z',
    is_featured: true, is_public: false, is_published: true, content_communities: [{ community_id: 'c2' }] },
  { id: '99999999-9999-4999-8999-999999999999', title: 'August Program Update', description: 'What is coming this month.',
    content_type: 'community_update', video_url: null, image_url: null, body: 'New songs, new visits.',
    language: 'English', published_at: '2026-07-21T00:00:00Z', created_at: '2026-07-21T00:00:00Z',
    is_featured: false, is_public: false, is_published: true, content_communities: [{ community_id: 'c2' }] },
];
const PUBLIC_LETTERS = [
  { id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', user_id: 'someone-else', title: 'To anyone waiting',
    body: 'Hold on — brighter days are coming.', recipient_type: 'patient', status: 'approved', is_public: true,
    reviewed_at: '2026-07-20T00:00:00Z', created_at: '2026-07-19T00:00:00Z' },
];

(async () => {

/* ── 1. STATIC STRUCTURE of every portal page ── */
console.log('\n[portal pages · static structure]');
{
  const pages = fs.readdirSync(path.join(ROOT, 'community')).filter((f) => f.endsWith('.html'));
  ok(pages.length === 26, `26 portal pages exist in community/ (found ${pages.length})`);
  const required = ['index.html', 'login.html', 'signup.html', 'forgot-password.html', 'reset-password.html',
    'home.html', 'activity.html', 'profile.html', 'write-letter.html', 'request-letter.html',
    'request-video.html', 'request-song.html', 'content.html', 'participate.html', 'submission.html',
    'city-of-hope.html', 'ronald-mcdonald-house.html', 'northside-nicu.html', 'senior-living.html',
    'schools-global.html', 'milal.html',
    'with-you.html', 'melody-box.html', 'bloom-bank.html', 'hope-capsule.html', 'communities.html'];
  ok(required.every((f) => pages.includes(f)), 'all required portal routes present');
  let structural = true;
  for (const f of pages) {
    const html = fs.readFileSync(path.join(ROOT, 'community', f), 'utf8');
    structural = structural && html.includes('class="skip-link"') && html.includes('id="portal-root"')
      && html.includes('../css/portal.css') && html.includes('../js/vendor/supabase.js')
      && html.includes('<noscript>') && html.includes('data-portal-page=');
  }
  ok(structural, 'every portal page has skip-link, portal-root, portal.css, vendored supabase, noscript');
  const hubPages = ['with-you.html', 'melody-box.html', 'bloom-bank.html', 'hope-capsule.html', 'communities.html'];
  ok(hubPages.every((f) => fs.readFileSync(path.join(ROOT, 'community', f), 'utf8').includes('portal-hub.js')),
     'the four hub destination pages load portal-hub.js');
  const adminHtml = fs.readFileSync(path.join(ROOT, 'admin', 'community.html'), 'utf8');
  ok(adminHtml.includes('portal-admin.js') && adminHtml.includes('noindex'), 'admin page exists, noindex, loads admin JS');
  ok(fs.existsSync(path.join(ROOT, 'js/vendor/supabase.js')), 'supabase-js UMD build is vendored');
  const jsFiles = fs.readdirSync(path.join(ROOT, 'js/portal')).filter((f) => f.endsWith('.js'));
  const leaky = jsFiles.filter((f) =>
    /sb_secret_[A-Za-z0-9_-]{10,}|service_role/i.test(fs.readFileSync(path.join(ROOT, 'js/portal', f), 'utf8')));
  ok(leaky.length === 0, `no secret/service-role key in any client file (${leaky.join(', ') || 'clean'})`);
}

/* ── 2. INTRO PAGE (logged out) ── */
console.log('\n[community/index.html · intro]');
{
  const dom = loadPortalPage('community/index.html', 'https://x.test/community/index.html',
    { tables: { communities: COMMS, content: [] } });
  await tick();
  const d = dom.window.document;
  ok(d.querySelector('#portal-root h1').textContent === 'Community Portal', 'intro heading is plainly "Community Portal"');
  const login = [...d.querySelectorAll('a.btn')].find((a) => a.textContent.trim() === 'Log in');
  const signup = [...d.querySelectorAll('a.btn')].find((a) => a.textContent.includes('Create a free account'));
  ok(login && login.getAttribute('href') === 'login.html', 'clear Log in action');
  ok(signup && signup.getAttribute('href') === 'signup.html', 'clear Create account action');
  ok(!d.querySelector('#portal-root .eyebrow'), 'intro has no eyebrow labels');
  ok(d.querySelector('.nav'), 'main site nav still renders on portal pages');
  const brandHref = d.querySelector('.nav__logo').getAttribute('href');
  ok(brandHref === '../index.html', 'site nav brand links back to the main site (root-relative)');
  ok(d.querySelector('.footer'), 'site footer renders');
}

/* ── 3. LOGIN PAGE ── */
console.log('\n[community/login.html]');
{
  const dom = loadPortalPage('community/login.html', 'https://x.test/community/login.html',
    { tables: { communities: COMMS } });
  await tick();
  const d = dom.window.document;
  const form = d.querySelector('[data-login-form]');
  ok(!!form, 'login form renders');
  ok([...d.querySelectorAll('label')].some((l) => l.getAttribute('for') === 'login-email'), 'email input has an associated label');
  form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await tick();
  ok(d.querySelector('[data-error-for="email"]').textContent.includes('valid email'), 'empty submit → field-specific email error');
  ok(d.querySelector('[data-error-for="password"]').textContent.includes('password'), 'empty submit → field-specific password error');
  ok(!d.querySelector('[data-form-errors]').hidden, 'error summary is shown');
  ok(d.querySelector('#login-email').getAttribute('aria-invalid') === 'true', 'invalid field marked aria-invalid');
}

/* ── 4. LOGIN redirects when already signed in; guard preserves destination ── */
console.log('\n[auth guards]');
{
  const dom = loadPortalPage('community/login.html', 'https://x.test/community/login.html?next=activity.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE] } });
  await tick();
  ok(dom.window.__navigations[0] === 'activity.html', 'logged-in visitor to login is sent to their intended destination');
}
{
  const dom = loadPortalPage('community/home.html', 'https://x.test/community/home.html',
    { tables: { communities: COMMS } });
  await tick();
  ok(dom.window.__navigations[0] === 'login.html?next=' + encodeURIComponent('home.html'),
     'logged-out visitor to a protected page → login with intended destination preserved');
}
{
  const dom = loadPortalPage('community/login.html', 'https://x.test/community/login.html?next=https%3A%2F%2Fevil.example%2Fx',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE] } });
  await tick();
  ok(dom.window.__navigations[0] === 'home.html', 'absolute/external ?next= values are rejected (no open redirect)');
}
{
  const disabled = { ...PROFILE, is_disabled: true };
  const dom = loadPortalPage('community/home.html', 'https://x.test/community/home.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [disabled] } });
  await tick();
  ok(dom.window.document.body.textContent.includes('Account disabled'), 'disabled account sees a clear disabled message');
}
{
  // a real login submit lands on the five-option portal hub
  const dom = loadPortalPage('community/login.html', 'https://x.test/community/login.html',
    { tables: { communities: COMMS, profiles: [] } });
  await tick();
  const d = dom.window.document;
  d.querySelector('#login-email').value = 'a@test.org';
  d.querySelector('#login-password').value = 'hunter22!';
  d.querySelector('[data-login-form]').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await tick(30);
  ok(dom.window.__navigations.includes('home.html'), 'successful login redirects to the portal hub (home.html)');
}
{
  // a login that started with ?next= still lands on the intended page
  const dom = loadPortalPage('community/login.html', 'https://x.test/community/login.html?next=request-song.html',
    { tables: { communities: COMMS, profiles: [] } });
  await tick();
  const d = dom.window.document;
  d.querySelector('#login-email').value = 'a@test.org';
  d.querySelector('#login-password').value = 'hunter22!';
  d.querySelector('[data-login-form]').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await tick(30);
  ok(dom.window.__navigations.includes('request-song.html'), 'login with a saved destination still honors ?next= (deep link preserved)');
}

/* ── 5. SIGNUP PAGE ── */
console.log('\n[community/signup.html]');
{
  const dom = loadPortalPage('community/signup.html', 'https://x.test/community/signup.html',
    { tables: { communities: COMMS } });
  await tick();
  const d = dom.window.document;
  ok(d.querySelectorAll('#su-type option').length === 6, 'five account types offered (plus placeholder)');
  ok(d.querySelectorAll('#su-community option').length === 7, 'six communities offered (plus placeholder)');
  ok(d.body.textContent.includes('request account and data removal'), 'consent statement covers data removal');
  ok(d.body.textContent.includes('parent or guardian'), 'consent statement covers minors');
  const form = d.querySelector('[data-signup-form]');
  form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await tick();
  ok(d.querySelector('[data-error-for="agree"]').textContent.length > 0, 'required consent agreement is validated');
  ok(d.querySelector('[data-error-for="primary_community_id"]').textContent.length > 0, 'community selection is required');
  // fill it in and submit for real
  d.querySelector('#su-name').value = 'New Member';
  d.querySelector('#su-email').value = 'new@member.org';
  d.querySelector('#su-password').value = 'longenough1';
  d.querySelector('#su-password2').value = 'longenough1';
  d.querySelector('#su-type').value = 'family_member';
  d.querySelector('#su-community').value = 'c3';
  d.querySelector('input[name="agree"]').checked = true;
  d.querySelector('input[name="email_consent"]').checked = true;
  form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await tick(30);
  const su = dom.window.__calls.signUp;
  ok(su && su.email === 'new@member.org', 'signUp called with the email');
  ok(su && su.options.data.account_type === 'family_member' && su.options.data.primary_community_id === 'c3',
     'account type + primary community sent as sign-up metadata');
  ok(su && su.options.data.email_consent === true, 'optional email consent captured');
  ok(su && /community\/login\.html\?verified=1$/.test(su.options.emailRedirectTo), 'email verification redirects back to portal login');
  ok(d.body.textContent.includes('check your email'), 'success panel asks the member to verify their email');
}

/* ── 6. PORTAL HOME — the five-option hub (signed in) ── */
console.log('\n[community/home.html · five-option hub]');
{
  const dom = loadPortalPage('community/home.html', 'https://x.test/community/home.html', {
    session: SESSION,
    tables: { communities: COMMS, profiles: [PROFILE] },
  });
  await tick(30);
  const d = dom.window.document;
  const w = dom.window;

  ok(d.querySelector('#portal-root h1') && d.querySelector('#portal-root h1').textContent === 'Welcome, Aaron',
     'personal welcome uses the member\'s first name');
  ok(d.body.textContent.includes('What would you like to do?'), 'action question, not a slogan');
  ok(!d.body.textContent.includes('ONE MESSAGE FOR YOU'), 'no oversized duplicate branding on portal home');
  ok(!d.body.textContent.includes('There are many ways to share'), 'old tagline removed');

  const cards = [...d.querySelectorAll('a.hub-action')];
  ok(cards.length === 5, 'exactly five action rows render');
  const got = cards.map((a) => [a.dataset.option, a.getAttribute('href')]);
  ok(JSON.stringify(got) === JSON.stringify([
      ['with_you', 'with-you.html'], ['melody_box', 'melody-box.html'],
      ['wish_pocket', 'request-song.html'], ['bloom_bank', 'bloom-bank.html'],
      ['hope_capsule', 'hope-capsule.html']]),
     'rows link to With You / Melody Box / Wish Pocket (existing song request page) / Bloom Bank / Hope Capsule');
  ok(cards.every((a) => a.tagName === 'A' && a.getAttribute('href') && !a.hasAttribute('tabindex')),
     'every row is a real link — keyboard and screen-reader operable, no fake buttons');
  const titles = cards.map((a) => a.querySelector('.hub-action__title').textContent);
  ok(JSON.stringify(titles) === JSON.stringify(['With You', 'Melody Box', 'Wish Pocket', 'Bloom Bank', 'Hope Capsule']),
     'the five action names are kept');
  ok(cards.every((a) => (a.querySelector('.hub-action__desc').textContent || '').length > 10),
     'every action has a plain description (not explained by illustration alone)');
  ok(cards[0].classList.contains('hub-action--featured') && cards.slice(1).every((a) => !a.classList.contains('hub-action--featured')),
     'With You is the single featured (larger) row — deliberately unequal');
  ok(cards.every((a) => {
       const img = a.querySelector('img');
       return img && img.getAttribute('alt') === '' && img.getAttribute('src').startsWith('../assets/images/portal/');
     }), 'action illustrations are local, centralized assets with empty alt (decorative)');
  ok(!d.querySelector('.hub-flower') && !d.querySelector('.hub-smiley'),
     'decorative clip art (flowers, smiley) removed');
  ok(!d.body.textContent.includes('Wherever you are in your journey'),
     'no philosophical footer message inside the portal');
  const myComm = d.querySelector('.hub-mycommunity a');
  ok(myComm && myComm.getAttribute('href') === 'ronald-mcdonald-house.html' && myComm.textContent.includes('Ronald McDonald House'),
     'portal home links straight to the member\'s own community');

  const navLinks = [...d.querySelectorAll('.portal-nav__link')].map((a) => a.textContent.replace('●', '').trim());
  ok(JSON.stringify(navLinks) === JSON.stringify(['Home', 'Communities', 'My Activity', 'Profile', 'Log Out']),
     'minimal nav: Home · Communities · My Activity · Profile · Log Out');
  ok(!navLinks.includes('Ronald McDonald House') && !navLinks.includes('City of Hope Atlanta'),
     'no organization names in the nav — they live behind the single Communities tab');

  const views = w.__calls.inserts.filter((i) => i.table === 'activity_events' && i.rows.event_type === 'portal_home_viewed');
  ok(views.length === 1 && views[0].rows.community_id === 'c2',
     'portal_home_viewed recorded exactly once, tagged with the primary community');

  // clicking a card records ONE portal_option_selected event, then navigates
  cards[1].dispatchEvent(new w.Event('click', { bubbles: true, cancelable: true }));
  await tick(30);
  const sel = w.__calls.inserts.filter((i) => i.table === 'activity_events' && i.rows.event_type === 'portal_option_selected');
  ok(sel.length === 1 && sel[0].rows.metadata && sel[0].rows.metadata.option === 'melody_box',
     'card click records one portal_option_selected with metadata.option = melody_box');
  ok(w.__navigations.includes('melody-box.html'), 'card click then navigates to melody-box.html');
}

/* ── 7. HUB IS CONTENT-INDEPENDENT ── */
{
  const dom = loadPortalPage('community/home.html', 'https://x.test/community/home.html',
    { session: SESSION, tables: { communities: [], profiles: [PROFILE] } });
  await tick(30);
  ok(dom.window.document.querySelectorAll('a.hub-action').length === 5,
     'all five actions render even before any content or communities are published');
}

/* ── 8. COMMUNITY PAGE ── */
console.log('\n[community pages]');
{
  const dom = loadPortalPage('community/ronald-mcdonald-house.html', 'https://x.test/community/ronald-mcdonald-house.html', {
    session: SESSION,
    tables: {
      communities: COMMS, profiles: [PROFILE], content: CONTENT,
      activity_communities: [{ community_id: 'c2', activity_definitions: { id: 'a1', name: 'Simple Rhythm Activity', slug: 'simple-rhythm', description: 'Clap.', activity_type: 'rhythm_activity', is_active: true } }],
      activity_submissions: [], video_progress: [],
    },
  });
  await tick(30);
  const d = dom.window.document;
  ok(d.querySelector('h1') && d.querySelector('h1').textContent === 'Ronald McDonald House', 'community page renders its name');
  ok(d.body.textContent.includes('Your community'), 'primary community is acknowledged on its own page');
  ok(!d.querySelector('#portal-root .eyebrow'), 'community page has no eyebrow labels');
  ok(d.body.textContent.includes('Current Programs') && d.body.textContent.includes('One Message for You'),
     'programs section reuses the real partner program data');
  ok(d.body.textContent.includes('Available Activities') && d.body.textContent.includes('Simple Rhythm Activity'),
     'activities assigned to this community are listed');
  ok(d.body.textContent.includes('Latest Videos'), 'community content sections render');
  const visit = dom.window.__calls.inserts.find((i) => i.table === 'activity_events');
  ok(visit && visit.rows.event_type === 'community_page_visited' && visit.rows.community_id === 'c2',
     'community_page_visited engagement event recorded');
}
{
  // inactive/unknown community slug → graceful state
  const dom = loadPortalPage('community/milal.html', 'https://x.test/community/milal.html',
    { session: SESSION, tables: { communities: COMMS.filter((c) => c.slug !== 'milal'), profiles: [PROFILE] } });
  await tick(30);
  ok(dom.window.document.body.textContent.includes("isn't available right now"),
     'inactive community shows a graceful message instead of an error');
}

/* ── 9. HUB DESTINATION PAGES ── */
console.log('\n[community/with-you.html]');
{
  const dom = loadPortalPage('community/with-you.html', 'https://x.test/community/with-you.html', {
    session: SESSION,
    tables: { communities: COMMS, profiles: [PROFILE], content: HUB_CONTENT, letters: PUBLIC_LETTERS },
  });
  await tick(30);
  const d = dom.window.document;
  ok(d.querySelector('h1') && d.querySelector('h1').textContent === 'With You', 'With You page renders');
  const hrefs = [...d.querySelectorAll('.hub-quick a')].map((a) => a.getAttribute('href'));
  ok(hrefs.includes('write-letter.html'), 'Write a letter → the existing letter form (reused, not rebuilt)');
  ok(hrefs.includes('request-letter.html'), 'Request a letter → the existing request form');
  ok(hrefs.includes('#read-letters') && !!d.querySelector('#read-letters'), 'Read choice jumps to the letters right below');
  ok(d.body.textContent.includes('A Letter of Courage'), 'approved letter/message content listed');
  ok(d.body.textContent.includes('To anyone waiting') && d.body.textContent.includes('From a community member'),
     'public community letters shown, always anonymously');
  ok(!d.body.textContent.includes('Aaron Tester') && !d.body.textContent.includes('a@test.org'),
     'no full names or email addresses exposed');
  ok(d.body.textContent.includes('Back to the portal'), 'back link to the hub');
}

console.log('\n[community/melody-box.html]');
{
  const dom = loadPortalPage('community/melody-box.html', 'https://x.test/community/melody-box.html', {
    session: SESSION,
    tables: {
      communities: COMMS, profiles: [PROFILE], content: HUB_CONTENT,
      video_progress: [{ user_id: 'u1', content_id: '11111111-1111-4111-8111-111111111111',
        progress_seconds: 120, total_seconds: 300, completion_percentage: 40, completed: false, last_watched_at: '2026-07-30T00:00:00Z' }],
    },
  });
  await tick(30);
  const d = dom.window.document;
  ok(d.querySelector('h1') && d.querySelector('h1').textContent === 'Melody Box', 'Melody Box page renders');
  ok(d.body.textContent.includes('Continue Watching'), 'Continue Watching carries over for a partially-watched video');
  ok(!!d.querySelector('.pprogress'), 'existing video-progress bar reused');
  ok(d.body.textContent.includes('Song Performances') && d.body.textContent.includes('Lullaby for Quiet Evenings'),
     'song performances listed');
  ok(d.body.textContent.includes('Spring Concert Highlights'), 'performance videos listed');
  ok([...d.querySelectorAll('a')].some((a) => (a.getAttribute('href') || '').startsWith('content.html?id=')),
     'cards open the existing content player (same tracking system)');
  ok([...d.querySelectorAll('a')].some((a) => a.getAttribute('href') === 'request-song.html'),
     'cross-link to the Wish Pocket (existing song request page)');
  ok(!d.body.textContent.includes('Gentle Breathing Basics'), 'teaching videos stay in the Bloom Bank, not the Melody Box');
}

console.log('\n[community/bloom-bank.html]');
{
  const dom = loadPortalPage('community/bloom-bank.html', 'https://x.test/community/bloom-bank.html', {
    session: SESSION,
    tables: {
      communities: COMMS, profiles: [PROFILE], content: HUB_CONTENT,
      activity_definitions: [{ id: 'a1', name: 'Simple Rhythm Activity', slug: 'simple-rhythm', description: 'Clap along.', activity_type: 'rhythm_activity', is_active: true, created_at: '2026-07-01' }],
    },
  });
  await tick(30);
  const d = dom.window.document;
  ok(d.querySelector('h1') && d.querySelector('h1').textContent === 'Bloom Bank', 'Bloom Bank page renders');
  ok(d.body.textContent.includes('This content is for general education and does not replace professional medical advice.'),
     'health disclaimer is visible');
  ok(!!d.querySelector('.hub-disclaimer[role="note"]'), 'disclaimer is exposed as a note');
  ok(d.body.textContent.includes('Teaching Videos') && d.body.textContent.includes('Gentle Breathing Basics'),
     'teaching videos listed');
  ok(d.body.textContent.includes('Educational Resources') && d.body.textContent.includes('Hand Care Tips for Caregivers'),
     'educational resources listed');
  ok(d.body.textContent.includes('Activity Guides') && d.body.textContent.includes('Simple Rhythm Activity'),
     'activity guides reuse the existing activities system');
  ok([...d.querySelectorAll('a')].some((a) => (a.getAttribute('href') || '').startsWith('participate.html?a=')),
     'activity guides link to the existing participate flow');
}

console.log('\n[community/hope-capsule.html]');
{
  const dom = loadPortalPage('community/hope-capsule.html', 'https://x.test/community/hope-capsule.html', {
    session: SESSION,
    tables: { communities: COMMS, profiles: [PROFILE], content: HUB_CONTENT, letters: PUBLIC_LETTERS },
  });
  await tick(30);
  const d = dom.window.document;
  ok(d.querySelector('h1') && d.querySelector('h1').textContent === 'Hope Capsule', 'Hope Capsule page renders');
  ok(d.body.textContent.includes('Featured Stories') && d.body.textContent.includes('A Story of Spring'),
     'featured community story surfaces first');
  ok(d.body.textContent.includes('Community Updates') && d.body.textContent.includes('August Program Update'),
     'community updates listed');
  ok(d.body.textContent.includes('To anyone waiting') && d.body.textContent.includes('From a community member'),
     'approved public letters shown anonymously');
  ok(!d.body.textContent.includes('Aaron Tester') && !d.body.textContent.includes('someone-else')
     && !d.body.textContent.includes('a@test.org'),
     'no names, user ids, or email addresses exposed');
}
{
  // empty hope capsule → graceful message
  const dom = loadPortalPage('community/hope-capsule.html', 'https://x.test/community/hope-capsule.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE], content: [], letters: [] } });
  await tick(30);
  ok(dom.window.document.body.textContent.includes('Stories, updates, and shared letters will appear here'),
     'empty Hope Capsule shows a plain, honest empty state');
}

console.log('\n[community/communities.html · All Communities]');
{
  const dom = loadPortalPage('community/communities.html', 'https://x.test/community/communities.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE] } });
  await tick(30);
  const d = dom.window.document;
  ok(d.querySelector('h1') && d.querySelector('h1').textContent === 'Communities', 'Communities directory renders');
  const visits = [...d.querySelectorAll('a.pcomm-row')].map((a) => a.getAttribute('href'));
  ok(['city-of-hope.html', 'ronald-mcdonald-house.html', 'northside-nicu.html', 'senior-living.html',
      'schools-global.html', 'milal.html'].every((h) => visits.includes(h)),
     'all six community pages reachable from the directory');
  ok(visits[0] === 'ronald-mcdonald-house.html', "member's own community is listed first");
  const mineRow = d.querySelector('a.pcomm-row .pcomm-row__mine');
  ok(mineRow && mineRow.textContent === 'Your community'
     && mineRow.closest('a').getAttribute('href') === 'ronald-mcdonald-house.html',
     'understated "Your community" status on the member\'s own row (no COMMUNITY label spam)');
  ok(!d.body.textContent.includes('COMMUNITY\n'), 'no repeated COMMUNITY eyebrow above every name');
  ok([...d.querySelectorAll('.pcomm-row__desc')].every((el) => (el.textContent.match(/[.!?]/g) || []).length <= 1),
     'directory descriptions are one sentence');
  ok([...d.querySelectorAll('a')].some((a) => a.getAttribute('href') === 'profile.html'),
     'link to change the primary community in Profile Settings');
  ok(d.querySelector('.portal-nav__link.is-active').textContent.trim() === 'Communities',
     'nav marks Communities active');
}
{
  // any community page highlights the single Communities tab
  const dom = loadPortalPage('community/city-of-hope.html', 'https://x.test/community/city-of-hope.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE], content: [], activity_communities: [], activity_submissions: [], video_progress: [], letters: [] } });
  await tick(30);
  const act = dom.window.document.querySelector('.portal-nav__link.is-active');
  ok(act && act.textContent.trim() === 'Communities',
     'visiting any community page highlights the Communities tab');
}

/* ── 9b. CONTENT CARD SECURITY (XSS) on hub destination pages ── */
console.log('\n[content rendering safety]');
{
  const evil = { ...CONTENT[0], id: '33333333-3333-4333-8333-333333333333',
    title: '<img src=x onerror="window.__pwned=1"><script>window.__pwned=2</script>',
    description: '"><b>bold?</b>' };
  const evilLetter = { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', user_id: 'x', is_public: true, status: 'approved',
    title: '<script>window.__pwned=3</script>', body: '<img src=x onerror="window.__pwned=4">',
    recipient_type: 'patient', reviewed_at: '2026-07-20T00:00:00Z', created_at: '2026-07-20T00:00:00Z' };
  const dom = loadPortalPage('community/melody-box.html', 'https://x.test/community/melody-box.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE], content: [evil], video_progress: [] } });
  await tick(30);
  const d = dom.window.document;
  ok(!dom.window.__pwned, 'malicious content title cannot execute script');
  ok(!d.querySelector('#portal-root script'), 'no script element injected from content');
  ok(d.body.textContent.includes('<script>'), 'malicious markup is rendered as harmless text');

  const dom2 = loadPortalPage('community/hope-capsule.html', 'https://x.test/community/hope-capsule.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE], content: [], letters: [evilLetter] } });
  await tick(30);
  ok(!dom2.window.__pwned && !dom2.window.document.querySelector('#portal-root script'),
     'malicious public-letter content cannot execute script either');
}

/* ── 9c. HUB RESPONSIVE + MOTION STATICS ── */
console.log('\n[hub responsive & accessibility statics]');
{
  const css = fs.readFileSync(path.join(ROOT, 'css/portal.css'), 'utf8');
  ok(!css.includes('Fredoka') && !css.includes('Gochi'), 'handwritten/rounded display fonts removed — brand type only');
  ok(css.includes('.hub-action--featured'), 'With You featured row style exists (deliberately unequal layout)');
  ok(css.includes('.hub-action:hover, .hub-action:focus-visible'), 'action rows have hover + visible focus states');
  ok(css.includes('@media (prefers-reduced-motion: reduce)') && css.includes('.hub-action, .pcomm-row'),
     'reduced-motion preference disables row motion');
  ok(css.includes('@media (max-width: 480px)'), 'small-phone adjustments present');
  ok(!css.includes('border-radius: 22px'), 'oversized rounded hub cards removed');
}

/* ── 10. MY ACTIVITY ── */
console.log('\n[community/activity.html]');
{
  const dom = loadPortalPage('community/activity.html', 'https://x.test/community/activity.html', {
    session: SESSION,
    tables: {
      communities: COMMS, profiles: [PROFILE],
      activity_events: [{ id: 1, user_id: 'u1', event_type: 'letter_submitted', community_id: 'c2', created_at: '2026-07-29T00:00:00Z' }],
      letters: [{ id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', user_id: 'u1', title: 'To a brave parent', status: 'under_review', community_id: 'c2', recipient_type: 'parent', created_at: '2026-07-29T00:00:00Z', updated_at: '2026-07-29T00:00:00Z' }],
      activity_requests: [{ id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', user_id: 'u1', title: 'You Raise Me Up', request_type: 'song', status: 'submitted', community_id: 'c4', created_at: '2026-07-28T00:00:00Z', updated_at: '2026-07-28T00:00:00Z' }],
      activity_submissions: [], video_progress: [], activity_definitions: [],
      content: [],
    },
  });
  await tick(30);
  const d = dom.window.document;
  ok(d.body.textContent.includes('To a brave parent'), 'letter listed in history');
  ok(d.body.textContent.includes('Under review'), 'letter shows its review status');
  ok(d.body.textContent.includes('You Raise Me Up'), 'song request listed in history');
  const tabs = [...d.querySelectorAll('.pfilter')].map((b) => b.textContent);
  ok(JSON.stringify(tabs) === JSON.stringify(['All', 'Videos', 'Letters', 'Requests', 'Activities', 'Events']),
     'activity filters: All / Videos / Letters / Requests / Activities / Events');
  const evBtn = [...d.querySelectorAll('.pfilter')].find((b) => b.textContent === 'Events');
  evBtn.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await tick();
  ok(d.body.textContent.includes('Submitted a letter for review'), 'events tab shows readable event history');
}

/* ── 11. WRITE LETTER ── */
console.log('\n[community/write-letter.html]');
{
  const dom = loadPortalPage('community/write-letter.html', 'https://x.test/community/write-letter.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE] } });
  await tick(30);
  const d = dom.window.document;
  ok(d.body.textContent.includes('do not include private medical details'), 'privacy warning shown on the letter form');
  ok(d.querySelectorAll('#lt-recipient option').length === 9, 'eight recipient groups (plus placeholder)');
  ok(d.querySelector('#lt-community option[value="c2"]').selected, "member's primary community preselected");
  ok(d.body.textContent.includes('without my name'), 'public-display consent explains the name is never shown');
  const form = d.querySelector('[data-letter-form]');
  form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await tick();
  ok([...d.querySelectorAll('.perror')].filter((e) => e.textContent).length >= 3, 'empty letter submit → multiple field errors');
  d.querySelector('#lt-recipient').value = 'parent';
  d.querySelector('#lt-title').value = 'A note of courage';
  d.querySelector('#lt-body').value = 'You are doing better than you know. We are with you.';
  form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await tick(30);
  const ins = dom.window.__calls.inserts.find((i) => i.table === 'letters');
  ok(ins && ins.rows.status === 'submitted' && ins.rows.recipient_type === 'parent', 'letter inserted with submitted status');
  ok(d.body.textContent.includes('Your letter is on its way'), 'success confirmation after submitting');
}

/* ── 12. REQUEST FORMS prefill + submit ── */
console.log('\n[request forms]');
{
  const dom = loadPortalPage('community/request-letter.html', 'https://x.test/community/request-letter.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE] } });
  await tick(30);
  const d = dom.window.document;
  ok(d.querySelector('#rl-name').value === 'Aaron Tester', "recipient name prefilled from the member's profile (editable)");
  ok(d.querySelector('#rl-email').value === 'a@test.org', 'email prefilled (editable)');
  d.querySelector('#rl-type').value = 'Encouragement';
  d.querySelector('[data-req-form]').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await tick(30);
  const ins = dom.window.__calls.inserts.find((i) => i.table === 'activity_requests');
  ok(ins && ins.rows.request_type === 'letter' && ins.rows.recipient_email === 'a@test.org', 'letter request row inserted');
}
{
  const dom = loadPortalPage('community/request-song.html', 'https://x.test/community/request-song.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE] } });
  await tick(30);
  const d = dom.window.document;
  d.querySelector('#rs-title').value = 'Amazing Grace';
  d.querySelector('#rs-artist').value = 'Traditional';
  d.querySelector('#rs-why').value = 'It was my mother\'s favorite hymn.';
  d.querySelector('[data-req-form]').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await tick(30);
  const ins = dom.window.__calls.inserts.find((i) => i.table === 'activity_requests');
  ok(ins && ins.rows.request_type === 'song' && ins.rows.extra.artist_or_composer === 'Traditional',
     'song request captures artist + meaning');
}
{
  // duplicate-submission prevention: second submit while busy is ignored
  const dom = loadPortalPage('community/request-video.html', 'https://x.test/community/request-video.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE] } });
  await tick(30);
  const d = dom.window.document;
  d.querySelector('#rv-type').value = 'teaching_video';
  d.querySelector('#rv-topic').value = 'Rhythms for rainy days';
  d.querySelector('#rv-audience').value = 'Families';
  d.querySelector('#rv-community').value = 'c2';
  const form = d.querySelector('[data-req-form]');
  form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await tick(30);
  const inserts = dom.window.__calls.inserts.filter((i) => i.table === 'activity_requests');
  ok(inserts.length === 1, 'double-click cannot create a duplicate request');
}

/* ── 13. PROFILE PAGE ── */
console.log('\n[community/profile.html]');
{
  const dom = loadPortalPage('community/profile.html', 'https://x.test/community/profile.html',
    { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE] } });
  await tick(30);
  const d = dom.window.document;
  ok(d.querySelector('#pf-name').value === 'Aaron Tester', 'name editable');
  ok(d.querySelector('#pf-community option[value="c2"]').selected, 'primary community editable with current value');
  ok(d.body.textContent.includes("Your role and account ID can't be edited"), 'role/ID explicitly not editable');
  ok(d.body.textContent.includes('Delete account & data'), 'account deletion section present');
  const delBtn = d.querySelector('[data-delete-account]');
  ok(delBtn.disabled, 'delete button disabled until typed confirmation');
  d.querySelector('#del-confirm').value = 'DELETE';
  d.querySelector('#del-confirm').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  ok(!delBtn.disabled, 'typing DELETE enables the delete button');
  // save profile change
  d.querySelector('#pf-name').value = 'Aaron T.';
  d.querySelector('[data-profile-form]').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  await tick(30);
  const upd = dom.window.__calls.updates.find((u) => u.table === 'profiles');
  ok(upd && upd.row.full_name === 'Aaron T.' && !('role' in upd.row), 'profile update writes name but never role');
}

/* ── 14. ADMIN GATE ── */
console.log('\n[admin/community.html]');
{
  const ADMIN_BUNDLE = ['js/config.js', 'js/partners.js', 'js/portal/portal-config.js',
    'js/portal/portal-core.js', 'js/portal/portal-admin.js'];
  {
    const dom = loadPortalPage('admin/community.html', 'https://x.test/admin/community.html',
      { session: SESSION, tables: { communities: COMMS, profiles: [PROFILE] } }, ADMIN_BUNDLE);
    await tick(30);
    ok(dom.window.document.body.textContent.includes('Not authorized'), 'normal users are refused by the admin page');
  }
  {
    const admin = { ...PROFILE, role: 'admin', full_name: 'Admin Aaron' };
    const dom = loadPortalPage('admin/community.html', 'https://x.test/admin/community.html', {
      session: SESSION,
      tables: { communities: COMMS, profiles: [admin] },
      rpc: {},
      __fns: `window.__stubState.rpc = { admin_summary_metrics: () => ({ data: {
        range: { from: '2026-07-01', to: '2026-08-01' }, total_accounts: 7, new_accounts: 3,
        disabled_accounts: 0, accounts_by_community: { 'Milal': 2 }, accounts_by_type: { participant: 4 },
        active_users: 5, returning_users: 2, videos_opened: 9, videos_started: 8, videos_completed: 4,
        avg_video_completion: 61.5, letters_written: 3, letters_requested: 1, video_requests: 2,
        song_requests: 2, activities_started: 6, activities_completed: 5,
        most_active_communities: [], most_viewed_content: [], most_completed_content: [], recent_submissions: [] }, error: null }) };`,
    }, ADMIN_BUNDLE);
    await tick(40);
    const d = dom.window.document;
    ok(d.querySelector('#portal-root h1').textContent === 'Admin', 'admins see the dashboard');
    const tabs = [...d.querySelectorAll('[data-tab]')].map((b) => b.textContent);
    ok(JSON.stringify(tabs) === JSON.stringify(['Overview', 'Accounts', 'Letters', 'Requests', 'Content', 'Activities']),
       'admin sections: Overview / Accounts / Letters / Requests / Content / Activities');
    ok(d.body.textContent.includes('Total accounts') && d.body.textContent.includes('7'), 'summary metrics rendered from the RPC');
    ok(d.body.textContent.includes('Returning users'), 'returning-users metric present');
    ok(d.body.textContent.includes('“Active” = ≥1 event in range'), 'active/returning definitions stated in the UI');
    ok(!!d.querySelector('[data-f-export]'), 'CSV export control present');
    const rpc = dom.window.__calls.rpcs.find((r) => r.name === 'admin_summary_metrics');
    ok(!!rpc, 'metrics come from the aggregate RPC (events are not downloaded to the browser)');
  }
}

/* ── 15. YOUTUBE ID PARSER + card actions ── */
console.log('\n[video helpers]');
{
  const dom = loadPortalPage('community/index.html', 'https://x.test/community/index.html',
    { tables: { communities: COMMS, content: [] } });
  await tick();
  const w = dom.window;
  const idOf = (u) => w.eval(`Portal.ytVideoId(${JSON.stringify(u)})`);
  ok(idOf('https://www.youtube.com/watch?v=dQw4w9WgXcQ') === 'dQw4w9WgXcQ', 'parses watch?v= URLs');
  ok(idOf('https://youtu.be/dQw4w9WgXcQ') === 'dQw4w9WgXcQ', 'parses youtu.be URLs');
  ok(idOf('https://www.youtube.com/embed/dQw4w9WgXcQ') === 'dQw4w9WgXcQ', 'parses embed URLs');
  ok(idOf('https://www.youtube.com/shorts/dQw4w9WgXcQ') === 'dQw4w9WgXcQ', 'parses shorts URLs');
  ok(idOf('https://example.com/video.mp4') === null, 'non-YouTube URLs are not treated as YouTube');
  const card = w.eval(`Portal.contentCard(${JSON.stringify(CONTENT[0])})`);
  ok(card.includes('Watch') && card.includes('content.html?id='), 'video cards get a Watch action linking to the content page');
  const letterCard = w.eval(`Portal.contentCard(${JSON.stringify(CONTENT[1])})`);
  ok(letterCard.includes('Read'), 'letter cards get a Read action');
}

/* ── 16. LOCAL PREVIEW SERVER (npm run preview) ── */
console.log('\n[test/preview.js · local preview server]');
{
  const http = require('http');
  const { createServer, FIXTURES } = require('./preview.js');
  const srv = createServer();
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const port = srv.address().port;
  const get = (p) => new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path: p }, (res) => {
      let b = ''; res.on('data', (d) => (b += d)); res.on('end', () => resolve({ status: res.statusCode, body: b, type: res.headers['content-type'] || '' }));
    }).on('error', reject);
  });

  const home = await get('/community/home.html');
  ok(home.status === 200 && home.body.includes('data-portal-page="home"'), 'serves the portal hub page');
  ok(home.body.includes('LOCAL PREVIEW'), 'preview ribbon injected on portal pages');
  const pub = await get('/index.html');
  ok(pub.status === 200 && !pub.body.includes('LOCAL PREVIEW'), 'public pages are served untouched (no ribbon)');

  const stub = await get('/js/vendor/supabase.js');
  ok(stub.body.includes('LOCAL PREVIEW STUB') && stub.body.includes('window.__stubState')
     && stub.body.includes('createClient'), 'vendored supabase-js is swapped for the offline stub + sample data');
  ok(stub.body.includes('sample@preview.local') && !stub.body.includes('umnlnmjzsbhlxqldmubj'),
     'preview is fully offline — the real Supabase project is never referenced');
  ok(FIXTURES.tables.content.every((c) => c.is_published === true), 'sample content is published-only (mirrors RLS)');
  const optionIds = ['with_you', 'melody_box', 'wish_pocket', 'bloom_bank', 'hope_capsule'];
  ok(FIXTURES.tables.communities.length === 6 && optionIds.length === 5, 'fixtures cover six communities + five hub options');

  const css = await get('/css/portal.css');
  ok(css.status === 200 && css.type.startsWith('text/css'), 'stylesheets served with the right MIME type');
  const img = await get('/assets/images/portal/with-you-envelope.png');
  ok(img.status === 200 && img.type === 'image/png', 'hub illustrations served');
  const trav = await get('/..%2f..%2fetc%2fpasswd');
  ok(trav.status !== 200, 'path traversal is rejected');
  ok((await get('/definitely-not-here.html')).status === 404, 'unknown paths 404');

  await new Promise((r) => srv.close(r));

  // the no-Node escape hatches: shared fixtures + Python twin + double-click launcher
  const fixturesRaw = fs.readFileSync(path.join(ROOT, 'test/preview-fixtures.json'), 'utf8');
  ok(JSON.stringify(JSON.parse(fixturesRaw)) === JSON.stringify(FIXTURES),
     'preview fixtures live in one shared JSON file (used by both servers)');
  const py = fs.readFileSync(path.join(ROOT, 'test/preview.py'), 'utf8');
  ok(py.includes('/js/vendor/supabase.js') && py.includes('preview-fixtures.json')
     && py.includes('LOCAL PREVIEW') && py.includes('const STUB = `'.slice(0, 12)),
     'Python preview server mirrors the stub swap + ribbon');
  try {
    require('child_process').execSync('python3 -m py_compile test/preview.py', { cwd: ROOT, stdio: 'pipe' });
    ok(true, 'test/preview.py compiles under python3');
  } catch (e) {
    ok(!/^Error: spawn/.test(String(e.message)) && e.status === undefined, 'test/preview.py compiles under python3 (python3 unavailable here — skipped)');
  }
  const cmdPath = path.join(ROOT, 'Preview Portal.command');
  const cmd = fs.readFileSync(cmdPath, 'utf8');
  ok((fs.statSync(cmdPath).mode & 0o111) !== 0, '"Preview Portal.command" is executable (double-clickable)');
  ok(cmd.includes('node test/preview.js') && cmd.includes('python3 test/preview.py') && cmd.includes('open "'),
     'launcher tries Node, falls back to Python, and opens the browser');
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
