# Template — New partner entry (`js/partners.js`)

Copy an existing block in `js/partners.js` and adapt it. Shape (match the real file's exact syntax
and field names — this is illustrative):

```js
"new-slug-here": {            // load-bearing key — never rename once it ships
  order: 7,                   // unique; lower = earlier in nav/cards/footer
  name: "Public Pathway Name",
  logo: "assets/logos/new-partner.png",   // missing file → monogram fallback
  logoAlt: "Partner name logo",
  cardText: "One or two sentences for the pathway card.",
  heroTitle: "Heading at the top of the partner page",
  heroText: "Supporting subtext under the hero.",
  about: "Intro paragraph.",
  cards: [
    { title: "Card title", text: "What this action is.",
      button: "Button label", form: "songRequest" },   // form must match a SITE.forms key…
    { title: "Second card", text: "…",
      button: "Learn more", href: "learning.html" }     // …or use href for an internal link
  ],
  closing: ["Short closing line.", "Another line."]
}
```

Rules:
- **New slug**, never a rename. Check `../reference/slugs.md` so you don't collide.
- Each card uses **either** `form:"<key>"` (valid keys in `../reference/form-keys.md`) **or** `href`.
- Don't invent a Google Form URL — reuse a safe existing key or leave a placeholder.
- After adding: run `../checklists/regression-gate.md`.
