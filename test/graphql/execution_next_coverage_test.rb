# frozen_string_literal: true
require "test_helper"

# GraphQL-Ruby's new engine (execute_next) doesn't call a type's resolver method unless the field says how to.  Without
# that it calls the method on the underlying object instead, which skips whatever the resolver method does (including
# any filtering) without raising an error.  So every such field has to be converted before the new engine serves real
# requests.
#
# execution_next_pending_fields.txt lists the fields that still need converting.  It should only ever get shorter, and
# the new engine must not be turned on until it's empty.  After converting fields, regenerate it with:
#
#   UPDATE_PENDING_FIELDS=1 bin/rails test test/graphql/execution_next_coverage_test.rb
#
# This only covers what queries can reach, since mutations stay on the original engine.  It also can't tell whether a
# field with no resolver method works on the new engine (for example, one backed by a Hash).  Running the tests with
# GRAPHQL_EXECUTION_NEXT=1 is how to find those.
class ExecutionNextCoverageTest < ActiveSupport::TestCase
  PENDING_FIELDS_PATH = File.expand_path("execution_next_pending_fields.txt", __dir__)

  # Execution modes that don't depend on a resolver method on an instance of the type.  resolve_legacy_instance_method
  # is deliberately missing: it can't batch Dataloader calls, and GraphQL-Ruby plans to remove it.
  CONVERTED_MODES = %i[resolve_static resolve_each resolve_batch dataload hash_key dig].freeze

  test "the list of fields still to be converted for execute_next is accurate" do
    pending = pending_fields
    File.write(PENDING_FIELDS_PATH, pending.map { |name| "#{name}\n" }.join) if ENV["UPDATE_PENDING_FIELDS"]
    listed = File.readlines(PENDING_FIELDS_PATH, chomp: true)

    assert_empty pending - listed,
                 "These fields have a resolver method but don't tell execute_next how to use it.  Add " \
                   "resolve_static:, resolve_each:, resolve_batch: or dataload: to each one"
    assert_empty listed - pending, "These fields no longer need converting.  See the top of this file"
  end

  private

  def pending_fields
    object_types_reachable_from_queries
      .flat_map do |type|
        type.fields.values.filter_map do |field|
          "#{type.graphql_name}.#{field.graphql_name}" if needs_conversion?(type, field)
        end
      end
      .sort
  end

  def needs_conversion?(type, field)
    return false if CONVERTED_MODES.include?(field.execution_mode)
    return true if field.resolver

    method_name = field.resolver_method
    type.method_defined?(method_name) && !GraphQL::Schema::Object.method_defined?(method_name)
  end

  def object_types_reachable_from_queries
    seen = Set.new
    queue = [IntercodeSchema.query]

    while (type = queue.shift)
      queue.concat(types_directly_reachable_from(type)) if seen.add?(type)
    end

    seen.select { |type| type.kind.object? && !type.graphql_name.start_with?("__") }
  end

  def types_directly_reachable_from(type)
    possible_types = type.kind.abstract? ? IntercodeSchema.possible_types(type) : []
    field_types = type.respond_to?(:fields) ? type.fields.values.map { |field| field.type.unwrap } : []
    possible_types + field_types
  end
end
