# Media Article Publish Workflow

Purpose: Add or feature a press/media article on `media.html` by editing the press data — preserving bilingual (English/Korean) text and encoded URLs.

## When to use
- A new article about GYCO / WE ARE WITH YOU was published and should appear on the media page.
- Reordering or featuring an existing press item.

## Preconditions / read first
- `templates/media_article_template.md` (the field shape for a press entry).
- `automation/reference/file-map.md` (media page ownership).
- `context/brand_voice.md` (how we describe ourselves in press blurbs).

## Where the data lives
- Press/media entries live in `js/content/global.js` on the `SITE` object (the press list). `media.html` is rendered from it by `js/site.js`.
- The Newswave25 links are **percent-encoded** and some titles/summaries contain **Korean text** — copy them **exactly**, byte-for-byte. Do not "clean up," re-encode, or translate them.

## Steps (UNDERSTAND → LOCATE → EDIT → VERIFY → SHOW → STOP)
1. **UNDERSTAND.** Gather: article title (EN and, if present, KO), outlet/source name, publish date, and the exact URL.
2. **LOCATE.** Open `js/content/global.js` and find the press array on `SITE`.
3. **EDIT.** Add a new entry using the existing entries as the template (match field names exactly): title, source, date, url, and any summary. Paste the URL verbatim (keep `%..` encoding). Keep bilingual fields intact — if the source is bilingual, include both.
   - To feature/reorder, move the object within the array; do not duplicate it.
4. **VERIFY.** See below.
5. **SHOW.** Show the new/moved entry and confirm the URL matches the source exactly. Do not deploy.
6. **STOP.** Await approval.

## Verify
- `npm install jsdom --no-save && node test/smoke.test.js` → **80 passed, 0 failed** → `rm -rf node_modules` (optional).
- `node --check js/site.js`.
- Manual: open `media.html`; confirm the article appears, the title (incl. Korean) renders correctly (no mojibake), and the link opens the real article.

## Guardrails / do NOT
- Do NOT alter Korean characters or percent-encoding in existing links.
- Do NOT paraphrase the outlet's name or invent a date/URL — use `REPLACE_ME`/`TODO` only if a real value is genuinely unknown (it will fall back safely).
- Keep press blurbs factual and calm; audience includes patients and grieving families.
- Do NOT commit/push/deploy unless explicitly asked.

## Done means
Press entry added/featured in `SITE`, encoded/Korean content preserved, renders on `media.html`, tests 80/0, diff shown, nothing deployed.

## Related
- Template: `templates/media_article_template.md`
- Reference: `automation/reference/file-map.md`
