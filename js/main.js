/* WE ARE WITH YOU — Main JS v2 */

// Nav scroll
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile hamburger
const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.contains('nav__links--open');
    navLinks.classList.toggle('nav__links--open', !open);
    if (!open) {
      navLinks.style.cssText = `
        display:flex; flex-direction:column; position:absolute;
        top:100%; left:0; right:0; background:var(--navy);
        padding:1.5rem 2rem; gap:1.2rem; z-index:200;
        border-top:1px solid rgba(255,255,255,0.07);
      `;
      navLinks.querySelectorAll('.nav__dropdown').forEach(d => {
        d.style.cssText = 'position:static; opacity:1; visibility:visible; transform:none; border:none; padding-left:1rem;';
      });
    } else {
      navLinks.removeAttribute('style');
      navLinks.querySelectorAll('.nav__dropdown').forEach(d => d.removeAttribute('style'));
    }
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));
}

// Active nav
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// Contact form
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Message Sent ✓';
    btn.style.background = 'var(--teal)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// Media filter
const mediaCats = document.querySelectorAll('.media-cat');
if (mediaCats.length) {
  mediaCats.forEach(cat => {
    cat.addEventListener('click', () => {
      mediaCats.forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
    });
  });
  mediaCats[0]?.classList.add('active');
}
