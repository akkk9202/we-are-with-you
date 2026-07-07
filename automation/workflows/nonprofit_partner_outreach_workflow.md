# Nonprofit Partner Outreach Workflow

Purpose: Prepare outreach to prospective partner communities (hospitals, senior living, schools, family spaces) for **WE ARE WITH YOU**. This workflow produces DRAFTS only — a human must approve and send.

## When to use
- Identifying and drafting first contact with a potential new partner.
- Drafting a follow-up to an earlier conversation.
- Preparing the groundwork before a partner is added to the site.

## Preconditions / read first
- `context/project.md` and `context/brand_voice.md` (who we are, how we speak).
- `templates/outreach_email_template.md` and `templates/followup_email_template.md`.
- `checklists/partner_safety_checklist.md`.

## Hard rule: draft-only
- **Do NOT send any email, message, or form submission.** Sending REQUIRES explicit human approval and a human hitting send. This is a student-led project contacting hospitals and grieving-adjacent communities — every outbound message must be human-reviewed.
- Do NOT collect, store, or expose private personal data of contacts.

## Steps
1. **UNDERSTAND.** Which organization, what type (hospital / NICU / Ronald McDonald House / senior living / disability / school / global), and what's the ask (introduce the program, propose a visit, etc.)?
2. **RESEARCH (light).** Confirm the org is a real, appropriate fit and note a genuine, specific reason for reaching out. No fabricated details.
3. **DRAFT.** Use `templates/outreach_email_template.md` (or `followup_email_template.md`). Keep it short, warm, and specific. Lead with the mission and the tagline spirit ("Even Here. Even Now. We Are With You."), not a sales pitch. Make the ask clear and low-pressure.
4. **TONE REVIEW.** Run the draft through `automation/workflows/content_quality_review_workflow.md` tone standards — respectful, never presumptuous about patients or loss.
5. **PREP THE HANDOFF.** Present the draft plus a note of who should review/send it. Stop.
6. **(Later) On acceptance → add the partner.** When a partnership is confirmed and approved, follow `automation/workflows/partner_page_update_workflow.md` / `add-partner.md` to add an entry in `js/partners.js` with a NEW slug (never reuse or rename an existing slug).

## Verify
- Draft matches brand voice and the template structure.
- No private data included; no claims that aren't true.
- No message was actually sent.

## Guardrails / do NOT
- Do NOT send anything. Draft and hand off only.
- Do NOT promise services, dates, or capacity the project can't deliver.
- Do NOT add a partner to `js/partners.js` until the partnership is real and approved.
- Do NOT rename an existing slug when eventually adding the new partner.

## Done means
A reviewed, tone-checked draft (outreach or follow-up) ready for a human to approve and send, with a clear note on next steps and any future site addition — nothing sent, nothing published.

## Related
- Template: `templates/outreach_email_template.md`, `templates/followup_email_template.md`
- Checklist: `checklists/partner_safety_checklist.md`
- Workflow: `partner_page_update_workflow.md`, `automation/workflows/add-partner.md`
