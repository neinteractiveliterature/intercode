# frozen_string_literal: true
class Types::AuthorizedApplicationType < Types::BaseObject
  field :name, String, null: false
  field :scopes, [String], null: false
  field :uid, ID, null: false

  def scopes
    object.scopes.to_a
  end
end
