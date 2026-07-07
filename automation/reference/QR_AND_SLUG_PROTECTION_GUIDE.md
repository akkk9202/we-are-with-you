# QR_AND_SLUG_PROTECTION_GUIDE.md

**Purpose:** A deep reference on why the six partner slugs and the redirect stubs are load-bearing, how `partner.html?p=SLUG` works, how to rename a pathway safely, and the full stub → destination list.

> **The core risk:** This platform hands physical QR codes to people inside hospitals, senior communities, and family spaces, and shares links that live in printed materials and old messages. Those URLs **cannot be re-issued**. A slug rename or a deleted stub silently 404s a real person — often a patient or a grieving family member — at the worst possible moment. Protecting these strings is a tone and trust issue, not just a technical one.

---

## 1. Why the six slugs are load-bearing

A partner "slug" is the **object key** in the `PARTNERS` object (`js/partners.js`). It is also the public address of that pathway's page: `partner.html?p=<slug>`. That exact string is:

- **Printed on physical QR codes** distributed at partner sites.
- **Embedded in old URLs** shared before the current site structure existed.
- **Targeted by redirect stubs** (below) that forward retired page names.

Change the key and every one of those breaks at once. There is no server to add a redirect and no analytics to catch the fallout.

### The six slugs (never rename the key)

| Slug (key) | Visible `name` | `order` | Public URL |
|---|---|---|---|
| `cancer-care` | City of Hope Atlanta (CTCA) | 1 | `partner.html?p=cancer-care` |
| `ronald-mcdonald-house` | Ronald McDonald House | 2 | `partner.html?p=ronald-mcdonald-house` |
| `nicu` | Northside Intensive Care Unit (NICU) | 3 | `partner.html?p=nicu` |
| `senior-living` | Senior Living | 4 | `partner.html?p=senior-living` |
| `disability` | The America Wheat Mission (Milal) | 5 | `partner.html?p=disability` |
| `schools-global` | Schools & Global Communities | 6 | `partner.html?p=schools-global` |

Note that slugs are intentionally **generic/stable** (`cancer-care`, `disability`) while the visible `name` carries the real, sometimes-changing partner name. That separation is deliberate: the name can change, the slug never does.

---

## 2. How `partner.html?p=SLUG` works

1. Every partner link on the site points at `partner.html?p=<slug>` (built automatically by the engine from `js/partners.js`).
2. `partner.html` is a thin shell. On load, `js/site.js` reads the `?p=` query parameter.
3. The engine looks up `PARTNERS[<slug>]`. If found, it renders that entry's `heroTitle`, `heroText`, `about`, `cards[]`, `closing[]`, logo, etc. into the page.
4. If the slug is missing/unknown, the visitor gets a not-found experience instead of a real page — which is exactly what happens if you rename a key that a printed QR still points to.

Because the page is rendered from data, **you never hand-build a partner page** — you edit the entry in `js/partners.js` and the URL keeps working.

---

## 3. How to rename a pathway safely

You almost never need to change a slug — only the **displayed name**.

**✅ Safe rename (do this):**
- Edit the **`name`** field on the partner entry. This updates the card, hero, nav dropdown, footer, and Programs page everywhere at once. The URL and QR codes keep working.
- Adjust `order` if you want it to move in the lists.

**❌ Never do this:**
- Rename the object **key** (the slug). It orphans every printed QR code, every old shared link, and every redirect stub that forwards to it.

If a slug rename is ever truly unavoidable (it essentially never is for a static GitHub Pages site with no redirect server), the only non-breaking path is to **keep the old key alive as a redirect stub** — do not just rename it.

---

## 4. The redirect stubs — never delete

Redirect stubs are small standalone HTML files that forward retired or printed URLs to their current destination. They exist because those old URLs were printed or shared and can't be recalled. **Never delete a stub; never point it at a dead destination.**

| Redirect stub file | Forwards to |
|---|---|
| `voices-of-love.html` | `partner.html?p=cancer-care` |
| `taps-of-love.html` | current destination page/anchor (retired campaign URL) |
| `gyco.html` | GYCO student community page |
| `we-are-with-you.html` | current home/landing destination |
| `beat-and-breeze.html` | current destination page/anchor (retired campaign URL) |
| `winds-of-love.html` | current destination page/anchor (retired campaign URL) |
| `about-gyco.html` | About / GYCO destination |

> The `voices-of-love.html → partner.html?p=cancer-care` mapping is the canonical, confirmed example. The others follow the same pattern: an old printed/shared URL forwarding to its live successor. When verifying a stub, open the file and confirm its target is a **live** page/anchor before changing anything.

### If a destination page genuinely moves

Update the **target inside the stub** to the new live URL/anchor. Do **not** delete the stub, and do **not** leave it pointing at a page that no longer exists.

---

## 5. Quick protection checklist

- [ ] No partner **object key** was renamed (only `name` changed, if anything).
- [ ] All six slugs still resolve at `partner.html?p=<slug>`.
- [ ] No redirect stub was deleted.
- [ ] Every stub still points at a live destination.
- [ ] No nav href that a stub forwards to was changed without updating the stub.

*This is a documentation file. It changes no website behavior.*
