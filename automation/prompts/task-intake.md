# Prompt — Task intake / scoping

Run this before touching anything, to force the UNDERSTAND step.

> Restate the requested change in exactly one sentence. Then answer:
> 1. Which single file and field owns this content? (Use `EDITING-MAP.md`.)
> 2. Does it touch any prime directive — a slug, a redirect stub, design/layout/CSS, nav structure,
>    a placeholder, or a push/commit/deploy? (See `automation/reference/prime-directives.md`.)
> 3. Is it small and reversible, or should I ask before editing?
> 4. What is the smallest edit that satisfies it?
> 5. Which checklist(s) gate it — regression gate always; security check if links/scripts/headers
>    changed?
>
> If step 2 flags a directive, or step 3 says "ask," **stop and ask the maintainer** before editing.
