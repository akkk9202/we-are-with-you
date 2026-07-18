# FILE_OWNERSHIP_MAP.md

**Purpose:** A single reference table mapping every file and area of the WE ARE WITH YOU repo to what it owns, who edits it, and how safe it is to touch.

> **Project:** WE ARE WITH YOU — a student-led platform by the Greater Youth Collaborative Opus (GYCO). Tagline: *"Even Here. Even Now. We Are With You."* Static site on GitHub Pages — **no backend, no build step, no database, no auth**. Live: https://akkk9202.github.io/we-are-with-you/
>
> **Audience includes hospital patients and grieving families. Tone matters in every change.**

---

## ⚠️ Current vs. target structure — read this first

The `js/content/*` layout described throughout these reference docs is the **TARGET structure for the `design-upgrade` branch**. The **live working tree today** still uses the older flat layout:

| Concept | TARGET (canonical, design-upgrade) | CURRENT (live working tree today) |
|---|---|---|
| Global `SITE` settings | `js/content/global.js` | **`js/config.js`** |
| Page content | `js/content/pages/` | inline in the `*.html` pages |
| Images/videos registry | `js/content/media-assets.js` | referenced directly in `js/config.js` / `js/partners.js` |
| Theme presets | `js/content/theme-options.js` + `css/theme.css` | *(not present yet)* — base tokens live in `css/style.css` |
| Partner data | `js/partners.js` | `js/partners.js` (same) |
| Renderer engine | `js/site.js` | `js/site.js` (same) |
| Base design system | `css/style.css` | `css/style.css` (same) |

When a task says "edit `js/content/global.js`," on the current tree that means **`js/config.js`**. This doc uses the canonical (target) names but flags the current-tree equivalent everywhere it differs.

---

## Ownership & safety table

Safety legend: 🟢 Safe to edit (this is where content lives) · 🟡 Edit with care (structured/rendered) · 🔴 Rarely edit / high-risk (engine, tokens, load-bearing).

| File / area | Owns (what it controls) | Editor | Safety | Notes |
|---|---|---|---|---|
| `js/content/pages/` *(target)* | Per-page editable content blocks | Content editor | 🟡 | **Current:** page content lives inline in the `*.html` files. |
| `js/content/global.js` *(target = current `js/config.js`)* | The `SITE` object: contact email, instagram/youtube, location, all six form URLs, nav, homepage invitation image, homepage carousel, featured press, footerNote, tagline | Content editor | 🟢 | Primary global-settings file. See EDITABLE_FIELDS_MAP.md. |
| `js/content/media-assets.js` *(target)* | Registry of images/videos (paths, alt text) | Content editor | 🟢 | **Current:** media paths are referenced directly in `js/config.js` and `js/partners.js`. See MEDIA_ASSET_GUIDE.md. |
| `js/content/theme-options.js` *(target)* | Selectable theme presets (color/type palettes) | Design editor | 🟡 | **Current:** not present yet. See THEME_SYSTEM_GUIDE.md. |
| `css/theme.css` *(target)* | Theme layer — variable overrides on top of base tokens | Design editor | 🟡 | **Current:** not present yet; theming lives in `css/style.css`. |
| `js/partners.js` | The `PARTNERS` object — every partner/pathway page | Content editor | 🟡 | Object **keys are slugs = load-bearing, never rename**. See QR_AND_SLUG_PROTECTION_GUIDE.md. |
| `js/site.js` | **Renderer engine** — builds nav + footer, renders cards, carousel, and each partner page at runtime; holds safety helpers (`safeUrl()`, `?p=` slug lookup) | Engineer | 🔴 | Reads the data files and injects everything. Rarely edit; re-run full test gate + security check after any change. |
| `css/style.css` | **Base design system** — color/spacing/type tokens, component styles; imports Google Fonts | Design engineer | 🔴 | Only if design is the explicit task. Changing a token cascades site-wide. |
| `index.html` | Homepage (hero, invitation, carousel mount) | Editor | 🟡 | Mostly data-driven via the engine. |
| `programs.html` | Programs / pathways overview | Editor | 🟡 | Cards render from `js/partners.js`. |
| `partner.html` | Renders a single partner via `?p=SLUG` | Engine-driven | 🔴 | Don't hardcode partners here; the engine renders from `partners.js`. |
| `learning.html` | NADO School / learning page | Editor | 🟡 | |
| `student-community.html` | GYCO student community | Editor | 🟡 | |
| `media.html` | Media + featured press | Editor | 🟡 | Press renders from `SITE.press[]`. |
| `join.html`, `contact.html` | Join / Contact pages | Editor | 🟡 | |
| `about.html` | Redirect stub → `index.html` (philosophy merged into homepage) | — | 🔴 | Keep as stub; old links still land. |
| `404.html` | Not-found page | Editor | 🟡 | |
| Redirect stubs — `voices-of-love.html`, `taps-of-love.html`, `gyco.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`, `about-gyco.html` | Forward retired / printed-QR URLs to current pages | — | 🔴 | **Never delete; never change their internal targets.** See QR_AND_SLUG_PROTECTION_GUIDE.md. |
| `assets/images/` | Photos (home invitation, carousel, press) | Editor | 🟢 | Overwrite file at the referenced path — no code change needed for a straight swap. |
| `assets/logos/` | Partner logos | Editor | 🟢 | Missing file → clean monogram fallback. |
| `favicon.svg` | Site favicon | Editor | 🟢 | |
| `test/smoke.test.js` | jsdom DOM smoke tests (asserts rendered output of real pages) | Engineer | 🟡 | Update only when intended behavior changes. See TESTING_GUIDE.md. |
| `CLAUDE.md`, `directives/`, `context/`, `skills/`, `automation/`, `EDITING-*.md` | Docs, rules, and operating procedures | Anyone | 🟢 | Documentation only — changes no website behavior. |

---

## The content model in one line

`js/site.js` (engine) reads `js/content/global.js` *(current: `js/config.js`)* and `js/partners.js`, then injects nav, footer, cards, the carousel, and each partner page at runtime. **Change the data once and every page updates together.** Prefer editing the data files over hand-editing HTML.

*This is a documentation file. It changes no website behavior.*
