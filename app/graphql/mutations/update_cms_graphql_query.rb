class Mutations::UpdateCmsGraphqlQuery < GraphQL::Schema::RelayClassicMutation
  field :query, Types::CmsGraphqlQueryType, null: false

  argument :id, Int, required: true
  argument :query, Types::CmsGraphqlQueryInputType, required: true

  def resolve(id:, query:)
    existing_query = context[:convention].cms_graphql_queries.find(id)
    existing_query.update!(query.to_h)
    { query: existing_query }
  end
end
