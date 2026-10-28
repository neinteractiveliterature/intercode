#!/bin/sh
# Points the framework-mode build at its assets host. The build is made against a placeholder base URL (see
# vite.framework.config.mts), because ASSETS_HOST is only known when the container starts; this replaces it in every file
# that contains it (index.html, the route manifest, extracted CSS).
#
# Usage: substituteAssetsHost.sh <directory> [assets-host]
#
# With an assets host (a bare host name, optionally with a port, as in ASSETS_HOST) URLs become https://<host>/...;
# with none they become /..., for assets served from the app's own domain.
#
# This edits files in place, and the placeholder is gone afterwards, so run it once on a fresh copy of the build.
set -eu

placeholder='https://ASSETHOSTPLACEHOLDER.invalid/'
directory="$1"
host="${2:-}"

case "$host" in
  *[!A-Za-z0-9.:-]*)
    echo "substituteAssetsHost.sh: ASSETS_HOST should be a bare host name (optionally with a port), got: $host" >&2
    exit 1
    ;;
esac

if [ -n "$host" ]; then
  replacement="https://$host/"
else
  replacement="/"
fi

grep -rl --binary-files=without-match -F "$placeholder" "$directory" | while read -r file; do
  sed "s|$placeholder|$replacement|g" "$file" > "$file.substituting"
  cat "$file.substituting" > "$file"
  rm "$file.substituting"
done
exit 0
