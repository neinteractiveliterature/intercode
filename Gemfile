source 'https://rubygems.org'

ruby '2.5.3'
gem 'rails', '5.2.1.1'

gem 'sqlite3', groups: [:development, :test]
gem 'mysql2', '~> 0.5.2'
gem 'pg'
gem 'puma'

gem 'dotenv-rails', require: 'dotenv/rails-now'

gem 'sass-rails'
gem 'autoprefixer-rails'
gem 'bootstrap_form'
gem 'haml'
gem 'webpacker', '~> 4.0.0.pre.pre.3'
gem 'webpacker-react', '~> 0.3.2'

gem 'with_advisory_lock'

# Devise for authentication, cancancan for authorization, doorkeeper for OAuth providership
gem 'devise'
gem 'cancancan'
gem 'recaptcha', require: 'recaptcha/rails'
gem 'doorkeeper', '5.0.2'
gem 'devise-doorkeeper'
gem 'doorkeeper-openid_connect'

# Let's store sessions in the database, shall we?
gem 'activerecord-session_store'

# Lightweight open-source CMS (written by Nat for Gively Inc.)
gem 'cadmus', '~> 0.7.0'
gem 'cadmus_files', '~> 0.2.0'
gem 'cadmus_navbar', '~> 0.1.0'
gem 'liquid-md5'

# Extracted from this app!  Values that change over time based on a schedule
gem 'scheduled_value', '~> 1.2.1'

# Also extracted from this app!  Service objects for Rails apps
gem 'civil_service'

# File uploading
gem 'carrierwave'
gem 'fog-aws'
gem 'aws-sdk-s3'

# Filthy lucre
gem 'money-rails'
gem 'eu_central_bank'
gem 'stripe'

# Pagination
gem 'will_paginate'

# GraphQL server
gem 'graphql'
gem 'graphql-guard'
gem 'graphql-batch'
gem 'graphql-libgraphqlparser'
gem 'apollo_upload_server', '2.0.0.beta.1'
gem 'graphql-rails_logger', groups: [:development, :test]
gem 'graphiql-rails', group: :development

# Mailgun (for managing email aliases automatically)
gem 'mailgun-ruby'

# Markdown
gem 'redcarpet'

# Content diffing
gem 'htmldiff-lcs', git: 'https://github.com/nbudin/htmldiff-lcs', require: 'htmldiff'

# Background workers and scheduling
gem 'shoryuken'
gem 'aws-sdk-sqs'
gem 'whenever'

# Miscellany
gem 'parallel'
gem 'skylight'
gem 'icalendar'
gem 'dalli'
gem 'browser'

# Heroku prod fix
gem 'rails_12factor', group: 'stage'

gem 'faker', group: 'development', require: false

gem 'rollbar'
gem 'rollbar-shoryuken'
gem 'oj', '~> 3.7.4'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.1.0', require: false

group :development do
  gem 'rack-mini-profiler'

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

  # n+1 query profiling
  gem 'bullet'
end

group :development, :test do
  gem 'pry-rails'
  gem 'pry-remote'
end

group :intercode1_import do
  gem 'sequel'
  gem 'term-ansicolor'
  gem 'reverse_markdown'
end

group :test do
  gem 'minitest-spec-rails'
  gem 'minitest-reporters'
  gem 'minitest-focus'
  gem 'database_cleaner'
  gem 'factory_bot'
  gem 'factory_bot_rails'
  gem 'simplecov'
  gem 'stripe-ruby-mock', require: 'stripe_mock'

  # Not sure if we actually need it or not, but adding this for now to unbreak controller tests
  gem 'rails-controller-testing'
end
