# frozen_string_literal: true
class Mutations::DeleteEmailRoute < Mutations::BaseMutation
  field :email_route, Types::EmailRouteType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_model_with_id EmailRoute, :id, :destroy

  def resolve(**_args)
    email_route.destroy!

    { email_route: email_route }
  end
end
