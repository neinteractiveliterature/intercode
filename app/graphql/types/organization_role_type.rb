# frozen_string_literal: true
class Types::OrganizationRoleType < Types::BaseObject
  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :name, String, null: false
  field :organization, Types::OrganizationType, null: false
  field :users, [Types::UserType], null: false
  field :permissions, [Types::PermissionType], null: false

  association_loaders OrganizationRole, :organization, :users, :permissions
end
