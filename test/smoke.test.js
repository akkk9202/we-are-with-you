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
  ok(car.querySelectorAll('.carousel__slide').length === 3, 'carousel has exactly 3 slides');
  ok(car.getAttribute('aria-roledescription') === 'carousel' && car.tabIndex === 0, 'carousel is keyboard-focusable with ARIA role');
  ok(car.querySelector('.carousel__arrow--prev') && car.querySelector('.carousel__arrow--next'), 'carousel has prev/next arrows');
  ok(car.querySelectorAll('.carousel__dot').length === 3, 'carousel has 3 dot indicators');
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
  const footPrograms = [...d.querySelectorAll('.footer__col')].find(c => c.textContent.includes('Programs'));
  ok(footPrograms.textContent.includes('The America Wheat Mission (Milal)'), 'footer Programs column shows Milal name');

  ok(!d.body.textContent.includes('Disability Community'), 'no visible "Disability Community" label remains');
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
  ok(d.title === 'One Message for You — WE ARE WITH YOU', 'OMFY page title');
  ok(d.querySelector('.page-hero h1').textContent.includes('One Message'), 'OMFY hero renders');
  const steps = [...d.querySelectorAll('.cards--3 .card h3')].map(h => h.textContent.trim());
  ok(JSON.stringify(steps) === JSON.stringify(['Write One Message', 'Add Your Voice', 'Become Part of the Circle']), 'OMFY three join steps in order');
  ok([...d.querySelectorAll('[data-form]')].every(a => a.getAttribute('href') === 'contact.html'), 'OMFY placeholder forms route to contact.html');
}

console.log('\n[hope-capsule.html]');
{
  const dom = loadPage('hope-capsule.html', 'https://x.test/hope-capsule.html');
  const d = dom.window.document;
  ok(d.title === 'Hope Capsule — WE ARE WITH YOU', 'Hope Capsule page title');
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
  const opus = [...d.querySelectorAll('#student-innovation .cards--3 .card h3')].map(h => h.textContent);
  ok(JSON.stringify(opus) === JSON.stringify(['Student Innovation', 'Research & Innovation', 'Student Leadership', 'Global Collaboration', 'Student Media & Communications']), 'OPUS 2-6: Innovation / Research / Leadership / Global / Media');
  const opusTags = [...d.querySelectorAll('.card__tag')].map(t => t.textContent);
  ok(['OPUS 2', 'OPUS 3', 'OPUS 4', 'OPUS 5', 'OPUS 6'].every(t => opusTags.includes(t)) && d.body.textContent.includes('OPUS 1'), 'OPUS 1-6 numbering present');
  ok(d.body.textContent.includes('Student Correspondents'), 'OPUS 6 detail: Student Correspondents present');
  const roles = ['Creator', 'Leader', 'Researcher', 'Collaborator'];
  ok(roles.every(r => [...d.querySelectorAll('.circle-word')].some(w => w.textContent === r)), 'roles: Creator / Leader / Researcher / Collaborator');
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
  ok(JSON.stringify(steps) === JSON.stringify(['Learn', 'Create', 'Share', 'Grow', 'Learn Again']), 'Learning Loop: 5 steps in order');
  ok(!!d.querySelector('#programs'), '#programs anchor preserved (beat-and-breeze/taps-of-love redirects still land)');
  ok(d.body.textContent.includes('나도'), 'Korean 나도 explanation present');
  ok(d.body.textContent.includes('I will learn, too'), 'four "I will…, too" declarations present');
  ok(d.body.textContent.includes('It starts with "Nado."'), 'closing line present');
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
  ok(card.textContent.includes('Music of Hope: GYCO Brings Healing to the Community'), 'article title correct');
  ok(card.textContent.includes('Newswave25'), 'publisher shown');
  ok(card.textContent.includes('Featured Press') && card.textContent.includes('Bilingual Coverage'), 'labels: Featured Press + Bilingual Coverage');
  ok(card.textContent.includes('Available in English and Korean'), 'language note present');
  const links = [...card.querySelectorAll('a')];
  ok(links.length === 2 && links[0].textContent === 'Read in English' && links[1].textContent === 'Read in Korean', 'exactly two buttons: EN + KR');
  ok(links[0].href === 'https://newswave25.com/music-of-hope-gyco-brings-healing-to-the-community', 'English URL exact');
  ok(links[1].href.includes('newswave25.com/%EB%B3%91%EC%9B%90'), 'Korean URL exact (encoded)');
  ok(links.every(l => l.target === '_blank' && l.rel === 'noopener'), 'both links open safely in new tab');
  ok(card.querySelector('.press-card__media img'), 'article image slot present (with styled fallback)');
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

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
