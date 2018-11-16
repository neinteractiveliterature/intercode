#!/bin/bash

if [ -z "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker pull neinteractiveliterature/intercode:latest
  docker build . --cache-from=neinteractiveliterature/intercode:latest
else
  docker pull neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
  if [ $? -eq 0 ]; then
    docker build . --cache-from=neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
  else
    docker pull neinteractiveliterature/intercode:latest
    docker build . --cache-from=neinteractiveliterature/intercode:latest
  fi
fi
