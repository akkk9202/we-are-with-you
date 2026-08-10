#!/bin/bash
# ============================================================
# WE ARE WITH YOU — public site local preview
# Double-click this file in Finder. It serves this folder and
# opens the compacted homepage in your browser. Close this
# Terminal window (or press Ctrl+C) to stop.
#
# (If macOS warns about an unidentified developer the first time:
#  right-click the file → Open → Open.)
# ============================================================
cd "$(dirname "$0")" || exit 1

PORT="${PORT:-8020}"
URL="http://localhost:${PORT}/index.html"

echo ""
echo "  Starting the site preview…"
echo "  ${URL}"
echo ""

# open the browser once the server is up
( sleep 2 && open "${URL}" ) &

if command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server "${PORT}"
elif command -v node >/dev/null 2>&1; then
  exec npx --yes http-server -p "${PORT}" -c-1
else
  echo "Neither python3 nor node was found on this Mac." >&2
  read -r -p "Press Return to close…" _
  exit 1
fi
