#!/bin/bash

set -x

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker pull neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH || true
  docker pull neinteractiveliterature/intercode:build-production-$TRAVIS_PULL_REQUEST_BRANCH || true
else
  docker pull neinteractiveliterature/intercode:build-production-master || true
  docker pull neinteractiveliterature/intercode:latest || true
fi
