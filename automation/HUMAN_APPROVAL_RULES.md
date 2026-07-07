# HUMAN_APPROVAL_RULES.md

> **Purpose:** Draw the exact line between what an AI assistant may do on its own and what requires explicit, in-the-moment human approval when working on the **WE ARE WITH YOU** repo.

This site is public and serves hospital patients and grieving families. The default is **caution**: when unsure, ask. Nothing here overrides `CLAUDE.md` or the `directives/` — it operationalizes them.

---

## The two-column rule

| ✅ Autonomous — OK without asking | ⛔ Requires explicit human approval (in the moment) |
|-----------------------------------|------------------------------------------------------|
| Reading and searching any file | `git commit` |
| Explaining how the code/content model works | `git push` |
| **Proposing** a diff (showing, not applying) | Opening, merging, or closing a PR |
| Running the smoke tests locally (`node test/smoke.test.js`) | Deploying / publishing to GitHub Pages |
| Running `node --check js/site.js` | **Renaming a partner slug** (essentially forbidden — see below) |
| `npm install jsdom --no-save` for tests, then `rm -rf node_modules` | Deleting or altering any redirect stub |
| Drafting page copy, outreach emails, changelog entries | Editing nav `href`s that redirect stubs target |
| Running a link/accessibility/tone review and reporting findings | Inserting a real value into a `REPLACE_ME` / `TODO` |
| Filling in `automation/templates/*` as drafts | Touching design/layout/CSS tokens (`css/style.css`, `css/theme.css`) unless that is the task |
| Applying an **already-approved** edit that the maintainer asked for | Sending any outreach email or publishing anything external |
| | Changing `SITE.forms` values or `data-form` routing to real URLs |
| | Editing `js/site.js` (the renderer engine) |

**Rule of thumb:** *reading, analyzing, and proposing* are autonomous. *Anything that writes to the world* — the git history, the live site, an inbox, or a load-bearing invariant — needs a human "yes" first.

---

## The special-case items (why they need sign-off)

- **Partner slugs** — `cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`, `disability`, `schools-global` are printed on **physical QR codes** and embedded in old URLs. Renaming one breaks the real world. **Never rename a slug; change the visible `name` field instead.** This is not "ask first" so much as "don't."
- **Redirect stubs** — `voices-of-love.html`, `taps-of-love.html`, `gyco.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`, `about-gyco.html` — and the anchors they target must never be deleted or altered without approval; they keep old links working.
- **`REPLACE_ME` / `TODO`** — these render as **safe fallbacks by design** (e.g. a Form key at `REPLACE_ME` routes to the contact page). Only a human knows the real value; the AI must never guess one.
- **Forms** — the `SITE.forms` keys (`studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest`) point to external Google Forms. Wiring in a real URL is a human decision.
- **Korean text / percent-encoded URLs** — preserve exactly; any change to them is an approval-required edit, not a cleanup.
- **git / deploy** — per `directives/github_workflow.md`, never push, PR, merge, or even commit unless the maintainer asks **in that moment**. A standing "you can commit" from earlier does not carry over.
- **Security** — per `directives/security_check_before_deploy.md`, the pre-deploy security check must pass before any deploy is even proposed.

---

## Escalation / ask-first protocol

When a task needs approval, do this:

1. **Stop before the write.** Do all the safe prep (read, draft, run tests) first.
2. **Show the exact diff** or the exact action you intend to take.
3. **State the risk** in one line (which invariant it touches, if any).
4. **Ask a single, specific yes/no question** and wait.
5. **Only proceed on an explicit "yes"** for that specific action. If scope changes, ask again.

### Exact phrasing to use when asking

> "I've prepared this change to `<file>`: `<one-line summary>`. Here is the diff. It touches `<invariant / risk, or 'no load-bearing invariant'>`. The smoke tests pass (80/0). **May I apply it? And separately, do you want me to commit / push?**"

For git specifically:

> "This is ready to commit. **Do you want me to commit now?** If so, may I also push to `<branch>`, or should I stop at the commit?"

For anything external:

> "This outreach email is drafted and ready. **Do you want to send it as-is, edit it, or should I hold?** I will not send anything without your go-ahead."

If you cannot get a clear answer, **do nothing and leave the working tree as a proposed diff.** A stalled task is always safer than an unapproved write on this site.

---

## Cross-references

- Git rules: `directives/github_workflow.md`
- Security gate: `directives/security_check_before_deploy.md`
- Editing workflow: `directives/website_editing_workflow.md`
- Risk ranking of tasks: `AUTOMATION_PRIORITY_RANKING.md`
- Folder index: `AUTOMATION_MAP.md`
