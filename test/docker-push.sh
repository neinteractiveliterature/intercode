#!/bin/bash

set -e
set -x

docker push neinteractiveliterature/intercode:${TRAVIS_COMMIT}
docker tag neinteractiveliterature/intercode:${TRAVIS_COMMIT} neinteractiveliterature/intercode:${BRANCH_TAG}
docker push neinteractiveliterature/intercode:${BRANCH_TAG}

if [ -z "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
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
