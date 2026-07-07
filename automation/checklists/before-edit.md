# Checklist — Before editing

- [ ] Task restated in one sentence (`../prompts/task-intake.md`).
- [ ] Located the single owning file/field via `../../EDITING-MAP.md`.
- [ ] Editing a **data file** (`js/config.js`, `js/partners.js`) if possible, not raw HTML.
- [ ] No prime directive crossed (`../reference/prime-directives.md`):
  - [ ] Not renaming a partner slug.
  - [ ] Not deleting a redirect stub or the anchor it targets.
  - [ ] Not touching design/layout/CSS/nav structure (unless that IS the task).
  - [ ] Not inventing a real value for a `REPLACE_ME…` / `TODO` placeholder.
- [ ] If design/layout/nav/large/irreversible → **ask the maintainer first**.
- [ ] Know which gate(s) will verify it: regression gate always; security check if links/scripts/
      headers change.

If every box is checked, make the **smallest** edit that satisfies the task.
