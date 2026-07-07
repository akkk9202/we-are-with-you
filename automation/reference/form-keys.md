# Reference — Form keys (`SITE.forms` in `js/config.js`)

Every form button routes through `SITE.forms`. A button's `data-form="<key>"` (in HTML) or a partner
card's `form:"<key>"` (in `js/partners.js`) looks up the URL here.

Valid keys:

- `studentApplication`
- `partnerInquiry`
- `songRequest`
- `letterSubmission`
- `hopeCapsule`
- `teachingVideoRequest`

Rules:

- A key still set to `REPLACE_ME_GOOGLE_FORM_URL` **safely routes to the contact page** instead of a
  dead link. That is by design — don't "fix" it with an invented URL.
- A partner card's `form` value must match one of these keys, **or** the card must use `href` for a
  direct internal link instead.
- To change a link, replace only that key's value with the URL the maintainer supplies; preserve any
  encoded characters exactly. See `../workflows/update-form-link.md`.
