ENV['RAILS_ENV'] = 'test'
require 'simplecov'
SimpleCov.start

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

require 'minitest/reporters'
Minitest::Reporters.use!(
  Minitest::Reporters::SpecReporter.new,
  ENV,
  Minitest.backtrace_filter
)

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

  before do
    DatabaseCleaner.start
    ActionMailer::Base.deliveries.clear # TODO: remove once Rails merges PR #24688 to do this itself
  end
  after { DatabaseCleaner.clean }
end

class ActionController::TestCase
  include Devise::Test::ControllerHelpers

  def set_convention(convention)
    @request.host = convention.domain
    @controller.request.env['intercode.convention'] = convention
  end
end

class ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def set_convention(convention)
    self.default_url_options = { host: convention.domain }
  end
end
