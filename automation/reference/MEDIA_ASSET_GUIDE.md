# MEDIA_ASSET_GUIDE.md

**Purpose:** A reference for managing images and videos — where they're registered, where the files live, the homepage invitation + carousel, press image, partner logos, alt-text rules, placeholder behavior, and naming/sizing conventions.

> **⚠️ Current vs. target:** The media registry **`js/content/media-assets.js`** is the **design-upgrade target**. In the **live working tree today**, media paths and alt text are referenced directly inside `js/config.js` (the `SITE` object) and `js/partners.js`. The file locations under `assets/` are the same in both.

---

## 1. Where media lives

| Layer | Location | Owns |
|---|---|---|
| Registry (target) | `js/content/media-assets.js` | Paths + alt text for images/videos, in one place |
| Registry (current) | `js/config.js` (`SITE.home.*`, `SITE.press[]`) and `js/partners.js` (`logo`) | Same info, referenced inline |
| Image files | `assets/images/` | Photos: homepage invitation, carousel frames, press image |
| Logo files | `assets/logos/` | Partner logos |
| Favicon | `favicon.svg` | Browser tab icon |

**Straight swap rule:** dropping a real file at the **already-referenced path** replaces an image with **no code change**. You only edit a data file when you change the *path*, the *alt text*, or *add* an asset.

### Files present today

| Path | Used for |
|---|---|
| `assets/images/home-invitation.jpg` | Homepage "invitation" image |
| `assets/images/home-carousel-1.jpg` | Homepage carousel frame 1 |
| `assets/images/home-carousel-2.jpg` | Homepage carousel frame 2 |
| `assets/images/home-carousel-3.jpg` | Homepage carousel frame 3 |
| `assets/logos/city-of-hope-atlanta.png` | `cancer-care` logo |
| `assets/logos/ronald-mcdonald-house.png` | `ronald-mcdonald-house` logo |
| `assets/logos/northside-nicu.png` | `nicu` logo |
| `assets/logos/milal.png` | `disability` logo |
| `assets/logos/nado-school.png` | NADO School logo |
| `assets/logos/gyco.png` | GYCO logo |

> Note: not every partner has a logo file (e.g. `senior-living`, `schools-global`) — those render the **monogram fallback** (see §4).

---

## 2. Homepage invitation + carousel

| Element | Field (`SITE.home.*`) | Behavior |
|---|---|---|
| Invitation image | `SITE.home.invitation` = `{ src, alt }` | Single "why we exist" image. Swap the file at `src` or repoint it. |
| Carousel | `SITE.home.carousel[]` — each `{ src, alt, caption }` | **One image at a time.** Navigation via **arrows, dots, keyboard, and swipe**. **No autoplay.** Add/remove/reorder frames by editing the array. |

To add a carousel frame: drop a new image in `assets/images/`, add a `{ src, alt, caption }` object to `SITE.home.carousel[]`.

---

## 3. Press image

`SITE.press[]` items carry `image: { src, alt }` for the featured article (e.g. the Newswave25 piece). Swap the file at `src` or update the object. **Preserve the article's percent-encoded Korean link in `links[]` exactly** — see EDITABLE_FIELDS_MAP.md.

---

## 4. Partner logos + monogram fallback

- Each partner entry in `js/partners.js` has `logo` (a path under `assets/logos/…`) and `logoAlt`.
- **If the logo file is missing** at the referenced path, the engine renders a **clean monogram fallback** (derived from the partner name) instead of a broken image. This is intentional — a partner without a supplied logo still looks finished.
- To add/replace a logo: drop the file in `assets/logos/` and point `logo` at it; set a meaningful `logoAlt`.

---

## 5. Placeholder (`TODO`) images

Image paths left as **`TODO` placeholders** auto-render a **styled placeholder** rather than a broken image. This lets pages ship before final photography exists. **Don't invent a real-looking path** — leave the placeholder until you have the actual asset, then swap it in.

---

## 6. Alt-text rules

- Every image needs meaningful `alt` text — this audience includes screen-reader users and the tone must stay warm and human.
- Describe **what the image shows and why it matters**, not "image of…".
- Decorative-only images can take empty `alt=""`, but most images here are meaningful and should be described.
- Keep alt text concise, accurate, and free of hospital/medical assumptions about the people shown.

---

## 7. Naming & sizing conventions

- **Names:** lowercase, hyphenated, descriptive, matching the existing pattern — `home-invitation.jpg`, `home-carousel-1.jpg`, `city-of-hope-atlanta.png`. Keep the extension the referenced code expects.
- **Reuse existing filenames** for straight swaps so no code changes.
- **Format:** photos as `.jpg`; logos as `.png` (transparent where appropriate); favicon as `.svg`.
- **Sizing:** match the aspect/scale of the file you're replacing so layout doesn't shift; compress reasonably (static GitHub Pages — keep files light for slow hospital/mobile connections).

---

## 8. Media-change checklist

- [ ] File dropped at the correct path under `assets/…` (or path updated in the data file).
- [ ] Alt text is meaningful and warm.
- [ ] Carousel entries have `src`, `alt`, and `caption`.
- [ ] No `TODO`/placeholder was replaced with a fake path.
- [ ] Smoke tests still pass (TESTING_GUIDE.md).

*This is a documentation file. It changes no website behavior.*
