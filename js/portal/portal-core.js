/* ============================================================
   PORTAL CORE — shared engine for every Community Portal page.
   · Supabase client + auth/session helpers + route guards
   · Site nav (root-relative) + portal navigation + footer
   · Reusable UI: cards, badges, empty/loading/error states, toasts
   · Form framework: validation, double-submit guard, error summary
   · Engagement event logging
   All security is enforced by Supabase Row Level Security — this
   file only decides what to *show*, never what is *allowed*.
   ============================================================ */
/* global supabase, PORTAL_CONFIG, SITE */

const Portal = (() => {
  "use strict";

  const cfg = PORTAL_CONFIG;
  const sb = supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" },
  });

  /* ── tiny DOM + format helpers ── */
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const fmtDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch { return ""; }
  };
  const fmtDateTime = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    } catch { return ""; }
  };

  const rootUrl = (path) => cfg.root + (path || "");
  const absUrl = (sitePath) => new URL(cfg.root + sitePath, window.location.href).href;

  /* All programmatic navigation goes through here (tests can hook it
     via window.__portalNavigate; browsers just navigate normally). */
  const nav = (url, { replace } = {}) => {
    if (typeof window.__portalNavigate === "function") return window.__portalNavigate(url, !!replace);
    if (replace) window.location.replace(url);
    else window.location.href = url;
  };

  /* Only same-folder portal pages may be used as a post-login
     destination — never absolute/external URLs (no open redirects). */
  const safeNext = (raw) => {
    if (!raw) return null;
    return /^[a-z0-9-]+\.html(\?[a-zA-Z0-9=&_-]*)?$/.test(raw) ? raw : null;
  };

  /* ── communities cache (slug ↔ row) ── */
  let _communities = null;
  async function communities() {
    if (_communities) return _communities;
    const { data, error } = await sb.from("communities")
      .select("id,name,slug,description,image_url,display_order,is_active")
      .eq("is_active", true)
      .order("display_order");
    if (error) throw error;
    _communities = data || [];
    return _communities;
  }
  async function communityBySlug(slug) {
    return (await communities()).find((c) => c.slug === slug) || null;
  }

  /* ── session + profile ── */
  let _profile = null;
  async function session() {
    const { data } = await sb.auth.getSession();
    return data.session || null;
  }
  async function profile(force) {
    if (_profile && !force) return _profile;
    const s = await session();
    if (!s) return null;
    const { data, error } = await sb.from("profiles")
      .select("id,full_name,email,account_type,primary_community_id,role,email_consent,is_disabled,created_at")
      .eq("id", s.user.id).maybeSingle();
    if (error) throw error;
    _profile = data;
    return _profile;
  }
  const isAdmin = async () => ((await profile()) || {}).role === "admin";

  async function signOut() {
    try { await logEvent("logged_out"); } catch { /* best effort */ }
    await sb.auth.signOut();
    nav("index.html");
  }

  /* ── route guards ── */
  /* Send logged-out visitors to log in, remembering where they were
     going. Disabled accounts see a clear message and are signed out. */
  async function requireAuth() {
    const s = await session();
    if (!s) {
      const here = window.location.pathname.split("/").pop() + window.location.search;
      nav("login.html?next=" + encodeURIComponent(here), { replace: true });
      return null;
    }
    let p = null;
    try { p = await profile(); } catch { /* fall through to error state below */ }
    if (!p) {
      renderFatal("We couldn't load your account. Please refresh the page or try again shortly.");
      return null;
    }
    if (p.is_disabled) {
      renderFatal(
        "This account is currently disabled. If you believe this is a mistake, please contact " +
        "the GYCO team at " + esc((typeof SITE !== "undefined" && SITE.email) || "gyco23@gmail.com") + ".",
        "Account disabled");
      await sb.auth.signOut();
      return null;
    }
    return p;
  }

  async function requireAdmin() {
    const p = await requireAuth();
    if (!p) return null;
    if (p.role !== "admin") {
      renderFatal("This page is only available to administrators.", "Not authorized");
      return null;
    }
    return p;
  }

  /* ── engagement events ── */
  const _sessionLogged = new Set(); // dedupe per page-load for visit-type events
  async function logEvent(type, opts = {}) {
    const s = await session();
    if (!s) return;
    if (opts.oncePerPage) {
      const key = type + ":" + (opts.communityId || "") + ":" + (opts.contentId || "");
      if (_sessionLogged.has(key)) return;
      _sessionLogged.add(key);
    }
    const row = {
      user_id: s.user.id,
      event_type: type,
      community_id: opts.communityId || null,
      content_id: opts.contentId || null,
      submission_id: opts.submissionId || null,
      metadata: opts.metadata || {},
    };
    const { error } = await sb.from("activity_events").insert(row);
    if (error && window.console) console.warn("event not recorded:", error.message);
  }

  /* ── shared chrome: site nav, portal nav, footer ── */
  const ringMark = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <circle cx="12" cy="12" r="9" stroke="#C4A24E" stroke-width="1.6"/>
  <circle cx="12" cy="3" r="2" fill="#C4A24E"/>
</svg>`;

  function buildSiteNav() {
    const mount = document.getElementById("site-nav");
    if (!mount || typeof SITE === "undefined") return;
    const links = SITE.nav.map((item) => {
      const href = rootUrl(item.href);
      const isPortal = /community\//.test(item.href);
      const cls = [item.cta ? "btn btn--gold btn--sm nav__cta" : "", isPortal && !item.cta ? "active" : ""].join(" ").trim();
      return `<li><a href="${esc(href)}" ${cls ? `class="${cls}"` : ""}>${esc(item.label)}</a></li>`;
    }).join("");
    mount.outerHTML = `
  <nav class="nav" aria-label="Main navigation">
    <a href="${esc(rootUrl("index.html"))}" class="nav__logo">${ringMark(22)} ${esc(SITE.name)}</a>
    <button class="nav__hamburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav__links">${links}</ul>
  </nav>`;
    const nav = document.querySelector(".nav");
    const burger = nav.querySelector(".nav__hamburger");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  /* Portal navigation — kept minimal now that the five-option hub
     organizes the portal: Home · Communities (chooser for the six
     partner organizations; the member's own is listed first and
     badged there) · My Activity · Profile (+ Admin) · Log Out.
     Any community page highlights the Communities tab. */
  async function buildPortalNav(activeKey) {
    const mount = document.getElementById("portal-nav");
    if (!mount) return;
    const p = await profile().catch(() => null);
    const comms = await communities().catch(() => []);

    if (comms.some((c) => c.slug === activeKey)) activeKey = "communities";

    const items = [
      { key: "home", label: "Home", href: "home.html" },
      { key: "communities", label: "Communities", href: "communities.html" },
      { key: "activity", label: "My Activity", href: "activity.html" },
      { key: "profile", label: "Profile", href: "profile.html" },
    ];
    if (p && p.role === "admin") {
      items.push({ key: "admin", label: "Admin", href: cfg.root + "admin/community.html" });
    }

    mount.innerHTML = `
    <div class="portal-nav" role="navigation" aria-label="Community Portal">
      <div class="portal-nav__inner">
        <ul class="portal-nav__list">
          <li class="portal-nav__brand" aria-hidden="true">Community Portal</li>
          ${items.map((i) => `
            <li><a href="${esc(i.href)}"
                 class="portal-nav__link${i.key === activeKey ? " is-active" : ""}${i.primary ? " is-primary" : ""}"
                 ${i.key === activeKey ? 'aria-current="page"' : ""}
                 ${i.primary ? `aria-label="${esc(i.label)} (your community)"` : ""}>
                 ${i.primary ? '<span class="portal-nav__ring" aria-hidden="true">●</span>' : ""}${esc(i.label)}</a></li>`).join("")}
          <li><button type="button" class="portal-nav__link portal-nav__logout" data-portal-logout>Log Out</button></li>
        </ul>
      </div>
    </div>`;
    const btn = mount.querySelector("[data-portal-logout]");
    if (btn) btn.addEventListener("click", signOut);
    /* keep the active item visible on small screens */
    const act = mount.querySelector(".is-active");
    if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function buildFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount || typeof SITE === "undefined") return;
    mount.outerHTML = `
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__brand-name">${ringMark(20)} ${esc(SITE.name)}</div>
        <p>${esc(SITE.footerNote)}</p>
      </div>
      <div class="footer__col"><h4>Community Portal</h4><ul>
        <li><a href="${esc(rootUrl("community/home.html"))}">Portal Home</a></li>
        <li><a href="${esc(rootUrl("community/request-letter.html"))}">Request a Letter</a></li>
        <li><a href="${esc(rootUrl("community/activity.html"))}">My Activity</a></li>
        <li><a href="${esc(rootUrl("community/profile.html"))}">Profile</a></li>
      </ul></div>
      <div class="footer__col"><h4>About</h4><ul>
        <li><a href="${esc(rootUrl("student-community.html"))}">GYCO</a></li>
        <li><a href="${esc(rootUrl("media.html"))}">Media</a></li>
      </ul></div>
      <div class="footer__col"><h4>Connect</h4><ul>
        ${SITE.instagram ? `<li><a href="${esc(SITE.instagram)}" target="_blank" rel="noopener">Instagram</a></li>` : ""}
        <li><a href="${esc(rootUrl("contact.html"))}">Email us</a></li>
      </ul></div>
    </div>
    <div class="footer__bottom">
      <p>© ${new Date().getFullYear()} ${esc(SITE.org)}. All rights reserved.</p>
      <div class="footer__tagline">${esc(SITE.tagline)}</div>
    </div>
  </footer>`;
  }

  /* ── reusable UI pieces ── */
  const badge = (map, status) => {
    const meta = (map && map[status]) || { label: status, tone: "muted" };
    return `<span class="pbadge pbadge--${esc(meta.tone)}">${esc(meta.label)}</span>`;
  };

  const skeleton = (n = 3) =>
    `<div class="pskeleton" role="status" aria-label="Loading">${
      Array.from({ length: n }, () => '<div class="pskeleton__bar"></div>').join("")}</div>`;

  const emptyState = (title, text, actionsHtml = "") => `
    <div class="pempty">
      <div class="pempty__mark" aria-hidden="true">◦</div>
      <h3>${esc(title)}</h3>
      <p>${esc(text)}</p>
      ${actionsHtml}
    </div>`;

  const errorState = (text) => `
    <div class="pempty pempty--error" role="alert">
      <div class="pempty__mark" aria-hidden="true">!</div>
      <h3>Something didn't load</h3>
      <p>${esc(text || "Please check your connection and try again.")}</p>
      <button type="button" class="btn btn--ink btn--sm" onclick="window.location.reload()">Try again</button>
    </div>`;

  function renderFatal(message, title) {
    const root = document.getElementById("portal-root");
    if (!root) return;
    root.innerHTML = `
      <section class="pauth-card" role="alert">
        <h1 class="pauth-card__title">${esc(title || "Please sign in")}</h1>
        <p>${message}</p>
        <div class="btn-row" style="margin-top:1.2rem;">
          <a class="btn btn--gold btn--sm" href="index.html">Community Portal</a>
          <a class="btn btn--ink btn--sm" href="${esc(rootUrl("index.html"))}">Main website</a>
        </div>
      </section>`;
  }

  function toast(message) {
    let t = document.querySelector(".ptoast");
    if (!t) {
      t = document.createElement("div");
      t.className = "ptoast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.classList.add("is-visible");
    clearTimeout(t._hide);
    t._hide = setTimeout(() => t.classList.remove("is-visible"), 3600);
  }

  /* ── content helpers ── */
  const ytVideoId = (url) => {
    if (!url) return null;
    const m = String(url).match(
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,20})/);
    return m ? m[1] : null;
  };
  const isVideoContent = (c) => !!(c && c.video_url);

  const contentThumb = (c) => {
    if (c.image_url) return `<img src="${esc(c.image_url.startsWith("http") ? c.image_url : rootUrl(c.image_url))}" alt="" loading="lazy">`;
    const yt = ytVideoId(c.video_url);
    if (yt) return `<img src="https://i.ytimg.com/vi/${esc(yt)}/hqdefault.jpg" alt="" loading="lazy">`;
    return `<span class="pcard__thumb-fallback" aria-hidden="true">♪</span>`;
  };

  /* One reusable content card (Phase 5) */
  function contentCard(c, opts = {}) {
    const meta = cfg.contentTypes[c.content_type] || { label: c.content_type, action: "View" };
    const commNames = (c._communities || []).map((n) => esc(n)).join(" · ");
    const pct = opts.progress && !opts.progress.completed ? Math.round(opts.progress.completion_percentage) : null;
    return `
    <article class="card pcard">
      <a class="pcard__thumb" href="content.html?id=${esc(c.id)}" tabindex="-1" aria-hidden="true">${contentThumb(c)}</a>
      <div class="pcard__meta">
        <span class="card__tag">${esc(meta.label)}</span>
        ${c.is_featured ? '<span class="pbadge pbadge--gold">Featured</span>' : ""}
      </div>
      <h3 class="pcard__title"><a href="content.html?id=${esc(c.id)}">${esc(c.title)}</a></h3>
      ${commNames ? `<p class="pcard__communities">${commNames}</p>` : ""}
      ${c.description ? `<p class="pcard__desc">${esc(c.description)}</p>` : ""}
      <p class="pcard__date">${esc(fmtDate(c.published_at || c.created_at))}</p>
      ${pct != null ? `
        <div class="pprogress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Watched ${pct}%">
          <div class="pprogress__fill" style="width:${pct}%"></div>
        </div>` : ""}
      <a class="btn btn--ink btn--sm" href="content.html?id=${esc(c.id)}"
         aria-label="${esc(meta.action)}: ${esc(c.title)}">${esc(meta.action)}${pct != null ? " · Continue" : ""}</a>
    </article>`;
  }

  /* Fetch published content, with its communities, newest first. */
  async function fetchContent({ communityId, limit = 60 } = {}) {
    let q = sb.from("content")
      .select("id,title,description,content_type,video_url,image_url,body,language,published_at,created_at,is_featured,is_public,content_communities(community_id)")
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);
    const { data, error } = await q;
    if (error) throw error;
    let rows = data || [];
    if (communityId) {
      rows = rows.filter((c) => (c.content_communities || []).some((cc) => cc.community_id === communityId));
    }
    const comms = await communities().catch(() => []);
    const byId = Object.fromEntries(comms.map((c) => [c.id, c.name]));
    rows.forEach((c) => {
      c._communityIds = (c.content_communities || []).map((cc) => cc.community_id);
      c._communities = c._communityIds.map((id) => byId[id]).filter(Boolean);
    });
    return rows;
  }

  /* ── form framework ── */
  /* bindForm(form, { validate(values) -> {field: message}, submit(values) })
     Handles: disabled double-submit, field errors, error summary,
     loading state, success panel, preserved values on failure. */
  function bindForm(form, { validate, submit, successTitle, successText, successActions }) {
    const summary = form.querySelector("[data-form-errors]");
    const setFieldError = (name, msg) => {
      const field = form.querySelector(`[name="${name}"]`);
      const err = form.querySelector(`[data-error-for="${name}"]`);
      if (err) err.textContent = msg || "";
      if (field) {
        field.setAttribute("aria-invalid", msg ? "true" : "false");
        if (msg && err && err.id) field.setAttribute("aria-describedby", err.id);
      }
    };
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (form.dataset.busy === "1") return;   // duplicate-submission prevention
      const values = {};
      new FormData(form).forEach((v, k) => {
        values[k] = k in values ? [].concat(values[k], v) : v;
      });
      form.querySelectorAll("input[type=checkbox][name]").forEach((cb) => {
        if (cb.name && !(cb.name in values)) values[cb.name] = false;
        else if (values[cb.name] === "on" || values[cb.name] === cb.value) values[cb.name] = cb.checked;
      });

      [...form.querySelectorAll("[data-error-for]")].forEach((e) => (e.textContent = ""));
      if (summary) { summary.hidden = true; summary.innerHTML = ""; }

      const errors = (validate && validate(values)) || {};
      const keys = Object.keys(errors);
      if (keys.length) {
        keys.forEach((k) => setFieldError(k, errors[k]));
        if (summary) {
          summary.hidden = false;
          summary.innerHTML = `<strong>Please fix the following:</strong><ul>${
            keys.map((k) => `<li>${esc(errors[k])}</li>`).join("")}</ul>`;
          summary.focus && summary.focus();
        }
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      const btnLabel = btn ? btn.textContent : "";
      form.dataset.busy = "1";
      if (btn) { btn.disabled = true; btn.textContent = "Please wait…"; }
      try {
        const result = await submit(values, { setFieldError });
        if (result && result.stay) return;     // page handles its own success UI
        const panel = document.createElement("div");
        panel.className = "pauth-card psuccess";
        panel.setAttribute("role", "status");
        panel.innerHTML = `
          <div class="psuccess__mark" aria-hidden="true">✓</div>
          <h2>${esc(successTitle || "Done!")}</h2>
          <p>${esc(successText || "Your submission was received.")}</p>
          <div class="btn-row" style="margin-top:1.2rem;">${successActions ||
            '<a class="btn btn--gold btn--sm" href="home.html">Back to portal home</a>'}</div>`;
        form.replaceWith(panel);
        panel.scrollIntoView({ block: "center" });
      } catch (err) {
        if (summary) {
          summary.hidden = false;
          summary.innerHTML = `<strong>Something went wrong.</strong> ${esc(friendlyError(err))}`;
        } else {
          toast(friendlyError(err));
        }
      } finally {
        form.dataset.busy = "";
        if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
      }
    });
  }

  function friendlyError(err) {
    const msg = (err && (err.message || err.error_description)) || String(err);
    if (/invalid login credentials/i.test(msg)) return "That email and password combination didn't match. Please try again.";
    if (/email not confirmed/i.test(msg)) return "Please verify your email first — check your inbox for the confirmation link.";
    if (/already registered/i.test(msg)) return "An account with this email already exists. Try logging in instead.";
    if (/rate limit|too many/i.test(msg)) return "Too many attempts — please wait a moment and try again.";
    if (/network|fetch/i.test(msg)) return "We couldn't reach the server. Please check your connection and try again.";
    return msg;
  }

  /* validators */
  const vEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
  const vRequired = (v) => String(v || "").trim().length > 0;

  return {
    sb, cfg, esc, fmtDate, fmtDateTime, rootUrl, absUrl, safeNext, nav,
    communities, communityBySlug, session, profile, isAdmin, signOut,
    requireAuth, requireAdmin, logEvent,
    buildSiteNav, buildPortalNav, buildFooter,
    badge, skeleton, emptyState, errorState, renderFatal, toast,
    ytVideoId, isVideoContent, contentCard, fetchContent,
    bindForm, friendlyError, vEmail, vRequired,
  };
})();

/* build shared chrome immediately (scripts sit at the end of <body>) */
Portal.buildSiteNav();
Portal.buildFooter();
