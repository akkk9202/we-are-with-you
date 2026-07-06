/* ============================================================
   SITE CONFIG — edit this file to update contact info, links,
   forms, and navigation across the ENTIRE site at once.
   Anything marked REPLACE_ME still needs a real value.
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
  nav: [
    { label: "Home", href: "index.html" },
    { label: "Programs", href: "programs.html", dropdown: [
      { label: "Cancer Care", href: "partner.html?p=cancer-care" },
      { label: "Ronald McDonald House", href: "partner.html?p=ronald-mcdonald-house" },
      { label: "NICU", href: "partner.html?p=nicu" },
      { label: "Senior Living", href: "partner.html?p=senior-living" },
      { label: "Schools & Global", href: "partner.html?p=schools-global" },
      { label: "Disability Community", href: "partner.html?p=disability" },
    ]},
    { label: "Student Community", href: "student-community.html" },
    { label: "Learning", href: "learning.html" },
    { label: "Media", href: "media.html" },
    { label: "Join Us", href: "join.html" },
    { label: "About", href: "about.html" },
    { label: "Contact", href: "contact.html", cta: true },
  ],

  footerNote: "A student-led platform bringing music, learning, encouragement, and human connection into real communities.",
};
