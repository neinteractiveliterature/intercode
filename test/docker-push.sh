#!/bin/bash

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
  docker push neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
else
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT neinteractiveliterature/intercode:latest
  docker push neinteractiveliterature/intercode:latest

  echo "$HEROKU_AUTH_TOKEN" | docker login --username=_ --password-stdin registry.heroku.com
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT registry.heroku.com/intercode/web
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT registry.heroku.com/intercode/release
  docker push registry.heroku.com/intercode/web
  docker push registry.heroku.com/intercode/release
fi
