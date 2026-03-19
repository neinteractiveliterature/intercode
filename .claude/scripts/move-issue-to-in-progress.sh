#!/bin/bash
set -e

ISSUE_NUMBER=$1
ISSUE_URL=$(gh issue view "$ISSUE_NUMBER" --json url --jq '.url')
ITEM_ID=$(gh project item-add 1 --owner neinteractiveliterature --url "$ISSUE_URL" --format json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
gh project item-edit --id "$ITEM_ID" --field-id PVTSSF_lADOABuqO84AAdTMzgAPetE --project-id PVT_kwDOABuqO84AAdTM --single-select-option-id 47fc9ee4
