/* ============================================================
   SITE CONFIG — edit this file to update contact info, links,
   forms, navigation, homepage images, and the featured press
   article across the ENTIRE site at once.
   Anything marked REPLACE_ME or TODO still needs a real value.
   ============================================================ */

const SITE = {
  name: "WE ARE WITH YOU",
  org: "Greater Youth Collaborative Opus (GYCO)",
  tagline: "Even Here. Even Now. We Are With You.",
  baseUrl: "https://akkk9202.github.io/we-are-with-you/",

  // ── Contact & social ─────────────────────────────────────
  email: "REPLACE_ME@example.com",          // official email
  instagram: "",                             // e.g. "https://instagram.com/yourhandle" (leave "" to hide)
  youtube: "",                               // e.g. "https://youtube.com/@yourchannel" (leave "" to hide)
  location: "Georgia, United States",

  // ── Google Form links ────────────────────────────────────
  // Paste the "Send > link" URL from each Google Form.
  // Any button on the site with data-form="key" uses these.
  forms: {
    studentApplication:  "REPLACE_ME_GOOGLE_FORM_URL",
    partnerInquiry:      "REPLACE_ME_GOOGLE_FORM_URL",
    songRequest:         "REPLACE_ME_GOOGLE_FORM_URL",
    letterSubmission:    "REPLACE_ME_GOOGLE_FORM_URL",
    hopeCapsule:         "REPLACE_ME_GOOGLE_FORM_URL",
    teachingVideoRequest:"REPLACE_ME_GOOGLE_FORM_URL",
  },

  // ── Navigation (order matters) ───────────────────────────
  // The "Programs" dropdown builds itself from js/partners.js —
  // pathway names and order live there (name + order fields).
  nav: [
    { label: "Home", href: "index.html" },
    { label: "Programs", href: "programs.html", dropdown: "partners" },
    { label: "GYCO", href: "student-community.html" },
    { label: "NADO School", href: "learning.html" },
    { label: "Media", href: "media.html" },
    { label: "Join Us", href: "join.html" },
    { label: "About", href: "about.html" },
    { label: "Contact", href: "contact.html", cta: true },
  ],

  // ── Homepage images ──────────────────────────────────────
  home: {
    // "Why we exist" image (index.html, section 2).
    // TODO: Replace this image with the final invitation image —
    // overwrite assets/images/home-invitation.jpg or point src elsewhere.
    invitation: {
      src: "assets/images/home-invitation.jpg",
      alt: "WE ARE WITH YOU invitation — you are invited to receive a message of hope. Even Here, Even Now.",
    },

    // "One platform. Many communities." carousel (index.html, section 4).
    // One image at a time · arrows · dots · keyboard · swipe. No autoplay.
    carousel: [
      // TODO: Replace carousel image 1 — overwrite assets/images/home-carousel-1.jpg
      {
        src: "assets/images/home-carousel-1.jpg",
        alt: "WE ARE WITH YOU flyer for City of Hope Atlanta with QR codes for letters, music for hopeful moments, song requests, and the Hope Capsule",
        caption: "City of Hope Atlanta (CTCA)",
      },
      // TODO: Replace carousel image 2 — overwrite assets/images/home-carousel-2.jpg
      {
        src: "assets/images/home-carousel-2.jpg",
        alt: "WE ARE WITH YOU flyer for Ronald McDonald House with QR codes for letters for kids and parents, happy music, and the Hope Capsule",
        caption: "Ronald McDonald House",
      },
      // TODO: Replace carousel image 3 — overwrite assets/images/home-carousel-3.jpg
      {
        src: "assets/images/home-carousel-3.jpg",
        alt: "WE ARE WITH YOU flyer for the Northside NICU with QR codes for a letter for your baby, letters for parents, quiet music, and the Hope Capsule",
        caption: "Northside Intensive Care Unit (NICU)",
      },
    ],
  },

  // ── Media page · featured press ──────────────────────────
  // Rendered as one polished bilingual article card on media.html.
  press: [
    {
      label: "Featured Press",
      title: "Music of Hope: GYCO Brings Healing to the Community",
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

  footerNote: "A student-led platform bringing music, learning, encouragement, and human connection into real communities.",
};
