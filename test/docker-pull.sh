#!/bin/bash

docker pull neinteractiveliterature/intercode:build-latest

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker pull neinteractiveliterature/intercode:build-$TRAVIS_PULL_REQUEST_BRANCH
fi
