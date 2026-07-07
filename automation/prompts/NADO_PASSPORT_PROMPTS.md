# NADO Passport Prompts

> Prompts for developing the **"NADO Passport"** product concept tied to the **NADO School** on the **WE ARE WITH YOU** site. Takes you from idea → spec → draft page content → review → approval, with guardrails at every gate.

**Orientation (get this right)**
- **NADO School = `learning.html`** (its page content lives in `js/content/pages/`).
- **GYCO / student community = `student-community.html`** — do not confuse the two.
- Anything student-facing may reach patients and families — brand voice from `context/brand_voice.md` applies.
- New copy goes into `js/content/pages/`; the renderer is `js/site.js`. Forms use `data-form` keys via `SITE.forms` (existing keys: `studentApplication`, `partnerInquiry`, `songRequest`, `letterSubmission`, `hopeCapsule`, `teachingVideoRequest`). If NADO Passport needs a new form, use a **new key left as `REPLACE_ME`** until a real Google Form URL exists — never invent one.
- Minimal diffs, smoke tests 80/0, never push/commit unless asked.

---

## 1. Ideate the NADO Passport concept (no code)

```
Help me shape the "NADO Passport" concept for the NADO School (learning.html) on the WE ARE WITH YOU
site. NADO School = learning.html; GYCO student community = student-community.html — keep them distinct.

Read js/content/pages/ for learning.html and context/project.md + context/brand_voice.md first so the
idea fits the platform. Then propose 3 framings for what a "NADO Passport" could be for students
(e.g. a learning/participation record, a milestone journey). For each: one-paragraph pitch, who it's
for, and how it ties into existing NADO School content. NO code this turn — concepts only.
```

## 2. Write a product spec

```
Write a short product spec for the NADO Passport (attached to NADO School = learning.html).

Include: purpose, target user, the "passport" metaphor mechanics, what content sections it needs on
the page, any form/CTA it needs (map to a SITE.forms key — propose a NEW key left as REPLACE_ME if
none fits; do not invent a URL), and what stays out of scope (no backend, no auth, no database — this
is a static site). Keep tone consistent with context/brand_voice.md. Deliver as markdown for review,
no file edits.
```

## 3. Draft the page content (into data file)

```
Draft the NADO Passport section content as data for js/content/pages/ (the learning.html page).

- Match the exact object/array shape used by existing sections in that file.
- Brand voice per context/brand_voice.md; warm, plain, patient/family-sensitive.
- Any CTA uses data-form="<key>"; if it's a new form, use a new key value REPLACE_ME (safe fallback
  routes to contact) — never fabricate a Google Form URL.
- Do not rename slugs, delete redirect stubs, or touch student-community.html content.

Show me the proposed data as a diff BEFORE writing it. Wait for approval.
```

## 4. Review the draft (approval gate)

```
Review the NADO Passport draft you proposed against: brand voice (context/brand_voice.md), the NADO
School vs GYCO distinction (learning.html vs student-community.html), form-key safety (REPLACE_ME
left intact, no invented URLs), and rendered-output safety.

Give me a go/no-go with any fixes needed. Do not apply anything until I say "approved and go."
```

## 5. Apply approved content + verify

```
Apply ONLY the NADO Passport content I approved into the correct js/content/pages/ file. Minimal
diff. Then:
  node --check js/site.js
  npm install jsdom --no-save && node test/smoke.test.js   (expect 80 passed, 0 failed)
  rm -rf node_modules
Show the diff and test output. Do not push or commit.
```

## 6. Iterate copy on the passport

```
Refine the NADO Passport copy in js/content/pages/<learning page file>: <what to improve>. Keep the
same structure and any REPLACE_ME form keys. Brand voice preserved. Before/after as text first, then
minimal diff, smoke tests 80/0. No commit.
```

---

## Approval gating (bake this in)

1. **Ideate** → concepts only, no code.
2. **Spec** → markdown for review.
3. **Draft** → propose data as a diff, wait for approval.
4. **Review** → explicit go/no-go.
5. **Apply** → only what's approved, verify 80/0.

**Never** skip to editing files. **Never** invent a form URL for a new passport CTA — leave `REPLACE_ME`. **Never** put NADO Passport content on `student-community.html`; it belongs on `learning.html`.
