#!/bin/sh
# Sets up a framework-mode build (yarn build:framework) so that Rails can serve it: the shell goes to a copy with the
# assets host substituted for same-origin assets (see substituteAssetsHost.sh), and the hashed files go to public/assets,
# where Rails serves them. Run it again after every build; it replaces what it made before, including all of
# public/assets, which nothing else uses.
#
# Usage: prepareStaticShell.sh [build-dir] [shell-dir] [assets-host]
#   build-dir    the build's client directory (default build/framework/client)
#   shell-dir    where to put the shell (default tmp/static-shell)
#   assets-host  where browsers load the hashed files from, as in ASSETS_HOST (default none: the app's own domain)
#
# Then start Rails (or run the system tests) with STATIC_SHELL_DIR set to the shell directory, which this prints.
set -eu

root="$(cd "$(dirname "$0")/.." && pwd)"
build="${1:-$root/build/framework/client}"
shell="${2:-$root/tmp/static-shell}"
assets_host="${3:-}"

if [ ! -f "$build/index.html" ]; then
  echo "prepareStaticShell.sh: no $build/index.html; run yarn build:framework first" >&2
  exit 1
fi

rm -rf "$shell"
mkdir -p "$shell"
cp -a "$build/." "$shell/"
"$root/script/substituteAssetsHost.sh" "$shell" "$assets_host"

rm -rf "$root/public/assets"
mkdir -p "$root/public/assets"
cp -a "$shell/assets/." "$root/public/assets/"

echo "STATIC_SHELL_DIR=$(cd "$shell" && pwd)"
