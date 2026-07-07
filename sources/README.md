# sources/

Raw source material and references that inform the website but are **not served** as part of the live
site. Nothing GitHub Pages publishes should depend on this folder — it's a working area for the people
maintaining the content.

## What belongs here

- Original/high-resolution photos and logos before they're optimized into `assets/`.
- Partner-provided brand assets, name confirmations, and usage permissions.
- Press coverage source material (e.g., the Newswave25 article text/links, EN + KR).
- Reference copy, drafts, and notes that feed `js/config.js` / `js/partners.js`.
- Design references and any brand documents.

## What does NOT belong here

- **Secrets** — API keys, tokens, passwords, private credentials. Never commit these anywhere.
- **Private personal data** — patient names, private contact details, medical information.
- Anything the live site loads at runtime (put shipped assets in `assets/`, content in `js/`).

## Conventions

- Keep a short note of provenance for partner logos/names and any permission to use them.
- When a source becomes a shipped asset, optimize it into `assets/images` or `assets/logos` and
  reference it from `js/config.js` / `js/partners.js` — don't point the site at `sources/`.
- If you add large binaries, be mindful of repo size; prefer linking to an external store when
  appropriate rather than committing very large originals.

## Related

- Content model and editing rules → `directives/website_editing_workflow.md`
- Voice for turning sources into copy → `skills/content_rewrite_for_website.md`
- What must never be committed → `directives/security_check_before_deploy.md`
