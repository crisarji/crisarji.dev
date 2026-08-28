#!/usr/bin/env bash
# Free the dev port before starting Astro.
#
# Astro 7 runs `astro dev` as a background daemon that outlives the shell that
# started it, so a stale server from a previous session will refuse the next
# `npm run dev`. This asks Astro to stop its own daemon first, and only falls
# back to signalling the process directly if something else is squatting.
#
# Usage: scripts/free-port.sh [port]   (default 4321, or $PORT)

set -euo pipefail

PORT="${1:-${PORT:-4321}}"

# Only ever consider processes *listening* on the port. Matching all sockets
# would also catch client connections in TIME_WAIT, which own nothing.
listener() { lsof -t -i:"$PORT" -sTCP:LISTEN 2>/dev/null || true; }

pid="$(listener)"
if [ -z "$pid" ]; then
  exit 0
fi

echo "port $PORT is held by pid $pid — freeing it"

# Preferred path: let Astro shut its own daemon down cleanly.
if npx --no-install astro dev stop >/dev/null 2>&1; then
  sleep 1
  [ -z "$(listener)" ] && { echo "  stopped the astro dev server"; exit 0; }
fi

# Otherwise signal the listener itself: TERM first, KILL only if it ignores us.
for sig in TERM KILL; do
  pid="$(listener)"
  [ -z "$pid" ] && break
  echo "  sending SIG$sig to $pid"
  kill "-$sig" $pid 2>/dev/null || true
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    [ -z "$(listener)" ] && break
    sleep 0.3
  done
done

if [ -n "$(listener)" ]; then
  echo "  could not free port $PORT — still held by $(listener)" >&2
  exit 1
fi

echo "  port $PORT is free"
