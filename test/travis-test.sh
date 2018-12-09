#!/usr/bin/env bash

set -e
set -x

bin/rails test
yarn run test
