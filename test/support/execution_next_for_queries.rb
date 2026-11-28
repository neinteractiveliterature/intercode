# frozen_string_literal: true
# GRAPHQL_EXECUTION_NEXT=1 runs the tests' queries on GraphQL-Ruby's new execution engine, which the app doesn't use
# yet.  Mutations stay on the original engine.  See test/graphql/execution_next_coverage_test.rb.
module ExecutionNextForQueries
  def self.mutation?(query)
    GraphQL
      .parse(query)
      .definitions
      .grep(GraphQL::Language::Nodes::OperationDefinition)
      .any? { |operation| operation.operation_type == "mutation" }
  rescue GraphQL::ParseError
    false
  end

  def execute(query_str = nil, **kwargs)
    query = query_str || kwargs[:query]
    return super if query.nil? || ExecutionNextForQueries.mutation?(query)

    execute_next(query_str, **kwargs)
  end

  def multiplex(queries, **)
    return super if queries.any? { |query| ExecutionNextForQueries.mutation?(query[:query].to_s) }

    multiplex_next(queries, **)
  end
end

IntercodeSchema.singleton_class.prepend(ExecutionNextForQueries) if ENV["GRAPHQL_EXECUTION_NEXT"]
