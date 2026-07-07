# automation/ — The Automation Operating System

**Documentation only.** There is no automation *engine*, no scripts, no build step, and no server
in this repo — it is a static website (see `../CLAUDE.md`). "Automation operating system" here means
a **repeatable operating procedure** for making safe, minimal, reversible edits. If someone asks you
to "run the automation," they mean *follow the workflow in this folder*.

This folder is the structured, file-by-file expansion of `../AUTOMATION_START_HERE.md`. That root
file is the one-page overview; this folder holds the workflows, templates, prompts, checklists, and
quick-reference cards that the overview points to.

---

## Boot sequence (read in this order)

1. `../CLAUDE.md` — what the project is and the non-negotiables.
2. `../AUTOMATION_START_HERE.md` — the one-page operating overview.
3. `../EDITING-MAP.md` — where every piece of content lives ("change X → edit Y").
4. This folder, in the order below.
5. The relevant `../directives/` (rules that MUST be followed).
6. The relevant `../context/` and `../skills/`.

If a `directive/` and anything here ever disagree, the **directive wins**.

---

## What's in here

| Folder | What it holds | Start with |
|---|---|---|
| `workflows/` | Step-by-step procedures for the common tasks | `workflows/edit-content.md` |
| `templates/` | Copy-paste blocks for data files and commits | `templates/partner-entry.md` |
| `prompts/` | Reusable AI prompts for review and rewrite | `prompts/task-intake.md` |
| `checklists/` | Gates to pass before editing, testing, committing, deploying | `checklists/before-edit.md` |
| `reference/` | Quick-lookup cards (slugs, form keys, file map, directives) | `reference/prime-directives.md` |

---

## The operating loop (every change runs this)

```
  UNDERSTAND ─▶ LOCATE ─▶ EDIT ─▶ VERIFY ─▶ SHOW ─▶ STOP
```

The loop is detailed in `workflows/edit-content.md`. The gates it references live in `checklists/`.

*This is a documentation folder. It changes no website behavior.*
