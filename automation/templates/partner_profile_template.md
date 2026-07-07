# Partner Profile Template (new `js/partners.js` entry)

> **Purpose:** Scaffold a brand-new partner / pathway entry for the `PARTNERS` object in `js/partners.js`. The renderer (`js/site.js`) builds the whole partner page from this data.

## How to use this template

1. Copy this file, fill in every `______` blank.
2. Translate it into a new key on the `PARTNERS` object in `js/partners.js` (skeleton at bottom).
3. Run the smoke tests (`test_report_template.md`) — expect **80 passed, 0 failed**.

---

## ⚠️ Slug rules (read before choosing a slug)

- The **slug** is the object key and appears in the page URL. Slugs are **printed on QR codes** and live in old links — they are permanent.
- **Never reuse or rename an existing slug.** To change a partner's display name, edit the `name` field, not the slug.
- Existing slugs (do NOT reuse): `cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`, `disability`, `schools-global`.
- A new slug must be lowercase-hyphenated, unique, and chosen to last forever.

## ⚠️ Form-key rules

- Any card button that opens a form must reference a real key from `SITE.forms`:
  `studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest`.
- A card uses **either** `form: "<key>"` **or** `href: "page.html"` — not both.
- An unknown or `REPLACE_ME` form key routes safely to the contact page; never invent a form key.

---

## Fields

- **Slug (NEW, permanent):** ______
- **Order (sort position among partners):** ______
- **Name (visible title):** ______
- **Logo path:** `assets/logos/______`
- **Logo alt text:** ______
- **Card text (short blurb on the partner grid):** ______

### Hero

- **Hero title:** ______
- **Hero text:** ______

### About

- **About (intro paragraph(s)):** ______

### Cards (one or more action blocks)

For each card:

- **Title:** ______
- **Text:** ______
- **Button label:** ______
- **Button action:** `form: "______"` **OR** `href: "______.html"`  <!-- pick one -->

(repeat per card)

### Closing

- **Closing line(s):** ______  <!-- warm sign-off; keep tone gentle -->

## Tone check

- [ ] Warm, humble, student-led voice — no overpromising to vulnerable audiences
- [ ] No medical/outcome claims
- [ ] Reviewed against `context/brand_voice.md`

## JS skeleton (add to the `PARTNERS` object in `js/partners.js`)

```js
"______": {                      // <-- NEW slug, permanent, never rename
  order: ______,
  name: "______",
  logo: "assets/logos/______",
  logoAlt: "______",
  cardText: "______",
  heroTitle: "______",
  heroText: "______",
  about: "______",
  cards: [
    { title: "______", text: "______", button: "______", form: "______" },   // SITE.forms key
    { title: "______", text: "______", button: "______", href: "______.html" },
  ],
  closing: [
    "______",
  ],
},
```

<!-- Match exact key names used by existing entries in js/partners.js. Leave REPLACE_ME / TODO
     for anything not yet confirmed — the site renders safe fallbacks for those. -->
