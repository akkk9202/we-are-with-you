# Website Edit Prompts

> Ready-to-paste prompts for concrete content edits on the **WE ARE WITH YOU** site. Almost everything editable lives in data files, not HTML.

**Where content lives**
- Page copy → `js/content/pages/` (one file per page)
- Global settings, contact, form URLs (the `SITE` object) → `js/content/global.js`
- Images / videos → `js/content/media-assets.js`
- Theme presets → `js/content/theme-options.js` + `css/theme.css`
- Partner/pathway content (the `PARTNERS` object) → `js/partners.js`
- Renderer (rarely edit) → `js/site.js`

**Always true**
- Minimal diff; run smoke tests (expect 80/0) after any `js/` change; never push/commit unless asked.
- Never rename a partner slug — change the visible `name`. Never delete a redirect stub.
- Forms use `data-form="<key>"` resolved via `SITE.forms`. Keys: `studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest`. Leave `REPLACE_ME`/`TODO` alone — they safely route to the contact page.
- Preserve Korean text and encoded URLs.

---

## 1. Change text on a page

```
In js/content/pages/<page>.js, change the <field/section> text.

FROM: "<exact old text>"
TO:   "<exact new text>"

Rules: edit only that value; keep surrounding keys, punctuation, and any Korean/encoded strings
intact. Minimal diff. Then run:
  npm install jsdom --no-save && node test/smoke.test.js   (expect 80 passed, 0 failed)
  rm -rf node_modules
Show me the diff. Don't commit.
```

## 2. Update a form link (SITE.forms)

```
Update the form URL for <formKey — one of studentApplication | partnerInquiry | songRequest |
letterSubmission | hopeCapsule | teachingVideoRequest> in js/content/global.js (SITE.forms).

New Google Form URL: <paste the real URL>

Rules:
- Only change that one key's value. Do NOT touch the data-form="<key>" attributes in content — the
  key is the stable contract.
- If I did not give you a real URL, leave REPLACE_ME/TODO as-is (it safely routes to contact). Do
  not invent a URL.
Run smoke tests (80/0), show the diff, no commit.
```

## 3. Swap an image or video

```
In js/content/media-assets.js, replace the asset used for <where it appears> with <new file>.

- Confirm the new file exists under assets/images or assets/logos (list it); if it doesn't, stop
  and tell me the exact path to add.
- Update only that asset entry; keep alt text meaningful (update it if the image's subject changed).
- Preserve any encoded characters in the path.
Run smoke tests (80/0), show the diff, no commit.
```

## 4. Edit a partner page (without renaming the slug)

```
Edit the <slug> partner in js/partners.js. Slug MUST stay "<slug>" (it's printed on QR codes).
Valid slugs: cancer-care, ronald-mcdonald-house, nicu, senior-living, disability, schools-global.

Change:
- name/display: "<old>" -> "<new>"      (this is the visible label; safe to change)
- <other field>: "<old>" -> "<new>"

Do not rename the slug key, remove the entry, or delete its redirect stub. Preserve Korean text.
Run smoke tests (80/0), show the diff, no commit.
```

## 5. Update contact info / global settings

```
In js/content/global.js (SITE object), update <contact email | social handle | org name | tagline>.

FROM: "<old>"  TO: "<new>"

Keep the tagline exactly "Even Here. Even Now. We Are With You." unless I explicitly ask to change
it. Minimal diff, smoke tests 80/0, show diff, no commit.
```

## 6. Add a card / list item to a page

```
Add a new <card/item> to js/content/pages/<page>.js in the <section> array.

New item fields:
  title: "<...>"
  body:  "<...>"
  link/data-form: "<key or url — leave REPLACE_ME if none>"

Follow the exact shape of the existing items in that array (same keys). Don't reorder existing
items. Smoke tests 80/0, show diff, no commit.
```

---

## Good vs. vague

| Vague | Good |
|---|---|
| "Change the about text." | "In js/content/pages/index.js change the mission paragraph FROM '<old>' TO '<new>'." |
| "Add the new form." | "Set SITE.forms.songRequest in js/content/global.js to <URL>; leave the data-form keys untouched." |
| "Rename NICU to Newborn Care." | "Change the `name` of the `nicu` partner to 'Newborn Care' in js/partners.js — keep the slug `nicu`." |

**Never** fabricate a form URL, image path, or email. If you don't have the real value, leave the safe fallback and ask.
