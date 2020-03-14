class Mutations::DeleteEmailRoute < Mutations::BaseMutation
  field :email_route, Types::EmailRouteType, null: false

  argument :id, Integer, required: true

  load_and_authorize_model_with_id EmailRoute, :id, :destroy

  def resolve(**_args)
    email_route.destroy!

    { email_route: email_route }
  end
end
