#!/bin/bash

set -e

echo "Preparing CodeClimate coverage reporter"
apt-get install -y s3cmd
curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
chmod +x ./cc-test-reporter
./cc-test-reporter before-build

if [ "${LANGUAGE}" = "ruby" ]; then
  echo "Setting up Intercode"
  cp config/database.yml.ci config/database.yml
  bin/rake db:create db:migrate db:test:prepare

  # HACK: we could rerun the precompile with RAILS_ENV=test, or we could do this which is faster
  cp -R public/packs public/packs-test
fi
