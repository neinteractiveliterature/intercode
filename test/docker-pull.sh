#!/bin/bash

set -x

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker pull neinteractiveliterature/intercode:build-production-$TRAVIS_PULL_REQUEST_BRANCH || docker pull neinteractiveliterature/intercode:build-production-master || true
else
  docker pull neinteractiveliterature/intercode:build-production-master || true
fi
