# WE ARE WITH YOU — Platform Website

A student-led platform bringing music, learning, encouragement, and human connection
into hospitals, family spaces, senior communities, schools, and global partner communities.

**Live site:** https://akkk9202.github.io/we-are-with-you/

## Structure
- **WE ARE WITH YOU** — the public front door and platform (this site)
- **Programs** — partner-specific landing pages (City of Hope Atlanta (CTCA), Ronald McDonald House, Northside Intensive Care Unit (NICU), Senior Living, The America Wheat Mission (Milal), Schools & Global Communities), all generated from one template
- **GYCO** — More Than Music: the student growth community behind the work
- **NADO School** — Become a School: the learning philosophy behind student growth
- **NOS** — the operating system that keeps every partner page personal but connected

## Tech
Plain HTML/CSS/JS. No framework, no build step, no dependencies.
Nav + footer are injected from `js/config.js`; pathway cards, the nav dropdown, the footer program links, and all partner pages render from `js/partners.js` (single source for names, order, and logos). Homepage images + the featured press card are configured in `js/config.js`.

## Editing
See **EDITING-GUIDE.md** — contact info, form links, nav, and all partner content
are centralized in `js/config.js` and `js/partners.js`.

## Run locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy
Push to `main` — GitHub Pages publishes automatically.
