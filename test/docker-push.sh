#!/bin/bash

docker tag intercode_web:latest neinteractiveliterature/intercode:$TRAVIS_COMMIT
docker push neinteractiveliterature/intercode:$TRAVIS_COMMIT

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker tag intercode_web:latest neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
  docker push neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
else
  docker tag intercode_web:latest neinteractiveliterature/intercode:latest
  docker push neinteractiveliterature/intercode:latest
fi
