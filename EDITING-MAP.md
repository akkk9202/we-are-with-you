# EDITING-MAP.md — "I want to change X → edit Y"

A field-by-field map of where every editable thing on the site actually lives. Almost all content
is in **two data files** (`js/config.js`, `js/partners.js`); `js/site.js` renders it onto every page.
**Change the data once and the whole site updates.**

Pair this with `AUTOMATION_START_HERE.md` (how to operate) and `EDITING-GUIDE.md` (plain-English
version for non-technical editors). For the rules, see `directives/website_editing_workflow.md`.

> **Golden rules while using this map**
> - Prefer editing the **data files** over hand-editing HTML.
> - **Never rename a partner slug** (the object key) — change the `name` field instead.
> - **Don't invent real values** for `REPLACE_ME…` / `TODO` — they render as safe fallbacks.
> - After any edit, run the regression gate (bottom of this file).

---

## Map 1 — `js/config.js` (the `SITE` object)

Site-wide settings: contact, forms, navigation, homepage images, featured press.

| I want to change… | Field | Notes |
|---|---|---|
| Official email | `SITE.email` | `REPLACE_ME@example.com` → renders as "Email coming soon" fallback |
| Instagram / YouTube links | `SITE.instagram`, `SITE.youtube` | Leave `""` to hide the icon |
| Location text | `SITE.location` | Currently "Georgia, United States" |
| A Google Form link | `SITE.forms.<key>` | Keys: `studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest` |
| Navigation items / order / labels | `SITE.nav` | Array order = display order. "Programs" builds its dropdown from `partners.js`. Don't change hrefs targeted by redirects |
| The "Programs" CTA / Contact button | `SITE.nav` entry with `cta: true` | |
| "Why we exist" homepage image | `SITE.home.invitation` | `src` + `alt`. Overwrite `assets/images/home-invitation.jpg` or repoint `src` |
| Homepage carousel images / captions | `SITE.home.carousel[]` | Each item: `src`, `alt`, `caption`. One image at a time; no autoplay |
| Featured press article | `SITE.press[]` | `title`, `publisher`, `description`, `languages`, `image`, `links[]`. **Preserve Korean text and encoded URLs exactly** |
| Footer tagline note | `SITE.footerNote` | |

- **`data-form="<key>"`** anywhere in the HTML routes through `SITE.forms`. A button whose key is
  still `REPLACE_ME_GOOGLE_FORM_URL` safely routes to the contact page instead of a dead link.
- The tagline **"Even Here. Even Now. We Are With You."** lives in `SITE.tagline`.

---

## Map 2 — `js/partners.js` (the `PARTNERS` object)

One entry per partner community. Each entry becomes a page at `partner.html?p=SLUG`, plus a card on
the homepage and the Programs page — all rendered automatically.

### The slugs (the object keys) — **load-bearing, never rename**

| Slug (key) | Visible `name` | `order` |
|---|---|---|
| `cancer-care` | City of Hope Atlanta (CTCA) | 1 |
| `ronald-mcdonald-house` | Ronald McDonald House | 2 |
| `nicu` | Northside Intensive Care Unit (NICU) | 3 |
| `senior-living` | Senior Living | 4 |
| `disability` | The America Wheat Mission (Milal) | 5 |
| `schools-global` | Schools & Global Communities | 6 |

Slugs are printed on physical QR codes and linked from old URLs. To change what shows publicly,
edit the **`name`** field — never the key.

### Fields on each partner entry

| I want to change… | Field | Notes |
|---|---|---|
| Where it appears in nav/cards/footer | `order` | Number; lower = earlier |
| The public pathway name | `name` | Edit here — updates site-wide. **Not** the slug |
| Partner logo | `logo` | Path under `assets/logos/…`. Missing file → clean monogram fallback |
| Logo alt text | `logoAlt` | Accessibility |
| Short card description | `cardText` | Shown on the pathway card |
| Page hero heading / subtext | `heroTitle`, `heroText` | Top of the partner page |
| Intro paragraph | `about` | |
| The action cards on the page | `cards[]` | Each: `title`, `text`, `button`, and **either** `form:"<key>"` (must match a `SITE.forms` key) **or** `href:"page.html"` (direct link) |
| Closing lines | `closing[]` | Array of short lines shown at the bottom |

### Adding a new partner

Copy an existing block, give it a **new slug**, a new `order`, and content. Nav dropdown, homepage
cards, Programs page, and footer update automatically. Ensure each card's `form` value matches a key
in `SITE.forms`, or use `href` for a direct internal link.

---

## Map 3 — `js/site.js` (the engine) — edit rarely

Builds the nav + footer, and renders cards, the carousel, and each partner page from the two data
files. Also home to the safety helpers (e.g. `safeUrl()` for config-supplied links, the `?p=` slug
lookup). **Touching this is high-risk** — re-run the full regression gate *and*
`directives/security_check_before_deploy.md` afterward. Most tasks never need to edit it.

---

## Map 4 — The HTML pages

Prefer the data files above. Edit raw HTML only for page-specific static sections that aren't
data-driven.

| Page file | What it is |
|---|---|
| `index.html` | Homepage (hero, invitation, carousel) |
| `programs.html` | Programs / pathways overview |
| `partner.html` | Renders a single partner via `?p=SLUG` |
| `learning.html` | NADO School / learning |
| `media.html` | Media + featured press |
| `join.html` | Join Us |
| `about.html`, `about-gyco.html`, `student-community.html`, `gyco.html` | About / GYCO / community |
| `contact.html` | Contact |
| `404.html` | Not-found page |
| `voices-of-love.html`, `taps-of-love.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html` | **Redirect stubs** — forward retired URLs to current pages. Don't delete; don't change their internal targets |

---

## Map 5 — Assets

| I want to change… | Where |
|---|---|
| A photo | Overwrite the file in `assets/images/…` at the referenced path |
| A partner logo | Overwrite the file in `assets/logos/…` (missing → monogram fallback) |
| The favicon | `favicon.svg` |
| The design system (colors, spacing, type) | `css/style.css` — **only if that is the task**; run `skills/frontend_design_review.md` first |

Dropping a real file at a referenced path is all that's needed; no code change required for a
straight image swap.

---

## After any edit — the regression gate

```bash
node --check js/site.js            # if JS changed
npm install jsdom --no-save        # transient; node_modules is gitignored
node test/smoke.test.js            # expect: 80 passed, 0 failed
rm -rf node_modules                # optional cleanup
```

Then show the diff. **Do not commit or push** unless explicitly asked
(`directives/github_workflow.md`). If links, scripts, or headers changed, also run
`directives/security_check_before_deploy.md`.

*This is a documentation file. It changes no website behavior.*
