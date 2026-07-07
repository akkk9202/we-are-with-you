# Media / Press Article Template

> **Purpose:** Scaffold one press/media article entry for the Media page. Press data lives in the `SITE` object in `js/content/global.js` (the press array).

## How to use this template

1. Copy this file, fill in every `______` blank.
2. Translate the filled fields into a new object appended to the press array in `js/content/global.js` (see the JS skeleton at the bottom).
3. **Preserve Korean text and percent-encoded URLs exactly** — do not "clean up" or re-encode them.
4. Confirm the image actually exists under `assets/images/` before referencing it.
5. Run the smoke tests (see `test_report_template.md`).

---

## Fields

- **Label / kicker:** ______  <!-- short tag shown above the title, e.g. "Feature", "Interview" -->
- **Title:** ______
- **Publisher:** ______  <!-- outlet or publication name -->
- **Description:** ______  <!-- 1–2 sentences, factual, no overpromising -->
- **Language(s):** ______  <!-- English / Korean / both — keep Korean characters intact -->

### Image

- **Image src:** `assets/images/______`  <!-- must be a real file in the repo -->
- **Image alt text:** ______  <!-- describe the image for screen readers; not a caption -->

### Links (one or more)

| Label | Href |
|-------|------|
| ______ | ______ |
| ______ | ______ |

<!-- Hrefs may be external URLs. If a link contains percent-encoding (%EC%..) copy it verbatim. -->

## Tone check

- [ ] Factual and modest — no exaggerated claims
- [ ] Reviewed against `context/brand_voice.md`
- [ ] Korean text and encoded URLs preserved character-for-character

## JS skeleton (paste into the press array in `js/content/global.js`)

```js
{
  label: "______",
  title: "______",
  publisher: "______",
  description: "______",
  image: "assets/images/______",
  imageAlt: "______",
  links: [
    { label: "______", href: "______" },
    // { label: "______", href: "______" },
  ],
}
```

<!-- Field names above are illustrative — match the exact key names already used by the
     existing entries in js/content/global.js. Do not invent values for missing data;
     leave REPLACE_ME / TODO so the site renders a safe fallback. -->
