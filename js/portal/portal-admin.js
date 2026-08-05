/* ============================================================
   PORTAL ADMIN — /admin/community.html dashboard.
   Every page of this dashboard is double-protected:
   · UI: Portal.requireAdmin() (redirects non-admins away)
   · Data: every table is behind RLS admin policies, and every RPC
     re-checks is_admin() server-side. Hiding the link is NOT the
     protection — the database is.
   Definitions used in Overview (also in migration 004):
   · active user    = ≥1 engagement event in the selected range
   · returning user = events on ≥2 distinct days in the range
   ============================================================ */
/* global Portal */

(() => {
  "use strict";
  const { sb, cfg, esc, fmtDate, fmtDateTime } = Portal;
  const root = () => document.getElementById("portal-root");
  const PAGE = 25;

  const state = {
    tab: "overview",
    filters: { community: "", accountType: "", from: "", to: "" },
    comms: [],
  };

  const EVENT_TYPES = [
    "account_created","logged_in","logged_out","community_selected","primary_community_changed",
    "community_page_visited","content_opened","video_opened","video_started",
    "video_progress_25","video_progress_50","video_progress_75","video_completed",
    "letter_opened","letter_draft_created","letter_written","letter_submitted",
    "letter_requested","video_requested","song_requested",
    "activity_started","activity_completed","event_registration_submitted",
    "feedback_submitted","profile_updated",
    "portal_home_viewed","portal_option_selected",
  ];

  /* ── modal helper ── */
  function modal(title, bodyHtml, onMount) {
    const overlay = document.createElement("div");
    overlay.className = "pmodal";
    overlay.innerHTML = `
      <div class="pmodal__box" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <div class="pmodal__head"><h3>${esc(title)}</h3>
          <button type="button" class="pmodal__close" aria-label="Close">×</button></div>
        <div class="pmodal__body">${bodyHtml}</div>
      </div>`;
    const close = () => overlay.remove();
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    overlay.querySelector(".pmodal__close").addEventListener("click", close);
    document.addEventListener("keydown", function escClose(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", escClose); }
    });
    document.body.appendChild(overlay);
    if (onMount) onMount(overlay, close);
    const f = overlay.querySelector("input,select,textarea,button.pmodal__close");
    if (f) f.focus();
    return { close };
  }

  const confirmModal = (title, text, confirmLabel, danger) => new Promise((resolve) => {
    modal(title, `
      <p>${esc(text)}</p>
      <div class="btn-row" style="justify-content:flex-end;margin-top:1.4rem;">
        <button type="button" class="btn btn--ink btn--sm" data-c-cancel>Cancel</button>
        <button type="button" class="btn btn--sm ${danger ? "pbtn-danger" : "btn--gold"}" data-c-ok>${esc(confirmLabel)}</button>
      </div>`,
      (ov, close) => {
        ov.querySelector("[data-c-cancel]").addEventListener("click", () => { close(); resolve(false); });
        ov.querySelector("[data-c-ok]").addEventListener("click", () => { close(); resolve(true); });
      });
  });

  const commName = (id) => (state.comms.find((c) => c.id === id) || {}).name || "—";
  const commOptions = (sel) => `<option value="">All communities</option>` +
    state.comms.map((c) => `<option value="${c.id}"${c.id === sel ? " selected" : ""}>${esc(c.name)}</option>`).join("");

  /* ── CSV export ── */
  function downloadCsv(filename, rows) {
    const csv = rows.map((r) => r.map((v) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")).join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  const feedParams = () => ({
    p_from: state.filters.from ? new Date(state.filters.from).toISOString() : null,
    p_to: state.filters.to ? new Date(state.filters.to + "T23:59:59").toISOString() : null,
    p_community: state.filters.community || null,
    p_account_type: state.filters.accountType || null,
  });

  async function exportActivityCsv(extra = {}) {
    Portal.toast("Preparing CSV export…");
    const rows = [["Time","Event","Name","Email","Account type","Community","Content","Submission ID","Metadata"]];
    let offset = 0;
    for (let page = 0; page < 20; page++) {          // hard cap: 20 × 1000 rows
      const { data, error } = await sb.rpc("admin_activity_feed",
        { ...feedParams(), ...extra, p_limit: 1000, p_offset: offset });
      if (error) { Portal.toast("Export failed: " + error.message); return; }
      (data || []).forEach((r) => rows.push([
        fmtDateTime(r.created_at), r.event_type, r.user_name, r.user_email,
        r.account_type, r.community_name, r.content_title, r.submission_id,
        r.metadata ? JSON.stringify(r.metadata) : "",
      ]));
      if (!data || data.length < 1000) break;
      offset += 1000;
    }
    downloadCsv("wawy-portal-activity.csv", rows);
    Portal.toast(`Exported ${rows.length - 1} events.`);
  }

  /* ── shell ── */
  async function renderShell(p) {
    const el = root();
    const tabs = [
      ["overview", "Overview"], ["accounts", "Accounts"], ["letters", "Letters"],
      ["requests", "Requests"], ["content", "Content"], ["activities", "Activities"],
    ];
    el.innerHTML = `
      <section class="phome-hero">
        <div class="eyebrow">Community Portal · Administration</div>
        <h1>Admin Dashboard</h1>
        <p class="phome-hero__sub">Signed in as ${esc(p.full_name)} (administrator)</p>
      </section>
      <div class="pfilterbar" role="tablist" aria-label="Admin sections">
        ${tabs.map(([k, l]) => `<button type="button" class="pfilter${k === state.tab ? " is-active" : ""}"
          role="tab" aria-selected="${k === state.tab}" data-tab="${k}">${l}</button>`).join("")}
      </div>
      <div class="padmin-filters">
        <label>Community <select class="pinput pinput--sm" data-f-community>${commOptions(state.filters.community)}</select></label>
        <label>Account type <select class="pinput pinput--sm" data-f-type>
          <option value="">All types</option>
          ${cfg.accountTypes.map((t) => `<option value="${t.value}"${t.value === state.filters.accountType ? " selected" : ""}>${esc(t.label)}</option>`).join("")}
        </select></label>
        <label>From <input type="date" class="pinput pinput--sm" data-f-from value="${esc(state.filters.from)}"></label>
        <label>To <input type="date" class="pinput pinput--sm" data-f-to value="${esc(state.filters.to)}"></label>
        <button type="button" class="btn btn--ink btn--sm" data-f-apply>Apply</button>
        <button type="button" class="btn btn--gold btn--sm" data-f-export>Export CSV</button>
      </div>
      <div id="padmin-body" aria-live="polite">${Portal.skeleton(4)}</div>`;

    el.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => {
      state.tab = b.dataset.tab;
      renderShell(p);
    }));
    el.querySelector("[data-f-apply]").addEventListener("click", () => {
      state.filters.community = el.querySelector("[data-f-community]").value;
      state.filters.accountType = el.querySelector("[data-f-type]").value;
      state.filters.from = el.querySelector("[data-f-from]").value;
      state.filters.to = el.querySelector("[data-f-to]").value;
      renderBody();
    });
    el.querySelector("[data-f-export]").addEventListener("click", () => exportActivityCsv());
    renderBody();
  }

  async function renderBody() {
    const body = document.getElementById("padmin-body");
    body.innerHTML = Portal.skeleton(4);
    try {
      if (state.tab === "overview") await tabOverview(body);
      else if (state.tab === "accounts") await tabAccounts(body);
      else if (state.tab === "letters") await tabLetters(body);
      else if (state.tab === "requests") await tabRequests(body);
      else if (state.tab === "content") await tabContent(body);
      else if (state.tab === "activities") await tabActivities(body);
    } catch (e) {
      body.innerHTML = Portal.errorState(Portal.friendlyError(e));
    }
  }

  /* ── Overview ── */
  async function tabOverview(body) {
    const { data: m, error } = await sb.rpc("admin_summary_metrics", feedParams());
    if (error) throw error;
    const stat = (label, value) => `
      <div class="pstat"><div class="pstat__value">${esc(String(value ?? 0))}</div>
      <div class="pstat__label">${esc(label)}</div></div>`;
    const list = (title, items, k, v) => `
      <div class="card pform-card"><h3>${esc(title)}</h3>
        ${items && items.length ? `<ul class="pactivity-list">${items.map((i) =>
          `<li><span>${esc(i[k])}</span><strong>${esc(String(i[v]))}</strong></li>`).join("")}</ul>`
        : '<p class="pcard__desc">No data in this range.</p>'}</div>`;
    const obj = (o) => Object.entries(o || {}).map(([k2, v2]) => ({ name: k2, n: v2 }));

    body.innerHTML = `
      <p class="phint">Range: ${esc(fmtDate(m.range.from))} – ${esc(fmtDate(m.range.to))} ·
        “Active” = ≥1 event in range · “Returning” = events on 2+ distinct days.</p>
      <div class="pstats">
        ${stat("Total accounts", m.total_accounts)}
        ${stat("New accounts", m.new_accounts)}
        ${stat("Active users", m.active_users)}
        ${stat("Returning users", m.returning_users)}
        ${stat("Videos opened", m.videos_opened)}
        ${stat("Videos started", m.videos_started)}
        ${stat("Videos completed", m.videos_completed)}
        ${stat("Avg completion %", m.avg_video_completion)}
        ${stat("Letters written", m.letters_written)}
        ${stat("Letters requested", m.letters_requested)}
        ${stat("Video requests", m.video_requests)}
        ${stat("Song requests", m.song_requests)}
        ${stat("Activities started", m.activities_started)}
        ${stat("Activities completed", m.activities_completed)}
        ${stat("Disabled accounts", m.disabled_accounts)}
      </div>
      <div class="pprofile-grid" style="margin-top:1.4rem;">
        ${list("Accounts by community", obj(m.accounts_by_community), "name", "n")}
        ${list("Accounts by type", obj(m.accounts_by_type), "name", "n")}
        ${list("Most active communities", m.most_active_communities, "name", "events")}
        ${list("Most viewed content", m.most_viewed_content, "title", "views")}
        ${list("Most completed content", m.most_completed_content, "title", "completions")}
        <div class="card pform-card"><h3>Recent submissions</h3>
          ${m.recent_submissions && m.recent_submissions.length ? `<ul class="pactivity-list">
            ${m.recent_submissions.slice(0, 8).map((s) => `<li><span>${esc(s.kind)}: ${esc(s.title || "")} — ${esc(s.user || "")}</span>
              <strong>${esc(s.status)}</strong></li>`).join("")}</ul>`
          : '<p class="pcard__desc">No submissions yet.</p>'}</div>
      </div>`;
  }

  /* ── Accounts ── */
  async function tabAccounts(body, page = 0, search = "") {
    let q = sb.from("profiles")
      .select("id,full_name,email,account_type,primary_community_id,role,is_disabled,created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE, page * PAGE + PAGE - 1);
    if (search) q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    if (state.filters.community) q = q.eq("primary_community_id", state.filters.community);
    if (state.filters.accountType) q = q.eq("account_type", state.filters.accountType);
    const { data, error, count } = await q;
    if (error) throw error;

    body.innerHTML = `
      <div class="padmin-toolbar">
        <input class="pinput pinput--sm" placeholder="Search name or email…" value="${esc(search)}" data-acct-search
          aria-label="Search accounts">
        <span class="phint">${count ?? 0} account${count === 1 ? "" : "s"}</span>
      </div>
      <div class="ptable-wrap"><table class="ptable">
        <thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Community</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>
          ${(data || []).map((u) => `<tr>
            <td>${esc(u.full_name)}${u.role === "admin" ? ' <span class="pbadge pbadge--gold">Admin</span>' : ""}</td>
            <td>${esc(u.email || "")}</td>
            <td>${esc((cfg.accountTypes.find((t) => t.value === u.account_type) || {}).label || u.account_type)}</td>
            <td>${esc(commName(u.primary_community_id))}</td>
            <td>${u.is_disabled ? '<span class="pbadge pbadge--red">Disabled</span>' : '<span class="pbadge pbadge--green">Active</span>'}</td>
            <td>${esc(fmtDate(u.created_at))}</td>
            <td class="ptable__actions">
              <button type="button" class="btn btn--ink btn--sm" data-acct-view="${u.id}" data-acct-name="${esc(u.full_name)}">Activity</button>
              <button type="button" class="btn btn--sm ${u.is_disabled ? "btn--gold" : "pbtn-danger"}"
                data-acct-toggle="${u.id}" data-disabled="${u.is_disabled}">${u.is_disabled ? "Re-enable" : "Disable"}</button>
            </td>
          </tr>`).join("")}
        </tbody></table></div>
      ${(data || []).length === 0 ? Portal.emptyState("No accounts found", "Try different filters or search terms.") : ""}
      <div class="padmin-pager">
        ${page > 0 ? `<button type="button" class="btn btn--ink btn--sm" data-page="${page - 1}">← Previous</button>` : ""}
        ${(count || 0) > (page + 1) * PAGE ? `<button type="button" class="btn btn--ink btn--sm" data-page="${page + 1}">Next →</button>` : ""}
      </div>`;

    const searchEl = body.querySelector("[data-acct-search]");
    let debounce;
    searchEl.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => tabAccounts(body, 0, searchEl.value.trim()), 350);
    });
    body.querySelectorAll("[data-page]").forEach((b) =>
      b.addEventListener("click", () => tabAccounts(body, Number(b.dataset.page), search)));

    body.querySelectorAll("[data-acct-toggle]").forEach((b) => b.addEventListener("click", async () => {
      const disabling = b.dataset.disabled !== "true";
      const okGo = await confirmModal(
        disabling ? "Disable this account?" : "Re-enable this account?",
        disabling
          ? "The person will be signed out of portal data access and cannot use the portal until re-enabled. Their data is kept."
          : "The person will regain normal access to the portal.",
        disabling ? "Disable account" : "Re-enable account", disabling);
      if (!okGo) return;
      const { error: e2 } = await sb.from("profiles").update({ is_disabled: disabling }).eq("id", b.dataset.acctToggle);
      if (e2) Portal.toast(e2.message); else { Portal.toast(disabling ? "Account disabled." : "Account re-enabled."); tabAccounts(body, page, search); }
    }));

    body.querySelectorAll("[data-acct-view]").forEach((b) => b.addEventListener("click", async () => {
      const { data: ev, error: e2 } = await sb.rpc("admin_activity_feed",
        { ...feedParams(), p_user: b.dataset.acctView, p_limit: 50, p_offset: 0 });
      modal("Activity — " + b.dataset.acctName, e2 ? `<p>${esc(e2.message)}</p>` : `
        ${(ev || []).length ? `<ul class="pactivity-list">${ev.map((r) => `
          <li><span>${esc(r.event_type)}${r.content_title ? " · " + esc(r.content_title) : ""}${r.community_name ? " · " + esc(r.community_name) : ""}</span>
          <time>${esc(fmtDateTime(r.created_at))}</time></li>`).join("")}</ul>`
        : "<p>No events for this account in the selected range.</p>"}
        <div class="btn-row" style="justify-content:flex-end;margin-top:1rem;">
          <button type="button" class="btn btn--gold btn--sm" data-exp-user>Export this account's CSV</button>
        </div>`,
        (ov) => ov.querySelector("[data-exp-user]").addEventListener("click",
          () => exportActivityCsv({ p_user: b.dataset.acctView })));
    }));
  }

  /* ── Letters ── */
  async function tabLetters(body, status = "submitted", page = 0) {
    let q = sb.from("letters")
      .select("id,user_id,title,body,status,recipient_type,community_id,public_display_permission,is_public,rejection_reason,public_notes,created_at,profiles!letters_user_id_fkey(full_name,email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE, page * PAGE + PAGE - 1);
    if (status !== "all") q = q.eq("status", status);
    if (state.filters.community) q = q.eq("community_id", state.filters.community);
    const { data, error, count } = await q;
    if (error) throw error;

    const statuses = ["submitted", "under_review", "approved", "delivered", "rejected", "draft", "all"];
    body.innerHTML = `
      <div class="padmin-toolbar">
        ${statuses.map((s) => `<button type="button" class="pfilter${s === status ? " is-active" : ""}"
          data-lstatus="${s}">${esc(s === "all" ? "All" : (cfg.letterStatuses[s] || { label: s }).label)}</button>`).join("")}
        <span class="phint">${count ?? 0} letter${count === 1 ? "" : "s"}</span>
      </div>
      <div class="ptable-wrap"><table class="ptable">
        <thead><tr><th>Title</th><th>From</th><th>For</th><th>Community</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>${(data || []).map((l) => `<tr>
          <td>${esc(l.title)}</td>
          <td>${esc((l.profiles || {}).full_name || "")}</td>
          <td>${esc((cfg.recipientGroups.find((g) => g.value === l.recipient_type) || {}).label || l.recipient_type)}</td>
          <td>${esc(commName(l.community_id))}</td>
          <td>${Portal.badge(cfg.letterStatuses, l.status)}${l.is_public ? ' <span class="pbadge pbadge--gold">Public</span>' : ""}</td>
          <td>${esc(fmtDate(l.created_at))}</td>
          <td class="ptable__actions"><button type="button" class="btn btn--ink btn--sm" data-letter="${l.id}">Review</button></td>
        </tr>`).join("")}</tbody></table></div>
      ${(data || []).length === 0 ? Portal.emptyState("No letters here", "Letters with this status will appear in this list.") : ""}
      <div class="padmin-pager">
        ${page > 0 ? `<button type="button" class="btn btn--ink btn--sm" data-page="${page - 1}">← Previous</button>` : ""}
        ${(count || 0) > (page + 1) * PAGE ? `<button type="button" class="btn btn--ink btn--sm" data-page="${page + 1}">Next →</button>` : ""}
      </div>`;

    body.querySelectorAll("[data-lstatus]").forEach((b) =>
      b.addEventListener("click", () => tabLetters(body, b.dataset.lstatus, 0)));
    body.querySelectorAll("[data-page]").forEach((b) =>
      b.addEventListener("click", () => tabLetters(body, status, Number(b.dataset.page))));

    body.querySelectorAll("[data-letter]").forEach((b) => b.addEventListener("click", async () => {
      const l = (data || []).find((x) => x.id === b.dataset.letter);
      const { data: notes } = await sb.from("admin_private_notes")
        .select("note,created_at").eq("subject_type", "letter").eq("subject_id", l.id)
        .order("created_at", { ascending: false });
      modal("Review letter", `
        <p><strong>${esc(l.title)}</strong> — from ${esc((l.profiles || {}).full_name || "")} (${esc((l.profiles || {}).email || "")})</p>
        <div class="pletter-paper" style="margin:1rem 0;"><p>${esc(l.body).replace(/\n/g, "<br>")}</p></div>
        <p>${Portal.badge(cfg.letterStatuses, l.status)} · Public display permission:
          <strong>${l.public_display_permission ? "given" : "NOT given"}</strong></p>
        <div class="pfield"><label for="lm-public-note">Public note to the author (they can see this)</label>
          <textarea class="pinput ptextarea" id="lm-public-note" rows="2">${esc(l.public_notes || "")}</textarea></div>
        <div class="pfield"><label for="lm-reject">Rejection reason (required to reject; shown to the author)</label>
          <input class="pinput" id="lm-reject" value="${esc(l.rejection_reason || "")}"></div>
        <label class="pcheck"><input type="checkbox" id="lm-ispublic" ${l.is_public ? "checked" : ""}
          ${l.public_display_permission ? "" : "disabled"}>
          <span>Show in the portal publicly (always without the author's name)${l.public_display_permission ? "" : " — author has not given permission"}</span></label>
        <div class="pfield"><label for="lm-private">Add a private admin note (authors can never see these)</label>
          <textarea class="pinput ptextarea" id="lm-private" rows="2" placeholder="Internal note…"></textarea></div>
        ${notes && notes.length ? `<details><summary>Previous private notes (${notes.length})</summary>
          <ul class="pactivity-list">${notes.map((n) => `<li><span>${esc(n.note)}</span><time>${esc(fmtDate(n.created_at))}</time></li>`).join("")}</ul></details>` : ""}
        <div class="btn-row" style="justify-content:flex-end;margin-top:1.4rem;flex-wrap:wrap;">
          <button type="button" class="btn btn--ink btn--sm" data-l-act="under_review">Mark under review</button>
          <button type="button" class="btn btn--sm pbtn-danger" data-l-act="rejected">Reject</button>
          <button type="button" class="btn btn--gold btn--sm" data-l-act="approved">Approve</button>
          <button type="button" class="btn btn--gold btn--sm" data-l-act="delivered">Mark delivered</button>
          <button type="button" class="btn btn--ink btn--sm" data-l-save>Save notes only</button>
        </div>`,
        (ov, close) => {
          const save = async (newStatus) => {
            const priv = ov.querySelector("#lm-private").value.trim();
            const upd = {
              public_notes: ov.querySelector("#lm-public-note").value.trim() || null,
              rejection_reason: ov.querySelector("#lm-reject").value.trim() || null,
              is_public: ov.querySelector("#lm-ispublic").checked,
            };
            if (newStatus) upd.status = newStatus;
            if (newStatus === "rejected" && !upd.rejection_reason) {
              Portal.toast("A rejection reason is required."); return;
            }
            const { error: e2 } = await sb.from("letters").update(upd).eq("id", l.id);
            if (e2) { Portal.toast(e2.message); return; }
            if (priv) await sb.from("admin_private_notes").insert({ subject_type: "letter", subject_id: l.id, note: priv });
            Portal.toast("Letter updated.");
            close();
            tabLetters(body, status, page);
          };
          ov.querySelectorAll("[data-l-act]").forEach((btn) =>
            btn.addEventListener("click", () => save(btn.dataset.lAct)));
          ov.querySelector("[data-l-save]").addEventListener("click", () => save(null));
        });
    }));
  }

  /* ── Requests ── */
  async function tabRequests(body, status = "submitted", page = 0) {
    let q = sb.from("activity_requests")
      .select("id,title,details,request_type,status,community_id,recipient_name,recipient_email,preferred_language,intended_audience,public_display_permission,email_permission,contact_permission,extra,public_notes,created_at,profiles!activity_requests_user_id_fkey(full_name,email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE, page * PAGE + PAGE - 1);
    if (status !== "all") q = q.eq("status", status);
    if (state.filters.community) q = q.eq("community_id", state.filters.community);
    const { data, error, count } = await q;
    if (error) throw error;

    const statuses = ["submitted", "under_review", "in_progress", "completed", "declined", "all"];
    body.innerHTML = `
      <div class="padmin-toolbar">
        ${statuses.map((s) => `<button type="button" class="pfilter${s === status ? " is-active" : ""}"
          data-rstatus="${s}">${esc(s === "all" ? "All" : (cfg.requestStatuses[s] || { label: s }).label)}</button>`).join("")}
        <span class="phint">${count ?? 0} request${count === 1 ? "" : "s"}</span>
      </div>
      <div class="ptable-wrap"><table class="ptable">
        <thead><tr><th>Request</th><th>Type</th><th>From</th><th>Community</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>${(data || []).map((r) => `<tr>
          <td>${esc(r.title)}</td><td>${esc(r.request_type.replace(/_/g, " "))}</td>
          <td>${esc((r.profiles || {}).full_name || "")}</td>
          <td>${esc(commName(r.community_id))}</td>
          <td>${Portal.badge(cfg.requestStatuses, r.status)}</td>
          <td>${esc(fmtDate(r.created_at))}</td>
          <td class="ptable__actions"><button type="button" class="btn btn--ink btn--sm" data-req="${r.id}">Respond</button></td>
        </tr>`).join("")}</tbody></table></div>
      ${(data || []).length === 0 ? Portal.emptyState("No requests here", "Requests with this status will appear in this list.") : ""}
      <div class="padmin-pager">
        ${page > 0 ? `<button type="button" class="btn btn--ink btn--sm" data-page="${page - 1}">← Previous</button>` : ""}
        ${(count || 0) > (page + 1) * PAGE ? `<button type="button" class="btn btn--ink btn--sm" data-page="${page + 1}">Next →</button>` : ""}
      </div>`;

    body.querySelectorAll("[data-rstatus]").forEach((b) =>
      b.addEventListener("click", () => tabRequests(body, b.dataset.rstatus, 0)));
    body.querySelectorAll("[data-page]").forEach((b) =>
      b.addEventListener("click", () => tabRequests(body, status, Number(b.dataset.page))));

    body.querySelectorAll("[data-req]").forEach((b) => b.addEventListener("click", () => {
      const r = (data || []).find((x) => x.id === b.dataset.req);
      const extras = Object.entries(r.extra || {}).map(([k, v]) => `<li><span>${esc(k.replace(/_/g, " "))}: ${esc(String(v))}</span></li>`).join("");
      modal("Respond to request", `
        <p><strong>${esc(r.title)}</strong> (${esc(r.request_type.replace(/_/g, " "))}) — from
          ${esc((r.profiles || {}).full_name || "")} (${esc((r.profiles || {}).email || "")})</p>
        <ul class="pactivity-list">
          ${r.recipient_name ? `<li><span>Recipient: ${esc(r.recipient_name)}${r.recipient_email ? " · " + esc(r.recipient_email) : ""}</span></li>` : ""}
          ${r.intended_audience ? `<li><span>Audience: ${esc(r.intended_audience)}</span></li>` : ""}
          ${r.preferred_language ? `<li><span>Language: ${esc(r.preferred_language)}</span></li>` : ""}
          <li><span>Community: ${esc(commName(r.community_id))}</span></li>
          <li><span>Permissions: ${r.email_permission ? "email ✓ " : ""}${r.contact_permission ? "contact ✓ " : ""}${r.public_display_permission ? "public display ✓" : ""}</span></li>
          ${extras}
        </ul>
        ${r.details ? `<div class="pletter-paper" style="margin:1rem 0;"><p>${esc(r.details).replace(/\n/g, "<br>")}</p></div>` : ""}
        <div class="pfield"><label for="rm-status">Status</label>
          <select class="pinput" id="rm-status">${Object.keys(cfg.requestStatuses).map((s) =>
            `<option value="${s}"${s === r.status ? " selected" : ""}>${esc(cfg.requestStatuses[s].label)}</option>`).join("")}</select></div>
        <div class="pfield"><label for="rm-public-note">Public note to the requester</label>
          <textarea class="pinput ptextarea" id="rm-public-note" rows="2">${esc(r.public_notes || "")}</textarea></div>
        <div class="pfield"><label for="rm-private">Add a private admin note</label>
          <textarea class="pinput ptextarea" id="rm-private" rows="2"></textarea></div>
        <div class="btn-row" style="justify-content:flex-end;margin-top:1rem;">
          <button type="button" class="btn btn--gold btn--sm" data-r-save>Save</button>
        </div>`,
        (ov, close) => {
          ov.querySelector("[data-r-save]").addEventListener("click", async () => {
            const priv = ov.querySelector("#rm-private").value.trim();
            const { error: e2 } = await sb.from("activity_requests").update({
              status: ov.querySelector("#rm-status").value,
              public_notes: ov.querySelector("#rm-public-note").value.trim() || null,
            }).eq("id", r.id);
            if (e2) { Portal.toast(e2.message); return; }
            if (priv) await sb.from("admin_private_notes").insert({ subject_type: "request", subject_id: r.id, note: priv });
            Portal.toast("Request updated.");
            close();
            tabRequests(body, status, page);
          });
        });
    }));
  }

  /* ── Content ── */
  async function tabContent(body, page = 0) {
    const { data, error, count } = await sb.from("content")
      .select("id,title,content_type,is_published,is_featured,is_public,published_at,created_at,video_url,image_url,description,body,language,content_communities(community_id)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE, page * PAGE + PAGE - 1);
    if (error) throw error;

    body.innerHTML = `
      <div class="padmin-toolbar">
        <button type="button" class="btn btn--gold btn--sm" data-content-new>+ Add content</button>
        <span class="phint">${count ?? 0} item${count === 1 ? "" : "s"} · Only published items appear to members; “Public” items also appear to logged-out visitors.</span>
      </div>
      <div class="ptable-wrap"><table class="ptable">
        <thead><tr><th>Title</th><th>Type</th><th>Communities</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>${(data || []).map((c) => `<tr>
          <td>${esc(c.title)}</td>
          <td>${esc((cfg.contentTypes[c.content_type] || {}).label || c.content_type)}</td>
          <td>${esc((c.content_communities || []).map((cc) => commName(cc.community_id)).join(", ") || "—")}</td>
          <td>${c.is_published ? '<span class="pbadge pbadge--green">Published</span>' : '<span class="pbadge pbadge--muted">Draft</span>'}
              ${c.is_public ? ' <span class="pbadge pbadge--gold">Public</span>' : ""}
              ${c.is_featured ? ' <span class="pbadge pbadge--blue">Featured</span>' : ""}</td>
          <td>${esc(fmtDate(c.published_at || c.created_at))}</td>
          <td class="ptable__actions">
            <button type="button" class="btn btn--ink btn--sm" data-content-edit="${c.id}">Edit</button>
            <button type="button" class="btn btn--ink btn--sm" data-content-pub="${c.id}" data-pub="${c.is_published}">
              ${c.is_published ? "Unpublish" : "Publish"}</button>
          </td>
        </tr>`).join("")}</tbody></table></div>
      ${(data || []).length === 0 ? Portal.emptyState("No content yet", "Add your first video, letter, or update with “+ Add content”.") : ""}
      <div class="padmin-pager">
        ${page > 0 ? `<button type="button" class="btn btn--ink btn--sm" data-page="${page - 1}">← Previous</button>` : ""}
        ${(count || 0) > (page + 1) * PAGE ? `<button type="button" class="btn btn--ink btn--sm" data-page="${page + 1}">Next →</button>` : ""}
      </div>`;

    body.querySelectorAll("[data-page]").forEach((b) =>
      b.addEventListener("click", () => tabContent(body, Number(b.dataset.page))));
    body.querySelector("[data-content-new]").addEventListener("click", () => contentModal(null, () => tabContent(body, page)));
    body.querySelectorAll("[data-content-edit]").forEach((b) => b.addEventListener("click", () => {
      contentModal((data || []).find((x) => x.id === b.dataset.contentEdit), () => tabContent(body, page));
    }));
    body.querySelectorAll("[data-content-pub]").forEach((b) => b.addEventListener("click", async () => {
      const publish = b.dataset.pub !== "true";
      const upd = { is_published: publish };
      if (publish) upd.published_at = new Date().toISOString();
      const { error: e2 } = await sb.from("content").update(upd).eq("id", b.dataset.contentPub);
      if (e2) Portal.toast(e2.message); else { Portal.toast(publish ? "Published." : "Unpublished."); tabContent(body, page); }
    }));
  }

  function contentModal(c, refresh) {
    const isNew = !c;
    const selected = new Set(((c && c.content_communities) || []).map((cc) => cc.community_id));
    modal(isNew ? "Add content" : "Edit content", `
      <div class="pfield"><label for="cm-title">Title</label>
        <input class="pinput" id="cm-title" value="${esc(c ? c.title : "")}" required></div>
      <div class="pfield"><label for="cm-type">Content type</label>
        <select class="pinput" id="cm-type">${Object.keys(cfg.contentTypes).map((t) =>
          `<option value="${t}"${c && c.content_type === t ? " selected" : ""}>${esc(cfg.contentTypes[t].label)}</option>`).join("")}</select></div>
      <div class="pfield"><label for="cm-desc">Short description</label>
        <textarea class="pinput ptextarea" id="cm-desc" rows="2">${esc(c ? c.description || "" : "")}</textarea></div>
      <div class="pfield"><label for="cm-video">Video URL (YouTube link or direct file — optional)</label>
        <input class="pinput" id="cm-video" value="${esc(c ? c.video_url || "" : "")}" placeholder="https://www.youtube.com/watch?v=…"></div>
      <div class="pfield"><label for="cm-image">Image URL (optional)</label>
        <input class="pinput" id="cm-image" value="${esc(c ? c.image_url || "" : "")}" placeholder="assets/images/… or https://…"></div>
      <div class="pfield"><label for="cm-body">Body text (optional; blank lines make paragraphs)</label>
        <textarea class="pinput ptextarea" id="cm-body" rows="5">${esc(c ? c.body || "" : "")}</textarea></div>
      <div class="pfield"><label for="cm-lang">Language (optional)</label>
        <input class="pinput" id="cm-lang" value="${esc(c ? c.language || "" : "")}" placeholder="English"></div>
      <fieldset class="pconsent"><legend>Communities (one or many)</legend>
        ${state.comms.map((co) => `<label class="pcheck"><input type="checkbox" data-cm-comm value="${co.id}"
          ${selected.has(co.id) ? "checked" : ""}><span>${esc(co.name)}</span></label>`).join("")}
      </fieldset>
      <label class="pcheck"><input type="checkbox" id="cm-published" ${c && c.is_published ? "checked" : ""}><span>Published (visible to members)</span></label>
      <label class="pcheck"><input type="checkbox" id="cm-public" ${c && c.is_public ? "checked" : ""}><span>Also public for logged-out visitors</span></label>
      <label class="pcheck"><input type="checkbox" id="cm-featured" ${c && c.is_featured ? "checked" : ""}><span>Featured</span></label>
      <div class="btn-row" style="justify-content:flex-end;margin-top:1.2rem;">
        ${isNew ? "" : '<button type="button" class="btn btn--sm pbtn-danger" data-cm-delete>Delete</button>'}
        <button type="button" class="btn btn--gold btn--sm" data-cm-save>${isNew ? "Create" : "Save"}</button>
      </div>`,
      (ov, close) => {
        ov.querySelector("[data-cm-save]").addEventListener("click", async () => {
          const title = ov.querySelector("#cm-title").value.trim();
          if (!title) { Portal.toast("A title is required."); return; }
          const commIds = [...ov.querySelectorAll("[data-cm-comm]:checked")].map((x) => x.value);
          if (!commIds.length) { Portal.toast("Choose at least one community."); return; }
          const row = {
            title,
            content_type: ov.querySelector("#cm-type").value,
            description: ov.querySelector("#cm-desc").value.trim() || null,
            video_url: ov.querySelector("#cm-video").value.trim() || null,
            image_url: ov.querySelector("#cm-image").value.trim() || null,
            body: ov.querySelector("#cm-body").value.trim() || null,
            language: ov.querySelector("#cm-lang").value.trim() || null,
            is_published: ov.querySelector("#cm-published").checked,
            is_public: ov.querySelector("#cm-public").checked,
            is_featured: ov.querySelector("#cm-featured").checked,
          };
          if (row.is_published && !(c && c.published_at)) row.published_at = new Date().toISOString();
          let id = c && c.id, e2;
          if (isNew) {
            const res = await sb.from("content").insert(row).select("id").single();
            e2 = res.error; id = res.data && res.data.id;
          } else {
            ({ error: e2 } = await sb.from("content").update(row).eq("id", id));
          }
          if (e2) { Portal.toast(e2.message); return; }
          /* sync community assignments (composite unique key prevents duplicates) */
          await sb.from("content_communities").delete().eq("content_id", id);
          const { error: e3 } = await sb.from("content_communities")
            .insert(commIds.map((cid) => ({ content_id: id, community_id: cid })));
          if (e3) { Portal.toast(e3.message); return; }
          Portal.toast(isNew ? "Content created." : "Content saved.");
          close(); refresh();
        });
        const del = ov.querySelector("[data-cm-delete]");
        if (del) del.addEventListener("click", async () => {
          if (!(await confirmModal("Delete this content?", "Members will lose access and video progress rows for it will be removed. This cannot be undone.", "Delete content", true))) return;
          const { error: e2 } = await sb.from("content").delete().eq("id", c.id);
          if (e2) Portal.toast(e2.message); else { Portal.toast("Content deleted."); close(); refresh(); }
        });
      });
  }

  /* ── Activities ── */
  async function tabActivities(body) {
    const [{ data, error }, { data: links }] = await Promise.all([
      sb.from("activity_definitions").select("*").order("created_at", { ascending: false }),
      sb.from("activity_communities").select("activity_id,community_id"),
    ]);
    if (error) throw error;
    const linksBy = {};
    (links || []).forEach((l) => { (linksBy[l.activity_id] = linksBy[l.activity_id] || []).push(l.community_id); });

    body.innerHTML = `
      <div class="padmin-toolbar">
        <button type="button" class="btn btn--gold btn--sm" data-act-new>+ Add activity</button>
        <span class="phint">Config-driven activities — new kinds of participation without rebuilding the portal.</span>
      </div>
      <div class="ptable-wrap"><table class="ptable">
        <thead><tr><th>Name</th><th>Type</th><th>Communities</th><th>Status</th><th></th></tr></thead>
        <tbody>${(data || []).map((a) => `<tr>
          <td>${esc(a.name)}</td><td>${esc(a.activity_type.replace(/_/g, " "))}</td>
          <td>${esc((linksBy[a.id] || []).map(commName).join(", ") || "—")}</td>
          <td>${a.is_active ? '<span class="pbadge pbadge--green">Active</span>' : '<span class="pbadge pbadge--muted">Inactive</span>'}</td>
          <td class="ptable__actions">
            <button type="button" class="btn btn--ink btn--sm" data-act-edit="${a.id}">Edit</button>
            <button type="button" class="btn btn--ink btn--sm" data-act-toggle="${a.id}" data-active="${a.is_active}">
              ${a.is_active ? "Deactivate" : "Activate"}</button>
          </td></tr>`).join("")}</tbody></table></div>
      ${(data || []).length === 0 ? Portal.emptyState("No activities yet", "Add your first activity for members to try.") : ""}`;

    body.querySelector("[data-act-new]").addEventListener("click", () => activityModal(null, [], () => tabActivities(body)));
    body.querySelectorAll("[data-act-edit]").forEach((b) => b.addEventListener("click", () => {
      const a = (data || []).find((x) => x.id === b.dataset.actEdit);
      activityModal(a, linksBy[a.id] || [], () => tabActivities(body));
    }));
    body.querySelectorAll("[data-act-toggle]").forEach((b) => b.addEventListener("click", async () => {
      const active = b.dataset.active !== "true";
      const { error: e2 } = await sb.from("activity_definitions").update({ is_active: active }).eq("id", b.dataset.actToggle);
      if (e2) Portal.toast(e2.message); else { Portal.toast(active ? "Activity activated." : "Activity deactivated."); tabActivities(body); }
    }));
  }

  function activityModal(a, commIds, refresh) {
    const isNew = !a;
    const selected = new Set(commIds);
    modal(isNew ? "Add activity" : "Edit activity", `
      <div class="pfield"><label for="am-name">Name</label>
        <input class="pinput" id="am-name" value="${esc(a ? a.name : "")}"></div>
      <div class="pfield"><label for="am-slug">Slug (lowercase, hyphens; used in the URL — don't change once shared)</label>
        <input class="pinput" id="am-slug" value="${esc(a ? a.slug : "")}" ${isNew ? "" : "readonly"}></div>
      <div class="pfield"><label for="am-type">Activity type</label>
        <input class="pinput" id="am-type" value="${esc(a ? a.activity_type : "activity")}" placeholder="rhythm_activity"></div>
      <div class="pfield"><label for="am-desc">Description</label>
        <textarea class="pinput ptextarea" id="am-desc" rows="2">${esc(a ? a.description || "" : "")}</textarea></div>
      <div class="pfield"><label for="am-inst">Instructions (shown to members)</label>
        <textarea class="pinput ptextarea" id="am-inst" rows="3">${esc(a ? a.instructions || "" : "")}</textarea></div>
      <div class="pfield"><label for="am-conf">Configuration JSON (optional: {"steps":[…], "fields":[{"key","label","type"}], "reflection":"…"})</label>
        <textarea class="pinput ptextarea" id="am-conf" rows="4">${esc(a ? JSON.stringify(a.configuration || {}, null, 2) : "{}")}</textarea></div>
      <fieldset class="pconsent"><legend>Communities</legend>
        ${state.comms.map((co) => `<label class="pcheck"><input type="checkbox" data-am-comm value="${co.id}"
          ${selected.has(co.id) ? "checked" : ""}><span>${esc(co.name)}</span></label>`).join("")}
      </fieldset>
      <label class="pcheck"><input type="checkbox" id="am-active" ${!a || a.is_active ? "checked" : ""}><span>Active</span></label>
      <div class="btn-row" style="justify-content:flex-end;margin-top:1.2rem;">
        <button type="button" class="btn btn--gold btn--sm" data-am-save>${isNew ? "Create" : "Save"}</button>
      </div>`,
      (ov, close) => {
        ov.querySelector("[data-am-save]").addEventListener("click", async () => {
          const name = ov.querySelector("#am-name").value.trim();
          const slug = ov.querySelector("#am-slug").value.trim().toLowerCase();
          if (!name || !/^[a-z0-9-]{2,60}$/.test(slug)) { Portal.toast("A name and a valid slug (lowercase letters, numbers, hyphens) are required."); return; }
          let conf;
          try { conf = JSON.parse(ov.querySelector("#am-conf").value || "{}"); }
          catch { Portal.toast("The configuration JSON isn't valid."); return; }
          const ids = [...ov.querySelectorAll("[data-am-comm]:checked")].map((x) => x.value);
          const row = {
            name, slug,
            activity_type: ov.querySelector("#am-type").value.trim() || "activity",
            description: ov.querySelector("#am-desc").value.trim() || null,
            instructions: ov.querySelector("#am-inst").value.trim() || null,
            configuration: conf,
            is_active: ov.querySelector("#am-active").checked,
          };
          let id = a && a.id, e2;
          if (isNew) {
            const res = await sb.from("activity_definitions").insert(row).select("id").single();
            e2 = res.error; id = res.data && res.data.id;
          } else {
            ({ error: e2 } = await sb.from("activity_definitions").update(row).eq("id", id));
          }
          if (e2) { Portal.toast(e2.message); return; }
          await sb.from("activity_communities").delete().eq("activity_id", id);
          if (ids.length) await sb.from("activity_communities")
            .insert(ids.map((cid) => ({ activity_id: id, community_id: cid })));
          Portal.toast(isNew ? "Activity created." : "Activity saved.");
          close(); refresh();
        });
      });
  }

  /* ── boot ── */
  (async () => {
    const p = await Portal.requireAdmin();
    if (!p) return;
    state.comms = await Portal.communities().catch(() => []);
    renderShell(p);
  })().catch((e) => {
    const el = root();
    if (el) el.innerHTML = Portal.errorState(Portal.friendlyError(e));
  });
})();
