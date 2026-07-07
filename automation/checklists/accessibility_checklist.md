# Accessibility Checklist

Purpose: Keep the site usable for everyone, including keyboard and screen-reader users.
When to run: After UI, content, image, or theme changes.

## Images and media
- [ ] Every image has meaningful `alt` text (in `js/content/media-assets.js` or the page data).
- [ ] Decorative-only images use empty alt (`alt=""`).

## Structure
- [ ] Headings follow a logical order (one h1 per page; no skipped levels).
- [ ] Lists, buttons, and links use semantic elements.

## Color and contrast
- [ ] Text meets contrast against its background in both `css/theme.css` and `css/style.css` tokens.
- [ ] Information is not conveyed by color alone.

## Keyboard and focus
- [ ] Nav and dropdown are operable by keyboard.
- [ ] Carousel controls are reachable and operable by keyboard.
- [ ] Visible focus states on links, buttons, and controls.

## Links and forms
- [ ] Link text is meaningful (no bare "click here").
- [ ] Form buttons are clearly labeled (what the form does).
- [ ] `data-form` buttons announce their purpose.

## Verify
- [ ] `node test/smoke.test.js` → "80 passed, 0 failed".
