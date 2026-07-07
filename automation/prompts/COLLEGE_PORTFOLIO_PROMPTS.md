# College Portfolio Prompts

> Prompts to help a student assemble a **college-application portfolio** from their real contributions to the **WE ARE WITH YOU** project (GYCO). Built from **git history and the changelog** — framed honestly, with **no fabrication and no private data**.

**Non-negotiable integrity rules**
- Use only what the git history / repo actually shows. **Never invent** contributions, metrics, dates, titles, or outcomes.
- **No private data**: no other people's personal info, no contact details, no emails, no secrets. This is a public static site — keep it that way.
- Distinguish clearly between *what the student built* and *what the team/project is*.
- Honest impact framing: describe scope and effort truthfully; don't inflate a copy edit into "led engineering."
- Read-only on the codebase — these prompts generate documents, they don't change the site. Never push/commit unless asked.

**Useful context**: `context/project.md` (what the platform is), the git log, and `CHANGELOG`/commit messages.

---

## 1. Extract contributions from git history

```
This is the WE ARE WITH YOU repo (GYCO, a student-led platform). I want to summarize MY real
contributions for a college application. Author: <name/email as it appears in git>.

From git history only (git log --author="<...>", file stats, commit messages) and any CHANGELOG,
produce a factual list: what I changed, when, and which parts of the site (content pages, partner
pages, design, security hardening, automation, etc.). Cite commit hashes/dates. Do NOT infer or
embellish anything not in the history. If something is ambiguous, list it as "needs confirmation."
Read-only — no code changes.
```

## 2. Draft an honest impact summary

```
Using the verified contribution list, write a 150–200 word honest impact summary suitable for a
college app. Frame it truthfully: what I personally did, the skills involved, and the real-world
purpose (bringing music/learning/connection to hospitals, senior communities, schools — see
context/project.md).

Rules: no fabricated metrics ("thousands of users") unless I give you a verified number; separate
"I built X" from "the project does Y"; warm but not grandiose. Deliver as text for my review.
```

## 3. Turn contributions into resume bullets

```
Convert my verified contributions into 4–6 resume bullet points. Each bullet: strong verb, concrete
artifact (e.g. "built the partner-page content system in js/partners.js"), and honest scope. No
invented numbers, no vague fluff. Mark any bullet that needs a real metric with "[add real number]"
rather than making one up. Text output only.
```

## 4. Draft an activity / essay paragraph

```
Draft a short college-essay-style paragraph about my work on WE ARE WITH YOU. Ground it in real
contributions (from the git history summary) and the project's mission for patients, families,
seniors, and students. Keep it genuine and specific — one concrete thing I built and why it mattered
to me. No exaggeration, no fabricated outcomes. Give me 2 versions to choose from.
```

## 5. Integrity / privacy audit of the portfolio draft

```
Audit my portfolio draft before I submit it:
- Flag any claim NOT supported by the git history / repo (possible fabrication).
- Flag any private data: other people's names, emails, contact info, or anything non-public.
- Flag any inflated framing (individual vs team, effort overstated).
For each, quote the line and suggest an honest fix. Read-only report — don't rewrite unless I ask.
```

## 6. Compile the portfolio document

```
Compile my reviewed, verified content into a single clean markdown portfolio doc: summary, impact,
resume bullets, and an essay paragraph. Include a short "Contributions verified from git history"
appendix with commit references. Save it as a NEW markdown file OUTSIDE the website source (e.g. under
automation/ or a scratch folder) — do NOT modify any site file, and do not commit. Everything must
trace back to something real in the repo.
```

---

## Good vs. vague

| Vague | Good |
|---|---|
| "Write my portfolio." | "From git log --author='<me>', list my real commits with hashes; then draft honest bullets, mark any missing metric [add real number]." |
| "Make it impressive." | "Frame my actual contributions honestly; separate 'I built' from 'the team did'; no invented numbers." |

**The whole point is honesty.** If the repo doesn't show it, it doesn't go in the portfolio. Keep other people's data out.
