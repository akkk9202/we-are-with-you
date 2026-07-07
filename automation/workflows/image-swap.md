# Workflow — Swap a photo or logo

For a straight image replacement, **no code change is needed** — dropping a real file at the
referenced path is all it takes.

1. **UNDERSTAND** — Which image, and where it appears (homepage invitation, carousel, partner logo).
2. **LOCATE** the referenced path:
   - Homepage invitation / carousel → paths in `js/config.js` → `SITE.home`.
   - Partner logo → the `logo` field in `js/partners.js` (missing file → clean monogram fallback).
   - Any photo → the file under `assets/images/…`; any logo → `assets/logos/…`.
3. **EDIT** — Overwrite the file at that path (same filename), **or** repoint the `src`/`logo` field
   to a new filename you add. Update `alt` text if the subject changed.
4. **VERIFY** — If you only replaced a file, no test change is expected; still eyeball the page. If
   you changed a `src`/`alt` in the data files, run `../checklists/regression-gate.md`.
5. **SHOW** — Note which file was replaced. 6. **STOP** — do not commit or push.

Don't touch design/layout/CSS while swapping an image unless that is the task.
