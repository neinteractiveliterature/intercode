#!/bin/bash

if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
  docker push neinteractiveliterature/intercode:$TRAVIS_PULL_REQUEST_BRANCH
else
  docker tag neinteractiveliterature/intercode:$TRAVIS_COMMIT neinteractiveliterature/intercode:latest
  docker push neinteractiveliterature/intercode:latest


  echo "$HEROKU_API_KEY" | docker login --username=_ --password-stdin registry.heroku.com
  docker tag neinteractiveliterature/$TRAVIS_COMMIT registry.heroku.com/intercode/$TRAVIS_COMMIT
  docker push registry.heroku.com/intercode/$TRAVIS_COMMIT

  DOCKER_IMAGE_ID=$(docker inspect registry.heroku.com/intercode/$TRAVIS_COMMIT --format='{{.Id}}')

  echo "machine api.heroku.com\n  login $HEROKU_EMAIL\n  password $HEROKU_API_KEY" >> ~/.netrc
  curl -n -X PATCH https://api.heroku.com/apps/intercode/formation \
  -d '{
    "updates": [
      {
        "type": "web",
        "docker_image": "$DOCKER_IMAGE_ID"
      },
      {
        "type": "shoryuken",
        "docker_image": "$DOCKER_IMAGE_ID"
      },
      {
        "type": "release",
        "docker_image": "$DOCKER_IMAGE_ID"
      }
    ]
  }' \
  -H "Content-Type: application/json" \
  -H "Accept: application/vnd.heroku+json; version=3.docker-releases"
fi
