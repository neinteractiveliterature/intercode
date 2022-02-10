source 'https://rubygems.org'

ruby File.read(File.expand_path('.ruby-version', __dir__)).strip
gem 'rails', '7.0.2'

gem 'pg'
gem 'webrick' # we don't actually use it, but Skylight needs it on boot
gem 'puma'

gem 'sprockets-rails'

gem 'dotenv-rails', require: 'dotenv/rails-now'

gem 'with_advisory_lock'

# Devise for authentication, pundit for authorization, doorkeeper for OAuth providership
gem 'devise'
gem 'pundit'
gem 'recaptcha', require: 'recaptcha/rails'
gem 'doorkeeper', '5.5.4'
gem 'devise-doorkeeper'
gem 'devise-encryptable'
gem 'doorkeeper-jwt'
gem 'doorkeeper-openid_connect', git: 'https://github.com/nbudin/doorkeeper-openid_connect.git', branch: 'fix_doorkeeper_52_compat'

# Let's store sessions in the database, shall we?
gem 'activerecord-session_store'

# Lightweight open-source CMS (written by Nat for Gively Inc.)
gem 'cadmus', '~> 0.7.1'
gem 'cadmus_navbar', '~> 0.1.0'
gem 'liquid'

# Extracted from this app!  Values that change over time based on a schedule
gem 'scheduled_value', '~> 1.4.0'

# Also extracted from this app!  Service objects for Rails apps
gem 'civil_service', github: 'neinteractiveliterature/civil_service', branch: 'no-double-validate'

# File uploading
gem 'aws-sdk-s3'
gem 'ruby-vips'
gem 'image_processing', '~> 1.2'
gem 'active_storage_svg_sanitizer'

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
gem 'apollo_upload_server', '2.1.0'
gem 'graphql-rails_logger', groups: [:development, :test]

# Email stuff
gem 'aws-sdk-rails'
gem 'aws-sdk-sns'

# Markdown
gem 'redcarpet'

# SMS and phone support
gem 'twilio-ruby', '~> 5.64.0'
gem 'phonelib'

# Background workers and scheduling
gem 'shoryuken'
gem 'aws-sdk-sqs'
gem 'whenever'

# Privacy-respecting metrics
gem 'ahoy_matey'

# Logging
gem 'cloudwatchlogger'
gem 'lograge'

# Miscellany
gem 'dalli'
gem 'domain_prefix'
gem 'icalendar'
gem 'parallel'
gem 'platform-api'
gem 'skylight'
gem 'tzinfo-data'
gem 'browser'

gem 'faker', group: 'development', require: false

gem 'rollbar'
gem 'rollbar-shoryuken'
gem 'oj', '~> 3.13.4'

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
  gem 'solargraph-rails', '0.3.1'

  # Automatic annotation for models
  gem 'annotate', github: 'dabit/annotate_models', branch: 'rails-7'

  # Debugging
  gem 'debug'

  # Linting
  gem 'rubocop', '1.25.1'
  gem 'rubocop-performance'
  gem 'rubocop-rails'
  gem 'rubocop-sequel'
  gem 'prettier', '2.0.0'

  # Find missing `end` statements
  gem 'dead_end'
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
  gem 'stripe-ruby-mock', '>= 3.1.0.rc3', require: 'stripe_mock'

  # Not sure if we actually need it or not, but adding this for now to unbreak controller tests
  gem 'rails-controller-testing'
end
