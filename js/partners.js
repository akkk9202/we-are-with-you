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
    heroTitle: "WE ARE WITH YOU at City of Hope Atlanta",
    heroText: "Music, messages, stories, and encouragement for patients, families, caregivers, survivors, and healthcare staff.",
    about: "This page was created for the City of Hope Atlanta community — formerly Cancer Treatment Centers of America (CTCA). Through it, students and community partners share music, letters, teaching videos, stories, and activities designed for patients and the people beside them. It may be reached through QR codes, printed materials, digital links, events, and partner programs.",
    cards: [
      { title: "Song Request", text: "Request a meaningful song for yourself, your family, a caregiver, a patient, or a loved one. GYCO students may prepare the song for a live or recorded performance when possible.", button: "Request a song", form: "songRequest" },
      { title: "Voices of Love", text: "Share the story, memory, or meaning behind a song. Patients, families, caregivers, survivors, and staff may share how music connects to their journey.", button: "Share your voice", form: "songRequest" },
      { title: "Taps of Love", text: "Watch short teaching videos created by students. Learn simple rhythms, music activities, breathing exercises, and creative ways to participate from wherever you are.", button: "Watch teaching videos", href: "learning.html" },
      { title: "Patient Stories", text: "Read or share reflections, encouragement, and meaningful moments from the cancer care community.", button: "Share a story", form: "letterSubmission" },
      { title: "Hope Capsule", text: "Open a small collection of messages, music, reflections, and encouragement created for moments when someone needs hope.", button: "Open Hope Capsule", form: "hopeCapsule" },
    ],
    closing: ["To every patient, family member, caregiver, survivor, and staff member:", "You are not alone.", "Even here, even now, we are with you."],
  },

  "ronald-mcdonald-house": {
    order: 2,
    name: "Ronald McDonald House",
    // TODO: Swap in an updated logo anytime — assets/logos/ronald-mcdonald-house.png
    logo: "assets/logos/ronald-mcdonald-house.png",
    logoAlt: "Ronald McDonald House logo",
    cardText: "For children, parents, siblings, and families near hospitals — letters for kids and parents, happy music moments, family requests, and activities.",
    heroTitle: "WE ARE WITH YOU at Ronald McDonald House",
    heroText: "Music, letters, activities, and encouragement for children, parents, siblings, and families.",
    about: "This page was created for families staying near hospitals while a child receives care. Through it, students share letters, cheerful music, sing-alongs, and simple activities that families can enjoy together during long and uncertain days.",
    cards: [
      { title: "Letters for Kids", text: "Read kind messages written for children who may need encouragement, joy, or a reminder that people are thinking of them.", button: "Read letters", form: "letterSubmission" },
      { title: "Letters for Parents", text: "Messages of support for parents and caregivers walking through long, difficult, or uncertain days.", button: "Read parent letters", form: "letterSubmission" },
      { title: "Music for Happy Moments", text: "Enjoy cheerful music, sing-alongs, rhythm activities, and simple music moments created for families.", button: "Listen and join", href: "media.html" },
      { title: "Music Requests", text: "Request a song for your child, family, sibling, parent, or loved one.", button: "Request music", form: "songRequest" },
      { title: "Hope Capsule", text: "A small collection of music, messages, and activities created to bring comfort and encouragement.", button: "Open Hope Capsule", form: "hopeCapsule" },
    ],
    closing: ["To every child, parent, sibling, and family:", "You are seen. You are remembered.", "You are not walking alone."],
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
    heroTitle: "WE ARE WITH YOU at the Northside NICU",
    heroText: "Gentle music, letters, stories, and encouragement for babies, parents, families, and care teams.",
    about: "This page was created for the neonatal intensive care community at Northside Hospital. Everything here is intentionally quiet: gentle music, letters of love, and stories of hope for parents spending long days and nights beside their child.",
    cards: [
      { title: "Letter for Your Baby", text: "Write or read a letter filled with love, hope, and encouragement for a baby and family.", button: "Read letters", form: "letterSubmission" },
      { title: "Letters for Parents", text: "Messages created for parents spending long days and nights beside their child.", button: "Read parent messages", form: "letterSubmission" },
      { title: "Quiet Music", text: "Gentle music selected for calm, reflection, prayer, rest, and emotional support.", button: "Listen quietly", href: "media.html" },
      { title: "Stories of Hope", text: "Read or share stories of strength, patience, love, and family hope.", button: "Read stories", form: "letterSubmission" },
      { title: "Hope Capsule", text: "A quiet collection of music, messages, and reflections for parents and families.", button: "Open Hope Capsule", form: "hopeCapsule" },
    ],
    closing: ["To every parent and family:", "Your love is present in every moment.", "Even here, even now, we are with you."],
  },

  "senior-living": {
    order: 4,
    name: "Senior Living",
    // TODO: Replace with the final Senior Living partner logo —
    // add assets/logos/senior-living.png (a clean monogram shows until then).
    logo: "assets/logos/senior-living.png",
    logoAlt: "Senior Living partner logo",
    cardText: "For seniors, families, staff, and volunteers — familiar songs, memory-based music, student performances, and intergenerational connection.",
    heroTitle: "WE ARE WITH YOU at Senior Living",
    heroText: "Music, memories, stories, and intergenerational connection.",
    about: "This page was created for senior living communities — residents, families, staff, and the student volunteers who visit them. Familiar songs open conversations; memories become stories; generations meet through music.",
    cards: [
      { title: "Familiar Songs", text: "Enjoy songs that bring back memories, comfort, joy, and conversation.", button: "Listen", href: "media.html" },
      { title: "Music Requests", text: "Request a song that is meaningful to you, your family, or your community.", button: "Request a song", form: "songRequest" },
      { title: "Memory Stories", text: "Share a memory connected to a song, place, person, or life experience.", button: "Share a memory", form: "letterSubmission" },
      { title: "Student Performances", text: "Watch or listen to performances created by GYCO students.", button: "View performances", href: "media.html" },
      { title: "Hope Capsule", text: "A collection of music, messages, and reflections created for encouragement and connection.", button: "Open Hope Capsule", form: "hopeCapsule" },
    ],
    closing: ["Every memory has value.", "Every story deserves to be heard.", "Every generation has something to share."],
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
    heroTitle: "WE ARE WITH YOU with The America Wheat Mission (Milal)",
    heroText: "Music, participation, stories, and encouragement for individuals, families, educators, and support communities.",
    about: "This page was created with The America Wheat Mission (Milal) — the Wheat Mission in Atlanta, a community serving people with disabilities and their families. Everything here is accessibility-first and flexible by design: rhythm, movement, listening, and participation that adapt to each person, family, classroom, or community space.",
    cards: [
      { title: "Accessible Music Activities", text: "Simple rhythm, movement, listening, and participation-based activities.", button: "Try an activity", form: "teachingVideoRequest" },
      { title: "Teaching Videos", text: "Short videos that introduce music in clear and flexible ways.", button: "Watch videos", form: "teachingVideoRequest" },
      { title: "Family Participation", text: "Activities that families can complete together at home, school, or community spaces.", button: "Join together", form: "teachingVideoRequest" },
      { title: "Stories & Reflections", text: "Share experiences, needs, hopes, and meaningful moments.", button: "Share a story", form: "letterSubmission" },
      { title: "Hope Capsule", text: "Encouragement, music, and messages created for inclusive community connection.", button: "Open Hope Capsule", form: "hopeCapsule" },
    ],
    closing: ["Everyone deserves a place to participate.", "Everyone has something to share."],
  },

  "schools-global": {
    order: 6,
    name: "Schools & Global Communities",
    // TODO: Replace with the final Schools & Global logo —
    // add assets/logos/schools-global.png (a clean monogram shows until then).
    logo: "assets/logos/schools-global.png",
    logoAlt: "Schools & Global Communities logo",
    cardText: "For students, teachers, and partner schools — English learning, music learning, story time, math activities, and teaching videos.",
    heroTitle: "WE ARE WITH YOU for Schools & Global Communities",
    heroText: "Learning, music, stories, and encouragement for students, teachers, and partner schools.",
    about: "This page was created for local and global partner schools. Students help other students learn — through simple English lessons, beginner music, read-aloud stories, and practice activities that can travel anywhere a link or QR code can go.",
    cards: [
      { title: "Learn English", text: "Simple English lessons, vocabulary videos, reading activities, and practice materials.", button: "Learn English", form: "teachingVideoRequest" },
      { title: "Learn Music", text: "Beginner music lessons, rhythm activities, singing, and instrument introductions.", button: "Learn music", form: "teachingVideoRequest" },
      { title: "Story Time", text: "Student-friendly stories, read-aloud videos, discussion questions, and creative activities.", button: "Story time", form: "teachingVideoRequest" },
      { title: "Math Activities", text: "Simple math practice, problem-solving activities, and learning resources.", button: "Practice math", form: "teachingVideoRequest" },
      { title: "Hope Capsule", text: "Messages, music, and encouragement created for students and teachers.", button: "Open Hope Capsule", form: "hopeCapsule" },
    ],
    closing: ["To every student and teacher:", "Learning can begin anywhere. Your story matters.", "We are with you."],
  },

};
