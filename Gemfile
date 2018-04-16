source 'https://rubygems.org'

ruby '2.4.2'
gem 'rails', '5.2.0'

gem 'sqlite3', groups: [:development, :test]
gem 'mysql2', '~> 0.5.1'
gem 'pg'
gem 'puma'

gem 'dotenv-rails', require: 'dotenv/rails-now'

gem 'sass-rails'
gem 'autoprefixer-rails'
gem 'bootstrap_form', git: "https://github.com/bootstrap-ruby/rails-bootstrap-forms.git", branch: "bootstrap-v4"
gem 'haml'
gem 'webpacker'
gem 'webpacker-react', "~> 0.3.2"

gem 'with_advisory_lock'

# Devise for authentication, cancancan for authorization
gem 'devise'
gem 'cancancan'
gem 'recaptcha', require: 'recaptcha/rails'

# Let's store sessions in the database, shall we?
gem 'activerecord-session_store'

# Lightweight open-source CMS (written by Nat for Gively Inc.)
gem 'cadmus', git: 'https://github.com/gively/cadmus', branch: 'partials_and_layouts'
gem 'cadmus_files', git: 'https://github.com/nbudin/cadmus_files', branch: 'cadmus_0_6'
gem 'cadmus_navbar', git: 'https://github.com/nbudin/cadmus_navbar'
gem 'liquid-md5'

# Extracted from this app!  Values that change over time based on a schedule
gem 'scheduled_value', '~> 1.2.1'

# File uploading
gem 'carrierwave'
gem 'fog-aws'
gem 'aws-sdk-s3'

# Filthy lucre
gem 'money-rails'
gem 'eu_central_bank'
gem 'stripe'

# Helpers for sortable, filterable and exportable tables
gem 'datagrid'

# Pagination
gem 'will_paginate'
gem 'will_paginate-bootstrap4'

# GraphQL server
gem 'graphql', '1.8.0.pre10'
gem 'graphql-guard'
gem 'graphql-batch'
gem 'apollo_upload_server', '2.0.0.alpha.5'
gem 'graphiql-rails', group: :development

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

# Heroku prod fix
gem 'rails_12factor', group: 'stage'

gem 'faker', group: 'development', require: false

gem 'rollbar', git: 'https://github.com/rollbar/rollbar-gem' # temp for source map upload support
gem 'rollbar-shoryuken'
gem 'oj', '~> 3.5.1'

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

  gem 'capistrano-rails', '~> 1.1'
  gem 'capistrano-passenger'
  gem 'capistrano-shoryuken'
  gem 'capistrano-maintenance', require: false

  gem 'parser' # temp for graphql upgrade
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
