#!/usr/bin/env bash

if [ "${LANGUAGE}" = "ruby" ]; then
  exec bin/rails test
fi

if [ "${LANGUAGE}" = "javascript" ]; then
  exec yarn run test
fi
