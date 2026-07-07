# RISKY_FILES_DO_NOT_TOUCH.md

**Purpose:** A reference of the things you must **not** change (and why), each paired with the safe alternative that gets the job done.

> This site serves hospital patients and grieving families and depends on **printed QR codes** and **old shared links** that cannot be re-issued. A few files and values are load-bearing: breaking them silently 404s real people at a hard moment. Read before editing.

---

## Do-not-touch table

| ❌ Do NOT touch | Why it's load-bearing | ✅ Safe alternative |
|---|---|---|
| **Partner slugs** (object keys in `js/partners.js`: `cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`, `disability`, `schools-global`) | Slugs are the `?p=SLUG` addresses printed on physical QR codes and embedded in old URLs. Renaming a key 404s every printed card and old link. | To change the public label, edit the **`name`** field. To reorder, edit **`order`**. Never rename the key. |
| **Redirect stubs** (`voices-of-love.html`, `taps-of-love.html`, `gyco.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`, `about-gyco.html`) | These forward retired / printed-QR URLs to current pages and anchors. Deleting one breaks every place that URL was printed or shared. | Leave them in place. If a destination page moves, update the stub's **target** to the new location — don't delete the stub. See QR_AND_SLUG_PROTECTION_GUIDE.md for the full stub→destination list. |
| **The internal targets/anchors inside redirect stubs** (e.g. `partner.html?p=cancer-care`) | The stub only works if it points at a live destination. Changing the target to a page/anchor that no longer exists breaks the forward. | Only change a stub's target when the destination genuinely moved, and point it at the new, verified live URL/anchor. |
| **Nav hrefs targeted by redirects** (`SITE.nav` entries whose destinations stubs forward to) | A redirect stub forwards to a nav destination; changing that href orphans the redirect. | Change nav **labels** and **order** freely. Don't change an href that a stub forwards to unless you also update the stub. |
| **`js/site.js` engine internals** (nav/footer builder, card + carousel renderer, `?p=` slug lookup, `safeUrl()` helper) | The engine renders every page from the data files and sanitizes config-supplied URLs. A subtle change can break every page at once or open a security hole. | Do content work in the **data files** (`js/content/global.js` / current `js/config.js`, and `js/partners.js`). Only edit the engine when that is the explicit task — then re-run the full test gate **and** `directives/security_check_before_deploy.md`. |
| **`css/style.css` base tokens** (color / spacing / type custom properties, component styles) | A single token cascades across every page and component. Small edits produce large, hard-to-see regressions. | Change design only when it's the task. On the design-upgrade branch, prefer the **theme layer** (`css/theme.css` + `js/content/theme-options.js`) which overrides tokens without editing the base. See THEME_SYSTEM_GUIDE.md. |
| **`REPLACE_ME…` / `TODO` placeholders** (`SITE.email` = `REPLACE_ME@example.com`; form keys = `REPLACE_ME_GOOGLE_FORM_URL`; placeholder images) | These are **intentional safe fallbacks**: the email renders "Email coming soon," unfilled forms route to the contact page, and placeholder images render styled placeholders. Inventing fake values creates dead links and false info. | Only replace a placeholder with a **real, verified** value (a real inbox, a real Google Form URL, a real image). Otherwise leave it. |
| **Korean text and percent-encoded URLs** (the Newswave25 press link in `SITE.press[]`) | The encoded Korean URL only resolves in its exact encoded form; "tidying" or re-encoding it breaks the link. | Copy/paste the encoded URL **verbatim**. Never hand-edit the escape sequences or the Korean characters. |
| **`favicon.svg` / logo files as slugs** | — | Overwriting the image file at a referenced path is fine; renaming referenced paths is not. |
| **`test/smoke.test.js` (to make a failure "pass")** | The tests assert real rendered output; editing them to silence a failure hides a real regression. | Fix the underlying data/engine issue so the tests pass honestly. See TESTING_GUIDE.md. |

---

## Rule of thumb

If a change would alter a **URL, a slug, a nav destination, an engine helper, or a base design token**, stop and ask whether an existing printed/shared link depends on it. Almost every content task can be done by editing a **field in a data file** and leaving structure untouched.

*This is a documentation file. It changes no website behavior.*
