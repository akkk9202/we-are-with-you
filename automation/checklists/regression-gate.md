# Checklist — Regression gate

Run after any change to `js/`, `partners.js`, `config.js`, or page structure.

```bash
node --check js/site.js            # syntax check (if JS changed)
npm install jsdom --no-save        # transient; node_modules is gitignored, no package.json
node test/smoke.test.js            # expect: 80 passed, 0 failed
rm -rf node_modules                # optional cleanup
```

- [ ] `node --check js/site.js` passes (if JS changed).
- [ ] `node test/smoke.test.js` prints **`80 passed, 0 failed`** (or the updated count if tests were
      added). Anything else is a failure — do not proceed.
- [ ] Affected page(s) eyeballed — open the HTML directly or `python3 -m http.server`.
- [ ] If links, scripts, or headers changed → also run `before-deploy.md`.

Do **not** install packages beyond the transient `jsdom` above, and do not commit `node_modules`.
