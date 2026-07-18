/* DOM smoke tests for the WE ARE WITH YOU site.
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

/* ── 1. HOMEPAGE ── */
console.log('\n[index.html]');
{
  const dom = loadPage('index.html', 'https://x.test/index.html');
  const d = dom.window.document;

  const brand = d.querySelector('.nav__logo');
  ok(brand && brand.textContent.trim() === 'WE ARE WITH YOU', 'nav brand is exactly "WE ARE WITH YOU"');
  ok(!brand.textContent.includes('GYCO'), 'nav brand contains no GYCO co-branding');

  const navLabels = [...d.querySelectorAll('.nav__links > li > a')].map(a => a.textContent.replace('▾', '').trim());
  ok(navLabels.includes('GYCO'), 'nav has "GYCO" (was Student Community)');
  ok(navLabels.includes('NADO School'), 'nav has "NADO School" (was Learning)');
  ok(!navLabels.includes('Student Community') && !navLabels.includes('Learning'), 'old nav labels removed');
  ok(navLabels[0] === 'We Are With You', 'first nav tab renamed "We Are With You" (was Home)');
  ok(!navLabels.includes('Home') && !navLabels.includes('About'), 'Home and About tabs removed (About merged into homepage)');

  const dd = [...d.querySelectorAll('.nav__dropdown a')].map(a => a.textContent.trim());
  ok(JSON.stringify(dd) === JSON.stringify(EXPECTED_ORDER), 'Programs dropdown: 6 renamed pathways in required order');
  const ddHrefs = [...d.querySelectorAll('.nav__dropdown a')].map(a => a.getAttribute('href'));
  ok(ddHrefs[0] === 'partner.html?p=cancer-care' && ddHrefs[4] === 'partner.html?p=disability',
     'dropdown keeps legacy slugs (cancer-care, disability) so old QR codes work');

  const cards = [...d.querySelectorAll('[data-pathway-cards] .card--pathway h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(cards) === JSON.stringify(EXPECTED_ORDER), 'homepage pathway cards: correct names + order');
  ok(d.querySelectorAll('[data-pathway-cards] .logo-chip img').length === 6, 'every pathway card has a logo <img> with fallback');
  const alts = [...d.querySelectorAll('[data-pathway-cards] .logo-chip img')].map(i => i.alt);
  ok(alts.every(a => a && a.length > 3), 'every pathway logo has alt text');

  const inv = d.querySelector('[data-home-invitation] img');
  ok(inv && inv.getAttribute('src') === 'assets/images/home-invitation.jpg', 'invitation image rendered from config');
  ok(inv && inv.alt.includes('invitation'), 'invitation image has descriptive alt text');

  const car = d.querySelector('.carousel');
  ok(!!car, 'carousel hydrated in "One platform" section');
  ok(car.querySelectorAll('.carousel__slide').length === 6, 'carousel has exactly 6 slides');
  ok(car.getAttribute('aria-roledescription') === 'carousel' && car.tabIndex === 0, 'carousel is keyboard-focusable with ARIA role');
  ok(car.querySelector('.carousel__arrow--prev') && car.querySelector('.carousel__arrow--next'), 'carousel has prev/next arrows');
  ok(car.querySelectorAll('.carousel__dot').length === 6, 'carousel has 6 dot indicators');
  const track = car.querySelector('.carousel__track');
  ok(track.style.transform === 'translateX(-0%)', 'carousel starts on slide 1 (one image at a time)');
  car.querySelector('.carousel__arrow--next').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(track.style.transform === 'translateX(-100%)', 'next arrow advances to slide 2');
  car.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  ok(track.style.transform === 'translateX(-0%)', 'ArrowLeft key returns to slide 1');
  car.querySelectorAll('.carousel__dot')[2].dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  ok(track.style.transform === 'translateX(-200%)', 'dot 3 jumps to slide 3');
  ok(car.querySelectorAll('.carousel__dot')[2].getAttribute('aria-current') === 'true', 'active dot exposes aria-current');
  ok(!d.body.innerHTML.includes('autoplay'), 'carousel has no autoplay');
  const note = d.querySelector('.carousel-note');
  ok(note && note.textContent.includes('display purposes only') && note.textContent.includes('will not open a live page'), 'carousel note explains QR codes are display-only dummies');
  ok(note && note.parentElement.contains(car), 'QR note sits directly beneath the carousel');

  const svg = d.querySelector('.circle-figure svg');
  ok(svg.textContent.includes('WE ARE WITH YOU'), 'Circle of Love center includes WE ARE WITH YOU');
  ok(svg.textContent.includes('Even Here.') && svg.textContent.includes('Even Now.'), 'Circle keeps Even Here / Even Now');
  const vb = svg.getAttribute('viewBox').split(' ').map(Number);
  const texts = [...svg.querySelectorAll('text')];
  const share = texts.find(t => t.textContent === 'SHARE');
  const cont = texts.find(t => t.textContent === 'CONTINUE');
  ok(Number(share.getAttribute('x')) + 90 < vb[2], 'SHARE label fits inside viewBox (right side, no clipping)');
  ok(Number(cont.getAttribute('x')) - 100 > vb[0], 'CONTINUE label fits inside viewBox (left side, no clipping)');

  const footPlatform = [...d.querySelectorAll('.footer__col')].find(c => c.textContent.includes('Platform'));
  ok(footPlatform.textContent.includes('GYCO') && footPlatform.textContent.includes('NADO School'), 'footer Platform column uses GYCO / NADO School');
  ok(!footPlatform.textContent.includes('About'), 'footer Platform column no longer links About');
  const footConnect = [...d.querySelectorAll('.footer__col')].find(c => c.textContent.includes('Connect'));
  ok(!footConnect.textContent.includes('YouTube'), 'footer Connect column has no YouTube link (no channel yet)');
  const footPrograms = [...d.querySelectorAll('.footer__col')].find(c => c.textContent.includes('Programs'));
  ok(footPrograms.textContent.includes('The America Wheat Mission (Milal)'), 'footer Programs column shows Milal name');

  ok(!d.body.textContent.includes('Disability Community'), 'no visible "Disability Community" label remains');

  const audTags = [...d.querySelectorAll('[data-pathway-cards] .card--pathway .card__tag')].map(t => t.textContent.trim());
  ok(JSON.stringify(audTags) === JSON.stringify(['For Cancer Patients', 'For Families', 'For Babies & Families', 'For Older Adults', 'For Individuals with Disabilities', 'For Students & Communities']), 'pathway cards show audience subtitles in order');
  ok([...d.querySelectorAll('[data-pathway-cards] .btn')].every(b => b.textContent.trim() === 'Learn More'), 'pathway card buttons say "Learn More"');
  ok(d.body.textContent.includes('Even Here. Even Now. WE ARE WITH YOU.'), 'pathways section states the shared mission line');

  ok(d.body.textContent.includes('Students Created This.') && d.body.textContent.includes('And Continue to Grow It.'), 'students section: new heading');
  ok(d.body.textContent.includes('learn by developing projects that create meaningful, lasting impact'), 'students section: GYCO body copy');
  const studentCtas = [...d.querySelectorAll('.action-card .action-card__title')].map(t => t.textContent.trim());
  ok(studentCtas.includes('Explore GYCO') && studentCtas.includes('Explore NADO School'), 'students section: two prominent CTA cards');

  ok(d.body.textContent.includes('One Message Can Change a Moment.') && d.body.textContent.includes('One Community Can Change a Life.'), 'final CTA: new heading');
  ok(studentCtas.includes('Partner With Us') && studentCtas.includes('Join the Circle'), 'final CTA: Partner With Us + Join the Circle cards');
  ok([...d.querySelectorAll('.action-card')].filter(a => ['Partner With Us', 'Join the Circle'].includes(a.querySelector('.action-card__title').textContent.trim())).every(a => a.getAttribute('href') === 'join.html'), 'final CTA cards link to join.html');
  ok(!/Cancer Care(?!.*CTCA)/.test([...d.querySelectorAll('h3')].map(h => h.textContent).join('|')), 'no bare "Cancer Care" card heading remains');
}

/* ── 2. PROGRAMS PAGE ── */
console.log('\n[programs.html]');
{
  const dom = loadPage('programs.html', 'https://x.test/programs.html');
  const d = dom.window.document;
  const cards = [...d.querySelectorAll('[data-pathway-cards] .card--pathway h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(cards) === JSON.stringify(EXPECTED_ORDER), 'Programs page cards: correct names + order');
  ok(d.body.textContent.includes('Your community could be next'), 'future-partners card preserved');
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
}
{
  const dom = loadPage('partner.html', 'https://x.test/partner.html?p=bogus');
  const d = dom.window.document;
  ok(d.querySelectorAll('#partner-root .card').length === 6, 'bad slug fallback lists all 6 pathways');
}

/* ── 3b. PROGRAM PAGES ── */
console.log('\n[one-message-for-you.html]');
{
  const dom = loadPage('one-message-for-you.html', 'https://x.test/one-message-for-you.html');
  const d = dom.window.document;
  ok(d.title === 'One Message for You | WE ARE WITH YOU', 'OMFY page title');
  ok(d.querySelector('.page-hero h1').textContent.includes('One Message'), 'OMFY hero renders');
  const steps = [...d.querySelectorAll('.cards--3 .card h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(steps) === JSON.stringify(['Write One Message', 'Add Your Voice', 'Become Part of the Circle']), 'OMFY three join steps in order');
  ok([...d.querySelectorAll('[data-form]')].every(a =>
    (a.getAttribute('href') || '').startsWith('https://docs.google.com/forms/')
      ? (a.target === '_blank' && a.rel === 'noopener')
      : a.getAttribute('aria-disabled') === 'true'
  ), 'OMFY form buttons: live Google Form (new tab, noopener) or disabled with notice');
  ok([...d.querySelectorAll('[data-form="letterSubmission"]')].every(a => a.getAttribute('href').includes('1FAIpQLScPFE6ckE10oraG')), 'OMFY letter buttons wired to the letter Google Form');
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

console.log('\n[hope-capsule.html]');
{
  const dom = loadPage('hope-capsule.html', 'https://x.test/hope-capsule.html');
  const d = dom.window.document;
  ok(d.title === 'Hope Capsule | WE ARE WITH YOU', 'Hope Capsule page title');
  ok(d.querySelector('.page-hero h1').textContent.trim() === 'Hope Capsule', 'Hope Capsule hero renders');
  const steps = [...d.querySelectorAll('.cards--3 .card h3')].map(h => h.textContent.trim());
  ok(steps.length === 3 && steps[0] === 'Stories are gathered', 'Hope Capsule three creation steps');
}

/* ── 4. GYCO PAGE ── */
console.log('\n[student-community.html]');
{
  const dom = loadPage('student-community.html', 'https://x.test/student-community.html');
  const d = dom.window.document;
  ok(d.title.startsWith('GYCO'), 'title leads with GYCO');
  ok(d.querySelector('h1').textContent.includes('More Than Music'), 'hero: More Than Music.');
  ok(d.body.textContent.includes('Student-Led Innovation Community'), 'hero eyebrow: Student-Led Innovation Community');
  const series = [...d.querySelectorAll('#flagship .cards--4 .card h3')].map(h => h.textContent);
  ok(JSON.stringify(series) === JSON.stringify(['Taps of Love', 'Winds of Love', 'Voices of Love', 'Circle of Love']), 'flagship series: Taps / Winds / Voices / Circle of Love');
  ok(d.body.textContent.includes('first flagship initiative'), 'WE ARE WITH YOU framed as first flagship initiative');
  const opus = [...d.querySelectorAll('#student-innovation .card h3')].map(h => h.textContent);
  ok(JSON.stringify(opus) === JSON.stringify(['OPUS 1 | WE ARE WITH YOU', 'OPUS 2 | NADO School', 'OPUS 3 | Student Research', 'OPUS 4 | Student Press', 'OPUS 5 | SHAN & ECHO', 'OPUS 6 | Creative Projects']), 'OPUS 1-6 cards: WAWY / NADO / Research / Press / SHAN & ECHO / Creative');
  ok(d.body.textContent.includes('What is OPUS?') && d.body.textContent.includes('Every Great Work Begins with an Idea.'), '"What is OPUS?" intro precedes the OPUS cards');
  ok(d.querySelector('#flagship h2').textContent === 'OPUS 1 | WE ARE WITH YOU', 'OPUS 1 header on flagship section');
  const growth = [...d.querySelectorAll('#growth-loop .loop__step h3')].map(h => h.textContent);
  ok(JSON.stringify(growth) === JSON.stringify(['Learn', 'Own', 'Offer', 'Progress', 'Learn Again']), 'GYCO Growth Loop: Learn / Own / Offer / Progress / Learn Again');
  const journey = [...d.querySelectorAll('#student-journey .journey__node')].map(n => n.textContent.trim());
  ok(JSON.stringify(journey) === JSON.stringify(['Idea', 'Project', 'Program', 'Community', 'Impact']), 'student journey: Idea → Project → Program → Community → Impact');
  ok(d.body.textContent.includes('Our First Tool. Our Shared Gift.'), 'Music With Purpose section present');
  ok(d.body.textContent.includes('It is an opportunity to say'), 'Music With Purpose closing statement present');
  ok(![...d.querySelectorAll('.loop__step h3, .circle-word')].some(el => ['Create', 'Share', 'Grow'].includes(el.textContent.trim())), 'old Learn/Create/Share/Grow framework fully replaced');
  const roles = ['Creators', 'Leaders', 'Researchers', 'Collaborators'];
  ok(roles.every(r => [...d.querySelectorAll('.circle-word')].some(w => w.textContent === r)), 'roles: Creators / Leaders / Researchers / Collaborators');
  ok(d.body.textContent.includes('A WE begins with two people'), 'philosophy quote block present');
  ok(d.body.textContent.includes('discover their gifts'), '"discover their gifts" bridge line present');
  ok(d.querySelector('.logo-panel img[src="assets/logos/gyco.png"]'), 'GYCO logo displayed');
  ok(d.body.textContent.includes('501(c)(3)') && d.body.textContent.includes('Friends of Refugees'), 'old-site history integrated (501(c)(3), real service record)');
}

/* ── 5. NADO SCHOOL PAGE ── */
console.log('\n[learning.html]');
{
  const dom = loadPage('learning.html', 'https://x.test/learning.html');
  const d = dom.window.document;
  ok(d.title.startsWith('NADO School'), 'title leads with NADO School');
  ok(d.querySelector('h1').textContent.trim() === 'Become a School.', 'hero: Become a School.');
  const steps = [...d.querySelectorAll('.loop .loop__step h3')].map(h => h.textContent);
  ok(JSON.stringify(steps) === JSON.stringify(['Learn', 'Own', 'Offer', 'Progress']), 'NADO Learning Loop: Learn / Own / Offer / Progress');
  ok(!!d.querySelector('#programs'), '#programs anchor preserved (beat-and-breeze/taps-of-love redirects still land)');
  ok(!!d.querySelector('#loop') && !!d.querySelector('#passport'), '#loop and #passport anchors present (hero CTA + passport card land)');
  const loopSvg = d.querySelector('#loop .circle-figure svg');
  ok(loopSvg && ['LEARN', 'OWN', 'OFFER', 'PROGRESS'].every(w => loopSvg.textContent.includes(w)), 'Learning Loop rendered as a circular graphic with all four steps');
  ok(loopSvg && loopSvg.textContent.includes('a new journey.'), 'loop graphic center: every ending becomes a new journey');
  ok(d.querySelectorAll('.field-grid .field-tile').length === 8, 'Learning in Action: 8 field tiles (Music … Service)');
  ok(d.body.textContent.includes('One Philosophy. Many Experiences.'), 'Where the Learning Happens heading present');
  const feats = [...d.querySelectorAll('#programs .card h3')].map(h => h.textContent.replace(/\s+/g, ' ').trim());
  ok(JSON.stringify(feats) === JSON.stringify(['Beat & Breeze', 'NADO Passport', 'Books & Resources', 'Videos & Stories']), 'four feature cards: Beat & Breeze / Passport / Books / Videos');
  const impact = [...d.querySelectorAll('.journey .journey__node')].map(n => n.textContent.trim());
  ok(JSON.stringify(impact) === JSON.stringify(['NADO School', 'GYCO', 'WE ARE WITH YOU']), 'From Philosophy to Impact: NADO School → GYCO → WE ARE WITH YOU');
  ok(!!d.querySelector('.passport-panel svg') && d.body.textContent.includes('A Lifetime of Learning.'), 'NADO Passport section with mockup beside it');
  ok(d.body.textContent.includes('나도'), 'Korean 나도 explanation present');
  ok(d.body.textContent.includes('I will learn, too') && d.body.textContent.includes('I will contribute, too'), 'four "I will…, too" declarations present (incl. contribute)');
  ok(d.body.textContent.includes('Every learning community begins when someone chooses to say'), '"Nado." choice statement present');
  ok(d.body.textContent.includes('Your journey starts today') && d.body.textContent.includes('Become a School.'), 'final CTA: Your Journey Starts Today / Become a School.');
  ok([...d.querySelectorAll('.btn')].some(b => b.textContent.trim() === 'Explore the Learning Journey' && b.getAttribute('href') === '#loop'), 'hero CTA "Explore the Learning Journey" targets the loop');
  ok(![...d.querySelectorAll('.loop__step h3, .circle-word')].some(el => ['Create', 'Share', 'Grow'].includes(el.textContent.trim())), 'old Learn/Create/Share/Grow framework fully replaced');
  ok(d.querySelector('.logo-panel img[src="assets/logos/nado-school.png"]'), 'NADO School logo displayed');
}

/* ── 6. MEDIA PAGE ── */
console.log('\n[media.html]');
{
  const dom = loadPage('media.html', 'https://x.test/media.html');
  const d = dom.window.document;
  const card = d.querySelector('.press-card');
  ok(!!card, 'featured press card rendered');
  ok(d.querySelectorAll('.press-card').length === 1, 'ONE bilingual card, not two separate articles');
  ok(card.textContent.includes('Music of Hope: GYCO Brings Comfort and Connection to the Community'), 'article title correct');
  ok(card.textContent.includes('Newswave25'), 'publisher shown');
  ok(card.textContent.includes('Featured Press') && card.textContent.includes('Bilingual Coverage'), 'labels: Featured Press + Bilingual Coverage');
  ok(card.textContent.includes('Available in English and Korean'), 'language note present');
  const links = [...card.querySelectorAll('a')];
  ok(links.length === 2 && links[0].textContent === 'Read in English' && links[1].textContent === 'Read in Korean', 'exactly two buttons: EN + KR');
  ok(links[0].href === 'https://newswave25.com/music-of-hope-gyco-brings-healing-to-the-community', 'English URL exact');
  ok(links[1].href.includes('newswave25.com/%EB%B3%91%EC%9B%90'), 'Korean URL exact (encoded)');
  ok(links.every(l => l.target === '_blank' && l.rel === 'noopener'), 'both links open safely in new tab');
  ok(card.querySelector('.press-card__media img'), 'article image slot present (with styled fallback)');

  /* gallery photos — Performances & rehearsals + Where the music travels */
  const galleryImgs = [...d.querySelectorAll('.media-grid .media-item img')];
  const perf = galleryImgs.filter(i => i.getAttribute('src').includes('media-performances-'));
  const outreach = galleryImgs.filter(i => i.getAttribute('src').includes('media-outreach-'));
  const teaching = galleryImgs.filter(i => i.getAttribute('src').includes('media-teaching-'));
  ok(perf.length === 3, 'Performances & rehearsals gallery has 3 real photos');
  ok(outreach.length === 3, 'Where the music travels gallery has 3 real photos');
  ok(teaching.length === 3, 'Student teaching gallery has 3 real photos');
  ok(galleryImgs.every(i => i.alt && i.alt.length > 10), 'every gallery photo has descriptive alt text');
  ok(galleryImgs.every(i => i.getAttribute('loading') === 'lazy'), 'gallery photos lazy-load');
  for (const img of [...perf, ...outreach, ...teaching]) {
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
  ok(!/SITE\.youtube/.test(fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf8')), 'js/site.js no longer renders a YouTube link');
}

/* ── 7. LOGO FALLBACK BEHAVIOR ── */
console.log('\n[logo fallback]');
{
  const dom = loadPage('index.html', 'https://x.test/index.html');
  const d = dom.window.document;
  const chips = [...d.querySelectorAll('[data-pathway-cards] .logo-chip')];
  const senior = chips.find(c => c.querySelector('img').src.includes('senior-living'));
  const img = senior.querySelector('img');
  // Execute the img's real inline onerror handler (jsdom outside-only
  // mode doesn't compile attribute handlers, but browsers do).
  dom.window.__img = img;
  dom.window.eval(`(function(){ ${img.getAttribute('onerror')} }).call(__img)`);
  ok(senior.classList.contains('logo-chip--missing') && !senior.querySelector('img'),
     'missing logo file → chip swaps to monogram fallback, card stays clean');
  ok(senior.querySelector('.logo-chip__fallback').textContent === 'SL', 'Senior Living monogram = "SL"');
}

/* ── 8. PHILOSOPHY SECTIONS (merged from about.html into index.html) ── */
console.log('\n[index.html · philosophy]');
{
  const dom = loadPage('index.html', 'https://x.test/index.html');
  const d = dom.window.document;
  const h1 = d.querySelector('h1').textContent;
  ok(['One Philosophy.', 'One Loop.', 'One Community.'].every(l => h1.includes(l)), 'page opens with hero: One philosophy. One Loop. One Community.');
  ok(d.body.textContent.includes('Every WE begins with one NADO.'), 'hero kicker present');
  ok(d.querySelector('.page-hero .invite-figure img[src="assets/images/home-invitation.jpg"]'), 'invitation image is the hero visual');
  ok([...d.querySelectorAll('.btn')].some(b => b.textContent.trim() === 'Enter WE ARE WITH YOU' && b.getAttribute('href') === '#wawy'), 'hero CTA: Enter WE ARE WITH YOU → #wawy anchor');
  const wawy = d.getElementById('wawy');
  ok(wawy && wawy.classList.contains('hero') && wawy.textContent.includes('Welcome to'), '#wawy anchor lands on the original Welcome hero');
  const secs = [...d.querySelectorAll('main > section')];
  ok(secs.findIndex(s => s.id === 'closing-loop') < secs.findIndex(s => s.id === 'wawy'), 'philosophy sections come first; original home content trails after');

  const merge = d.querySelector('.nado-we-figure svg');
  ok(merge && merge.querySelectorAll('text').length === 3 && merge.textContent.includes('WE'), 'NADO + NADO → WE merge figure (two NADOs and one WE)');
  ok(!!merge.closest('.reveal'), 'merge figure animates on scroll (inside a .reveal)');

  const eco = d.querySelector('.eco-loop svg');
  ok(!!eco, 'ecosystem loop diagram present');
  ok(eco.textContent.includes('NADO + NADO') && eco.textContent.includes('WE'), 'loop center: NADO + NADO = WE');
  ok(['NADO School', 'GYCO', 'WE ARE WITH YOU', 'New Experiences'].every(n => eco.textContent.includes(n)), 'loop connects all four stations');
  ok(['LEARN', 'OFFER', 'LOOP'].every(n => eco.textContent.includes(n)), 'loop roles: LEARN / OFFER / LOOP');
  ok(!!eco.querySelector('.orbit') && !!eco.querySelector('.dash-ring'), 'loop has continuous-motion elements (orbit dot + flowing dashes)');

  const pillars = [...d.querySelectorAll('.pillar h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(pillars) === JSON.stringify(['NADO School', 'GYCO', 'WE ARE WITH YOU']), 'three expression explainers under the diagram');
  const tri = [...d.querySelectorAll('.tri-circle h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(tri) === JSON.stringify(['NADO School', 'GYCO', 'WE ARE WITH YOU']), 'Different Purposes: three connected circles');

  const closing = [...d.querySelectorAll('#closing-loop .journey__node')].map(n => n.textContent.trim());
  ok(JSON.stringify(closing) === JSON.stringify(['NADO', 'GYCO', 'WE ARE WITH YOU', 'New Stories', 'NADO Again']), 'closing vertical flow: NADO → … → NADO Again');
  ok(d.body.textContent.includes('Every Ending Becomes Another Beginning.'), 'ending statement present');
  const loopLink = [...d.querySelectorAll('#closing-loop .journey__node')].find(n => n.textContent.trim() === 'WE ARE WITH YOU');
  ok(loopLink && loopLink.getAttribute('href') === '#wawy', 'closing loop WE ARE WITH YOU node points to #wawy (no longer index.html)');
}

/* ── 9. REDIRECT STUBS + SLUG INTEGRITY ── */
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
