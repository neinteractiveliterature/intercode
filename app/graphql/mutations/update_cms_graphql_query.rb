# frozen_string_literal: true
class Mutations::UpdateCmsGraphqlQuery < Mutations::BaseMutation
  field :query, Types::CmsGraphqlQueryType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :query, Types::CmsGraphqlQueryInputType, required: true

  load_and_authorize_cms_model :cms_graphql_queries, :id, :update

  def resolve(**args)
    cms_graphql_query.update!(args[:query].to_h)
    { query: cms_graphql_query }
  end
end
