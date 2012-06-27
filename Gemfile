source 'https://rubygems.org'

ruby '1.9.2'
gem 'rails', '3.2.6'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'sqlite3', :groups => [:development, :test]
gem 'pg', :group => :production


# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  # gem 'therubyracer'

  gem 'uglifier', '>= 1.0.3'
  
  # Upload assets to Amazon S3 during compilation phase
  gem 'asset_sync'
end

gem 'jquery-rails'

# Devise for authentication, cancan for authorization
gem 'devise'
gem 'cancan'

# Lightweight open-source CMS (written by Nat for Gively Inc.)
gem 'cadmus'

# File uploading
gem 'carrierwave'

gem 'puma'
gem 'pry-rails', :groups => [:development, :test]

# Fixture replacement for test suite
gem 'factory_girl_rails', :groups => [:development, :test]
