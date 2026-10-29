#!/bin/sh
# Runs when the nginx container starts (the official image runs everything in /docker-entrypoint.d/). Starts from a fresh
# copy of the build each time, because the substitution can only be done once per copy.
set -eu

dist=/usr/share/intercode-assets
html=/usr/share/nginx/html

rm -rf "${html:?}"/*
cp -a "$dist/." "$html/"
/usr/local/bin/substituteAssetsHost.sh "$html" "${ASSETS_HOST:-}"

# With RAILS_UPSTREAM (host:port of the Rails container) this container is also the front server: it proxies the Rails
# routes and sends crawlers to Rails, as in deploy/README.md. Without it, it only serves the build.
if [ -n "${RAILS_UPSTREAM:-}" ]; then
  case "$RAILS_UPSTREAM" in
    *[!A-Za-z0-9.:_-]*)
      echo "40-substitute-assets-host.sh: RAILS_UPSTREAM should be host:port, got: $RAILS_UPSTREAM" >&2
      exit 1
      ;;
  esac
  envsubst '${RAILS_UPSTREAM}' < /etc/nginx/intercode/front-proxy.conf.template > /etc/nginx/conf.d/default.conf
fi
