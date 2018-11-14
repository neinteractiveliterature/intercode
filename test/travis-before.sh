#!/bin/bash

echo "Preparing CodeClimate coverage reporter"
pip install --user awscli
curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
chmod +x ./cc-test-reporter
./cc-test-reporter before-build

source ~/.nvm/nvm.sh

# We need Javascript for Ruby tests because some tests need assets, so do this unconditionally
echo "Installing node"
nvm install

set -x
npm install --global yarn
yarn install

if [ "${LANGUAGE}" = "ruby" ]; then
  echo "Setting up Intercode"
  cp config/database.yml.ci config/database.yml
  bin/rake db:create db:migrate RAILS_ENV=test
  RAILS_ENV=test bin/webpack
fi
