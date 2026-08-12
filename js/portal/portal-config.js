/* ============================================================
   PORTAL CONFIG — Community Portal settings & vocabulary.
   The publishable key below is designed to be public (like a
   YouTube embed key): all real security lives in Supabase
   Row Level Security policies. Never put the sb_secret_ key here.
   ============================================================ */

const PORTAL_CONFIG = {
  supabaseUrl: "https://umnlnmjzsbhlxqldmubj.supabase.co",
  supabaseKey: "sb_publishable_MQsFyD7pA_sZnJa-olvkyQ_56qk0E2e",

  /* Portal pages live in /community/ and /admin/, one level below
     the site root. All root-relative links are prefixed with this. */
  root: "../",

  slogan: "Even Here, Even Now, WE ARE WITH YOU.",

  /* ── The six portal communities (slug order = display order) ── */
  communities: [
    { slug: "city-of-hope",          name: "City of Hope Atlanta" },
    { slug: "ronald-mcdonald-house", name: "Ronald McDonald House" },
    { slug: "northside-nicu",        name: "Northside NICU" },
    { slug: "senior-living",         name: "Senior Living" },
    { slug: "schools-global",        name: "Schools & Global" },
    { slug: "milal",                 name: "Milal" },
  ],

  /* Legacy partner-page slugs (printed QR codes) → portal community slugs */
  legacyPartnerMap: {
    "cancer-care": "city-of-hope",
    "ronald-mcdonald-house": "ronald-mcdonald-house",
    "nicu": "northside-nicu",
    "senior-living": "senior-living",
    "disability": "milal",
    "schools-global": "schools-global",
  },

  accountTypes: [
    { value: "participant",       label: "Participant" },
    { value: "family_member",     label: "Family member" },
    { value: "student_volunteer", label: "Student volunteer" },
    { value: "staff_member",      label: "Staff member" },
    { value: "community_member",  label: "Community member" },
  ],

  recipientGroups: [
    { value: "child",                  label: "A child" },
    { value: "parent",                 label: "A parent" },
    { value: "patient",                label: "A patient" },
    { value: "caregiver",              label: "A caregiver" },
    { value: "senior",                 label: "A senior" },
    { value: "student",                label: "A student" },
    { value: "staff_member",           label: "A staff member" },
    { value: "person_with_disability", label: "A person with a disability" },
  ],

  videoRequestTypes: [
    { value: "teaching_video",        label: "Teaching video" },
    { value: "musical_performance",   label: "Musical performance" },
    { value: "encouragement_message", label: "Message of encouragement" },
    { value: "rhythm_activity",       label: "Rhythm activity" },
    { value: "breathing_activity",    label: "Breathing activity" },
    { value: "storytelling_video",    label: "Storytelling video" },
  ],

  contentTypes: {
    performance_video:    { label: "Performance video",    filter: "videos",    action: "Watch" },
    teaching_video:       { label: "Teaching video",       filter: "videos",    action: "Watch" },
    song_performance:     { label: "Song performance",     filter: "music",     action: "Watch" },
    letter:               { label: "Letter",               filter: "letters",   action: "Read" },
    encouraging_message:  { label: "Encouraging message",  filter: "letters",   action: "Read" },
    educational_resource: { label: "Educational resource", filter: "education", action: "View" },
    community_story:      { label: "Community story",      filter: "updates",   action: "Read" },
    community_update:     { label: "Community update",     filter: "updates",   action: "Read" },
    program_announcement: { label: "Program announcement", filter: "updates",   action: "Read" },
    event:                { label: "Event",                filter: "updates",   action: "View" },
    activity:             { label: "Activity",             filter: "activities", action: "Participate" },
  },

  /* ── The five portal actions (community/home.html) ──
     One entry per action row, in display order. `id` doubles as
     the engagement-event metadata value (portal_option_selected).
     The five illustrations were drawn as one set for the printed
     poster and identify each action; they stay small in the UI.
     `artAlt` is empty on purpose: every row's meaning is carried
     by its visible title + description, so the illustration is
     decorative for screen readers (WCAG 1.1.1). All five rows are
     the same size. Descriptions describe what the page actually
     does — keep them plain and verb-first. */
  portalOptions: [
    { id: "with_you",     title: "With You",     description: "Request a letter or read messages from the community",
      href: "with-you.html",     art: "assets/images/portal/with-you-envelope.png",  artAlt: "" },
    { id: "melody_box",   title: "Melody Box",   description: "Watch and listen to music shared by GYCO students",
      href: "melody-box.html",   art: "assets/images/portal/melody-music-box.png",   artAlt: "" },
    { id: "wish_pocket",  title: "Wish Pocket",  description: "Request or dedicate a song",
      href: "request-song.html", art: "assets/images/portal/wish-pocket-pouch.png",  artAlt: "" },
    { id: "bloom_bank",   title: "Bloom Bank",   description: "Teaching videos, resources, and activity guides",
      href: "bloom-bank.html",   art: "assets/images/portal/bloom-bank-book.png",    artAlt: "" },
    { id: "hope_capsule", title: "Hope Capsule", description: "Stories, updates, and letters shared by the community",
      href: "hope-capsule.html", art: "assets/images/portal/hope-capsule-jar.png",   artAlt: "" },
  ],

  /* Shown wherever health-related educational content appears. */
  healthDisclaimer:
    "This content is for general education and does not replace professional medical advice.",

  contentFilters: [
    { key: "all",        label: "All" },
    { key: "videos",     label: "Videos" },
    { key: "letters",    label: "Letters" },
    { key: "music",      label: "Music" },
    { key: "education",  label: "Education" },
    { key: "activities", label: "Activities" },
    { key: "updates",    label: "Community Updates" },
  ],

  letterStatuses: {
    draft:        { label: "Draft",        tone: "muted" },
    submitted:    { label: "Submitted",    tone: "blue" },
    under_review: { label: "Under review", tone: "blue" },
    approved:     { label: "Approved",     tone: "green" },
    delivered:    { label: "Delivered",    tone: "gold" },
    rejected:     { label: "Not approved", tone: "red" },
  },

  requestStatuses: {
    submitted:    { label: "Submitted",    tone: "blue" },
    under_review: { label: "Under review", tone: "blue" },
    in_progress:  { label: "In progress",  tone: "gold" },
    completed:    { label: "Completed",    tone: "green" },
    declined:     { label: "Declined",     tone: "red" },
  },

  submissionStatuses: {
    started:   { label: "Started",   tone: "blue" },
    submitted: { label: "Submitted", tone: "blue" },
    completed: { label: "Completed", tone: "green" },
  },

  languages: ["English", "Korean", "Spanish", "Other"],

  privacyNote:
    "Please do not include private medical details, diagnoses, full addresses, " +
    "or other identifying personal information in letters or requests.",

  consentSummary: [
    "We collect your name, email, account type, and community so the portal can work for you.",
    "We record engagement activity (like videos watched and letters written) to understand and improve the program.",
    "Letters and requests may be reviewed by GYCO administrators before they are shared.",
    "Public sharing is always optional and always your choice.",
    "You can change your community, update your details, or request account and data removal at any time in Profile Settings.",
    "If you are under 18, please make sure a parent or guardian is comfortable with you creating an account.",
  ],
};
