#!/bin/bash

if [ "${LANGUAGE}" = "ruby" ]; then
  exec bin/rake test
fi

if [ "${LANGUAGE}" = "javascript" ]; then
  exec yarn run test
fi
