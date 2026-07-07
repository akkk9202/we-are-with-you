# Smoke Test Report Template

> **Purpose:** Record the result of a smoke-test run so any change has a documented, reproducible green (or red) signal.

## How to use this template

1. Copy this file, e.g. `test-reports/2026-07-07-smoke.md`.
2. Run the three commands below in order and paste the real output/counts.
3. Note that `jsdom` is installed **transiently** (not committed) and removed afterward.
4. Sign off only if results match expectations (**80 passed, 0 failed**).

---

## Run details

- **Date:** ______
- **Branch / commit:** ______
- **Run by:** ______
- **Environment:** macOS / Node ______ ; `jsdom` installed transiently via `npm install jsdom --no-save` (not committed; `node_modules/` is gitignored)

## Commands run

```bash
npm install jsdom --no-save      # transient dependency
node test/smoke.test.js          # expect "80 passed, 0 failed"
node --check js/site.js          # syntax check
rm -rf node_modules              # cleanup
```

## Results

- **`node test/smoke.test.js`:** ______ passed, ______ failed  <!-- expect 80 / 0 -->
- **`node --check js/site.js`:** ______ (ok / error)
- **Overall:** [ ] PASS  [ ] FAIL

## Failures / notes

<!-- List any failing test names and observations. Leave "none" if all green. -->

```
______
```

## Sign-off

- [ ] Results match expectations (80 passed, 0 failed; syntax ok)
- [ ] `node_modules/` removed after run
- **Signed off by:** ______  **On:** ______
