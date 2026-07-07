# Reference — File map (condensed)

Full version: `../../EDITING-MAP.md`. This is the quick lookup.

| I want to change… | Edit |
|---|---|
| Contact email / socials / location | `js/config.js` → `SITE` |
| A Google Form link | `js/config.js` → `SITE.forms.<key>` (`form-keys.md`) |
| Nav items / order / labels / CTA | `js/config.js` → `SITE.nav` |
| Homepage invitation image / carousel | `js/config.js` → `SITE.home` |
| Featured press | `js/config.js` → `SITE.press` (preserve Korean + encoded URLs) |
| Footer tagline note | `js/config.js` → `SITE.footerNote` |
| Tagline text | `js/config.js` → `SITE.tagline` |
| A partner's public name | `js/partners.js` → entry `name` (never the slug — `slugs.md`) |
| A partner's logo / cards / hero / closing | `js/partners.js` → entry fields |
| Add a partner | `js/partners.js` (`../workflows/add-partner.md`) |
| Rendering behavior / engine / `safeUrl()` | `js/site.js` — rare, high-risk |
| A photo / logo | Overwrite file in `assets/images/…` or `assets/logos/…` |
| Favicon | `favicon.svg` |
| Design system (color/spacing/type) | `css/style.css` — only if that IS the task |
| Page-specific static section | The relevant `*.html` (prefer data files first) |

**Content model:** almost everything lives in two data files (`js/config.js`, `js/partners.js`);
`js/site.js` renders it onto every page. Change the data once and the whole site updates.
