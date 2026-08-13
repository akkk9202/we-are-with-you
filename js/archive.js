/* ============================================================
   PERFORMANCE ARCHIVE DATA — edit THIS file to change the
   "Our Work Through the Years" section on the GYCO page
   (student-community.html).

   RIGHT NOW the archive holds one entry per community GYCO has
   served, each with its real photo collection (imported from
   gyco-opus.org, Aug 2026). As dated event records are added,
   the year tabs appear automatically.

   HOW TO ADD AN EVENT / ENTRY
   Copy one of the blocks below, paste it near the top of the
   list (order in this file doesn't matter — entries are sorted
   by date automatically), and fill in:

     date         "YYYY-MM-DD". Required — sorting and the year
                  tabs come from this. If you only know the
                  month, use the 1st (e.g. "2024-10-01") — the
                  site shows "October 2024" style labels.
     dateLabel    Optional text shown INSTEAD of the date on the
                  card. Use "" (empty) to show no date at all —
                  the current community collections do this.
                  Sorting still uses `date`.
     title        Entry name. Required.
     partner      Community/partner name for the card meta line.
     location     Optional, e.g. "Atlanta, GA".
     description  2–4 plain sentences.
     images       Photos: files live in assets/images/archive/.
                    images: [
                      { src: "assets/images/archive/coh-1.jpg",
                        alt: "What the photo shows",
                        caption: "Optional caption" },
                    ],
     videoUrl     Optional video link (opens in a new tab).
     category     Optional label: "Performance", "Community",
                  "Teaching", "Service Project", …
     participants Optional, e.g. "GYCO student ensemble".
     link         Optional external article:
                    link: { label: "Read the article", href: "https://…" }

   After editing, run the regression gate in EDITING-MAP.md
   (node test/smoke.test.js).
   ============================================================ */

const GYCO_ARCHIVE = [

  /* ── City of Hope Atlanta (CTCA) ── */
  {
    date: "2025-07-07",
    dateLabel: "",   // "" = show no date on the card/detail
    title: "City of Hope Atlanta (CTCA)",
    partner: "Cancer care community",
    location: "Atlanta, GA",
    description: "GYCO students return regularly to City of Hope Atlanta (formerly Cancer Treatment Centers of America) to perform for patients, families, caregivers, survivors, and staff — from ensemble performances in the lobby to holiday visits.",
    images: [
      { src: "assets/images/archive/coh-1.jpg", alt: "GYCO string and wind players performing under the rotunda of the City of Hope Atlanta dining lobby" },
      { src: "assets/images/archive/coh-2.jpg", alt: "GYCO students gathered with their Greater Youth Collaborative Opus banner beneath the City of Hope Atlanta rotunda" },
      { src: "assets/images/archive/coh-3.jpg", alt: "The GYCO ensemble seated together for a group photo after a City of Hope Atlanta performance" },
      { src: "assets/images/archive/coh-4.jpg", alt: "GYCO percussion and wind players performing beside the dining entrance at City of Hope Atlanta" },
      { src: "assets/images/archive/coh-5.jpg", alt: "GYCO students performing for visitors in the City of Hope Atlanta lobby" },
      { src: "assets/images/archive/coh-6.jpg", alt: "A GYCO student speaking with a City of Hope Atlanta staff member at the door while the ensemble plays" },
      { src: "assets/images/archive/coh-7.jpg", alt: "GYCO students holding their banner for a group photo in the City of Hope Atlanta rotunda" },
      { src: "assets/images/archive/coh-8.jpg", alt: "GYCO students and City of Hope Atlanta staff standing together for a group photo in the lobby" },
      { src: "assets/images/archive/coh-9.jpg", alt: "The GYCO ensemble seated with instruments by the fireplace and holiday wreaths at City of Hope Atlanta" },
      { src: "assets/images/archive/coh-10.jpg", alt: "GYCO students performing beside a decorated tree during a holiday visit to City of Hope Atlanta" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "",
    link: null,
  },

  /* ── Ronald McDonald House ── */
  {
    date: "2025-07-06",
    dateLabel: "",   // "" = show no date on the card/detail
    title: "Ronald McDonald House Charities of Atlanta",
    partner: "Families and children",
    location: "Atlanta, GA",
    description: "Students perform for families staying close to their hospitalized children — including outdoor patio performances for families and staff.",
    images: [
      { src: "assets/images/media-wawy-rmh-6.jpg", alt: "GYCO student ensemble with keyboard, trombone, strings, and percussion performing outdoors at Ronald McDonald House Atlanta" },
      { src: "assets/images/media-wawy-rmh-8.jpg", alt: "GYCO students seated with music stands under the outdoor pavilion at Ronald McDonald House Atlanta, following their conductor" },
      { src: "assets/images/media-wawy-rmh-1.jpg", alt: "GYCO students performing at Ronald McDonald House Atlanta" },
      { src: "assets/images/media-wawy-rmh-2.jpg", alt: "GYCO students with families and staff at Ronald McDonald House Atlanta" },
      { src: "assets/images/media-wawy-rmh-4.jpg", alt: "GYCO students during their visit to Ronald McDonald House Atlanta" },
      { src: "assets/images/media-wawy-rmh-5.jpg", alt: "The GYCO ensemble performing for families at Ronald McDonald House Atlanta" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "",
    link: null,
  },

  /* ── Senior living communities ── */
  {
    date: "2025-07-05",
    dateLabel: "",   // "" = show no date on the card/detail
    title: "Senior Living Communities",
    partner: "Older adult communities",
    location: "Georgia",
    description: "Familiar songs, holiday visits, and time spent talking with residents — students return to senior living partners throughout the year, sharing music and conversation across generations.",
    images: [
      { src: "assets/images/archive/senior-1.jpg", alt: "Residents seated at dining tables by tall windows as GYCO students perform in their community room" },
      { src: "assets/images/archive/senior-2.jpg", alt: "GYCO students talking with residents between chairs after a senior community performance" },
      { src: "assets/images/archive/senior-3.jpg", alt: "The GYCO ensemble with keyboard and cello performing for a full room at a senior living community" },
      { src: "assets/images/archive/senior-4.jpg", alt: "GYCO students seated with music stands performing in a senior residence dining room" },
      { src: "assets/images/archive/senior-5.jpg", alt: "A GYCO student at the piano performing for residents seated at tables in a senior community" },
      { src: "assets/images/archive/senior-6.jpg", alt: "GYCO students kneeling for a group photo with residents and caregivers after a visit" },
      { src: "assets/images/archive/senior-7.jpg", alt: "Students and residents gathered together for a group photo in a senior community kitchen" },
      { src: "assets/images/archive/senior-8.jpg", alt: "GYCO students with violins and cello performing for seniors seated in a lounge" },
      { src: "assets/images/archive/senior-9.jpg", alt: "GYCO students in Santa hats holding their banner at the entrance of The Claiborne senior living community" },
      { src: "assets/images/archive/senior-10.jpg", alt: "Students mingling with residents in the dining room after a holiday performance" },
      { src: "assets/images/archive/senior-11.jpg", alt: "GYCO students chatting with seated residents during a senior community visit" },
      { src: "assets/images/archive/senior-12.jpg", alt: "A GYCO student greeting an older resident during a holiday visit" },
      { src: "assets/images/archive/senior-13.jpg", alt: "Students kneeling beside an older adult with a rollator for a photo in a community room" },
    ],
    videoUrl: "",
    category: "Performances & visits",
    participants: "",
    link: null,
  },

  /* ── Wheat Mission Atlanta (Milal) ── */
  {
    date: "2025-07-04",
    dateLabel: "",   // "" = show no date on the card/detail
    title: "Wheat Mission Atlanta (Milal)",
    partner: "People with disabilities and their families",
    location: "Atlanta, GA",
    description: "Music and participation with Wheat Mission Atlanta (Milal), an Atlanta organization serving people with disabilities and their families — performances and shared activities designed so everyone can take part.",
    images: [
      { src: "assets/images/archive/milal-1.jpg", alt: "A large group gathered under a wooden pavilion for a GYCO visit with the Milal community" },
      { src: "assets/images/archive/milal-2.jpg", alt: "A GYCO chamber ensemble with conductor performing in a bright sunroom for the Milal community" },
      { src: "assets/images/archive/milal-3.jpg", alt: "GYCO students holding their banner outside the Wheat Mission in Atlanta (Milal) building" },
    ],
    videoUrl: "",
    category: "Performances & activities",
    participants: "",
    link: null,
  },

  /* ── Veterans ── */
  {
    date: "2025-07-03",
    dateLabel: "",   // "" = show no date on the card/detail
    title: "Veterans",
    partner: "Veterans' communities",
    location: "Georgia",
    description: "Performances, letters, and care packages for veterans — including a performance beside the Wall of Honor and thank-you gift bags prepared by students.",
    images: [
      { src: "assets/images/archive/veterans-1.jpg", alt: "GYCO students performing beside the American flag as a veteran stands and salutes" },
      { src: "assets/images/archive/veterans-2.jpg", alt: "GYCO students with cello and violins performing in front of the Wall of Honor for veterans" },
      { src: "assets/images/archive/veterans-3.jpg", alt: "Thank-you gift bags with hand-drawn flower cards reading Thank You Veterans, prepared by GYCO students" },
    ],
    videoUrl: "",
    category: "Performances & service",
    participants: "",
    link: null,
  },

  /* ── Refugee families ── */
  {
    date: "2025-07-02",
    dateLabel: "",   // "" = show no date on the card/detail
    title: "Refugee Families",
    partner: "In partnership with Friends of Refugees",
    location: "Georgia",
    description: "Serving refugee families in partnership with Friends of Refugees — including children's book collections and craft and card-making projects prepared by students.",
    images: [
      { src: "assets/images/archive/refugees-1.jpg", alt: "GYCO students and volunteers with a large collection of children's books gathered for refugee families" },
      { src: "assets/images/archive/refugees-2.jpg", alt: "GYCO students holding sheets of hand-drawn flower cards made for refugee families" },
      { src: "assets/images/archive/refugees-3.jpg", alt: "GYCO students writing and crafting cards at tables during a service project" },
      { src: "assets/images/archive/refugees-4.jpg", alt: "Students holding donation cards behind a table of collected children's books" },
      { src: "assets/images/archive/refugees-5.jpg", alt: "GYCO students and families with the children's books collected for Friends of Refugees" },
    ],
    videoUrl: "",
    category: "Service projects",
    participants: "",
    link: null,
  },

  /* ── People experiencing homelessness ── */
  {
    date: "2025-07-01",
    dateLabel: "",   // "" = show no date on the card/detail
    title: "People Experiencing Homelessness in Atlanta",
    partner: "Downtown Atlanta outreach",
    location: "Atlanta, GA",
    description: "Music and 100 care packages for people experiencing homelessness in Atlanta — students bring the ensemble outdoors to a downtown park, performing and handing out care packages.",
    images: [
      { src: "assets/images/archive/homeless-1.jpg", alt: "GYCO students with keyboards and winds performing outdoors in a downtown Atlanta park" },
      { src: "assets/images/archive/homeless-2.jpg", alt: "The GYCO ensemble performing among the trees of a downtown Atlanta park as people gather" },
      { src: "assets/images/archive/homeless-3.jpg", alt: "Students distributing care packages beside their instruments in a downtown Atlanta park" },
      { src: "assets/images/archive/homeless-4.jpg", alt: "Children and students gathered around keyboards during an outdoor performance in downtown Atlanta" },
      { src: "assets/images/archive/homeless-5.jpg", alt: "GYCO students performing on keyboards in a downtown Atlanta park as passers-by stop to listen" },
      { src: "assets/images/archive/homeless-6.jpg", alt: "The conductor leading GYCO wind players in a spring performance in a downtown Atlanta park" },
      { src: "assets/images/archive/homeless-7.jpg", alt: "GYCO percussion and drum players performing outdoors for a crowd in downtown Atlanta" },
      { src: "assets/images/archive/homeless-8.jpg", alt: "The GYCO ensemble set up along the edge of a downtown Atlanta park for an outdoor performance" },
    ],
    videoUrl: "",
    category: "Performances & service",
    participants: "",
    link: null,
  },
];
