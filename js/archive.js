/* ============================================================
   PERFORMANCE ARCHIVE DATA — edit THIS file to add GYCO's
   performances, visits, teaching sessions, and community
   projects to the "Our Work Through the Years" section on the
   GYCO page (student-community.html).

   HOW TO ADD A REAL EVENT
   Copy one of the blocks below, paste it near the top of the
   list (order in this file doesn't matter — events are grouped
   by year and sorted by date automatically), and fill in:

     date         "YYYY-MM-DD". Required — the year tab and the
                  displayed date both come from this.
                  If you only know the month, use the 1st
                  (e.g. "2024-10-01") — the site displays
                  "October 2024" style labels either way.
     title        Event name, e.g. "Ronald McDonald House
                  Atlanta Performance". Required.
     partner      The community/partner name as it should read
                  on the card, e.g. "Ronald McDonald House".
     location     Optional, e.g. "Atlanta, GA".
     description  2–4 plain sentences about what happened.
     images       A list of photos. Drop the files into
                  assets/images/archive/ and reference them:
                    images: [
                      { src: "assets/images/archive/2026-07-rmh-1.jpg",
                        alt: "What the photo shows",
                        caption: "Optional caption" },
                    ],
                  Leave it as [] while photos are pending — the
                  card shows a clean "photos to add" block.
     videoUrl     Optional YouTube/video link (opens in a new tab).
     category     Optional label: "Performance", "Community
                  Activity", "Teaching", "Service Project", …
     participants Optional, e.g. "GYCO student ensemble".
     link         Optional external article:
                    link: { label: "Read the article", href: "https://…" }

   Only date + title are required; everything else can be added
   later. After editing, run the regression gate in
   EDITING-MAP.md (node test/smoke.test.js).
   ============================================================ */

const GYCO_ARCHIVE = [

  /* ──────────────────────────────────────────────────────────
     ⚠ SAMPLE PLACEHOLDER ENTRIES — none of the entries below
     are real events. They exist so the year tabs, pagination,
     and detail view are visible while the real history is
     collected. Replace them with real records (see the guide
     above) and delete any that are left over.
     ────────────────────────────────────────────────────────── */

  // ── 2026 (sample placeholders) ──
  {
    date: "2026-07-01",
    title: "Performance Placeholder",
    partner: "Ronald McDonald House",
    location: "Atlanta, GA",
    description: "Sample entry — replace with a real 2026 performance. Two to four sentences about who performed, for whom, and what the visit included.",
    images: [],
    videoUrl: "",
    category: "Performance",
    participants: "",
    link: null,
  },
  {
    date: "2026-06-01",
    title: "Community Activity Placeholder",
    partner: "City of Hope Atlanta",
    location: "",
    description: "Sample entry — replace with a real 2026 community activity or visit.",
    images: [],
    videoUrl: "",
    category: "Community Activity",
    participants: "",
    link: null,
  },
  {
    date: "2026-05-01",
    title: "Senior Living Visit Placeholder",
    partner: "Senior Living",
    location: "",
    description: "Sample entry — replace with a real 2026 senior community visit.",
    images: [],
    videoUrl: "",
    category: "Performance",
    participants: "",
    link: null,
  },
  {
    date: "2026-04-01",
    title: "Teaching Activity Placeholder",
    partner: "Schools & Global",
    location: "",
    description: "Sample entry — replace with a real 2026 teaching session or video project.",
    images: [],
    videoUrl: "",
    category: "Teaching",
    participants: "",
    link: null,
  },
  {
    date: "2026-03-01",
    title: "Performance Placeholder",
    partner: "Milal",
    location: "",
    description: "Sample entry — replace with a real 2026 event with The America Wheat Mission (Milal).",
    images: [],
    videoUrl: "",
    category: "Performance",
    participants: "",
    link: null,
  },
  {
    date: "2026-02-01",
    title: "Service Project Placeholder",
    partner: "Community Partners",
    location: "",
    description: "Sample entry — replace with a real 2026 service project, such as letters or care packages.",
    images: [],
    videoUrl: "",
    category: "Service Project",
    participants: "",
    link: null,
  },
  {
    date: "2026-01-01",
    title: "Performance Placeholder",
    partner: "Northside NICU",
    location: "",
    description: "Sample entry — replace with a real 2026 event. A seventh entry is included so the archive's pagination is visible with sample data.",
    images: [],
    videoUrl: "",
    category: "Performance",
    participants: "",
    link: null,
  },

  // ── 2025 (sample placeholders) ──
  {
    date: "2025-10-01",
    title: "Community Activity Placeholder",
    partner: "Senior Living",
    location: "",
    description: "Sample entry — replace with a real 2025 community activity.",
    images: [],
    videoUrl: "",
    category: "Community Activity",
    participants: "",
    link: null,
  },
  {
    date: "2025-06-01",
    title: "Performance Placeholder",
    partner: "Ronald McDonald House",
    location: "",
    description: "Sample entry — replace with a real 2025 performance.",
    images: [],
    videoUrl: "",
    category: "Performance",
    participants: "",
    link: null,
  },
  {
    date: "2025-03-01",
    title: "Teaching Activity Placeholder",
    partner: "Schools & Global",
    location: "",
    description: "Sample entry — replace with a real 2025 teaching activity.",
    images: [],
    videoUrl: "",
    category: "Teaching",
    participants: "",
    link: null,
  },

  // ── 2024 (sample placeholders) ──
  {
    date: "2024-10-01",
    title: "Performance Placeholder",
    partner: "City of Hope Atlanta",
    location: "",
    description: "Sample entry — replace with a real 2024 performance.",
    images: [],
    videoUrl: "",
    category: "Performance",
    participants: "",
    link: null,
  },
  {
    date: "2024-05-01",
    title: "Teaching Activity Placeholder",
    partner: "Schools & Global",
    location: "",
    description: "Sample entry — replace with a real 2024 teaching activity.",
    images: [],
    videoUrl: "",
    category: "Teaching",
    participants: "",
    link: null,
  },

  // ── 2023 (sample placeholders) ──
  {
    date: "2023-11-01",
    title: "GYCO Performance Placeholder",
    partner: "Senior Living",
    location: "",
    description: "Sample entry — replace with a real event from GYCO's founding year.",
    images: [],
    videoUrl: "",
    category: "Performance",
    participants: "",
    link: null,
  },
  {
    date: "2023-06-01",
    title: "GYCO Performance Placeholder",
    partner: "Community Partners",
    location: "",
    description: "Sample entry — replace with a real event from GYCO's founding year.",
    images: [],
    videoUrl: "",
    category: "Performance",
    participants: "",
    link: null,
  },
];
