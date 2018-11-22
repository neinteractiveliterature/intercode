#!/bin/bash

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
  docker push neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
else
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT neinteractiveliterature/intercode:latest
  docker push neinteractiveliterature/intercode:latest

  echo "$HEROKU_API_KEY" | docker login --username=_ --password-stdin registry.heroku.com
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT registry.heroku.com/intercode/web
  docker build -t registry.heroku.com/intercode/release --build-arg INTERCODE_TAG=$TRAVIS_COMMIT --build-arg REVISION=$TRAVIS_COMMIT -f Dockerfile.release .
  docker build -t registry.heroku.com/intercode/shoryuken --build-arg INTERCODE_TAG=$TRAVIS_COMMIT -f Dockerfile.shoryuken .

  docker push registry.heroku.com/intercode/web
  docker push registry.heroku.com/intercode/release
  docker push registry.heroku.com/intercode/shoryuken
fi
