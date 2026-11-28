# frozen_string_literal: true
# Runs a selection on one GraphQL type with both the original execution engine and execute_next, and checks that they
# agree.  The type is exposed at the root of a small schema made for the purpose, so that its fields can be checked
# before the fields leading to it from the real schema's root have been converted.
module ExecutionEngineComparisonHelper
  # Pass [SomeType] to check a list, which is what's needed to see whether loading is batched
  def self.schema_for(type)
    @schemas ||= {}
    @schemas[type] ||= build_schema(type)
  end

  def self.build_schema(type)
    query_type =
      Class.new(GraphQL::Schema::Object) do
        graphql_name "Query"
        field :subject, type, null: true, resolve_static: true

        define_singleton_method(:subject) { |context| context[:subject] }
        define_method(:subject) { context[:subject] }
      end

    Class.new(GraphQL::Schema) do
      query query_type
      use GraphQL::Dataloader
      use GraphQL::Execution::Next

      def self.resolve_type(abstract_type, object, context)
        IntercodeSchema.resolve_type(abstract_type, object, context)
      end
    end
  end

  # Returns the data both engines agreed on.  context_builder is called once per engine, and so is subject_builder, so
  # that nothing one engine loads is left behind for the other.
  def assert_engines_agree(type, selection, subject_builder, context_builder)
    results =
      %i[execute_legacy execute_next].map do |execution_method|
        context = context_builder.call
        context[:subject] = subject_builder.call
        count_queries do
          ExecutionEngineComparisonHelper
            .schema_for(type)
            .public_send(execution_method, "{ subject { #{selection} } }", context:)
            .to_h
        end
      end

    (legacy_result, legacy_queries), (next_result, next_queries) = results
    assert_nil legacy_result["errors"]
    assert_equal legacy_result, next_result
    assert_operator next_queries, :<=, legacy_queries, "execute_next ran more queries, so something isn't batched"
    next_result.dig("data", "subject")
  end

  private

  def count_queries(&)
    count = 0
    counter = ->(*, payload) { count += 1 unless payload[:cached] || %w[SCHEMA TRANSACTION].include?(payload[:name]) }
    ActiveRecord::Base.connection.clear_query_cache
    result = ActiveSupport::Notifications.subscribed(counter, "sql.active_record", &)
    [result, count]
  end
end
