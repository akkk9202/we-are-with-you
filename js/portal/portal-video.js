/* ============================================================
   PORTAL VIDEO — real playback tracking (Phase 11).
   · YouTube links use the official IFrame API; direct video files
     use native HTML5 media events. (If a non-YouTube embed is ever
     added, it plays in a plain iframe and records open events only.)
   · Progress is saved on a throttle (every ~10s of playback), on
     pause, on end, and when the tab is hidden — never every second.
   · The DATABASE computes percentages, milestone flags, completion
     (≥90% or the actual ended event), and fires each milestone
     engagement event exactly once per user + video (see migration
     002). The client only ever reports seconds watched.
   ============================================================ */
/* global Portal */

const PortalVideo = (() => {
  "use strict";
  const SAVE_INTERVAL_MS = 10000;

  let ytApiPromise = null;
  function loadYouTubeApi() {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (ytApiPromise) return ytApiPromise;
    ytApiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(window.YT); };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
    return ytApiPromise;
  }

  /* Mount a tracked player for a content row inside `container`.
     Returns a controller with a `destroy()` method. */
  async function mount(container, content, existingProgress) {
    const sb = Portal.sb;
    const state = {
      lastSavedAt: 0,
      lastSeconds: existingProgress ? Number(existingProgress.progress_seconds) || 0 : 0,
      total: existingProgress ? Number(existingProgress.total_seconds) || null : null,
      started: false,
      saving: false,
      destroyed: false,
    };

    async function save(seconds, total, { force } = {}) {
      if (state.destroyed || state.saving) return;
      const now = Date.now();
      if (!force && now - state.lastSavedAt < SAVE_INTERVAL_MS) return;   // throttle
      if (seconds == null || !(seconds >= 0)) return;
      state.saving = true;
      state.lastSavedAt = now;
      try {
        const session = await Portal.session();
        if (!session) return;
        await sb.from("video_progress").upsert({
          user_id: session.user.id,
          content_id: content.id,
          progress_seconds: Math.round(seconds),
          total_seconds: total ? Math.round(total) : state.total,
        }, { onConflict: "user_id,content_id" });
        state.lastSeconds = seconds;
        if (total) state.total = total;
      } catch (e) {
        if (window.console) console.warn("progress not saved:", e && e.message);
      } finally {
        state.saving = false;
      }
    }

    function markStarted() {
      if (state.started) return;
      state.started = true;
      Portal.logEvent("video_started", { contentId: content.id, oncePerPage: true });
    }

    const resumeAt = existingProgress && !existingProgress.completed &&
      Number(existingProgress.progress_seconds) > 5
      ? Math.max(0, Number(existingProgress.progress_seconds) - 3) : 0;

    const ytId = Portal.ytVideoId(content.video_url);

    /* ── YouTube ── */
    if (ytId) {
      const YT = await loadYouTubeApi();
      const holder = document.createElement("div");
      container.innerHTML = "";
      container.appendChild(holder);
      let pollTimer = null;
      const player = new YT.Player(holder, {
        videoId: ytId,
        width: "100%", height: "100%",
        playerVars: { rel: 0, start: Math.floor(resumeAt) },
        events: {
          onStateChange: (ev) => {
            const S = YT.PlayerState;
            if (ev.data === S.PLAYING) {
              markStarted();
              if (!pollTimer) {
                pollTimer = setInterval(() => {
                  try { save(player.getCurrentTime(), player.getDuration()); } catch { /* noop */ }
                }, 1000);
              }
            } else {
              if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
              try {
                if (ev.data === S.PAUSED) save(player.getCurrentTime(), player.getDuration(), { force: true });
                if (ev.data === S.ENDED) {
                  const d = player.getDuration();
                  save(d, d, { force: true });   // ended → 100% → completed (server side)
                }
              } catch { /* noop */ }
            }
          },
        },
      });
      const onHide = () => {
        if (document.visibilityState === "hidden") {
          try { save(player.getCurrentTime(), player.getDuration(), { force: true }); } catch { /* noop */ }
        }
      };
      document.addEventListener("visibilitychange", onHide);
      return {
        destroy() {
          state.destroyed = true;
          document.removeEventListener("visibilitychange", onHide);
          if (pollTimer) clearInterval(pollTimer);
          try { player.destroy(); } catch { /* noop */ }
        },
      };
    }

    /* ── direct video file (mp4/webm/…) ── */
    if (/\.(mp4|webm|ogv|ogg|mov|m4v)(\?|#|$)/i.test(content.video_url || "")) {
      container.innerHTML = "";
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "metadata";
      video.src = content.video_url;
      video.style.width = "100%";
      video.setAttribute("aria-label", content.title);
      container.appendChild(video);
      if (resumeAt) video.addEventListener("loadedmetadata", () => { video.currentTime = resumeAt; }, { once: true });
      video.addEventListener("play", markStarted);
      video.addEventListener("timeupdate", () => save(video.currentTime, video.duration));
      video.addEventListener("pause", () => save(video.currentTime, video.duration, { force: true }));
      video.addEventListener("ended", () => save(video.duration, video.duration, { force: true }));
      const onHide = () => {
        if (document.visibilityState === "hidden") save(video.currentTime, video.duration, { force: true });
      };
      document.addEventListener("visibilitychange", onHide);
      return {
        destroy() {
          state.destroyed = true;
          document.removeEventListener("visibilitychange", onHide);
          video.pause();
        },
      };
    }

    /* ── unknown embed provider: plain iframe, open-tracking only ── */
    container.innerHTML =
      `<iframe src="${Portal.esc(content.video_url)}" title="${Portal.esc(content.title)}"
        allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen
        style="width:100%;height:100%;border:0;"></iframe>`;
    return { destroy() { state.destroyed = true; } };
  }

  return { mount };
})();
