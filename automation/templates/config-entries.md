# Template — Common `js/config.js` entries

Match the real file's exact syntax; these are illustrative shapes.

## A form key (`SITE.forms`)

```js
forms: {
  studentApplication:  "https://docs.google.com/forms/…",
  partnerInquiry:      "https://docs.google.com/forms/…",
  songRequest:         "REPLACE_ME_GOOGLE_FORM_URL",   // safe fallback → routes to contact page
  // …add or update one key at a time; keys are referenced by data-form / partner cards
}
```

Valid keys: see `../reference/form-keys.md`. Don't invent URLs — use what the maintainer supplies.

## A carousel item (`SITE.home.carousel[]`)

```js
{ src: "assets/images/home-3.jpg", alt: "Descriptive alt text", caption: "Short caption." }
```

One image at a time; no autoplay.

## A featured-press item (`SITE.press[]`)

```js
{ title: "…", publisher: "…", description: "…",
  languages: ["English", "한국어"],
  image: "assets/images/press-1.jpg",
  links: [ { label: "Read", href: "https://…" } ] }
```

**Preserve Korean text and encoded URLs exactly** as supplied.

After any edit: run `../checklists/regression-gate.md`; if a link changed, also
`../checklists/before-deploy.md`.
