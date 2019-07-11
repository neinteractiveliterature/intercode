class Mutations::CreateCmsGraphqlQuery < Mutations::BaseMutation
  field :query, Types::CmsGraphqlQueryType, null: false
  argument :query, Types::CmsGraphqlQueryInputType, required: true

  authorize_create_cms_model :cms_graphql_queries

  def resolve(query:)
    { query: cms_parent.cms_graphql_queries.create!(query.to_h) }
  end
end
