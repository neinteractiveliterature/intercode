class Types::OrganizationRoleType < Types::BaseObject
  field :id, Int, null: false
  field :name, String, null: false
  field :organization, Types::OrganizationType, null: false
  field :users, [Types::UserType], null: false
  field :permissions, [Types::PermissionType], null: false

  association_loaders OrganizationRole, :organization, :users, :permissions
end
