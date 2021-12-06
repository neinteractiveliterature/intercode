# frozen_string_literal: true
class Mutations::DeleteCmsGraphqlQuery < Mutations::BaseMutation
  field :query, Types::CmsGraphqlQueryType, null: false

  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_graphql_queries, :id, :destroy

  def resolve(**_args)
    cms_graphql_query.destroy!
    { query: cms_graphql_query }
  end
end
