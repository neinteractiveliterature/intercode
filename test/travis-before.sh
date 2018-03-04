#!/bin/bash

if [ "${LANGUAGE}" = "ruby" ]; then
  cp config/database.yml.ci config/database.yml
  bin/rake db:create db:migrate RAILS_ENV=test
fi

if [ "${LANGUAGE}" = "javascript" ]; then
  nvm install
  npm install --global yarn
  yarn install
fi
