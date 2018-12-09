#!/usr/bin/env bash

set -e
set -x

# awscli bails unless you have this, apparently
export LC_ALL="en_US.UTF-8"

./cc-test-reporter format-coverage --output coverage/codeclimate.$TRAVIS_JOB_NUMBER.json
./cc-test-reporter sum-coverage --output - --parts 2 coverage/codeclimate.*.json | ./cc-test-reporter upload-coverage --input -
# s3cmd sync coverage/ "s3://intercode2-coverage/coverage/$TRAVIS_BUILD_NUMBER/"
