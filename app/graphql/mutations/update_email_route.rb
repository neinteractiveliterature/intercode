# frozen_string_literal: true
class Mutations::UpdateEmailRoute < Mutations::BaseMutation
  field :email_route, Types::EmailRouteType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :email_route, Types::EmailRouteInputType, required: true, camelize: false

  load_and_authorize_model_with_id EmailRoute, :id, :update

  def resolve(**args)
    email_route.update!(args[:email_route].to_h)

    { email_route: email_route }
  end
end
