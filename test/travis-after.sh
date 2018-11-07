#!/usr/bin/env bash

./cc-test-reporter format-coverage --output coverage/codeclimate.$TRAVIS_JOB_NUMBER.json"
aws s3 sync coverage/ "s3://intercode2-coverage/coverage/$TRAVIS_BUILD_NUMBER"
