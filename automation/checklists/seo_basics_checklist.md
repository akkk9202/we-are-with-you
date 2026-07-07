# SEO Basics Checklist

Purpose: Cover the essential on-page SEO for this static GitHub Pages site.
When to run: After adding a page or changing titles, meta, or headings.

## Per-page metadata
- [ ] Unique, descriptive `<title>` on each page.
- [ ] Meta description present and relevant (not duplicated everywhere).
- [ ] No accidental `noindex` / `robots` blocking on public pages.

## Content structure
- [ ] One meaningful h1 per page; headings describe the content.
- [ ] Images have alt text (supports SEO and accessibility).
- [ ] Link text is descriptive, not generic.

## URLs and base
- [ ] Canonical / base URL correct for the project subpath: `https://akkk9202.github.io/we-are-with-you/`.
- [ ] Internal links use correct relative/base paths (works under the `/we-are-with-you/` subpath).
- [ ] Partner URLs use `partner.html?p=SLUG` with unchanged slugs.

## Crawl basics
- [ ] `404.html` present and helpful.
- [ ] Redirect stubs forward correctly (no crawl dead ends).

## Verify
- [ ] `node test/smoke.test.js` → "80 passed, 0 failed".
