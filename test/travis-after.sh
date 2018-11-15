#!/usr/bin/env bash

# awscli bails unless you have this, apparently
export LC_ALL="en_US.UTF-8"

./cc-test-reporter format-coverage --output coverage/codeclimate.$TRAVIS_JOB_NUMBER.json
aws s3cmd sync coverage/ "s3://intercode2-coverage/coverage/$TRAVIS_BUILD_NUMBER"
