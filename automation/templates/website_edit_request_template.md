# Website Edit Request Template

> **Purpose:** Capture a single website edit request *before* anyone touches the code, so the change is scoped, tone-checked, and verifiable. Feeds the `website_section_edit_workflow`.

## How to use this template

1. Copy this file and rename it, e.g. `edit-requests/2026-07-07-programs-intro.md`.
2. Fill in every `______` blank. Delete guidance comments (`<!-- ... -->`) as you go.
3. Do **not** start editing until the "Approval" section is settled.
4. When done, hand the completed request to the editing workflow and record the result in a `changelog_template.md` entry.

---

## 1. What is changing

- **Page (visible name):** ______  <!-- e.g. Programs, Partner, Learning, Media, Home -->
- **Section / component:** ______  <!-- e.g. hero heading, card #2, footer contact line -->
- **Requested by:** ______
- **Date requested:** ______

## 2. Owning file (edit the DATA file, not the HTML)

<!-- Almost all content lives in data files. Pick the ONE file that owns this text. -->

- [ ] `js/content/pages/______.js`  <!-- page body content -->
- [ ] `js/content/global.js`         <!-- SITE object: contact, forms, nav, homepage images, press -->
- [ ] `js/partners.js`               <!-- PARTNERS object: a partner/pathway page -->
- [ ] `js/content/media-assets.js`   <!-- image/video references -->
- [ ] `js/content/theme-options.js` / `css/theme.css`  <!-- theme presets -->
- [ ] Other: ______

**Exact object / key path:** ______  <!-- e.g. PARTNERS["nicu"].heroText, SITE.press[2].title -->

## 3. Exact text change (old → new)

> Quote the text *exactly*. Preserve any Korean text and percent-encoded URLs character-for-character.

**OLD:**
```
______
```

**NEW:**
```
______
```

<!-- If this is a new addition (no old text), write "NEW ADDITION" above OLD. -->

## 4. Why

- **Reason for change:** ______
- **Source / who confirmed the new wording is correct:** ______

## 5. Tone check (audience includes patients and grieving families)

- [ ] Warm, humble, human — no hype, no overpromising
- [ ] No medical, outcome, or "we will fix this" claims
- [ ] Consistent with tagline: *"Even Here. Even Now. We Are With You."*
- [ ] Reviewed against `context/brand_voice.md`
- **Tone notes:** ______

## 6. Invariant safety check

- [ ] No partner **slug** renamed (slugs are printed on QR codes — change the `name` field instead)
- [ ] No redirect stub deleted (`voices-of-love.html`, `taps-of-love.html`, `gyco.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`, `about-gyco.html`)
- [ ] Any `data-form="..."` value matches a real `SITE.forms` key (or is a safe `REPLACE_ME`)
- [ ] No `REPLACE_ME` / `TODO` replaced with an invented real value

## 7. Approval

- **Approval needed before editing?** ______ (yes / no)
- **Approver:** ______
- **Approved on:** ______

## 8. Verification plan

- [ ] `npm install jsdom --no-save`
- [ ] `node test/smoke.test.js` → expect **80 passed, 0 failed**
- [ ] `node --check js/site.js`
- [ ] `rm -rf node_modules`
- [ ] Open the affected page locally (`python3 -m http.server`) and eyeball the change
- [ ] Show the diff to the approver
- **Result / notes:** ______
