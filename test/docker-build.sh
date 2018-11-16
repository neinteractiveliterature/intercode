#!/bin/bash

docker pull neinteractiveliterature/intercode:$TRAVIS_BRANCH
if [ $? -eq 0 ]; then
  docker build . --cache-from=neinteractiveliterature/intercode:$TRAVIS_BRANCH
else
  docker pull neinteractiveliterature/intercode:latest
  docker build . --cache-from=neinteractiveliterature/intercode:latest
fi
