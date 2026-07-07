/* ============================================================
   SITE.JS — builds the nav + footer on every page from
   js/config.js, renders pathway cards + partner pages from
   js/partners.js, powers the homepage carousel and the Media
   press card, and handles scroll/reveal/menu behavior.
   You should rarely need to edit this file.
   ============================================================ */

const ringMark = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <circle cx="12" cy="12" r="9" stroke="#C4A24E" stroke-width="1.6"/>
  <circle cx="12" cy="3" r="2" fill="#C4A24E"/>
</svg>`;

/* ── SHARED HELPERS ── */

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
    <img src="${p.logo}" alt="${p.logoAlt || p.name + ' logo'}" loading="lazy"
         onerror="this.parentElement.classList.add('logo-chip--missing');this.remove();">
    <span class="logo-chip__fallback" aria-hidden="true">${monogram(p.name)}</span>
  </span>`;

/* ── NAV ── */
(function buildNav() {
  const mount = document.getElementById('site-nav');
  if (!mount || typeof SITE === 'undefined') return;
  const current = (location.pathname.split('/').pop() || 'index.html') + location.search;

  const links = SITE.nav.map(item => {
    const isActive = current.startsWith(item.href.split('?')[0]) &&
      (item.href !== 'index.html' || current.startsWith('index.html'));
    if (item.dropdown) {
      const items = item.dropdown === 'partners'
        ? pathwayList().map(p => ({ label: p.name, href: `partner.html?p=${p.slug}` }))
        : item.dropdown;
      const dd = items.map(d =>
        `<li><a href="${d.href}">${d.label}</a></li>`).join('');
      return `<li>
        <a href="${item.href}" class="${isActive ? 'active' : ''}" aria-haspopup="true">${item.label} <span class="nav__caret">▾</span></a>
        <ul class="nav__dropdown">${dd}</ul>
      </li>`;
    }
    const cls = [item.cta ? 'btn btn--gold btn--sm nav__cta' : '', isActive && !item.cta ? 'active' : ''].join(' ').trim();
    return `<li><a href="${item.href}" ${cls ? `class="${cls}"` : ''}>${item.label}</a></li>`;
  }).join('');

  mount.outerHTML = `
  <nav class="nav" aria-label="Main navigation">
    <a href="index.html" class="nav__logo">${ringMark(22)} ${SITE.name}</a>
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
    .map(p => `<li><a href="partner.html?p=${p.slug}">${p.name}</a></li>`).join('');
  const connect = [
    SITE.instagram ? `<li><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a></li>` : '',
    SITE.youtube ? `<li><a href="${SITE.youtube}" target="_blank" rel="noopener">YouTube</a></li>` : '',
    `<li><a href="contact.html">Email us</a></li>`,
  ].join('');

  mount.outerHTML = `
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__brand-name">${ringMark(20)} ${SITE.name}</div>
        <p>${SITE.footerNote}</p>
      </div>
      <div class="footer__col"><h4>Programs</h4><ul>${partnerLinks}</ul></div>
      <div class="footer__col"><h4>Platform</h4><ul>
        <li><a href="student-community.html">GYCO</a></li>
        <li><a href="learning.html">NADO School</a></li>
        <li><a href="media.html">Media</a></li>
        <li><a href="join.html">Join Us</a></li>
        <li><a href="about.html">About</a></li>
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
   If the link is still a REPLACE_ME placeholder, the button routes
   to the contact page instead of a dead link. */
(function wireForms() {
  if (typeof SITE === 'undefined') return;
  document.querySelectorAll('[data-form]').forEach(el => {
    const url = SITE.forms[el.dataset.form];
    el.setAttribute('href', url && !url.startsWith('REPLACE_ME') ? url : 'contact.html');
    if (url && !url.startsWith('REPLACE_ME')) { el.target = '_blank'; el.rel = 'noopener'; }
  });
  document.querySelectorAll('[data-email]').forEach(el => {
    if (SITE.email && !SITE.email.startsWith('REPLACE_ME')) {
      el.textContent = SITE.email;
      if (el.tagName === 'A') el.href = 'mailto:' + SITE.email;
    } else {
      el.textContent = 'Email coming soon';
    }
  });
})();

/* ── PATHWAY CARDS (homepage + Programs page) ── */
/* Any element with [data-pathway-cards] is filled with one card per
   partner in js/partners.js, in `order`. Edit names, order, logos,
   and card text there — every page updates together. */
(function renderPathwayCards() {
  const mounts = document.querySelectorAll('[data-pathway-cards]');
  if (!mounts.length) return;
  const cards = pathwayList().map((p, i) => `
    <article class="card card--pathway reveal reveal--d${(i % 3) + 1}">
      ${logoChip(p)}
      <span class="card__tag">Pathway</span>
      <h3>${p.name}</h3>
      <p>${p.cardText || p.heroText}</p>
      <a class="btn btn--ink btn--sm" href="partner.html?p=${p.slug}">Open page</a>
    </article>`).join('');
  mounts.forEach(m => { m.innerHTML = cards; });
})();

/* ── HOMEPAGE INVITATION IMAGE ── */
/* Fills [data-home-invitation] from SITE.home.invitation (config.js). */
(function renderHomeInvitation() {
  const m = document.querySelector('[data-home-invitation]');
  if (!m || typeof SITE === 'undefined' || !SITE.home) return;
  const im = SITE.home.invitation;
  m.innerHTML = `<img src="${im.src}" alt="${im.alt}">`;
})();

/* ── CAROUSEL ── */
/* Hydrates [data-carousel="home"] from SITE.home.carousel (config.js).
   One image at a time · arrows · dots · keyboard · swipe · no autoplay. */
(function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(mount => {
    if (typeof SITE === 'undefined' || !SITE.home) return;
    const slides = mount.dataset.carousel === 'home' ? SITE.home.carousel : null;
    if (!slides || !slides.length) return;

    mount.classList.add('carousel');
    mount.setAttribute('role', 'group');
    mount.setAttribute('aria-roledescription', 'carousel');
    mount.setAttribute('aria-label', mount.dataset.carouselLabel || 'Image carousel');
    mount.tabIndex = 0;

    mount.innerHTML = `
      <div class="carousel__viewport" aria-live="polite">
        <div class="carousel__track">
          ${slides.map((s, i) => `
          <figure class="carousel__slide" role="group" aria-roledescription="slide"
                  aria-label="Slide ${i + 1} of ${slides.length}">
            <img src="${s.src}" alt="${s.alt}" ${i ? 'loading="lazy"' : ''} draggable="false">
            ${s.caption ? `<figcaption>${s.caption}</figcaption>` : ''}
          </figure>`).join('')}
        </div>
      </div>
      <button type="button" class="carousel__arrow carousel__arrow--prev" aria-label="Previous slide">&#8249;</button>
      <button type="button" class="carousel__arrow carousel__arrow--next" aria-label="Next slide">&#8250;</button>
      <div class="carousel__dots">
        ${slides.map((s, i) => `<button type="button" class="carousel__dot" aria-label="Go to slide ${i + 1}"></button>`).join('')}
      </div>`;

    const track = mount.querySelector('.carousel__track');
    const dots = [...mount.querySelectorAll('.carousel__dot')];
    let index = 0;
    const go = (n) => {
      index = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.setAttribute('aria-current', di === index ? 'true' : 'false'));
    };
    mount.querySelector('.carousel__arrow--prev').addEventListener('click', () => go(index - 1));
    mount.querySelector('.carousel__arrow--next').addEventListener('click', () => go(index + 1));
    dots.forEach((d, di) => d.addEventListener('click', () => go(di)));
    mount.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    });

    // touch / pointer swipe
    let startX = null;
    const vp = mount.querySelector('.carousel__viewport');
    vp.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    vp.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    });
    vp.addEventListener('pointercancel', () => { startX = null; });

    go(0);
  });
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
        <div class="press-card__labels">
          <span class="chip chip--gold">${a.label}</span>
          <span class="chip chip--blue">Bilingual Coverage</span>
        </div>
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
      <div class="eyebrow">Programs</div>
      <h1>Choose a community</h1>
      <p class="page-hero__sub">This link didn't match a partner page. Pick one below.</p>
    </div></section>
    <section class="section"><div class="container"><div class="cards cards--3">
      ${pathwayList().map(pp => `
        <div class="card">${logoChip(pp)}<h3>${pp.name}</h3><p>${pp.heroText}</p>
        <a class="btn btn--ink btn--sm" href="partner.html?p=${pp.slug}">Open page</a></div>`).join('')}
    </div></div></section>`;
    return;
  }

  document.title = `${p.name} — WE ARE WITH YOU`;
  const cards = p.cards.map((c, i) => `
    <div class="card reveal reveal--d${(i % 3) + 1}">
      <h3>${c.title}</h3><p>${c.text}</p>
      <a class="btn btn--ink btn--sm" ${c.form ? `data-form="${c.form}" href="contact.html"` : `href="${c.href}"`}>${c.button}</a>
    </div>`).join('');

  root.innerHTML = `
  <section class="page-hero"><div class="container">
    ${p.logo ? logoChip(p, 'logo-chip--hero') : ''}
    <div class="eyebrow">WE ARE WITH YOU · Partner Community</div>
    <h1>${p.heroTitle}</h1>
    <div class="page-hero__kicker">${SITE.tagline}</div>
    <p class="page-hero__sub">${p.heroText}</p>
  </div></section>

  <section class="section"><div class="container">
    <div class="section-head reveal"><div class="eyebrow">About this community</div>
      <h2>Made for this place</h2><p>${p.about}</p></div>
    <div class="cards cards--3">${cards}</div>
  </div></section>

  <section class="section section--mist"><div class="container center measure reveal">
    <div class="eyebrow eyebrow--center">Scan. Open. Participate.</div>
    <h2>One QR code, straight to this page</h2>
    <p style="color:var(--muted);margin-top:1rem;">This page can be shared through QR codes on brochures, posters, cards, waiting rooms, program tables, newsletters, and digital messages — so visitors land exactly here in one tap.</p>
  </section></div>

  <section class="section section--dark"><div class="container center reveal">
    ${p.closing.map((line, i) => i === p.closing.length - 1
      ? `<h2 style="margin-top:1rem;"><em style="color:var(--gold-2)">${line}</em></h2>`
      : `<p class="lead" style="margin-inline:auto;">${line}</p>`).join('')}
    <div style="margin-top:2.5rem;"><a class="btn btn--gold" href="contact.html">Connect with us</a></div>
  </div></section>`;

  // re-wire form buttons created after initial pass
  document.querySelectorAll('#partner-root [data-form]').forEach(el => {
    const url = SITE.forms[el.dataset.form];
    el.setAttribute('href', url && !url.startsWith('REPLACE_ME') ? url : 'contact.html');
    if (url && !url.startsWith('REPLACE_ME')) { el.target = '_blank'; el.rel = 'noopener'; }
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
