# EDITABLE_FIELDS_MAP.md

**Purpose:** A "I want to change X → edit field Y in file Z" reference covering every editable field on the site — global settings and every partner field.

> Almost all content lives in **two data files**: the `SITE` object in `js/content/global.js` *(current tree: `js/config.js`)* and the `PARTNERS` object in `js/partners.js`. The engine (`js/site.js`) renders them onto every page. **Change the data once and the whole site updates.**

**Golden rules while using this map**
- Prefer editing the **data files** over hand-editing HTML.
- **Never rename a partner slug** (the object key) — change the `name` field instead.
- **Don't invent real values** for `REPLACE_ME…` / `TODO` placeholders — they render as safe fallbacks by design.
- After any edit, run the test gate (see TESTING_GUIDE.md).

> **Current vs. target:** Global settings currently live in **`js/config.js`**; the design-upgrade target moves them to **`js/content/global.js`**. The field names and behavior are identical — only the filename differs.

---

## Map 1 — Global settings: the `SITE` object

File: `js/content/global.js` *(current: `js/config.js`)*

| I want to change… | Field | Notes / current behavior |
|---|---|---|
| Official contact email | `SITE.email` | Default `REPLACE_ME@example.com` renders as an **"Email coming soon"** fallback (no broken mailto). |
| Instagram link/icon | `SITE.instagram` | Empty `""` **hides** the icon. |
| YouTube link/icon | `SITE.youtube` | Empty `""` **hides** the icon. |
| Location text | `SITE.location` | e.g. "Georgia, United States". |
| Tagline | `SITE.tagline` | "Even Here. Even Now. We Are With You." |
| Footer tagline note | `SITE.footerNote` | Short line shown in the footer. |
| Student application form | `SITE.forms.studentApplication` | See form-key behavior below. |
| Partner inquiry form | `SITE.forms.partnerInquiry` | |
| Song request form | `SITE.forms.songRequest` | |
| Letter submission form | `SITE.forms.letterSubmission` | |
| Hope Capsule form | `SITE.forms.hopeCapsule` | |
| Teaching video request form | `SITE.forms.teachingVideoRequest` | |
| Nav items / order / labels | `SITE.nav` | Array **order = display order**. "Programs" builds its dropdown from `js/partners.js`. **Don't change hrefs targeted by redirect stubs.** |
| The Contact button | `SITE.nav` entry with `cta: true` | That flagged entry renders as the Contact CTA button. |
| Homepage "invitation" image | `SITE.home.invitation` | Object with `src` + `alt`. Overwrite `assets/images/home-invitation.jpg` or repoint `src`. |
| Homepage carousel images/captions | `SITE.home.carousel[]` | Each item: `src`, `alt`, `caption`. One image at a time; arrows / dots / keyboard / swipe; **no autoplay**. |
| Featured press article | `SITE.press[]` | See press fields below. |

### The six form keys (how `data-form` routing works)

Any element with `data-form="<key>"` in the HTML routes through `SITE.forms[<key>]`. The six keys are:
`studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest`.

- A key still set to the placeholder **`REPLACE_ME_GOOGLE_FORM_URL`** safely routes to the **contact page** — never a dead link. Leave placeholders as-is until you have a real Google Form URL.
- To wire up a form, paste the real Google Form URL as the value of the matching key.

### Featured press fields (`SITE.press[]`)

| Field | What it is |
|---|---|
| `label` | Small eyebrow label. |
| `title` | Article title. |
| `publisher` | Outlet name (e.g. Newswave25). |
| `description` | Short blurb. |
| `languages` | e.g. English / Korean. |
| `image` | `{ src, alt }`. |
| `links[]` | Each `{ label, href }`. **Preserve the percent-encoded Korean article URL exactly** — do not "clean up" or re-encode it. |

---

## Map 2 — Partner/pathway pages: the `PARTNERS` object

File: `js/partners.js`. Each entry becomes a page at `partner.html?p=SLUG` plus a homepage card, a Programs card, and a nav dropdown item — all rendered automatically by the engine.

### The slugs (object keys) — load-bearing, never rename

| Slug (key) | Visible `name` | `order` |
|---|---|---|
| `cancer-care` | City of Hope Atlanta (CTCA) | 1 |
| `ronald-mcdonald-house` | Ronald McDonald House | 2 |
| `nicu` | Northside Intensive Care Unit (NICU) | 3 |
| `senior-living` | Senior Living | 4 |
| `disability` | The America Wheat Mission (Milal) | 5 |
| `schools-global` | Schools & Global Communities | 6 |

To change what shows publicly, edit the **`name`** field — never the key. See QR_AND_SLUG_PROTECTION_GUIDE.md.

### Fields on each partner entry

| I want to change… | Field | Notes |
|---|---|---|
| The URL slug | *(the object key)* | **Load-bearing — never rename.** Printed QR codes and old links depend on it. |
| Where it appears (nav / cards / footer) | `order` | Number; lower = earlier. |
| Public pathway name | `name` | Edit here — updates site-wide. **Not** the slug. |
| Partner logo | `logo` | Path under `assets/logos/…`. Missing file → clean **monogram fallback**. |
| Logo alt text | `logoAlt` | Accessibility. |
| Short card description | `cardText` | Shown on the pathway card. |
| Page hero heading | `heroTitle` | Top of the partner page. |
| Page hero subtext | `heroText` | |
| Intro paragraph | `about` | |
| Action cards on the page | `cards[]` | Each card: `title`, `text`, `button`, and **either** `form:"<SITE.forms key>"` **or** `href:"page.html"` (a direct internal link) — one or the other. |
| Closing lines | `closing[]` | Array of short lines shown at the bottom. |

### Adding a new partner

Copy an existing block, give it a **new unique slug** (object key), a new `order`, and content. Nav dropdown, homepage cards, Programs page, and footer update automatically. Each card's `form` value **must match a key in `SITE.forms`** — otherwise use `href` for a direct internal link.

---

*This is a documentation file. It changes no website behavior.*
