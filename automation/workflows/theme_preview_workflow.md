# Theme Preview Workflow

Purpose: Preview or switch a theme preset for **WE ARE WITH YOU** without breaking the base design tokens the whole site relies on.

## When to use
- Trying out a different color/typography preset.
- Switching the active theme preset.
- Reviewing whether a preset holds up on mobile and for accessibility.

## Preconditions / read first
- `reference/THEME_SYSTEM_GUIDE.md` (how presets, `theme.css`, and base tokens relate).
- `checklists/mobile_design_checklist.md` and `checklists/accessibility_checklist.md`.
- `skills/frontend_design_review.md`.

## The layering model
- **Base tokens/components:** `css/style.css` — the foundational design system. Treat as read-only for theming.
- **Theme layer:** `css/theme.css` — preset overrides applied on top of the base tokens.
- **Preset registry:** `js/content/theme-options.js` — the list of available presets and which one is active.
- Change the preset selection / preset values here; do NOT edit base tokens in `css/style.css` to force a look.
- Note: the live tree still uses `css/style.css` only; the theme split is the design-upgrade target.

## Steps (UNDERSTAND → LOCATE → EDIT → VERIFY → SHOW → STOP)
1. **UNDERSTAND.** Preview only, or actually switch the active preset? Which preset?
2. **LOCATE.** `js/content/theme-options.js` (presets + active selection) and `css/theme.css` (preset variable values).
3. **EDIT.** Change the active preset key, or adjust preset variables in `css/theme.css`. Do not delete or redefine base tokens in `css/style.css`.
4. **VERIFY.** See below.
5. **SHOW.** Describe the change and any before/after screenshots. Do not deploy.
6. **STOP.** Await approval.

## Verify
- `npm install jsdom --no-save && node test/smoke.test.js` → **80 passed, 0 failed** → `rm -rf node_modules` (optional).
- `node --check js/site.js`.
- Manual: load several pages (home, a partner page, media) at desktop and mobile widths.
- Accessibility: check text/background contrast meets `checklists/accessibility_checklist.md`; the audience includes older adults and people in hospital settings, so legibility is non-negotiable.

## Guardrails / do NOT
- Do NOT edit base tokens in `css/style.css` to achieve a theme change.
- Do NOT ship a preset that fails contrast or breaks the mobile layout.
- Do NOT change copy, images, or nav while theming.
- Do NOT commit/push/deploy unless explicitly asked.

## Done means
Preset previewed/switched via `theme-options.js` / `theme.css`, base tokens intact, mobile + accessibility checks pass, tests 80/0, change shown, nothing deployed.

## Related
- Reference: `reference/THEME_SYSTEM_GUIDE.md`
- Checklist: `checklists/mobile_design_checklist.md`, `checklists/accessibility_checklist.md`
- Skill: `skills/frontend_design_review.md`
