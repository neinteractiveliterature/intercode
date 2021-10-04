# frozen_string_literal: true
class Mutations::DeleteEmailRoute < Mutations::BaseMutation
  field :email_route, Types::EmailRouteType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_model_with_id EmailRoute, :id, :destroy

  def resolve(**_args)
    email_route.destroy!

    { email_route: email_route }
  end
end
