/* ============================================================
   ARCHIVE-UI.JS — renders the "Our Work Through the Years"
   archive on the GYCO page from js/archive.js (the data file).
   You should rarely need to edit this file — add or edit events
   in js/archive.js instead.

   What it builds inside [data-archive]:
     · Year tabs (newest year first, derived from the data)
     · A paginated grid of event cards (6 per page)
     · A count line ("Showing 1–6 of 7")
     · Click a card → an in-place detail view with the full
       description, photo gallery, video link, and article link,
       plus a Back button that returns to the same year + page.
   Requires js/site.js to be loaded first (shares its helpers).
   ============================================================ */

(function renderArchive() {
  const mount = document.querySelector('[data-archive]');
  if (!mount || typeof GYCO_ARCHIVE === 'undefined' || !GYCO_ARCHIVE.length) return;

  const PER_PAGE = 6;
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  /* Escape user-editable text so a stray "<" in a title or
     description can never break the page. */
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  /* "2026-07-29" → { year: 2026, label: "July 29, 2026" }.
     Day 01 is treated as "month only" → "July 2026".
     An entry's `dateLabel` overrides the
     displayed label; `date` still drives sorting and year tabs. */
  const parseDate = (iso) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return { year: 0, label: iso || '' };
    const year = +m[1], month = MONTHS[+m[2] - 1] || '', day = +m[3];
    return { year, label: day > 1 ? `${month} ${day}, ${year}` : `${month} ${year}` };
  };
  /* dateLabel: undefined → show the real date; "text" → show that
     text; "" (empty) → show no date at all. */
  const dateText = (e) => (e.dateLabel !== undefined && e.dateLabel !== null) ? e.dateLabel : e._d.label;

  /* Normalize + sort newest first; group by year. */
  const events = GYCO_ARCHIVE
    .map((e, i) => ({ ...e, _id: i, _d: parseDate(e.date) }))
    .filter(e => e._d.year && e.title)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (!events.length) return;

  const years = [...new Set(events.map(e => e._d.year))].sort((a, b) => b - a);
  const byYear = (y) => events.filter(e => e._d.year === y);

  const state = { year: years[0], page: 1 };

  const cardMedia = (e) => {
    const img = (e.images || [])[0];
    if (img && img.src) {
      return `<span class="archive-card__media"><img src="${esc(img.src)}" alt="${esc(img.alt || e.title)}" loading="lazy"
        onerror="this.parentElement.classList.add('archive-card__media--empty');this.remove();"></span>`;
    }
    return `<span class="archive-card__media archive-card__media--empty">Photos to add</span>`;
  };

  const metaLine = (e) => [e.partner, e.location].filter(Boolean).map(esc).join(' · ');

  const renderList = () => {
    const list = byYear(state.year);
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    state.page = Math.min(Math.max(1, state.page), pages);
    const start = (state.page - 1) * PER_PAGE;
    const slice = list.slice(start, start + PER_PAGE);

    /* Year tabs only appear once the data spans more than one year. */
    const tabs = years.length > 1 ? years.map(y => `
      <button type="button" class="archive-year" data-year="${y}"
              aria-pressed="${y === state.year}">${y}</button>`).join('') : '';

    const cards = slice.map(e => `
      <button type="button" class="archive-card" data-event="${e._id}"
              aria-label="${esc(e.title)} — open details">
        ${cardMedia(e)}
        <span class="archive-card__body">
          ${[dateText(e), e.category].filter(Boolean).length
            ? `<span class="archive-card__date">${[dateText(e), e.category].filter(Boolean).map(esc).join(' · ')}</span>` : ''}
          <span class="archive-card__title">${esc(e.title)}</span>
          ${metaLine(e) ? `<span class="archive-card__meta">${metaLine(e)}</span>` : ''}
        </span>
      </button>`).join('');

    const pager = pages > 1 ? `
      <div class="archive-pager">
        <button type="button" class="btn btn--ink btn--sm" data-page-prev ${state.page === 1 ? 'disabled aria-disabled="true"' : ''}>← Previous</button>
        <span class="archive-pager__status">Page ${state.page} of ${pages}</span>
        <button type="button" class="btn btn--ink btn--sm" data-page-next ${state.page === pages ? 'disabled aria-disabled="true"' : ''}>Next →</button>
      </div>` : '';

    mount.innerHTML = `
      ${tabs ? `<div class="archive-years" role="group" aria-label="Filter by year">${tabs}</div>` : ''}
      <p class="archive-count" aria-live="polite">Showing ${list.length ? start + 1 : 0}–${start + slice.length} of ${list.length}</p>
      <div class="archive-grid">${cards}</div>
      ${pager}`;

    mount.querySelectorAll('.archive-year').forEach(b =>
      b.addEventListener('click', () => { state.year = +b.dataset.year; state.page = 1; renderList(); }));
    const prev = mount.querySelector('[data-page-prev]');
    const next = mount.querySelector('[data-page-next]');
    if (prev) prev.addEventListener('click', () => { state.page--; renderList(); });
    if (next) next.addEventListener('click', () => { state.page++; renderList(); });
    mount.querySelectorAll('.archive-card').forEach(c =>
      c.addEventListener('click', () => renderDetail(+c.dataset.event)));
  };

  const renderDetail = (id) => {
    const e = events.find(ev => ev._id === id);
    if (!e) return;

    const gallery = (e.images && e.images.length)
      ? e.images.map(img => `
          <figure class="photo-figure">
            <img src="${esc(img.src)}" alt="${esc(img.alt || e.title)}" loading="lazy">
            ${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ''}
          </figure>`).join('')
      : `<figure class="photo-placeholder">
           <small>Photos to add</small>
           <p>Photos from this event haven't been added yet. They will appear here once they are.</p>
         </figure>`;

    const links = [
      e.videoUrl ? `<a class="btn btn--ink btn--sm" href="${safeUrl(e.videoUrl)}" target="_blank" rel="noopener">Watch the video</a>` : '',
      e.link && e.link.href ? `<a class="btn btn--ink btn--sm" href="${safeUrl(e.link.href)}" target="_blank" rel="noopener">${esc(e.link.label || 'Read more')}</a>` : '',
    ].filter(Boolean).join('');

    const meta = [dateText(e), e.partner, e.location, e.category, e.participants]
      .filter(Boolean).map(esc).join(' · ');

    mount.innerHTML = `
      <div class="archive-detail">
        <p class="archive-detail__back"><button type="button" class="btn btn--ink btn--sm" data-archive-back>← Back to all events</button></p>
        <h3 tabindex="-1">${esc(e.title)}</h3>
        <p class="archive-detail__meta">${meta}</p>
        ${e.description ? `<p class="archive-detail__desc">${esc(e.description)}</p>` : ''}
        <div class="archive-detail__gallery">${gallery}</div>
        ${links ? `<div class="archive-detail__links">${links}</div>` : ''}
      </div>`;

    mount.querySelector('[data-archive-back]').addEventListener('click', () => {
      renderList();
      const tab = mount.querySelector('.archive-year[aria-pressed="true"]');
      if (tab) tab.focus();
    });
    const h = mount.querySelector('.archive-detail h3');
    if (h) h.focus();
  };

  renderList();
})();
