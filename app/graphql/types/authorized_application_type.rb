# frozen_string_literal: true
class Types::AuthorizedApplicationType < Types::BaseObject
  description "An OAuth application that a user has authorized."

  field :is_intercode_frontend,
        Boolean,
        null: false,
        description: "Whether this is the built-in Intercode frontend application."
  field :name, String, null: false, description: "The display name of the OAuth application."
  field :scopes, [String], null: false, description: "The OAuth scopes granted to this application."
  field :uid, ID, null: false, description: "The OAuth application's unique identifier."

  def scopes
    object.scopes.to_a
  end
end
