# Design Review Prompts

> Prompts for frontend/design review of the **WE ARE WITH YOU** site. References `skills/frontend_design_review.md` and the theme system. **Review and recommend without changing content** — copy, images, and navigation are out of scope unless the task explicitly says otherwise.

**Design surfaces**
- Theme presets → `js/content/theme-options.js` + `css/theme.css`
- Base design tokens / components → `css/style.css`
- Rendered layout comes from `js/site.js` reading the content data files.

**Constraints for any design work**
- Do not change page copy, partner content, images, or nav structure during a design review.
- Don't rename slugs; don't delete redirect stubs.
- If you propose CSS changes, keep diffs minimal and run smoke tests (expect 80/0) — DOM output must stay intact.
- Audience includes patients and grieving families: prioritize calm, legible, accessible design over flashiness.

---

## 1. Full frontend/design review (read-only)

```
Do a frontend design review of this static site following skills/frontend_design_review.md.
Cover: responsive behavior, mobile layout, visual hierarchy, spacing/rhythm, color contrast and
accessibility (WCAG AA), typography, and consistency across pages.

Reference the theme system: js/content/theme-options.js, css/theme.css, and base tokens in
css/style.css. This is read-only — report findings prioritized (High/Med/Low) with specific
selectors/files. Do NOT change any content, images, or nav.
```

## 2. Mobile / responsive audit

```
Audit the site for mobile and responsive issues (360px, 768px, 1024px widths). Look for overflow,
tap-target size, unreadable text scaling, cramped spacing, and broken grids.

Point to the exact css/style.css / css/theme.css rules involved. Propose minimal fixes as a diff
but DO NOT apply until I approve. No content or nav changes. If applied later, keep smoke tests 80/0.
```

## 3. Accessibility (a11y) pass

```
Run an accessibility review: color contrast against css/theme.css tokens, focus states, heading
order, alt text presence (from js/content/media-assets.js), link text clarity, and keyboard nav.

Report each issue with WCAG reference and file:line. Recommend the smallest fix. Read-only; propose,
don't apply. Remember the audience includes patients/grieving families — legibility and calm matter
more than decoration.
```

## 4. Visual hierarchy & consistency

```
Review visual hierarchy and cross-page consistency: heading scales, button styles, card spacing,
and how the theme tokens in css/theme.css / js/content/theme-options.js are applied by css/style.css.

Flag inconsistencies (e.g. one-off spacing, hardcoded colors that bypass tokens). Recommend
consolidating to tokens. Read-only report with selectors. Do not touch content.
```

## 5. Theme change (guarded, when approved)

```
Task: adjust the theme <describe: e.g. increase base font size, soften accent color>.

- Change values in css/theme.css / js/content/theme-options.js (and css/style.css tokens if needed)
  ONLY. Do not change any content, image, partner, or nav.
- Keep the change token-driven; avoid one-off hardcoded values.
- Verify rendered DOM is unchanged: node --check js/site.js and
  node test/smoke.test.js (expect 80/0).
Show the diff and before/after description. No commit.
```

## 6. Design QA in the browser (optional)

```
Open the site locally (python3 -m http.server) and walk the key pages (index, learning,
student-community, media, partner pages). Report visual issues with screenshots/notes per page and
viewport. Read-only — findings only, no code changes.
```

---

## Good vs. vague

| Vague | Good |
|---|---|
| "Make it prettier." | "Run skills/frontend_design_review.md read-only; prioritize mobile spacing + contrast findings with selectors." |
| "Fix the colors." | "Check text/background contrast against css/theme.css tokens for WCAG AA; list failures, propose token tweaks." |

**Design reviews report; they don't rewrite content.** Keep copy, images, and nav untouched unless the task is explicitly a theme change.
