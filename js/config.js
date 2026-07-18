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
  // No YouTube channel yet — when one exists, add:  youtube: "https://youtube.com/@yourchannel",
  // then restore the YouTube links in js/site.js (footer), contact.html, and media.html.
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
  },

  // ── Navigation (order matters) ───────────────────────────
  // The "Programs" dropdown builds itself from js/partners.js —
  // pathway names and order live there (name + order fields).
  nav: [
    { label: "We Are With You", href: "index.html" },
    { label: "Programs", label_ko: "프로그램", href: "programs.html", dropdown: "partners" },
    { label: "GYCO", href: "student-community.html" },
    { label: "NADO School", href: "learning.html" },
    { label: "Media", label_ko: "미디어", href: "media.html" },
    { label: "Join Us", label_ko: "함께하기", href: "join.html" },
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

    // "One platform. Many communities." carousel (index.html, section 4).
    // One image at a time · arrows · dots · keyboard · swipe. No autoplay.
    carousel: [
      // TODO: Replace carousel image 1 — overwrite assets/images/home-carousel-1.jpg
      {
        src: "assets/images/home-carousel-1.jpg",
        alt: "WE ARE WITH YOU flyer for City of Hope Atlanta featuring QR codes for letters, music for hopeful moments, song requests, and the Hope Capsule",
        caption: "City of Hope Atlanta (CTCA)",
      },
      // TODO: Replace carousel image 2 — overwrite assets/images/home-carousel-2.jpg
      {
        src: "assets/images/home-carousel-2.jpg",
        alt: "WE ARE WITH YOU flyer for Ronald McDonald House featuring QR codes for letters for children and parents, cheerful music, and the Hope Capsule",
        caption: "Ronald McDonald House",
      },
      // TODO: Replace carousel image 3 — overwrite assets/images/home-carousel-3.jpg
      {
        src: "assets/images/home-carousel-3.jpg",
        alt: "WE ARE WITH YOU flyer for the Northside NICU featuring QR codes for a letter to your baby, letters for parents, quiet music, and the Hope Capsule",
        caption: "Northside Intensive Care Unit (NICU)",
      },
      {
        src: "assets/images/home-carousel-4.jpg",
        alt: "WE ARE WITH YOU flyer for The America Wheat Mission (Milal) featuring QR codes for letters to friends and families, shared music activities, song requests, and the Hope Capsule",
        caption: "The America Wheat Mission (Milal)",
      },
      {
        src: "assets/images/home-carousel-5.jpg",
        alt: "WE ARE WITH YOU flyer for senior living communities featuring QR codes for letters to older adults, Secret Wisdom messages, shared music, songs connected to memories, and the Hope Capsule",
        caption: "Senior Living Communities",
      },
      {
        src: "assets/images/home-carousel-6.jpg",
        alt: "WE ARE WITH YOU flyer for MeSun Senior Living and Adoration Home Health featuring QR codes for letters, prayers, peaceful music, songs connected to memories, and the Hope Capsule",
        caption: "MeSun Senior Living · Adoration Home Health",
      },
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

  footerNote: "A student-led platform that brings music, learning, encouragement, and human connection to communities.",
  footerNote_ko: "음악과 배움, 격려와 따뜻한 연결을 병원, 가족 공간, 시니어 커뮤니티, 학교, 그리고 세계 곳곳의 커뮤니티에 전하는 학생 주도 플랫폼입니다.",
};
