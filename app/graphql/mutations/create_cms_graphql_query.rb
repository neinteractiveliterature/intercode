class Mutations::CreateCmsGraphqlQuery < Mutations::BaseMutation
  field :query, Types::CmsGraphqlQueryType, null: false
  argument :query, Types::CmsGraphqlQueryInputType, required: true

  def resolve(query:)
    query_scope = if context[:convention]
      context[:convention].cms_graphql_queries
    else
      CmsGraphqlQuery.global
    end
    { query: query_scope.create!(query.to_h) }
  end
end
