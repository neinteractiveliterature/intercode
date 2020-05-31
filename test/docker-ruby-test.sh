#!/usr/bin/env bash

set -x
set -e

./wait-for-it.sh postgres:5432

echo "Setting up Intercode"
RAILS_ENV=development bin/rake db:create db:migrate db:test:prepare

bin/rails test
