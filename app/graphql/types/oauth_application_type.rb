# frozen_string_literal: true
class Types::OAuthApplicationType < Types::BaseObject
  description "An OAuth2 application registered in this Intercode instance."

  field :confidential,
        Boolean,
        null: false,
        description: "Whether this application is confidential (can keep its secret secure)."
  field :id, ID, null: false, description: "The internal database ID of the application."
  field :is_intercode_frontend,
        Boolean,
        null: false,
        description: "Whether this is the built-in Intercode frontend application."
  field :name, String, null: false, description: "The display name of the application."
  field :redirect_uri, String, null: true, description: "The allowed redirect URI(s), one per line."
  field :scopes, [String], null: false, description: "The OAuth scopes this application is allowed to request."
  field :uid, String, null: false, description: "The OAuth client ID (UID) of the application."

  def scopes
    object.scopes.to_a
  end
end
