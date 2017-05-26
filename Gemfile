source 'https://rubygems.org'

ruby '2.3.1'
gem 'rails', '5.0.0.1'

gem 'sqlite3', groups: [:development, :test]
gem 'mysql2'
gem 'pg'
gem 'puma'

gem 'sass-rails'
gem 'bootstrap', '~> 4.0.0.alpha6'
gem 'font-awesome-sass'
gem 'autoprefixer-rails'
gem 'bootstrap_form', git: "https://github.com/bootstrap-ruby/rails-bootstrap-forms.git", branch: "bootstrap-v4"
gem 'haml'
gem 'with_advisory_lock'

gem 'uglifier', '>= 1.0.3'

# Upload assets to Amazon S3 during compilation phase
#gem 'asset_sync'
gem 'unf'

gem 'jquery-rails'
gem 'lodash-rails'
gem 'react-rails'
gem 'momentjs-rails'
gem 'moment_timezone-rails'

source 'https://rails-assets.org' do
  gem 'rails-assets-react-date-picker'
  gem 'rails-assets-tether', '>= 1.3.3'
end

# Devise for authentication, cancancan for authorization
gem 'devise'
gem 'cancancan'

# Let's store sessions in the database, shall we?
gem 'activerecord-session_store'

# Lightweight open-source CMS (written by Nat for Gively Inc.)
#gem 'cadmus', '~> 0.5.3'
gem 'cadmus', github: 'gively/cadmus', branch: 'partials_and_layouts'
gem 'cadmus_files', github: 'nbudin/cadmus_files', branch: 'cadmus_0_6'

# Extracted from this app!  Values that change over time based on a schedule
gem 'scheduled_value', '~> 1.1.2'

# File uploading
gem 'carrierwave'

# Filthy lucre
gem 'money-rails'
gem 'eu_central_bank'
gem 'stripe'

# Helpers for sortable, filterable and exportable tables
gem 'datagrid'

# Pagination
gem 'will_paginate'
gem 'will_paginate-bootstrap4'

# Markdown
gem 'redcarpet'

gem 'newrelic_rpm'

# Heroku prod fix
gem 'rails_12factor', group: 'production'

gem 'faker', group: 'development', require: false

group :development, :test do
  gem 'pry-rails'
  gem 'pry-remote'
end

group :intercode1_import do
  gem 'sequel'
  gem 'term-ansicolor'
  gem 'parallel'
  gem 'upmark'
end

group :test do
  gem 'minitest-spec-rails'
  gem 'minitest-reporters'
  gem 'database_cleaner'
  gem 'factory_girl'
  gem 'factory_girl_rails'
  gem 'codeclimate-test-reporter'

  # Not sure if we actually need it or not, but adding this for now to unbreak controller tests
  gem 'rails-controller-testing'
end
