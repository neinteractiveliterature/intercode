# frozen_string_literal: true
class Mutations::DeleteCmsGraphqlQuery < Mutations::BaseMutation
  field :query, Types::CmsGraphqlQueryType, null: false

  argument :id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_cms_model :cms_graphql_queries, :id, :destroy

  def resolve(**_args)
    cms_graphql_query.destroy!
    { query: cms_graphql_query }
  end
end
