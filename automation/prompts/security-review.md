# Prompt — Security review pass

Pair with `../../directives/security_check_before_deploy.md` and `../../skills/security_review.md`.
Run whenever links, scripts, headers, or `js/site.js` changed.

> Review the pending diff for this static site. There is no backend, no auth, no server-side code —
> the risks are client-side. Check:
> - Any new external link: is it https, expected, and routed through the config's `safeUrl()` helper
>   rather than injected raw?
> - Any user-influenced value rendered into the DOM without escaping (XSS surface)?
> - Any inline script, new third-party origin, or changed Content-Security surface?
> - Did any redirect stub target, partner slug, or form fallback get weakened?
> - Any secret, token, or real personal contact detail accidentally committed?
>
> Report findings most-severe first. If clean, say so explicitly. Do not deploy on any unresolved
> finding.
