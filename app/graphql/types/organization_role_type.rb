# frozen_string_literal: true
class Types::OrganizationRoleType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :name, String, null: false
  field :organization, Types::OrganizationType, null: false
  field :users, [Types::UserType], null: false
  field :permissions, [Types::PermissionType], null: false

  association_loaders OrganizationRole, :organization, :users, :permissions
end
