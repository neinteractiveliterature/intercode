#!/bin/bash

docker pull neinteractiveliterature/intercode:build-latest || true

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker pull neinteractiveliterature/intercode:build-$TRAVIS_PULL_REQUEST_BRANCH || true
fi
