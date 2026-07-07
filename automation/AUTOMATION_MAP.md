# AUTOMATION_MAP.md

> **Purpose:** The master index (table of contents) for the `automation/` folder — a documentation operating system for editing and maintaining the **WE ARE WITH YOU** static site safely.

---

## What `automation/` is (and is not)

`automation/` is a **documentation operating system**, not a running engine.

- **It is:** a library of repeatable, human-run **procedures** — workflows, templates, prompts, checklists, and reference maps — that let a maintainer (or an AI assistant like Claude Code) make changes to this site correctly and safely, every time.
- **It is not:** scripts, a build step, a scheduler, a bot, or any code that runs on its own. This site is a **static website on GitHub Pages** with **no backend, no build step, no database, no server code, and no auth**. "Automation" here means *a documented procedure a person follows*, not software that executes.

Live site: `https://akkk9202.github.io/we-are-with-you/`
Project: student-led platform by the **Greater Youth Collaborative Opus (GYCO)**.
Tagline: **"Even Here. Even Now. We Are With You."**
Audience includes hospital patients and grieving families — **tone always matters**.

---

## The content model (what you actually edit)

Almost all content lives in data files, not in HTML. `js/site.js` reads them and injects nav, footer, cards, the carousel, and partner pages at runtime.

| What | Where (target structure) |
|------|---------------------------|
| Per-page content | `js/content/pages/` |
| Global settings (contact, forms, nav, homepage images, featured press — the `SITE` object) | `js/content/global.js` |
| Images / videos | `js/content/media-assets.js` |
| Theme presets | `js/content/theme-options.js` + `css/theme.css` |
| Partner / pathway pages (the `PARTNERS` object) | `js/partners.js` |
| Renderer engine (rarely edit) | `js/site.js` |
| Base design system / tokens | `css/style.css` |
| Theme layer | `css/theme.css` |

> **Current vs. target note:** The `js/content/*` layout is the TARGET structure on the `design-upgrade` branch. The live tree currently still uses `js/config.js` for global settings and `css/style.css` for the design system. Where a workflow names `js/content/global.js`, on the live branch that maps to `js/config.js`.

---

## Directory map — one line per file

### Top level (`automation/`)
| File | What it does |
|------|--------------|
| `AUTOMATION_MAP.md` | This index — start here to find any procedure. |
| `AUTOMATION_PRIORITY_RANKING.md` | Ranks every workflow by impact × frequency ÷ risk. |
| `MONTHLY_MAINTENANCE_SYSTEM.md` | The recurring monthly upkeep routine + log template. |
| `HUMAN_APPROVAL_RULES.md` | What an AI may do alone vs. what needs explicit human approval. |

### `workflows/` — step-by-step procedures for a task
| File | What it does |
|------|--------------|
| `website_section_edit.md` | Edit copy in a page under `js/content/pages/`. |
| `image_video_update.md` | Swap a photo/video via `js/content/media-assets.js`. |
| `hyperlink_update.md` | Update a link or a `data-form` route safely. |
| `media_article_publish.md` | Add a featured press item (incl. Korean / percent-encoded links). |
| `partner_page_update.md` | Edit a partner entry in `js/partners.js` without touching slugs. |
| `theme_preview.md` | Preview / change theme via `theme-options.js` + `css/theme.css`. |
| `predeploy_security.md` | Run the pre-deploy security check. |
| `github_commit_push.md` | Commit/push discipline — only on explicit human request. |
| `broken_link_check.md` | Check all internal, outbound Form, and press links. |
| `content_quality_review.md` | Tone + clarity pass for a patient/family audience. |
| `nonprofit_partner_outreach.md` | Draft outreach to a prospective partner community. |
| `college_portfolio_export.md` | Package the project as a portfolio artifact. |
| `nado_passport_product.md` | Forward-looking NADO Passport product procedure. |

### `templates/` — fill-in-the-blank starting documents
| File | What it does |
|------|--------------|
| `website_edit_request.md` | Structured request describing an edit to make. |
| `media_article.md` | Skeleton for a new press/featured article entry. |
| `partner_profile.md` | Skeleton for a partner community entry. |
| `outreach_email.md` | First-contact email to a prospective partner. |
| `followup_email.md` | Follow-up email after outreach. |
| `changelog.md` | Entry format for recording what changed. |
| `test_report.md` | Record smoke-test + link-check results. |
| `launch_checklist.md` | Sign-off sheet before a deploy. |

### `prompts/` — ready-to-paste prompts for Claude Code
| File | What it does |
|------|--------------|
| `CLAUDE_CODE_MASTER_PROMPTS.md` | General safe operating prompts for this repo. |
| `SAFE_REFACTOR_PROMPTS.md` | Refactor without breaking slugs/redirects/forms. |
| `WEBSITE_EDIT_PROMPTS.md` | Prompts for routine content edits. |
| `SECURITY_AUDIT_PROMPTS.md` | Prompts to run the security review. |
| `DESIGN_REVIEW_PROMPTS.md` | Prompts for the frontend design review. |
| `CONTENT_REWRITE_PROMPTS.md` | Prompts for tone-safe rewriting. |
| `NADO_PASSPORT_PROMPTS.md` | Prompts for the NADO Passport product work. |
| `COLLEGE_PORTFOLIO_PROMPTS.md` | Prompts for portfolio export. |

### `checklists/` — quick yes/no gates
| File | What it does |
|------|--------------|
| `before_editing.md` | Confirm you know the file, field, and invariants. |
| `before_deploy.md` | Tests + security check pass before shipping. |
| `after_deploy.md` | Verify the live site after a push. |
| `image_upload.md` | Alt text, size, path, licensing checks. |
| `hyperlink.md` | Link target, `data-form` key, no dead links. |
| `mobile_design.md` | Mobile layout spot-check. |
| `accessibility.md` | Alt text, contrast, headings, focus. |
| `seo_basics.md` | Titles, meta, headings sanity. |
| `partner_safety.md` | Slug + tone + consent checks for partner content. |

### `reference/` — maps and guardrails
| File | What it does |
|------|--------------|
| `FILE_OWNERSHIP_MAP.md` | Which file owns which piece of the site. |
| `EDITABLE_FIELDS_MAP.md` | Exactly which fields are safe to edit. |
| `RISKY_FILES_DO_NOT_TOUCH.md` | Files to avoid unless that is the task. |
| `QR_AND_SLUG_PROTECTION_GUIDE.md` | Why the six slugs are load-bearing. |
| `THEME_SYSTEM_GUIDE.md` | How `theme-options.js` + `css/theme.css` work. |
| `MEDIA_ASSET_GUIDE.md` | How `media-assets.js` maps to images/videos. |
| `TESTING_GUIDE.md` | How to run the smoke tests and syntax check. |

---

## Load-bearing invariants (memorize these)

These raise the risk of *any* change and are why the procedures exist:

1. **Partner slugs are printed on physical QR codes and live in old URLs. NEVER rename a slug.** Change the visible `name` field instead. The six slugs: `cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`, `disability`, `schools-global`.
2. **Redirect stubs must never be deleted** (nor the anchors they target): `voices-of-love.html`, `taps-of-love.html`, `gyco.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`, `about-gyco.html`.
3. **Google Forms are outbound links** via `SITE.forms` keys: `studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest`. Any element with `data-form="key"` routes through these; a key left at `REPLACE_ME` safely routes to the contact page.
4. **`REPLACE_ME` / `TODO` render as safe fallbacks by design.** Do not invent real values.
5. **Preserve Korean text and percent-encoded URLs exactly** (e.g. the Newswave25 press links).

---

## Testing (run before any deploy)

```bash
npm install jsdom --no-save      # jsdom is NOT committed; node_modules is gitignored
node test/smoke.test.js          # expect "80 passed, 0 failed"
node --check js/site.js
rm -rf node_modules              # optional cleanup
```

There is no `package.json` and no dev server — open the HTML directly or `python3 -m http.server`.

---

## Start here — reading order

1. **`CLAUDE.md`** (repo root) — the single source of truth for how the repo works.
2. **`AUTOMATION_START_HERE.md`** — the plain-English on-ramp to this folder.
3. **This file, `AUTOMATION_MAP.md`** — find the exact procedure you need.
4. **`HUMAN_APPROVAL_RULES.md`** — before doing anything that changes files, know what needs sign-off.
5. **The specific `workflows/` file** for your task, plus its matching `checklists/` gate.
6. **`AUTOMATION_PRIORITY_RANKING.md`** when deciding what to work on next.
7. **`MONTHLY_MAINTENANCE_SYSTEM.md`** on a recurring cadence.

## How this relates to the other docs

- **`CLAUDE.md`** — the authoritative rules; `automation/` operationalizes them. If they ever disagree, `CLAUDE.md` and the `directives/` win.
- **`AUTOMATION_START_HERE.md`** — the friendly entry point; this map is the full index it points into.
- **`EDITING-MAP.md` / `EDITING-GUIDE.md`** — non-technical "where do I change X" guides; `automation/reference/` mirrors these with more guardrails.
- **`directives/`** — binding rules (`github_workflow.md`, `security_check_before_deploy.md`, `website_editing_workflow.md`) that the workflows here call into.
- **`context/`** and **`skills/`** — voice/preferences and reusable review procedures the prompts and checklists reference.
