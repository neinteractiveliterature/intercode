#!/bin/sh
# Runs when the nginx container starts (the official image runs everything in /docker-entrypoint.d/). Starts from a fresh
# copy of the build each time, because the substitution can only be done once per copy.
set -eu

dist=/usr/share/intercode-assets
html=/usr/share/nginx/html

rm -rf "${html:?}"/*
cp -a "$dist/." "$html/"
/usr/local/bin/substituteAssetsHost.sh "$html" "${ASSETS_HOST:-}"
