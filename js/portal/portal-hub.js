/* ============================================================
   PORTAL HUB PAGES — the destinations behind the five-option
   portal landing page (community/home.html):
     · with-you.html     — write / request / read letters & messages
     · melody-box.html   — published music & performance videos
     · bloom-bank.html   — educational content, resources, guides
     · hope-capsule.html — approved stories, updates, public letters
   (Wish Pocket links straight to the existing request-song.html.)
   These pages REUSE the existing engine end-to-end: requireAuth,
   the portal nav, fetchContent (published content only), the
   shared content card, video-progress data, and the letters RLS
   policies (public letters are only readable once approved, and
   are ALWAYS rendered without the author's name). No new data
   systems, tables, or forms are introduced here.
   ============================================================ */
/* global Portal */

(() => {
  "use strict";
  const { sb, cfg, esc, fmtDate } = Portal;
  const root = () => document.getElementById("portal-root");
  const sectionHtml = (window.PortalShared || {}).sectionHtml || (() => "");

  const optionById = (id) => (cfg.portalOptions || []).find((o) => o.id === id) || {};

  /* shared page header for hub destination pages */
  const hubPageHead = (opt, extraHtml = "") => `
    <p class="hub-back"><a href="home.html">&larr; Back to the portal</a></p>
    <header class="hub-page-head">
      <img class="hub-page-head__art" src="${esc(Portal.rootUrl(opt.art))}" alt="" aria-hidden="true">
      <div>
        <h1 class="hub-page-head__title">${esc(opt.title)}</h1>
        <p class="hub-page-head__lead">${esc(opt.description)}</p>
        ${extraHtml}
      </div>
    </header>`;

  /* Approved public letters are always anonymous — never a name,
     never an email address. */
  const publicLetterCard = (l) => `
    <article class="card pcard"><span class="card__tag">Community letter</span>
      <h3 class="pcard__title">${esc(l.title)}</h3>
      <p class="pcard__desc">${esc(String(l.body || "").slice(0, 180))}${(l.body || "").length > 180 ? "…" : ""}</p>
      <p class="pcard__date">From a community member · ${esc(fmtDate(l.reviewed_at || l.created_at))}</p>
    </article>`;

  const fetchPublicLetters = (limit) =>
    sb.from("letters")
      .select("id,title,body,recipient_type,reviewed_at,created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false }).limit(limit)
      .then(({ data, error }) => { if (error) throw error; return data || []; })
      .catch(() => []);

  /* ─────────────────────────────────────────────────────────
     WITH YOU — letters & encouraging messages
     ───────────────────────────────────────────────────────── */
  async function pageWithYou() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav(null);
    const el = root();
    el.innerHTML = Portal.skeleton(3);

    let content = [], publicLetters = [];
    try {
      [content, publicLetters] = await Promise.all([
        Portal.fetchContent({ limit: 60 }),
        fetchPublicLetters(9),
      ]);
    } catch (e) { el.innerHTML = Portal.errorState(Portal.friendlyError(e)); return; }

    const letters = content.filter((c) => ["letter", "encouraging_message"].includes(c.content_type));

    el.innerHTML = `
      ${hubPageHead(optionById("with_you"))}
      <section class="psection">
        <ul class="hub-quick">
          <li><a href="write-letter.html"><span class="hub-quick__title">Write a letter</span>
            <span class="hub-quick__desc">Letters are reviewed before they are shared.</span>
            <span class="hub-quick__go" aria-hidden="true">→</span></a></li>
          <li><a href="request-letter.html"><span class="hub-quick__title">Request a letter</span>
            <span class="hub-quick__desc">Ask for an encouraging letter for yourself or someone else.</span>
            <span class="hub-quick__go" aria-hidden="true">→</span></a></li>
          <li><a href="#read-letters"><span class="hub-quick__title">Read letters</span>
            <span class="hub-quick__desc">Letters and messages shared with the communities, below.</span>
            <span class="hub-quick__go" aria-hidden="true">→</span></a></li>
        </ul>
      </section>
      <div id="read-letters">
        ${sectionHtml("Letters & Encouraging Messages", letters.slice(0, 12).map((c) => Portal.contentCard(c)).join(""))}
        ${publicLetters.length ? `
          <section class="psection">
            <div class="psection__head"><h2>Letters Shared by Community Members</h2></div>
            <div class="cards cards--3 pcards">${publicLetters.map(publicLetterCard).join("")}</div>
          </section>` : ""}
        ${!letters.length && !publicLetters.length ? Portal.emptyState(
          "No letters yet",
          "Approved letters and messages will appear here — yours could be the first.",
          `<a class="btn btn--gold btn--sm" href="write-letter.html">Write a letter</a>`) : ""}
      </div>`;
  }

  /* ─────────────────────────────────────────────────────────
     MELODY BOX — music that brings comfort and joy
     ───────────────────────────────────────────────────────── */
  async function pageMelodyBox() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav(null);
    const el = root();
    el.innerHTML = Portal.skeleton(3);

    let content = [], progressRows = [];
    try {
      [content, progressRows] = await Promise.all([
        Portal.fetchContent({ limit: 80 }),
        sb.from("video_progress")
          .select("content_id,progress_seconds,total_seconds,completion_percentage,completed,last_watched_at")
          .eq("user_id", p.id).order("last_watched_at", { ascending: false }).limit(12)
          .then(({ data, error }) => { if (error) throw error; return data || []; }),
      ]);
    } catch (e) { el.innerHTML = Portal.errorState(Portal.friendlyError(e)); return; }

    const progressByContent = Object.fromEntries(progressRows.map((r) => [r.content_id, r]));
    const card = (c) => Portal.contentCard(c, { progress: progressByContent[c.id] });
    const byType = (...types) => content.filter((c) => types.includes(c.content_type));

    const music = byType("song_performance", "performance_video");
    const continueWatching = progressRows
      .filter((r) => !r.completed && Number(r.progress_seconds) > 20)
      .map((r) => content.find((c) => c.id === r.content_id))
      .filter(Boolean).slice(0, 3);

    el.innerHTML = `
      ${hubPageHead(optionById("melody_box"), `
        <p class="hub-page-head__note">Want to request or dedicate a special song? Open the
          <a href="request-song.html">Wish Pocket</a>.</p>`)}
      ${continueWatching.length ? sectionHtml("Continue Watching", continueWatching.map(card).join("")) : ""}
      ${sectionHtml("Song Performances", byType("song_performance").slice(0, 9).map(card).join(""))}
      ${sectionHtml("Musical & Performance Videos", byType("performance_video").slice(0, 9).map(card).join(""))}
      ${!music.length ? Portal.emptyState(
        "No music yet",
        "Music and performance videos will appear here as GYCO students share them.",
        `<a class="btn btn--gold btn--sm" href="request-song.html">Request a song</a>`) : ""}`;
  }

  /* ─────────────────────────────────────────────────────────
     BLOOM BANK — trusted health tips & helpful resources
     ───────────────────────────────────────────────────────── */
  async function pageBloomBank() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav(null);
    const el = root();
    el.innerHTML = Portal.skeleton(3);

    let content = [], activities = [];
    try {
      [content, activities] = await Promise.all([
        Portal.fetchContent({ limit: 80 }),
        sb.from("activity_definitions").select("id,name,slug,description,activity_type,created_at")
          .eq("is_active", true).order("created_at", { ascending: false }).limit(9)
          .then(({ data, error }) => { if (error) throw error; return data || []; }),
      ]);
    } catch (e) { el.innerHTML = Portal.errorState(Portal.friendlyError(e)); return; }

    const byType = (...types) => content.filter((c) => types.includes(c.content_type));
    const card = (c) => Portal.contentCard(c);
    const education = byType("teaching_video", "educational_resource");

    el.innerHTML = `
      ${hubPageHead(optionById("bloom_bank"))}
      <div class="pnotice pnotice--info hub-disclaimer" role="note">${esc(cfg.healthDisclaimer)}</div>
      ${sectionHtml("Teaching Videos", byType("teaching_video").slice(0, 9).map(card).join(""))}
      ${sectionHtml("Educational Resources", byType("educational_resource").slice(0, 9).map(card).join(""))}
      ${activities.length ? `
        <section class="psection">
          <div class="psection__head"><h2>Activity Guides</h2></div>
          <div class="cards cards--3 pcards">
            ${activities.map((a) => `
              <article class="card pcard"><span class="card__tag">Activity</span>
                <h3 class="pcard__title"><a href="participate.html?a=${esc(a.slug)}">${esc(a.name)}</a></h3>
                <p class="pcard__desc">${esc(a.description || "")}</p>
                <a class="btn btn--ink btn--sm" href="participate.html?a=${esc(a.slug)}" aria-label="Participate: ${esc(a.name)}">Participate</a>
              </article>`).join("")}
          </div>
        </section>` : ""}
      ${!education.length && !activities.length ? Portal.emptyState(
        "No resources yet",
        "Teaching videos, resources, and activity guides will appear here as they are published.") : ""}`;
  }

  /* ─────────────────────────────────────────────────────────
     HOPE CAPSULE — stories shared from the heart
     ───────────────────────────────────────────────────────── */
  async function pageHopeCapsule() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav(null);
    const el = root();
    el.innerHTML = Portal.skeleton(3);

    let content = [], publicLetters = [];
    try {
      [content, publicLetters] = await Promise.all([
        Portal.fetchContent({ limit: 80 }),
        fetchPublicLetters(6),
      ]);
    } catch (e) { el.innerHTML = Portal.errorState(Portal.friendlyError(e)); return; }

    const byType = (...types) => content.filter((c) => types.includes(c.content_type));
    const card = (c) => Portal.contentCard(c);
    const featured = byType("community_story", "community_update", "encouraging_message").filter((c) => c.is_featured);
    const stories = byType("community_story").filter((c) => !c.is_featured);
    const updates = byType("community_update", "program_announcement", "event").filter((c) => !c.is_featured);

    el.innerHTML = `
      ${hubPageHead(optionById("hope_capsule"))}
      ${featured.length ? sectionHtml("Featured Stories", featured.slice(0, 3).map(card).join("")) : ""}
      ${sectionHtml("Community Stories", stories.slice(0, 9).map(card).join(""))}
      ${sectionHtml("Community Updates & Announcements", updates.slice(0, 9).map(card).join(""))}
      ${publicLetters.length ? `
        <section class="psection">
          <div class="psection__head"><h2>Letters Shared from the Heart</h2></div>
          <div class="cards cards--3 pcards">${publicLetters.map(publicLetterCard).join("")}</div>
        </section>` : ""}
      ${!featured.length && !stories.length && !updates.length && !publicLetters.length ? Portal.emptyState(
        "No stories yet",
        "Stories, updates, and shared letters will appear here as they are approved.") : ""}`;
  }

  /* ─────────────────────────────────────────────────────────
     ALL COMMUNITIES — compact chooser for the six community
     pages, now that the nav only pins the member's own.
     ───────────────────────────────────────────────────────── */
  async function pageCommunities() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav("communities");
    const el = root();
    el.innerHTML = Portal.skeleton(3);

    let comms;
    try { comms = await Portal.communities(); }
    catch (e) { el.innerHTML = Portal.errorState(Portal.friendlyError(e)); return; }

    const mine = (c) => c.id === p.primary_community_id;
    const ordered = [...comms].sort((a, b) => (mine(a) ? 0 : 1) - (mine(b) ? 0 : 1));

    /* directory rows want one-sentence descriptions */
    const firstSentence = (s) => {
      const t = String(s || "").trim();
      const m = t.match(/^[^.!?]{10,}?[.!?]/);
      return m ? m[0] : t;
    };

    el.innerHTML = `
      <p class="hub-back"><a href="home.html">&larr; Back to the portal</a></p>
      <header class="hub-page-head">
        <div>
          <h1 class="hub-page-head__title">Communities</h1>
          <p class="hub-page-head__lead">Every member can visit every community.</p>
        </div>
      </header>
      <ul class="pcomm-list">
        ${ordered.map((c) => `
          <li><a class="pcomm-row" href="${esc(c.slug)}.html">
            <span class="pcomm-row__logo" aria-hidden="true">
              ${c.image_url ? `<img src="${esc(c.image_url.startsWith("http") ? c.image_url : Portal.rootUrl(c.image_url))}" alt=""
                onerror="this.remove()">` : ""}
            </span>
            <span class="pcomm-row__body">
              <span class="pcomm-row__name">${esc(c.name)}</span>
              ${mine(c) ? '<span class="pcomm-row__mine">Your community</span>' : ""}
              <span class="pcomm-row__desc">${esc(firstSentence(c.description))}</span>
            </span>
            <span class="pcomm-row__go" aria-hidden="true">→</span>
          </a></li>`).join("")}
      </ul>
      <p class="phint" style="margin-top:1.2rem;">Want a different primary community? You can change it anytime in
        <a href="profile.html">Profile</a>.</p>`;
  }

  /* register + dispatch (same pattern as portal-pages2.js) */
  window.PortalRoutes = window.PortalRoutes || {};
  Object.assign(window.PortalRoutes, {
    "with-you": pageWithYou, "melody-box": pageMelodyBox,
    "bloom-bank": pageBloomBank, "hope-capsule": pageHopeCapsule,
    communities: pageCommunities,
  });
  const page = document.body.dataset.portalPage;
  if (["with-you", "melody-box", "bloom-bank", "hope-capsule", "communities"].includes(page)) {
    window.PortalRoutes[page]().catch((e) => {
      const el = root();
      if (el) el.innerHTML = Portal.errorState(Portal.friendlyError(e));
    });
  }
})();
