source 'http://rubygems.org'

ruby '2.1.2'
gem 'rails', '4.1.8'

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
gem 'coffee-rails'
gem 'bootstrap-sass'
gem 'autoprefixer-rails'

gem 'uglifier', '>= 1.0.3'
  
# Upload assets to Amazon S3 during compilation phase
gem 'asset_sync'
gem 'unf'

gem 'jquery-rails'

# Devise for authentication, authority for authorization
gem 'devise'
gem 'authority'

# Lightweight open-source CMS (written by Nat for Gively Inc.)
gem 'cadmus', '>= 0.5.0'

# File uploading
gem 'carrierwave'

gem 'newrelic_rpm'

group :development, :test do
  gem 'pry-rails'
  gem 'pry-remote'
end

# Fixture replacement for test suite
group :development, :test do
  gem 'factory_girl', '~> 2.6'
  gem 'factory_girl_rails'
end
