#!/usr/bin/env bash

set -e
set -x

# awscli bails unless you have this, apparently
export LC_ALL="en_US.UTF-8"

./cc-test-reporter format-coverage -t simplecov --output coverage/codeclimate.ruby.json
./cc-test-reporter format-coverage -t lcov --output coverage/codeclimate.js.json
./cc-test-reporter sum-coverage --output - --parts 2 coverage/codeclimate.*.json | ./cc-test-reporter upload-coverage --input -
