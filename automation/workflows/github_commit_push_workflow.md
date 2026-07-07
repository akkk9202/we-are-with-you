# GitHub Commit & Push Workflow

Purpose: Commit and push discipline for **WE ARE WITH YOU**. Both committing AND pushing are opt-in — only when explicitly asked, in the moment.

## When to use
- The user explicitly says to commit and/or push.
- You need to record a reviewed, tested change into git history.

## Preconditions / read first
- `directives/github_workflow.md` — the authoritative git rules.
- `templates/commit-message.md` (message style) and `templates/changelog_template.md`.
- The change must already have passed `automation/workflows/predeploy_security_workflow.md` (tests 80/0).

## The opt-in rule (non-negotiable)
- **Never `git commit`, `git push`, open a PR, or merge unless the user explicitly asks in the current request.** "Make the edit" is NOT permission to commit. "Commit it" is NOT permission to push. Confirm each step.

## Steps
1. **Confirm scope.** Re-read exactly what was asked: commit only? commit + push? PR? Do only that.
2. **Branch check.** Determine the current branch (this repo works on `design-upgrade`; `main` is the PR base). Do not commit directly to `main`; if on `main` and work is needed, branch first. Match the branch the user intends.
3. **Show the diff first.** `git status` + `git diff` (staged/unstaged). Present it and get a go-ahead before committing.
4. **Stage precisely.** Stage only the files that belong to this change. Never `git add -A` blindly (node_modules is gitignored; don't add stray files).
5. **Commit message.** Use `templates/commit-message.md` style: concise subject, why in the body. End the commit body with the required co-author trailer per `directives/github_workflow.md`.
6. **Push only if explicitly asked.** If asked, push to the intended branch. Otherwise stop after the local commit.
7. **PR / merge only if explicitly asked**, using `directives/github_workflow.md`. Never merge on your own initiative.
8. **Changelog (optional).** If the project tracks one, add an entry via `templates/changelog_template.md`.

## Verify
- `git log -1` shows the intended commit with the correct message + trailer.
- `git status` clean of unintended files.
- If pushed: confirm the remote branch updated and CI/Pages (if any) is as expected.

## Guardrails / do NOT
- Do NOT push/PR/merge without an explicit, in-the-moment request.
- Do NOT commit secrets, `node_modules`, or unrelated files.
- Do NOT rewrite shared history (`--force`) on `main`/`design-upgrade`.
- Do NOT commit a change that hasn't passed the security + smoke-test gate.

## Done means
Only what was requested happened (commit, or commit+push), diff was shown first, message follows the template with the co-author trailer, no stray/secret files, history intact.

## Related
- Directive: `directives/github_workflow.md`
- Template: `templates/commit-message.md`, `templates/changelog_template.md`
- Gate: `automation/workflows/predeploy_security_workflow.md`
