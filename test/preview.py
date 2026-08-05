#!/usr/bin/env python3
# ============================================================
# LOCAL PREVIEW SERVER (Python twin of test/preview.js) — test
# the Community Portal in a real browser with NO database, NO
# account, and NO Node.js. macOS ships python3, so this always
# works:
#
#     python3 test/preview.py
#         →  http://localhost:8010/community/home.html
#
# Identical behavior to `npm run preview`:
#   · Serves this repo statically (standard library only).
#   · Swaps js/vendor/supabase.js for the offline stub used by
#     the automated tests, pre-loaded with the sample data in
#     test/preview-fixtures.json — you are "signed in" as
#     Sample Member and every portal page renders fully.
#   · Injects a ribbon on portal/admin pages so a preview tab
#     can never be mistaken for the real site.
#   · Nothing is saved: forms succeed in memory only, and the
#     real Supabase project is never contacted.
#
# To test against the REAL database instead, use the classic:
#     python3 -m http.server 8000    (see supabase/PORTAL-SETUP.md)
#
# PORT env var overrides the default port, e.g. PORT=9000.
# ============================================================
import json
import os
import re
import sys
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORT = int(os.environ.get("PORT", "8010"))

RIBBON = (
    '\n<div role="status" style="position:fixed;left:0;right:0;bottom:0;z-index:99999;'
    "text-align:center;padding:7px 12px;font:600 12.5px/1.3 system-ui,sans-serif;"
    "letter-spacing:.04em;background:#13233A;color:#FAF8F3;border-top:2px solid #C4A24E;\">\n"
    "  LOCAL PREVIEW — sample data · signed in as “Sample Member” · nothing is saved, "
    "the real database is never touched\n</div>"
)

MIME = {
    ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8", ".json": "application/json",
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml", ".ico": "image/x-icon", ".gif": "image/gif",
    ".webp": "image/webp", ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8",
    ".woff": "font/woff", ".woff2": "font/woff2", ".mp4": "video/mp4", ".pdf": "application/pdf",
}


def stub_js():
    """The offline Supabase stub straight from the test suite + fixtures."""
    tests = (ROOT / "test" / "portal.test.js").read_text(encoding="utf-8")
    m = re.search(r"const STUB = `([\s\S]*?)`;", tests)
    if not m:
        raise RuntimeError("Could not extract the Supabase stub from test/portal.test.js")
    fixtures = (ROOT / "test" / "preview-fixtures.json").read_text(encoding="utf-8")
    return (
        "/* LOCAL PREVIEW STUB — replaces supabase-js; no network, no persistence */\n"
        + "window.__stubState = " + fixtures + ";\n" + m.group(1)
    )


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            url_path = urllib.parse.unquote(self.path.split("?")[0].split("#")[0])
            if url_path.endswith("/"):
                url_path += "index.html"

            if url_path == "/js/vendor/supabase.js":
                body = stub_js().encode("utf-8")
                self._send(200, MIME[".js"], body)
                return

            file = (ROOT / url_path.lstrip("/")).resolve()
            if not str(file).startswith(str(ROOT) + os.sep):
                self._send(403, "text/plain", b"Forbidden")
                return
            if not file.is_file():
                self._send(404, "text/plain", b"Not found")
                return

            body = file.read_bytes()
            ext = file.suffix.lower()
            if ext == ".html" and (url_path.startswith("/community/") or url_path.startswith("/admin/")):
                body = body.replace(b"</body>", RIBBON.encode("utf-8") + b"\n</body>")
            self._send(200, MIME.get(ext, "application/octet-stream"), body)
        except Exception as e:  # noqa: BLE001 — a preview server should never crash
            self._send(500, "text/plain", ("Preview server error: " + str(e)).encode("utf-8"))

    def _send(self, status, ctype, body):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):  # keep the terminal calm
        pass


def main():
    try:
        server = ThreadingHTTPServer(("", PORT), Handler)
    except OSError:
        print(f"Port {PORT} is busy — try: PORT=8020 python3 test/preview.py")
        sys.exit(1)
    print()
    print("  WE ARE WITH YOU — local portal preview (sample data, no database)")
    print()
    print(f"  Portal hub:   http://localhost:{PORT}/community/home.html")
    print(f"  Public site:  http://localhost:{PORT}/")
    print()
    print("  You are already “signed in” as Sample Member. Forms succeed in")
    print("  memory only; the real Supabase project is never contacted.")
    print("  Stop with Ctrl+C.")
    print()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Preview stopped.")


if __name__ == "__main__":
    main()
