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
- **Always end a task with a way to test it locally** (added Aug 2026). Every completed change
  ships with concrete local-testing steps: which command to run (`npm run preview`,
  `python3 test/preview.py`, or double-clicking `Preview Portal.command` for the portal;
  `python3 -m http.server 8000` for the real site) and which URL/page to open to see the change.
  If the change isn't covered by an existing local path, build or extend one (preview fixtures,
  a harness, a sample page) as part of the task — don't hand over work that can only be
  verified in production.

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
