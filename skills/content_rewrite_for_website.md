# Skill: Content rewrite for the website

Use this when rewriting or drafting copy for the site. The goal is prose that fits the brand voice,
lands gently for a vulnerable audience, and drops cleanly into the data-driven content model.

## Before you write

1. Read `context/brand_voice.md` and `context/project.md`.
2. Locate where the text actually lives:
   - Partner page copy → `js/partners.js` (`heroTitle`, `heroText`, `about`, `cards[].text`, `closing`).
   - Global copy (tagline, footer note, press item) → `js/config.js` (`SITE`).
   - Page-specific static prose → the relevant `*.html`.
3. Note which community the copy serves and match its register (NICU/quiet vs. schools/upbeat).

## Voice rules (summary — full version in brand_voice.md)

- Warm, calm, present, human. A companion, not a vendor.
- Dignity first: participants, not beneficiaries. No pity, no "inspiration," no hype or urgency.
- Short sentences, plain words, concrete nouns. Read it aloud.
- Invitational ("you are invited," "when you're ready," "you may").
- Honest: don't promise features that aren't live.

## Hard constraints

- **Don't change public partner names** ("City of Hope Atlanta (CTCA)", "The America Wheat Mission
  (Milal)", "Northside Intensive Care Unit (NICU)", …) unless that's the explicit task.
- **Never touch partner slugs** — they're QR-code / URL keys.
- **Preserve Korean text** (e.g., 나도) and any encoded URLs exactly.
- Keep the canonical tagline intact: **"Even Here. Even Now. We Are With You."**
- Match the casing convention the target field/page already uses.

## Process

1. Draft the rewrite in place (or propose it) at the correct data field / HTML location.
2. Preserve meaning and any factual claims (dates, "501(c)(3)", "Friends of Refugees", publisher
   names, article titles). Don't invent facts.
3. Keep length compatible with the layout (card text is short; hero subs are one or two lines).
4. Escape nothing manually — but avoid stray characters that could break the JS template strings
   (unescaped backticks or `${` inside `config.js`/`partners.js` string values).

## Verify

- `node --check js/config.js` / `node --check js/partners.js` if you edited them.
- `node test/smoke.test.js` — several tests assert exact strings (titles, labels, ordering); update
  expectations only if the change is intentional and approved. Expect `80 passed, 0 failed`.
- Re-read the result aloud against the voice rules.

## Output

Show the before/after and the diff. Keep edits minimal and reversible. Don't push.
