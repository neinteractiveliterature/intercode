# frozen_string_literal: true
source "https://rubygems.org"

ruby File.read(File.expand_path(".ruby-version", __dir__)).strip
gem "rails", "8.1.1"

gem "pg"
gem "puma"

gem "sprockets-rails"

gem "dotenv-rails", require: "dotenv/load"

gem "with_advisory_lock"

# Devise for authentication, pundit for authorization, doorkeeper for OAuth providership
gem "devise"
gem "devise-doorkeeper"
gem "devise-encryptable"
gem "doorkeeper", "5.8.2"
gem "doorkeeper-jwt"
gem "doorkeeper-openid_connect"
gem "pundit"
gem "recaptcha", require: "recaptcha/rails"

# Let's store sessions in the database, shall we?
gem "activerecord-session_store"

# Lightweight open-source CMS (written by Nat for Gively Inc.)
gem "cadmus", github: "gively/cadmus", branch: "syntax_conformance"
gem "cadmus_navbar", "~> 0.1.0"
gem "liquid"

# Extracted from this app!  Values that change over time based on a schedule
gem "scheduled_value", "~> 1.4.0"

# Also extracted from this app!  Service objects for Rails apps
gem "civil_service", github: "neinteractiveliterature/civil_service", branch: "no-double-validate"

# File uploading
gem "aws-sdk-s3"
gem "image_processing", "~> 1.2"
gem "ruby-vips"

# Filthy lucre
gem "business_time"
gem "eu_central_bank"
gem "holidays"
gem "money-rails"
gem "stripe"

# Pagination and search
gem "pg_search"
gem "will_paginate"

# GraphQL server
gem "apollo_upload_server", "2.1.7"
gem "graphql"
gem "graphql-rails_logger", groups: %i[development test]

# Email stuff
gem "aws-actionmailer-ses"
gem "aws-sdk-rails"
gem "aws-sdk-ses"
gem "aws-sdk-sns"

# Markdown
gem "redcarpet"

# SMS and phone support
gem "phonelib"
gem "twilio-ruby", "~> 7.8.0"

# Background workers and scheduling
gem "aws-sdk-sqs"
gem "cloudwatch_scheduler", github: "paul/cloudwatch_scheduler"
gem "shoryuken"

# Privacy-respecting metrics
gem "ahoy_matey"

# Logging
gem "lograge"

# Miscellany
gem "browser"
gem "csv"
gem "dalli"
gem "domain_prefix"
gem "faraday"
gem "fly.io-rails"
gem "icalendar"
gem "platform-api"
gem "positioning"
gem "rack-cors"
gem "stackprof"
gem "tzinfo-data"

gem "faker", group: "development", require: false

gem "oj", "~> 3.16.0"
gem "rollbar"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.1.0", require: false

gem "parallel", groups: %i[development intercode1_import]

# Production profiling
group :skylight do
  gem "rbtrace"
  gem "skylight"
  gem "webrick" # we don't actually use it, but Skylight needs it on boot
end

group :development do
  gem "rack-mini-profiler", require: false

  # For memory profiling (requires Ruby MRI 2.1+)
  gem "memory_profiler"

  # For call-stack profiling flamegraphs (requires Ruby MRI 2.0.0+)
  gem "flamegraph"

  # Rails-specific benchmarking
  gem "derailed_benchmarks"

  # Reloader support
  gem "listen"

  # Doc generation
  gem "yard"

  # Automatic annotation for models
  gem "annotaterb"

  # Debugging
  gem "debug"

  # Linting
  gem "prettier", "4.0.4"
  gem "prettier_print"
  gem "prism"
  gem "rubocop", ">= 1.82"
  gem "rubocop-capybara", require: false
  gem "rubocop-factory_bot", require: false
  gem "rubocop-graphql", require: false
  gem "rubocop-performance"
  gem "rubocop-rails"
  gem "rubocop-rspec", require: false
  gem "rubocop-sequel"
  gem "syntax_tree"
  gem "syntax_tree-haml"
  gem "syntax_tree-rbs"

  # Find missing `end` statements
  gem "dead_end"

  # Type profiling for IDEs
  gem "typeprof"
end

group :development, :test do
  gem "pry-rails"
  gem "pry-remote"
end

group :intercode1_import do
  gem "mysql2", "~> 0.5.3"
  gem "reverse_markdown"
  gem "sequel"
  gem "term-ansicolor"
end

group :test do
  gem "capybara"
  gem "cuprite"
  gem "database_cleaner-active_record"
  gem "factory_bot"
  gem "factory_bot_rails"
  gem "minitest-focus"
  gem "minitest-mock"
  gem "minitest-reporters"
  gem "minitest-spec-rails"
  gem "simplecov"
  gem "simplecov-cobertura"

  # Not sure if we actually need it or not, but adding this for now to unbreak controller tests
  gem "rails-controller-testing"
end

gem "sentry-rails", "~> 6.0"
gem "sentry-ruby", "~> 6.0"

gem "openssl", "~> 3.3"

gem "readline", "~> 0.0.4"
