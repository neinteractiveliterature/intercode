#!/bin/sh
# Run by Dockerfile.assets: carries the previous assets image's files over into this one, and prunes the ones that have
# been obsolete for longer than the retention period. A file becomes obsolete when a release stops containing it, so
# its age is counted from the build that dropped it, not from when it was first built.
#
# Usage: mergePreviousAssets.sh <previous-image-root> <retention-days> [web-root] [subdirectory]
#
# The web root and subdirectory default to the ones Dockerfile.assets uses (/usr/share/nginx/html and packs).
# Dockerfile.assets-framework passes its own, since its hashed files live in assets/ in a different directory.
set -eu

previous_root="$1"
retention_days="$2"
html="${3:-/usr/share/nginx/html}"
subdir="${4:-packs}"
manifest_dir=/etc/intercode-assets
previous_manifest="$previous_root$manifest_dir/current-files.txt"
work=/tmp/previous-packs

# Record which files this release contains, for the next build to compare against. It lives outside the web root so
# that it isn't served.
mkdir -p "$manifest_dir"
(cd "$html/$subdir" && find . -type f | sort) > "$manifest_dir/current-files.txt"

[ -d "$previous_root$html/$subdir" ] || exit 0

cp -rp "$previous_root$html/$subdir" "$work"

# The files the previous release contained. An image from before this was recorded has no manifest, so assume it was
# all current.
if [ -f "$previous_manifest" ]; then
  previous_current="$previous_manifest"
else
  (cd "$work" && find . -type f | sort) > /tmp/previous-current-files.txt
  previous_current=/tmp/previous-current-files.txt
fi

# Files the previous release had and this one doesn't become obsolete now. Files that were already obsolete keep
# the age they had.
comm -23 "$previous_current" "$manifest_dir/current-files.txt" | while read -r file; do
  [ -f "$work/$file" ] && touch "$work/$file"
done

find "$work" -type f -mtime +"$retention_days" -delete

# cp -n never overwrites, so this release's own files win.
cp -rnp "$work/." "$html/$subdir/"
rm -rf "$work"
