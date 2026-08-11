/* ============================================================
   I18N.JS — bilingual (English / 한국어) support.

   HOW IT WORKS
   · The visitor's language is stored in localStorage ("wawy-lang").
     English is always the default; Korean is opt-in via the 한국어
     button in the navigation (added by js/site.js).
   · Static page text: elements tagged data-i18n="key" are swapped
     to Korean from the KO dictionary below when Korean is active.
     The English text stays in the HTML as the permanent fallback
     (and for visitors with JavaScript off).
   · Dynamic text (nav, footer, partner pages, cards) is translated
     by js/site.js using I18N.t(key) and the *_ko fields in
     js/config.js and js/partners.js.

   EDITING
   · To fix a Korean phrase, edit it here (or the *_ko field in
     config.js / partners.js). Never remove the English original.
   · Program & brand names (WE ARE WITH YOU, One Message for You,
     Hope Capsule, Taps/Winds/Voices of Love, GYCO, NADO School)
     intentionally stay in English in both languages — they match
     the printed materials and QR flyers.
   ============================================================ */

const I18N_KO = {

  /* ── GLOBAL · footer & shared chrome ── */
  "footer.programs": "프로그램",
  "footer.platform": "소개",
  "footer.connect": "연결",
  "footer.email": "이메일 보내기",
  "footer.media": "미디어",
  "footer.join": "함께하기",
  "footer.about": "소개",
  "form.comingSoon": "준비 중입니다 — 곧 열릴 예정이에요",
  "home.carouselNote": "안내: 위 샘플 전단지의 QR 코드는 화면 표시용입니다. 각 코드는 파트너 커뮤니티의 특정 활동에서만 활성화되므로, 이 화면에서 스캔하셔도 열리지 않습니다.",

  /* ── GLOBAL · partner page template (rendered by site.js) ── */
  "partner.connect": "함께 연결되기",
  "partner.pathway": "파트너",
  "partner.openPage": "페이지 열기",
  "partner.notFoundTitle": "커뮤니티를 선택해 주세요",
  "partner.notFoundText": "링크와 일치하는 파트너 페이지를 찾지 못했습니다. 아래에서 하나를 선택해 주세요.",

  /* NOTE (Aug 2026 redesign): the Korean strings for the rewritten
     public pages (home, One Message for You, Hope Capsule) were removed
     because the English copy changed. When the language toggle ships,
     re-translate from the current English rather than restoring the
     old strings — the old ones no longer match what the pages say. */
};

/* ── ENGINE ── */
const I18N = (() => {
  let lang = 'en';
  try { lang = localStorage.getItem('wawy-lang') || 'en'; } catch (e) { /* private mode */ }
  if (lang !== 'ko') lang = 'en';

  const t = (key) => (lang === 'ko' ? I18N_KO[key] : undefined);

  const setLang = (next) => {
    try { localStorage.setItem('wawy-lang', next === 'ko' ? 'ko' : 'en'); } catch (e) { /* ignore */ }
    location.reload();
  };

  /* Swap all data-i18n tagged elements to Korean. English stays in
     the HTML as the fallback, so this only runs when Korean is on. */
  const apply = () => {
    if (lang !== 'ko') return;
    document.documentElement.lang = 'ko';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = I18N_KO[el.dataset.i18n];
      if (v != null) el.innerHTML = v;
    });
  };

  return { lang, t, setLang, apply, ko: I18N_KO };
})();

I18N.apply();
