# frozen_string_literal: true
class Mutations::RegenerateOAuthApplicationSecret < Mutations::BaseMutation
  description "Regenerates the secret for an OAuth2 application. Returns the new plaintext secret once."

  field :oauth_application,
        Types::OAuthApplicationType,
        null: false,
        description: "The OAuth2 application with a newly generated secret."
  field :secret,
        String,
        null: false,
        description: "The new plaintext client secret. Store it now; it will not be shown again."

  argument :id, ID, required: true, description: "The ID of the OAuth2 application."

  load_and_authorize_model_with_id OAuthApplication, :id, :manage

  def resolve(**_args)
    oauth_application.renew_secret
    oauth_application.save!

    { oauth_application:, secret: oauth_application.plaintext_secret }
  end
end
