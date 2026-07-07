# Image / Video Upload Checklist

Purpose: Add or replace an image or video safely without breaking layout or data references.
When to run: Whenever adding, replacing, or removing an image/video asset.

## File placement
- [ ] Photos live under `assets/images`; partner/brand logos under `assets/logos`.
- [ ] Filename is lowercase, hyphenated, and descriptive; no spaces.
- [ ] The filename matches the expected `src` used in the data file.

## Register the asset
- [ ] Image/video is referenced in `js/content/media-assets.js` (not hard-coded ad hoc).
- [ ] If it is a homepage image or partner logo, confirm the correct key/entry points to it.

## Quality and performance
- [ ] Reasonable file size (compressed; avoid multi-MB images on a static Pages site).
- [ ] Sensible dimensions and aspect ratio for where it appears.
- [ ] Format is web-friendly (jpg/png/webp for images).

## Accessibility and content
- [ ] Meaningful `alt` text provided (describe the content, not "image").
- [ ] Tone appropriate for the audience (patients, families) — no distressing imagery.
- [ ] Permission exists to use the image (especially people/partners).

## Verify
- [ ] Layout not broken at desktop and mobile widths.
- [ ] Old/replaced asset removed if no longer referenced.
- [ ] `node test/smoke.test.js` → "80 passed, 0 failed".
