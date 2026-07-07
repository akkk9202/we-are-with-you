# Content Rewrite Prompts

> Prompts for brand-voice-safe copy rewriting on the **WE ARE WITH YOU** site. References `skills/content_rewrite_for_website.md` and `context/brand_voice.md`. This audience includes **hospital patients and grieving families** — tone is the whole job.

**Voice guardrails (read `context/brand_voice.md` first)**
- Warm, plain, human. Short sentences. No hype, no marketing gloss, no false promises.
- Never sensationalize illness, death, or grief. Never imply outcomes ("cure," "fix," "make it all better").
- Inclusive, dignified language about patients, disability, seniors, and bereavement.
- Keep the tagline exactly: **"Even Here. Even Now. We Are With You."**
- Preserve Korean text and any bilingual phrasing; don't machine-translate or drop it.

**Where copy lives**: `js/content/pages/` (page text) and `js/partners.js` (partner content). Edit data files, not HTML. Minimal diffs, smoke tests 80/0, no commit unless asked.

---

## 1. Rewrite a section in brand voice

```
Rewrite the <section> copy in js/content/pages/<page>.js following skills/content_rewrite_for_website.md
and context/brand_voice.md.

Current text:
"<paste exact current copy>"

Goals: warmer, plainer, shorter sentences; dignified toward patients/grieving families; no hype, no
promises of outcomes. Keep the meaning and any Korean text. Keep the tagline unchanged if present.

Give me 2 options first as plain text (don't edit files yet). After I pick one, apply it as a
minimal diff and run smoke tests (80/0).
```

## 2. Tone/sensitivity check (no rewrite)

```
Review the copy in <file> for tone against context/brand_voice.md, given the audience includes
hospital patients and grieving families.

Flag: anything that sensationalizes illness/death, over-promises outcomes, sounds like marketing,
or could feel cold/clinical or pitying. Quote the line, say why, suggest a gentler alternative.
Read-only — findings only, no edits.
```

## 3. Tighten wordy copy without changing meaning

```
Tighten the <section> in js/content/pages/<page>.js: fewer words, plainer language, same meaning
and same warmth. Do not add claims or remove any factual detail. Preserve Korean text and the
tagline. Show me before/after as text first; apply as minimal diff after I approve. Smoke tests 80/0.
```

## 4. Rewrite partner-page copy

```
Rewrite the description for the <slug> partner in js/partners.js in brand voice. Slug stays "<slug>"
(printed on QR codes) — only change the visible text fields, never the slug key.

Keep it respectful and specific to that community (e.g. NICU families, seniors, disability partners,
schools). No pity framing, no outcome promises. Preserve Korean text. Offer 2 options as text first;
apply the chosen one as a minimal diff; smoke tests 80/0.
```

## 5. Bilingual consistency pass

```
Review pages that mix English and Korean (js/content/pages/ and js/partners.js). Check that:
- Korean text is preserved exactly (no accidental edits, no re-encoding).
- English and Korean convey the same warmth and meaning.
Flag mismatches. Do NOT machine-translate or replace Korean — if something reads off, describe it
and ask me. Read-only report.
```

## 6. New copy from a brief

```
Draft new copy for <where it will go> from this brief: <brief>.

Constraints: brand voice per context/brand_voice.md, patient/grief-sensitive, plain and warm, no
hype, no outcome promises. Deliver as plain text options only — do NOT edit files yet. Once I
approve wording, I'll tell you exactly which js/content/pages/ key to place it in.
```

---

## Good vs. vague

| Vague | Good |
|---|---|
| "Make the copy better." | "Rewrite the NICU intro in js/partners.js warmer + plainer per context/brand_voice.md; 2 text options first." |
| "Punch up the homepage." | "Tighten the index hero copy without adding claims; keep the tagline; before/after as text." |

**Golden rule:** for tone-sensitive copy, deliver text options for approval **before** editing files. Never promise outcomes; never sensationalize; never alter the tagline or Korean text.
