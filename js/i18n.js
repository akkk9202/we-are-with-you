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
  "footer.platform": "플랫폼",
  "footer.connect": "연결",
  "footer.email": "이메일 보내기",
  "footer.media": "미디어",
  "footer.join": "함께하기",
  "footer.about": "소개",
  "form.comingSoon": "준비 중입니다 — 곧 열릴 예정이에요",
  "home.carouselNote": "안내: 위 샘플 전단지의 QR 코드는 화면 표시용입니다. 각 코드는 파트너 커뮤니티의 특정 활동에서만 활성화되므로, 이 화면에서 스캔하셔도 열리지 않습니다.",

  /* ── GLOBAL · partner page template (rendered by site.js) ── */
  "partner.eyebrow": "WE ARE WITH YOU · 파트너 커뮤니티",
  "partner.aboutEyebrow": "이 커뮤니티에 대하여",
  "partner.aboutTitle": "이곳을 위해 만들어진 페이지입니다",
  "partner.qrEyebrow": "스캔하고, 열고, 함께하세요",
  "partner.qrTitle": "QR 코드 하나면 바로 이 페이지로",
  "partner.qrText": "이 페이지는 브로셔, 포스터, 카드, 대기실, 프로그램 테이블, 뉴스레터, 디지털 메시지 속 QR 코드를 통해 공유됩니다 — 한 번의 스캔으로 정확히 이곳에 도착합니다.",
  "partner.connect": "함께 연결되기",
  "partner.pathway": "파트너",
  "partner.openPage": "페이지 열기",
  "partner.notFoundEyebrow": "프로그램",
  "partner.notFoundTitle": "커뮤니티를 선택해 주세요",
  "partner.notFoundText": "링크와 일치하는 파트너 페이지를 찾지 못했습니다. 아래에서 하나를 선택해 주세요.",

  /* ── HOMEPAGE (index.html) ── */
  "home.hero.title": "<em>WE ARE WITH YOU</em>에 오신 것을 환영합니다.",
  "home.hero.sub": "오늘, 어떤 격려가 필요하신가요? 이 페이지는 당신을 위해 만들어졌습니다 — 병원에서, 가족의 공간에서, 교실에서, 혹은 집에서의 조용한 순간에도. 어려운 곳에서 누구도 혼자여서는 안 된다고 믿는 학생들이 준비한 한 통의 메시지, 한 곡의 음악, 하나의 작은 활동으로 시작해 보세요.",
  "home.hero.btnFind": "내 커뮤니티 찾기",

  "home.forYou.eyebrow": "당신을 위해",
  "home.forYou.title": "필요한 곳에서 시작하세요",
  "home.forYou.sub": "저희가 누구인지 몰라도 괜찮습니다. 이곳의 모든 것은 지금 방문하신 바로 그분을 위해 만들어졌습니다.",
  "home.forYou.tag1": "시작은 여기서",
  "home.forYou.text1": "당신을 위해 쓰인 한 통의 따뜻한 메시지. 모든 파트너십도, 모든 방문도 여기서 시작됩니다.",
  "home.forYou.btn1": "메시지 받기",
  "home.forYou.tag2": "희망이 필요할 때",
  "home.forYou.text2": "누군가에게 희망이 필요한 순간을 위해 모아 둔 메시지, 음악, 그리고 이야기들.",
  "home.forYou.btn2": "Hope Capsule 열기",
  "home.forYou.tag3": "들어보세요",
  "home.forYou.title3": "오늘의 음악",
  "home.forYou.text3": "학생 연주자들이 나누는 연주와 조용한 음악, 그리고 밝은 노래들.",
  "home.forYou.btn3": "지금 듣기",
  "home.forYou.tag4": "함께해요",
  "home.forYou.title4": "가족과 함께하는 활동",
  "home.forYou.text4": "어디서든 가족이 함께 즐길 수 있는 쉬운 음악, 리듬, 배움 활동들.",
  "home.forYou.btn4": "활동 해보기",
  "home.forYou.tag5": "읽고 나누기",
  "home.forYou.title5": "희망의 이야기",
  "home.forYou.text5": "모든 파트너 커뮤니티에서 전해 온 힘과 기억, 연결의 이야기들.",
  "home.forYou.btn5": "내 커뮤니티 찾기",

  "home.omfy.eyebrow": "대표 프로그램",
  "home.omfy.title": "모든 파트너십은<br>One Message for You로 시작됩니다.",
  "home.omfy.p1": "병원이든, 로널드 맥도날드 하우스든, 학교든, 시니어 커뮤니티든 — 모든 파트너십은 똑같이 시작됩니다. 누군가 한 통의 격려 메시지를 나누는 것. 그 작은 메시지가 연결의 시작이 됩니다.",
  "home.omfy.p2": "그 다음에는 각 파트너 커뮤니티의 이야기에 귀 기울이고, 그곳에 꼭 맞는 랜딩 페이지와 QR 시스템, 프로그램 경험을 함께 만들어 갑니다.",
  "home.omfy.btn": "One Message for You 알아보기",
  "home.omfy.tag1": "암 치료 센터",
  "home.omfy.card1title": "신청곡과 이야기",
  "home.omfy.card1": "암 치료 센터에는 치료의 여정에 의미를 더하는 신청곡과 환우들의 이야기가 필요할 수 있습니다.",
  "home.omfy.tag2": "패밀리 하우스",
  "home.omfy.card2title": "가족을 위한 편지",
  "home.omfy.card2": "로널드 맥도날드 하우스에는 긴 머무름의 시간을 보내는 아이들과 부모님을 위한 편지가 필요할 수 있습니다.",
  "home.omfy.tag3": "해외 학교",
  "home.omfy.card3title": "국경을 넘는 배움",
  "home.omfy.card3": "필리핀의 한 학교에는 영어 수업, 음악 영상, 동화 읽기, 쉬운 학습 활동이 필요할 수 있습니다.",
  "home.omfy.note": "파트너마다 필요한 것은 다르지만, 모든 관계는 같은 작은 걸음에서 시작됩니다.",

  "home.how.eyebrow": "희망을 만드는 방법",
  "home.how.title": "하나의 플랫폼.<br>하나의 메시지.<br>많은 커뮤니티.",
  "home.how.p1": "모든 파트너는 One Message for You로 시작합니다. 거기서부터 각 커뮤니티는 자신만의 경험을 만들어 갑니다 — 파트너 페이지에는 이런 것들이 담길 수 있습니다:",
  "home.how.li1": "One Message for You",
  "home.how.li2": "신청곡",
  "home.how.li3": "편지와 메시지",
  "home.how.li4": "음악 영상",
  "home.how.li5": "교육 영상",
  "home.how.li6": "환우 · 가족 · 학생들의 이야기",
  "home.how.li7": "조용한 음악",
  "home.how.li8": "함께하는 활동",
  "home.how.li9": "Hope Capsule",
  "home.how.li10": "QR 코드",
  "home.how.li11": "다국어 콘텐츠",
  "home.how.p2": "모든 파트너는 자신만의 페이지를 갖습니다 — 개인적으로 느껴지지만, 여전히 하나의 WE ARE WITH YOU 플랫폼에 속해 있습니다.",

  "home.circle.eyebrow": "플랫폼의 심장",
  "home.circle.title": "The Circle of Love",
  "home.circle.lead": "격려는 받은 사람에게서 멈추지 않습니다. 계속 이어집니다.",
  "home.circle.f1": "한 학생이 음악을 나눕니다.",
  "home.circle.f2": "한 환우가 노래를 신청합니다.",
  "home.circle.f3": "한 가족이 함께 노래합니다.",
  "home.circle.f4": "한 아이가 편지를 받습니다.",
  "home.circle.f5": "한 의료진이 격려를 나눕니다.",
  "home.circle.f6": "한 어르신이 추억을 들려주십니다.",
  "home.circle.f7": "학생은 그 경험을 새로운 수업, 이야기, 영상, 프로젝트로 만듭니다.",
  "home.circle.f8": "그리고 서클은 다시 시작됩니다.",
  "home.circle.quote": "The Circle of Love는 나눔을 관계로 바꿉니다.",

  "home.pathways.eyebrow": "프로그램",
  "home.pathways.title": "WE ARE WITH YOU가 함께하는 곳",
  "home.pathways.btn": "전체 프로그램 보기",

  "home.why.eyebrow": "우리가 존재하는 이유",
  "home.why.title": "어려운 곳에서 누구도 혼자여서는 안 됩니다",
  "home.why.p1": "병실, 대기실, 시니어 커뮤니티, 학교, 가족 지원 센터는 때로 외로운 곳이 될 수 있습니다. WE ARE WITH YOU는 그런 공간에 연결을 전하기 위해 만들어졌습니다.",
  "home.why.p2": "음악, 편지, 신청곡, 교육 영상, 이야기, 그리고 함께하는 활동을 통해, 누군가 자신이 보이고, 들리고, 기억되고 있다고 느낄 수 있는 작은 길들을 만듭니다.",
  "home.why.quote": "우리의 목표는 격려를 전하는 것만이 아닙니다 — 격려가 한 사람에게서 또 다른 사람에게로 계속 흘러가는 서클을 만드는 것입니다.",

  "home.model.eyebrow": "플랫폼 모델",
  "home.model.title": "하나의 템플릿.<br>수많은 이야기.",
  "home.model.p1": "모든 파트너 페이지는 익숙한 구조를 따릅니다 — WE ARE WITH YOU, 파트너 소개, One Message for You, 프로그램 카드, Hope Capsule, QR 접속, 그리고 커뮤니티 메시지.",
  "home.model.p2": "이 일관성이 중요합니다. 암 치료 페이지든, 신생아 집중치료실 페이지든, 학교 페이지든 — 누구나 열자마자 어떻게 참여하는지 알 수 있습니다. 디자인이 바뀌고, 언어가 바뀌고, 내용이 바뀌어도 경험은 하나로 이어집니다.",
  "home.model.p3": "<strong>그 일관성이 곧 WE ARE WITH YOU의 브랜드가 됩니다.</strong>",
  "home.model.cardTitle": "모든 파트너 페이지",
  "home.model.f1": "WE ARE WITH YOU",
  "home.model.f2": "파트너 소개",
  "home.model.f3": "One Message for You",
  "home.model.f4": "프로그램 카드",
  "home.model.f5": "Hope Capsule",
  "home.model.f6": "QR 접속",
  "home.model.f7": "커뮤니티 메시지",

  "home.students.eyebrow": "플랫폼 뒤의 학생들",
  "home.students.title": "학생들이 만들었습니다 — 그리고 계속 키워가고 있습니다",
  "home.students.p1": "WE ARE WITH YOU 뒤에는 학생 주도 혁신 공동체 <strong>GYCO</strong>가 있습니다. 학생들은 봉사만 하지 않습니다 — 커뮤니티에 필요한 것을 발견하고, 새로운 아이디어를 제안하고, 기관과 협력하며, 프로그램을 직접 만들고 운영합니다. 그렇게 창작자, 리더, 연구자, 협력자로 성장합니다.",
  "home.students.p2": "학생들은 <strong>GYCO</strong>에서 배우고 이끕니다. <strong>NADO School</strong>을 통해 성장합니다. 그리고 <strong>WE ARE WITH YOU</strong>는 학생들이 만든 첫 번째 대표 이니셔티브입니다 — 다음 이니셔티브들이 계속 태어날 것입니다.",

  "home.closing.title": "희망은 한 통의 메시지에서 시작될 수 있습니다 — 한 페이지, 한 곡, 한 통의 편지, 하나의 QR 코드에서.",
  "home.closing.lead": "파트너가 템플릿을 고릅니다. 학생이 콘텐츠를 함께 만듭니다. 커뮤니티가 페이지를 받습니다. 누군가 참여하고 — 그 이야기가 다음 서클을 만듭니다. WE ARE WITH YOU는 이렇게 자랍니다.",
  "home.closing.btn1": "파트너 되기",
  "home.closing.btn2": "서클에 함께하기",

  /* ── ONE MESSAGE FOR YOU (one-message-for-you.html) ── */
  "omfy.hero.eyebrow": "대표 프로그램",
  "omfy.hero.title": "한 통의 메시지가.<br>누군가의 하루를 바꿀 수 있습니다.",
  "omfy.hero.sub": "모든 격려는 하나의 짧은 메시지에서 시작됩니다.",
  "omfy.what.p1": "질병, 장애, 외로움, 혹은 힘든 계절을 지나는 누군가에게 희망의 말을 전해 주세요. 이 메시지들이 모여 자라나는 격려의 공동체가 됩니다.",
  "omfy.join.eyebrow": "참여하는 방법",
  "omfy.join.title": "시작하는 세 가지 쉬운 방법",
  "omfy.join.tag1": "첫걸음",
  "omfy.join.card1title": "메시지 한 통 쓰기",
  "omfy.join.card1": "누군가 혼자가 아니라는 것을 알게 해 줄 짧은 메시지를 나눠 주세요.",
  "omfy.join.btn1": "메시지 쓰기",
  "omfy.join.tag2": "한 걸음 더",
  "omfy.join.card2title": "나의 목소리 더하기",
  "omfy.join.card2": "사진, 영상, 그림, 음악 — 나만의 창작으로 마음을 전해 주세요.",
  "omfy.join.btn2": "목소리 나누기",
  "omfy.join.tag3": "계속 함께하기",
  "omfy.join.card3title": "서클의 일원 되기",
  "omfy.join.card3": "격려가 한 사람에게서 또 다른 사람에게로 흘러가도록 함께해 주세요.",
  "omfy.join.btn3": "서클에 함께하기",
  "omfy.where.eyebrow": "내 메시지가 가는 곳",
  "omfy.where.title": "모든 파트너십의 첫걸음",
  "omfy.where.p1": "모든 파트너십은 One Message for You로 시작됩니다. 메시지는 파트너 페이지, QR 코드, 행사를 통해 환우, 가족, 어르신, 학생, 의료진에게 전해지고 — 학생들은 그 메시지를 음악과 이야기, 경험으로 만들어 계속 여행하게 합니다.",
  "omfy.where.cardTitle": "하나의 메시지가 닿는 곳",
  "omfy.closing.title": "\"작은 격려란 없습니다.\"",
  "omfy.closing.lead": "모든 메시지에는 누군가에게 이렇게 말해 줄 힘이 있습니다: 우리가 당신과 함께 있습니다.",
  "omfy.closing.btn1": "메시지 한 통 쓰기",
  "omfy.closing.btn2": "내 커뮤니티 찾기",

  /* ── HOPE CAPSULE (hope-capsule.html) ── */
  "capsule.hero.eyebrow": "WE ARE WITH YOU 프로그램",
  "capsule.hero.sub": "메시지와 음악, 이야기와 마음을 모은 작은 컬렉션 — 누군가에게 희망이 필요한 순간을 위해 만들어졌습니다.",
  "capsule.what.p1": "Hope Capsule은 메시지, 노래, 사진, 이야기를 디지털 컬렉션으로 모아 — 희망이 필요한 곳 어디서든 — 언제든 다시 열어볼 수 있게 합니다.",
  "capsule.how.eyebrow": "캡슐이 만들어지는 과정",
  "capsule.how.title": "학생들이 모으는 이야기",
  "capsule.how.sub": "GYCO 학생 통신원(Student Correspondents)이 파트너 커뮤니티의 이야기를 기록하고 나누며 만듭니다.",
  "capsule.how.tag1": "듣기",
  "capsule.how.card1title": "이야기를 모읍니다",
  "capsule.how.card1": "학생들이 — 언제나 동의를 얻어 — 커뮤니티 구성원을 인터뷰하고 공연과 봉사를 취재합니다.",
  "capsule.how.tag2": "만들기",
  "capsule.how.card2title": "이야기가 미디어가 됩니다",
  "capsule.how.card2": "인터뷰, 사진, 영상, 편지가 디지털 미디어로 만들어집니다.",
  "capsule.how.tag3": "나누기",
  "capsule.how.card3title": "미디어가 캡슐이 됩니다",
  "capsule.how.card3": "각 컬렉션은 파트너 페이지와 QR 코드로 열립니다.",
  "capsule.where.eyebrow": "캡슐이 사는 곳",
  "capsule.where.title": "모든 파트너 페이지에 하나씩",
  "capsule.where.p1": "각 파트너 페이지에는 그 커뮤니티를 위한 캡슐이 있습니다 — NICU를 위해서는 조용하게, 패밀리 하우스를 위해서는 밝게, 시니어를 위해서는 추억이 가득하게.",
  "capsule.where.cardTitle": "Hope Capsule 안에는",
  "capsule.where.f1": "격려의 메시지",
  "capsule.where.f2": "음악과 공연",
  "capsule.where.f3": "인터뷰와 이야기",
  "capsule.where.f4": "사진과 영상",
  "capsule.where.f5": "편지와 감상",
  "capsule.closing.title": "희망을 간직합니다 — 가장 필요한 순간에 열어볼 수 있도록.",
  "capsule.closing.lead": "캡슐을 열어보거나, 무언가를 더해 주세요. 모든 참여가 서클을 계속 움직이게 합니다.",
  "capsule.closing.btn1": "Hope Capsule 열기",
  "capsule.closing.btn2": "메시지 한 통으로 시작하기",
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
