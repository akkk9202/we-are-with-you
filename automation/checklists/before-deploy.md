# Checklist — Before deploy (security)

Deploy = GitHub Pages serves whatever is on the deployment branch. This is the moment content goes
public. Run `../../directives/security_check_before_deploy.md` in full; this is the short gate.

- [ ] All new/changed external links are https and expected; config-supplied links go through the
      `safeUrl()` helper in `js/site.js`, not injected raw.
- [ ] No user-influenced value is written to the DOM unescaped (XSS surface).
- [ ] No new inline script or third-party origin slipped in unintentionally.
- [ ] Redirect stubs still forward correctly; no partner slug changed.
- [ ] Form fallbacks still route to the contact page when a key is a `REPLACE_ME…` placeholder.
- [ ] No secret, token, or private contact detail in the diff.
- [ ] Regression gate green (`regression-gate.md`).

Any unresolved finding → **do not deploy.** Deploy itself only happens when the maintainer asks.
