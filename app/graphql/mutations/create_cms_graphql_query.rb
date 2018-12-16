class Mutations::CreateCmsGraphqlQuery < GraphQL::Schema::RelayClassicMutation
  field :query, Types::CmsGraphqlQueryType, null: false
  argument :query, Types::CmsGraphqlQueryInputType, required: true

  def resolve(query:)
    { query: context[:convention].cms_graphql_queries.create!(query.to_h) }
  end
end
