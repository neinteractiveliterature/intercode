source 'https://rubygems.org'

ruby '2.7.0'
gem 'rails', '6.0.3.2'

gem 'pg'
gem 'puma'

gem 'minipack'

gem 'dotenv-rails', require: 'dotenv/rails-now'

gem 'with_advisory_lock'

# Devise for authentication, pundit for authorization, doorkeeper for OAuth providership
gem 'devise'
gem 'pundit'
gem 'recaptcha', require: 'recaptcha/rails'
gem 'doorkeeper', '5.4.0'
gem 'devise-doorkeeper'
gem 'devise-encryptable'
gem 'doorkeeper-jwt'
gem 'doorkeeper-openid_connect', git: 'https://github.com/nbudin/doorkeeper-openid_connect.git', branch: 'fix_doorkeeper_52_compat'

# Let's store sessions in the database, shall we?
gem 'activerecord-session_store'

# Lightweight open-source CMS (written by Nat for Gively Inc.)
gem 'cadmus', '~> 0.7.0'
gem 'cadmus_files', '~> 0.2.0'
gem 'cadmus_navbar', '~> 0.1.0'
gem 'liquid-md5'

# Extracted from this app!  Values that change over time based on a schedule
gem 'scheduled_value', '~> 1.3.0'

# Also extracted from this app!  Service objects for Rails apps
gem 'civil_service', '~> 2.3.0'

# File uploading
gem 'carrierwave', '~> 2.1.0'
gem 'fog-aws'
gem 'aws-sdk-s3'

# Filthy lucre
gem 'money-rails'
gem 'eu_central_bank'
gem 'stripe'

# Pagination and search
gem 'will_paginate'
gem 'pg_search'

# GraphQL server
gem 'graphql', '>= 1.10.2'
gem 'graphql-batch'
gem 'apollo_upload_server', '2.0.1'
gem 'graphql-rails_logger', groups: [:development, :test]

# Not super happy about this, but an ActiveRecord extension to allow us to use PostgreSQL check
# constraints.  This is used in the Permission model to enforce the exclusive arc of all the related
# models
gem 'active_record-postgres-constraints'

# Email stuff
gem 'mailgun-ruby'
gem 'aws-sdk-rails'
gem 'aws-sdk-sns'

# Markdown
gem 'redcarpet'

# Content diffing
gem 'htmldiff-lcs', git: 'https://github.com/nbudin/htmldiff-lcs', require: 'htmldiff'

# SMS and phone support
gem 'twilio-ruby', '~> 5.38.0'
gem 'phonelib'

# Background workers and scheduling
gem 'shoryuken'
gem 'aws-sdk-sqs'
gem 'whenever'

# Privacy-respecting metrics
gem 'ahoy_matey'

# Miscellany
gem 'parallel'
gem 'skylight'
gem 'icalendar'
gem 'dalli'
gem 'platform-api'
gem 'tzinfo-data'

gem 'faker', group: 'development', require: false

gem 'rollbar'
gem 'rollbar-shoryuken'
gem 'oj', '~> 3.10.6'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.1.0', require: false

group :development do
  gem 'rack-mini-profiler', require: false

  # For memory profiling (requires Ruby MRI 2.1+)
  gem 'memory_profiler'

  # For call-stack profiling flamegraphs (requires Ruby MRI 2.0.0+)
  gem 'flamegraph'
  gem 'stackprof'

  # Email testing/debugging
  gem 'letter_opener'

  # Reloader support
  gem 'listen'

  # Doc generation
  gem 'yard'

  # Ruby language server for LSP-compatible editors
  gem 'solargraph'

  # Debugging
  gem 'ruby-debug-ide'
  gem 'debase'

  # Linting
  gem 'rubocop', '0.86.0' # 0.85 seems to break pronto-rubocop :(
  gem 'rubocop-performance'
  gem 'rubocop-rails'
end

group :development, :test do
  gem 'pry-rails'
  gem 'pry-remote'
end

group :intercode1_import do
  gem 'sequel'
  gem 'term-ansicolor'
  gem 'reverse_markdown'
  gem 'mysql2', '~> 0.5.3'
end

group :test do
  gem 'minitest-spec-rails'
  gem 'minitest-reporters'
  gem 'minitest-focus'
  gem 'factory_bot'
  gem 'factory_bot_rails'
  gem 'simplecov'
  gem 'stripe-ruby-mock', '>= 3.0.0', require: 'stripe_mock'

  # Not sure if we actually need it or not, but adding this for now to unbreak controller tests
  gem 'rails-controller-testing'
end
