# Checklist — Before committing

**Commit only when the maintainer explicitly asks.** Never push or open/merge a PR unless asked in
the moment (`../../directives/github_workflow.md`).

- [ ] Maintainer explicitly asked to commit.
- [ ] Regression gate is green (`regression-gate.md`).
- [ ] Security check done if links/scripts/headers/`site.js` changed (`before-deploy.md`).
- [ ] `git status` and `git diff` reviewed — only the intended files changed.
- [ ] No secrets, tokens, or real personal contact details in the diff.
- [ ] `node_modules/` not staged (it's gitignored — keep it that way).
- [ ] Commit message follows `../templates/commit-message.md`.
- [ ] After committing: **stop.** Do not push unless separately, explicitly asked.
