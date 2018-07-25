#!/bin/bash

source ~/.nvm/nvm.sh

# We need Javascript for Ruby tests because some tests need assets, so do this unconditionally
echo "Installing node"
nvm install

set -x
npm install --global yarn
yarn install

if [ "${LANGUAGE}" = "ruby" ]; then
  cp config/database.yml.ci config/database.yml
  echo | gem uninstall -i /home/travis/.rvm/gems/ruby-2.5.1@global bundler
  gem install bundler -v 1.16.0 --no-ri --no-rdoc
  bin/rake db:create db:migrate RAILS_ENV=test
  RAILS_ENV=test bin/webpack
fi
