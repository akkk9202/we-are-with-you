# WE ARE WITH YOU — Platform Website

A student-led platform bringing music, learning, encouragement, and human connection
into hospitals, family spaces, senior communities, schools, and global partner communities.

**Live site:** https://akkk9202.github.io/we-are-with-you/

## Structure
- **WE ARE WITH YOU** — the public front door and platform (this site)
- **Programs** — partner-specific landing pages (Cancer Care, Ronald McDonald House, NICU, Senior Living, Schools & Global, Disability Community), all generated from one template
- **Student Community** — GYCO, the student community behind the work
- **Learning** — NADO School, the learning system behind student growth
- **NOS** — the operating system that keeps every partner page personal but connected

## Tech
Plain HTML/CSS/JS. No framework, no build step, no dependencies.
Nav + footer are injected from `js/config.js`; partner pages render from `js/partners.js`.

## Editing
See **EDITING-GUIDE.md** — contact info, form links, nav, and all partner content
are centralized in `js/config.js` and `js/partners.js`.

## Run locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy
Push to `main` — GitHub Pages publishes automatically.
