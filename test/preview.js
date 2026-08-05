/* ============================================================
   LOCAL PREVIEW SERVER — test the Community Portal in a real
   browser with NO database and NO account.

     npm run preview          →  http://localhost:8010/community/home.html
   No Node? The same server exists in Python (macOS built-in):
     python3 test/preview.py
   No Terminal? Double-click "Preview Portal.command" in Finder.

   What it does:
   · Serves this repo statically (zero dependencies, Node only).
   · Swaps js/vendor/supabase.js for the same offline stub the
     test suite uses, pre-loaded with rich sample data — so you
     are "signed in" as Sample Member and every page (the five-
     option hub, With You, Melody Box, Bloom Bank, Hope Capsule,
     community pages, My Activity, forms…) renders fully.
   · Injects a small ribbon on portal/admin pages so a preview
     tab can never be mistaken for the real site.
   · Nothing is saved anywhere: form submissions succeed in
     memory only, and the real Supabase project is never touched.

   To test against the REAL database instead, use the classic:
     python3 -m http.server 8000     (see supabase/PORTAL-SETUP.md)

   PORT env var overrides the default port, e.g. PORT=9000.
   ============================================================ */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DEFAULT_PORT = Number(process.env.PORT) || 8010;

/* ── the same Supabase stub the automated tests run against ── */
function stubSource() {
  const tests = fs.readFileSync(path.join(__dirname, "portal.test.js"), "utf8");
  const m = tests.match(/const STUB = `([\s\S]*?)`;/);
  if (!m) throw new Error("Could not extract the Supabase stub from test/portal.test.js");
  return m[1];
}

/* ── sample data (shared with test/preview.py) ── */
const FIXTURES = JSON.parse(fs.readFileSync(path.join(__dirname, "preview-fixtures.json"), "utf8"));

/* ── ribbon injected into portal/admin pages ── */
const RIBBON = `
<div role="status" style="position:fixed;left:0;right:0;bottom:0;z-index:99999;text-align:center;
  padding:7px 12px;font:600 12.5px/1.3 system-ui,sans-serif;letter-spacing:.04em;
  background:#13233A;color:#FAF8F3;border-top:2px solid #C4A24E;">
  LOCAL PREVIEW — sample data · signed in as “Sample Member” · nothing is saved, the real database is never touched
</div>`;

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".gif": "image/gif",
  ".webp": "image/webp", ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8",
  ".woff": "font/woff", ".woff2": "font/woff2", ".mp4": "video/mp4", ".pdf": "application/pdf",
};

function createServer(fixtures = FIXTURES) {
  return http.createServer((req, res) => {
    try {
      let urlPath = decodeURIComponent((req.url || "/").split("?")[0].split("#")[0]);
      if (urlPath.endsWith("/")) urlPath += "index.html";

      /* the one special file: vendored supabase → offline stub + data */
      if (urlPath === "/js/vendor/supabase.js") {
        res.writeHead(200, { "Content-Type": MIME[".js"], "Cache-Control": "no-store" });
        res.end(`/* LOCAL PREVIEW STUB — replaces supabase-js; no network, no persistence */\n` +
                `window.__stubState = ${JSON.stringify(fixtures)};\n${stubSource()}`);
        return;
      }

      const file = path.normalize(path.join(ROOT, urlPath));
      if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); res.end("Forbidden"); return; }
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end("Not found"); return; }

      const ext = path.extname(file).toLowerCase();
      let body = fs.readFileSync(file);
      if (ext === ".html" && (urlPath.startsWith("/community/") || urlPath.startsWith("/admin/"))) {
        body = Buffer.from(body.toString("utf8").replace("</body>", `${RIBBON}\n</body>`));
      }
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": "no-store" });
      res.end(body);
    } catch (e) {
      res.writeHead(500); res.end("Preview server error: " + e.message);
    }
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(DEFAULT_PORT, () => {
    console.log("");
    console.log("  WE ARE WITH YOU — local portal preview (sample data, no database)");
    console.log("");
    console.log(`  Portal hub:   http://localhost:${DEFAULT_PORT}/community/home.html`);
    console.log(`  Public site:  http://localhost:${DEFAULT_PORT}/`);
    console.log("");
    console.log("  You are already “signed in” as Sample Member. Forms succeed in");
    console.log("  memory only; the real Supabase project is never contacted.");
    console.log("  Stop with Ctrl+C.");
    console.log("");
  });
  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.error(`Port ${DEFAULT_PORT} is busy — try: PORT=8020 npm run preview`);
      process.exit(1);
    }
    throw e;
  });
}

module.exports = { createServer, FIXTURES };
