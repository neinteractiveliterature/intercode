source 'https://rubygems.org'

ruby '2.4.1'
gem 'rails', '= 5.1.4'

gem 'sqlite3', groups: [:development, :test]
gem 'mysql2'
gem 'pg'
gem 'puma'

gem 'dotenv-rails', require: 'dotenv/rails-now'

gem 'sass-rails'
gem 'bootstrap', '~> 4.0.0.beta2'
gem 'font-awesome-sass'
gem 'autoprefixer-rails'
gem 'bootstrap_form', git: "https://github.com/bootstrap-ruby/rails-bootstrap-forms.git", branch: "bootstrap-v4"
gem 'haml'
gem 'webpacker'
gem 'webpacker-react', "~> 0.3.2"
gem 'uglifier', '>= 1.0.3'

gem 'with_advisory_lock'

# Upload assets to Amazon S3 during compilation phase
#gem 'asset_sync'
gem 'unf'

gem 'jquery-rails'

# Devise for authentication, cancancan for authorization
gem 'devise'
gem 'cancancan'
gem 'recaptcha', require: 'recaptcha/rails'

# Let's store sessions in the database, shall we?
gem 'activerecord-session_store'

# Lightweight open-source CMS (written by Nat for Gively Inc.)
#gem 'cadmus', '~> 0.5.3'
gem 'cadmus', git: 'https://github.com/gively/cadmus', branch: 'partials_and_layouts'
gem 'cadmus_files', git: 'https://github.com/nbudin/cadmus_files', branch: 'cadmus_0_6'
gem 'cadmus_navbar', git: 'https://github.com/nbudin/cadmus_navbar'

# Extracted from this app!  Values that change over time based on a schedule
gem 'scheduled_value', '~> 1.1.3'

# File uploading
gem 'carrierwave'
gem 'fog'
gem 'fog-aws'

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
gem 'graphql'
gem 'graphql-guard'
gem 'graphql-batch'
gem 'graphiql-rails', group: :development

# Markdown
gem 'redcarpet'

# Miscellany
gem 'parallel'
gem 'newrelic_rpm'

# Heroku prod fix
gem 'rails_12factor', group: 'production'

gem 'faker', group: 'development', require: false

group :development do
  gem 'rack-mini-profiler'

  # For memory profiling (requires Ruby MRI 2.1+)
  gem 'memory_profiler'

  # For call-stack profiling flamegraphs (requires Ruby MRI 2.0.0+)
  gem 'flamegraph'
  gem 'stackprof'
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
  gem 'codeclimate-test-reporter'
  gem 'stripe-ruby-mock', require: 'stripe_mock'

  # Not sure if we actually need it or not, but adding this for now to unbreak controller tests
  gem 'rails-controller-testing'
end
