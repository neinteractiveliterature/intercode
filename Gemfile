source 'http://rubygems.org'

ruby '2.1.2'
gem 'rails'

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

gem 'uglifier', '>= 1.0.3'
  
# Upload assets to Amazon S3 during compilation phase
#gem 'asset_sync'
#gem 'unf'

gem 'jquery-rails'

# Devise for authentication, authority for authorization
gem 'devise'
gem 'authority'

# Lightweight open-source CMS (written by Nat for Gively Inc.)
gem 'cadmus', '>= 0.5.0'

# File uploading
gem 'carrierwave'

#Enviromental Variable Configuration
gem 'figaro'

#gem 'newrelic_rpm'

# Fixture replacement for test suite
group :development, :test do
  gem 'rspec-rails'
  gem 'factory_girl', '~> 2.6'
  gem 'factory_girl_rails'
  gem 'pry-rails'
  gem 'pry-remote'
end

group :test do
  gem 'capybara'
  gem 'cucumber-rails', require: false
  gem 'email_spec'
  gem 'database_cleaner'
  gem 'selenium-webdriver'
  gem 'shoulda-matchers'
end