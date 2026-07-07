# Image / Video Update Workflow

Purpose: Swap, add, or remove an image or video on **WE ARE WITH YOU** without breaking layout, alt text, or the media registry.

## When to use
- Replacing a homepage carousel image, a partner logo, or a page photo.
- Adding a new image/video asset the site should reference.
- Fixing a broken or missing image.

## Preconditions / read first
- `automation/reference/file-map.md` and `reference/MEDIA_ASSET_GUIDE.md` (where assets live and how they are referenced).
- `automation/checklists/before-edit.md` and `checklists/image_upload_checklist.md`.
- Media registry: `js/content/media-assets.js` (paths + alt text). Homepage image lists also flow through `js/content/global.js` (SITE).

## Steps (UNDERSTAND → LOCATE → EDIT → VERIFY → SHOW → STOP)
1. **UNDERSTAND.** Which image/video, on which page/section, and is this a swap (same slot) or a new asset?
2. **LOCATE.**
   - The binary file lives under `assets/images/` (photos) or `assets/logos/` (partner logos).
   - The reference lives in `js/content/media-assets.js` (and/or the relevant page file / `SITE` homepage image list).
3. **EDIT.**
   - **Swap in place:** overwrite the file at the same path (keep the same filename/extension) so no reference changes, OR update the `src` path in `js/content/media-assets.js`.
   - **New asset:** add the file under the correct `assets/` folder, then register it in `js/content/media-assets.js` with a `src` and **required `alt` text**.
   - Alt text is mandatory and must be descriptive and calm in tone (patients/grieving families audience). Never leave alt empty.
   - Keep image dimensions/aspect close to the original to avoid layout shift; compress large files.
4. **VERIFY.** See below.
5. **SHOW.** Show the changed path(s) + new alt text + a note of file size. Do not deploy.
6. **STOP.** Await approval.

## Verify
- `npm install jsdom --no-save && node test/smoke.test.js` → **80 passed, 0 failed** → `rm -rf node_modules` (optional).
- `node --check js/site.js` and `node --check` on any edited `js/content/*.js`.
- Manual: load the page, confirm the image/video appears (not a broken icon), alt text present, no layout shift, looks right on mobile.

## Guardrails / do NOT
- Do NOT change a partner **logo filename** in a way that renames a slug-linked reference; update the `src` field instead.
- Do NOT commit large uncompressed originals.
- Do NOT ship without alt text.
- Do NOT touch other page content while swapping media.
- Do NOT commit/push/deploy unless explicitly asked.

## Done means
Asset present under `assets/`, registered with alt text in `js/content/media-assets.js`, renders correctly, tests pass 80/0, diff shown, nothing deployed.

## Related
- Checklist: `checklists/image_upload_checklist.md`, `automation/checklists/before-edit.md`
- Reference: `reference/MEDIA_ASSET_GUIDE.md`, `automation/reference/file-map.md`
