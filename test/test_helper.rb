ENV['RAILS_ENV'] = 'test'
require 'simplecov'
SimpleCov.start

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

require 'minitest/reporters'
if ENV['CI'].present?
  Minitest::Reporters.use!(
    Minitest::Reporters::SpecReporter.new,
    ENV,
    Minitest.backtrace_filter
  )
else
  Minitest::Reporters.use!(
    Minitest::Reporters::ProgressReporter.new,
    ENV,
    Minitest.backtrace_filter
  )
end

# TODO once DatabaseCleaner actually releases a gem version with the url whitelist feature,
# switch to this, until then we need to just turn off the safeguard so it will work with Docker
# environments
#
# DatabaseCleaner.url_whitelist = [
#   'postgres://postgres@postgres/intercode_development',
#   'mysql2://root:mysql@mysql/intercode_development'
# ]
DatabaseCleaner.allow_remote_database_url = true
DatabaseCleaner.strategy = :transaction

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods
  include ActionMailer::TestCase::ClearTestDeliveries

  before do
    DatabaseCleaner.start
  end
  after { DatabaseCleaner.clean }
end

class ActionController::TestCase
  include Devise::Test::ControllerHelpers

  def set_convention(convention) # rubocop:disable Naming/AccessorMethodName
    @request.host = convention.domain
    @controller.request.env['intercode.convention'] = convention
  end
end

class ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def set_convention(convention) # rubocop:disable Naming/AccessorMethodName
    self.default_url_options = { host: convention.domain }
  end
end
