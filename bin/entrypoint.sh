#!/bin/bash
set -e

drop_to_www() {
  if [ "$(id -u)" -eq 0 ]; then
    exec gosu www "$@"
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
    OIDC_TOKEN=$(echo "$OIDC_RESPONSE" | node -e "
let data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  data = data.trim();
  try {
    const parsed = JSON.parse(data);
    process.stdout.write(parsed.token !== undefined ? String(parsed.token) : data);
  } catch (e) {
    process.stdout.write(data);
  }
});
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
