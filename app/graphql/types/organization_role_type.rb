# frozen_string_literal: true
class Types::OrganizationRoleType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: false
  field :organization, Types::OrganizationType, null: false
  field :permissions, [Types::PermissionType], null: false
  field :users, [Types::UserType], null: false

  association_loaders OrganizationRole, :organization, :users, :permissions
end
