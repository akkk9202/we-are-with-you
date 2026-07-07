# Reference — Prime directives (never crossed without an explicit, in-the-moment request)

- **Never `git push`, open a PR, or merge** unless the maintainer explicitly asks. Committing is
  also opt-in. (`../../directives/github_workflow.md`)
- **Never rename a partner slug.** `cancer-care`, `ronald-mcdonald-house`, `nicu`, `senior-living`,
  `disability`, `schools-global` are printed on physical QR codes and linked from old URLs. Change
  the visible `name` field instead. (`../reference/slugs.md`)
- **Never delete redirect stubs** — `voices-of-love.html`, `taps-of-love.html`, `gyco.html`,
  `we-are-with-you.html`, `beat-and-breeze.html`, `winds-of-love.html` — or the anchors they target.
- **Don't touch design, layout, CSS tokens, copy, images, or navigation** unless that *is* the task.
- **Don't invent real values** for `REPLACE_ME…` / `TODO` placeholders — they render as safe
  fallbacks by design. Leave them until the maintainer supplies real ones.
- **Keep changes minimal, show the diff, run the tests.** (`../../context/user_preferences.md`)
- **Tone matters** — the audience includes patients and grieving families.
  (`../../context/brand_voice.md`)
- **Don't install packages** beyond the transient `jsdom --no-save` the tests need; never commit
  `node_modules/`.

If a directive and anything else disagree, the **directive wins**.
