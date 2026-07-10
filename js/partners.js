/* ============================================================
   PARTNER PATHWAYS — all pathway/partner content lives here.
   Each entry becomes a page at partner.html?p=SLUG and a card
   on the homepage + Programs page (rendered automatically).

   Fields on every partner:
     order    → position everywhere (nav dropdown, cards, footer)
     name     → the visible pathway name (edit here, updates site-wide)
     logo     → path to the partner logo (assets/logos/…)
     logoAlt  → accessible alt text for the logo
     cardText → short description shown on pathway cards
   If a logo file is missing, a clean monogram fallback shows
   automatically — the card never breaks.

   To add a partner: copy a block, change the slug + content,
   give it an order number — nav, cards, and footer update
   automatically. Card "form" values must match a key in
   SITE.forms (config.js), or use "href" for a direct link.
   ============================================================ */

const PARTNERS = {

  /* Slug kept as "cancer-care" so existing links & QR codes keep working.
     Visible name is City of Hope Atlanta (CTCA). */
  "cancer-care": {
    order: 1,
    name: "City of Hope Atlanta (CTCA)",
    // TODO: Swap in an updated logo anytime — assets/logos/city-of-hope-atlanta.png
    logo: "assets/logos/city-of-hope-atlanta.png",
    logoAlt: "City of Hope logo",
    cardText: "For patients, families, caregivers, survivors, and healthcare staff — song requests, Voices of Love, teaching videos, Hope Capsule, and messages of encouragement.",
    cardText_ko: "환우와 가족, 보호자, 완치자, 그리고 의료진을 위해 — 신청곡, Voices of Love, 교육 영상, Hope Capsule, 그리고 격려의 메시지.",
    heroTitle: "WE ARE WITH YOU at City of Hope Atlanta",
    heroTitle_ko: "City of Hope Atlanta의 WE ARE WITH YOU",
    heroText: "Music, messages, stories, and encouragement for patients, families, caregivers, survivors, and healthcare staff.",
    heroText_ko: "환우와 가족, 보호자, 완치자, 그리고 의료진을 위한 음악, 메시지, 이야기, 그리고 격려.",
    about: "This page was created for the City of Hope Atlanta community — formerly Cancer Treatment Centers of America (CTCA). Through it, students and community partners share music, letters, teaching videos, stories, and activities designed for patients and the people beside them. It may be reached through QR codes, printed materials, digital links, events, and partner programs.",
    about_ko: "이 페이지는 City of Hope Atlanta(구 CTCA) 커뮤니티를 위해 만들어졌습니다. 학생들과 커뮤니티 파트너들이 환우와 곁을 지키는 분들을 위해 준비한 음악, 편지, 교육 영상, 이야기, 그리고 활동을 이곳에서 나눕니다. QR 코드, 인쇄물, 디지털 링크, 행사, 파트너 프로그램을 통해 방문하실 수 있습니다.",
    cards: [
      /* Card #1 is always "One Message for You" — the signature program
         every partner begins with. Only the subtitle text changes per
         community. Keep it first on every partner. */
      { title: "One Message for You", text: "Every visit begins with one message. Read a message of encouragement written for you — or share one for a patient, family member, caregiver, survivor, or staff member.", text_ko: "모든 방문은 한 통의 메시지에서 시작됩니다. 당신을 위해 쓰인 격려의 메시지를 읽어보세요 — 또는 환우, 가족, 보호자, 완치자, 의료진을 위해 한 통을 남겨 주세요.", button: "Read & share a message", button_ko: "메시지 읽고 나누기", form: "letterSubmission" },
      { title: "Song Request", title_ko: "신청곡", text: "Request a meaningful song for yourself, your family, a caregiver, a patient, or a loved one. GYCO students may prepare the song for a live or recorded performance when possible.", text_ko: "나 자신, 가족, 보호자, 환우, 소중한 사람을 위해 의미 있는 노래를 신청해 주세요. 가능한 경우 GYCO 학생들이 라이브 또는 녹화 연주로 준비해 드립니다.", button: "Request a song", button_ko: "노래 신청하기", form: "songRequest" },
      { title: "Voices of Love", text: "Share the story, memory, or meaning behind a song. Patients, families, caregivers, survivors, and staff may share how music connects to their journey.", text_ko: "노래에 담긴 이야기와 추억, 의미를 나눠 주세요. 환우, 가족, 보호자, 완치자, 의료진 모두 음악이 자신의 여정과 어떻게 이어지는지 나눌 수 있습니다.", button: "Share your voice", button_ko: "내 이야기 나누기", form: "songRequest" },
      { title: "Taps of Love", text: "Watch short teaching videos created by students. Learn simple rhythms, music activities, breathing exercises, and creative ways to participate from wherever you are.", text_ko: "학생들이 만든 짧은 교육 영상을 만나보세요. 쉬운 리듬, 음악 활동, 호흡 연습 등 어디서든 함께할 수 있는 창의적인 방법을 배울 수 있습니다.", button: "Watch teaching videos", button_ko: "교육 영상 보기", href: "learning.html" },
      { title: "Patient Stories", title_ko: "환우들의 이야기", text: "Read or share reflections, encouragement, and meaningful moments from the cancer care community.", text_ko: "암 치료 커뮤니티의 감상과 격려, 의미 있는 순간들을 읽고 나눠 주세요.", button: "Share a story", button_ko: "이야기 나누기", form: "letterSubmission" },
      { title: "Hope Capsule", text: "Open a small collection of messages, music, reflections, and encouragement created for moments when someone needs hope.", text_ko: "누군가에게 희망이 필요한 순간을 위해 모은 메시지, 음악, 감상, 격려의 작은 컬렉션을 열어보세요.", button: "Open Hope Capsule", button_ko: "Hope Capsule 열기", form: "hopeCapsule" },
    ],
    closing: ["To every patient, family member, caregiver, survivor, and staff member:", "You are not alone.", "Even here, even now, we are with you."],
    closing_ko: ["모든 환우와 가족, 보호자, 완치자, 그리고 의료진 여러분께:", "당신은 혼자가 아닙니다.", "지금 이곳에서도, 우리가 당신과 함께 있습니다."],
  },

  "ronald-mcdonald-house": {
    order: 2,
    name: "Ronald McDonald House",
    // TODO: Swap in an updated logo anytime — assets/logos/ronald-mcdonald-house.png
    logo: "assets/logos/ronald-mcdonald-house.png",
    logoAlt: "Ronald McDonald House logo",
    cardText: "For children, parents, siblings, and families near hospitals — letters for kids and parents, happy music moments, family requests, and activities.",
    cardText_ko: "병원 곁에 머무는 아이들과 부모님, 형제자매, 가족을 위해 — 아이와 부모님을 위한 편지, 즐거운 음악, 가족 신청곡, 그리고 함께하는 활동.",
    heroTitle: "WE ARE WITH YOU at Ronald McDonald House",
    heroTitle_ko: "로널드 맥도날드 하우스의 WE ARE WITH YOU",
    heroText: "Music, letters, activities, and encouragement for children, parents, siblings, and families.",
    heroText_ko: "아이들과 부모님, 형제자매, 가족을 위한 음악, 편지, 활동, 그리고 격려.",
    about: "This page was created for families staying near hospitals while a child receives care. Through it, students share letters, cheerful music, sing-alongs, and simple activities that families can enjoy together during long and uncertain days.",
    about_ko: "이 페이지는 아이가 치료받는 동안 병원 곁에 머무는 가족들을 위해 만들어졌습니다. 길고 불확실한 날들 속에서도 가족이 함께 즐길 수 있도록, 학생들이 편지와 밝은 음악, 함께 부르는 노래, 그리고 쉬운 활동들을 이곳에서 나눕니다.",
    cards: [
      { title: "One Message for You", text: "One kind message can brighten a long stay. Read a message written for your family — or share one for a child, parent, or sibling staying near the hospital.", text_ko: "따뜻한 메시지 한 통이 긴 머무름을 밝혀 줄 수 있습니다. 우리 가족을 위해 쓰인 메시지를 읽어보세요 — 또는 병원 곁에 머무는 아이나 부모님, 형제자매를 위해 한 통을 남겨 주세요.", button: "Read & share a message", button_ko: "메시지 읽고 나누기", form: "letterSubmission" },
      { title: "Letters for Kids", title_ko: "아이들을 위한 편지", text: "Read kind messages written for children who may need encouragement, joy, or a reminder that people are thinking of them.", text_ko: "격려와 기쁨이 필요한 아이들, 그리고 많은 사람들이 자신을 생각하고 있다는 걸 알아야 할 아이들을 위해 쓰인 따뜻한 메시지들입니다.", button: "Read letters", button_ko: "편지 읽기", form: "letterSubmission" },
      { title: "Letters for Parents", title_ko: "부모님을 위한 편지", text: "Messages of support for parents and caregivers walking through long, difficult, or uncertain days.", text_ko: "길고 어렵고 불확실한 날들을 걸어가는 부모님과 보호자를 위한 응원의 메시지들입니다.", button: "Read parent letters", button_ko: "부모님 편지 읽기", form: "letterSubmission" },
      { title: "Music for Happy Moments", title_ko: "행복한 순간의 음악", text: "Enjoy cheerful music, sing-alongs, rhythm activities, and simple music moments created for families.", text_ko: "가족을 위해 준비한 밝은 음악, 함께 부르는 노래, 리듬 활동, 그리고 소소한 음악의 순간들을 즐겨보세요.", button: "Listen and join", button_ko: "듣고 함께하기", href: "media.html" },
      { title: "Music Requests", title_ko: "신청곡", text: "Request a song for your child, family, sibling, parent, or loved one.", text_ko: "아이, 가족, 형제자매, 부모님, 소중한 사람을 위해 노래를 신청해 주세요.", button: "Request music", button_ko: "노래 신청하기", form: "songRequest" },
      { title: "Hope Capsule", text: "A small collection of music, messages, and activities created to bring comfort and encouragement.", text_ko: "위로와 격려를 전하기 위해 모은 음악, 메시지, 활동의 작은 컬렉션입니다.", button: "Open Hope Capsule", button_ko: "Hope Capsule 열기", form: "hopeCapsule" },
    ],
    closing: ["To every child, parent, sibling, and family:", "You are seen. You are remembered.", "You are not walking alone."],
    closing_ko: ["모든 아이와 부모님, 형제자매, 그리고 가족 여러분께:", "우리는 여러분을 보고 있고, 기억하고 있습니다.", "여러분은 이 길을 혼자 걷고 있지 않습니다."],
  },

  /* Slug kept as "nicu" so existing links & QR codes keep working.
     Visible name is Northside Intensive Care Unit (NICU). */
  "nicu": {
    order: 3,
    name: "Northside Intensive Care Unit (NICU)",
    // TODO: Swap in an updated logo anytime — assets/logos/northside-nicu.png
    logo: "assets/logos/northside-nicu.png",
    logoAlt: "Northside Hospital logo",
    cardText: "For babies, parents, families, and care teams — letters for your baby, quiet music, stories of hope, and gentle family encouragement.",
    cardText_ko: "아기와 부모님, 가족, 그리고 의료진을 위해 — 아기에게 보내는 편지, 조용한 음악, 희망의 이야기, 그리고 가족을 위한 따뜻한 격려.",
    heroTitle: "WE ARE WITH YOU at the Northside NICU",
    heroTitle_ko: "Northside 신생아 집중치료실의 WE ARE WITH YOU",
    heroText: "Gentle music, letters, stories, and encouragement for babies, parents, families, and care teams.",
    heroText_ko: "아기와 부모님, 가족, 의료진을 위한 잔잔한 음악, 편지, 이야기, 그리고 격려.",
    about: "This page was created for the neonatal intensive care community at Northside Hospital. Everything here is intentionally quiet: gentle music, letters of love, and stories of hope for parents spending long days and nights beside their child.",
    about_ko: "이 페이지는 Northside 병원 신생아 집중치료실 커뮤니티를 위해 만들어졌습니다. 이곳의 모든 것은 일부러 조용합니다 — 아이 곁에서 긴 낮과 밤을 보내는 부모님을 위한 잔잔한 음악, 사랑의 편지, 그리고 희망의 이야기들입니다.",
    cards: [
      { title: "One Message for You", text: "A gentle message for parents spending long days and nights beside their baby. Read one — or share one for another NICU family.", text_ko: "아기 곁에서 긴 낮과 밤을 보내는 부모님을 위한 잔잔한 메시지입니다. 한 통을 읽어보세요 — 또는 다른 가족을 위해 한 통을 남겨 주세요.", button: "Read & share a message", button_ko: "메시지 읽고 나누기", form: "letterSubmission" },
      { title: "Letter for Your Baby", title_ko: "아기에게 보내는 편지", text: "Write or read a letter filled with love, hope, and encouragement for a baby and family.", text_ko: "아기와 가족을 위한 사랑과 희망, 격려가 담긴 편지를 쓰거나 읽어보세요.", button: "Read letters", button_ko: "편지 읽기", form: "letterSubmission" },
      { title: "Letters for Parents", title_ko: "부모님을 위한 편지", text: "Messages created for parents spending long days and nights beside their child.", text_ko: "아이 곁에서 긴 낮과 밤을 보내는 부모님을 위해 준비한 메시지들입니다.", button: "Read parent messages", button_ko: "부모님 메시지 읽기", form: "letterSubmission" },
      { title: "Quiet Music", title_ko: "조용한 음악", text: "Gentle music selected for calm, reflection, prayer, rest, and emotional support.", text_ko: "평온과 묵상, 기도와 쉼, 그리고 마음의 위로를 위해 고른 잔잔한 음악입니다.", button: "Listen quietly", button_ko: "조용히 듣기", href: "media.html" },
      { title: "Stories of Hope", title_ko: "희망의 이야기", text: "Read or share stories of strength, patience, love, and family hope.", text_ko: "힘과 인내, 사랑, 그리고 가족의 희망 이야기를 읽고 나눠 주세요.", button: "Read stories", button_ko: "이야기 읽기", form: "letterSubmission" },
      { title: "Hope Capsule", text: "A quiet collection of music, messages, and reflections for parents and families.", text_ko: "부모님과 가족을 위한 음악과 메시지, 마음이 담긴 조용한 컬렉션입니다.", button: "Open Hope Capsule", button_ko: "Hope Capsule 열기", form: "hopeCapsule" },
    ],
    closing: ["To every parent and family:", "Your love is present in every moment.", "Even here, even now, we are with you."],
    closing_ko: ["모든 부모님과 가족 여러분께:", "여러분의 사랑은 매 순간 그 자리에 있습니다.", "지금 이곳에서도, 우리가 당신과 함께 있습니다."],
  },

  "senior-living": {
    order: 4,
    name: "Senior Living",
    // Swap in an updated logo anytime — assets/logos/senior-living.png
    logo: "assets/logos/senior-living.png",
    logoAlt: "Adoration Home Health and MeSun Senior Living logos",
    cardText: "For seniors, families, staff, and volunteers — familiar songs, memory-based music, student performances, and intergenerational connection.",
    cardText_ko: "어르신과 가족, 직원, 자원봉사자를 위해 — 정든 노래, 추억의 음악, 학생 공연, 그리고 세대를 잇는 만남.",
    heroTitle: "WE ARE WITH YOU at Senior Living",
    heroTitle_ko: "시니어 커뮤니티의 WE ARE WITH YOU",
    heroText: "Music, memories, stories, and intergenerational connection.",
    heroText_ko: "음악과 추억, 이야기, 그리고 세대를 잇는 만남.",
    about: "This page was created for senior living communities — residents, families, staff, and the student volunteers who visit them. Familiar songs open conversations; memories become stories; generations meet through music.",
    about_ko: "이 페이지는 시니어 커뮤니티를 위해 만들어졌습니다 — 입주 어르신과 가족, 직원, 그리고 그곳을 찾는 학생 자원봉사자들을 위해서요. 정든 노래가 대화를 열고, 추억이 이야기가 되고, 세대가 음악으로 만납니다.",
    cards: [
      { title: "One Message for You", text: "One message can open a memory. Read a message of appreciation written for you — or share one for a resident, family member, staff member, or volunteer.", text_ko: "한 통의 메시지가 하나의 추억을 열 수 있습니다. 당신을 위해 쓰인 감사의 메시지를 읽어보세요 — 또는 어르신, 가족, 직원, 자원봉사자를 위해 한 통을 남겨 주세요.", button: "Read & share a message", button_ko: "메시지 읽고 나누기", form: "letterSubmission" },
      { title: "Familiar Songs", title_ko: "정든 노래", text: "Enjoy songs that bring back memories, comfort, joy, and conversation.", text_ko: "추억과 위로, 기쁨과 대화를 불러오는 노래들을 즐겨보세요.", button: "Listen", button_ko: "듣기", href: "media.html" },
      { title: "Music Requests", title_ko: "신청곡", text: "Request a song that is meaningful to you, your family, or your community.", text_ko: "나와 가족, 우리 커뮤니티에 의미 있는 노래를 신청해 주세요.", button: "Request a song", button_ko: "노래 신청하기", form: "songRequest" },
      { title: "Memory Stories", title_ko: "추억의 이야기", text: "Share a memory connected to a song, place, person, or life experience.", text_ko: "노래, 장소, 사람, 혹은 삶의 경험과 이어진 추억을 나눠 주세요.", button: "Share a memory", button_ko: "추억 나누기", form: "letterSubmission" },
      { title: "Student Performances", title_ko: "학생 공연", text: "Watch or listen to performances created by GYCO students.", text_ko: "GYCO 학생들이 준비한 공연을 보고 들어보세요.", button: "View performances", button_ko: "공연 보기", href: "media.html" },
      { title: "Hope Capsule", text: "A collection of music, messages, and reflections created for encouragement and connection.", text_ko: "격려와 연결을 위해 모은 음악과 메시지, 마음의 기록들입니다.", button: "Open Hope Capsule", button_ko: "Hope Capsule 열기", form: "hopeCapsule" },
    ],
    closing: ["Every memory has value.", "Every story deserves to be heard.", "Every generation has something to share."],
    closing_ko: ["모든 추억은 소중합니다.", "모든 이야기는 들려질 자격이 있습니다.", "모든 세대에게는 나눌 것이 있습니다."],
  },

  /* Slug kept as "disability" so existing links & QR codes keep working.
     Visible name is The America Wheat Mission (Milal). */
  "disability": {
    order: 5,
    name: "The America Wheat Mission (Milal)",
    // TODO: Swap in an updated logo anytime — assets/logos/milal.png
    logo: "assets/logos/milal.png",
    logoAlt: "The America Wheat Mission (Milal) — Wheat Mission in Atlanta logo",
    cardText: "For individuals, families, educators, and support communities — accessible music activities, adaptive participation, and inclusive projects with the Milal community.",
    cardText_ko: "밀알 커뮤니티와 함께 — 모두가 참여할 수 있는 음악 활동, 각자에게 맞춘 참여 방법, 그리고 가족·선생님·지원 공동체를 위한 포용적인 프로젝트.",
    heroTitle: "WE ARE WITH YOU with The America Wheat Mission (Milal)",
    heroTitle_ko: "애틀랜타 밀알선교단과 함께하는 WE ARE WITH YOU",
    heroText: "Music, participation, stories, and encouragement for individuals, families, educators, and support communities.",
    heroText_ko: "한 사람 한 사람과 가족, 선생님, 지원 공동체를 위한 음악, 참여, 이야기, 그리고 격려.",
    about: "This page was created with The America Wheat Mission (Milal) — the Wheat Mission in Atlanta, a community serving people with disabilities and their families. Everything here is accessibility-first and flexible by design: rhythm, movement, listening, and participation that adapt to each person, family, classroom, or community space.",
    about_ko: "이 페이지는 애틀랜타 밀알선교단(The America Wheat Mission)과 함께 만들어졌습니다 — 장애인과 그 가족을 섬기는 커뮤니티입니다. 이곳의 모든 것은 접근성을 가장 먼저 생각하고, 유연하게 설계되었습니다. 리듬, 움직임, 듣기, 참여 — 모두 한 사람 한 사람과 가족, 교실, 커뮤니티 공간에 맞게 조정됩니다.",
    cards: [
      { title: "One Message for You", text: "Every friendship begins with one message. Read a message of encouragement — or share one for an individual, family, educator, or support community.", text_ko: "모든 우정은 한 통의 메시지에서 시작됩니다. 격려의 메시지를 읽어보세요 — 또는 누군가와 가족, 선생님, 지원 공동체를 위해 한 통을 남겨 주세요.", button: "Read & share a message", button_ko: "메시지 읽고 나누기", form: "letterSubmission" },
      { title: "Accessible Music Activities", title_ko: "모두를 위한 음악 활동", text: "Simple rhythm, movement, listening, and participation-based activities.", text_ko: "쉬운 리듬, 움직임, 듣기, 그리고 참여 중심의 활동들입니다.", button: "Try an activity", button_ko: "활동 해보기", form: "teachingVideoRequest" },
      { title: "Teaching Videos", title_ko: "교육 영상", text: "Short videos that introduce music in clear and flexible ways.", text_ko: "음악을 쉽고 유연하게 소개하는 짧은 영상들입니다.", button: "Watch videos", button_ko: "영상 보기", form: "teachingVideoRequest" },
      { title: "Family Participation", title_ko: "가족과 함께", text: "Activities that families can complete together at home, school, or community spaces.", text_ko: "집에서, 학교에서, 커뮤니티 공간에서 가족이 함께할 수 있는 활동들입니다.", button: "Join together", button_ko: "함께 참여하기", form: "teachingVideoRequest" },
      { title: "Stories & Reflections", title_ko: "이야기와 마음", text: "Share experiences, needs, hopes, and meaningful moments.", text_ko: "경험과 필요, 소망, 그리고 의미 있는 순간들을 나눠 주세요.", button: "Share a story", button_ko: "이야기 나누기", form: "letterSubmission" },
      { title: "Hope Capsule", text: "Encouragement, music, and messages created for inclusive community connection.", text_ko: "모두가 함께하는 커뮤니티의 연결을 위해 준비한 격려와 음악, 메시지들입니다.", button: "Open Hope Capsule", button_ko: "Hope Capsule 열기", form: "hopeCapsule" },
    ],
    closing: ["Everyone deserves a place to participate.", "Everyone has something to share."],
    closing_ko: ["모두에게는 함께할 자리가 있어야 합니다.", "모두에게는 나눌 것이 있습니다."],
  },

  "schools-global": {
    order: 6,
    name: "Schools & Global Communities",
    // TODO: Replace with the final Schools & Global logo —
    // add assets/logos/schools-global.png (a clean monogram shows until then).
    logo: "assets/logos/schools-global.png",
    logoAlt: "Schools & Global Communities logo",
    cardText: "For students, teachers, and partner schools — English learning, music learning, story time, math activities, and teaching videos.",
    cardText_ko: "학생과 선생님, 파트너 학교를 위해 — 영어 배우기, 음악 배우기, 동화 시간, 수학 활동, 그리고 교육 영상.",
    heroTitle: "WE ARE WITH YOU for Schools & Global Communities",
    heroTitle_ko: "학교와 글로벌 커뮤니티를 위한 WE ARE WITH YOU",
    heroText: "Learning, music, stories, and encouragement for students, teachers, and partner schools.",
    heroText_ko: "학생과 선생님, 파트너 학교를 위한 배움, 음악, 이야기, 그리고 격려.",
    about: "This page was created for local and global partner schools. Students help other students learn — through simple English lessons, beginner music, read-aloud stories, and practice activities that can travel anywhere a link or QR code can go.",
    about_ko: "이 페이지는 지역과 세계 곳곳의 파트너 학교를 위해 만들어졌습니다. 학생이 학생의 배움을 돕습니다 — 쉬운 영어 수업, 처음 배우는 음악, 소리 내어 읽는 동화, 그리고 링크와 QR 코드가 닿는 곳이라면 어디든 갈 수 있는 연습 활동으로요.",
    cards: [
      { title: "One Message for You", text: "Learning begins with encouragement. Read a message from a student like you — or send one to a classroom across the world.", text_ko: "배움은 격려에서 시작됩니다. 당신 같은 학생이 보낸 메시지를 읽어보세요 — 또는 지구 반대편 교실로 한 통을 보내 주세요.", button: "Read & share a message", button_ko: "메시지 읽고 나누기", form: "letterSubmission" },
      { title: "Learn English", title_ko: "영어 배우기", text: "Simple English lessons, vocabulary videos, reading activities, and practice materials.", text_ko: "쉬운 영어 수업, 단어 영상, 읽기 활동, 그리고 연습 자료들입니다.", button: "Learn English", button_ko: "영어 배우기", form: "teachingVideoRequest" },
      { title: "Learn Music", title_ko: "음악 배우기", text: "Beginner music lessons, rhythm activities, singing, and instrument introductions.", text_ko: "처음 배우는 음악 수업, 리듬 활동, 노래, 그리고 악기 소개입니다.", button: "Learn music", button_ko: "음악 배우기", form: "teachingVideoRequest" },
      { title: "Story Time", title_ko: "동화 시간", text: "Student-friendly stories, read-aloud videos, discussion questions, and creative activities.", text_ko: "학생 눈높이의 이야기, 소리 내어 읽는 영상, 생각해 볼 질문, 그리고 창의 활동들입니다.", button: "Story time", button_ko: "동화 시간", form: "teachingVideoRequest" },
      { title: "Math Activities", title_ko: "수학 활동", text: "Simple math practice, problem-solving activities, and learning resources.", text_ko: "쉬운 수학 연습, 문제 해결 활동, 그리고 학습 자료들입니다.", button: "Practice math", button_ko: "수학 연습하기", form: "teachingVideoRequest" },
      { title: "Hope Capsule", text: "Messages, music, and encouragement created for students and teachers.", text_ko: "학생과 선생님을 위해 준비한 메시지와 음악, 격려입니다.", button: "Open Hope Capsule", button_ko: "Hope Capsule 열기", form: "hopeCapsule" },
    ],
    closing: ["To every student and teacher:", "Learning can begin anywhere. Your story matters.", "We are with you."],
    closing_ko: ["모든 학생과 선생님께:", "배움은 어디서든 시작될 수 있습니다. 당신의 이야기는 소중합니다.", "우리가 당신과 함께 있습니다."],
  },

};
