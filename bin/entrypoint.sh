#!/bin/bash
set -e

# Drop to the www user while preserving the current environment (needed so
# AWS_ROLE_ARN / AWS_WEB_IDENTITY_TOKEN_FILE are visible to the app process).
# If already running as www (e.g. in tests), just exec directly.
drop_to_www() {
  if [ "$(id -u)" -eq 0 ]; then
    exec su -s /bin/bash --preserve-environment -c 'exec "$0" "$@"' www "$@"
  else
    exec "$@"
  fi
}

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
    # The endpoint may return {"token":"..."} JSON or a raw token string.
    OIDC_TOKEN=$(echo "$OIDC_RESPONSE" | python3 -c "
import sys, json
data = sys.stdin.read().strip()
try:
    print(json.loads(data)['token'], end='')
except (json.JSONDecodeError, KeyError):
    print(data, end='')
") || {
      echo "ERROR: Failed to extract OIDC token. Response was: $OIDC_RESPONSE" >&2
      exit 1
    }
    echo -n "$OIDC_TOKEN" > "$TOKEN_FILE"
    chown www:www "$TOKEN_FILE"
    export AWS_ROLE_ARN="$CHAMBER_AWS_ROLE_ARN"
    export AWS_WEB_IDENTITY_TOKEN_FILE="$TOKEN_FILE"
    export AWS_ROLE_SESSION_NAME="chamber"
    unset CHAMBER_AWS_ROLE_ARN
  fi
  drop_to_www chamber exec "$CHAMBER_SERVICE" -- "$@"
else
  drop_to_www "$@"
fi
