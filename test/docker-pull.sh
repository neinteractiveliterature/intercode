#!/bin/bash

set -x

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker pull neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH || \
  docker pull neinteractiveliterature/intercode:latest || true
else
  docker pull neinteractiveliterature/intercode:latest || true
fi
