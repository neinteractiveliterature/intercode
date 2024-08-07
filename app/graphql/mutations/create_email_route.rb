# frozen_string_literal: true
class Mutations::CreateEmailRoute < Mutations::BaseMutation
  field :email_route, Types::EmailRouteType, null: false

  argument :email_route, Types::EmailRouteInputType, required: true, camelize: false

  define_authorization_check { |_args| policy(EmailRoute.new).create? }

  def resolve(**args)
    email_route = EmailRoute.create!(args[:email_route].to_h)

    { email_route: }
  end
end
