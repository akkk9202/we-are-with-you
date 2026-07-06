# EDITING GUIDE — WE ARE WITH YOU

Everything you'll need to change regularly lives in **two files**:

| File | What it controls |
|---|---|
| `js/config.js` | Email, Instagram, YouTube, location, all 6 Google Form links, the nav menu, footer text |
| `js/partners.js` | All content on all partner pages (Cancer Care, RMH, NICU, Senior Living, Schools, Disability) |

If you only ever open those two files, you can run 90% of the site.

---

## 1. Change contact info & social links
Open `js/config.js`. Replace:
```js
email: "REPLACE_ME@example.com",
instagram: "",   // paste full URL, or leave "" to hide everywhere
youtube: "",     // paste full URL, or leave "" to hide everywhere
```
Instagram/YouTube buttons and footer links **appear automatically** once a URL is filled in, and stay hidden while empty. No dead links.

## 2. Connect the Google Forms
Create each form in Google Forms, click **Send → link icon → copy**, then paste into `js/config.js`:
```js
forms: {
  studentApplication: "https://forms.gle/xxxx",
  ...
}
```
Every button on the site tagged `data-form="..."` picks up the link automatically. Until a real link is pasted, those buttons safely route to the Contact page instead of going nowhere.

The six forms the site expects (field lists are in your planning doc): Student Application, Partner Inquiry, Song Request, Letter Submission, Hope Capsule, Teaching Video Request.

## 3. Edit a partner page (or add a new one)
Open `js/partners.js`. Each partner is one block:
```js
"cancer-care": {
  name: "...", heroTitle: "...", heroText: "...",
  about: "...",
  cards: [ { title, text, button, form OR href }, ... ],
  closing: ["line 1", "line 2", "line 3"],
},
```
- **Edit text**: change it in the block. Done.
- **Add a partner**: copy a whole block, give it a new slug (e.g. `"city-of-hope"`), then add one line to the Programs dropdown in `js/config.js`. The page instantly exists at `partner.html?p=city-of-hope`.
- A card button either opens a form (`form: "songRequest"`) or a page (`href: "media.html"`).

## 4. Change nav menu items
`js/config.js` → the `nav:` array. Reorder, rename, add, or remove entries. Nav and footer update on every page at once.

## 5. Change text on main pages
Main page copy lives in the HTML files themselves — each section is labeled with an HTML comment (`<!-- 5 · CIRCLE OF LOVE -->` etc.):
- `index.html` — homepage
- `programs.html`, `student-community.html`, `learning.html`, `media.html`, `join.html`, `about.html`, `contact.html`

## 6. Add photos
1. Create an `images/` folder and put photos in it.
2. Replace a placeholder like `<div class="frame">♩</div>` with `<div class="frame"><img src="images/photo.jpg" alt="describe the photo" /></div>`.
3. In Media galleries, replace `<div class="media-item">♪</div>` with `<figure class="media-item"><img src="images/photo.jpg" alt="..." /></figure>`.
Use JPGs under ~400KB so pages stay fast.

## 7. Add videos
Paste a YouTube embed where you want it:
```html
<div style="aspect-ratio:16/9;border-radius:8px;overflow:hidden;">
  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/VIDEO_ID"
    title="Video title" frameborder="0" allowfullscreen></iframe>
</div>
```

## 8. Change colors & fonts
Top of `css/style.css` — the `:root { }` token block. Change a hex value once (e.g. `--gold`) and it updates sitewide. Fonts are the two `--display` / `--body` variables plus the Google Fonts `@import` on line 8.

## 9. QR codes
Point each QR at a **specific** URL so people land in one tap:
- Partner page: `https://akkk9202.github.io/we-are-with-you/partner.html?p=cancer-care`
- A form: use the Google Form link directly
- Homepage: `https://akkk9202.github.io/we-are-with-you/`
Old printed QR codes that point to retired pages (gyco.html, voices-of-love.html, etc.) still work — those URLs now redirect to the right new page.

## 10. Run locally
```bash
cd we-are-with-you
python3 -m http.server 8000
# open http://localhost:8000
```
(Or use the "Live Server" extension in VS Code.)

## 11. Publish changes
```bash
git add -A
git commit -m "describe what you changed"
git push origin main
```
GitHub Pages redeploys automatically in ~1 minute. Work on a branch first for big changes:
```bash
git checkout -b my-change   # do work, commit
git push -u origin my-change  # then open a Pull Request on GitHub and merge
```

## File map
```
index.html                Home
programs.html             Programs overview + NOS
partner.html              Template — renders from js/partners.js (?p=slug)
student-community.html    GYCO
learning.html             NADO School
media.html                Galleries
join.html                 Four join paths
about.html                Ecosystem (WAWY / GYCO / NADO / NOS)
contact.html              Contact info + form links
404.html                  Not-found page
css/style.css             All styling (tokens at top)
js/config.js              ← EDIT: links, email, forms, nav
js/partners.js            ← EDIT: partner page content
js/site.js                Machinery (nav/footer/render) — rarely touch
*.html redirect stubs     Old URLs → new pages (keep for old QR codes)
```
