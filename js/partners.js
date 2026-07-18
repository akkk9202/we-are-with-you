/* ============================================================
   PARTNER PATHWAYS — all pathway/partner content lives here.
   Each entry becomes a page at partner.html?p=SLUG and a card
   on the homepage + Programs page (rendered automatically).

   Fields on every partner:
     order    → position everywhere (nav dropdown, cards, footer)
     name     → the visible pathway name (edit here, updates site-wide)
     logo     → path to the partner logo (assets/logos/…)
     logoAlt  → accessible alt text for the logo
     audience → who the page serves (card subtitle, e.g. "For Families")
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
    audience: "For Cancer Patients",
    cardText: "Supporting patients, survivors, caregivers, and healthcare teams through music, stories, encouragement, and community connection.",
    heroTitle: "WE ARE WITH YOU at City of Hope Atlanta",
    heroText: "Music, messages, stories, and encouragement for patients, families, caregivers, survivors, and healthcare staff.",
    about: "This page was created for the City of Hope Atlanta community, formerly Cancer Treatment Centers of America (CTCA). Students and community partners share music, letters, teaching videos, stories, and activities designed for patients and those who support them. Visitors can access the page through QR codes, printed materials, digital links, events, and partner programs.",
    cards: [
      /* Card #1 is always "One Message for You" — the signature program
         every partner begins with. Only the subtitle text changes per
         community. Keep it first on every partner. */
      { title: "One Message for You", text: "Every visit begins with one message. Read a message of encouragement written for you, or share one for a patient, family member, caregiver, survivor, or staff member.", button: "Read & share a message", form: "letterSubmission" },
      { title: "Song Request", text: "Request a meaningful song for yourself, a patient, caregiver, family member, or loved one. When possible, GYCO students may prepare the song for a live or recorded performance.", button: "Request a song", form: "songRequest" },
      { title: "Voices of Love", text: "Share the story, memory, or meaning behind a song. Patients, families, caregivers, survivors, and staff may share how music connects to their journey.", button: "Share your voice", form: "songRequest" },
      { title: "Taps of Love", text: "Watch short teaching videos created by students. Explore simple rhythms, music activities, breathing exercises, and creative ways to participate wherever you are.", button: "Watch teaching videos", href: "learning.html" },
      { title: "Patient Stories", text: "Read or share reflections, encouragement, and meaningful moments from the cancer care community.", button: "Share a story", form: "letterSubmission" },
      { title: "Hope Capsule", text: "Open a small collection of messages, music, reflections, and encouragement created for moments when someone needs hope.", button: "Open Hope Capsule", form: "hopeCapsule" },
    ],
    closing: ["To every patient, family member, caregiver, survivor, and staff member:", "You are not alone.", "Even here, even now, WE ARE WITH YOU."],
  },

  "ronald-mcdonald-house": {
    order: 2,
    name: "Ronald McDonald House",
    // TODO: Swap in an updated logo anytime — assets/logos/ronald-mcdonald-house.png
    logo: "assets/logos/ronald-mcdonald-house.png",
    logoAlt: "Ronald McDonald House logo",
    audience: "For Families",
    cardText: "Offering hope and meaningful moments to families staying close to hospitalized children.",
    heroTitle: "WE ARE WITH YOU at Ronald McDonald House",
    heroText: "Music, letters, activities, and encouragement for children, parents, siblings, and families.",
    about: "This page was created for families staying near a hospital while a child receives care. Students share letters, cheerful music, sing-alongs, and simple activities that families can enjoy together during long and uncertain days.",
    cards: [
      { title: "One Message for You", text: "One kind message can brighten a long stay. Read a message written for your family, or share one for a child, parent, or sibling staying near the hospital.", button: "Read & share a message", form: "letterSubmission" },
      { title: "Letters for Kids", text: "Read kind messages written for children who may need encouragement, joy, or a reminder that others are thinking of them.", button: "Read letters", form: "letterSubmission" },
      { title: "Letters for Parents", text: "Messages of support for parents and caregivers navigating long, difficult, or uncertain days.", button: "Read parent letters", form: "letterSubmission" },
      { title: "Music for Happy Moments", text: "Enjoy cheerful music, sing-alongs, rhythm activities, and simple musical experiences created for families.", button: "Listen and join", href: "media.html" },
      { title: "Music Requests", text: "Request a song for your child, sibling, parent, or another loved one.", button: "Request music", form: "songRequest" },
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
    audience: "For Babies & Families",
    cardText: "Supporting newborns and their families through music, messages, and compassionate support.",
    heroTitle: "WE ARE WITH YOU at the Northside NICU",
    heroText: "Gentle music, letters, stories, and encouragement for babies, parents, families, and care teams.",
    about: "This page was created for the neonatal intensive care community at Northside Hospital. The content is intentionally gentle and calming, with quiet music, letters of love, and stories of hope for parents spending long days and nights beside their baby.",
    cards: [
      { title: "One Message for You", text: "A gentle message for parents spending long days and nights beside their baby. Read one, or share one for another NICU family.", button: "Read & share a message", form: "letterSubmission" },
      { title: "Letter for Your Baby", text: "Write or read a letter filled with love, hope, and encouragement for a baby and their family.", button: "Read letters", form: "letterSubmission" },
      { title: "Letters for Parents", text: "Messages of encouragement for parents spending long days and nights beside their child.", button: "Read parent messages", form: "letterSubmission" },
      { title: "Quiet Music", text: "Gentle music selected to support moments of calm, reflection, prayer, rest, and emotional comfort.", button: "Listen quietly", href: "media.html" },
      { title: "Stories of Hope", text: "Read or share stories of strength, patience, love, and hope within families.", button: "Read stories", form: "letterSubmission" },
      { title: "Hope Capsule", text: "A quiet collection of music, messages, and reflections for parents and families.", button: "Open Hope Capsule", form: "hopeCapsule" },
    ],
    closing: ["To every parent and family:", "Your love is present in every moment.", "Even here, even now, WE ARE WITH YOU."],
  },

  "senior-living": {
    order: 4,
    name: "Senior Living",
    // Swap in an updated logo anytime — assets/logos/senior-living.png
    logo: "assets/logos/senior-living.png",
    logoAlt: "Adoration Home Health and MeSun Senior Living logos",
    audience: "For Older Adults",
    cardText: "Creating joyful experiences through music, performances, conversation, and intergenerational connection.",
    heroTitle: "WE ARE WITH YOU for Senior Living Communities",
    heroText: "Music, memories, stories, and intergenerational connection.",
    about: "This page was created for residents, families, staff, and student volunteers in senior living communities. Familiar songs open conversations, memories become stories, and generations connect through music.",
    cards: [
      { title: "One Message for You", text: "One message can spark a memory. Read a message of appreciation written for you, or share one for a resident, family member, staff member, or volunteer.", button: "Read & share a message", form: "letterSubmission" },
      { title: "Familiar Songs", text: "Enjoy songs that evoke memories, offer comfort, inspire joy, and encourage conversation.", button: "Listen", href: "media.html" },
      { title: "Music Requests", text: "Request a song that is meaningful to you, your family, or your community.", button: "Request a song", form: "songRequest" },
      { title: "Memory Stories", text: "Share a memory connected to a song, place, person, or life experience.", button: "Share a memory", form: "letterSubmission" },
      { title: "Student Performances", text: "Watch or listen to performances created by GYCO students.", button: "View performances", href: "media.html" },
      { title: "Hope Capsule", text: "A collection of music, messages, and reflections designed to foster encouragement and connection.", button: "Open Hope Capsule", form: "hopeCapsule" },
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
    audience: "For Individuals with Disabilities",
    cardText: "Building inclusive opportunities through music, education, family engagement, and accessible resources.",
    heroTitle: "WE ARE WITH YOU at The America Wheat Mission (Milal)",
    heroText: "Music, participation, stories, and encouragement for individuals, families, educators, and support networks.",
    about: "This page was created with The America Wheat Mission (Milal), an Atlanta-based organization serving people with disabilities and their families. Every activity is designed with accessibility and flexibility in mind, including rhythm, movement, listening, and participation that can be adapted to individuals, families, classrooms, and community settings.",
    cards: [
      { title: "One Message for You", text: "Every friendship begins with one message. Read a message of encouragement, or share one for an individual, family, educator, or support network.", button: "Read & share a message", form: "letterSubmission" },
      { title: "Accessible Music Activities", text: "Simple activities centered on rhythm, movement, listening, and participation.", button: "Try an activity", form: "teachingVideoRequest" },
      { title: "Teaching Videos", text: "Short videos that introduce music in clear, accessible, and flexible formats.", button: "Watch videos", form: "teachingVideoRequest" },
      { title: "Family Participation", text: "Activities that families can enjoy together at home, at school, or in community spaces.", button: "Join together", form: "teachingVideoRequest" },
      { title: "Stories & Reflections", text: "Share experiences, needs, hopes, and meaningful moments.", button: "Share a story", form: "letterSubmission" },
      { title: "Hope Capsule", text: "Encouragement, music, and messages designed to foster connection within an inclusive community.", button: "Open Hope Capsule", form: "hopeCapsule" },
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
    audience: "For Students & Communities",
    cardText: "Helping students learn, serve, and lead while connecting communities through education, music, and service.",
    heroTitle: "WE ARE WITH YOU for Schools & Global Communities",
    heroText: "Learning, music, stories, and encouragement for students, teachers, and partner schools.",
    about: "This page was created for local and global partner schools. Students help other students learn through simple English lessons, beginner music instruction, read-aloud stories, and practice activities that are accessible through a digital link or QR code.",
    cards: [
      { title: "One Message for You", text: "Learning begins with encouragement. Read a message from another student, or send one to a classroom across the world.", button: "Read & share a message", form: "letterSubmission" },
      { title: "Learn English", text: "Simple English lessons, vocabulary videos, reading activities, and practice materials.", button: "Learn English", form: "teachingVideoRequest" },
      { title: "Learn Music", text: "Beginner music lessons, rhythm activities, singing, and instrument introductions.", button: "Learn music", form: "teachingVideoRequest" },
      { title: "Story Time", text: "Student-friendly stories, read-aloud videos, discussion questions, and creative activities.", button: "Story time", form: "teachingVideoRequest" },
      { title: "Math Activities", text: "Simple math practice, problem-solving activities, and learning resources.", button: "Practice math", form: "teachingVideoRequest" },
      { title: "Hope Capsule", text: "Messages, music, and encouragement created for students and teachers.", button: "Open Hope Capsule", form: "hopeCapsule" },
    ],
    closing: ["To every student and teacher:", "Learning can begin anywhere. Your story matters.", "We are with you."],
  },

};
