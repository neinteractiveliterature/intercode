class CmsGraphqlQuery < ApplicationRecord
  belongs_to :parent, polymorphic: true

  validate :ensure_valid_query

  def execute(context:, variables:)
    IntercodeSchema.execute(
      query,
      variables: variables,
      context: context
    )
  end

  private

  def ensure_valid_query
    parsed_query = GraphQL::Query.new(IntercodeSchema.to_graphql, query)
    (parsed_query.static_errors + parsed_query.analysis_errors).each do |error|
      errors.add :query, error.message
    end
    errors.add :query, 'must be a GraphQL query (not a mutation or subscription)' unless parsed_query.query?
  end
end
