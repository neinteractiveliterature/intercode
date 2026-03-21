#!/bin/bash
set -e

ISSUE_NUMBER=$1
shift

if [ -z "$ISSUE_NUMBER" ] || [ $# -eq 0 ]; then
  echo "Usage: $0 <issue-or-pr-number> <label> [label ...]"
  exit 1
fi

LABEL_ARGS=()
for label in "$@"; do
  LABEL_ARGS+=(-f "labels[]=$label")
done

gh api "repos/neinteractiveliterature/intercode/issues/$ISSUE_NUMBER/labels" -X POST "${LABEL_ARGS[@]}"
