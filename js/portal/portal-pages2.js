/* ============================================================
   PORTAL PAGES 2 — My Activity, submission details, Profile,
   letters, request forms, and activity participation.
   ============================================================ */
/* global Portal */

(() => {
  "use strict";
  const { sb, cfg, esc, fmtDate, fmtDateTime } = Portal;
  const root = () => document.getElementById("portal-root");
  const qs = new URLSearchParams(window.location.search);

  const EVENT_LABELS = {
    account_created: "Account created", logged_in: "Logged in", logged_out: "Logged out",
    community_selected: "Community selected", primary_community_changed: "Changed primary community",
    community_page_visited: "Visited a community page", content_opened: "Opened content",
    video_opened: "Opened a video", video_started: "Started a video",
    video_progress_25: "Watched 25% of a video", video_progress_50: "Watched 50% of a video",
    video_progress_75: "Watched 75% of a video", video_completed: "Completed a video",
    letter_opened: "Opened a letter", letter_draft_created: "Saved a letter draft",
    letter_written: "Wrote a letter", letter_submitted: "Submitted a letter for review",
    letter_requested: "Requested a letter", video_requested: "Requested a video",
    song_requested: "Requested a song", activity_started: "Started an activity",
    activity_completed: "Completed an activity", event_registration_submitted: "Registered for an event",
    feedback_submitted: "Sent feedback", profile_updated: "Updated profile",
    portal_home_viewed: "Opened the portal", portal_option_selected: "Chose a portal option",
  };
  const REQUEST_TYPE_LABELS = {
    letter: "Letter request", song: "Song request",
    teaching_video: "Teaching video request", musical_performance: "Musical performance request",
    encouragement_message: "Encouragement message request", rhythm_activity: "Rhythm activity request",
    breathing_activity: "Breathing activity request", storytelling_video: "Storytelling video request",
  };

  /* ─────────────────────────────────────────────────────────
     MY ACTIVITY (Phase 9)
     ───────────────────────────────────────────────────────── */

  async function pageActivity() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav("activity");
    const el = root();
    el.innerHTML = Portal.skeleton(4);

    let comms, events, letters, requests, subs, progress, activityDefs;
    try {
      [comms, events, letters, requests, subs, progress, activityDefs] = await Promise.all([
        Portal.communities(),
        sb.from("activity_events").select("id,event_type,community_id,content_id,submission_id,created_at")
          .eq("user_id", p.id).order("created_at", { ascending: false }).limit(200)
          .then(({ data, error }) => { if (error) throw error; return data || []; }),
        sb.from("letters").select("id,title,status,community_id,recipient_type,created_at,updated_at")
          .eq("user_id", p.id).order("created_at", { ascending: false })
          .then(({ data, error }) => { if (error) throw error; return data || []; }),
        sb.from("activity_requests").select("id,title,request_type,status,community_id,created_at,updated_at")
          .eq("user_id", p.id).order("created_at", { ascending: false })
          .then(({ data, error }) => { if (error) throw error; return data || []; }),
        sb.from("activity_submissions").select("id,activity_id,status,community_id,created_at,completed_at")
          .eq("user_id", p.id).order("created_at", { ascending: false })
          .then(({ data, error }) => { if (error) throw error; return data || []; }),
        sb.from("video_progress").select("content_id,progress_seconds,total_seconds,completion_percentage,completed,last_watched_at")
          .eq("user_id", p.id).order("last_watched_at", { ascending: false }).limit(50)
          .then(({ data, error }) => { if (error) throw error; return data || []; }),
        sb.from("activity_definitions").select("id,name,slug")
          .then(({ data, error }) => { if (error) throw error; return data || []; }),
      ]);
    } catch (e) {
      el.innerHTML = Portal.errorState(Portal.friendlyError(e));
      return;
    }

    const commName = (id) => (comms.find((c) => c.id === id) || {}).name || "";
    const actName = (id) => (activityDefs.find((a) => a.id === id) || {}).name || "Activity";

    /* video progress rows need content titles */
    let contentTitles = {};
    const contentIds = [...new Set(progress.map((r) => r.content_id))];
    if (contentIds.length) {
      const { data } = await sb.from("content").select("id,title").in("id", contentIds);
      contentTitles = Object.fromEntries((data || []).map((c) => [c.id, c.title]));
    }

    const rowLink = (href, title, sub, badgeHtml, dateStr) => `
      <li class="pitem">
        <a class="pitem__link" href="${esc(href)}">
          <span class="pitem__main"><strong>${esc(title)}</strong>${sub ? `<span class="pitem__sub">${esc(sub)}</span>` : ""}</span>
          <span class="pitem__side">${badgeHtml || ""}<time>${esc(dateStr)}</time></span>
        </a>
      </li>`;

    const lettersHtml = letters.map((l) => rowLink(
      "submission.html?type=letter&id=" + l.id, l.title || "(untitled letter)",
      "Letter · " + (commName(l.community_id) || "No community"),
      Portal.badge(cfg.letterStatuses, l.status), fmtDate(l.created_at))).join("");

    const requestsHtml = requests.map((r) => rowLink(
      "submission.html?type=request&id=" + r.id, r.title || "(untitled request)",
      (REQUEST_TYPE_LABELS[r.request_type] || r.request_type) + " · " + (commName(r.community_id) || "No community"),
      Portal.badge(cfg.requestStatuses, r.status), fmtDate(r.created_at))).join("");

    const subsHtml = subs.map((s2) => rowLink(
      "submission.html?type=activity&id=" + s2.id, actName(s2.activity_id),
      "Activity · " + (commName(s2.community_id) || "All communities"),
      Portal.badge(cfg.submissionStatuses, s2.status), fmtDate(s2.created_at))).join("");

    const videosHtml = progress.map((v) => rowLink(
      "content.html?id=" + v.content_id, contentTitles[v.content_id] || "Video",
      v.completed ? "Completed" : "Watched " + Math.round(v.completion_percentage) + "%",
      v.completed ? '<span class="pbadge pbadge--green">Completed</span>'
                  : `<span class="pbadge pbadge--blue">${Math.round(v.completion_percentage)}%</span>`,
      fmtDate(v.last_watched_at))).join("");

    const eventsHtml = events.slice(0, 100).map((e) => `
      <li class="pitem"><div class="pitem__link pitem__link--static">
        <span class="pitem__main"><strong>${esc(EVENT_LABELS[e.event_type] || e.event_type)}</strong>
          ${e.community_id ? `<span class="pitem__sub">${esc(commName(e.community_id))}</span>` : ""}</span>
        <span class="pitem__side"><time>${esc(fmtDateTime(e.created_at))}</time></span>
      </div></li>`).join("");

    const tabs = [
      { key: "all",      label: "All" },
      { key: "videos",   label: "Videos",   html: videosHtml,  empty: "Videos you watch will appear here." },
      { key: "letters",  label: "Letters",  html: lettersHtml, empty: "Letters you write will appear here." },
      { key: "requests", label: "Requests", html: requestsHtml, empty: "Letter, video, and song requests will appear here." },
      { key: "activities", label: "Activities", html: subsHtml, empty: "Activities you take part in will appear here." },
      { key: "events",   label: "Events",   html: eventsHtml,  empty: "Your account activity will appear here." },
    ];
    const allHtml = [lettersHtml, requestsHtml, subsHtml, videosHtml].filter(Boolean).join("");

    el.innerHTML = `
      <section class="phome-hero">
        <div class="eyebrow">Community Portal</div>
        <h1>My Activity</h1>
        <p class="phome-hero__sub">Everything you've watched, written, requested, and completed — with the current status of each submission.</p>
      </section>
      <div class="pfilterbar" role="toolbar" aria-label="Filter your activity">
        ${tabs.map((t, i) => `<button type="button" class="pfilter${i === 0 ? " is-active" : ""}"
            data-tab="${t.key}" aria-pressed="${i === 0 ? "true" : "false"}">${esc(t.label)}</button>`).join("")}
      </div>
      <div data-activity-panel>
        ${allHtml ? `<ul class="pitems">${allHtml}</ul>` : Portal.emptyState(
          "No activity yet",
          "When you watch a video, write a letter, or try an activity, it shows up here.",
          `<a class="btn btn--gold btn--sm" href="home.html">Explore the portal</a>`)}
      </div>`;

    const panel = el.querySelector("[data-activity-panel]");
    el.querySelectorAll(".pfilter").forEach((btn) => {
      btn.addEventListener("click", () => {
        el.querySelectorAll(".pfilter").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        const t = tabs.find((x) => x.key === btn.dataset.tab);
        if (t.key === "all") {
          panel.innerHTML = allHtml ? `<ul class="pitems">${allHtml}</ul>`
            : Portal.emptyState("No activity yet", "When you watch a video, write a letter, or try an activity, it shows up here.");
        } else {
          panel.innerHTML = t.html ? `<ul class="pitems">${t.html}</ul>`
            : Portal.emptyState("Nothing here yet", t.empty);
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     SUBMISSION DETAIL — statuses + public notes, never admin notes
     ───────────────────────────────────────────────────────── */

  async function pageSubmission() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav("activity");
    const el = root();
    const type = qs.get("type"), id = qs.get("id");
    el.innerHTML = Portal.skeleton(3);
    const comms = await Portal.communities().catch(() => []);
    const commName = (cid) => (comms.find((c) => c.id === cid) || {}).name || "—";
    const back = `<div class="btn-row" style="justify-content:flex-start;margin-top:2rem;">
        <a class="btn btn--ink btn--sm" href="activity.html">← Back to My Activity</a></div>`;
    const detail = (rows) => `<dl class="pdetail">${rows.map(([k, v]) =>
      `<div class="pdetail__row"><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("")}</dl>`;

    try {
      if (type === "letter") {
        const { data: l, error } = await sb.from("letters")
          .select("id,title,body,status,recipient_type,community_id,public_display_permission,rejection_reason,public_notes,created_at,updated_at")
          .eq("id", id).maybeSingle();
        if (error) throw error;
        if (!l) { el.innerHTML = Portal.emptyState("Not found", "This letter doesn't exist or isn't yours.") + back; return; }
        Portal.logEvent("letter_opened", { submissionId: l.id, oncePerPage: true });
        const grp = cfg.recipientGroups.find((g) => g.value === l.recipient_type);
        el.innerHTML = `
          <article class="pcontent">
            <div class="pcontent__meta"><span class="card__tag">Letter</span>${Portal.badge(cfg.letterStatuses, l.status)}</div>
            <h1>${esc(l.title)}</h1>
            ${detail([
              ["Written for", esc(grp ? grp.label : l.recipient_type)],
              ["Community", esc(commName(l.community_id))],
              ["Submitted", esc(fmtDateTime(l.created_at))],
              ["Last updated", esc(fmtDateTime(l.updated_at))],
              ["Public sharing", l.public_display_permission ? "Allowed (your name is never shown)" : "Not allowed — kept private"],
            ])}
            ${l.status === "rejected" && l.rejection_reason ? `
              <div class="pnotice pnotice--bad"><strong>Why this wasn't approved:</strong> ${esc(l.rejection_reason)}</div>` : ""}
            ${l.public_notes ? `<div class="pnotice pnotice--good"><strong>Note from the team:</strong> ${esc(l.public_notes)}</div>` : ""}
            <div class="pcontent__body pletter-paper"><p>${esc(l.body).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p></div>
            ${l.status === "draft" ? `<div class="btn-row" style="justify-content:flex-start;margin-top:1.4rem;">
              <a class="btn btn--gold btn--sm" href="write-letter.html?id=${esc(l.id)}">Continue editing</a></div>` : ""}
            ${back}
          </article>`;
        return;
      }

      if (type === "request") {
        const { data: r, error } = await sb.from("activity_requests")
          .select("id,title,details,request_type,status,community_id,preferred_language,intended_audience,recipient_name,public_display_permission,email_permission,contact_permission,extra,public_notes,created_at,updated_at")
          .eq("id", id).maybeSingle();
        if (error) throw error;
        if (!r) { el.innerHTML = Portal.emptyState("Not found", "This request doesn't exist or isn't yours.") + back; return; }
        const extraRows = Object.entries(r.extra || {}).filter(([, v]) => v)
          .map(([k, v]) => [k.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()), esc(String(v))]);
        el.innerHTML = `
          <article class="pcontent">
            <div class="pcontent__meta"><span class="card__tag">${esc(REQUEST_TYPE_LABELS[r.request_type] || "Request")}</span>
              ${Portal.badge(cfg.requestStatuses, r.status)}</div>
            <h1>${esc(r.title)}</h1>
            ${detail([
              ["Community", esc(commName(r.community_id))],
              ["Submitted", esc(fmtDateTime(r.created_at))],
              ["Last updated", esc(fmtDateTime(r.updated_at))],
              ...(r.intended_audience ? [["Intended audience", esc(r.intended_audience)]] : []),
              ...(r.recipient_name ? [["Recipient", esc(r.recipient_name)]] : []),
              ...(r.preferred_language ? [["Preferred language", esc(r.preferred_language)]] : []),
              ...extraRows,
            ])}
            ${r.details ? `<div class="pcontent__body"><p>${esc(r.details).replace(/\n/g, "<br>")}</p></div>` : ""}
            ${r.public_notes ? `<div class="pnotice pnotice--good"><strong>Note from the team:</strong> ${esc(r.public_notes)}</div>` : ""}
            ${back}
          </article>`;
        return;
      }

      if (type === "activity") {
        const { data: s2, error } = await sb.from("activity_submissions")
          .select("id,activity_id,status,community_id,response_data,submitted_at,completed_at,created_at")
          .eq("id", id).maybeSingle();
        if (error) throw error;
        if (!s2) { el.innerHTML = Portal.emptyState("Not found", "This activity record doesn't exist or isn't yours.") + back; return; }
        const { data: act } = await sb.from("activity_definitions").select("name,slug,description").eq("id", s2.activity_id).maybeSingle();
        const respRows = Object.entries(s2.response_data || {}).filter(([, v]) => v)
          .map(([k, v]) => [k.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()), esc(String(v))]);
        el.innerHTML = `
          <article class="pcontent">
            <div class="pcontent__meta"><span class="card__tag">Activity</span>${Portal.badge(cfg.submissionStatuses, s2.status)}</div>
            <h1>${esc((act && act.name) || "Activity")}</h1>
            ${detail([
              ["Community", esc(commName(s2.community_id))],
              ["Started", esc(fmtDateTime(s2.created_at))],
              ...(s2.completed_at ? [["Completed", esc(fmtDateTime(s2.completed_at))]] : []),
              ...respRows,
            ])}
            ${act && s2.status !== "completed" ? `<div class="btn-row" style="justify-content:flex-start;">
              <a class="btn btn--gold btn--sm" href="participate.html?a=${esc(act.slug)}">Continue this activity</a></div>` : ""}
            ${back}
          </article>`;
        return;
      }

      el.innerHTML = Portal.emptyState("Not found", "This link doesn't match a submission.") + back;
    } catch (e) {
      el.innerHTML = Portal.errorState(Portal.friendlyError(e)) + back;
    }
  }

  /* ─────────────────────────────────────────────────────────
     PROFILE (Phase 10)
     ───────────────────────────────────────────────────────── */

  async function pageProfile() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav("profile");
    const el = root();
    const comms = await Portal.communities().catch(() => []);
    const typeLabel = (cfg.accountTypes.find((t) => t.value === p.account_type) || {}).label || p.account_type;

    el.innerHTML = `
      <section class="phome-hero">
        <div class="eyebrow">Community Portal</div>
        <h1>Profile Settings</h1>
        <p class="phome-hero__sub">Member since ${esc(fmtDate(p.created_at))} · ${esc(p.email || "")}</p>
      </section>

      <section class="psection pprofile-grid">
        <div class="card pform-card">
          <h3>Your details</h3>
          <form novalidate data-profile-form>
            <div class="pnotice pnotice--bad" data-form-errors hidden tabindex="-1"></div>
            <div class="pfield">
              <label for="pf-name">Full name</label>
              <input class="pinput" id="pf-name" name="full_name" type="text" value="${esc(p.full_name)}" required>
              <p class="perror" id="err-pf-name" data-error-for="full_name"></p>
            </div>
            <div class="pfield">
              <label for="pf-type">Account type</label>
              <select class="pinput" id="pf-type" name="account_type">
                ${cfg.accountTypes.map((t) => `<option value="${t.value}"${t.value === p.account_type ? " selected" : ""}>${esc(t.label)}</option>`).join("")}
              </select>
            </div>
            <div class="pfield">
              <label for="pf-community">Primary community</label>
              <select class="pinput" id="pf-community" name="primary_community_id">
                <option value="">No community selected</option>
                ${comms.map((c) => `<option value="${c.id}"${c.id === p.primary_community_id ? " selected" : ""}>${esc(c.name)}</option>`).join("")}
              </select>
              <p class="phint">Changing this reorders what the portal shows you first.</p>
            </div>
            <label class="pcheck">
              <input type="checkbox" name="email_consent" value="yes"${p.email_consent ? " checked" : ""}>
              <span>You may email me program updates.</span>
            </label>
            <button class="btn btn--gold btn--sm" type="submit" style="margin-top:1rem;">Save changes</button>
          </form>
          <p class="phint" style="margin-top:1rem;">Account email: <strong>${esc(p.email || "")}</strong> · account type: ${esc(typeLabel)}.
            Your role and account ID can't be edited.</p>
        </div>

        <div class="card pform-card">
          <h3>Change password</h3>
          <form novalidate data-password-form>
            <div class="pnotice pnotice--bad" data-form-errors hidden tabindex="-1"></div>
            <div class="pfield">
              <label for="pw-new">New password</label>
              <input class="pinput" id="pw-new" name="password" type="password" autocomplete="new-password" required minlength="8">
              <p class="perror" id="err-pw-new" data-error-for="password"></p>
            </div>
            <div class="pfield">
              <label for="pw-new2">Confirm new password</label>
              <input class="pinput" id="pw-new2" name="password2" type="password" autocomplete="new-password" required>
              <p class="perror" id="err-pw-new2" data-error-for="password2"></p>
            </div>
            <button class="btn btn--ink btn--sm" type="submit">Update password</button>
          </form>
        </div>

        <div class="card pform-card pform-card--danger">
          <h3>Delete account & data</h3>
          <p class="pcard__desc">This permanently removes your account, letters, requests, activity history,
            and video progress. This cannot be undone.</p>
          <div class="pfield">
            <label for="del-confirm">Type <strong>DELETE</strong> to confirm</label>
            <input class="pinput" id="del-confirm" autocomplete="off">
          </div>
          <button class="btn btn--sm pbtn-danger" type="button" data-delete-account disabled>Permanently delete my account</button>
        </div>
      </section>`;

    Portal.bindForm(el.querySelector("[data-profile-form]"), {
      validate: (v) => (Portal.vRequired(v.full_name) ? {} : { full_name: "Please enter your name." }),
      submit: async (v) => {
        const { error } = await sb.from("profiles").update({
          full_name: String(v.full_name).trim(),
          account_type: v.account_type,
          primary_community_id: v.primary_community_id || null,
          email_consent: !!v.email_consent,
        }).eq("id", p.id);
        if (error) throw error;
        await Portal.profile(true);
        Portal.toast("Profile saved.");
        return { stay: true };
      },
    });

    Portal.bindForm(el.querySelector("[data-password-form]"), {
      validate: (v) => {
        const e = {};
        if (!v.password || v.password.length < 8) e.password = "Your new password needs at least 8 characters.";
        if (v.password !== v.password2) e.password2 = "The two passwords don't match.";
        return e;
      },
      submit: async (v) => {
        const { error } = await sb.auth.updateUser({ password: v.password });
        if (error) throw error;
        el.querySelector("[data-password-form]").reset();
        Portal.toast("Password updated.");
        return { stay: true };
      },
    });

    const delInput = el.querySelector("#del-confirm");
    const delBtn = el.querySelector("[data-delete-account]");
    delInput.addEventListener("input", () => { delBtn.disabled = delInput.value.trim() !== "DELETE"; });
    delBtn.addEventListener("click", async () => {
      if (delInput.value.trim() !== "DELETE") return;
      if (!window.confirm("This will permanently delete your account and all of your data. Are you absolutely sure?")) return;
      delBtn.disabled = true;
      delBtn.textContent = "Deleting…";
      try {
        const { error } = await sb.rpc("delete_own_account");
        if (error) throw error;
        await sb.auth.signOut();
        Portal.nav("index.html");
      } catch (e) {
        delBtn.disabled = false;
        delBtn.textContent = "Permanently delete my account";
        Portal.toast(Portal.friendlyError(e));
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     WRITE A LETTER (Phase 8A) — drafts + submit for review
     ───────────────────────────────────────────────────────── */

  async function pageWriteLetter() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav(null);
    const el = root();
    const comms = await Portal.communities().catch(() => []);
    const draftId = qs.get("id");
    let draft = null;
    if (draftId) {
      const { data } = await sb.from("letters")
        .select("id,title,body,recipient_type,community_id,public_display_permission,status")
        .eq("id", draftId).eq("status", "draft").maybeSingle();
      draft = data;
    }

    el.innerHTML = `
      <section class="pauth-card pauth-card--wide">
        <div class="eyebrow">Community Portal</div>
        <h1 class="pauth-card__title">${draft ? "Continue your letter" : "Write a Letter"}</h1>
        <p>One kind message can change someone's day. Letters are reviewed by the GYCO team before delivery.</p>
        <div class="pnotice pnotice--info">${esc(cfg.privacyNote)}</div>
        <form novalidate data-letter-form>
          <div class="pnotice pnotice--bad" data-form-errors hidden tabindex="-1"></div>
          <div class="pfield">
            <label for="lt-recipient">Who is this letter for?</label>
            <select class="pinput" id="lt-recipient" name="recipient_type" required>
              <option value="">Choose a recipient…</option>
              ${cfg.recipientGroups.map((g) => `<option value="${g.value}"${draft && draft.recipient_type === g.value ? " selected" : ""}>${esc(g.label)}</option>`).join("")}
            </select>
            <p class="perror" id="err-lt-recipient" data-error-for="recipient_type"></p>
          </div>
          <div class="pfield">
            <label for="lt-title">Letter title</label>
            <input class="pinput" id="lt-title" name="title" type="text" maxlength="150" value="${esc(draft ? draft.title : "")}" required>
            <p class="perror" id="err-lt-title" data-error-for="title"></p>
          </div>
          <div class="pfield">
            <label for="lt-body">Your letter</label>
            <textarea class="pinput ptextarea" id="lt-body" name="body" rows="9" maxlength="6000" required>${esc(draft ? draft.body : "")}</textarea>
            <p class="perror" id="err-lt-body" data-error-for="body"></p>
          </div>
          <div class="pfield">
            <label for="lt-community">Related community</label>
            <select class="pinput" id="lt-community" name="community_id" required>
              <option value="">Choose a community…</option>
              ${comms.map((c) => `<option value="${c.id}"${
                (draft ? draft.community_id === c.id : p.primary_community_id === c.id) ? " selected" : ""}>${esc(c.name)}</option>`).join("")}
            </select>
            <p class="perror" id="err-lt-community" data-error-for="community_id"></p>
          </div>
          <label class="pcheck">
            <input type="checkbox" name="public_display_permission" value="yes"${draft && draft.public_display_permission ? " checked" : ""}>
            <span>If approved, this letter may be shared in the portal — <strong>without my name</strong>. (Optional)</span>
          </label>
          <div class="btn-row" style="justify-content:flex-start;margin-top:1.4rem;">
            <button class="btn btn--gold" type="submit" name="action" value="submit" data-action-submit>Submit for review</button>
            <button class="btn btn--ink" type="submit" name="action" value="draft" data-action-draft>Save as draft</button>
          </div>
        </form>
      </section>`;

    let action = "submit";
    el.querySelector("[data-action-draft]").addEventListener("click", () => { action = "draft"; });
    el.querySelector("[data-action-submit]").addEventListener("click", () => { action = "submit"; });

    Portal.bindForm(el.querySelector("[data-letter-form]"), {
      validate: (v) => {
        const e = {};
        if (!Portal.vRequired(v.recipient_type)) e.recipient_type = "Please choose who the letter is for.";
        if (!Portal.vRequired(v.title)) e.title = "Please give your letter a title.";
        if (!Portal.vRequired(v.body) || String(v.body).trim().length < 10) e.body = "Please write your letter (at least a sentence).";
        if (!Portal.vRequired(v.community_id)) e.community_id = "Please choose the related community.";
        return e;
      },
      submit: async (v) => {
        const row = {
          user_id: p.id,
          recipient_type: v.recipient_type,
          title: String(v.title).trim(),
          body: String(v.body).trim(),
          community_id: v.community_id,
          public_display_permission: !!v.public_display_permission,
          status: action === "draft" ? "draft" : "submitted",
        };
        let error;
        if (draft) ({ error } = await sb.from("letters").update(row).eq("id", draft.id));
        else ({ error } = await sb.from("letters").insert(row));
        if (error) throw error;
        if (action === "draft") {
          Portal.toast("Draft saved — find it anytime in My Activity.");
          Portal.nav("activity.html");
          return { stay: true };
        }
        return null;
      },
      successTitle: "Your letter is on its way",
      successText: "Thank you for sharing encouragement. The GYCO team will review your letter, and you can follow its status in My Activity.",
      successActions: `<a class="btn btn--gold btn--sm" href="activity.html">View status</a>
        <a class="btn btn--ink btn--sm" href="write-letter.html">Write another</a>`,
    });
  }

  /* ─────────────────────────────────────────────────────────
     REQUEST FORMS (Phase 8 B–D)
     ───────────────────────────────────────────────────────── */

  const communityOptions = (comms, selectedId) =>
    `<option value="">Choose a community…</option>` +
    comms.map((c) => `<option value="${c.id}"${c.id === selectedId ? " selected" : ""}>${esc(c.name)}</option>`).join("");
  const languageOptions = (sel) =>
    `<option value="">No preference</option>` +
    cfg.languages.map((l) => `<option${l === sel ? " selected" : ""}>${esc(l)}</option>`).join("");

  async function pageRequestLetter() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav(null);
    const comms = await Portal.communities().catch(() => []);
    const el = root();
    el.innerHTML = `
      <section class="pauth-card pauth-card--wide">
        <div class="eyebrow">Community Portal</div>
        <h1 class="pauth-card__title">Request to Receive a Letter</h1>
        <p>Ask for an encouraging letter — for yourself, or for someone you care about.</p>
        <div class="pnotice pnotice--info">${esc(cfg.privacyNote)}</div>
        <form novalidate data-req-form>
          <div class="pnotice pnotice--bad" data-form-errors hidden tabindex="-1"></div>
          <div class="pfield-row">
            <div class="pfield">
              <label for="rl-name">Recipient name</label>
              <input class="pinput" id="rl-name" name="recipient_name" value="${esc(p.full_name)}" required>
              <p class="perror" id="err-rl-name" data-error-for="recipient_name"></p>
            </div>
            <div class="pfield">
              <label for="rl-email">Email address</label>
              <input class="pinput" id="rl-email" name="recipient_email" type="email" value="${esc(p.email || "")}" required>
              <p class="perror" id="err-rl-email" data-error-for="recipient_email"></p>
            </div>
          </div>
          <div class="pfield">
            <label for="rl-community">Community area</label>
            <select class="pinput" id="rl-community" name="community_id" required>${communityOptions(comms, p.primary_community_id)}</select>
            <p class="perror" id="err-rl-community" data-error-for="community_id"></p>
          </div>
          <div class="pfield">
            <label for="rl-type">Preferred type of letter</label>
            <select class="pinput" id="rl-type" name="letter_kind" required>
              <option value="">Choose one…</option>
              <option>Encouragement</option><option>Get well soon</option><option>Thinking of you</option>
              <option>Celebration</option><option>For a difficult day</option><option>Friendly hello</option>
            </select>
            <p class="perror" id="err-rl-type" data-error-for="letter_kind"></p>
          </div>
          <div class="pfield">
            <label for="rl-details">What should the letter talk about? (Optional)</label>
            <textarea class="pinput ptextarea" id="rl-details" name="details" rows="4" maxlength="2000"></textarea>
          </div>
          <div class="pfield">
            <label for="rl-lang">Preferred language (Optional)</label>
            <select class="pinput" id="rl-lang" name="preferred_language">${languageOptions()}</select>
          </div>
          <label class="pcheck">
            <input type="checkbox" name="email_permission" value="yes" checked>
            <span>You may deliver this letter by email.</span>
          </label>
          <button class="btn btn--gold" type="submit" style="margin-top:1.2rem;">Request this letter</button>
        </form>
      </section>`;
    Portal.bindForm(el.querySelector("[data-req-form]"), {
      validate: (v) => {
        const e = {};
        if (!Portal.vRequired(v.recipient_name)) e.recipient_name = "Please enter the recipient's name.";
        if (!Portal.vEmail(v.recipient_email)) e.recipient_email = "Please enter a valid email address.";
        if (!Portal.vRequired(v.community_id)) e.community_id = "Please choose a community.";
        if (!Portal.vRequired(v.letter_kind)) e.letter_kind = "Please choose the type of letter.";
        return e;
      },
      submit: async (v) => {
        const { error } = await sb.from("activity_requests").insert({
          user_id: p.id,
          request_type: "letter",
          title: v.letter_kind + " letter for " + String(v.recipient_name).trim(),
          details: String(v.details || "").trim() || null,
          community_id: v.community_id,
          recipient_name: String(v.recipient_name).trim(),
          recipient_email: String(v.recipient_email).trim(),
          preferred_language: v.preferred_language || null,
          email_permission: !!v.email_permission,
          extra: { letter_kind: v.letter_kind },
        });
        if (error) throw error;
        return null;
      },
      successTitle: "Letter request received",
      successText: "The GYCO team will prepare a letter with care. Follow its status anytime in My Activity.",
      successActions: `<a class="btn btn--gold btn--sm" href="activity.html">View status</a>
        <a class="btn btn--ink btn--sm" href="home.html">Portal home</a>`,
    });
  }

  async function pageRequestVideo() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav(null);
    const comms = await Portal.communities().catch(() => []);
    const el = root();
    el.innerHTML = `
      <section class="pauth-card pauth-card--wide">
        <div class="eyebrow">Community Portal</div>
        <h1 class="pauth-card__title">Request a Video</h1>
        <p>Ask GYCO students to create a teaching video, performance, or message of encouragement.</p>
        <form novalidate data-req-form>
          <div class="pnotice pnotice--bad" data-form-errors hidden tabindex="-1"></div>
          <div class="pfield">
            <label for="rv-type">Type of video</label>
            <select class="pinput" id="rv-type" name="request_type" required>
              <option value="">Choose one…</option>
              ${cfg.videoRequestTypes.map((t) => `<option value="${t.value}">${esc(t.label)}</option>`).join("")}
            </select>
            <p class="perror" id="err-rv-type" data-error-for="request_type"></p>
          </div>
          <div class="pfield">
            <label for="rv-topic">Video topic</label>
            <input class="pinput" id="rv-topic" name="title" maxlength="150" required
              placeholder="e.g. A gentle rhythm activity for small hands">
            <p class="perror" id="err-rv-topic" data-error-for="title"></p>
          </div>
          <div class="pfield">
            <label for="rv-audience">Who is it for?</label>
            <input class="pinput" id="rv-audience" name="intended_audience" maxlength="150" required
              placeholder="e.g. Families at Ronald McDonald House">
            <p class="perror" id="err-rv-audience" data-error-for="intended_audience"></p>
          </div>
          <div class="pfield">
            <label for="rv-community">Community area</label>
            <select class="pinput" id="rv-community" name="community_id" required>${communityOptions(comms, p.primary_community_id)}</select>
            <p class="perror" id="err-rv-community" data-error-for="community_id"></p>
          </div>
          <div class="pfield">
            <label for="rv-lang">Preferred language (Optional)</label>
            <select class="pinput" id="rv-lang" name="preferred_language">${languageOptions()}</select>
          </div>
          <div class="pfield">
            <label for="rv-details">Additional details (Optional)</label>
            <textarea class="pinput ptextarea" id="rv-details" name="details" rows="4" maxlength="2000"></textarea>
          </div>
          <label class="pcheck">
            <input type="checkbox" name="contact_permission" value="yes" checked>
            <span>The GYCO team may contact me about this request.</span>
          </label>
          <button class="btn btn--gold" type="submit" style="margin-top:1.2rem;">Send video request</button>
        </form>
      </section>`;
    Portal.bindForm(el.querySelector("[data-req-form]"), {
      validate: (v) => {
        const e = {};
        if (!Portal.vRequired(v.request_type)) e.request_type = "Please choose the type of video.";
        if (!Portal.vRequired(v.title)) e.title = "Please describe the video topic.";
        if (!Portal.vRequired(v.intended_audience)) e.intended_audience = "Please tell us who the video is for.";
        if (!Portal.vRequired(v.community_id)) e.community_id = "Please choose a community.";
        return e;
      },
      submit: async (v) => {
        const { error } = await sb.from("activity_requests").insert({
          user_id: p.id,
          request_type: v.request_type,
          title: String(v.title).trim(),
          details: String(v.details || "").trim() || null,
          intended_audience: String(v.intended_audience).trim(),
          community_id: v.community_id,
          preferred_language: v.preferred_language || null,
          contact_permission: !!v.contact_permission,
        });
        if (error) throw error;
        return null;
      },
      successTitle: "Video request received",
      successText: "GYCO students will review your request. Follow its status anytime in My Activity.",
      successActions: `<a class="btn btn--gold btn--sm" href="activity.html">View status</a>
        <a class="btn btn--ink btn--sm" href="home.html">Portal home</a>`,
    });
  }

  async function pageRequestSong() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav(null);
    const comms = await Portal.communities().catch(() => []);
    const el = root();
    el.innerHTML = `
      <section class="pauth-card pauth-card--wide">
        <div class="eyebrow">Community Portal</div>
        <h1 class="pauth-card__title">Request a Song</h1>
        <p>Request a meaningful song for yourself or a loved one. When possible, GYCO students prepare it as a live or recorded performance.</p>
        <form novalidate data-req-form>
          <div class="pnotice pnotice--bad" data-form-errors hidden tabindex="-1"></div>
          <div class="pfield-row">
            <div class="pfield">
              <label for="rs-title">Song title</label>
              <input class="pinput" id="rs-title" name="title" maxlength="150" required>
              <p class="perror" id="err-rs-title" data-error-for="title"></p>
            </div>
            <div class="pfield">
              <label for="rs-artist">Artist or composer</label>
              <input class="pinput" id="rs-artist" name="artist" maxlength="150" required>
              <p class="perror" id="err-rs-artist" data-error-for="artist"></p>
            </div>
          </div>
          <div class="pfield">
            <label for="rs-why">Why is this song meaningful?</label>
            <textarea class="pinput ptextarea" id="rs-why" name="details" rows="4" maxlength="2000" required></textarea>
            <p class="perror" id="err-rs-why" data-error-for="details"></p>
          </div>
          <div class="pfield">
            <label for="rs-recipient">Who is it for? (Optional)</label>
            <input class="pinput" id="rs-recipient" name="recipient_name" maxlength="150"
              placeholder="e.g. My grandmother">
          </div>
          <div class="pfield">
            <label for="rs-community">Community area</label>
            <select class="pinput" id="rs-community" name="community_id" required>${communityOptions(comms, p.primary_community_id)}</select>
            <p class="perror" id="err-rs-community" data-error-for="community_id"></p>
          </div>
          <div class="pfield">
            <label for="rs-lang">Preferred language (Optional)</label>
            <select class="pinput" id="rs-lang" name="preferred_language">${languageOptions()}</select>
          </div>
          <div class="pfield">
            <label for="rs-notes">Additional notes (Optional)</label>
            <textarea class="pinput ptextarea" id="rs-notes" name="notes" rows="3" maxlength="1000"></textarea>
          </div>
          <label class="pcheck">
            <input type="checkbox" name="public_display_permission" value="yes">
            <span>This request and its story may be shared publicly — without my name. (Optional)</span>
          </label>
          <button class="btn btn--gold" type="submit" style="margin-top:1.2rem;">Send song request</button>
        </form>
      </section>`;
    Portal.bindForm(el.querySelector("[data-req-form]"), {
      validate: (v) => {
        const e = {};
        if (!Portal.vRequired(v.title)) e.title = "Please enter the song title.";
        if (!Portal.vRequired(v.artist)) e.artist = "Please enter the artist or composer.";
        if (!Portal.vRequired(v.details)) e.details = "Please share why this song is meaningful.";
        if (!Portal.vRequired(v.community_id)) e.community_id = "Please choose a community.";
        return e;
      },
      submit: async (v) => {
        const { error } = await sb.from("activity_requests").insert({
          user_id: p.id,
          request_type: "song",
          title: String(v.title).trim(),
          details: String(v.details).trim(),
          recipient_name: String(v.recipient_name || "").trim() || null,
          community_id: v.community_id,
          preferred_language: v.preferred_language || null,
          public_display_permission: !!v.public_display_permission,
          extra: {
            artist_or_composer: String(v.artist).trim(),
            additional_notes: String(v.notes || "").trim() || undefined,
          },
        });
        if (error) throw error;
        return null;
      },
      successTitle: "Song request received",
      successText: "Thank you — music means more when it's asked for. Follow the status of your request in My Activity.",
      successActions: `<a class="btn btn--gold btn--sm" href="activity.html">View status</a>
        <a class="btn btn--ink btn--sm" href="home.html">Portal home</a>`,
    });
  }

  /* ─────────────────────────────────────────────────────────
     PARTICIPATE — config-driven activities (Phase 8E)
     ───────────────────────────────────────────────────────── */

  async function pageParticipate() {
    const p = await Portal.requireAuth();
    if (!p) return;
    Portal.buildPortalNav(null);
    const el = root();
    const slug = qs.get("a");
    el.innerHTML = Portal.skeleton(3);

    const { data: act, error } = await sb.from("activity_definitions")
      .select("id,name,slug,description,activity_type,instructions,configuration,is_active")
      .eq("slug", slug || "").maybeSingle();
    if (error) { el.innerHTML = Portal.errorState(Portal.friendlyError(error)); return; }
    if (!act || !act.is_active) {
      el.innerHTML = Portal.emptyState("Activity not available",
        "This activity may have been paused or removed.",
        `<a class="btn btn--gold btn--sm" href="home.html">Back to portal home</a>`);
      return;
    }

    const conf = act.configuration || {};
    const steps = Array.isArray(conf.steps) ? conf.steps : [];
    const fields = Array.isArray(conf.fields) ? conf.fields : [];

    el.innerHTML = `
      <section class="pauth-card pauth-card--wide">
        <div class="eyebrow">Community Portal · Activity</div>
        <h1 class="pauth-card__title">${esc(act.name)}</h1>
        ${act.description ? `<p>${esc(act.description)}</p>` : ""}
        ${act.instructions ? `<div class="pnotice pnotice--info">${esc(act.instructions)}</div>` : ""}
        ${steps.length ? `<ol class="psteps">${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}
        <form novalidate data-activity-form>
          <div class="pnotice pnotice--bad" data-form-errors hidden tabindex="-1"></div>
          ${fields.map((f) => `
            <div class="pfield">
              <label for="af-${esc(f.key)}">${esc(f.label || f.key)}</label>
              ${f.type === "textarea"
                ? `<textarea class="pinput ptextarea" id="af-${esc(f.key)}" name="f_${esc(f.key)}" rows="4" maxlength="2000"></textarea>`
                : `<input class="pinput" id="af-${esc(f.key)}" name="f_${esc(f.key)}" maxlength="300">`}
            </div>`).join("")}
          ${conf.reflection ? `
            <div class="pfield">
              <label for="af-reflection">${esc(conf.reflection)}</label>
              <textarea class="pinput ptextarea" id="af-reflection" name="f_reflection" rows="3" maxlength="2000"></textarea>
            </div>` : ""}
          <button class="btn btn--gold" type="submit">I did this activity ✓</button>
        </form>
      </section>`;

    Portal.bindForm(el.querySelector("[data-activity-form]"), {
      submit: async (v) => {
        const response = {};
        Object.keys(v).forEach((k) => {
          if (k.startsWith("f_") && String(v[k]).trim()) response[k.slice(2)] = String(v[k]).trim();
        });
        const { error: e2 } = await sb.from("activity_submissions").insert({
          user_id: p.id,
          activity_id: act.id,
          community_id: p.primary_community_id,
          status: "completed",
          response_data: response,
        });
        if (e2) throw e2;
        return null;
      },
      successTitle: "Activity completed — well done!",
      successText: "Small moments of participation keep the Circle of Love moving. It's recorded in My Activity.",
      successActions: `<a class="btn btn--gold btn--sm" href="activity.html">My Activity</a>
        <a class="btn btn--ink btn--sm" href="home.html">Portal home</a>`,
    });
  }

  /* register + dispatch */
  Object.assign(window.PortalRoutes, {
    activity: pageActivity, submission: pageSubmission, profile: pageProfile,
    "write-letter": pageWriteLetter, "request-letter": pageRequestLetter,
    "request-video": pageRequestVideo, "request-song": pageRequestSong,
    participate: pageParticipate,
  });
  const page = document.body.dataset.portalPage;
  if (window.PortalRoutes[page] && !["intro","login","signup","forgot","reset","home","community","content"].includes(page)) {
    window.PortalRoutes[page]().catch((e) => {
      const el = root();
      if (el) el.innerHTML = Portal.errorState(Portal.friendlyError(e));
    });
  }
})();
