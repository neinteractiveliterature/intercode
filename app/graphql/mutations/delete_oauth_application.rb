# frozen_string_literal: true
class Mutations::DeleteOAuthApplication < Mutations::BaseMutation
  description "Deletes an OAuth2 application and revokes all associated tokens."

  field :oauth_application, Types::OAuthApplicationType, null: false, description: "The deleted OAuth2 application."

  argument :id, ID, required: true, description: "The ID of the OAuth2 application to delete."

  load_and_authorize_model_with_id OAuthApplication, :id, :destroy

  def resolve(**_args)
    oauth_application.destroy!

    { oauth_application: }
  end
end
