#!/bin/bash

echo "Preparing CodeClimate coverage reporter"
apt-get install -y awscli
curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
chmod +x ./cc-test-reporter
./cc-test-reporter before-build

if [ "${LANGUAGE}" = "ruby" ]; then
  echo "Setting up Intercode"
  cp config/database.yml.ci config/database.yml
  bin/rake db:create db:migrate RAILS_ENV=test
  RAILS_ENV=test bin/webpack
fi
