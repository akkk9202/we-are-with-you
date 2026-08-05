/* ============================================================
   PORTAL PAGES — one renderer per Community Portal page.
   The page is chosen by <body data-portal-page="…">; community
   pages add data-community-slug="…". All rendering happens in
   #portal-root. Data access is governed by RLS server-side.
   ============================================================ */
/* global Portal, PortalVideo, PARTNERS */

(() => {
  "use strict";
  const { sb, cfg, esc, fmtDate, fmtDateTime } = Portal;
  const root = () => document.getElementById("portal-root");
  const qs = new URLSearchParams(window.location.search);

  /* ─────────────────────────────────────────────────────────
     AUTH PAGES
     ───────────────────────────────────────────────────────── */

  async function pageIntro() {
    const s = await Portal.session();
    if (s) { Portal.nav("home.html", { replace: true }); return; }
    const el = root();
    el.innerHTML = `
      <section class="pintro">
        <div class="eyebrow">WE ARE WITH YOU · Community Portal</div>
        <h1>A place made for you</h1>
        <div class="page-hero__kicker">${esc(cfg.slogan)}</div>
        <p class="pintro__lead">The Community Portal is where patients, families, students, seniors,
          volunteers, and community members can watch videos, read letters and messages, write and
          request letters, ask for songs, and take part in simple activities — created by GYCO
          students for the people of six partner communities.</p>
        <div class="btn-row" style="justify-content:flex-start;margin-top:1.6rem;">
          <a class="btn btn--gold" href="login.html">Log In</a>
          <a class="btn btn--ink" href="signup.html">Sign Up — it's free</a>
        </div>
      </section>
      <section class="psection">
        <div class="eyebrow">What you can do here</div>
        <div class="cards cards--3" style="margin-top:1rem;">
          <div class="card"><span class="card__tag">Watch</span><h3>Videos & music</h3><p>Performances, teaching videos, and songs shared by student musicians — with your progress saved so you can continue anytime.</p></div>
          <div class="card"><span class="card__tag">Read & write</span><h3>Letters & messages</h3><p>Read encouraging letters, write your own, or request one for someone who needs it today.</p></div>
          <div class="card"><span class="card__tag">Participate</span><h3>Songs & activities</h3><p>Request a meaningful song or try a simple rhythm, breathing, or memory activity — wherever you are.</p></div>
        </div>
      </section>
      <section class="psection" data-public-teaser hidden>
        <div class="eyebrow">A message for you</div>
        <div class="cards cards--3" style="margin-top:1rem;" data-teaser-cards></div>
      </section>
      <section class="psection">
        <div class="eyebrow">Six communities, one circle</div>
        <p style="color:var(--muted);max-width:62ch;">The portal serves ${cfg.communities.map((c) => esc(c.name)).join(" · ")} — and every member can visit every community.</p>
      </section>`;
    /* content deliberately approved for public viewing shows even when logged out */
    try {
      const { data } = await sb.from("content")
        .select("id,title,description,content_type,video_url,image_url,published_at,created_at,is_featured")
        .eq("is_published", true).eq("is_public", true)
        .order("published_at", { ascending: false }).limit(3);
      if (data && data.length) {
        el.querySelector("[data-public-teaser]").hidden = false;
        el.querySelector("[data-teaser-cards]").innerHTML = data.map((c) => Portal.contentCard(c)).join("");
      }
    } catch { /* teaser is optional */ }
  }

  async function pageLogin() {
    const s = await Portal.session();
    const next = Portal.safeNext(qs.get("next"));
    if (s) { Portal.nav(next || "home.html", { replace: true }); return; }
    const el = root();
    el.innerHTML = `
      <section class="pauth-card">
        <div class="eyebrow">Community Portal</div>
        <h1 class="pauth-card__title">Welcome back</h1>
        <p class="pauth-card__kicker">${esc(cfg.slogan)}</p>
        ${qs.get("verified") ? `<div class="pnotice pnotice--good" role="status">Your email is verified — you can log in now.</div>` : ""}
        ${qs.get("reset") ? `<div class="pnotice pnotice--good" role="status">Your password was updated — log in with your new password.</div>` : ""}
        <form novalidate data-login-form>
          <div class="pnotice pnotice--bad" data-form-errors hidden tabindex="-1"></div>
          <div class="pfield">
            <label for="login-email">Email address</label>
            <input class="pinput" id="login-email" name="email" type="email" autocomplete="email" required>
            <p class="perror" id="err-login-email" data-error-for="email"></p>
          </div>
          <div class="pfield">
            <label for="login-password">Password</label>
            <input class="pinput" id="login-password" name="password" type="password" autocomplete="current-password" required>
            <p class="perror" id="err-login-password" data-error-for="password"></p>
          </div>
          <button class="btn btn--gold" type="submit" style="width:100%;">Log In</button>
        </form>
        <p class="pauth-card__links">
          <a href="forgot-password.html">Forgot your password?</a>
          <span aria-hidden="true"> · </span>
          <a href="signup.html">New here? Create an account</a>
        </p>
      </section>`;
    Portal.bindForm(el.querySelector("[data-login-form]"), {
      validate: (v) => {
        const e = {};
        if (!Portal.vEmail(v.email)) e.email = "Please enter a valid email address.";
        if (!Portal.vRequired(v.password)) e.password = "Please enter your password.";
        return e;
      },
      submit: async (v) => {
        const { error } = await sb.auth.signInWithPassword({ email: String(v.email).trim(), password: v.password });
        if (error) throw error;
        const p = await Portal.profile(true);
        if (p && p.is_disabled) {
          await sb.auth.signOut();
          throw new Error("This account is currently disabled. Please contact the GYCO team if you believe this is a mistake.");
        }
        Portal.logEvent("logged_in", { communityId: p && p.primary_community_id });
        Portal.nav(next || "home.html");
        return { stay: true };
      },
    });
  }

  async function pageSignup() {
    const s = await Portal.session();
    if (s) { Portal.nav("home.html", { replace: true }); return; }
    const comms = await Portal.communities().catch(() => null);
    const el = root();
    if (!comms) { el.innerHTML = Portal.errorState(); return; }
    el.innerHTML = `
      <section class="pauth-card pauth-card--wide">
        <div class="eyebrow">Community Portal</div>
        <h1 class="pauth-card__title">Create your account</h1>
        <p class="pauth-card__kicker">${esc(cfg.slogan)}</p>
        <form novalidate data-signup-form>
          <div class="pnotice pnotice--bad" data-form-errors hidden tabindex="-1"></div>
          <div class="pfield">
            <label for="su-name">Full name</label>
            <input class="pinput" id="su-name" name="full_name" type="text" autocomplete="name" required>
            <p class="perror" id="err-su-name" data-error-for="full_name"></p>
            <p class="phint">Your name is never shown publicly without your explicit permission.</p>
          </div>
          <div class="pfield">
            <label for="su-email">Email address</label>
            <input class="pinput" id="su-email" name="email" type="email" autocomplete="email" required>
            <p class="perror" id="err-su-email" data-error-for="email"></p>
          </div>
          <div class="pfield-row">
            <div class="pfield">
              <label for="su-password">Password</label>
              <input class="pinput" id="su-password" name="password" type="password" autocomplete="new-password" required minlength="8">
              <p class="perror" id="err-su-password" data-error-for="password"></p>
              <p class="phint">At least 8 characters.</p>
            </div>
            <div class="pfield">
              <label for="su-password2">Confirm password</label>
              <input class="pinput" id="su-password2" name="password2" type="password" autocomplete="new-password" required>
              <p class="perror" id="err-su-password2" data-error-for="password2"></p>
            </div>
          </div>
          <div class="pfield">
            <label for="su-type">I am joining as…</label>
            <select class="pinput" id="su-type" name="account_type" required>
              <option value="">Choose one…</option>
              ${cfg.accountTypes.map((t) => `<option value="${t.value}">${esc(t.label)}</option>`).join("")}
            </select>
            <p class="perror" id="err-su-type" data-error-for="account_type"></p>
          </div>
          <div class="pfield">
            <label for="su-community">My primary community</label>
            <select class="pinput" id="su-community" name="primary_community_id" required>
              <option value="">Choose your community…</option>
              ${comms.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}
            </select>
            <p class="perror" id="err-su-community" data-error-for="primary_community_id"></p>
            <p class="phint">You can visit every community, and you can change this anytime in Profile Settings.</p>
          </div>
          <fieldset class="pconsent">
            <legend>Privacy & consent</legend>
            <ul class="pconsent__list">${cfg.consentSummary.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
            <label class="pcheck">
              <input type="checkbox" name="email_consent" value="yes">
              <span>Yes, you may email me program updates. (Optional)</span>
            </label>
            <label class="pcheck">
              <input type="checkbox" name="agree" value="yes" required>
              <span>I have read and agree to the privacy and consent statement above. (Required)</span>
            </label>
            <p class="perror" id="err-su-agree" data-error-for="agree"></p>
          </fieldset>
          <button class="btn btn--gold" type="submit" style="width:100%;">Create Account</button>
        </form>
        <p class="pauth-card__links"><a href="login.html">Already have an account? Log in</a></p>
      </section>`;
    Portal.bindForm(el.querySelector("[data-signup-form]"), {
      validate: (v) => {
        const e = {};
        if (!Portal.vRequired(v.full_name)) e.full_name = "Please enter your full name.";
        if (!Portal.vEmail(v.email)) e.email = "Please enter a valid email address.";
        if (!v.password || v.password.length < 8) e.password = "Your password needs at least 8 characters.";
        if (v.password !== v.password2) e.password2 = "The two passwords don't match.";
        if (!Portal.vRequired(v.account_type)) e.account_type = "Please choose an account type.";
        if (!Portal.vRequired(v.primary_community_id)) e.primary_community_id = "Please choose your primary community.";
        if (!v.agree) e.agree = "Please read and agree to the privacy and consent statement.";
        return e;
      },
      submit: async (v) => {
        const { data, error } = await sb.auth.signUp({
          email: String(v.email).trim(),
          password: v.password,
          options: {
            emailRedirectTo: Portal.absUrl("community/login.html?verified=1"),
            data: {
              full_name: String(v.full_name).trim(),
              account_type: v.account_type,
              primary_community_id: v.primary_community_id,
              email_consent: !!v.email_consent,
            },
          },
        });
        if (error) throw error;
        if (data.session) { Portal.nav("home.html"); return { stay: true }; }
        return null; // show success panel: verify email
      },
      successTitle: "Almost there — check your email",
      successText: "We sent a confirmation link to your email address. Open it to verify your account, then log in.",
      successActions: '<a class="btn btn--gold btn--sm" href="login.html">Go to Log In</a>',
    });
  }

  async function pageForgot() {
    const el = root();
    el.innerHTML = `
      <section class="pauth-card">
        <div class="eyebrow">Community Portal</div>
        <h1 class="pauth-card__title">Reset your password</h1>
        <p>Enter your email and we'll send you a link to choose a new password.</p>
        <form novalidate data-forgot-form>
          <div class="pnotice pnotice--bad" data-form-errors hidden tabindex="-1"></div>
          <div class="pfield">
            <label for="fp-email">Email address</label>
            <input class="pinput" id="fp-email" name="email" type="email" autocomplete="email" required>
            <p class="perror" id="err-fp-email" data-error-for="email"></p>
          </div>
          <button class="btn btn--gold" type="submit" style="width:100%;">Send reset link</button>
        </form>
        <p class="pauth-card__links"><a href="login.html">Back to Log In</a></p>
      </section>`;
    Portal.bindForm(el.querySelector("[data-forgot-form]"), {
      validate: (v) => (Portal.vEmail(v.email) ? {} : { email: "Please enter a valid email address." }),
      submit: async (v) => {
        await sb.auth.resetPasswordForEmail(String(v.email).trim(), {
          redirectTo: Portal.absUrl("community/reset-password.html"),
        });
        return null; // always show success — never reveal whether an email exists
      },
      successTitle: "Check your email",
      successText: "If an account exists for that address, a password reset link is on its way. The link expires after a short time.",
      successActions: '<a class="btn btn--gold btn--sm" href="login.html">Back to Log In</a>',
    });
  }

  async function pageReset() {
    const el = root();
    /* expired / invalid link errors arrive in the URL hash */
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (hash.get("error") || qs.get("error")) {
      el.innerHTML = `
        <section class="pauth-card" role="alert">
          <h1 class="pauth-card__title">This link has expired</h1>
          <p>Password reset links only work once and expire quickly. Please request a new one.</p>
          <div class="btn-row" style="margin-top:1.2rem;">
            <a class="btn btn--gold btn--sm" href="forgot-password.html">Request a new link</a>
          </div>
        </section>`;
      return;
    }
    const s = await Portal.session();
    if (!s) {
      el.innerHTML = `
        <section class="pauth-card" role="alert">
          <h1 class="pauth-card__title">Reset link not recognized</h1>
          <p>Please open the reset link from your email again, or request a new one.</p>
          <div class="btn-row" style="margin-top:1.2rem;">
            <a class="btn btn--gold btn--sm" href="forgot-password.html">Request a new link</a>
          </div>
        </section>`;
      return;
    }
    el.innerHTML = `
      <section class="pauth-card">
        <div class="eyebrow">Community Portal</div>
        <h1 class="pauth-card__title">Choose a new password</h1>
        <form novalidate data-reset-form>
          <div class="pnotice pnotice--bad" data-form-errors hidden tabindex="-1"></div>
          <div class="pfield">
            <label for="rp-password">New password</label>
            <input class="pinput" id="rp-password" name="password" type="password" autocomplete="new-password" required minlength="8">
            <p class="perror" id="err-rp-password" data-error-for="password"></p>
            <p class="phint">At least 8 characters.</p>
          </div>
          <div class="pfield">
            <label for="rp-password2">Confirm new password</label>
            <input class="pinput" id="rp-password2" name="password2" type="password" autocomplete="new-password" required>
            <p class="perror" id="err-rp-password2" data-error-for="password2"></p>
          </div>
          <button class="btn btn--gold" type="submit" style="width:100%;">Update password</button>
        </form>
      </section>`;
    Portal.bindForm(el.querySelector("[data-reset-form]"), {
      validate: (v) => {
        const e = {};
        if (!v.password || v.password.length < 8) e.password = "Your password needs at least 8 characters.";
        if (v.password !== v.password2) e.password2 = "The two passwords don't match.";
        return e;
      },
      submit: async (v) => {
        const { error } = await sb.auth.updateUser({ password: v.password });
        if (error) throw error;
        await sb.auth.signOut();
        Portal.nav("login.html?reset=1");
        return { stay: true };
      },
    });
  }

  /* ─────────────────────────────────────────────────────────
     PORTAL HOME — the five-option hub ("WE ARE WITH YOU · ONE
     MESSAGE FOR YOU"). Every signed-in entry point (log in,
     verified sign-up, password reset, and /community/ while
     authenticated) already lands on home.html, so this page is
     the portal's front door. The five cards are REAL links; a
     click records exactly one portal_option_selected event with
     the chosen option before navigating. The previous home
     sections now live on the destination pages: music + Continue
     Watching in the Melody Box, letters in With You, education in
     the Bloom Bank, and stories/updates in the Hope Capsule.
     ───────────────────────────────────────────────────────── */

  const sectionHtml = (title, cardsHtml) => cardsHtml ? `
    <section class="psection">
      <div class="psection__head"><h2>${esc(title)}</h2></div>
      <div class="cards cards--3 pcards">${cardsHtml}</div>
    </section>` : "";

  /* PortalOptionCard — one illustrated hub card. The whole card is a
     single link; the illustration is decorative (empty alt) because
     the visible title + description carry the meaning. */
  const hubOptionCard = (opt) => `
    <li class="hub-grid__item${opt.wide ? " hub-grid__item--wide" : ""}">
      <a class="hub-card" href="${esc(opt.href)}" data-option="${esc(opt.id)}">
        <span class="hub-card__art" aria-hidden="true">
          <img src="${esc(Portal.rootUrl(opt.art))}" alt="${esc(opt.artAlt || "")}" loading="lazy">
        </span>
        <span class="hub-card__body">
          <h3 class="hub-card__title">${esc(opt.title)}</h3>
          <span class="hub-card__desc">${esc(opt.description)}</span>
        </span>
      </a>
    </li>`;

  /* PortalWelcomeHeader */
  const hubHeader = () => `
    <header class="hub-head">
      <img class="hub-smiley" src="${esc(Portal.rootUrl(cfg.portalDecor.smiley))}" alt="" aria-hidden="true">
      <h1 class="hub-title">WE ARE WITH YOU</h1>
      <h2 class="hub-kicker">ONE MESSAGE FOR YOU</h2>
      <p class="hub-lead">There are many ways to share,<br>&ldquo;We Are With You.&rdquo;</p>
    </header>`;

  /* PortalFooterMessage */
  const hubFooterMessage = () => `
    <section class="hub-footer" aria-label="A message from GYCO">
      <p>Thank you for being part of our community.</p>
      <p>Wherever you are in your journey, we want you to know:</p>
      <p class="hub-footer__brand">WE ARE WITH YOU.</p>
      <p class="hub-footer__tag">Even Here, Even Now.</p>
      <img class="hub-footer__logo" src="${esc(Portal.rootUrl(cfg.portalDecor.gycoLogo))}"
           alt="GYCO — Greater Youth Collaborative Opus">
    </section>`;

  async function pageHome() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav("home");
    Portal.logEvent("portal_home_viewed", { communityId: p.primary_community_id, oncePerPage: true });

    const el = root();
    el.innerHTML = `
      <div class="hub">
        ${hubHeader()}
        <div class="hub-grid-wrap">
          <ul class="hub-grid" data-hub-grid>
            ${cfg.portalOptions.map(hubOptionCard).join("")}
          </ul>
          <img class="hub-flower hub-flower--left" src="${esc(Portal.rootUrl(cfg.portalDecor.flowersLeft))}" alt="" aria-hidden="true">
          <img class="hub-flower hub-flower--right" src="${esc(Portal.rootUrl(cfg.portalDecor.flowersRight))}" alt="" aria-hidden="true">
        </div>
        ${hubFooterMessage()}
      </div>`;

    /* Exactly one engagement event per card click, then navigate.
       Navigation waits for the insert (or 350 ms, whichever comes
       first) so the event isn't lost when the page unloads. */
    el.querySelector("[data-hub-grid]").addEventListener("click", (ev) => {
      const link = ev.target.closest("a.hub-card");
      if (!link) return;
      const record = () => Portal.logEvent("portal_option_selected", {
        communityId: p.primary_community_id,
        metadata: { option: link.dataset.option },
      });
      /* modified click (new tab / window): record, let the browser go */
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || (ev.button || 0) !== 0) { record(); return; }
      ev.preventDefault();
      const href = link.getAttribute("href");
      const go = () => Portal.nav(href);
      Promise.race([record(), new Promise((r) => setTimeout(r, 350))]).then(go, go);
    });
  }

  /* ─────────────────────────────────────────────────────────
     COMMUNITY PAGES (Phase 6) — one renderer, six stubs
     ───────────────────────────────────────────────────────── */

  async function pageCommunity() {
    const slug = document.body.dataset.communitySlug;
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav(slug);
    const el = root();
    el.innerHTML = Portal.skeleton(4);

    let comm;
    try { comm = await Portal.communityBySlug(slug); }
    catch (e) { el.innerHTML = Portal.errorState(Portal.friendlyError(e)); return; }
    if (!comm) {
      el.innerHTML = Portal.emptyState("This community isn't available right now",
        "It may be temporarily inactive. Please check back soon.",
        `<a class="btn btn--gold btn--sm" href="home.html">Back to portal home</a>`);
      return;
    }

    Portal.logEvent("community_page_visited", { communityId: comm.id, oncePerPage: true });

    let content = [], activities = [], completedSubs = [], progressRows = [], sharedLetters = [];
    try {
      [content, activities, completedSubs, progressRows, sharedLetters] = await Promise.all([
        Portal.fetchContent({ communityId: comm.id, limit: 60 }),
        sb.from("activity_communities")
          .select("activity_definitions!inner(id,name,slug,description,activity_type,is_active)")
          .eq("community_id", comm.id)
          .then(({ data, error }) => {
            if (error) throw error;
            return (data || []).map((r) => r.activity_definitions).filter((a) => a && a.is_active);
          }),
        sb.from("activity_submissions").select("id,activity_id,status,completed_at,created_at")
          .eq("user_id", p.id).eq("community_id", comm.id).order("created_at", { ascending: false }).limit(10)
          .then(({ data, error }) => { if (error) throw error; return data || []; }),
        sb.from("video_progress").select("content_id,progress_seconds,completion_percentage,completed")
          .eq("user_id", p.id).limit(50)
          .then(({ data, error }) => { if (error) throw error; return data || []; }),
        /* letters shared with the community — only with the author's explicit
           permission, and ALWAYS shown without the author's name */
        sb.from("letters").select("id,title,body,recipient_type,reviewed_at,created_at")
          .eq("is_public", true).eq("community_id", comm.id)
          .order("created_at", { ascending: false }).limit(6)
          .then(({ data, error }) => { if (error) throw error; return data || []; })
          .catch(() => []),
      ]);
    } catch (e) {
      el.innerHTML = Portal.errorState(Portal.friendlyError(e));
      return;
    }

    const progressByContent = Object.fromEntries(progressRows.map((r) => [r.content_id, r]));
    const card = (c) => Portal.contentCard(c, { progress: progressByContent[c.id] });
    const byType = (...types) => content.filter((c) => types.includes(c.content_type));

    /* current programs come from the site's partner data (one source of truth) */
    const legacySlug = Object.keys(cfg.legacyPartnerMap).find((k) => cfg.legacyPartnerMap[k] === slug);
    const partner = (typeof PARTNERS !== "undefined" && legacySlug) ? PARTNERS[legacySlug] : null;
    const programsHtml = partner ? `
      <section class="psection">
        <div class="psection__head"><h2>Current Programs</h2>
          <a class="psection__more" href="${esc(Portal.rootUrl("partner.html?p=" + legacySlug))}">About this community →</a></div>
        <div class="cards cards--3 pcards">
          ${partner.cards.slice(0, 6).map((c) => `
            <article class="card pcard"><span class="card__tag">Program</span>
              <h3 class="pcard__title">${esc(c.title)}</h3><p class="pcard__desc">${esc(c.text)}</p>
            </article>`).join("")}
        </div>
      </section>` : "";

    const isPrimary = p.primary_community_id === comm.id;
    const activityById = Object.fromEntries(activities.map((a) => [a.id, a]));
    const completedHtml = completedSubs.filter((s) => s.status === "completed").length ? `
      <section class="psection">
        <div class="psection__head"><h2>Activities You've Completed Here</h2></div>
        <ul class="pactivity-list">
          ${completedSubs.filter((s) => s.status === "completed").map((s) => `
            <li><span>${esc((activityById[s.activity_id] || {}).name || "Activity")}</span>
                <time>${esc(fmtDate(s.completed_at))}</time></li>`).join("")}
        </ul>
      </section>` : "";

    el.innerHTML = `
      <section class="pcommunity-hero">
        ${comm.image_url ? `<span class="logo-chip logo-chip--portal"><img src="${esc(comm.image_url.startsWith("http") ? comm.image_url : Portal.rootUrl(comm.image_url))}" alt="${esc(comm.name)} logo"
            onerror="this.parentElement.remove()"></span>` : ""}
        <div class="eyebrow">Community Portal${isPrimary ? " · Your community" : ""}</div>
        <h1>${esc(comm.name)}</h1>
        <div class="page-hero__kicker">${esc(cfg.slogan)}</div>
        <p class="pintro__lead">${esc(comm.description || "")}</p>
        <div class="btn-row" style="justify-content:flex-start;margin-top:1.4rem;">
          <a class="btn btn--gold btn--sm" href="write-letter.html">Write a letter</a>
          <a class="btn btn--ink btn--sm" href="request-song.html">Request a song</a>
          <a class="btn btn--ink btn--sm" href="request-video.html">Request a video</a>
        </div>
      </section>
      ${programsHtml}
      ${sectionHtml("Latest Videos", byType("performance_video", "teaching_video", "song_performance").slice(0, 6).map(card).join(""))}
      ${sectionHtml("Letters & Encouraging Messages", byType("letter", "encouraging_message").slice(0, 6).map(card).join(""))}
      ${sharedLetters.length ? `
        <section class="psection">
          <div class="psection__head"><h2>Letters Shared by This Community</h2></div>
          <div class="cards cards--3 pcards">
            ${sharedLetters.map((l) => `
              <article class="card pcard"><span class="card__tag">Community letter</span>
                <h3 class="pcard__title">${esc(l.title)}</h3>
                <p class="pcard__desc">${esc(String(l.body || "").slice(0, 180))}${(l.body || "").length > 180 ? "…" : ""}</p>
                <p class="pcard__date">From a community member · ${esc(fmtDate(l.reviewed_at || l.created_at))}</p>
              </article>`).join("")}
          </div>
        </section>` : ""}
      ${activities.length ? `
        <section class="psection">
          <div class="psection__head"><h2>Available Activities</h2></div>
          <div class="cards cards--3 pcards">
            ${activities.map((a) => `
              <article class="card pcard"><span class="card__tag">Activity</span>
                <h3 class="pcard__title"><a href="participate.html?a=${esc(a.slug)}">${esc(a.name)}</a></h3>
                <p class="pcard__desc">${esc(a.description || "")}</p>
                <a class="btn btn--ink btn--sm" href="participate.html?a=${esc(a.slug)}" aria-label="Participate: ${esc(a.name)}">Participate</a>
              </article>`).join("")}
          </div>
        </section>` : ""}
      ${sectionHtml("Community Announcements", byType("community_update", "program_announcement").slice(0, 6).map(card).join(""))}
      ${sectionHtml("Upcoming Events", byType("event").slice(0, 6).map(card).join(""))}
      ${sectionHtml("Community Stories", byType("community_story").slice(0, 3).map(card).join(""))}
      ${completedHtml}
      ${!content.length && !activities.length ? Portal.emptyState(
        "This community's page is just getting started",
        "Videos, letters, and activities for " + comm.name + " will appear here soon. You can still write a letter or request a song today.",
        `<a class="btn btn--gold btn--sm" href="write-letter.html">Write a letter</a>`) : ""}`;
  }

  /* ─────────────────────────────────────────────────────────
     CONTENT DETAIL (+ video tracking)
     ───────────────────────────────────────────────────────── */

  async function pageContent() {
    const id = qs.get("id");
    const el = root();
    const s = await Portal.session();

    if (!/^[0-9a-f-]{36}$/i.test(id || "")) {
      el.innerHTML = Portal.emptyState("Content not found", "This link doesn't match anything in the portal.",
        `<a class="btn btn--gold btn--sm" href="home.html">Back to portal home</a>`);
      return;
    }

    let row = null, error = null;
    ({ data: row, error } = await sb.from("content")
      .select("id,title,description,content_type,video_url,image_url,body,language,published_at,created_at,is_featured,is_public,content_communities(community_id)")
      .eq("id", id).maybeSingle());

    if (!row) {
      if (!s) {  // may exist but require login (RLS hides it)
        Portal.nav("login.html?next=" + encodeURIComponent("content.html?id=" + id), { replace: true });
        return;
      }
      el.innerHTML = error ? Portal.errorState(Portal.friendlyError(error))
        : Portal.emptyState("Content not found",
          "This item may have been unpublished or removed.",
          `<a class="btn btn--gold btn--sm" href="home.html">Back to portal home</a>`);
      return;
    }

    let p = null;
    if (s) {
      p = await Portal.requireAuth();
      if (!p) return;
      Portal.buildPortalNav(null);
    }

    const meta = cfg.contentTypes[row.content_type] || { label: row.content_type };
    const comms = await Portal.communities().catch(() => []);
    const commNames = (row.content_communities || [])
      .map((cc) => (comms.find((c) => c.id === cc.community_id) || {}).name).filter(Boolean);

    const isVideo = Portal.isVideoContent(row);
    Portal.logEvent("content_opened", { contentId: row.id, oncePerPage: true });
    if (isVideo) Portal.logEvent("video_opened", { contentId: row.id, oncePerPage: true });
    if (["letter", "encouraging_message"].includes(row.content_type)) {
      Portal.logEvent("letter_opened", { contentId: row.id, oncePerPage: true });
    }

    let progress = null;
    if (p && isVideo) {
      const { data } = await sb.from("video_progress")
        .select("progress_seconds,total_seconds,completion_percentage,completed")
        .eq("user_id", p.id).eq("content_id", row.id).maybeSingle();
      progress = data;
    }

    el.innerHTML = `
      <article class="pcontent">
        <div class="pcontent__meta">
          <span class="card__tag">${esc(meta.label)}</span>
          ${row.is_featured ? '<span class="pbadge pbadge--gold">Featured</span>' : ""}
          ${row.language ? `<span class="pbadge pbadge--muted">${esc(row.language)}</span>` : ""}
        </div>
        <h1>${esc(row.title)}</h1>
        <p class="pcontent__date">${esc(fmtDate(row.published_at || row.created_at))}${
          commNames.length ? " · " + commNames.map(esc).join(" · ") : ""}</p>
        ${isVideo ? `<div class="pvideo" data-video-holder>
            <div class="pvideo__loading">Loading video…</div></div>
          ${progress && !progress.completed && progress.progress_seconds > 20
            ? `<p class="phint" role="status">Resuming from where you left off.</p>` : ""}
          ${progress && progress.completed ? `<p class="phint" role="status">✓ You've completed this video.</p>` : ""}`
        : ""}
        ${row.image_url && !isVideo ? `<img class="pcontent__image" src="${esc(row.image_url.startsWith("http") ? row.image_url : Portal.rootUrl(row.image_url))}" alt="">` : ""}
        ${row.description ? `<p class="pintro__lead">${esc(row.description)}</p>` : ""}
        ${row.body ? `<div class="pcontent__body">${esc(row.body).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>").replace(/^/, "<p>") + "</p>"}</div>` : ""}
        <div class="btn-row" style="justify-content:flex-start;margin-top:2rem;">
          <a class="btn btn--ink btn--sm" href="${s ? "home.html" : "index.html"}">← Back to the portal</a>
        </div>
      </article>`;

    if (isVideo && p) {
      const holder = el.querySelector("[data-video-holder]");
      try { await PortalVideo.mount(holder, row, progress); }
      catch { holder.innerHTML = `<p class="pnotice pnotice--bad">The video player couldn't load. <a href="${esc(row.video_url)}" target="_blank" rel="noopener">Open the video directly</a>.</p>`; }
    } else if (isVideo && !p) {
      const holder = el.querySelector("[data-video-holder]");
      holder.innerHTML = `<div class="pempty"><h3>Log in to watch</h3>
        <p>Create a free account to watch videos and save your progress.</p>
        <a class="btn btn--gold btn--sm" href="login.html?next=${encodeURIComponent("content.html?id=" + row.id)}">Log In</a></div>`;
    }
  }

  /* ─────────────────────────────────────────────────────────
     dispatch
     ───────────────────────────────────────────────────────── */
  const page = document.body.dataset.portalPage;
  const routes = {
    intro: pageIntro, login: pageLogin, signup: pageSignup,
    forgot: pageForgot, reset: pageReset,
    home: pageHome, community: pageCommunity, content: pageContent,
  };
  /* remaining pages (activity, profile, forms, participate, submission)
     are registered by portal-pages2.js */
  window.PortalRoutes = routes;
  window.PortalShared = { sectionHtml };
  if (routes[page]) {
    routes[page]().catch((e) => {
      const el = root();
      if (el) el.innerHTML = Portal.errorState(Portal.friendlyError(e));
    });
  }
})();
