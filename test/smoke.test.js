/* DOM smoke tests for the WE ARE WITH YOU site (v7 editorial redesign).
   Loads real HTML pages into jsdom, executes the real site JS,
   and asserts the rendered output. Run: node smoke.test.js */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const ROOT = require('path').join(__dirname, '..');
let passed = 0, failed = 0;
const ok = (cond, msg) => {
  if (cond) { passed++; console.log('  ✓', msg); }
  else { failed++; console.log('  ✗ FAIL:', msg); }
};

function loadPage(file, url) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const dom = new JSDOM(html, { url, runScripts: 'outside-only' });
  const w = dom.window;
  // stub browser APIs jsdom lacks
  w.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; }
    observe() {} unobserve() {} disconnect() {}
  };
  const bundle = ['js/config.js', 'js/partners.js', 'js/site.js', 'js/archive.js', 'js/archive-ui.js']
    .map(js => fs.readFileSync(path.join(ROOT, js), 'utf8')).join('\n;\n');
  w.eval(bundle);
  return dom;
}

/* All public pages (portal + admin excluded — they have their own tests). */
const PUBLIC_PAGES = ['index.html', 'student-community.html', 'media.html',
  'one-message-for-you.html', 'hope-capsule.html', 'contact.html',
  'our-philosophy.html', 'partner.html', '404.html'];
/* learning.html (NADO School) and join.html (Join Us) are excluded for now —
   both are redirect stubs; the full pages live in context/excluded/. */

/* ── 1. HOMEPAGE ── */
console.log('\n[index.html]');
{
  const dom = loadPage('index.html', 'https://x.test/index.html');
  const d = dom.window.document;

  const brand = d.querySelector('.nav__logo');
  ok(brand && brand.textContent.trim() === 'WE ARE WITH YOU', 'nav brand is exactly "WE ARE WITH YOU"');
  ok(!brand.textContent.includes('GYCO'), 'nav brand contains no GYCO co-branding');

  const navLabels = [...d.querySelectorAll('.nav__links > li > a')].map(a => a.textContent.replace('▾', '').trim());
  ok(navLabels.includes('GYCO'), 'nav has GYCO');
  ok(!navLabels.includes('NADO School') && !navLabels.includes('Join Us'),
     'nav has no NADO School or Join Us tab (excluded for now — see context/excluded/)');
  ok(navLabels[0] === 'We Are With You', 'first nav tab is "We Are With You"');
  ok(navLabels.includes('Community Portal') && !navLabels.includes('Programs'),
     'nav: Community Portal replaces the Programs tab');
  ok(navLabels.includes('Philosophy'), 'nav has a visible Philosophy tab');
  ok(navLabels.indexOf('Media') < navLabels.indexOf('Philosophy') &&
     navLabels.indexOf('Philosophy') < navLabels.indexOf('Contact'),
     'Philosophy sits between Media and Contact');
  {
    const phil = [...d.querySelectorAll('.nav__links > li > a')].find(a => a.textContent.trim() === 'Philosophy');
    ok(phil && phil.getAttribute('href') === 'our-philosophy.html', 'Philosophy tab → our-philosophy.html');
  }
  const dd = [...d.querySelectorAll('.nav__dropdown a')].map(a => a.textContent.trim());
  ok(JSON.stringify(dd) === JSON.stringify(['Portal Home', 'City of Hope Atlanta', 'RMH (Ronald McDonald House in Atlanta)',
     'Northside NICU', 'Senior Living', 'Schools & Global', 'Wheat Mission Atlanta (Milal)']),
     'Community Portal dropdown: Portal Home + the six portal communities');
  const ddHrefs = [...d.querySelectorAll('.nav__dropdown a')].map(a => a.getAttribute('href'));
  ok(ddHrefs[1] === 'community/city-of-hope.html' && ddHrefs[6] === 'community/milal.html',
     'dropdown links point into the Community Portal');

  /* hero — must orient a QR-code visitor with no prior context */
  const h1 = d.querySelector('h1');
  ok(h1 && h1.textContent.trim() === 'WE ARE WITH YOU', 'hero h1 is the brand name, plainly');
  ok(d.body.textContent.includes('Students using music, learning, and service to support their communities.'),
     'hero lede: students + music/learning/service');
  ok(d.body.textContent.includes('501(c)(3)') && d.body.textContent.includes('founded in 2022'),
     'hero + About GYCO carry real facts (501(c)(3), founded 2022)');
  ok(d.body.textContent.includes('suggested by two students, Jueon (Aaron) Kim and Yeoeun (Kate) Kim'),
     'homepage intro credits Aaron and Kate with suggesting WAWY (not founding)');
  ok(d.body.textContent.includes('first student-led initiative'),
     'homepage frames WAWY as GYCO\'s first student-led initiative');
  ok(d.body.textContent.includes('scanned a QR code from one of our materials'),
     'hero explains why a QR-code visitor is here');
  ok(d.body.textContent.includes('not meant to end when a performance or visit is over'),
     'hero explains the continuity idea');
  const slogan = d.querySelector('.home-hero__slogan');
  ok(slogan && slogan.textContent.trim() === 'Even Here. Even Now. WE ARE WITH YOU.',
     'hero carries the brand line as its own beat');
  const heroBtns = [...d.querySelectorAll('.home-hero .btn')].map(b => [b.textContent.trim(), b.getAttribute('href')]);
  ok(heroBtns.some(([t, h]) => t === 'Visit the Community Portal' && h === 'community/index.html'),
     'hero primary CTA: Visit the Community Portal → community/index.html');
  ok(heroBtns.some(([t, h]) => t === 'See our work' && h === 'media.html'), 'hero CTA: See our work → media.html');
  ok(d.querySelector('.home-hero .caption').textContent.includes('Scan, reconnect'),
     'portal CTA carries the "scan, reconnect" support line');
  ok(!d.querySelector('.home-hero input') && !d.querySelector('.home-hero form'),
     'homepage does not feel like a login page (no forms in the hero)');
  ok(!d.querySelector('.home-hero .photo-figure'), 'hero stays text-tight — no hero photo');

  /* brochure previews — section 2, portrait, replaceable */
  const brochures = [...d.querySelectorAll('[data-brochures] .brochure')];
  ok(d.body.textContent.includes('Take WE ARE WITH YOU With You'), 'brochure section heading present');
  ok(d.body.textContent.includes('materials you may have received during one of our visits'),
     'brochure section explains the printed materials');
  ok(brochures.length === 2, 'exactly two brochure preview slots');
  ok(brochures.every(b => b.querySelector('img') && b.querySelector('.brochure__fallback')),
     'each brochure slot has an image + labeled fallback');
  ok(brochures.every(b => (b.getAttribute('href') || '').startsWith('assets/images/brochure-')),
     'each brochure links to its full-size file (config-driven paths)');
  const brochureAlts = brochures.map(b => b.querySelector('img').getAttribute('alt') || '');
  ok(brochureAlts[0].includes('You are invited') && brochureAlts[0].includes('QR code'),
     'brochure 1 alt describes the invitation front (You are invited · QR code)');
  ok(brochureAlts[1].includes('This Is For You') && brochureAlts[1].includes('support WAWY'),
     'brochure 2 alt describes the new back (This Is For You · support WAWY)');
  ok(['assets/images/brochure-1.jpg', 'assets/images/brochure-2.jpg'].every(f => fs.existsSync(path.join(ROOT, f))),
     'both real brochure images exist on disk');
  {
    // missing file → slot degrades to a clean labeled placeholder, link disarmed
    const img = brochures[0].querySelector('img');
    dom.window.__bimg = img;
    dom.window.eval(`(function(){ ${img.getAttribute('onerror')} }).call(__bimg)`);
    ok(brochures[0].classList.contains('brochure--missing') && !brochures[0].hasAttribute('href'),
       'missing brochure file → placeholder shows, dead link disarmed');
  }

  /* community logo strip — merged into the brochure section, all six partners */
  const strip = [...d.querySelectorAll('[data-community-logos] .logo-strip__item')];
  ok(!d.body.textContent.includes('Where You May Have Met Us'),
     'strip carries no extra heading/intro — the six communities speak for themselves');
  ok(strip.length === 6, 'logo strip shows all six communities');
  const stripHrefs = strip.map(a => a.getAttribute('href'));
  ok(JSON.stringify(stripHrefs) === JSON.stringify([
    'partner.html?p=cancer-care', 'partner.html?p=ronald-mcdonald-house', 'partner.html?p=nicu',
    'partner.html?p=senior-living', 'partner.html?p=schools-global', 'partner.html?p=disability',
  ]), 'every strip item links to its partner page, in the agreed order');
  const stripNames = strip.map(a => a.querySelector('.logo-strip__name').textContent.trim());
  ok(JSON.stringify(stripNames) === JSON.stringify([
    'City of Hope Atlanta', 'RMH (Ronald McDonald House in Atlanta)', 'Northside NICU',
    'Senior Living', 'Schools & Global', 'Wheat Mission Atlanta (Milal)',
  ]), 'strip names match the six major communities');
  ok(strip.every(a => a.querySelector('.logo-chip img')), 'every strip item has a logo (with monogram fallback)');
  ok(strip.every(a => a.querySelector('.logo-strip__line').textContent.trim().length > 0),
     'every strip item has a short identifying line');
  {
    const aside = d.querySelector('.home-hero .home-hero__aside');
    ok(!!aside, 'hero right column exists — no dead space beside the intro');
    ok(aside.querySelector('[data-brochures]') && aside.querySelector('[data-community-logos]'),
       'brochures + six communities sit in the hero, beside the intro text');
    const kids = [...aside.children];
    ok(kids.findIndex(k => k.hasAttribute('data-brochures')) < kids.findIndex(k => k.hasAttribute('data-community-logos')),
       'brochures come first, communities directly beneath');
    ok(aside.getAttribute('aria-label') && aside.tagName === 'ASIDE', 'hero rail is a labeled <aside>');
  }

  /* what we do */
  const pillars = [...d.querySelectorAll('.pillar h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(pillars) === JSON.stringify(['Perform', 'Write', 'Teach', 'Serve']), 'What We Do: Perform / Write / Teach / Serve');

  /* recent work */
  const duoImgs = [...d.querySelectorAll('.photo-duo img')].map(i => i.getAttribute('src'));
  ok(duoImgs.length === 2 && duoImgs[0] !== duoImgs[1], 'Recent Work: two different real photos, unequal layout');
  ok(duoImgs.every(src => fs.existsSync(path.join(ROOT, src))), 'Recent Work photos exist on disk');
  const duoCaps = [...d.querySelectorAll('.photo-duo figcaption')].map(c => c.textContent);
  ok(duoCaps.some(c => c.includes('Ronald McDonald House')) && duoCaps.some(c => c.includes('City of Hope Atlanta')),
     'Recent Work captions name the real partners');

  /* the one large community poster (replaced the six-slide carousel) */
  const poster = d.querySelector('[data-home-poster] .photo-figure--poster img');
  ok(!!poster, 'the one large community poster renders from SITE.home.poster');
  ok(poster.getAttribute('src') === 'assets/images/home-poster.png', 'poster src is the replaceable config path');
  ok(fs.existsSync(path.join(ROOT, 'assets/images/home-poster.png')), 'poster image exists on disk');
  ok(poster.alt.length > 40, 'poster has genuinely descriptive alt text');
  ok(d.querySelector('[data-home-poster] figcaption').textContent.includes('poster'), 'poster carries a factual caption');
  ok(d.body.textContent.includes('On the Wall Where We Visit'), 'poster section ties the printed poster to the portal');

  /* the old carousel is completely gone */
  ok(!d.querySelector('.carousel') && !d.querySelector('[data-carousel]'), 'no carousel markup remains on the homepage');
  ok(!d.querySelector('.carousel__arrow') && !d.querySelector('.carousel__dot'), 'no orphaned carousel arrows or dots');
  {
    const siteJs = fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf8');
    ok(!/initCarousels|data-carousel|carousel__/.test(siteJs), 'js/site.js carries no carousel engine');
    ok(!/\.carousel/.test(fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8')), 'css/style.css carries no carousel styles');
    ok(!/SITE\.home\.carousel|carousel:/.test(fs.readFileSync(path.join(ROOT, 'js/config.js'), 'utf8')), 'js/config.js no longer defines carousel data');
  }

  /* NADO School excluded for now — no homepage section, no mention */
  ok(!d.body.textContent.includes('NADO School'),
     'homepage has no NADO School section or mention (excluded for now)');
  ok(!d.querySelector('a[href="learning.html"]') && !d.querySelector('a[href="join.html"]'),
     'homepage links to neither learning.html nor join.html');

  /* about GYCO — real history + photo placeholder */
  ok(d.body.textContent.includes('Friends of Refugees') && d.body.textContent.includes('100 care packages'),
     'About GYCO cites real service history');
  {
    const aboutFig = [...d.querySelectorAll('.photo-figure img')].find(i => i.getAttribute('src').includes('about-gyco-group'));
    ok(aboutFig && fs.existsSync(path.join(ROOT, aboutFig.getAttribute('src'))),
       'About GYCO photo (RMH Atlanta group) exists on disk');
    ok((aboutFig.getAttribute('alt') || '').length > 15, 'About GYCO photo has descriptive alt text');
    ok(!d.querySelector('.photo-placeholder'), 'homepage has no photo placeholders left');
  }

  /* final CTA */
  ok(d.body.textContent.includes('Even Here. Even Now.'), 'final CTA uses the primary brand line');
  const ctas = [...d.querySelectorAll('.section--dark .btn')].map(b => [b.textContent.trim(), b.getAttribute('href')]);
  ok(ctas.some(([t, h]) => t === 'Contact us' && h === 'contact.html'),
     'final CTA: Contact us (Get involved removed with Join Us)');

  /* structure discipline */
  const secs = [...d.querySelectorAll('main > section')];
  ok(secs.length === 6, `homepage has exactly 6 sections (found ${secs.length})`);
  ok(d.querySelectorAll('.eyebrow').length === 0, 'homepage has zero eyebrow labels');
  ok(!d.querySelector('.cards'), 'homepage has no card grids');
  ok(!d.querySelector('main svg'), 'homepage has no diagram SVGs (photos carry the page)');
  {
    /* the poster section sits right after the hero, above What We Do */
    const idxOf = (t) => secs.findIndex(s => (s.querySelector('h2') || {}).textContent === t);
    ok(idxOf('On the Wall Where We Visit') === 1 && idxOf('On the Wall Where We Visit') < idxOf('What We Do'),
       'On the Wall Where We Visit comes right after the hero/brochures, above What We Do');
  }
  {
    /* GYCO (the parent organization) closes the page before the final CTA */
    const idxOf = (t) => secs.findIndex(s => (s.querySelector('h2') || {}).textContent === t);
    ok(idxOf('About GYCO') >= 0 && idxOf('About GYCO') === secs.length - 2,
       'About GYCO is the last content section before the final CTA');
  }

  /* footer */
  const footAbout = [...d.querySelectorAll('.footer__col')].find(c => c.querySelector('h4').textContent === 'About');
  ok(footAbout && footAbout.textContent.includes('GYCO') && footAbout.textContent.includes('Media'), 'footer About column present');
  ok(!footAbout.textContent.includes('NADO School') && !footAbout.textContent.includes('Get Involved'),
     'footer About column has no NADO School or Get Involved link (excluded for now)');
  ok(!footAbout.textContent.includes('Platform'), 'footer no longer says "Platform"');
  const footComms = [...d.querySelectorAll('.footer__col')].find(c => c.querySelector('h4').textContent === 'Communities');
  ok(footComms && footComms.textContent.includes('Wheat Mission Atlanta (Milal)'), 'footer Communities column shows the Wheat Mission Atlanta (Milal) name');
  const footConnect = [...d.querySelectorAll('.footer__col')].find(c => c.textContent.includes('Connect'));
  ok(!footConnect.textContent.includes('YouTube'), 'footer Connect column has no YouTube link');
}

/* ── 2. PROGRAMS PAGE → COMMUNITY PORTAL REDIRECT ── */
console.log('\n[programs.html]');
{
  const html = fs.readFileSync(path.join(ROOT, 'programs.html'), 'utf8');
  ok(html.includes('http-equiv="refresh"') && html.includes('community/index.html'),
     'programs.html redirects into the Community Portal');
  for (const slug of ['cancer-care', 'ronald-mcdonald-house', 'nicu', 'senior-living', 'disability', 'schools-global']) {
    ok(html.includes(`partner.html?p=${slug}`), `programs stub keeps a fallback link to partner "${slug}" (QR codes safe)`);
  }
}

/* ── 3. PARTNER PAGES (all six slugs) ── */
console.log('\n[partner.html?p=…]');
for (const [slug, expectName, expectLogo] of [
  ['cancer-care', 'City of Hope Atlanta (CTCA)', 'assets/logos/city-of-hope-atlanta.png'],
  ['ronald-mcdonald-house', 'RMH (Ronald McDonald House in Atlanta)', 'assets/logos/ronald-mcdonald-house.png'],
  ['nicu', 'Northside Intensive Care Unit (NICU)', 'assets/logos/northside-nicu.png'],
  ['senior-living', 'Senior Living', 'assets/logos/senior-living.png'],
  ['disability', 'Wheat Mission Atlanta (Milal)', 'assets/logos/milal.png'],
  ['schools-global', 'Schools & Global Communities', 'assets/logos/schools-global.png'],
]) {
  const dom = loadPage('partner.html', `https://x.test/partner.html?p=${slug}`);
  const d = dom.window.document;
  ok(d.title === `${expectName} — WE ARE WITH YOU`, `?p=${slug} → title "${expectName}"`);
  const heroLogo = d.querySelector('.page-hero .logo-chip img');
  ok(heroLogo && heroLogo.getAttribute('src') === expectLogo, `?p=${slug} hero shows logo ${expectLogo}`);
  ok(fs.existsSync(path.join(ROOT, expectLogo)), `?p=${slug} logo file exists on disk (${expectLogo})`);
  ok(d.querySelectorAll('#partner-root .card').length >= 6, `?p=${slug} renders its 6 program cards`);
  const firstCard = d.querySelector('#partner-root .card h3');
  ok(firstCard && firstCard.textContent.trim() === 'One Message for You', `?p=${slug} first card is "One Message for You"`);
  ok(!d.querySelector('#partner-root .eyebrow'), `?p=${slug} has no eyebrow labels`);
  ok(d.querySelector('#partner-root .caption').textContent.includes('QR code'), `?p=${slug} explains QR access in one plain line`);
}
{
  const dom = loadPage('partner.html', 'https://x.test/partner.html?p=bogus');
  const d = dom.window.document;
  ok(d.querySelectorAll('#partner-root .index-item').length === 6, 'bad slug fallback lists all 6 communities');
}

/* ── 3b. ONE MESSAGE FOR YOU ── */
console.log('\n[one-message-for-you.html]');
{
  const dom = loadPage('one-message-for-you.html', 'https://x.test/one-message-for-you.html');
  const d = dom.window.document;
  ok(d.title === 'One Message for You | WE ARE WITH YOU', 'OMFY page title');
  ok(d.querySelector('.page-hero h1').textContent.trim() === 'One Message for You', 'OMFY hero is the program name, plainly');
  ok(d.querySelector('.page-hero .page-hero__sub').textContent.includes('difficult time'), 'OMFY one-line description');
  const steps = [...d.querySelectorAll('.steps--3 .step h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(steps) === JSON.stringify(['Write', 'Review', 'Delivered']), 'OMFY: three plain steps');
  ok(d.querySelector('[data-home-invitation] img'), 'the real "You are invited" card renders from config');
  ok([...d.querySelectorAll('[data-form="letterSubmission"]')].every(a => a.getAttribute('href').includes('1FAIpQLScPFE6ckE10oraG')),
     'OMFY letter buttons wired to the letter Google Form');
}

/* ── 3c. FORM WIRING (config.js → data-form buttons) ── */
console.log('\n[form wiring]');
{
  const dom = loadPage('contact.html', 'https://x.test/contact.html');
  const d = dom.window.document;
  const byKey = k => d.querySelector(`[data-form="${k}"]`);
  for (const [key, frag] of [
    ['studentApplication', '1FAIpQLSfsiV5lgetCfyIkVz79'],
    ['songRequest', '1FAIpQLSfIU7OKX5MHNmsAZHqbc'],
    ['letterSubmission', '1FAIpQLScPFE6ckE10oraG'],
  ]) {
    const a = byKey(key);
    ok(a && a.getAttribute('href').includes(frag), `${key} button links to its Google Form`);
    ok(a && a.target === '_blank' && a.rel === 'noopener', `${key} opens in a new tab with noopener`);
  }
  for (const key of ['partnerInquiry', 'hopeCapsule', 'teachingVideoRequest']) {
    const a = byKey(key);
    ok(a && !a.hasAttribute('href') && a.getAttribute('aria-disabled') === 'true' && a.classList.contains('btn--disabled'), `${key} form in progress → button disabled`);
    ok(a && a.nextElementSibling && a.nextElementSibling.classList.contains('form-soon') && /Coming soon/.test(a.nextElementSibling.textContent), `${key} shows a "coming soon" note`);
  }
  ok(d.querySelector('.page-hero h1').textContent.trim() === 'How Can We Help?', 'contact hero: How Can We Help?');
  ok(d.querySelectorAll('.index-item').length === 6, 'contact page: six request rows');
  {
    // partner pages re-wire dynamically rendered cards the same way
    const pdom = loadPage('partner.html', 'https://x.test/partner.html?p=senior-living');
    const pd = pdom.window.document;
    const hc = pd.querySelector('#partner-root [data-form="hopeCapsule"]');
    ok(hc && hc.getAttribute('aria-disabled') === 'true' && hc.nextElementSibling.classList.contains('form-soon'), 'partner page Hope Capsule button disabled with note (form in progress)');
    const ls = pd.querySelector('#partner-root [data-form="letterSubmission"]');
    ok(ls && ls.getAttribute('href').includes('1FAIpQLScPFE6ckE10oraG') && ls.target === '_blank', 'partner page letter button still live');
  }
}

/* ── 3d. HOPE CAPSULE ── */
console.log('\n[hope-capsule.html]');
{
  const dom = loadPage('hope-capsule.html', 'https://x.test/hope-capsule.html');
  const d = dom.window.document;
  ok(d.title === 'Hope Capsule | WE ARE WITH YOU', 'Hope Capsule page title');
  ok(d.querySelector('.page-hero h1').textContent.trim() === 'Hope Capsule', 'Hope Capsule hero renders');
  ok(d.querySelector('.page-hero .page-hero__sub').textContent.trim() === 'A digital collection created for a specific community.',
     'Hope Capsule described concretely in one line');
  const steps = [...d.querySelectorAll('.steps--3 .step h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(steps) === JSON.stringify(['Gathered', 'Assembled', 'Shared']), 'Hope Capsule: three plain steps');
  const ph = d.querySelector('.photo-placeholder');
  ok(ph && ph.textContent.includes('real Hope Capsule'), 'placeholder asks for a real capsule screenshot');
}

/* ── 4. GYCO PAGE ── */
console.log('\n[student-community.html]');
{
  const dom = loadPage('student-community.html', 'https://x.test/student-community.html');
  const d = dom.window.document;
  ok(d.title.startsWith('GYCO'), 'title leads with GYCO');
  ok(d.querySelector('h1').textContent.trim() === 'GYCO', 'hero h1 is simply GYCO');
  ok(d.body.textContent.includes('founded in 2022') && d.body.textContent.includes('May 2023') &&
     d.body.textContent.includes('501(c)(3)'), 'About states real facts (founded 2022, 501(c)(3) May 2023)');
  ok(!d.body.textContent.includes('Jueon') && !d.body.textContent.includes('Yeoeun'),
     'About GYCO does not name individual founders');
  ok(d.body.textContent.includes('two students and an educator'),
     'About GYCO credits two students and an educator, unnamed');
  ok(d.body.textContent.includes('more than 70 performances'), 'About cites the 70+ performances figure');
  ok(d.body.textContent.includes('Learn well, Give well'), 'the Learn well, Give well idea is present');
  ok(!d.body.textContent.includes('Learn Well. Share Well.'), 'the old Share Well phrasing is fully retired');

  /* About GYCO — condensed by default, Read More reveals the rest */
  const aboutBtn = d.querySelector('[aria-controls="about-more"]');
  const aboutMore = d.querySelector('#about-more');
  ok(aboutBtn && aboutBtn.tagName === 'BUTTON' && aboutBtn.getAttribute('aria-expanded') === 'false',
     'About: semantic Read More button, collapsed by default');
  ok(aboutMore && aboutMore.getAttribute('aria-hidden') === 'true' && !aboutMore.classList.contains('open'),
     'About: expanded copy hidden accessibly by default');
  ok(aboutMore.textContent.includes('WE ARE WITH YOU (WAWY)'), 'About expanded copy names WAWY (in the HTML for SEO)');
  ok(aboutMore.textContent.includes('proposed and developed by student founders Aaron and Kate'),
     'About WAWY credits student founders Aaron and Kate');
  ok(aboutMore.textContent.includes('QR-based connections') && aboutMore.textContent.includes('hospice communities'),
     'About WAWY describes QR-based connections and who it reaches');
  aboutBtn.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(aboutBtn.getAttribute('aria-expanded') === 'true' && aboutMore.classList.contains('open') &&
     aboutMore.getAttribute('aria-hidden') === 'false', 'About: Read More expands with correct ARIA state');
  ok(aboutBtn.textContent.includes('Show Less'), 'About: button flips to Show Less when open');
  aboutBtn.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(aboutBtn.getAttribute('aria-expanded') === 'false' && !aboutMore.classList.contains('open'),
     'About: Show Less collapses again');

  /* real service history — combined into Our Work Through the Years, near the top */
  const secs = [...d.querySelectorAll('main > section')];
  const workIdx = secs.findIndex(s => s.textContent.includes('Our Work Through the Years'));
  ok(workIdx >= 0 && workIdx <= 2, 'Our Work Through the Years appears in the first three sections');
  ok(!d.body.textContent.includes('Where GYCO Has Served'),
     'served list merged into the archive section (no separate heading)');
  ok(secs[workIdx].querySelector('.check-list') && secs[workIdx].querySelector('[data-archive]'),
     'one combined section: served list + the year archive');
  for (const item of ['City of Hope Atlanta (CTCA)', 'Ronald McDonald House', 'Friends of Refugees', '100 care packages', 'Wheat Mission Atlanta (Milal)']) {
    ok(d.body.textContent.includes(item), `served list includes "${item}"`);
  }

  /* Our Programs — five areas, each independently expandable */
  const programs = [...d.querySelectorAll('.program')];
  ok(programs.length === 5, 'Our Programs lists exactly five programs');
  ok(JSON.stringify(programs.map(p => p.querySelector('.program__no').textContent)) ===
     JSON.stringify(['01', '02', '03', '04', '05']), 'programs numbered 01–05');
  ok(JSON.stringify(programs.map(p => p.querySelector('h3').textContent)) ===
     JSON.stringify(['Performance', 'Education', 'Research', 'Press', 'GYCO Chapters']),
     'program names: Performance / Education / Research / Press / GYCO Chapters');
  ok(JSON.stringify(programs.map(p => p.querySelector('.program__verb').textContent)) ===
     JSON.stringify(['Perform', 'Educate', 'Research', 'Connect', 'Lead']),
     'action words: Perform / Educate / Research / Connect / Lead');
  ok(d.body.textContent.includes('Some are officially recognized school clubs'),
     'GYCO Chapters: new copy — school clubs and student-led groups');
  ok(d.body.textContent.includes('participate in GYCO projects, create its own projects'),
     'GYCO Chapters: chapters participate in GYCO projects and create their own');
  ok(programs.every(p => p.querySelector('button.read-more[aria-expanded="false"]') && p.querySelector('.more[aria-hidden="true"]')),
     'every program collapsed by default with a semantic Read More button');
  ok(d.body.textContent.includes('sharing the same GYCO philosophy'),
     'expanded program copy lives in the HTML (SEO-visible)');
  {
    // independence: opening one program leaves the others closed
    const b1 = programs[0].querySelector('button.read-more');
    b1.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
    ok(programs[0].querySelector('.more').classList.contains('open') &&
       !programs[1].querySelector('.more').classList.contains('open'),
       'programs expand independently — opening one leaves the rest closed');
    b1.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  }

  /* How GYCO Works — always visible, built to scan */
  const gycoSteps = [...d.querySelectorAll('.steps--5 .step h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(gycoSteps) === JSON.stringify(['LEARN', 'SHARE', 'OBSERVE', 'CREATE', 'LEAD']),
     'How GYCO Works: LEARN / SHARE / OBSERVE / CREATE / LEAD, never hidden');
  ok([...d.querySelectorAll('.steps--5 .step p')].every(p => p.textContent.trim().length > 10),
     'each step carries its one-line description');
  ok(!d.querySelector('.steps--5 ~ .more') && !secs.find(s => s.querySelector('.steps--5')).querySelector('.read-more'),
     'How GYCO Works has no Read More — fully visible');

  ok(!d.querySelector('.cards'), 'GYCO page has no card grids');
  /* photos are real files */
  const imgs = [...d.querySelectorAll('.photo-figure img')].map(i => i.getAttribute('src'));
  ok(imgs.length >= 1 && imgs.every(src => fs.existsSync(path.join(ROOT, src))), 'GYCO page photos exist on disk');
  ok([...d.querySelectorAll('.photo-figure img')].every(i => i.alt && i.alt.length > 10), 'GYCO photos have descriptive alt text');
  ok(d.body.textContent.includes('A WE begins with two people'), 'the one quiet quote is kept');
  ok(d.querySelectorAll('.eyebrow').length === 0, 'GYCO page has zero eyebrow labels');
  const join = d.querySelector('[data-form="studentApplication"]');
  ok(join && join.getAttribute('href').includes('1FAIpQLSfsiV5lgetCfyIkVz79'), 'Join GYCO wired to the student application form');
  const philLink = [...d.querySelectorAll('main a')].find(a => a.getAttribute('href') === 'our-philosophy.html');
  ok(!!philLink, 'GYCO page links to Our Philosophy in prose (teaser, not a duplicate essay)');

  /* ── the archive: real community photo collections ── */
  ok(d.body.textContent.includes('Our Work Through the Years'), 'archive section: Our Work Through the Years');
  const arch = d.querySelector('[data-archive]');
  ok(!!arch, 'archive mount present and hydrated');
  ok(arch.querySelectorAll('.archive-year').length === 0,
     'year tabs stay hidden while entries span a single year (appear automatically later)');
  ok(arch.querySelectorAll('.archive-card').length === 6, 'page 1 shows 6 community cards');
  ok(arch.querySelector('.archive-count').textContent.includes('Showing 1–6 of 7'), 'count line: Showing 1–6 of 7');
  ok(arch.querySelector('.archive-pager__status').textContent.trim() === 'Page 1 of 2', 'pager reads Page 1 of 2');
  const cardTitles = [...arch.querySelectorAll('.archive-card__title')].map(t => t.textContent);
  ok(cardTitles[0] === 'City of Hope Atlanta (CTCA)', 'City of Hope leads the collections');
  ok(cardTitles.includes('Ronald McDonald House Charities of Atlanta') && cardTitles.includes('Veterans'),
     'community collections match the served list');
  ok([...arch.querySelectorAll('.archive-card__date')].every(t => !/20\d\d/.test(t.textContent)),
     'community cards show no dates at all — only the category label');
  ok(arch.querySelectorAll('.archive-card__media img').length === 6, 'every community card leads with a real photo');

  /* pagination */
  arch.querySelector('[data-page-next]').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(arch.querySelectorAll('.archive-card').length === 1, 'Next → page 2 shows the remaining collection');
  ok(arch.querySelector('.archive-count').textContent.includes('Showing 7–7 of 7'), 'page 2 count line: Showing 7–7 of 7');
  ok(arch.querySelector('.archive-card__title').textContent.includes('Homelessness'),
     'the homelessness outreach collection closes the list');
  arch.querySelector('[data-page-prev]').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(arch.querySelectorAll('.archive-card').length === 6, 'Previous returns to page 1');

  /* detail view */
  const firstCard = arch.querySelector('.archive-card');
  firstCard.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  const detail = arch.querySelector('.archive-detail');
  ok(!!detail, 'clicking a card opens the collection detail view');
  ok(detail.querySelector('h3').textContent === 'City of Hope Atlanta (CTCA)', 'detail heading matches the card');
  ok(detail.querySelector('.archive-detail__meta').textContent.includes('Cancer care community') &&
     !/20\d\d/.test(detail.querySelector('.archive-detail__meta').textContent),
     'detail meta names the community with no date mentioned');
  ok(detail.querySelectorAll('.archive-detail__gallery .photo-figure img').length === 10,
     'City of Hope detail shows its full 10-photo gallery');
  detail.querySelector('[data-archive-back]').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(arch.querySelectorAll('.archive-card').length === 6, 'Back returns to the grid');

  /* data-driven; every photo is a real file with real alt text */
  const archSrc = fs.readFileSync(path.join(ROOT, 'js/archive.js'), 'utf8');
  ok(/const GYCO_ARCHIVE\s*=\s*\[/.test(archSrc), 'archive data lives in js/archive.js as a plain array');
  ok(!/Placeholder/.test(archSrc), 'no sample placeholder entries remain — the archive is real content now');
  const archImgSrcs = [...archSrc.matchAll(/src: "([^"]+)"/g)].map(m => m[1]);
  ok(archImgSrcs.length >= 45, `archive holds a real photo library (${archImgSrcs.length} photos)`);
  ok(archImgSrcs.every(s => fs.existsSync(path.join(ROOT, s))), 'every archive photo exists on disk');
  const archAlts = [...archSrc.matchAll(/alt: "([^"]+)"/g)].map(m => m[1]);
  ok(archAlts.length === archImgSrcs.length && archAlts.every(a => a.length > 15),
     'every archive photo has descriptive alt text');
  const gycoHtml = fs.readFileSync(path.join(ROOT, 'student-community.html'), 'utf8');
  ok(gycoHtml.includes('js/archive.js') && gycoHtml.includes('js/archive-ui.js'),
     'GYCO page loads the archive data + renderer');
  ok(!/archive-card|archive-year/.test(gycoHtml), 'no archive entries hardcoded into the HTML');
}

/* ── 4b. ARCHIVE MECHANISM (synthetic multi-year data) ── */
console.log('\n[archive mechanism]');
{
  const SYNTH = `const GYCO_ARCHIVE = [${[...Array(8)].map((_, i) => `
    { date: "2026-0${8 - i}-01", title: "Event ${i + 1}", partner: "P", description: "D", images: [], category: "Performance" },`).join('')}
    { date: "2025-06-01", title: "Old Event A", partner: "P", description: "D", images: [] },
    { date: "2025-03-01", title: "Old Event B", partner: "P", description: "D", images: [] },
  ];`;
  const html = fs.readFileSync(path.join(ROOT, 'student-community.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'https://x.test/student-community.html', runScripts: 'outside-only' });
  dom.window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  const bundle = ['js/config.js', 'js/partners.js', 'js/site.js']
    .map(js => fs.readFileSync(path.join(ROOT, js), 'utf8')).join('\n;\n')
    + '\n;\n' + SYNTH + '\n;\n' + fs.readFileSync(path.join(ROOT, 'js/archive-ui.js'), 'utf8');
  dom.window.eval(bundle);
  const d = dom.window.document;
  const arch = d.querySelector('[data-archive]');
  const tabs = [...arch.querySelectorAll('.archive-year')].map(b => b.textContent);
  ok(JSON.stringify(tabs) === JSON.stringify(['2026', '2025']), 'multi-year data → year tabs appear, newest first');
  ok(arch.querySelector('.archive-year[aria-pressed="true"]').textContent === '2026', 'newest year selected by default');
  ok(arch.querySelectorAll('.archive-card').length === 6 &&
     arch.querySelector('.archive-pager__status').textContent.trim() === 'Page 1 of 2',
     '8 events in 2026 → 6 per page + pager');
  ok(arch.querySelector('.archive-card__media--empty'), 'events without photos get a clean placeholder block');
  [...arch.querySelectorAll('.archive-year')].find(b => b.textContent === '2025')
    .dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(arch.querySelector('.archive-year[aria-pressed="true"]').textContent === '2025' &&
     arch.querySelectorAll('.archive-card').length === 2 && !arch.querySelector('.archive-pager'),
     'switching years filters the grid and drops the pager when it fits');
  arch.querySelector('.archive-card').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  arch.querySelector('[data-archive-back]').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(arch.querySelector('.archive-year[aria-pressed="true"]').textContent === '2025',
     'detail → Back returns to the same year');
}

/* ── 5. NADO SCHOOL + JOIN US — EXCLUDED FOR NOW ── */
console.log('\n[learning.html + join.html — excluded]');
{
  /* Both pages are redirect stubs; the full pages are preserved in
     context/excluded/ (see RESTORE.md there to bring them back). */
  const learning = fs.readFileSync(path.join(ROOT, 'learning.html'), 'utf8');
  ok(learning.includes('http-equiv="refresh"') && learning.includes('index.html'),
     'learning.html is a redirect stub → homepage (NADO School excluded for now)');
  ok(learning.includes('noindex'), 'learning stub is noindex');
  const join = fs.readFileSync(path.join(ROOT, 'join.html'), 'utf8');
  ok(join.includes('http-equiv="refresh"') && join.includes('contact.html'),
     'join.html is a redirect stub → contact (Join Us excluded for now)');
  ok(join.includes('noindex'), 'join stub is noindex');
  for (const f of ['context/excluded/learning-nado-school.html', 'context/excluded/join-us.html',
                   'context/excluded/homepage-nado-section.html', 'context/excluded/fragments.html',
                   'context/excluded/RESTORE.md']) {
    ok(fs.existsSync(path.join(ROOT, f)), `excluded content preserved: ${f}`);
  }
  ok(fs.readFileSync(path.join(ROOT, 'context/excluded/learning-nado-school.html'), 'utf8').includes('NADO School'),
     'saved NADO School page still carries its content');
  /* No public page or engine still links to the excluded pages. */
  const live = [...PUBLIC_PAGES, 'js/config.js', 'js/site.js', 'js/partners.js', 'js/portal/portal-core.js'];
  for (const f of live) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    ok(!src.includes('learning.html') && !/href="join\.html"|join\.html"\)/.test(src),
       `${f} does not link to excluded pages`);
  }
}

/* ── 3b. SCHOOLS & GLOBAL — CLCL + HYCS ── */
console.log('\n[schools-global partners]');
{
  const psrc = fs.readFileSync(path.join(ROOT, 'js/partners.js'), 'utf8');
  ok(psrc.includes('CLCL (Chisomo Leadership Centre Limited)') &&
     psrc.includes('HYCS (Harvester Yeshua Christian School Inc.)'),
     'Schools & Global names its partner schools: CLCL and HYCS');
  ok(psrc.includes('Harvester Yeshua Christian School Inc. (HYCS) logo'),
     'schools-global logo alt names HYCS (temporary logo)');
  const csrc = fs.readFileSync(path.join(ROOT, 'js/config.js'), 'utf8');
  ok(csrc.includes('CLCL, HYCS, and partner schools'),
     'homepage strip line mentions CLCL and HYCS');
}

/* ── 6. MEDIA PAGE ── */
console.log('\n[media.html]');
{
  const dom = loadPage('media.html', 'https://x.test/media.html');
  const d = dom.window.document;
  ok(d.querySelector('.page-hero h1').textContent.trim() === 'Media', 'hero h1 is simply Media');
  const card = d.querySelector('.press-card');
  ok(!!card, 'featured press card rendered');
  ok(d.querySelectorAll('.press-card').length === 1, 'ONE bilingual card, not two separate articles');
  ok(card.textContent.includes('Music of Hope: GYCO Brings Comfort and Connection to the Community'), 'article title correct');
  ok(card.textContent.includes('Newswave25'), 'publisher shown');
  ok(!card.querySelector('.chip'), 'press card has no badge chips');
  const links = [...card.querySelectorAll('a')];
  ok(links.length === 2 && links[0].textContent === 'Read in English' && links[1].textContent === 'Read in Korean', 'exactly two buttons: EN + KR');
  ok(links[0].href === 'https://newswave25.com/music-of-hope-gyco-brings-healing-to-the-community', 'English URL exact');
  ok(links[1].href.includes('newswave25.com/%EB%B3%91%EC%9B%90'), 'Korean URL exact (encoded)');
  ok(links.every(l => l.target === '_blank' && l.rel === 'noopener'), 'both links open safely in new tab');

  /* galleries */
  const galleryImgs = [...d.querySelectorAll('.media-grid .media-item img')];
  const count = pre => galleryImgs.filter(i => i.getAttribute('src').includes(pre)).length;
  ok(count('media-performances-') === 3, 'Performances gallery has 3 real photos');
  ok(count('media-outreach-') === 3, 'Community visits gallery has 3 real photos');
  ok(count('media-teaching-') === 3, 'Student teaching gallery has 3 real photos');
  ok(count('media-wawy-cityofhope-') === 3, 'City of Hope gallery has 3 real photos');
  ok(count('media-wawy-rmh-') === 7, 'Ronald McDonald House gallery has 7 real photos');

  const mainSections = [...d.querySelectorAll('main > section')];
  ok(mainSections[0].classList.contains('page-hero'), 'page hero is the first section');
  const recentSec = mainSections[1];
  ok(recentSec.querySelector('.eyebrow')?.textContent.trim() === 'Most recent', 'archive keeps its one navigational label: "Most recent"');
  ok(recentSec.querySelectorAll('img[src*="media-wawy-"]').length === 10, 'Most recent section holds all 10 WAWY photos');
  ok(d.querySelectorAll('.eyebrow').length === 1, 'media page has exactly one eyebrow (the archive date label)');
  ok(galleryImgs.every(i => i.alt && i.alt.length > 10), 'every gallery photo has descriptive alt text');
  ok(galleryImgs.every(i => i.getAttribute('loading') === 'lazy'), 'gallery photos lazy-load');
  for (const img of galleryImgs) {
    const src = img.getAttribute('src');
    ok(fs.existsSync(path.join(ROOT, src)), `image file exists on disk: ${src}`);
  }
  ok(!d.body.innerHTML.includes('YouTube'), 'media page has no YouTube link or button (no channel yet)');
}

/* ── 6b. NO YOUTUBE ANYWHERE (no channel yet) ── */
console.log('\n[no-YouTube sweep]');
{
  const dom = loadPage('contact.html', 'https://x.test/contact.html');
  ok(!dom.window.document.body.innerHTML.includes('YouTube'), 'contact page has no YouTube row');
  const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  const offenders = pages.filter(f => /youtube/i.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
  ok(offenders.length === 0, `no .html file references YouTube (${offenders.join(', ') || 'clean'})`);
  ok(!/SITE\.youtube/.test(fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf8')), 'js/site.js does not render a YouTube link');
}

/* ── 7. LOGO FALLBACK BEHAVIOR ── */
console.log('\n[logo fallback]');
{
  const dom = loadPage('index.html', 'https://x.test/index.html');
  const d = dom.window.document;
  const chips = [...d.querySelectorAll('[data-community-logos] .logo-chip')];
  const senior = chips.find(c => c.querySelector('img').src.includes('senior-living'));
  const img = senior.querySelector('img');
  dom.window.__img = img;
  dom.window.eval(`(function(){ ${img.getAttribute('onerror')} }).call(__img)`);
  ok(senior.classList.contains('logo-chip--missing') && !senior.querySelector('img'),
     'missing logo file → chip swaps to monogram fallback, row stays clean');
  ok(senior.querySelector('.logo-chip__fallback').textContent === 'SL', 'Senior Living monogram = "SL"');
}

/* ── 8. OUR PHILOSOPHY PAGE (condensed) ── */
console.log('\n[our-philosophy.html]');
{
  const dom = loadPage('our-philosophy.html', 'https://x.test/our-philosophy.html');
  const d = dom.window.document;
  ok(d.querySelector('.page-hero h1').textContent.trim() === 'Our Philosophy', 'philosophy page hero');
  ok(d.querySelector('.nado-we-figure svg'), 'NADO + NADO = WE figure kept (told once)');
  ok(d.body.textContent.includes('나도'), 'NADO explained from the Korean');
  for (const part of ['GYCO', 'WE ARE WITH YOU']) {
    ok(d.body.textContent.includes(part), `two parts named: ${part}`);
  }
  ok(!d.body.textContent.includes('NADO School'),
     'philosophy keeps the NADO idea but no NADO School program mention (excluded for now)');
  ok(d.body.textContent.includes('Two Parts, One Practice'), 'parts section reframed as two parts');
  ok([...d.querySelectorAll('.flow')].some(f => f.querySelectorAll('.flow__item').length === 8), 'the concrete 8-step encouragement flow kept');
  ok(!d.body.textContent.includes('One Shared Template'), 'platform-model language gone');
  ok(!d.body.textContent.includes('consistency defines'), 'design-system language gone');
  ok(!d.querySelector('.tri-circle') && !d.querySelector('.eco-loop'), 'diagram overload removed');
  /* the continuity idea — the heart of WE ARE WITH YOU — is stated */
  ok(d.body.textContent.includes("The Visit Ends. The Connection Doesn't."),
     'continuity section: the visit ends, the connection does not');
  ok(d.body.textContent.includes('build relationships, not just count volunteer hours'),
     'service framed as relationships, not hours');
  ok(d.body.textContent.includes('every generation can participate, not only receive'),
     'participation across generations, not one-way help');
  ok(d.body.textContent.includes('even here, even now, we are with you'),
     'closes on the brand line in its warm lowercase form');
  const secs = [...d.querySelectorAll('main > section')];
  ok(secs.length === 8, `philosophy page stays compact: 8 sections (found ${secs.length})`);
  const foot = [...d.querySelectorAll('.footer__col a')].map(a => a.getAttribute('href'));
  ok(foot.includes('our-philosophy.html'), 'footer links to Our Philosophy site-wide');
}

/* ── 9. WORD BUDGETS (keep the public site compact) ── */
console.log('\n[word budgets]');
{
  const visibleWords = file => {
    let h = fs.readFileSync(path.join(ROOT, file), 'utf8');
    h = h.replace(/<script[\s\S]*?<\/script>/gi, ' ')
         .replace(/<style[\s\S]*?<\/style>/gi, ' ')
         .replace(/<!--[\s\S]*?-->/g, ' ')
         .replace(/<[^>]+>/g, ' ');
    return h.split(/\s+/).filter(Boolean).length;
  };
  for (const [file, cap] of [
    ['index.html', 640],              // raised Aug 2026: QR-visitor intro + brochure/poster sections
    ['student-community.html', 1150], // raised Aug 2026: About/Programs expanded copy stays in the
                                      // HTML for SEO but is collapsed behind Read More by default
    ['media.html', 420],
    ['hope-capsule.html', 300],
    ['one-message-for-you.html', 260],
    ['contact.html', 350],
    ['our-philosophy.html', 900],     // raised Aug 2026: continuity section
  ]) {
    const n = visibleWords(file);
    ok(n <= cap, `${file} stays compact: ${n} words (budget ${cap})`);
  }
}

/* ── 10. REDESIGN GUARDRAILS — the AI-template patterns stay dead ── */
console.log('\n[redesign guardrails]');
{
  /* Phrases that must never reappear on the public site (raw HTML +
     the two content data files). These are the patterns the Aug 2026
     redesign removed: internal design-system language, slogan stacking,
     and template constructions. */
  const BANNED = [
    'One Philosophy', 'One Loop. One Community', 'One Shared Template',
    'One Platform. One Message', 'consistency defines', 'platform model',
    'The heart of the platform', 'Find Your Place in the Circle',
    'Every Ending Becomes', 'ending becomes another beginning',
    'Watch the Circle in Motion', 'From Ideas to Impact',
    'Every Great Work Begins', 'meaningful, lasting impact',
    'transformative', 'ecosystem', 'empower',
  ];
  const sources = [...PUBLIC_PAGES, 'js/config.js', 'js/partners.js', 'js/site.js', 'js/archive.js', 'js/archive-ui.js'];
  for (const phrase of BANNED) {
    const hits = sources.filter(f => {
      try { return fs.readFileSync(path.join(ROOT, f), 'utf8').toLowerCase().includes(phrase.toLowerCase()); }
      catch (e) { return false; }
    });
    ok(hits.length === 0, `banned phrase absent: "${phrase}"${hits.length ? ' — found in ' + hits.join(', ') : ''}`);
  }

  /* Eyebrow budget: at most 1 per public page (media's archive label). */
  for (const f of PUBLIC_PAGES) {
    const n = (fs.readFileSync(path.join(ROOT, f), 'utf8').match(/class="eyebrow/g) || []).length;
    ok(n <= 1, `${f}: at most one eyebrow label (found ${n})`);
  }

  /* Every photo placeholder must say specifically what image is needed. */
  for (const f of PUBLIC_PAGES) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const blocks = html.match(/photo-placeholder[\s\S]*?<\/figure>/g) || [];
    for (const b of blocks) {
      ok(/<p>[\s\S]{60,}<\/p>/.test(b), `${f}: placeholder describes the needed photo in detail`);
    }
  }
}

/* ── 11. REDIRECT STUBS + SLUG INTEGRITY ── */
console.log('\n[redirect stubs & slugs]');
{
  const stubs = {
    'about.html': 'index.html',
    'gyco.html': 'student-community.html',
    'about-gyco.html': 'about.html',
    'beat-and-breeze.html': 'learning.html#programs',
    'taps-of-love.html': 'learning.html#programs',
    'voices-of-love.html': 'partner.html?p=cancer-care',
    'we-are-with-you.html': 'programs.html',
    'winds-of-love.html': 'media.html',
    /* excluded for now — full pages saved in context/excluded/ */
    'learning.html': 'index.html',
    'join.html': 'contact.html',
  };
  for (const [file, target] of Object.entries(stubs)) {
    let html = '';
    try { html = fs.readFileSync(path.join(ROOT, file), 'utf8'); } catch (e) {}
    ok(html.includes('http-equiv="refresh"') && html.includes(target), `${file} stub intact → ${target}`);
  }
  const partnersSrc = fs.readFileSync(path.join(ROOT, 'js/partners.js'), 'utf8');
  for (const slug of ['cancer-care', 'ronald-mcdonald-house', 'nicu', 'senior-living', 'disability', 'schools-global']) {
    ok(partnersSrc.includes(`"${slug}"`), `partner slug "${slug}" unchanged (QR codes safe)`);
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
