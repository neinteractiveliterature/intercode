class Mutations::DeleteCmsGraphqlQuery < GraphQL::Schema::RelayClassicMutation
  field :query, Types::CmsGraphqlQueryType, null: false

  argument :id, Int, required: true

  def resolve(id:)
    existing_query = context[:convention].cms_graphql_queries.find(id)
    existing_query.destroy!
    { query: existing_query }
  end
end
