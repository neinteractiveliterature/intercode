#!/bin/bash
set -e

if [ -n "$CHAMBER_SERVICE" ]; then
  if [ -n "$CHAMBER_AWS_ROLE_ARN" ]; then
    TOKEN_FILE=$(mktemp)
    # Capture the full response (without -f) so HTTP errors show their body.
    OIDC_RESPONSE=$(curl -s --unix-socket /.fly/api \
      -X POST "http://localhost/v1/tokens/oidc" \
      -H "Content-Type: application/json" \
      --data '{"aud":"sts.amazonaws.com"}') || true
    if [ -z "$OIDC_RESPONSE" ]; then
      echo "ERROR: Fly OIDC endpoint returned empty response (connection failure or permission denied on /.fly/api)" >&2
      exit 1
    fi
    echo "$OIDC_RESPONSE" \
      | python3 -c "import sys,json; print(json.load(sys.stdin)['token'],end='')" \
      > "$TOKEN_FILE" || {
        echo "ERROR: Failed to parse OIDC token. Response was: $OIDC_RESPONSE" >&2
        exit 1
      }
    export AWS_ROLE_ARN="$CHAMBER_AWS_ROLE_ARN"
    export AWS_WEB_IDENTITY_TOKEN_FILE="$TOKEN_FILE"
    export AWS_ROLE_SESSION_NAME="chamber"
    unset CHAMBER_AWS_ROLE_ARN
  fi
  exec chamber exec "$CHAMBER_SERVICE" -- "$@"
else
  exec "$@"
fi
