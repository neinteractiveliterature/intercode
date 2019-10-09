class Types::AuthorizedApplicationType < Types::BaseObject
  field :id, Integer, null: false
  field :name, String, null: false
  field :scopes, [String], null: false

  def scopes
    object.scopes.to_a
  end
end
