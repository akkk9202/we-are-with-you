/* ============================================================
   SITE.JS — builds the nav + footer on every page from
   js/config.js, renders partner pages from js/partners.js,
   fills the homepage poster / brochure / community-logo
   sections and the Media press card, and handles
   scroll/reveal/menu behavior.
   You should rarely need to edit this file.
   ============================================================ */

const ringMark = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <circle cx="12" cy="12" r="9" stroke="#C4A24E" stroke-width="1.6"/>
  <circle cx="12" cy="3" r="2" fill="#C4A24E"/>
</svg>`;

/* ── SHARED HELPERS ── */

/* Only allow safe link schemes for URLs coming from config.js so a
   pasted "javascript:" (or a broken value) can never become a live
   link. Permits http(s), mailto, root-relative, and local .html paths;
   anything else falls back to "#". */
const safeUrl = (u) =>
  /^(https?:|mailto:|\/|#|[\w.-]+\.html)/i.test((u || '').trim()) ? u : '#';

/* Root prefix for pages that live one folder down (e.g. fundraising/).
   Derived from how the page loaded this very file: a page that says
   <script src="../js/site.js"> is one level below the site root, so
   every internal link and asset path gets "../" in front. Root pages
   (src="js/site.js") get "" and behave exactly as before. */
const REL = (() => {
  const s = document.querySelector('script[src$="js/site.js"]');
  const src = s ? s.getAttribute('src') : 'js/site.js';
  return src.slice(0, src.lastIndexOf('js/site.js'));
})();

/* Prefix an internal root-relative href/src with REL. Absolute URLs,
   mailto:, and in-page anchors pass through untouched. */
const rel = (u) => /^(https?:|mailto:|\/|#)/i.test(u || '') ? u : REL + (u || '');

/* All pathways from js/partners.js, sorted by their `order` field. */
const pathwayList = () => (typeof PARTNERS === 'undefined') ? [] :
  Object.entries(PARTNERS)
    .map(([slug, p]) => ({ slug, ...p }))
    .sort((a, b) => (a.order || 99) - (b.order || 99));

/* Monogram fallback text, e.g. "Senior Living" → "SL". */
const monogram = (name) => name
  .replace(/\(.*?\)/g, '')
  .split(/\s+/)
  .filter(w => /^[A-Za-z]/.test(w))
  .slice(0, 2)
  .map(w => w[0].toUpperCase())
  .join('');

/* Partner logo chip. If the image file is missing, the chip swaps
   to a clean monogram automatically so cards never look broken. */
const logoChip = (p, extra = '') => `
  <span class="logo-chip ${extra}">
    <img src="${rel(p.logo)}" alt="${p.logoAlt || p.name + ' logo'}" loading="lazy"
         onerror="this.parentElement.classList.add('logo-chip--missing');this.remove();">
    <span class="logo-chip__fallback" aria-hidden="true">${monogram(p.name)}</span>
  </span>`;

/* ── NAV ── */
(function buildNav() {
  const mount = document.getElementById('site-nav');
  if (!mount || typeof SITE === 'undefined') return;
  /* Current page, expressed relative to the site root (so a page in
     fundraising/ knows it is "fundraising/…", not just its filename). */
  const depth = (REL.match(/\.\.\//g) || []).length;
  const segs = location.pathname.split('/');
  const file = segs.pop() || 'index.html';
  const dirs = segs.filter(Boolean);
  const current = (depth ? dirs.slice(-depth).join('/') + '/' : '') + file + location.search;

  const links = SITE.nav.map(item => {
    const base = item.href.split('?')[0];
    const isActive = (current.startsWith(base) ||
        (base.endsWith('/index.html') && current.startsWith(base.slice(0, -'index.html'.length)))) &&
      (item.href !== 'index.html' || current.startsWith('index.html'));
    if (item.dropdown) {
      const items = item.dropdown === 'partners'
        ? pathwayList().map(p => ({ label: p.name, href: `partner.html?p=${p.slug}` }))
        : item.dropdown;
      const dd = items.map(d =>
        `<li><a href="${rel(d.href)}">${d.label}</a></li>`).join('');
      return `<li>
        <a href="${rel(item.href)}" class="${isActive ? 'active' : ''}" aria-haspopup="true">${item.label} <span class="nav__caret">▾</span></a>
        <ul class="nav__dropdown">${dd}</ul>
      </li>`;
    }
    const cls = [item.cta ? 'btn btn--gold btn--sm nav__cta' : '', isActive && !item.cta ? 'active' : ''].join(' ').trim();
    return `<li><a href="${rel(item.href)}" ${cls ? `class="${cls}"` : ''}>${item.label}</a></li>`;
  }).join('');

  mount.outerHTML = `
  <nav class="nav" aria-label="Main navigation">
    <a href="${rel('index.html')}" class="nav__logo">${ringMark(22)} ${SITE.name}</a>
    <button class="nav__hamburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav__links">${links}</ul>
  </nav>`;

  const nav = document.querySelector('.nav');
  const burger = nav.querySelector('.nav__hamburger');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
})();

/* ── FOOTER ── */
(function buildFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount || typeof SITE === 'undefined') return;
  const partnerLinks = pathwayList()
    .map(p => `<li><a href="${rel(`partner.html?p=${p.slug}`)}">${p.name}</a></li>`).join('');
  const connect = [
    SITE.instagram ? `<li><a href="${safeUrl(SITE.instagram)}" target="_blank" rel="noopener">Instagram</a></li>` : '',
    SITE.youtube ? `<li><a href="${safeUrl(SITE.youtube)}" target="_blank" rel="noopener">YouTube</a></li>` : '',
    `<li><a href="${rel('contact.html')}">Email us</a></li>`,
  ].join('');

  mount.outerHTML = `
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__brand-name">${ringMark(20)} ${SITE.name}</div>
        <p>${SITE.footerNote}</p>
      </div>
      <div class="footer__col"><h4>Communities</h4><ul>${partnerLinks}</ul></div>
      <div class="footer__col"><h4>About</h4><ul>
        <li><a href="${rel('our-philosophy.html')}">Our Philosophy</a></li>
        <li><a href="${rel('student-community.html')}">GYCO</a></li>
        <li><a href="${rel('media.html')}">Media</a></li>
      </ul></div>
      <div class="footer__col"><h4>Connect</h4><ul>${connect}</ul></div>
    </div>
    <div class="footer__bottom">
      <p>© ${new Date().getFullYear()} ${SITE.org}. All rights reserved.</p>
      <div class="footer__tagline">${SITE.tagline}</div>
    </div>
  </footer>`;
})();

/* ── FORM LINK WIRING ── */
/* Any element with data-form="key" gets its href from SITE.forms.key.
   Live Google Form → opens in a new tab. Still a REPLACE_ME
   placeholder → the button is disabled with a "coming soon" note,
   because that form is still in progress. */
function wireFormButton(el) {
  const url = SITE.forms[el.dataset.form];
  if (url && !url.startsWith('REPLACE_ME')) {
    el.setAttribute('href', safeUrl(url));
    el.target = '_blank'; el.rel = 'noopener';
    return;
  }
  // No form yet — if the button names an email subject, fall back to a
  // working mailto: link so the option is never a dead end. Paste the
  // real form URL into SITE.forms later and the button switches over.
  if (el.dataset.mailtoSubject && SITE.email && !SITE.email.startsWith('REPLACE_ME')) {
    el.setAttribute('href', 'mailto:' + SITE.email + '?subject=' + encodeURIComponent(el.dataset.mailtoSubject));
    return;
  }
  el.removeAttribute('href');
  el.classList.add('btn--disabled');
  el.setAttribute('aria-disabled', 'true');
  el.title = 'Coming soon — this form is still in progress';
  if (!(el.nextElementSibling && el.nextElementSibling.classList.contains('form-soon'))) {
    el.insertAdjacentHTML('afterend', '<span class="form-soon" data-i18n="form.comingSoon">Coming soon — this form is still in progress</span>');
  }
}

(function wireForms() {
  if (typeof SITE === 'undefined') return;
  document.querySelectorAll('[data-form]').forEach(wireFormButton);
  document.querySelectorAll('[data-email]').forEach(el => {
    if (SITE.email && !SITE.email.startsWith('REPLACE_ME')) {
      el.textContent = SITE.email;
      if (el.tagName === 'A') el.href = 'mailto:' + SITE.email;
    } else {
      el.textContent = 'Email coming soon';
    }
  });
})();

/* ── HOMEPAGE INVITATION IMAGE ── */
/* Fills [data-home-invitation] from SITE.home.invitation (config.js). */
(function renderHomeInvitation() {
  const m = document.querySelector('[data-home-invitation]');
  if (!m || typeof SITE === 'undefined' || !SITE.home) return;
  const im = SITE.home.invitation;
  m.innerHTML = `<img src="${rel(im.src)}" alt="${im.alt}">`;
})();

/* ── HOMEPAGE COMMUNITY POSTER ── */
/* Fills [data-home-poster] from SITE.home.poster (config.js) — the one
   large image that replaced the six-slide flyer carousel (Aug 2026). */
(function renderHomePoster() {
  const m = document.querySelector('[data-home-poster]');
  if (!m || typeof SITE === 'undefined' || !SITE.home || !SITE.home.poster) return;
  const p = SITE.home.poster;
  m.innerHTML = `
    <figure class="photo-figure photo-figure--poster">
      <img src="${rel(p.src)}" alt="${p.alt}">
      ${p.caption ? `<figcaption>${p.caption}</figcaption>` : ''}
    </figure>`;
})();

/* ── HOMEPAGE BROCHURE PREVIEWS ── */
/* Fills [data-brochures] from SITE.home.brochures (config.js) with two
   portrait previews of the printed materials. While a file is missing,
   the slot swaps to a labeled placeholder automatically (same pattern
   as the partner-logo monogram fallback); once the real image exists it
   becomes clickable to view full size. */
(function renderBrochures() {
  const m = document.querySelector('[data-brochures]');
  if (!m || typeof SITE === 'undefined' || !SITE.home || !SITE.home.brochures) return;
  m.classList.add('brochure-duo');
  m.innerHTML = SITE.home.brochures.map((b, i) => `
    <a class="brochure" href="${rel(b.src)}" target="_blank" rel="noopener"
       aria-label="View full size: ${b.alt}">
      <img src="${rel(b.src)}" alt="${b.alt}" loading="lazy"
           onerror="this.parentElement.classList.add('brochure--missing');this.parentElement.removeAttribute('href');this.parentElement.removeAttribute('target');this.remove();">
      <span class="brochure__fallback">
        <small>Brochure ${i + 1} — coming soon</small>
        <span>One of our printed brochures will appear here.</span>
      </span>
    </a>`).join('');
})();

/* ── HOMEPAGE COMMUNITY LOGO STRIP ── */
/* Fills [data-community-logos] from SITE.home.communities (config.js).
   Each item links to that community's partner page (partner.html?p=slug),
   pulling the logo from js/partners.js — so a visitor who scanned a QR
   code at, say, Ronald McDonald House immediately finds their place. */
(function renderCommunityStrip() {
  const m = document.querySelector('[data-community-logos]');
  if (!m || typeof SITE === 'undefined' || !SITE.home || !SITE.home.communities) return;
  if (typeof PARTNERS === 'undefined') return;
  m.classList.add('logo-strip');
  m.innerHTML = SITE.home.communities.map(c => {
    const p = PARTNERS[c.slug];
    if (!p) return '';
    return `
    <a class="logo-strip__item" href="${rel(`partner.html?p=${c.slug}`)}">
      ${logoChip(p)}
      <span class="logo-strip__text">
        <span class="logo-strip__name">${c.label}</span>
        <span class="logo-strip__line">${c.line || ''}</span>
      </span>
      <span class="index-item__go" aria-hidden="true">→</span>
    </a>`;
  }).join('');
})();

/* ── FEATURED PRESS (Media page) ── */
/* Fills [data-press-feature] from SITE.press (config.js) as one
   polished bilingual article card per entry. */
(function renderPress() {
  const m = document.querySelector('[data-press-feature]');
  if (!m || typeof SITE === 'undefined' || !SITE.press || !SITE.press.length) return;
  m.innerHTML = SITE.press.map(a => `
    <article class="press-card reveal">
      <div class="press-card__media">
        <img src="${a.image.src}" alt="${a.image.alt}" loading="lazy"
             onerror="this.parentElement.classList.add('press-card__media--empty');this.remove();">
        <span class="press-card__media-fallback" aria-hidden="true">♪<small>${a.publisher}</small></span>
      </div>
      <div class="press-card__body">
        <h3 class="press-card__title">${a.title}</h3>
        <p class="press-card__publisher">${a.publisher}</p>
        <p class="press-card__desc">${a.description}</p>
        <p class="press-card__langs">${a.languages}</p>
        <div class="press-card__actions">
          ${a.links.map((l, li) => `<a class="btn ${li ? 'btn--ink' : 'btn--gold'} btn--sm" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('')}
        </div>
      </div>
    </article>`).join('');
})();

/* ── PARTNER PAGE RENDER ── */
(function renderPartner() {
  const root = document.getElementById('partner-root');
  if (!root || typeof PARTNERS === 'undefined') return;
  const slug = new URLSearchParams(location.search).get('p');
  const p = PARTNERS[slug];

  if (!p) {
    root.innerHTML = `
    <section class="page-hero"><div class="container">
      <h1>Choose a community</h1>
      <p class="page-hero__sub">This link didn't match a partner page. Pick one below.</p>
    </div></section>
    <section class="section"><div class="container"><div class="index-list">
      ${pathwayList().map(pp => `
        <a class="index-item index-item--logo" href="partner.html?p=${pp.slug}">${logoChip(pp)}
        <span><span class="index-item__title">${pp.name}</span>
        <span class="index-item__meta">${pp.audience || ''}</span></span>
        <span class="index-item__go" aria-hidden="true">→</span></a>`).join('')}
    </div></div></section>`;
    return;
  }

  document.title = `${p.name} — WE ARE WITH YOU`;
  const cards = p.cards.map((c) => `
    <div class="card">
      <h3>${c.title}</h3><p>${c.text}</p>
      <a class="btn btn--ink btn--sm" ${c.form ? `data-form="${c.form}" href="contact.html"` : `href="${c.href}"`}>${c.button}</a>
    </div>`).join('');

  root.innerHTML = `
  <section class="page-hero"><div class="container">
    ${p.logo ? logoChip(p, 'logo-chip--hero') : ''}
    <h1>${p.heroTitle}</h1>
    <p class="page-hero__sub">${p.heroText}</p>
  </div></section>

  <section class="section"><div class="container">
    <div class="section-head"><p>${p.about}</p></div>
    <div class="cards cards--3">${cards}</div>
    <p class="caption" style="margin-top:2rem;">This page is usually reached through a QR code posted at ${p.name} — on flyers, cards, and program tables.</p>
  </div></section>

  <section class="section section--dark"><div class="container center">
    ${p.closing.map((line, i) => i === p.closing.length - 1
      ? `<h2 style="margin-top:1rem;"><em style="color:var(--gold-2)">${line}</em></h2>`
      : `<p class="lead" style="margin-inline:auto;">${line}</p>`).join('')}
    <div style="margin-top:2.5rem;"><a class="btn btn--gold" href="contact.html">Connect with us</a></div>
  </div></section>`;

  // re-wire form buttons created after initial pass
  document.querySelectorAll('#partner-root [data-form]').forEach(wireFormButton);
})();

/* ── READ MORE / SHOW LESS ── */
/* Wires every button.read-more[aria-controls] to its .more block.
   Each toggle is independent; state lives in aria-expanded + .open.
   The expanded copy stays in the HTML (SEO), hidden accessibly
   (aria-hidden + CSS visibility) until opened. */
(function wireReadMore() {
  document.querySelectorAll('button.read-more[aria-controls]').forEach(btn => {
    const target = document.getElementById(btn.getAttribute('aria-controls'));
    if (!target) return;
    btn.addEventListener('click', () => {
      const open = target.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      target.setAttribute('aria-hidden', String(!open));
      const label = btn.querySelector('[data-more-label]');
      const arrow = btn.querySelector('.read-more__arrow');
      if (label) label.textContent = open ? 'Show Less' : 'Read More';
      if (arrow) arrow.textContent = open ? '↑' : '↓';
    });
  });
})();

/* ── SCROLL REVEAL ── */
(function reveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => io.observe(el));
})();
