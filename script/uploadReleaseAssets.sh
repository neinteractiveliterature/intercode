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

current_keys="$(cd "$packs_dir" && find . -type f | sed 's#^\./#packs/#' | sort)"
bucket_keys="$(aws s3api list-objects-v2 --bucket "$bucket" --prefix packs/ --query 'Contents[].Key' --output text | tr '\t' '\n' | sort)"

# Copying an object onto itself with a new tag resets its age, so the lifecycle rule's days count from now. S3 only
# allows a copy onto itself if it changes the metadata, so replace the metadata with the same Cache-Control and
# Content-Type. Skip files that are already tagged, or their countdown would restart on every release.
comm -13 <(echo "$current_keys") <(echo "$bucket_keys") | while read -r key; do
  [ -n "$key" ] || continue
  tagged="$(aws s3api get-object-tagging --bucket "$bucket" --key "$key" \
    --query "TagSet[?Key=='obsolete'] | length(@)" --output text)"
  if [ "$tagged" = "0" ]; then
    echo "Marking s3://$bucket/$key obsolete"
    head="$(aws s3api head-object --bucket "$bucket" --key "$key" --output json)"
    cache_control="$(echo "$head" | jq -r '.CacheControl // empty')"
    content_type="$(echo "$head" | jq -r '.ContentType // empty')"
    aws s3api copy-object --bucket "$bucket" --key "$key" --copy-source "$bucket/$key" \
      --metadata-directive REPLACE --cache-control "$cache_control" --content-type "$content_type" \
      --tagging-directive REPLACE --tagging "obsolete=true" > /dev/null
  fi
done
