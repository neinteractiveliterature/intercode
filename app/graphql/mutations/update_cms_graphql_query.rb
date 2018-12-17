class Mutations::UpdateCmsGraphqlQuery < GraphQL::Schema::RelayClassicMutation
  field :query, Types::CmsGraphqlQueryType, null: false

  argument :id, Int, required: true
  argument :query, Types::CmsGraphqlQueryInputType, required: true

  def resolve(id:, query:)
    query_scope = if context[:convention]
      context[:convention].cms_graphql_queries
    else
      CmsGraphqlQuery.global
    end

    existing_query = query_scope.find(id)
    existing_query.update!(query.to_h)
    { query: existing_query }
  end
end
