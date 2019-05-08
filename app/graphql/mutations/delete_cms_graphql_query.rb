class Mutations::DeleteCmsGraphqlQuery < Mutations::BaseMutation
  field :query, Types::CmsGraphqlQueryType, null: false

  argument :id, Int, required: true

  def resolve(id:)
    existing_query = cms_parent.cms_graphql_queries.find(id)
    existing_query.destroy!
    { query: existing_query }
  end
end
