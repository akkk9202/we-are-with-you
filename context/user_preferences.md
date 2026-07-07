# User preferences — how to work in this repo

These are standing preferences the maintainer has expressed. Follow them unless a specific request
overrides them.

## Change discipline

- **Keep changes minimal.** Do exactly what was asked — no opportunistic refactors, renames, or
  "while I'm here" cleanups.
- **Don't touch** design, layout, copy, images, or navigation unless that is the explicit task.
- **Don't delete** files or content unless explicitly asked.
- Prefer editing the **content data files** (`js/config.js`, `js/partners.js`) over hand-editing HTML.

## Review & transparency

- **Report before changing** when asked to audit or review: list findings with severity, `file:line`,
  why it matters, the exact fix, and whether it's safe to apply now. No edits until asked.
- **After editing, show the changed files and the exact diff** (`git diff`).
- **Run available tests/checks** after changes and report the real result. If a check can't run
  (e.g., missing `jsdom`), install it transiently, run it, then clean up — and say so.

## Git & deploy

- **Never `git push`, open a PR, or merge unless explicitly asked.** Local commits only when asked.
- Follow `directives/github_workflow.md` for branching and commit messages.
- Run `directives/security_check_before_deploy.md` before any deploy.

## Honesty

- If referenced files, tools, or facts don't exist, **say so plainly** — don't silently substitute
  assumptions and present them as the user's rules.
- Report outcomes faithfully: failing tests, skipped steps, and uncertainty stated openly. Don't
  claim something is verified unless it was actually exercised.

## Tone of the work itself

- Be concise and direct. Give a recommendation, not an exhaustive menu.
- Flag latent risks (e.g., the CSP still being deferred) without acting on them unless asked.
