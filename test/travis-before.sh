#!/bin/bash
set -x

# We need Javascript for Ruby tests because some tests need assets, so do this unconditionally
nvm install
npm install --global yarn
yarn install

if [ "${LANGUAGE}" = "ruby" ]; then
  cp config/database.yml.ci config/database.yml
  gem uninstall bundler
  gem install bundler -v 1.16.0 --no-ri --no-rdoc
  bin/rake db:create db:migrate RAILS_ENV=test
fi
