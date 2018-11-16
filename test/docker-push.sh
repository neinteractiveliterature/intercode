#!/bin/bash

docker tag intercode_web:latest neinteractiveliterature/intercode:$TRAVIS_COMMIT
docker tag intercode_web:latest neinteractiveliterature/intercode:$TRAVIS_BRANCH
docker push neinteractiveliterature/intercode:$TRAVIS_COMMIT
docker push neinteractiveliterature/intercode:$TRAVIS_BRANCH

if [ "${TRAVIS_BRANCH}" = "master" ]; then
  docker tag intercode_web:latest neinteractiveliterature/intercode:latest
  docker push neinteractiveliterature/intercode:latest
fi
