class Mutations::DeleteCmsGraphqlQuery < Mutations::BaseMutation
  field :query, Types::CmsGraphqlQueryType, null: false

  argument :id, Int, required: true

  def resolve(id:)
    query_scope = if context[:convention]
      context[:convention].cms_graphql_queries
    else
      CmsGraphqlQuery.global
    end

    existing_query = query_scope.find(id)
    existing_query.destroy!
    { query: existing_query }
  end
end
