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

  class TestGraphqlContext
    def self.with_user_con_profile(user_con_profile, **attrs)
      rendering_context = CmsRenderingContext.new(
        cms_parent: user_con_profile&.convention, controller: nil
      )

      new(
        user_con_profile: user_con_profile,
        current_user: user_con_profile&.user,
        pundit_user: AuthorizationInfo.cast(user_con_profile&.user),
        convention: user_con_profile&.convention,
        cms_rendering_context: rendering_context,
        cadmus_renderer: rendering_context.cadmus_renderer,
        verified_request: true,
        **attrs
      )
    end

    attr_reader :attrs
    delegate :[], :[]=, :fetch, to: :attrs

    def initialize(**attrs)
      @attrs = attrs.with_indifferent_access
    end

    [:controller, *GraphqlController::Context::METHODS.keys].each do |key|
      define_method key do
        @attrs[key]
      end
    end
  end

  class GraphqlTestExecutionError < StandardError
    attr_reader :result, :errors

    def initialize(result)
      @result = result
      @errors = result['errors']
      super(errors.map { |error| error['message'] }.join(', '))
    end

    def backtrace
      error_with_backtrace = errors.find do |error|
        error['extensions'] && error['extensions']['backtrace'].present?
      end
      return super unless error_with_backtrace

      error_with_backtrace['extensions']['backtrace']
    end
  end

  parallelize(workers: 3)

  before do
    DatabaseCleaner.start
  end
  after { DatabaseCleaner.clean }

  def execute_graphql_query(query, user_con_profile: nil, context_attrs: {}, **options)
    context = TestGraphqlContext.with_user_con_profile(user_con_profile, **context_attrs)
    result = IntercodeSchema.execute(
      query,
      context: context,
      **options
    )
    raise GraphqlTestExecutionError.new(result) if result['errors'].present?
    result
  end
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
