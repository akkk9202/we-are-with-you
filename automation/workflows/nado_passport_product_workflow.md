# NADO Passport Product Workflow

Purpose: A product-development workflow for the forward-looking **"NADO Passport"** concept tied to the NADO School — from idea to reviewed, approved content that could live on the site.

## Terminology (get this right)
- **NADO School = `learning.html`** — the learning/education experience.
- **GYCO community = `student-community.html`** — the Greater Youth Collaborative Opus student community.
- These are two different pages; do not conflate them. The NADO Passport is a NADO School (learning) concept.

## When to use
- Developing the NADO Passport idea into a real, buildable spec.
- Turning an approved spec into page content.

## Preconditions / read first
- `prompts/NADO_PASSPORT_PROMPTS.md` (ideation + spec prompts).
- `context/project.md` and `context/brand_voice.md`.
- `automation/reference/file-map.md` (page ownership).

## Steps (ideation → spec → content → review → approval)
1. **IDEATION.** Using `prompts/NADO_PASSPORT_PROMPTS.md`, define what a "Passport" is for a learner: what it tracks/celebrates (e.g. learning milestones, participation), who it's for, and how it fits the NADO School on `learning.html`. Capture the idea; do not build yet.
2. **SPEC.** Write a short spec: the learner-facing goal, the sections/fields, how it renders (reusing existing card/section patterns from `js/site.js`), and any data it needs. Note explicitly that this is static, no-backend — no accounts, no stored personal data. Any "submission" is an outbound Google Form via a `SITE.forms` key (add a new key if needed; leave it `REPLACE_ME` until a real form exists).
3. **CONTENT DRAFT.** Draft the actual copy/structure as data for the NADO School page under `js/content/pages/` (the `learning.html` owner). Keep it in the data files, not hand-edited HTML. Tone: encouraging, warm, age-appropriate.
4. **REVIEW.** Run `automation/workflows/content_quality_review_workflow.md` (voice/tone) and, if it touches design, `skills/frontend_design_review.md`. Check mobile + accessibility.
5. **APPROVAL.** Present the spec + draft. This is a new product surface — it ships ONLY with explicit human approval.
6. **VERIFY & GATE.** Before any deploy, run `automation/workflows/predeploy_security_workflow.md`.

## Verify
- `npm install jsdom --no-save && node test/smoke.test.js` → **80 passed, 0 failed** → `rm -rf node_modules` (optional).
- `node --check js/site.js` and any edited `js/content/*.js`.
- Manual: `learning.html` renders the new content correctly on desktop and mobile.

## Guardrails / do NOT
- Do NOT introduce a backend, login, or stored personal data — the site is static, no-auth. No child data collection.
- Do NOT confuse NADO School (`learning.html`) with the GYCO community (`student-community.html`).
- Do NOT invent a real Google Form URL; leave new form keys as `REPLACE_ME` (safe fallback to contact).
- Do NOT ship the product without explicit approval.

## Done means
A clear NADO Passport spec and a reviewed content draft for `learning.html` (in `js/content/pages/`), tone- and accessibility-checked, security gate passed, awaiting explicit approval — nothing deployed unilaterally.

## Related
- Prompts: `prompts/NADO_PASSPORT_PROMPTS.md`
- Workflow: `content_quality_review_workflow.md`, `predeploy_security_workflow.md`
- Skill: `skills/frontend_design_review.md`
