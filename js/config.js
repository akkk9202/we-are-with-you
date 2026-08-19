/* ============================================================
   SITE CONFIG — edit this file to update contact info, links,
   forms, navigation, homepage images, and the featured press
   article across the ENTIRE site at once.
   Anything marked REPLACE_ME or TODO still needs a real value.
   ============================================================ */

const SITE = {
  name: "WE ARE WITH YOU",
  org: "Greater Youth Collaborative Opus (GYCO)",
  tagline: "Even Here. Even Now. WE ARE WITH YOU.",
  baseUrl: "https://akkk9202.github.io/we-are-with-you/",

  // ── Contact & social ─────────────────────────────────────
  email: "gyco23@gmail.com",                 // official email
  instagram: "https://instagram.com/gyco_opus", // e.g. "https://instagram.com/yourhandle" (leave "" to hide)
  youtube: "https://youtube.com/@gyco_wawy",    // official channel (leave "" to hide everywhere)
  location: "Georgia, United States",

  // ── Google Form links ────────────────────────────────────
  // Paste the "Send > link" URL from each Google Form.
  // Any button on the site with data-form="key" uses these.
  forms: {
    studentApplication:  "https://docs.google.com/forms/d/e/1FAIpQLSfsiV5lgetCfyIkVz79eRAMjF-PhwheU1HsIRMlwpPglLc54w/viewform?usp=header",
    partnerInquiry:      "REPLACE_ME_GOOGLE_FORM_URL",
    songRequest:         "https://docs.google.com/forms/d/e/1FAIpQLSfIU7OKX5MHNmsAZHqbcuVEMx637LtMDEzoLVGyauTXrZrB4w/viewform?usp=header",
    letterSubmission:    "https://docs.google.com/forms/d/e/1FAIpQLScPFE6ckE10oraG-N0bj6d8ShcoQQRCPrkA5wtFsHS6L1wkow/viewform?usp=header",
    hopeCapsule:         "REPLACE_ME_GOOGLE_FORM_URL",
    teachingVideoRequest:"REPLACE_ME_GOOGLE_FORM_URL",

    // "Support the Work" (contact page). While a key is still
    // REPLACE_ME, its button falls back to a mailto: link with a
    // prefilled subject (data-mailto-subject in the HTML) — paste a
    // Google Form URL here and the button switches automatically.
    supportProject:      "REPLACE_ME_GOOGLE_FORM_URL",
    materialsDonation:   "REPLACE_ME_GOOGLE_FORM_URL",
    sponsorInquiry:      "REPLACE_ME_GOOGLE_FORM_URL",
    skillShare:          "REPLACE_ME_GOOGLE_FORM_URL",
    communityConnection: "REPLACE_ME_GOOGLE_FORM_URL",
    generalSupport:      "REPLACE_ME_GOOGLE_FORM_URL",

    // "Give to WAWY" receipt request (Support Us page). While REPLACE_ME,
    // the button emails the donation inbox (SITE.donation.zelle) instead.
    donationReceipt:     "REPLACE_ME_GOOGLE_FORM_URL",

    // Support Us page (fundraising/). While REPLACE_ME, the card-
    // sponsorship button falls back to a mailto:, and the video-request
    // page shows its own built-in form (which emails the request).
    // Paste Google Form URLs here and both switch over automatically.
    cardSponsorship:     "REPLACE_ME_GOOGLE_FORM_URL",
    videoRequest:        "REPLACE_ME_GOOGLE_FORM_URL",
  },

  // ── Giving (Support Us page "Give to WAWY") ──────────────
  donation: {
    zelle: "gycodonation@gmail.com",  // Zelle address shown to donors
    memo:  "WAWY",                    // memo donors should include
    // NOTE: these are also baked into fundraising/index.html (the
    // .give-zelle line) so the page is complete without JavaScript.
    // If you change them here, change them there too.
  },

  // ── Support Us page (fundraising/) ───────────────────────
  fundraising: {
    // Optional suggested-contribution lines. Leave "" to hide. When a
    // number is decided, write the full sentence you want shown, e.g.
    // "Suggested contribution: $25 — every gift supports WAWY programs."
    cardSuggested:  "",
    videoSuggested: "",
    // Inbox for personalized-video requests while forms.videoRequest is
    // still a placeholder. Leave "" to use SITE.email.
    videoInbox: "",
  },

  // ── Navigation (order matters) ───────────────────────────
  // The old "Programs" tab is now the Community Portal (community/).
  // Its dropdown lists the six portal community pages. The legacy
  // partner pages (partner.html?p=…) still exist for printed QR codes
  // and are linked from the footer and from inside the portal.
  nav: [
    { label: "We Are With You", href: "index.html" },
    { label: "Community Portal", label_ko: "커뮤니티 포털", href: "community/index.html", dropdown: [
      { label: "Portal Home",           href: "community/home.html" },
      { label: "City of Hope Atlanta",  href: "community/city-of-hope.html" },
      { label: "RMH (Ronald McDonald House in Atlanta)", href: "community/ronald-mcdonald-house.html" },
      { label: "Senior Living",         href: "community/senior-living.html" },
      { label: "Schools & Global",      href: "community/schools-global.html" },
      { label: "Wheat Mission Atlanta (Milal)", href: "community/milal.html" },
    ] },
    { label: "GYCO", href: "student-community.html" },
    { label: "Media", label_ko: "미디어", href: "media.html" },
    { label: "Philosophy", label_ko: "철학", href: "our-philosophy.html" },
    { label: "Support Us", label_ko: "후원하기", href: "fundraising/index.html" },
    { label: "Contact", label_ko: "문의하기", href: "contact.html", cta: true },
  ],

  // ── Homepage images ──────────────────────────────────────
  home: {
    // "Why we exist" image (index.html, section 2).
    // TODO: Replace this image with the final invitation image —
    // overwrite assets/images/home-invitation.jpg or point src elsewhere.
    invitation: {
      src: "assets/images/home-invitation.jpg",
      alt: "WE ARE WITH YOU invitation with the message: You are invited to receive a message of hope. Even Here. Even Now.",
    },

    // ── The one large community poster (index.html, "From our posters" section).
    // The revised "One Message For You" poster (Aaron's 수정본 PDF, Aug 13 2026).
    // To swap: overwrite assets/images/home-poster.png (or repoint src) and
    // update alt/caption. This replaced the old six-slide flyer carousel (Aug 2026).
    poster: {
      src: "assets/images/home-poster.png",
      alt: "WE ARE WITH YOU · One Message for You poster showing five ways to connect — With You messages, Melody Box music, Wish Pocket song requests, Bloom Bank resources, and the Hope Capsule",
      caption: "The One Message for You poster displayed during our visits.",
    },

    // ── Homepage brochure / poster previews ("Take WE ARE WITH YOU With You").
    // The two printed brochures (front: the wildflower invitation with QR ·
    // back: "This Is For You", from Aaron's revised Aug 13 2026 PDF). To swap
    // one, overwrite its file (portrait 3:4, 1400×1867) and update the alt
    // text. If a file goes missing, a labeled placeholder shows automatically.
    brochures: [
      {
        src: "assets/images/brochure-1.jpg",
        alt: "WE ARE WITH YOU invitation brochure — “You are invited to receive a message of hope. Even here, even now” — with wildflowers and the QR code we hand out during visits",
      },
      {
        src: "assets/images/brochure-2.jpg",
        alt: "WE ARE WITH YOU brochure — “This Is For You · Even Here, Even Now” — a space to share and receive messages, music, helpful resources, and meaningful moments, with ways to support WAWY",
      },
    ],

    // ── The six partner/community logos near the top of the homepage.
    // Each slug must match a key in js/partners.js (logo + page come from
    // there, so a QR visitor lands on the right community page). Edit the
    // short label/line here; swap a logo by overwriting its file in
    // assets/logos/ (a clean monogram shows if a file is missing).
    communities: [
      { slug: "cancer-care",           label: "City of Hope Atlanta",  line: "Cancer care community" },
      { slug: "ronald-mcdonald-house", label: "RMH (Ronald McDonald House in Atlanta)", line: "Families and children" },
      { slug: "senior-living",         label: "Senior Living",         line: "Older adult communities" },
      { slug: "schools-global",        label: "Schools & Global",      line: "CLCL, HYCS, and partner schools" },
      { slug: "disability",            label: "Wheat Mission Atlanta (Milal)", line: "People with disabilities and their families" },
    ],
  },

  // ── Media page · featured press ──────────────────────────
  // Rendered as one polished bilingual article card on media.html.
  press: [
    {
      label: "Featured Press",
      title: "Music of Hope: GYCO Brings Comfort and Connection to the Community",
      publisher: "Newswave25",
      description: "Students from GYCO brought live music to hospitals and senior communities across Georgia, sharing hope, comfort, and connection through service.",
      languages: "Available in English and Korean",
      // TODO: Replace with the article photo — add assets/images/press-newswave25.jpg
      // (a styled placeholder shows automatically until the file exists).
      image: {
        src: "assets/images/press-newswave25.jpg",
        alt: "GYCO students bringing live music to the community — Newswave25 feature",
      },
      links: [
        { label: "Read in English", href: "https://newswave25.com/music-of-hope-gyco-brings-healing-to-the-community" },
        { label: "Read in Korean",  href: "https://newswave25.com/%EB%B3%91%EC%9B%90%EC%97%90-%EC%9A%B8%EB%A0%A4-%ED%8D%BC%EC%A7%84-%ED%9D%AC%EB%A7%9D%EC%9D%98-%EC%84%A0%EC%9C%A8-gyco-%EC%B0%BE%EC%95%84%EA%B0%80%EB%8A%94-%EC%9D%8C%EC%95%85" },
      ],
    },
  ],

  footerNote: "GYCO's first student-centered platform. Students bring music, letters, teaching, and service projects to community partners.",
  footerNote_ko: "GYCO의 첫 학생 중심 플랫폼으로, 학생들이 음악과 편지, 가르침과 봉사 프로젝트로 커뮤니티 파트너들과 함께합니다.",
};
