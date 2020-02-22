class CmsGraphqlQuery < ApplicationRecord
  include Cadmus::Concerns::ModelWithParent
  model_with_parent

  validates :identifier, uniqueness: { scope: [:parent_type, :parent_id] }
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

    return if parsed_query.query?
    errors.add :query, 'must be a GraphQL query (not a mutation or subscription)'
  end
end
