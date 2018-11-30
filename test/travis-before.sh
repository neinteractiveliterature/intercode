#!/usr/bin/env bash

if [ "${LANGUAGE}" = "ruby" ]; then
  ./wait-for-it.sh postgres:5432

  echo "Setting up Intercode"
  RAILS_ENV=development bin/rake db:create db:migrate db:test:prepare
fi
