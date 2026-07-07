# THEME_SYSTEM_GUIDE.md

**Purpose:** A reference for how theming works — theme presets layered over the base design tokens — and what you can safely change without breaking the base system.

> **⚠️ Current vs. target:** The theme layer (`js/content/theme-options.js` + `css/theme.css`) is **part of the `design-upgrade` branch target** and is **not present in the live working tree yet**. Today, all styling lives in the base design system, **`css/style.css`**. This guide describes the target theming model and notes where the current tree differs.

---

## 1. The layering model

Theming is designed as **two layers stacked on one base**, so presets can restyle the site without anyone touching the foundational tokens.

| Layer | File | Owns | Safety |
|---|---|---|---|
| **Base design system** | `css/style.css` | The canonical tokens (color / spacing / typography custom properties), component styles, Google Fonts import | 🔴 Rarely edit — a token change cascades site-wide |
| **Theme layer (CSS)** | `css/theme.css` *(target; not present yet)* | **Overrides** of base tokens for the active preset — nothing structural | 🟡 Edit here to reskin |
| **Theme presets (data)** | `js/content/theme-options.js` *(target; not present yet)* | The selectable list of presets (palettes / type choices) the site can switch between | 🟡 Edit here to add/tune a preset |

**Principle:** `css/theme.css` and the presets **layer on top of** `css/style.css` by overriding CSS custom properties — they should never redefine layout, components, or the token *names*. Change values, not the structure.

```
css/style.css  (base tokens + components)   ← foundation, rarely touched
      ▲
css/theme.css  (overrides token VALUES)     ← the active theme's look
      ▲
js/content/theme-options.js (preset list)   ← which looks are selectable
```

---

## 2. How to preview / switch a preset (target model)

1. Open `js/content/theme-options.js` and find the preset definitions.
2. Switch the active/default preset (or add a new one by copying an existing block and changing its palette/type values).
3. The corresponding token overrides live in `css/theme.css` — adjust the **values** of existing custom properties for that preset.
4. Preview by opening the pages directly or serving statically (`python3 -m http.server`) — there is no build step.
5. Run the test gate afterward (see TESTING_GUIDE.md); rendered output must still pass.

> On the **current tree**, there is no preset switcher — to change the look you'd edit token values in `css/style.css` directly, which is higher-risk. Prefer waiting for / using the theme layer on the design-upgrade branch.

---

## 3. What NOT to change

| ❌ Don't | Why | ✅ Instead |
|---|---|---|
| Rename or delete base token **names** in `css/style.css` (e.g. a `--color-*` / `--space-*` custom property) | Every component and the theme layer reference those names; renaming breaks the cascade everywhere | Change the token **value**, or override it in `css/theme.css` |
| Put layout/component rules in `css/theme.css` | The theme layer is for token overrides only; structural CSS belongs in the base | Add structural styles (carefully) to `css/style.css` only if that's the task |
| Hardcode colors/sizes into pages or partial HTML | Bypasses the token system; won't respond to theme switches | Use the existing tokens/classes |
| Change the Google Fonts import casually | Fonts are wired into type tokens; a bad import breaks typography site-wide | Only touch it as an explicit, tested design task |
| Edit base tokens to achieve a one-off look | Cascades to every page | Scope the change to a preset in the theme layer |

---

## 4. Safety checklist for any theme change

- [ ] I changed **values**, not token **names**.
- [ ] No layout/component structure moved into `css/theme.css`.
- [ ] The base `css/style.css` tokens are intact.
- [ ] Pages still render and the smoke tests pass (TESTING_GUIDE.md).
- [ ] Design change was the explicit task (per CLAUDE.md non-negotiables), diff shown, tests run.

*This is a documentation file. It changes no website behavior.*
