#!/bin/bash

if [ "${LANGUAGE}" = "ruby" ]; then
  bin/rake test
fi

if [ "${LANGUAGE}" = "javascript" ]; then
  yarn run test
fi
