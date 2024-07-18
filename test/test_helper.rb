ENV["RAILS_ENV"] = "test"
require "simplecov"
require "simplecov-cobertura"
SimpleCov.start do
  if ENV["CI"]
    formatter SimpleCov::Formatter::CoberturaFormatter
  else
    formatter SimpleCov::Formatter::MultiFormatter.new(
                [SimpleCov::Formatter::CoberturaFormatter, SimpleCov::Formatter::HTMLFormatter]
              )
  end
end

require "minitest/mock"

require File.expand_path("../../config/environment", __FILE__)
require "rails/test_help"

require "minitest/reporters"
if ENV["CI"].present?
  Minitest::Reporters.use!(
    [
      Minitest::Reporters::DefaultReporter.new,
      Minitest::Reporters::HtmlReporter.new(output_filename: "minitest-report.html"),
      Minitest::Reporters::JUnitReporter.new
    ],
    ENV,
    Minitest.backtrace_filter
  )
else
  Minitest::Reporters.use!(Minitest::Reporters::ProgressReporter.new, ENV, Minitest.backtrace_filter)
end

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods
  include ActionMailer::TestCase::ClearTestDeliveries

  # Minitest is broken with parallelization on Ruby 3.1 - it's expecting methods to be methods but Rails is
  # deserializing them as strings, so you can't actually see the unexpected error output
  # parallelize(workers: :number_of_processors)

  class TestGraphqlContext
    def self.with_user_con_profile(user_con_profile, **attrs)
      rendering_context =
        CmsRenderingContext.new(
          cms_parent: user_con_profile&.convention,
          controller: nil,
          timezone: ActiveSupport::TimeZone["UTC"]
        )

      new(
        user_con_profile: user_con_profile,
        current_user: user_con_profile&.user,
        pundit_user: AuthorizationInfo.cast(user_con_profile&.user),
        convention: user_con_profile&.convention,
        cms_rendering_context: rendering_context,
        cadmus_renderer: rendering_context.cadmus_renderer,
        verified_request: true,
        timezone_for_request: ActiveSupport::TimeZone["UTC"],
        **attrs
      )
    end

    attr_reader :attrs
    delegate :[], :[]=, :key?, :fetch, :delete, to: :attrs

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
      @errors = result["errors"]
      super(errors.map { |error| error["message"] }.join(", "))
    end

    def backtrace
      error_with_backtrace = errors.find { |error| error["extensions"] && error["extensions"]["backtrace"].present? }
      return super unless error_with_backtrace

      error_with_backtrace["extensions"]["backtrace"]
    end
  end

  def execute_graphql_query(query, user_con_profile: nil, context_attrs: {}, **options)
    context = TestGraphqlContext.with_user_con_profile(user_con_profile, **context_attrs)
    result = IntercodeSchema.execute(query, context: context, **options)
    raise GraphqlTestExecutionError.new(result) if result["errors"].present?
    result
  end
end

class ActionController::TestCase
  include Devise::Test::ControllerHelpers

  def set_convention(convention) # rubocop:disable Naming/AccessorMethodName
    @request.host = convention.domain
    @controller.request.env["intercode.convention"] = convention
  end
end

class ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def set_convention(convention) # rubocop:disable Naming/AccessorMethodName
    self.default_url_options = { host: convention.domain }
  end
end
