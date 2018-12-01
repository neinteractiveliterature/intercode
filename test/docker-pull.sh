#!/bin/bash

set -x

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker pull neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH || \
  docker pull neinteractiveliterature/intercode:latest || true
  docker pull neinteractiveliterature/intercode:build-$TRAVIS_PULL_REQUEST_BRANCH || \
  docker pull neinteractiveliterature/intercode:build-latest || true
  docker pull neinteractiveliterature/intercode:build-production-$TRAVIS_PULL_REQUEST_BRANCH || \
  docker pull neinteractiveliterature/intercode:build-production-latest || true
else
  docker pull neinteractiveliterature/intercode:build-latest || true
  docker pull neinteractiveliterature/intercode:build-production-latest || true
  docker pull neinteractiveliterature/intercode:latest || true
fi
