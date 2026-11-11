# frozen_string_literal: true
source "https://rubygems.org"

ruby File.read(File.expand_path(".ruby-version", __dir__)).strip
gem "rails", "8.1.4.1"

# benchmark was removed from Ruby's default gems in Ruby 4.0; required by mini_magick
gem "benchmark", "0.5.0"

# prettyprint 0.2.0 was published to RubyGems without frozen_string_literal: true, but the
# GitHub tag has it. Using the git source avoids constant warnings on Ruby 4.0.
gem "prettyprint", github: "ruby/prettyprint", tag: "v0.2.1"

gem "pg", "1.7.0"
gem "puma", "8.0.2"

gem "sprockets-rails", "3.5.2"

gem "dotenv-rails", "3.2.0", require: "dotenv/load"

gem "with_advisory_lock", "7.6.0"

# Devise for authentication, pundit for authorization, doorkeeper for OAuth providership
gem "devise", "5.0.4"
gem "devise-doorkeeper", "1.2.0"
gem "devise-encryptable", "0.3.0"
gem "doorkeeper", "5.9.9"
gem "doorkeeper-jwt", "0.4.5"
gem "doorkeeper-openid_connect", "2.1.0"
gem "pundit", "2.5.2"

# Let's store sessions in the database, shall we?
gem "activerecord-session_store", "2.3.0"

# Lightweight open-source CMS (written by Nat for Gively Inc.)
gem "cadmus", github: "gively/cadmus", branch: "syntax_conformance"
gem "cadmus_navbar", "0.1.0"
gem "liquid", "5.14.0"

# Extracted from this app!  Values that change over time based on a schedule
gem "scheduled_value", "1.4.0"

# Also extracted from this app!  Service objects for Rails apps
gem "civil_service", github: "neinteractiveliterature/civil_service", branch: "no-double-validate"

# File uploading
gem "aws-sdk-s3", "1.240.0"
gem "image_processing", "2.2.0"
gem "ruby-vips", "2.3.0"

# Filthy lucre
gem "business_time", "0.13.0"
gem "eu_central_bank", "2.0.0"
gem "holidays", "11.8.0"
gem "money-rails", "3.0.0"
gem "stripe", "20.1.0"

# Pagination and search
gem "pg_search", "2.4.0"
gem "will_paginate", "4.0.1"

# GraphQL server
gem "apollo_upload_server", "2.1.8"
gem "graphql", "2.2.17"
gem "graphql-rails_logger", "1.2.5", groups: %i[development test]

# Email stuff
gem "aws-actionmailer-ses", "1.2.0"
gem "aws-sdk-rails", "5.2.0"
gem "aws-sdk-ses", "1.112.0"
gem "aws-sdk-sns", "1.129.0"

# Markdown
gem "redcarpet", "3.6.1"

# SMS and phone support
gem "phonelib", "0.11.0"
gem "twilio-ruby", "7.13.0"

# Background workers and scheduling
gem "aws-sdk-sqs", "1.127.0"
gem "cloudwatch_scheduler", github: "neinteractiveliterature/cloudwatch_scheduler"
gem "shoryuken", "7.0.4"

# Privacy-respecting metrics
gem "ahoy_matey", "5.5.0"

# Logging
gem "lograge", "0.15.1"

# Miscellany
gem "browser", "6.2.0"
gem "csv", "3.3.7"
gem "domain_prefix", "1.0.20241203"
gem "faraday", "2.15.1"
gem "icalendar", "2.13.0"
gem "positioning", "0.4.10"
gem "rack-cors", "3.0.0"
gem "stackprof", "0.2.28"
gem "tzinfo-data", "1.2026.6"

gem "faker", "3.8.0", group: "development", require: false

gem "oj", "3.17.8"
gem "rollbar", "3.8.0"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", "1.26.1", require: false

group :development do
  gem "rack-mini-profiler", "5.0.0", require: false

  # For memory profiling (requires Ruby MRI 2.1+)
  gem "memory_profiler", "1.1.0"

  # For call-stack profiling flamegraphs (requires Ruby MRI 2.0.0+)
  gem "flamegraph", "0.9.5"

  # Rails-specific benchmarking
  gem "derailed_benchmarks", "2.2.1"

  # Reloader support
  gem "listen", "3.10.1"

  # Doc generation
  gem "yard", "0.9.45"

  # Automatic annotation for models
  gem "annotaterb", "4.26.0"

  # Debugging
  gem "debug", "1.11.1"

  # Linting
  gem "prettier", "4.0.4"
  gem "prettier_print", "1.2.1"
  gem "prism", "2.1.0"
  gem "rubocop", "1.92.2"
  gem "rubocop-capybara", "3.1.0", require: false
  gem "rubocop-factory_bot", "2.28.0", require: false
  gem "rubocop-graphql", "1.9.0", require: false
  gem "rubocop-performance", "1.27.0"
  gem "rubocop-rails", "2.38.0"
  gem "rubocop-rspec", "3.10.2", require: false
  gem "syntax_tree", "6.3.0"
  gem "syntax_tree-haml", "4.0.3"
  gem "syntax_tree-rbs", "1.0.0"

  # Find missing `end` statements
  gem "dead_end", "4.0.0"

  # Type profiling for IDEs
  gem "typeprof", "0.33.2"
end

group :development, :test do
  gem "pry-rails", "0.3.11"
  gem "pry-remote", "0.1.8"
end

group :test do
  gem "capybara", "3.40.0"
  gem "cuprite", "0.20.1"
  gem "database_cleaner-active_record", "2.2.2"
  gem "factory_bot", "6.6.0"
  gem "factory_bot_rails", "6.5.1"
  gem "minitest-focus", "1.4.1"
  gem "minitest-mock", "5.27.0"
  gem "minitest-reporters", "1.8.0"
  gem "minitest-spec-rails", "7.4.1"
  gem "simplecov", "1.3.2"
  gem "simplecov-cobertura", "4.0.0"

  # Not sure if we actually need it or not, but adding this for now to unbreak controller tests
  gem "rails-controller-testing", "1.0.5"
end

gem "sentry-rails", "7.2.0"
gem "sentry-ruby", "7.2.0"

gem "openssl", "4.0.2"

gem "readline", "0.0.4"

gem "pg-aws_rds_iam", "0.8.0"
