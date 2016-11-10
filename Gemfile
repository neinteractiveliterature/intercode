source 'http://rubygems.org'

ruby '2.3.1'
gem 'rails', '5.0.0.1'

platform :ruby do
  gem 'sqlite3', :groups => [:development, :test]
  gem 'pg', :group => :production
  gem 'puma'
end

platform :jruby do
  gem 'jruby-openssl'
  gem 'activerecord-jdbcsqlite3-adapter', :groups => [:development, :test]
  gem 'activerecord-jdbcpostgresql-adapter', :group => :production
  gem 'mizuno'
end

gem 'sass-rails'
gem 'bootstrap-sass'
gem 'font-awesome-sass'
gem 'autoprefixer-rails'
gem 'bootstrap_form'
gem 'haml'

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
end

# Devise for authentication, cancancan for authorization
gem 'devise'
gem 'cancancan'

# Let's store sessions in the database, shall we?
gem 'activerecord-session_store'

# Lightweight open-source CMS (written by Nat for Gively Inc.)
gem 'cadmus', '>= 0.5.1'

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
gem 'will_paginate-bootstrap'

gem 'newrelic_rpm'

# Heroku prod fix
gem 'rails_12factor', group: 'production'

# Super-slick error pages
group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
end

group :development, :test do
  gem 'pry-rails'
  gem 'pry-remote'
end

group :intercode1_import do
  gem 'sequel'
  gem 'mysql2'
  gem 'term-ansicolor'
end

group :test do
  gem 'minitest-spec-rails'
  gem 'minitest-reporters'
  gem 'database_cleaner'
  gem 'factory_girl'
  gem 'factory_girl_rails'

  # Not sure if we actually need it or not, but adding this for now to unbreak controller tests
  gem 'rails-controller-testing'
end