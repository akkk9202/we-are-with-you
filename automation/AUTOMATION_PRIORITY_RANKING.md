# AUTOMATION_PRIORITY_RANKING.md

> **Purpose:** Rank every `automation/workflows/` procedure by how much it matters, how often it happens, and how risky it is — so a maintainer or AI assistant knows what to master first for the **WE ARE WITH YOU** static site.

---

## Ranking logic

Priority is judged as roughly:

```
priority  ≈  (impact × frequency) ÷ risk-if-done-wrong
```

- **Impact** — does this touch what visitors (patients, families, partners) actually see?
- **Frequency** — how often does a maintainer really do it?
- **Risk** — how badly can a mistake break something load-bearing?

**Safety-critical, low-risk, high-frequency editing tasks rank at the top.** They are the daily work of running the site and, done well, are safe. **Forward-looking business items rank lower** — high potential value but infrequent and not on the site's critical path.

### What raises risk on this repo (the load-bearing invariants)

- **Partner slugs** (`cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`, `disability`, `schools-global`) are printed on physical QR codes and live in old URLs — **never rename a slug**, change the `name` field.
- **Redirect stubs** must never be deleted: `voices-of-love.html`, `taps-of-love.html`, `gyco.html`, `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html`, `about-gyco.html`.
- **Forms** route via `SITE.forms` keys (`studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest`) and `data-form="key"`; a `REPLACE_ME` key safely falls back to the contact page.
- **`REPLACE_ME` / `TODO`** are safe fallbacks by design — never invent real values.
- **Korean text and percent-encoded URLs** (e.g. Newswave25 press links) must be preserved exactly.

---

## The ranking

| Rank | Task / Workflow | Why it matters | Risk level | How often |
|------|-----------------|----------------|------------|-----------|
| 1 | `predeploy_security.md` | Gate that protects a public site serving patients/families; must run before every deploy. | Low to run, **high if skipped** | Every deploy |
| 2 | `github_commit_push.md` | Commit/push discipline — nothing ships without explicit human ask; prevents accidental public changes. | **High if mishandled** | Every change that ships |
| 3 | `broken_link_check.md` | Dead links (internal, Google Forms, press) silently break trust and participation. | Low | Weekly / monthly + pre-deploy |
| 4 | `website_section_edit.md` | The core daily edit — page copy via `js/content/pages/`. High impact, safe when scoped. | Low–Medium | Very frequent |
| 5 | `image_video_update.md` | Swapping media via `js/content/media-assets.js`; visible, common, low blast radius. | Low–Medium | Frequent |
| 6 | `hyperlink_update.md` | Links + `data-form` routing; safe fallback exists but wrong keys/targets mislead visitors. | Medium | Frequent |
| 7 | `content_quality_review.md` | Tone for a patient/grieving-family audience is part of the mission, not polish. | Low | Every content change |
| 8 | `partner_page_update.md` | Edits `js/partners.js`; high value but **slug risk** makes it Medium–High. | **Medium–High** | Occasional |
| 9 | `media_article_publish.md` | Adds featured press; must preserve Korean + percent-encoded URLs exactly. | Medium | Occasional |
| 10 | `theme_preview.md` | Theme via `theme-options.js` + `css/theme.css`; visual, reversible, but can affect all pages. | Medium | Occasional |
| 11 | `nonprofit_partner_outreach.md` | Grows the mission; external-facing, needs approval, not on the site's critical path. | Medium (external) | As needed |
| 12 | `college_portfolio_export.md` | Packages the work for portfolios; valuable to the students, no site impact. | Low | Rare |
| 13 | `nado_passport_product.md` | Forward-looking product; exploratory, highest ambiguity, least urgent to the live site. | Varies | Rare / exploratory |

---

## How to read the ranks

- **Ranks 1–3 are guardrails.** They are cheap to do and catastrophic to skip, so they sit above even the most frequent editing.
- **Ranks 4–7 are the daily editing loop.** High impact, high frequency, low risk *when the checklists are followed*. This is where most time goes.
- **Ranks 8–10 are higher-risk editing.** Same content model, but they touch load-bearing things (slugs, exact-preserved URLs, site-wide theme). Slow down and pair with `reference/QR_AND_SLUG_PROTECTION_GUIDE.md` and `reference/THEME_SYSTEM_GUIDE.md`.
- **Ranks 11–13 are forward-looking / business.** Real value, but infrequent and off the critical path — and outreach/publishing needs explicit human approval per `HUMAN_APPROVAL_RULES.md`.

## Cross-references

- Approval gates for every ranked task: `HUMAN_APPROVAL_RULES.md`
- The recurring cadence that folds in ranks 1, 3, 7: `MONTHLY_MAINTENANCE_SYSTEM.md`
- Binding rules behind ranks 1–2: `directives/security_check_before_deploy.md`, `directives/github_workflow.md`
- Full folder index: `AUTOMATION_MAP.md`
