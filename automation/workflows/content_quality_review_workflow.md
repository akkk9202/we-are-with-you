# Content Quality Review Workflow

Purpose: Review copy on **WE ARE WITH YOU** for brand voice, tone, clarity, and correctness before it ships. The audience includes hospital patients and grieving families — tone is not optional.

## When to use
- Any new or edited copy, before deploy.
- A periodic pass over a page's language.
- Reviewing outreach or partner text for tone.

## Preconditions / read first
- `context/brand_voice.md` (voice & language rules) and `context/project.md`.
- `skills/content_rewrite_for_website.md` and `automation/prompts/content-rewrite.md` / `prompts/CONTENT_REWRITE_PROMPTS.md`.
- `checklists/accessibility_checklist.md` (plain-language + legibility).

## What to check
1. **Tone & compassion.** Calm, warm, human, never clinical, never salesy, never pitying. Reflects the tagline: "Even Here. Even Now. We Are With You." Nothing that could hurt a patient or grieving family.
2. **Brand voice.** Matches `context/brand_voice.md` — consistent naming (WE ARE WITH YOU, GYCO, NADO School), consistent capitalization and terminology.
3. **Clarity.** Short sentences, plain language, active voice. No jargon or insider abbreviations without explanation.
4. **Accuracy.** Names, dates, partner names, program facts are correct. No invented statistics or claims. Placeholders (`REPLACE_ME`/`TODO`) left as-is where real data is unknown.
5. **Correctness.** Spelling, grammar, punctuation. Korean text preserved exactly where present.
6. **Accessibility of language.** Readable for older adults and non-native readers; images have descriptive alt text.

## Steps (UNDERSTAND → LOCATE → EDIT → VERIFY → SHOW → STOP)
1. **UNDERSTAND.** What copy, which page/section, what's the goal of the message?
2. **LOCATE.** The owning data file under `js/content/pages/`, `js/content/global.js`, or `js/partners.js`.
3. **EDIT.** Apply the rewrite using the skill/prompts. Change wording only; do not restructure data or layout.
4. **VERIFY.** Re-read aloud against the tone rules; run tests (below).
5. **SHOW.** Present before/after with a one-line rationale per change.
6. **STOP.** Await approval.

## Verify
- `npm install jsdom --no-save && node test/smoke.test.js` → **80 passed, 0 failed** → `rm -rf node_modules` (optional).
- `node --check` on any edited `js/content/*.js` / `js/partners.js`.
- Manual read-through in the browser at mobile width.

## Guardrails / do NOT
- Do NOT introduce claims, numbers, or testimonials that aren't verified.
- Do NOT change slugs, links, images, or layout as part of a copy review.
- Do NOT alter Korean text.
- Do NOT commit/push/deploy unless explicitly asked.

## Done means
Copy matches brand voice and tone, is clear and correct, no invented facts, tests 80/0, before/after shown, nothing deployed.

## Related
- Skill: `skills/content_rewrite_for_website.md`
- Prompts: `automation/prompts/content-rewrite.md`, `prompts/CONTENT_REWRITE_PROMPTS.md`
- Checklist: `checklists/accessibility_checklist.md`
