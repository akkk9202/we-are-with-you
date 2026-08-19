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
  'our-philosophy.html', 'partner.html', '404.html',
  'fundraising/index.html', 'fundraising/video-request.html'];
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
     'Senior Living', 'Schools & Global', 'Wheat Mission Atlanta (Milal)']),
     'Community Portal dropdown: Portal Home + the five portal communities');
  const ddHrefs = [...d.querySelectorAll('.nav__dropdown a')].map(a => a.getAttribute('href'));
  ok(ddHrefs[1] === 'community/city-of-hope.html' && ddHrefs[5] === 'community/milal.html',
     'dropdown links point into the Community Portal');

  /* hero — must orient a QR-code visitor with no prior context */
  const h1 = d.querySelector('h1');
  ok(h1 && h1.textContent.trim() === 'WE ARE WITH YOU', 'hero h1 is the brand name, plainly');
  ok(d.body.textContent.includes('Students using music, learning, and service to support their communities.'),
     'hero lede: students + music/learning/service');
  ok(d.body.textContent.includes('501(c)(3)') && d.body.textContent.includes('founded in 2022'),
     'hero + About GYCO carry real facts (501(c)(3), founded 2022)');
  ok(d.body.textContent.includes('proposed and developed by student founders Jueon (Aaron) Kim and Yeoeun (Kate) Kim'),
     'homepage intro credits student founders Aaron and Kate with proposing and developing WAWY');
  ok(d.body.textContent.includes('first student-centered platform'),
     'homepage frames WAWY as GYCO\'s first student-centered platform');
  ok(d.body.textContent.includes('website and QR-based connections'),
     'hero explains why a QR-code visitor is here');
  ok(d.body.textContent.includes('not meant to end when a performance, visit, or activity is over'),
     'hero explains the continuity idea');
  const slogan = d.querySelector('.home-hero__slogan');
  ok(slogan && slogan.textContent.trim() === 'Even Here, Even Now, WE ARE WITH YOU.',
     'hero carries the brand line as its own beat (comma form, per the Aug 13 copy)');
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

  /* community logo strip — merged into the brochure section, all five partners */
  const strip = [...d.querySelectorAll('[data-community-logos] .logo-strip__item')];
  ok(!d.body.textContent.includes('Where You May Have Met Us'),
     'strip carries no extra heading/intro — the five communities speak for themselves');
  ok(strip.length === 5, 'logo strip shows all five communities');
  const stripHrefs = strip.map(a => a.getAttribute('href'));
  ok(JSON.stringify(stripHrefs) === JSON.stringify([
    'partner.html?p=cancer-care', 'partner.html?p=ronald-mcdonald-house',
    'partner.html?p=senior-living', 'partner.html?p=schools-global', 'partner.html?p=disability',
  ]), 'every strip item links to its partner page, in the agreed order');
  const stripNames = strip.map(a => a.querySelector('.logo-strip__name').textContent.trim());
  ok(JSON.stringify(stripNames) === JSON.stringify([
    'City of Hope Atlanta', 'RMH (Ronald McDonald House in Atlanta)',
    'Senior Living', 'Schools & Global', 'Wheat Mission Atlanta (Milal)',
  ]), 'strip names match the five major communities');
  ok(strip.every(a => a.querySelector('.logo-chip img')), 'every strip item has a logo (with monogram fallback)');
  ok(strip.every(a => a.querySelector('.logo-strip__line').textContent.trim().length > 0),
     'every strip item has a short identifying line');
  {
    const aside = d.querySelector('.home-hero .home-hero__aside');
    ok(!!aside, 'hero right column exists — no dead space beside the intro');
    ok(aside.querySelector('[data-brochures]') && aside.querySelector('[data-community-logos]'),
       'brochures + five communities sit in the hero, beside the intro text');
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

  /* support teaser — points to the Support Us page (Aaron's copy, Aug 2026) */
  {
    const teaser = d.querySelector('#support-wawy');
    ok(!!teaser, 'homepage carries the #support-wawy teaser band');
    ok((teaser.querySelector('h2') || {}).textContent === 'Looking to Support W.A.W.Y?',
       'teaser heading: Looking to Support W.A.W.Y?');
    ok(teaser.textContent.includes('Your support helps us continue student-led community programs, performances, and outreach.'),
       'teaser body sentence 1 verbatim');
    ok(teaser.textContent.includes('As a small expression of our gratitude, we may send supporters a W.A.W.Y message card or a short musical thank-you video created by our students.'),
       'teaser gratitude sentence verbatim (card / musical thank-you video)');
    const tBtn = teaser.querySelector('.btn');
    ok(tBtn && tBtn.textContent.trim() === 'Visit our Support Us page' &&
       tBtn.getAttribute('href') === 'fundraising/index.html',
       'teaser CTA: Visit our Support Us page → fundraising/index.html');
    ok(!teaser.classList.contains('section--mist') && !teaser.classList.contains('section--dark'),
       'teaser band is white — breaks the two mist bands before the dark CTA');
    ok(!/\$|price|buy|purchase|cart/i.test(teaser.textContent), 'teaser has no commercial phrasing');
  }

  /* structure discipline */
  const secs = [...d.querySelectorAll('main > section')];
  ok(secs.length === 7, `homepage has exactly 7 sections (found ${secs.length})`);
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
    /* GYCO (the parent organization), then the support teaser, close the page */
    const idxOf = (t) => secs.findIndex(s => (s.querySelector('h2') || {}).textContent === t);
    ok(idxOf('About GYCO') >= 0 && idxOf('About GYCO') === secs.length - 3,
       'About GYCO sits just above the support teaser');
    ok(secs[secs.length - 2].id === 'support-wawy',
       'the support teaser is the last content section before the final CTA');
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
  {
    const yt = [...footConnect.querySelectorAll('a')].find(a => a.textContent.trim() === 'YouTube');
    ok(yt && yt.getAttribute('href') === 'https://youtube.com/@gyco_wawy' &&
       yt.target === '_blank' && yt.rel === 'noopener',
       'footer Connect column links the GYCO YouTube channel (new tab, noopener)');
  }
}

/* ── 2. PROGRAMS PAGE → COMMUNITY PORTAL REDIRECT ── */
console.log('\n[programs.html]');
{
  const html = fs.readFileSync(path.join(ROOT, 'programs.html'), 'utf8');
  ok(html.includes('http-equiv="refresh"') && html.includes('community/index.html'),
     'programs.html redirects into the Community Portal');
  for (const slug of ['cancer-care', 'ronald-mcdonald-house', 'senior-living', 'disability', 'schools-global']) {
    ok(html.includes(`partner.html?p=${slug}`), `programs stub keeps a fallback link to partner "${slug}" (QR codes safe)`);
  }
}

/* ── 3. PARTNER PAGES (all five slugs) ── */
console.log('\n[partner.html?p=…]');
for (const [slug, expectName, expectLogo] of [
  ['cancer-care', 'City of Hope Atlanta (CTCA)', 'assets/logos/city-of-hope-atlanta.png'],
  ['ronald-mcdonald-house', 'RMH (Ronald McDonald House in Atlanta)', 'assets/logos/ronald-mcdonald-house.png'],
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
  ok(d.querySelectorAll('#partner-root .index-item').length === 5, 'bad slug fallback lists all 5 communities');
}
{
  /* partner.html?p=nicu — the printed-QR slug for the removed NICU page —
     must land on the same graceful chooser, never a broken page. */
  const dom = loadPage('partner.html', 'https://x.test/partner.html?p=nicu');
  const d = dom.window.document;
  ok(d.querySelectorAll('#partner-root .index-item').length === 5 &&
     !/NICU|Northside/i.test(d.body.textContent),
     '?p=nicu (removed community, old QR codes) falls back to the community chooser with no NICU mention');
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
  /* The request rows left the contact page (Aug 2026 — it's now the support
     page), so wiring is asserted where the request buttons actually live. */
  const dom = loadPage('student-community.html', 'https://x.test/student-community.html');
  const d = dom.window.document;
  const join = d.querySelector('[data-form="studentApplication"]');
  ok(join && join.getAttribute('href').includes('1FAIpQLSfsiV5lgetCfyIkVz79'),
     'GYCO page Join button links to the student application Google Form');
  ok(join && join.target === '_blank' && join.rel === 'noopener', 'studentApplication opens in a new tab with noopener');
  {
    // partner pages wire dynamically rendered cards the same way
    const pdom = loadPage('partner.html', 'https://x.test/partner.html?p=senior-living');
    const pd = pdom.window.document;
    const hc = pd.querySelector('#partner-root [data-form="hopeCapsule"]');
    ok(hc && hc.getAttribute('aria-disabled') === 'true' && hc.nextElementSibling.classList.contains('form-soon'), 'partner page Hope Capsule button disabled with note (form in progress)');
    const ls = pd.querySelector('#partner-root [data-form="letterSubmission"]');
    ok(ls && ls.getAttribute('href').includes('1FAIpQLScPFE6ckE10oraG') && ls.target === '_blank', 'partner page letter button still live');
    const sr = pd.querySelector('#partner-root [data-form="songRequest"]');
    ok(sr && sr.getAttribute('href').includes('1FAIpQLSfIU7OKX5MHNmsAZHqbc') && sr.target === '_blank', 'partner page song request button still live');
  }
  {
    // contact page: the six request buttons are gone, nothing dangles
    const cd = loadPage('contact.html', 'https://x.test/contact.html').window.document;
    ok(cd.querySelectorAll('.index-item').length === 0, 'contact page carries no request rows anymore');
    ok(['studentApplication', 'songRequest', 'letterSubmission', 'teachingVideoRequest', 'hopeCapsule', 'partnerInquiry']
       .every(k => !cd.querySelector(`[data-form="${k}"]`)), 'no request form buttons remain on the contact page');
    ok(cd.querySelector('.page-hero h1').textContent.trim() === 'How Can We Help?', 'contact hero: How Can We Help?');
  }
}

/* ── 3c2. SUPPORT THE WORK (contact page, added Aug 2026) ── */
console.log('\n[support the work]');
{
  // Bundle + the page's inline script in one eval scope (SITE/safeUrl are
  // lexical there, not on window) — same pattern as the YouTube wiring test.
  const html = fs.readFileSync(path.join(ROOT, 'contact.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'https://x.test/contact.html', runScripts: 'outside-only' });
  const w = dom.window, d = w.document;
  w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  const bundle = ['js/config.js', 'js/partners.js', 'js/site.js']
    .map(js => fs.readFileSync(path.join(ROOT, js), 'utf8')).join('\n;\n');
  const inline = [...d.querySelectorAll('script:not([src])')].map(s => s.textContent).join(';\n');

  /* Page flow: hero → info band → support (mist) → community partners
     (white) → CTA band. Give to WAWY moved to the Support Us page (Aug 15). */
  const sections = [...d.querySelectorAll('main > section')];
  ok(sections.length === 5, `contact page has five bands (found ${sections.length})`);
  ok(sections.findIndex(s => s.id === 'support') === 2 &&
     sections.findIndex(s => s.id === 'community') === 3,
     'band order: support → community partners');
  ok(!d.getElementById('give') && ![...d.querySelectorAll('h2')].some(h => /Give to WAWY/.test(h.textContent)),
     'no Give to WAWY band here anymore — it lives on the Support Us page');
  ok(d.querySelector('#support').classList.contains('section--mist'),
     'support section uses the mist band');
  ok(d.querySelector('#support .section-head h2').textContent.trim() === 'Support the Work',
     'the section is headed "Support the Work"');
  ok(/be part of what GYCO students are building/.test(d.querySelector('#support .section-head p').textContent),
     'support intro frames help beyond donating money');

  /* Six quiet cards, exact titles. */
  const titles = [...d.querySelectorAll('#support .cards .card h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(titles) === JSON.stringify(['Support a Student Project', 'Donate Materials',
    'Sponsor a Program or Event', 'Share Your Skills', 'Connect Us With a Community', 'Spread the Word']),
    'six support cards in order');

  /* Wire everything, then check the mailto fallback. */
  w.eval(bundle + '\n;\n' + inline);
  for (const [key, subject] of [
    ['supportProject', 'Supporting a student project'],
    ['materialsDonation', 'Donating materials'],
    ['sponsorInquiry', 'Sponsorship inquiry'],
    ['skillShare', 'Sharing my skills with GYCO'],
    ['communityConnection', 'Connecting GYCO with a community'],
    ['generalSupport', 'Supporting GYCO'],
  ]) {
    const a = d.querySelector(`[data-form="${key}"]`);
    ok(a && a.getAttribute('href') === 'mailto:gyco23@gmail.com?subject=' + encodeURIComponent(subject),
       `${key}: no form yet → live mailto with subject "${subject}"`);
    ok(a && !a.classList.contains('btn--disabled') && !a.hasAttribute('aria-disabled') &&
       !(a.nextElementSibling && a.nextElementSibling.classList.contains('form-soon')),
       `${key}: never shows as disabled/coming-soon (email fallback works today)`);
  }

  /* Paste a real Google Form URL into config later → button switches over.
     (SITE is lexical inside the eval scope, so the flip runs in a second
     load whose eval string ends by rewiring the button.) */
  {
    const dom2 = new JSDOM(html, { url: 'https://x.test/contact.html', runScripts: 'outside-only' });
    dom2.window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
    dom2.window.eval(bundle + '\n;\n' + inline + `
      ;SITE.forms.supportProject = 'https://docs.google.com/forms/d/e/TESTSWITCH/viewform';
      const btn = document.querySelector('[data-form="supportProject"]');
      btn.removeAttribute('href'); wireFormButton(btn);`);
    const sw = dom2.window.document.querySelector('[data-form="supportProject"]');
    ok(sw.getAttribute('href').includes('TESTSWITCH') && sw.target === '_blank' && sw.rel === 'noopener',
       'pasting a form URL into config.js flips a support button from mailto to the form');
  }

  /* Spread the Word: real social links only, from config, via safeUrl. */
  const ig = d.querySelector('#support-instagram'), yt = d.querySelector('#support-youtube');
  ok(ig && !ig.hidden && ig.href === 'https://instagram.com/gyco_opus' &&
     ig.target === '_blank' && ig.rel === 'noopener', 'Spread the Word: Instagram button live (new tab, noopener)');
  ok(yt && !yt.hidden && yt.href === 'https://youtube.com/@gyco_wawy' &&
     yt.target === '_blank' && yt.rel === 'noopener', 'Spread the Word: YouTube button live (new tab, noopener)');

  /* Community Partners (rendered from partners.js by the eval). */
  ok(d.querySelector('#community .section-head h2').textContent.trim() === 'Community Partners',
     'community section headed "Community Partners"');
  ok(!d.querySelector('#supporter-logos') && !/Community Supporters/.test(d.body.textContent),
     'no Community Supporters block (removed — none exist yet)');
  const chips = [...d.querySelectorAll('#partner-logos a')];
  ok(chips.length === 5 && chips.every(a => /^partner\.html\?p=/.test(a.getAttribute('href'))),
     'partner row renders all five community logos, each linking to its partner page');
  ok(chips.some(a => a.querySelector('img') && a.querySelector('img').getAttribute('src') === 'assets/logos/schools-global.png'),
     'partner row includes the Schools & Global globe mark');

  /* Pointer to the Support Us page + closing callout end the support band. */
  const more = d.querySelector('#support .give-more a');
  ok(more && more.getAttribute('href') === 'fundraising/index.html' &&
     /Support Us page/.test(d.querySelector('#support .give-more').textContent),
     'support band points donors to the Support Us page');
  const co = d.querySelector('#support .support-callout');
  ok(co && co.querySelector('h3').textContent.trim() === 'Have another idea?',
     'the "Have another idea?" callout closes the support band');
  ok(co && co.querySelector('[data-form="generalSupport"]').textContent.trim() === 'Contact GYCO',
     'callout button says Contact GYCO and reaches the inbox');

  /* No invented URLs anywhere on the page. */
  const hrefs = [...d.querySelectorAll('a[href]')].map(a => a.getAttribute('href'));
  ok(hrefs.every(h => !/REPLACE_ME|example\.com|forms\.gle\/x+/i.test(h)), 'no fake or placeholder URLs in the rendered page');
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
  ok(aboutMore.textContent.includes('How can we still be with them when we cannot be there in person?'),
     'About WAWY carries the founding question');
  ok(aboutMore.textContent.includes('beyond a single visit or performance'),
     'About WAWY explains extending connections beyond a single visit or performance');
  aboutBtn.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(aboutBtn.getAttribute('aria-expanded') === 'true' && aboutMore.classList.contains('open') &&
     aboutMore.getAttribute('aria-hidden') === 'false', 'About: Read More expands with correct ARIA state');
  ok(aboutBtn.textContent.includes('Show Less'), 'About: button flips to Show Less when open');
  aboutBtn.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(aboutBtn.getAttribute('aria-expanded') === 'false' && !aboutMore.classList.contains('open'),
     'About: Show Less collapses again');

  /* Our Impact — 2023 to Present (stat band inside the About section) */
  const impact = d.querySelector('.impact');
  ok(!!impact && impact.closest('section') === aboutBtn.closest('section'),
     'Our Impact lives inside the About GYCO section (archive stays near the top)');
  ok(impact.querySelector('.impact__title').textContent.includes('Our Impact — 2023 to Present'),
     'Impact heading: Our Impact — 2023 to Present');
  const impactItems = [...impact.querySelectorAll('.impact__item')];
  ok(impactItems.length === 8, `Impact lists exactly 8 figures (found ${impactItems.length})`);
  const nums = impactItems.map(i => (i.querySelector('.impact__num') || {}).textContent || '');
  ok(JSON.stringify(nums.slice(0, 6)) === JSON.stringify(['70+', '4,000+', '100', '44', '4', '200+']),
     'Impact numbers: 70+ / 4,000+ / 100 / 44 / 4 / 200+');
  const labels = impactItems.map(i => i.querySelector('.impact__label').textContent);
  ok(labels[0] === 'Performances' && labels[1] === 'People Reached' && labels[5] === 'WAWY Messages Shared',
     'Impact labels name what each figure counts');
  ok(labels[6] === 'Community & Global Outreach' && labels[7] === 'Student-Led Research',
     'Impact closes with outreach + research entries (no number — none claimed)');
  ok(impact.textContent.includes('Malawi'), 'global outreach names Malawi');
  ok(impact.textContent.includes('Journal of Emerging Investigators (JEI)') &&
     impact.textContent.includes('nearly 100 participants'),
     'research entry cites JEI review + ~100 participants');
  ok(impactItems[7].classList.contains('impact__item--wide') && impactItems[7].querySelectorAll('dd').length === 2,
     'research entry spans the grid with its two paragraphs');
  ok(impactItems.every(i => i.querySelector('dt') && i.querySelector('dd')),
     'every impact figure is a dt/dd pair (label + description)');

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

  /* How GYCO Works — the L.O.O.P., always visible, built to scan */
  const gycoSteps = [...d.querySelectorAll('.steps--loop .step h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(gycoSteps) === JSON.stringify(['L — LEARN', 'O — OWN', 'O — OFFER', 'P — PROGRESS']),
     'How GYCO Works: the four L.O.O.P. steps (Learn / Own / Offer / Progress), never hidden');
  ok(!d.querySelector('.steps--5') && !/steps--5/.test(fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8')),
     'the old five-step layout is fully retired (markup + CSS)');
  ok([...d.querySelectorAll('.steps--loop .step p')].every(p => p.textContent.trim().length > 10),
     'each step carries its one-line description');
  ok(!d.querySelector('.steps--loop ~ .more') && !secs.find(s => s.querySelector('.steps--loop')).querySelector('.read-more'),
     'How GYCO Works has no Read More — fully visible');

  /* Our Story — five milestones, year-rail timeline, after How GYCO Works */
  const story = d.querySelector('#our-story .story');
  ok(!!story, 'Our Story timeline present');
  const storyYears = [...story.querySelectorAll('.story__year')].map(y => y.textContent.trim());
  ok(JSON.stringify(storyYears) === JSON.stringify(['2022', '2023 – Summer 2024', '2024–2025', 'Late 2025', '2026']),
     'Our Story: five milestones from 2022 to 2026');
  const storyTitles = [...story.querySelectorAll('h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(storyTitles) === JSON.stringify(['Where It Began', 'Learning Through Service',
     'A Question Became an Idea', 'From Idea to Practice', 'WE ARE WITH YOU']),
     'Our Story milestone titles match the provided copy');
  ok(story.textContent.includes('How can we stay connected even when we cannot be there in person?'),
     'Our Story carries the founding question');
  ok(story.textContent.includes('developed by Aaron and Kate') &&
     story.textContent.includes('beyond distance and time'),
     'Our Story credits Aaron and Kate (first names only) and lands on the WAWY promise');
  ok(secs.indexOf(d.querySelector('#our-story')) === secs.indexOf(secs.find(s => s.querySelector('.steps--loop'))) + 1,
     'Our Story sits right after How GYCO Works, before the closing quote');
  ok(story.tagName === 'OL' && [...story.children].every(li => li.tagName === 'LI'),
     'Our Story is an ordered list (chronology is semantic)');

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
  ok(psrc.includes('Globe mark for Schools & Global Communities'),
     'schools-global logo alt is the generic globe mark');
  ok(!psrc.includes('(HYCS) logo'),
     'no single school\'s logo stands for Schools & Global anymore');
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
  ok(!d.querySelector('main').innerHTML.includes('YouTube'),
     'media page content has no YouTube section (the channel link lives in the footer + contact)');
}

/* ── 6b. YOUTUBE CHANNEL (config-driven, added Aug 2026) ── */
console.log('\n[YouTube wiring]');
{
  // like loadPage, but the page's inline social-row script runs in the same
  // eval scope as the bundle (SITE/safeUrl are lexical there, not on window)
  const html = fs.readFileSync(path.join(ROOT, 'contact.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'https://x.test/contact.html', runScripts: 'outside-only' });
  const d = dom.window.document;
  dom.window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  const bundle = ['js/config.js', 'js/partners.js', 'js/site.js']
    .map(js => fs.readFileSync(path.join(ROOT, js), 'utf8')).join('\n;\n');
  const inline = [...d.querySelectorAll('script:not([src])')].map(s => s.textContent).join(';\n');
  dom.window.eval(bundle + '\n;\n' + inline);
  const row = d.querySelector('#contact-youtube');
  ok(row && !row.hidden, 'contact page shows the YouTube row (SITE.youtube is set)');
  const a = row.querySelector('a');
  ok(a && a.getAttribute('href') === 'https://youtube.com/@gyco_wawy' &&
     a.target === '_blank' && a.rel === 'noopener',
     'contact YouTube row links @gyco_wawy (new tab, noopener, via safeUrl)');
  ok(a && a.textContent === '@gyco_wawy',
     'YouTube row link text is the @handle, not the word "YouTube" (reads as a live link)');
  const igRow = d.querySelector('#contact-instagram'), igA = igRow && igRow.querySelector('a');
  ok(igRow && !igRow.hidden && igA && igA.textContent === '@gyco_opus' &&
     igA.getAttribute('href') === 'https://instagram.com/gyco_opus',
     'Instagram row shows @gyco_opus as the link text (derived from the config URL)');
  const cssSrc = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8');
  ok(/\.contact-detail a \{[^}]*text-decoration: underline/.test(cssSrc) &&
     /\.contact-detail a\[target="_blank"\]::after \{[^}]*↗/.test(cssSrc),
     'contact detail links carry underline + external ↗ affordance in CSS');
  ok(/SITE\.youtube/.test(fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf8')) &&
     /safeUrl\(SITE\.youtube\)/.test(fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf8')),
     'js/site.js renders the footer YouTube link through safeUrl');
  ok(/SITE\.youtube/.test(fs.readFileSync(path.join(ROOT, 'js/portal/portal-core.js'), 'utf8')),
     'portal footer offers the same conditional YouTube link');
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
    ['student-community.html', 1420], // raised Aug 2026: About/Programs expanded copy stays in the
                                      // HTML for SEO but is collapsed behind Read More by default;
                                      // Aug 13: + the "Our Impact — 2023 to Present" stat band
                                      // and the five-milestone "Our Story" timeline
    ['media.html', 420],
    ['hope-capsule.html', 300],
    ['one-message-for-you.html', 260],
    ['contact.html', 380],            // Aug 2026: the support page — Support the
                                      // Work cards + Community Partners +
                                      // Give to WAWY + callout
    ['our-philosophy.html', 900],     // raised Aug 2026: continuity section
    ['fundraising/index.html', 320],  // Aug 2026: cards + personalized videos
    ['fundraising/video-request.html', 320], // form labels/hints + privacy note
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
  for (const slug of ['cancer-care', 'ronald-mcdonald-house', 'senior-living', 'disability', 'schools-global']) {
    ok(partnersSrc.includes(`"${slug}"`), `partner slug "${slug}" unchanged (QR codes safe)`);
  }
}

/* ── 11b. NORTHSIDE NICU — removed (Aug 19 2026, no active partnership) ── */
console.log('\n[northside NICU — removed]');
{
  /* Removed everywhere (site, portal, seed). Saved in context/excluded/ —
     see RESTORE.md there. Old QR/links degrade gracefully (tested above). */
  const stub = fs.readFileSync(path.join(ROOT, 'community/northside-nicu.html'), 'utf8');
  ok(stub.includes('http-equiv="refresh"') && stub.includes('communities.html'),
     'community/northside-nicu.html is a redirect stub → the Communities chooser');
  ok(!fs.existsSync(path.join(ROOT, 'assets/logos/northside-nicu.png')),
     'NICU logo removed from assets/logos/ (saved copy in context/excluded/)');
  for (const saved of ['nicu-partner-block.js', 'northside-nicu-portal-page.html',
                       'nicu-fragments.html', 'northside-nicu-logo.png']) {
    ok(fs.existsSync(path.join(ROOT, 'context/excluded', saved)),
       `removed NICU content saved (context/excluded/${saved})`);
  }
  for (const src of ['js/partners.js', 'js/config.js', 'js/portal/portal-config.js',
                     'test/preview-fixtures.json', 'supabase/setup.sql']) {
    ok(!/nicu|northside/i.test(fs.readFileSync(path.join(ROOT, src), 'utf8')),
       `${src} carries no NICU/Northside reference`);
  }
  for (const file of PUBLIC_PAGES) {
    ok(!/NICU|Northside/i.test(fs.readFileSync(path.join(ROOT, file), 'utf8')),
       `${file} carries no NICU/Northside mention`);
  }
}

/* ── 12. FUNDRAISING — cards + personalized videos (v10, Aug 2026) ── */
/* Pages in fundraising/ load site.js as "../js/site.js", so nav, footer,
   and config-driven images must all be REL-prefixed. Their inline
   scripts reference SITE lexically, so they run inside the same eval
   as the bundle (same trap as the contact/YouTube blocks). `setup`
   is injected AFTER config.js but BEFORE site.js, to simulate values
   pasted into the config (form URLs flip at wireForms time). */
function loadSub(file, url, setup = '') {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const dom = new JSDOM(html, { url, runScripts: 'outside-only' });
  const w = dom.window;
  w.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; }
    observe() {} unobserve() {} disconnect() {}
  };
  const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n;\n');
  const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
  w.eval([read('js/config.js'), read('js/partners.js'), setup,
          read('js/site.js'), inline].join('\n;\n'));
  return dom;
}

console.log('\n[fundraising/index.html]');
{
  const dom = loadSub('fundraising/index.html', 'https://x.test/fundraising/index.html');
  const d = dom.window.document;
  const text = d.body.textContent;

  /* nav + footer from one folder down: every internal link REL-prefixed */
  ok(d.querySelector('.nav__logo').getAttribute('href') === '../index.html',
     'nav brand links up to ../index.html');
  const fundTab = [...d.querySelectorAll('.nav__links > li > a')].find(a => a.textContent.trim() === 'Support Us');
  ok(fundTab && fundTab.getAttribute('href') === '../fundraising/index.html' && fundTab.classList.contains('active'),
     '"Support Us" nav tab exists, is REL-prefixed, and is active here');
  const contactTab = [...d.querySelectorAll('.nav__links a')].find(a => a.textContent.trim() === 'Contact');
  ok(contactTab && contactTab.getAttribute('href') === '../contact.html', 'Contact tab → ../contact.html');
  ok([...d.querySelectorAll('.nav__dropdown a')].every(a => a.getAttribute('href').startsWith('../community/')),
     'portal dropdown links climb out of the subfolder');
  ok([...d.querySelectorAll('.footer a[href*="partner.html"]')].every(a => a.getAttribute('href').startsWith('../partner.html?p=')),
     'footer partner links are REL-prefixed');

  /* hero — the required "both ways" introduction near the beginning */
  ok(d.querySelector('h1').textContent.trim() === 'Share the Care in Your Own Way',
     'hero h1 is "Share the Care in Your Own Way"');
  ok(d.querySelector('.page-hero__sub').textContent.trim() ===
     'Your support helps sustain WAWY\'s student-led programs — and each option shares a little encouragement with someone who needs it.',
     'hero sub: "Your support helps sustain…" (Aug 19 director wording — not "Everything here supports")');
  const ways = [...d.querySelectorAll('.ways .card')];
  ok(ways.length === 2, 'two ways-to-participate tiles (side by side / stacked via .cards--2)');
  ok(ways[0].querySelector('h3').textContent === 'WAWY Cards' &&
     ways[0].textContent.includes('Share encouragement through thoughtfully designed cards.'),
     'WAWY Cards tile carries its exact line');
  const exploreBtn = ways[0].querySelector('a.btn');
  ok(exploreBtn.textContent.trim() === 'Explore Card Sponsorships' && exploreBtn.getAttribute('href') === '#cards',
     '"Explore Card Sponsorships" button → #cards');
  ok(ways[1].querySelector('h3').textContent === 'Personalized Videos' &&
     ways[1].textContent.includes('Let WAWY students create a special message for someone in your life.'),
     'Personalized Videos tile carries its exact line');
  const reqBtn = ways[1].querySelector('a.btn');
  ok(reqBtn.textContent.trim() === 'Request a Video' && reqBtn.getAttribute('href') === 'video-request.html',
     '"Request a Video" button → video-request.html');

  /* card sponsorships */
  const cards = d.getElementById('cards');
  ok(cards && cards.querySelector('h2').textContent === 'WAWY Card Sponsorships',
     '#cards section: "WAWY Card Sponsorships"');
  const sponsor = cards.querySelector('[data-form="cardSponsorship"]');
  ok(sponsor && sponsor.getAttribute('href').startsWith('mailto:gyco23@gmail.com?subject='),
     'sponsor button falls back to a live mailto while the form key is a placeholder');
  const broch = [...cards.querySelectorAll('.brochure img')];
  ok(broch.length === 2 && broch.every(i => i.getAttribute('src').startsWith('../assets/images/brochure-')),
     'printed-card duo renders from config with ../ asset paths');

  /* personalized videos */
  const vids = d.getElementById('videos');
  ok(vids.querySelector('.eyebrow').textContent.trim() === 'Personalized Video Sponsorship',
     'videos eyebrow reads "Personalized Video Sponsorship" (fundraising framing, no price)');
  ok(vids.querySelector('h2').textContent.trim() === 'A Message Made for Someone Special',
     'videos h2: "A Message Made for Someone Special"');
  ok(vids.textContent.includes('Request a personalized WAWY video for someone you care about.'),
     'videos subheading present verbatim');
  ok(vids.textContent.includes('WAWY students can create a short personalized video for birthdays, celebrations, encouragement, gratitude, and other meaningful moments.') &&
     vids.textContent.includes("Your request helps us share something personal with someone you care about while supporting WAWY's broader mission."),
     'both body sentences present verbatim');
  ok(vids.textContent.includes('Support WAWY while creating a meaningful message for someone special.'),
     'the support-WAWY line leads into the CTA');

  const chips = [...vids.querySelectorAll('.occasion')];
  ok(JSON.stringify(chips.map(c => c.textContent.trim())) === JSON.stringify([
    'Happy Birthday', 'Congratulations', 'Get Well Soon', 'Thinking of You',
    'Thank You', 'Holiday Greeting', 'Encouragement', 'Custom Message']),
     'the eight occasion options, in order');
  ok(chips.every(c => c.querySelector('svg')), 'every occasion chip has its warm line icon');
  ok(chips.every(c => /^video-request\.html\?occasion=[a-z-]+$/.test(c.getAttribute('href'))),
     'every chip preselects the form via a clean ?occasion= key');
  /* every chip key must be understood by the form's whitelist */
  const formSrc = fs.readFileSync(path.join(ROOT, 'fundraising/video-request.html'), 'utf8');
  const chipKeys = chips.map(c => c.getAttribute('href').split('=')[1]);
  ok(chipKeys.every(k => formSrc.includes(`'${k}':`)),
     'every chip occasion key is in the form page\'s whitelist');

  const cta = vids.querySelector('.fund-cta a.btn');
  ok(cta.textContent.trim() === 'Request a Personalized Video' && cta.getAttribute('href') === 'video-request.html',
     '"Request a Personalized Video" CTA → the request form page');
  ok(vids.textContent.includes('delivered privately'), 'private-delivery note on the page');

  /* fundraising framing — no ecommerce/Cameo phrasing anywhere */
  ok(!/buy|price|\$|per video|add to cart|order now|shop/i.test(text),
     'no commercial phrasing: no "buy", no prices, no cart');
  /* suggested-contribution slots exist but stay hidden until priced */
  ok([...d.querySelectorAll('.fund-suggested')].length === 2 &&
     [...d.querySelectorAll('.fund-suggested')].every(el => el.hidden),
     'suggested-contribution slots exist for later, hidden while unset');
  /* …and flip on when a value is written into config */
  const dom2 = loadSub('fundraising/index.html', 'https://x.test/fundraising/index.html',
    'SITE.fundraising.videoSuggested = "Suggested contribution: $25";');
  const sugg = [...dom2.window.document.querySelectorAll('[data-fund-suggested="videoSuggested"]')][0];
  ok(!sugg.hidden && sugg.textContent === 'Suggested contribution: $25',
     'writing SITE.fundraising.videoSuggested reveals the line (UI ready for pricing later)');

  /* Give to WAWY band (moved here from contact, Aug 15) + slogan */
  const give = d.getElementById('give');
  ok(give && give.classList.contains('section--mist') &&
     give.querySelector('h2').textContent.trim() === 'Give to WAWY',
     'Give to WAWY band lives here now (mist, before the CTA band)');
  const za = d.getElementById('give-zelle-address'), zm = d.getElementById('give-zelle-memo');
  ok(za && za.textContent === 'gycodonation@gmail.com' && zm && zm.textContent === 'WAWY',
     'Zelle address and memo come from SITE.donation');
  const rawFund = fs.readFileSync(path.join(ROOT, 'fundraising/index.html'), 'utf8');
  ok(/id="give-zelle-address">gycodonation@gmail\.com</.test(rawFund) &&
     /id="give-zelle-memo">WAWY</.test(rawFund),
     'Zelle address + memo are baked into the raw HTML — the line is complete even without JS (Aug 19)');
  const rb = give.querySelector('[data-form="donationReceipt"]');
  ok(rb && rb.getAttribute('href') === 'mailto:gycodonation@gmail.com?subject=' + encodeURIComponent('Donation receipt request'),
     'receipt button: no form yet → mailto to the DONATION inbox, not the general one');
  ok(rb && !rb.classList.contains('btn--disabled') &&
     !(rb.nextElementSibling && rb.nextElementSibling.classList.contains('form-soon')),
     'receipt button never shows as disabled/coming-soon');
  ok(/Donation receipts are available/.test(give.querySelector('.give-receipt').textContent),
     'give panel says receipts are available');
  ok(d.querySelector('.cta-band h2').textContent.includes('WE ARE WITH YOU'), 'CTA band slogan present');

  /* discovery: nav config + contact page both reach the new page */
  ok(SITEsrc().includes('"Support Us"'), 'config nav includes the Support Us tab');
  const contactSrc = fs.readFileSync(path.join(ROOT, 'contact.html'), 'utf8');
  ok(contactSrc.includes('fundraising/index.html'), 'contact support band links to the Support Us page');

  function SITEsrc() { return fs.readFileSync(path.join(ROOT, 'js/config.js'), 'utf8'); }
}

console.log('\n[fundraising/video-request.html]');
{
  const URLBASE = 'https://x.test/fundraising/video-request.html';
  const dom = loadSub('fundraising/video-request.html', URLBASE);
  const d = dom.window.document;

  /* nav still active on the section; back link climbs correctly */
  const fundTab = [...d.querySelectorAll('.nav__links > li > a')].find(a => a.textContent.trim() === 'Support Us');
  ok(fundTab && fundTab.classList.contains('active'), 'Support Us tab stays active on the form page');
  ok(d.querySelector('.form-back a').getAttribute('href') === 'index.html', 'back link → the Fundraising page');

  /* the exact fields the brief asks for, with sane character limits */
  const req = (id) => d.getElementById(id).hasAttribute('required');
  const max = (id) => d.getElementById(id).getAttribute('maxlength');
  ok(req('vr-name') && max('vr-name') === '80', 'Your name: required, capped');
  ok(req('vr-email') && d.getElementById('vr-email').type === 'email', 'Your email: required, type=email');
  ok(req('vr-recipient') && max('vr-recipient') === '60', "Recipient's first name: required, capped");
  ok(!req('vr-pronunciation'), 'pronunciation is optional');
  ok(!req('vr-song') && max('vr-song') === '120', 'preferred song is optional');
  ok(!req('vr-about') && !req('vr-notes'), 'about-recipient and notes are optional');
  ok(req('vr-say') && max('vr-say') === '400', '"What would you like us to say?" required, 400 chars');
  ok(max('vr-about') === '400' && max('vr-notes') === '200', 'textareas capped so requests stay manageable');
  ok(d.getElementById('vr-date').type === 'date' && req('vr-date') &&
     /^\d{4}-\d{2}-\d{2}$/.test(d.getElementById('vr-date').min),
     'requested date: date input, required, min = today');
  const opts = [...d.querySelectorAll('#vr-occasion option')].map(o => o.textContent.trim());
  ok(JSON.stringify(opts.slice(1)) === JSON.stringify(
    ['Birthday', 'Congratulations', 'Get Well Soon', 'Thank You', 'Encouragement', 'Holiday', 'Other']),
     'occasion dropdown: the exact seven options');
  ok(req('vr-occasion'), 'occasion is required');
  const counters = [...d.querySelectorAll('.char-count')];
  ok(counters.length === 3 && counters.every(c => /^0 \/ \d+$/.test(c.textContent)),
     'live character counters on all three textareas');

  /* privacy — the exact consent sentence, required; no auto-publishing */
  const chk = d.getElementById('vr-privacy');
  ok(chk && chk.type === 'checkbox' && chk.hasAttribute('required'), 'privacy checkbox is required');
  ok(d.querySelector('label[for="vr-privacy"]').textContent.trim() ===
     'I understand that the information I provide will be used by WAWY students and organizers to prepare this requested video.',
     'privacy checkbox carries the exact consent sentence');
  const priv = d.querySelector('.form-privacy').textContent;
  ok(priv.includes('delivered privately') && priv.includes('YouTube') && priv.includes('Instagram') &&
     priv.includes('social media') && priv.includes('permission first'),
     'privacy note: private delivery, no site/YouTube/Instagram/social posting, separate permission');

  /* occasion preselect is whitelist-only */
  const pre = loadSub('fundraising/video-request.html', URLBASE + '?occasion=get-well');
  ok(pre.window.document.getElementById('vr-occasion').value === 'Get Well Soon',
     '?occasion=get-well preselects Get Well Soon');
  const evil = loadSub('fundraising/video-request.html', URLBASE + '?occasion=%3Cscript%3E');
  ok(evil.window.document.getElementById('vr-occasion').value === '' &&
     !evil.window.document.body.innerHTML.includes('%3Cscript%3E'),
     'unknown occasion values are ignored, never reflected');

  /* the built-in form emails the request — prove the composed text */
  {
    const dom3 = loadSub('fundraising/video-request.html', URLBASE);
    const d3 = dom3.window.document;
    const set = (id, val) => { d3.getElementById(id).value = val; };
    set('vr-name', 'Jane Doe'); set('vr-email', 'jane@example.com');
    set('vr-recipient', 'Sean'); set('vr-pronunciation', 'Shawn');
    d3.getElementById('vr-occasion').value = 'Birthday';
    set('vr-say', 'Happy 80th birthday, Grandpa!');
    set('vr-date', '2027-01-15');
    d3.getElementById('copy-request').click(); // jsdom has no clipboard → textarea fallback
    const composed = d3.getElementById('copy-fallback').value;
    ok(!d3.getElementById('copy-fallback').hidden && composed.startsWith('To: gyco23@gmail.com'),
       'copy fallback composes the request to the WAWY inbox');
    ok(composed.includes('Subject: Personalized video request — Birthday for Sean'),
       'composed subject names the occasion and recipient');
    ok(composed.includes('Pronunciation: Shawn') && composed.includes('Happy 80th birthday, Grandpa!') &&
       composed.includes('Requested date: 2027-01-15') && composed.includes('Preferred song: —'),
       'composed body carries every field (with — for blanks)');
    ok(composed.includes('I understand that the information I provide'),
       'composed body restates the privacy consent');
  }
  /* …and the inbox can be re-pointed from config */
  {
    const dom4 = loadSub('fundraising/video-request.html', URLBASE,
      'SITE.fundraising.videoInbox = "videos@example.org";');
    const d4 = dom4.window.document;
    d4.getElementById('copy-request').click();
    ok(d4.getElementById('copy-fallback').value.startsWith('To: videos@example.org'),
       'SITE.fundraising.videoInbox re-points where requests go');
  }

  /* config flip: paste a Google Form URL and the built-in form steps aside */
  ok(!d.getElementById('video-request-form').hidden && d.getElementById('form-live').hidden,
     'while forms.videoRequest is a placeholder, the built-in form is shown');
  {
    const dom5 = loadSub('fundraising/video-request.html', URLBASE,
      'SITE.forms.videoRequest = "https://docs.google.com/forms/d/e/TEST/viewform";');
    const d5 = dom5.window.document;
    ok(d5.getElementById('video-request-form').hidden && !d5.getElementById('form-live').hidden,
       'pasting a form URL flips the page to the Google Form panel');
    const live = d5.querySelector('#form-live a[data-form="videoRequest"]');
    ok(live.getAttribute('href') === 'https://docs.google.com/forms/d/e/TEST/viewform' &&
       live.target === '_blank' && live.rel === 'noopener',
       'the live button opens the pasted form in a new tab (noopener)');
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
