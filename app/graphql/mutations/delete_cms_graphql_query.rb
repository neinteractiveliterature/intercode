# frozen_string_literal: true
class Mutations::DeleteCmsGraphqlQuery < Mutations::BaseMutation
  field :query, Types::CmsGraphqlQueryType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_graphql_queries, :id, :destroy

  def resolve(**_args)
    cms_graphql_query.destroy!
    { query: cms_graphql_query }
  end
end
