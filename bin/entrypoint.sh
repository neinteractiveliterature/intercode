#!/bin/bash
set -e

if [ -n "$CHAMBER_SERVICE" ]; then
  exec chamber exec "$CHAMBER_SERVICE" -- "$@"
else
  exec "$@"
fi
