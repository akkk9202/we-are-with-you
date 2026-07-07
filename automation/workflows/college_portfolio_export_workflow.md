# College Portfolio Export Workflow

Purpose: Turn a student's real contributions to **WE ARE WITH YOU** into a clean, honest portfolio artifact for college applications — sourced from git history and the changelog, never from invented claims.

## When to use
- A student contributor wants a record of what they built/wrote for the project.
- Preparing an activities-list entry, résumé bullet, or a short portfolio write-up.

## Preconditions / read first
- `prompts/COLLEGE_PORTFOLIO_PROMPTS.md` (framing and question set).
- `templates/changelog_template.md` (the project's change record format).
- `context/project.md` (accurate description of GYCO / WE ARE WITH YOU).

## Data sources (truth only)
- **Git history** — commits authored by the student (`git log --author=...`), file changes, dates. This is the primary evidence.
- **Changelog** entries (if maintained) via `templates/changelog_template.md`.
- The live site and this repo for what actually shipped.
- Do NOT rely on memory or estimate impact; if a number isn't verifiable, don't state it.

## Steps
1. **SCOPE.** Confirm which student and what time window. Get consent to summarize their work.
2. **GATHER.** Pull the student's commits and the sections/features they touched (content pages, partner entries, media, design, docs). Map each to a plain-English accomplishment.
3. **DRAFT.** Using `prompts/COLLEGE_PORTFOLIO_PROMPTS.md`, write:
   - A short project description (what WE ARE WITH YOU / GYCO is).
   - The student's specific role and contributions, tied to real commits.
   - Skills demonstrated (writing, design, accessibility, teamwork, safety practices).
   - Optional metrics ONLY if verifiable (e.g. number of partner pages authored) — no inflated impact claims.
4. **REVIEW.** Tone honest and specific; no exaggeration. Cross-check every claim against the git evidence.
5. **DELIVER.** Provide the write-up. If saved as a file, keep it OUT of the public repo unless asked.

## Privacy (critical)
- Do NOT expose private personal data: no partner patients, no minors' personal details, no private emails, no non-public contact info. Describe contributions, not protected people.
- Portfolio artifacts are for the student — do NOT publish them to the live site or commit them without an explicit request.

## Verify
- Every stated contribution maps to a real commit or changelog entry.
- No private data, no unverifiable metrics.

## Guardrails / do NOT
- Do NOT fabricate or inflate contributions or impact.
- Do NOT include protected/private information about partners or beneficiaries.
- Do NOT publish/commit the artifact unless explicitly asked.

## Done means
An honest, evidence-backed portfolio write-up of the student's real contributions, free of private data, delivered to the student — not published.

## Related
- Prompts: `prompts/COLLEGE_PORTFOLIO_PROMPTS.md`
- Template: `templates/changelog_template.md`
