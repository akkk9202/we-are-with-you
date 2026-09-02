/* ============================================================
   PERFORMANCE ARCHIVE DATA — edit THIS file to change the
   "Our Work Through the Years" section on the GYCO page
   (student-community.html).

   The archive holds (a) one undated collection per community
   GYCO has served (imported from gyco-opus.org, Aug 2026) and
   (b) dated performance records, Nov 2023 → Aug 2026 (added
   Sep 2026 from the performance-photo booklet). Year tabs are
   derived from the dates automatically.

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

  /* ════════════════════════════════════════════════════════════
     DATED PERFORMANCE RECORDS 2023–2026 (added Sep 2026 from the
     GYCO performance-photo booklet). Venue names marked
     "Senior living community" are generic — replace `title` /
     `partner` with the real community name when known.
     ════════════════════════════════════════════════════════════ */

  {
    date: "2026-08-26",
    title: "Beat & Breeze Session — Senior Living Community",
    partner: "Senior living community",
    location: "Georgia",
    description: "A rhythm-and-conversation session with residents in the community's dining room — students moved between tables with drums and small percussion so everyone could take part.",
    images: [
      { src: "assets/images/archive/2026-08-26-1.jpg", alt: "A GYCO student in a red shirt leading residents seated at tables through a rhythm activity in a senior community dining room" },
      { src: "assets/images/archive/2026-08-26-2.jpg", alt: "Residents gathered in a circle around a snare drum and a We Are With You banner for a Beat & Breeze session" },
      { src: "assets/images/archive/2026-08-26-3.jpg", alt: "A GYCO student kneeling to talk with two residents during the session" },
    ],
    videoUrl: "",
    category: "Teaching & activities",
    participants: "GYCO students",
    link: null,
  },
  {
    date: "2026-08-04",
    title: "Brass & Woodwind Ensemble Performance",
    partner: "Community partner",
    location: "Georgia",
    description: "A summer brass, woodwind, and string program performed between two We Are With You banners.",
    images: [
      { src: "assets/images/archive/2026-08-04-1.jpg", alt: "GYCO trombone, saxophone, flute, and violin players reading from their stands during a summer performance" },
      { src: "assets/images/archive/2026-08-04-2.jpg", alt: "The GYCO wind and string ensemble standing with instruments in front of We Are With You banners after the performance" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2026-07-29",
    title: "City of Hope Atlanta & Ronald McDonald House",
    partner: "Cancer care community · Families and children",
    location: "Atlanta, GA",
    description: "Two WE ARE WITH YOU visits in one day — a performance under the rotunda at City of Hope Atlanta, then a visit to families at Ronald McDonald House Charities of Atlanta.",
    images: [
      { src: "assets/images/archive/2026-07-29-1.jpg", alt: "GYCO students standing with music stands between two We Are With You banners beneath the City of Hope Atlanta rotunda" },
      { src: "assets/images/archive/2026-07-29-2.jpg", alt: "The full GYCO group posing under the Ronald McDonald House Atlanta sign after their visit" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2026-07-07",
    title: "Senior Living Community Visit",
    partner: "Senior living community",
    location: "Georgia",
    description: "Flute duets and time spent talking with residents — students split into small groups to sit and visit after the music.",
    images: [
      { src: "assets/images/archive/2026-07-07-1.jpg", alt: "GYCO students visiting with residents seated in armchairs in a senior community lounge" },
      { src: "assets/images/archive/2026-07-07-2.jpg", alt: "Two GYCO flutists performing from their stands in front of a screen at a senior community" },
      { src: "assets/images/archive/2026-07-07-3.jpg", alt: "Residents and GYCO students smiling together for a photo after the performance" },
      { src: "assets/images/archive/2026-07-07-4.jpg", alt: "GYCO students standing among residents in a senior community sitting room, greeting each one" },
    ],
    videoUrl: "",
    category: "Performances & visits",
    participants: "GYCO students",
    link: null,
  },
  {
    date: "2026-05-12",
    title: "Senior Living Community Performance",
    partner: "Senior living community",
    location: "Georgia",
    description: "The wind and string ensemble performed for residents, then gathered with them for a group photo.",
    images: [
      { src: "assets/images/archive/2026-05-12-1.jpg", alt: "Residents seated in front of the GYCO saxophone, trumpet, cello, and violin players for a group photo after the performance" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2026-04-18",
    title: "Senior Living Community Performance",
    partner: "Senior living community",
    location: "Georgia",
    description: "A performance in the community's open lounge, with residents gathered in armchairs and wheelchairs to listen.",
    images: [
      { src: "assets/images/archive/2026-04-18-1.jpg", alt: "GYCO students on piano, strings, and winds performing beneath the wooden beams of a senior community lounge" },
      { src: "assets/images/archive/2026-04-18-2.jpg", alt: "Residents seated in armchairs and wheelchairs listening to the GYCO ensemble across the lounge" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2026-04-07",
    title: "Spring Performance — City of Hope Atlanta",
    partner: "Cancer care community",
    location: "Atlanta, GA",
    description: "A spring lobby performance for patients, families, and staff beside Guest Services at City of Hope Atlanta.",
    images: [
      { src: "assets/images/archive/2026-04-07-1.jpg", alt: "GYCO students on keyboard, winds, and percussion performing beside the Guest Services desk at City of Hope Atlanta" },
      { src: "assets/images/archive/2026-04-07-2.jpg", alt: "Visitors pausing to listen as the GYCO ensemble performs in the City of Hope Atlanta lobby" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2026-03-12",
    title: "Senior Living Community Performance",
    partner: "Senior living community",
    location: "Georgia",
    description: "Keyboard, percussion, flute, and voice for residents in the community's living room, followed by a group photo.",
    images: [
      { src: "assets/images/archive/2026-03-12-1.jpg", alt: "A GYCO student on snare drum and another at the keyboard performing for residents" },
      { src: "assets/images/archive/2026-03-12-2.jpg", alt: "GYCO students kneeling in front of seated residents for a group photo after the performance" },
      { src: "assets/images/archive/2026-03-12-3.jpg", alt: "GYCO singers and a flutist performing beside bookshelves in a senior community living room" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO students",
    link: null,
  },
  {
    date: "2026-02-18",
    title: "Senior Living Community Performance",
    partner: "Senior living community",
    location: "Georgia",
    description: "A wind ensemble program — saxophone, trombone, flute, and clarinet — for residents gathered in the dining room.",
    images: [
      { src: "assets/images/archive/2026-02-18-1.jpg", alt: "GYCO saxophone, trombone, flute, and clarinet players seated with music stands in a senior community dining room" },
      { src: "assets/images/archive/2026-02-18-2.jpg", alt: "Residents in chairs and wheelchairs listening to the GYCO ensemble, with students standing behind them" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2025-12-22",
    title: "Holiday Performance — City of Hope Atlanta",
    partner: "Cancer care community",
    location: "Atlanta, GA",
    description: "Holiday music beside the decorated tree in the City of Hope Atlanta lobby for patients, families, and staff.",
    images: [
      { src: "assets/images/archive/2025-12-22-1.jpg", alt: "The conductor leading GYCO wind and string players in holiday music at City of Hope Atlanta" },
      { src: "assets/images/archive/2025-12-22-2.jpg", alt: "The full GYCO ensemble performing beneath the rotunda beside the City of Hope Atlanta holiday tree" },
      { src: "assets/images/archive/2025-12-22-3.jpg", alt: "GYCO students posing in front of the decorated tree by Guest Services at City of Hope Atlanta" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2025-11-24",
    title: "Thanksgiving Week Performance — City of Hope Atlanta",
    partner: "Cancer care community",
    location: "Atlanta, GA",
    description: "A full-ensemble lobby performance during Thanksgiving week, with holiday wreaths already up around the rotunda.",
    images: [
      { src: "assets/images/archive/2025-11-24-1.jpg", alt: "GYCO students and families arriving with instruments in the City of Hope Atlanta lobby" },
      { src: "assets/images/archive/2025-11-24-2.jpg", alt: "The conductor leading the GYCO ensemble beneath holiday wreaths at City of Hope Atlanta" },
      { src: "assets/images/archive/2025-11-24-3.jpg", alt: "GYCO string and wind players performing under the rotunda at City of Hope Atlanta" },
      { src: "assets/images/archive/2025-11-24-4.jpg", alt: "The full GYCO ensemble seen from the side as they perform for visitors at City of Hope Atlanta" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2025-07-24",
    title: "Summer Performance — City of Hope Atlanta",
    partner: "Cancer care community",
    location: "Atlanta, GA",
    description: "A summer cello-and-strings program in the lobby, with time afterward to talk with patients and the hospital team.",
    images: [
      { src: "assets/images/archive/2025-07-24-1.jpg", alt: "GYCO cellists and string players performing beside a Join Us poster in the City of Hope Atlanta lobby" },
      { src: "assets/images/archive/2025-07-24-2.jpg", alt: "A patient in a wheelchair and family members greeting GYCO students after the performance at City of Hope Atlanta" },
      { src: "assets/images/archive/2025-07-24-3.jpg", alt: "City of Hope Atlanta staff standing beside the GYCO cello ensemble under the rotunda" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2025-07-23",
    title: "Music & Craft Afternoon — Senior Living Community",
    partner: "Senior living community",
    location: "Georgia",
    description: "Keyboard and percussion in the dining room, then painting and craft tables where students and residents worked side by side.",
    images: [
      { src: "assets/images/archive/2025-07-23-1.jpg", alt: "GYCO students on keyboard and drum set performing in a senior community dining room" },
      { src: "assets/images/archive/2025-07-23-2.jpg", alt: "A GYCO student and a resident painting together at a craft table" },
      { src: "assets/images/archive/2025-07-23-3.jpg", alt: "Residents and GYCO students sharing craft supplies across a long table" },
    ],
    videoUrl: "",
    category: "Performances & activities",
    participants: "GYCO students",
    link: null,
  },
  {
    date: "2025-06-26",
    title: "Senior Living Community Performance",
    partner: "Senior living community",
    location: "Georgia",
    description: "A summer visit in the community's dining room — residents gathered at their tables, and students in GYCO T-shirts joined them for photos afterward.",
    images: [
      { src: "assets/images/archive/2025-06-26-1.jpg", alt: "Residents seated at dining tables applauding after a GYCO performance" },
      { src: "assets/images/archive/2025-06-26-2.jpg", alt: "GYCO students in white T-shirts standing among seated residents for a group photo" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO students",
    link: null,
  },
  {
    date: "2025-06-12",
    title: "Senior Living Community Performance",
    partner: "Senior living community",
    location: "Georgia",
    description: "A chamber program with cellos, clarinet, and strings, followed by conversation with residents.",
    images: [
      { src: "assets/images/archive/2025-06-12-1.jpg", alt: "A GYCO student talking with a resident in a wheelchair after the performance" },
      { src: "assets/images/archive/2025-06-12-2.jpg", alt: "GYCO students kneeling with cellos and clarinet for a group photo in the community's activity room" },
      { src: "assets/images/archive/2025-06-12-3.jpg", alt: "GYCO cello and violin players performing from their stands" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2025-02-17",
    title: "Winter Performance — City of Hope Atlanta",
    partner: "Cancer care community",
    location: "Atlanta, GA",
    description: "A winter lobby performance beside Guest Services, closing with a group photo behind the Greater Youth Collaborative Opus banner.",
    images: [
      { src: "assets/images/archive/2025-02-17-1.jpg", alt: "GYCO students performing beside the Guest Services desk in the City of Hope Atlanta lobby" },
      { src: "assets/images/archive/2025-02-17-2.jpg", alt: "The GYCO ensemble seen across the lobby flowers as visitors pass through City of Hope Atlanta" },
      { src: "assets/images/archive/2025-02-17-3.jpg", alt: "GYCO students holding their Greater Youth Collaborative Opus banner for a group photo at City of Hope Atlanta" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2024-12-21",
    title: "Holiday Performance at the Wall of Honor",
    partner: "Veterans' community",
    location: "Georgia",
    description: "A holiday performance beside the Wall of Honor for veterans and residents, followed by a group photo with the audience.",
    images: [
      { src: "assets/images/archive/2024-12-21-1.jpg", alt: "GYCO students performing in front of the Wall of Honor as residents listen from armchairs" },
      { src: "assets/images/archive/2024-12-21-2.jpg", alt: "GYCO students and residents gathered together beneath the Wall of Honor for a group photo" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2024-11-25",
    title: "Holiday Performance — City of Hope Atlanta",
    partner: "Cancer care community",
    location: "Atlanta, GA",
    description: "Holiday music beside the decorated tree in the City of Hope Atlanta lobby, with a group photo alongside hospital staff.",
    images: [
      { src: "assets/images/archive/2024-11-25-1.jpg", alt: "A patient listening from a wheelchair beside the holiday tree as GYCO performs in the City of Hope Atlanta lobby" },
      { src: "assets/images/archive/2024-11-25-2.jpg", alt: "GYCO students and City of Hope Atlanta staff posing in front of the holiday tree" },
      { src: "assets/images/archive/2024-11-25-3.jpg", alt: "The GYCO ensemble performing near the dining entrance at City of Hope Atlanta" },
      { src: "assets/images/archive/2024-11-25-4.jpg", alt: "GYCO string players performing under the rotunda at City of Hope Atlanta" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2024-08-17",
    title: "Senior Living Community Performance",
    partner: "Senior living community",
    location: "Georgia",
    description: "Flutes, cellos, and violins for residents gathered in the community's library lounge.",
    images: [
      { src: "assets/images/archive/2024-08-17-1.jpg", alt: "Residents seated in armchairs and wheelchairs facing the GYCO ensemble in a senior community lounge" },
      { src: "assets/images/archive/2024-08-17-2.jpg", alt: "GYCO flute, cello, and violin players performing beside the bookshelves for residents" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2024-07-20",
    title: "Senior Living Community Performance",
    partner: "Senior living community",
    location: "Georgia",
    description: "A summer performance in the community's sunlit activity room, ending with students and residents together for a photo.",
    images: [
      { src: "assets/images/archive/2024-07-20-1.jpg", alt: "GYCO students in white shirts kneeling with residents for a group photo in a bright activity room" },
      { src: "assets/images/archive/2024-07-20-2.jpg", alt: "The GYCO ensemble performing with cello and strings as residents watch from armchairs" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2024-04-01",
    title: "Spring Performance — Senior Living Community",
    partner: "Senior living community",
    location: "Georgia",
    description: "The full spring ensemble performing in the community's atrium, with a group photo outside afterward.",
    images: [
      { src: "assets/images/archive/2024-04-01-1.jpg", alt: "The full GYCO ensemble seated with music stands in a senior community atrium" },
      { src: "assets/images/archive/2024-04-01-2.jpg", alt: "GYCO students in black polo shirts lined up with their director outside the community entrance" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },
  {
    date: "2023-11-21",
    title: "First Holiday Visit — City of Hope Atlanta",
    partner: "Cancer care community",
    location: "Atlanta, GA",
    description: "GYCO's first holiday performance in the City of Hope Atlanta lobby, beside the decorated tree by the dining entrance.",
    images: [
      { src: "assets/images/archive/2023-11-21-1.jpg", alt: "GYCO string players performing by the dining entrance at City of Hope Atlanta as their director conducts" },
      { src: "assets/images/archive/2023-11-21-2.jpg", alt: "The conductor leading GYCO wind players beside the fireplace and holiday stockings at City of Hope Atlanta" },
      { src: "assets/images/archive/2023-11-21-3.jpg", alt: "A visitor kneeling to listen beside the holiday tree during GYCO's performance at City of Hope Atlanta" },
    ],
    videoUrl: "",
    category: "Performances",
    participants: "GYCO student ensemble",
    link: null,
  },


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
