#!/bin/bash

docker pull neinteractiveliterature/intercode:latest
docker pull neinteractiveliterature/intercode:$TRAVIS_COMMIT

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker pull neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
fi
