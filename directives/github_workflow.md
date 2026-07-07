# Directive: GitHub workflow

## Golden rule

**Never `git push`, open a pull request, or merge unless the maintainer explicitly asks.** Making
local commits is also opt-in — ask or wait for a clear "commit this." Publishing is outward-facing and
approval for one step does not extend to the next.

## Branches

- Default branch: **`main`** (this is what GitHub Pages publishes).
- Do routine work on a feature branch (e.g., `design-upgrade`), not directly on `main`.
- If asked to make changes while on `main`, create a branch first unless told otherwise.

## Commits (only when asked)

- Keep commits small and scoped to one logical change.
- Write a clear, present-tense subject line describing *what and why*
  (e.g., `Harden config-supplied links + add referrer-policy meta`).
- End commit messages with the co-author trailer:

  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  ```

## Pull requests (only when asked)

- Use the `gh` CLI for GitHub operations.
- PR body: what changed, why, how it was tested (smoke tests result), and any deferred/accepted risks.
- End PR bodies with:

  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```

## Before anything leaves the machine

- Run the smoke tests and `node --check js/site.js`.
- Run `directives/security_check_before_deploy.md`.
- Show the maintainer the diff and get explicit approval to push.

## Never

- Force-push, rewrite shared history, or use interactive git flags (`-i`) in this environment.
- Commit `node_modules/` (gitignored) or any secret.
- Delete branches or files as a side effect of unrelated work.
