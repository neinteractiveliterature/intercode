#!/usr/bin/env bash
# Marks the files in the assets bucket (see terraform/modules/assets_bucket_intercode) that earlier releases left
# behind, and that this release no longer contains, as obsolete. That starts the bucket's lifecycle rule counting down
# to their expiry.
#
# Usage: script/markObsoleteAssets.sh <bucket> <prefix> < current-keys
#
# <prefix> limits it to one part of the bucket (for example packs/ or assets/), and the bucket keys of this release's
# files come in on standard input, one per line. Files outside the prefix are never touched.
set -euo pipefail

bucket="$1"
prefix="$2"

current_keys="$(sort)"
bucket_keys="$(aws s3api list-objects-v2 --bucket "$bucket" --prefix "$prefix" --query 'Contents[].Key' --output text | tr '\t' '\n' | sort)"

# Copying an object onto itself with a new tag resets its age, so the lifecycle rule's days count from now. S3 only
# allows a copy onto itself if it changes the metadata, so replace the metadata with the same Cache-Control and
# Content-Type. Skip files that are already tagged, or their countdown would restart on every release.
mark_obsolete() {
  key="$1"
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
}
export -f mark_obsolete
export bucket

# Each file takes three aws CLI calls, and a release that renames most of its chunks leaves hundreds of files to mark,
# so run several at once. xargs exits non-zero if any of them failed.
comm -13 <(echo "$current_keys") <(echo "$bucket_keys") | { grep -v '^$' || true; } |
  xargs -P "${MARK_OBSOLETE_PARALLELISM:-8}" -I{} bash -c 'set -euo pipefail; mark_obsolete "$1"' _ {}
