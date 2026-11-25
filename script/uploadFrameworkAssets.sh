#!/usr/bin/env bash
# Uploads a release's framework-mode build (index.html and assets/, with the assets host already substituted for
# same-origin use) to the static shell bucket, then marks the files that earlier releases left behind and this release
# no longer contains as obsolete. See terraform/modules/assets_bucket_intercode and the static shell mode of
# terraform/modules/cloudfront_intercode.
#
# Usage: script/uploadFrameworkAssets.sh <bucket> <build-dir> [all|hashed|publish]
#
# The release workflow runs it in two phases, so that the new frontend only goes live once the new backend is:
#   hashed   uploads assets/, which nothing refers to until index.html does, so this can run alongside the backend
#            deploy
#   publish  uploads index.html, which makes the new frontend live, then marks the dropped files obsolete
# The default, all, runs both in that order.
#
# The assets bucket, which only serves the hashed files to pages that Rails serves, has no use for index.html: set
# UPLOAD_INDEX=false and the publish phase only marks the obsolete files.
#
# INDEX_MAX_AGE (seconds, default 60) is how long index.html stays fresh; keep it in step with the distribution's
# static_shell_ttl. INDEX_STALE_WHILE_REVALIDATE (seconds, default 300, 0 to leave it out) is how much longer an
# expired copy may be served while it is refetched in the background, so that a quiet site's visitors don't wait for
# that. CloudFront cuts the window off at the cache policy's maximum TTL (static_shell_max_ttl). The hashed files in
# assets/ never change, so they are cached for a long time.
set -euo pipefail

bucket="$1"
build_dir="${2%/}"
index_max_age="${INDEX_MAX_AGE:-60}"
index_stale_while_revalidate="${INDEX_STALE_WHILE_REVALIDATE:-300}"
upload_index="${UPLOAD_INDEX:-true}"
phase="${3:-all}"

case "$phase" in
  all | hashed | publish) ;;
  *)
    echo "Unknown phase: $phase (expected all, hashed or publish)" >&2
    exit 1
    ;;
esac

if [ "$phase" != publish ]; then
  # Upload every file, not only new ones. Uploading replaces the object, which also clears an `obsolete` tag left on a
  # file that has come back into the release.
  aws s3 cp "$build_dir/assets" "s3://$bucket/assets" --recursive --cache-control "public, max-age=15552000"
fi

if [ "$phase" != hashed ]; then
  if [ "$upload_index" = true ]; then
    index_cache_control="public, max-age=$index_max_age"
    if [ "$index_stale_while_revalidate" != 0 ]; then
      index_cache_control+=", stale-while-revalidate=$index_stale_while_revalidate"
    fi

    # index.html goes last, so that it never names a file that isn't in the bucket yet
    aws s3 cp "$build_dir/index.html" "s3://$bucket/index.html" \
      --cache-control "$index_cache_control" --content-type "text/html"
  fi

  (cd "$build_dir" && find assets -type f) | "$(dirname "$0")/mark_obsolete_assets.py" "$bucket" assets/
fi
