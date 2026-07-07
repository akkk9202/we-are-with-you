# Mobile Design Checklist

Purpose: Confirm the site looks and works well on small screens.
When to run: After any layout/theme/CSS change, or a responsive review (no content change intended).

## Layout at small widths
- [ ] Test at ~320px, ~375px, and ~768px.
- [ ] No horizontal scroll / overflow anywhere.
- [ ] Content reflows into a single column cleanly; nothing clipped.

## Interactive elements
- [ ] Tap targets are large enough and not too close together.
- [ ] Nav menu / dropdown opens and closes correctly on touch.
- [ ] Carousel is swipeable/usable and does not trap scroll.

## Media and theme
- [ ] Images scale to container (no fixed widths overflowing).
- [ ] Theme from `css/theme.css` (and `js/content/theme-options.js` preset) renders correctly on mobile.
- [ ] Base tokens from `css/style.css` hold up at small sizes.

## Verify
- [ ] Text remains readable without zoom.
- [ ] No content was changed if this was review-only.
- [ ] `node test/smoke.test.js` → "80 passed, 0 failed".
