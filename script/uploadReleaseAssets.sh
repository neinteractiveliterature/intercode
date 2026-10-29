#!/usr/bin/env bash
# Uploads a release's built packs to the assets bucket (see terraform/modules/assets_bucket_intercode), then marks the
# files that earlier releases left behind and this release no longer contains as obsolete, which starts the bucket's
# lifecycle rule counting down to their expiry.
#
# Usage: script/uploadReleaseAssets.sh <bucket> <packs-dir> [all|hashed|publish]
#
# The release workflow runs it in two phases, so that the new frontend only goes live once the new backend is:
#   hashed   uploads the hashed files, which nothing refers to until the entry files do, so this can run alongside the
#            backend deploy
#   publish  uploads the unhashed entry files, which makes the new frontend live, then marks the dropped files obsolete
# The default, all, runs both in that order.
set -euo pipefail

bucket="$1"
packs_dir="${2%/}"
phase="${3:-all}"
nocache_json="$(dirname "$0")/../config/nocache-files.json"

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
  aws s3 cp "$packs_dir" "s3://$bucket/packs" --recursive \
    --exclude "application.js" --exclude "application-styles.js" \
    --cache-control "public, max-age=15552000"
fi

if [ "$phase" != hashed ]; then
  # The unhashed entry files are replaced each release, so they must always be revalidated.
  for file in $(jq -r '.[]' "$nocache_json"); do
    aws s3 cp "$packs_dir/$(basename "$file")" "s3://$bucket$file" --cache-control "no-cache"
  done

  (cd "$packs_dir" && find . -type f | sed 's#^\./#packs/#') | "$(dirname "$0")/markObsoleteAssets.sh" "$bucket" packs/
fi
