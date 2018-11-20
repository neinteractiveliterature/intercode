#!/usr/bin/env bash

if [ "${LANGUAGE}" = "ruby" ]; then
  if [ "${DATABASE}" = "mysql" ]; then
    ./wait-for-it.sh mysql:3306
  elif [ "${DATABASE}" = "postgresql" ]; then
    ./wait-for-it.sh postgres:5432
  fi

  echo "Setting up Intercode"
  cp config/database.yml.ci config/database.yml
  RAILS_ENV=development bin/rake db:create db:migrate db:test:prepare
fi
