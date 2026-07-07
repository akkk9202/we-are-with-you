# Changelog Entry Template

> **Purpose:** A single, reusable changelog entry for one website change. Copy one block per change; roll these up into the monthly maintenance log.

## How to use this template

1. Copy the entry block below for each change.
2. Name the **real content files** you touched (e.g. `js/content/pages/programs.js`, `js/content/global.js`, `js/partners.js`), not vague areas.
3. Record the actual test result (expect **80 passed, 0 failed**).
4. Only mark deployed if a push was **explicitly authorized**.

---

## Entry

### ______ — <short title of the change>

- **Date:** ______  (YYYY-MM-DD)
- **Branch:** ______
- **Files touched:**
  - `______`
  - `______`
- **Summary:** ______  <!-- what changed, in one or two sentences -->
- **Why:** ______  <!-- reason / source / who requested it -->
- **Tests run:**
  - `node test/smoke.test.js` → **___ passed, ___ failed** (expect 80 / 0)
  - `node --check js/site.js` → ______ (ok / error)
- **Tone reviewed?** ______ (yes / no / n/a)
- **Reviewer / approver:** ______
- **Deploy status:** ______  <!-- not deployed / pushed on ___ (authorized by ___) -->
- **Notes:** ______

---

<!-- Copy the "Entry" block above for each additional change. -->
