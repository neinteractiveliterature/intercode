#!/bin/bash
set -e

if [ -n "$CHAMBER_SERVICE" ]; then
  if [ -n "$CHAMBER_AWS_ROLE_ARN" ]; then
    TOKEN_FILE=$(mktemp)
    curl -sf --unix-socket /.fly/api \
      -X POST "http://localhost/v1/tokens/oidc" \
      -H "Content-Type: application/json" \
      --data '{"aud":"sts.amazonaws.com"}' \
      | python3 -c "import sys,json; print(json.load(sys.stdin)['token'],end='')" \
      > "$TOKEN_FILE"
    export AWS_ROLE_ARN="$CHAMBER_AWS_ROLE_ARN"
    export AWS_WEB_IDENTITY_TOKEN_FILE="$TOKEN_FILE"
    export AWS_ROLE_SESSION_NAME="chamber"
    unset CHAMBER_AWS_ROLE_ARN
  fi
  exec chamber exec "$CHAMBER_SERVICE" -- "$@"
else
  exec "$@"
fi
