# EDITING GUIDE — WE ARE WITH YOU

Everything you'll need to change regularly lives in **two files**:

| File | What it controls |
|---|---|
| `js/config.js` | Email, Instagram, YouTube, location, all 6 Google Form links, the nav menu, footer text |
| `js/partners.js` | All pathway content: names, **order**, **logos**, card text, and every partner page (City of Hope Atlanta, RMH, Northside NICU, Senior Living, Milal, Schools & Global) |

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

## 3. Rename or reorder pathways
Open `js/partners.js`. Every partner block has:
```js
order: 1,                       // position everywhere (nav, cards, footer)
name: "City of Hope Atlanta (CTCA)",   // the visible name everywhere
```
Change `name` or `order` in ONE place — the nav dropdown, homepage cards, Programs page cards, footer links, and the partner page all update together. Slugs (`cancer-care`, `nicu`, `disability`) are intentionally unchanged so old links and printed QR codes keep working.

## 3a. Replace pathway logos
Each partner block has a `logo` + `logoAlt` field:
```js
logo: "assets/logos/city-of-hope-atlanta.png",
```
Drop a PNG into `assets/logos/` and point `logo` at it. Already in place: `city-of-hope-atlanta.png`, `ronald-mcdonald-house.png`, `northside-nicu.png`, `milal.png` (plus `gyco.png` and `nado-school.png` used on their pages). Still TODO: `senior-living.png` and `schools-global.png` — until those files exist, cards automatically show a clean monogram fallback (nothing breaks).

## 3b. Replace the homepage images
`js/config.js` → the `home:` block.
- **"Why we exist" image**: overwrite `assets/images/home-invitation.jpg` (keep the name and you're done), or change `home.invitation.src`. Update the `alt` text to describe the new image.
- **Carousel** (One platform. Many communities.): overwrite `assets/images/home-carousel-1.jpg`, `-2.jpg`, `-3.jpg`. To reorder, add, or remove slides, edit the `home.carousel` array — arrows, dots, keyboard, and swipe adjust automatically. No autoplay by design.

## 3c. Edit the featured press article (Media page)
`js/config.js` → the `press:` array — title, publisher, description, the English/Korean links, and the article image (`assets/images/press-newswave25.jpg`; a styled placeholder shows until the file exists). Add a second object to the array to feature another article.

## 4. Edit a partner page (or add a new one)
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
- **Add a partner**: copy a whole block, give it a new slug and an `order` number. The page instantly exists at `partner.html?p=your-slug`, and it appears in the nav dropdown, homepage cards, Programs page, and footer automatically — no other file to touch.
- A card button either opens a form (`form: "songRequest"`) or a page (`href: "media.html"`).

## 5. Change nav menu items
`js/config.js` → the `nav:` array. Reorder, rename, add, or remove entries — nav and footer update on every page at once. The **Programs** dropdown is special: it builds itself from `js/partners.js` (`dropdown: "partners"`), so pathway names/order only ever live in one file.

## 6. Change text on main pages
Main page copy lives in the HTML files themselves — each section is labeled with an HTML comment (`<!-- 5 · CIRCLE OF LOVE -->` etc.):
- `index.html` — homepage
- `programs.html`, `student-community.html`, `learning.html`, `media.html`, `join.html`, `about.html`, `contact.html`

## 7. Add photos
1. Put photos in `assets/images/` (logos go in `assets/logos/`).
2. In Media galleries, replace `<div class="media-item">♪</div>` with `<figure class="media-item"><img src="assets/images/photo.jpg" alt="..." /></figure>`.
Use JPGs under ~400KB so pages stay fast.

## 8. Add videos
Paste a YouTube embed where you want it:
```html
<div style="aspect-ratio:16/9;border-radius:8px;overflow:hidden;">
  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/VIDEO_ID"
    title="Video title" frameborder="0" allowfullscreen></iframe>
</div>
```

## 9. Change colors & fonts
Top of `css/style.css` — the `:root { }` token block. Change a hex value once (e.g. `--gold`) and it updates sitewide. Fonts are the two `--display` / `--body` variables plus the Google Fonts `@import` on line 8.

## 10. QR codes
Point each QR at a **specific** URL so people land in one tap:
- Partner page: `https://akkk9202.github.io/we-are-with-you/partner.html?p=cancer-care`
- A form: use the Google Form link directly
- Homepage: `https://akkk9202.github.io/we-are-with-you/`
Old printed QR codes that point to retired pages (gyco.html, voices-of-love.html, etc.) still work — those URLs now redirect to the right new page.

## 11. Run locally
```bash
cd we-are-with-you
python3 -m http.server 8000
# open http://localhost:8000
```
(Or use the "Live Server" extension in VS Code.)

## 12. Publish changes
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
student-community.html    GYCO — More Than Music
learning.html             NADO School — Become a School
media.html                Featured press + galleries
join.html                 Four join paths
about.html                Ecosystem (WAWY / GYCO / NADO / NOS)
contact.html              Contact info + form links
404.html                  Not-found page
css/style.css             All styling (tokens at top)
assets/images/            Homepage invitation + carousel, press photo
assets/logos/             Pathway + GYCO + NADO School logos
js/config.js              ← EDIT: links, email, forms, nav, homepage images, press
js/partners.js            ← EDIT: partner page content
js/site.js                Machinery (nav/footer/render) — rarely touch
*.html redirect stubs     Old URLs → new pages (keep for old QR codes)
```

## 13. Run the tests
80 automated checks cover the nav, pathway names/order, logos, the homepage carousel, the Circle of Love, all six partner pages, and the Media press card:
```bash
npm install jsdom   # once
node test/smoke.test.js
```
Run this after big edits — it catches broken slugs, missing labels, and wrong ordering before you push.
