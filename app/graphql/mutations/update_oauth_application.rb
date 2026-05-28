# frozen_string_literal: true
class Mutations::UpdateOAuthApplication < Mutations::BaseMutation
  description "Updates an existing OAuth2 application."

  field :oauth_application, Types::OAuthApplicationType, null: false, description: "The updated OAuth2 application."

  argument :id, ID, required: true, description: "The ID of the OAuth2 application to update."
  argument :oauth_application,
           Types::OAuthApplicationInputType,
           required: true,
           camelize: false,
           description: "Updated attributes for the OAuth2 application."

  load_and_authorize_model_with_id OAuthApplication, :id, :update

  def resolve(**args)
    attrs = args[:oauth_application].to_h
    attrs[:scopes] = attrs[:scopes].join(" ") if attrs.key?(:scopes)
    oauth_application.update!(attrs)

    { oauth_application: }
  end
end
