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

DatabaseCleaner.strategy = :transaction

class ActiveSupport::TestCase
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
