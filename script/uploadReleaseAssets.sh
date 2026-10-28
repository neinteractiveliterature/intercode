#!/usr/bin/env bash
# Uploads a release's built packs to the assets bucket (see terraform/modules/assets_bucket_intercode), then marks the
# files that earlier releases left behind and this release no longer contains as obsolete, which starts the bucket's
# lifecycle rule counting down to their expiry.
#
# Usage: script/uploadReleaseAssets.sh <bucket> <packs-dir>
set -euo pipefail

bucket="$1"
packs_dir="${2%/}"
nocache_json="$(dirname "$0")/../config/nocache-files.json"

# Upload every file, not only new ones. Uploading replaces the object, which also clears an `obsolete` tag left on a
# file that has come back into the release.
aws s3 cp "$packs_dir" "s3://$bucket/packs" --recursive \
  --exclude "application.js" --exclude "application-styles.js" \
  --cache-control "public, max-age=15552000"

# The unhashed entry files are replaced each release, so they must always be revalidated.
for file in $(jq -r '.[]' "$nocache_json"); do
  aws s3 cp "$packs_dir/$(basename "$file")" "s3://$bucket$file" --cache-control "no-cache"
done

(cd "$packs_dir" && find . -type f | sed 's#^\./#packs/#') | "$(dirname "$0")/markObsoleteAssets.sh" "$bucket" packs/
