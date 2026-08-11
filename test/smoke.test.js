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
  const bundle = ['js/config.js', 'js/partners.js', 'js/site.js']
    .map(js => fs.readFileSync(path.join(ROOT, js), 'utf8')).join('\n;\n');
  w.eval(bundle);
  return dom;
}

const EXPECTED_ORDER = [
  'City of Hope Atlanta (CTCA)',
  'Ronald McDonald House',
  'Northside Intensive Care Unit (NICU)',
  'Senior Living',
  'The America Wheat Mission (Milal)',
  'Schools & Global Communities',
];

/* All public pages (portal + admin excluded — they have their own tests). */
const PUBLIC_PAGES = ['index.html', 'student-community.html', 'learning.html', 'media.html',
  'one-message-for-you.html', 'hope-capsule.html', 'join.html', 'contact.html',
  'our-philosophy.html', 'partner.html', '404.html'];

/* ── 1. HOMEPAGE ── */
console.log('\n[index.html]');
{
  const dom = loadPage('index.html', 'https://x.test/index.html');
  const d = dom.window.document;

  const brand = d.querySelector('.nav__logo');
  ok(brand && brand.textContent.trim() === 'WE ARE WITH YOU', 'nav brand is exactly "WE ARE WITH YOU"');
  ok(!brand.textContent.includes('GYCO'), 'nav brand contains no GYCO co-branding');

  const navLabels = [...d.querySelectorAll('.nav__links > li > a')].map(a => a.textContent.replace('▾', '').trim());
  ok(navLabels.includes('GYCO') && navLabels.includes('NADO School'), 'nav has GYCO and NADO School');
  ok(navLabels[0] === 'We Are With You', 'first nav tab is "We Are With You"');
  ok(navLabels.includes('Community Portal') && !navLabels.includes('Programs'),
     'nav: Community Portal replaces the Programs tab');
  const dd = [...d.querySelectorAll('.nav__dropdown a')].map(a => a.textContent.trim());
  ok(JSON.stringify(dd) === JSON.stringify(['Portal Home', 'City of Hope Atlanta', 'Ronald McDonald House',
     'Northside NICU', 'Senior Living', 'Schools & Global', 'Milal']),
     'Community Portal dropdown: Portal Home + the six portal communities');
  const ddHrefs = [...d.querySelectorAll('.nav__dropdown a')].map(a => a.getAttribute('href'));
  ok(ddHrefs[1] === 'community/city-of-hope.html' && ddHrefs[6] === 'community/milal.html',
     'dropdown links point into the Community Portal');

  /* hero */
  const h1 = d.querySelector('h1');
  ok(h1 && h1.textContent.trim() === 'WE ARE WITH YOU', 'hero h1 is the brand name, plainly');
  ok(d.body.textContent.includes('Students using music, learning, and service to support their communities.'),
     'hero lede: students + music/learning/service');
  ok(d.body.textContent.includes('501(c)(3)') && d.body.textContent.includes('founded in 2023'),
     'hero + About GYCO carry real facts (501(c)(3), 2023)');
  const heroBtns = [...d.querySelectorAll('.home-hero .btn')].map(b => [b.textContent.trim(), b.getAttribute('href')]);
  ok(heroBtns.some(([t, h]) => t === 'See our work' && h === 'media.html'), 'hero CTA: See our work → media.html');
  ok(heroBtns.some(([t, h]) => t === 'Find your community' && h === 'programs.html'), 'hero CTA: Find your community → programs.html');
  const heroImg = d.querySelector('.home-hero .photo-figure img');
  ok(heroImg && heroImg.getAttribute('src') === 'assets/images/media-wawy-cityofhope-1.jpg', 'hero photo is a real documentary photograph');
  ok(heroImg && heroImg.alt.length > 20, 'hero photo has descriptive alt text');
  ok(d.querySelector('.home-hero .photo-figure figcaption').textContent.includes('City of Hope Atlanta'), 'hero photo captioned with the real place');

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

  /* our communities — directory rows from partners.js */
  const rows = [...d.querySelectorAll('[data-pathway-cards] .index-item')];
  ok(rows.length === 6, 'Our Communities renders 6 directory rows');
  const rowNames = rows.map(r => r.querySelector('.index-item__title').textContent.trim());
  ok(JSON.stringify(rowNames) === JSON.stringify(EXPECTED_ORDER), 'community rows: correct names + order');
  ok(rows.every(r => (r.getAttribute('href') || '').startsWith('partner.html?p=')), 'every row links to its partner page');
  ok(d.querySelectorAll('[data-pathway-cards] .logo-chip img').length === 6, 'every community row has a logo <img> with fallback');
  ok([...d.querySelectorAll('[data-pathway-cards] .logo-chip img')].every(i => i.alt && i.alt.length > 3), 'every logo has alt text');

  /* carousel of real flyers */
  const car = d.querySelector('.carousel');
  ok(!!car, 'flyer carousel hydrated in Our Communities');
  ok(car.querySelectorAll('.carousel__slide').length === 6, 'carousel has exactly 6 slides');
  ok(car.getAttribute('aria-roledescription') === 'carousel' && car.tabIndex === 0, 'carousel is keyboard-focusable with ARIA role');
  const track = car.querySelector('.carousel__track');
  ok(track.style.transform === 'translateX(-0%)', 'carousel starts on slide 1');
  car.querySelector('.carousel__arrow--next').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(track.style.transform === 'translateX(-100%)', 'next arrow advances to slide 2');
  car.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  ok(track.style.transform === 'translateX(-0%)', 'ArrowLeft key returns to slide 1');
  car.querySelectorAll('.carousel__dot')[2].dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(track.style.transform === 'translateX(-200%)', 'dot 3 jumps to slide 3');
  ok(car.querySelectorAll('.carousel__dot')[2].getAttribute('aria-current') === 'true', 'active dot exposes aria-current');
  ok(!d.body.innerHTML.includes('autoplay'), 'carousel has no autoplay');
  const note = d.querySelector('.carousel-note');
  ok(note && note.textContent.includes('display purposes only'), 'QR note explains sample flyers are display-only');

  /* NADO section */
  ok(d.body.textContent.includes('Learn something. Make it your own. Teach it forward.'), 'NADO School lead line present');
  const stepLine = d.querySelector('.step-line');
  ok(stepLine && ['Learn', 'Own', 'Offer', 'Progress'].every(w => stepLine.textContent.includes(w)), 'inline steps: Learn → Own → Offer → Progress');

  /* about GYCO — real history + photo placeholder */
  ok(d.body.textContent.includes('Friends of Refugees') && d.body.textContent.includes('100 care packages'),
     'About GYCO cites real service history');
  const ph = d.querySelector('.photo-placeholder');
  ok(ph && ph.textContent.includes('Photo to add') && ph.textContent.length > 60, 'photo placeholder describes exactly what image is needed');

  /* final CTA */
  ok(d.body.textContent.includes('Even Here. Even Now.'), 'final CTA uses the primary brand line');
  const ctas = [...d.querySelectorAll('.section--dark .btn')].map(b => [b.textContent.trim(), b.getAttribute('href')]);
  ok(ctas.some(([t, h]) => t === 'Get involved' && h === 'join.html') && ctas.some(([t, h]) => t === 'Contact us' && h === 'contact.html'),
     'final CTA: Get involved + Contact us');

  /* structure discipline */
  const secs = [...d.querySelectorAll('main > section')];
  ok(secs.length === 7, `homepage has exactly 7 sections (found ${secs.length})`);
  ok(d.querySelectorAll('.eyebrow').length === 0, 'homepage has zero eyebrow labels');
  ok(!d.querySelector('.cards'), 'homepage has no card grids');
  ok(!d.querySelector('main svg'), 'homepage has no diagram SVGs (photos carry the page)');

  /* footer */
  const footAbout = [...d.querySelectorAll('.footer__col')].find(c => c.querySelector('h4').textContent === 'About');
  ok(footAbout && footAbout.textContent.includes('GYCO') && footAbout.textContent.includes('NADO School'), 'footer About column present');
  ok(!footAbout.textContent.includes('Platform'), 'footer no longer says "Platform"');
  const footComms = [...d.querySelectorAll('.footer__col')].find(c => c.querySelector('h4').textContent === 'Communities');
  ok(footComms && footComms.textContent.includes('The America Wheat Mission (Milal)'), 'footer Communities column shows Milal name');
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
  ['ronald-mcdonald-house', 'Ronald McDonald House', 'assets/logos/ronald-mcdonald-house.png'],
  ['nicu', 'Northside Intensive Care Unit (NICU)', 'assets/logos/northside-nicu.png'],
  ['senior-living', 'Senior Living', 'assets/logos/senior-living.png'],
  ['disability', 'The America Wheat Mission (Milal)', 'assets/logos/milal.png'],
  ['schools-global', 'Schools & Global Communities', 'assets/logos/schools-global.png'],
]) {
  const dom = loadPage('partner.html', `https://x.test/partner.html?p=${slug}`);
  const d = dom.window.document;
  ok(d.title === `${expectName} — WE ARE WITH YOU`, `?p=${slug} → title "${expectName}"`);
  const heroLogo = d.querySelector('.page-hero .logo-chip img');
  ok(heroLogo && heroLogo.getAttribute('src') === expectLogo, `?p=${slug} hero shows logo ${expectLogo}`);
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
  ok(d.body.textContent.includes('founded in 2023') && d.body.textContent.includes('501(c)(3)'), 'hero states real facts (2023, 501(c)(3))');
  /* real service history near the top */
  const secs = [...d.querySelectorAll('main > section')];
  const servedIdx = secs.findIndex(s => s.textContent.includes('Where GYCO Has Served'));
  ok(servedIdx >= 0 && servedIdx <= 2, 'real service history appears in the first three sections');
  for (const item of ['City of Hope Atlanta (CTCA)', 'Ronald McDonald House', 'Friends of Refugees', '100 care packages', 'The America Wheat Mission (Milal)']) {
    ok(d.body.textContent.includes(item), `served list includes "${item}"`);
  }
  /* programs as plain rows, real names kept */
  const rowTitles = [...d.querySelectorAll('.index-item .index-item__title')].map(t => t.textContent.trim());
  ok(['Winds of Love', 'Taps of Love', 'Voices of Love', 'Circle of Love'].every(n => rowTitles.includes(n)),
     'program series kept: Winds / Taps / Voices / Circle of Love');
  ok(d.body.textContent.includes('OPUS 1'), 'OPUS numbering kept, explained once in prose');
  ok(!d.querySelector('.cards'), 'GYCO page has no card grids');
  /* photos are real files */
  const imgs = [...d.querySelectorAll('.photo-figure img')].map(i => i.getAttribute('src'));
  ok(imgs.length >= 3 && imgs.every(src => fs.existsSync(path.join(ROOT, src))), 'GYCO page photos exist on disk');
  ok([...d.querySelectorAll('.photo-figure img')].every(i => i.alt && i.alt.length > 10), 'GYCO photos have descriptive alt text');
  const ph = d.querySelector('.photo-placeholder');
  ok(ph && ph.textContent.includes('Photo to add'), 'photo placeholder present for the missing student-leadership photo');
  ok(d.body.textContent.includes('A WE begins with two people'), 'the one quiet quote is kept');
  ok(d.querySelectorAll('.eyebrow').length === 0, 'GYCO page has zero eyebrow labels');
  const join = d.querySelector('[data-form="studentApplication"]');
  ok(join && join.getAttribute('href').includes('1FAIpQLSfsiV5lgetCfyIkVz79'), 'Join GYCO wired to the student application form');
}

/* ── 5. NADO SCHOOL PAGE ── */
console.log('\n[learning.html]');
{
  const dom = loadPage('learning.html', 'https://x.test/learning.html');
  const d = dom.window.document;
  ok(d.title.startsWith('NADO School'), 'title leads with NADO School');
  ok(d.querySelector('h1').textContent.trim() === 'NADO School', 'hero h1 is simply NADO School');
  ok(d.body.textContent.includes('Learn something. Make it your own. Teach it forward.'), 'kicker: the one summary line');
  ok(!!d.querySelector('#loop') && !!d.querySelector('#programs') && !!d.querySelector('#passport'),
     '#loop, #programs, #passport anchors preserved (redirect stubs + old URLs land)');
  const steps = [...d.querySelectorAll('#loop .step h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(steps) === JSON.stringify(['Learn', 'Own', 'Offer', 'Progress']), 'four steps: Learn / Own / Offer / Progress — told once');
  ok(d.body.textContent.includes('나도'), 'Korean 나도 explanation kept');
  ok(d.querySelectorAll('.say-grid p').length === 4, 'four "I will…, too" lines kept');
  const bb = [...d.querySelectorAll('.index-item')].find(r => r.textContent.includes('Beat & Breeze'));
  ok(bb && bb.querySelector('[data-form="teachingVideoRequest"]'), 'Beat & Breeze row wired to the teaching-video form key');
  ok(d.body.textContent.includes('NADO Passport'), 'NADO Passport mentioned honestly (in development), not sold as a product');
  ok(!d.querySelector('.circle-figure') && !d.querySelector('.passport-panel'), 'diagram SVGs removed — one real photo instead');
  const photo = d.querySelector('#programs .photo-figure img');
  ok(photo && fs.existsSync(path.join(ROOT, photo.getAttribute('src'))), 'NADO page photo exists on disk');
  ok(d.querySelectorAll('.eyebrow').length === 0, 'NADO page has zero eyebrow labels');
  const secs = [...d.querySelectorAll('main > section')];
  ok(secs.length === 5, `NADO page stays compact: 5 sections (found ${secs.length})`);
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
  const chips = [...d.querySelectorAll('[data-pathway-cards] .logo-chip')];
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
  for (const part of ['NADO School', 'GYCO', 'WE ARE WITH YOU']) {
    ok(d.body.textContent.includes(part), `three parts named: ${part}`);
  }
  ok([...d.querySelectorAll('.flow')].some(f => f.querySelectorAll('.flow__item').length === 8), 'the concrete 8-step encouragement flow kept');
  ok(!d.body.textContent.includes('One Shared Template'), 'platform-model language gone');
  ok(!d.body.textContent.includes('consistency defines'), 'design-system language gone');
  ok(!d.querySelector('.tri-circle') && !d.querySelector('.eco-loop'), 'diagram overload removed');
  const secs = [...d.querySelectorAll('main > section')];
  ok(secs.length === 7, `philosophy page condensed to 7 sections (found ${secs.length})`);
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
    ['index.html', 480],
    ['student-community.html', 520],
    ['learning.html', 420],
    ['media.html', 420],
    ['hope-capsule.html', 300],
    ['one-message-for-you.html', 260],
    ['join.html', 320],
    ['contact.html', 350],
    ['our-philosophy.html', 700],
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
  const sources = [...PUBLIC_PAGES, 'js/config.js', 'js/partners.js', 'js/site.js'];
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
