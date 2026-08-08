# frozen_string_literal: true
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

require File.expand_path("../config/environment", __dir__)
require "rails/test_help"

require "minitest/reporters"
if ENV["CI"].present?
  Minitest::Reporters.use!(
    [
      Minitest::Reporters::SpecReporter.new,
      Minitest::Reporters::HtmlReporter.new(output_filename: "minitest-report.html"),
      Minitest::Reporters::JUnitReporter.new
    ],
    ENV,
    Minitest.backtrace_filter
  )
else
  Minitest::Reporters.use!(Minitest::Reporters::ProgressReporter.new, ENV, Minitest.backtrace_filter)
end

require "capybara/cuprite"
Capybara.javascript_driver = :cuprite
Capybara.register_driver(:cuprite) do |app|
  Capybara::Cuprite::Driver.new(
    app,
    window_size: [1200, 800],
    headless: %w[0 false].exclude?(ENV.fetch("HEADLESS", nil)),
    js_errors: true
  )
end

require "capybara/rails"
require "capybara/minitest"

DatabaseCleaner.strategy = :truncation

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
      super(errors.pluck("message").join(", "))
    end

    def backtrace
      error_with_backtrace = errors.find { |error| error["extensions"] && error["extensions"]["backtrace"].present? }
      return super unless error_with_backtrace

      error_with_backtrace["extensions"]["backtrace"]
    end
  end

  def execute_graphql_query(query, user_con_profile: nil, context_attrs: {}, **)
    context = TestGraphqlContext.with_user_con_profile(user_con_profile, **context_attrs)
    result = IntercodeSchema.execute(query, context:, **)
    raise GraphqlTestExecutionError, result if result["errors"].present?
    result
  end

  # Test-only convenience: production code identifies buckets by id (or, during registration policy
  # simulation, object identity), not key -- see #11892. Tests still often only know a bucket by the
  # key its factory/fixture was created with.
  def bucket_with_key(registration_policy, key)
    normalized_key = RegistrationPolicyBucket.normalize_key(key)
    registration_policy.buckets.find { |bucket| bucket.key == normalized_key }
  end

  # Test-only convenience: mimics what the registration policy editor now sends for an edit to an
  # existing policy (see #11895/#11897) -- each bucket spec carries the real id of whichever
  # existing bucket has the same key, so RegistrationPolicy#sync_buckets_from_hash! matches it by
  # id rather than creating (and destroying the old) row. A spec whose key has no existing match
  # gets no id, correctly describing a brand-new bucket.
  def build_edited_registration_policy(event, bucket_specs, **policy_attrs)
    existing_by_key = event.registration_policy.buckets.index_by(&:key)
    buckets =
      bucket_specs.map do |spec|
        existing = existing_by_key[RegistrationPolicyBucket.normalize_key(spec[:key])]
        existing ? spec.merge(id: existing.id) : spec
      end
    RegistrationPolicy.build_from_hash(policy_attrs.merge(buckets: buckets))
  end

  # Test-only convenience: RegistrationPolicy#equivalent_to? matches by id (see #11897), so it
  # can't verify "these two independently-persisted/detached policies describe the same buckets"
  # -- e.g. a clone against its source, or a freshly-persisted policy against the detached hash
  # that requested it (both real scenarios with no id overlap by design). Matches buckets by key
  # instead, which is what actually varies in those cases, and compares content the same way
  # RegistrationPolicyBucket#equivalent_to? always has.
  def assert_registration_policies_have_equivalent_buckets(expected, actual)
    actual_buckets_by_key = actual.buckets.index_by(&:key)
    assert_equal expected.buckets.map(&:key).sort, actual_buckets_by_key.keys.sort
    expected.buckets.each do |bucket|
      assert bucket.equivalent_to?(actual_buckets_by_key[bucket.key]), "bucket #{bucket.key.inspect} not equivalent"
    end
  end

  # Counts SQL queries matching pattern issued while running the block, for asserting on N+1s
  # (e.g. assert_operator count_queries(/registration_policy_buckets/) { subject.call! }, :<=, 1).
  def count_queries(pattern)
    count = 0
    subscriber =
      ActiveSupport::Notifications.subscribe("sql.active_record") do |*, payload|
        count += 1 if pattern.match?(payload[:sql])
      end
    yield
    count
  ensure
    ActiveSupport::Notifications.unsubscribe(subscriber) if subscriber
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
