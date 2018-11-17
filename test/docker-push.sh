#!/bin/bash

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
  docker push neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
else
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT neinteractiveliterature/intercode:latest
  docker push neinteractiveliterature/intercode:latest

  docker login --username=_ --password=$HEROKU_AUTH_TOKEN registry.heroku.com
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT registry.heroku.com/intercode/web
  docker push registry.heroku.com/intercode/web
fi
