#!/bin/bash
# ============================================================
# WE ARE WITH YOU — Community Portal local preview
# Double-click this file in Finder. It opens the portal in your
# browser with sample data — no account, no database, nothing
# is saved. Close this Terminal window (or press Ctrl+C) to stop.
#
# (If macOS warns about an unidentified developer the first time:
#  right-click the file → Open → Open.)
# ============================================================
cd "$(dirname "$0")" || exit 1

PORT="${PORT:-8010}"
URL="http://localhost:${PORT}/community/home.html"

echo ""
echo "  Starting the portal preview…"
echo "  ${URL}"
echo ""

# open the browser once the server is up
( sleep 2 && open "${URL}" ) &

# prefer Node, fall back to the built-in Python — same server either way
if command -v node >/dev/null 2>&1; then
  exec node test/preview.js
elif command -v python3 >/dev/null 2>&1; then
  exec python3 test/preview.py
else
  echo "Neither node nor python3 was found on this Mac." >&2
  echo "Install Xcode Command Line Tools (xcode-select --install) and try again." >&2
  read -r -p "Press Return to close…" _
  exit 1
fi
