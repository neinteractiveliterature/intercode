# frozen_string_literal: true
class Types::OrganizationRoleType < Types::BaseObject
  description "A role within an organization that grants permissions to its members"
  field :id, ID, null: false, description: "The ID of this organization role"
  field :name, String, null: false, description: "The name of this role"
  field :organization, Types::OrganizationType, null: false, description: "The organization this role belongs to"
  field :permissions, [Types::PermissionType], null: false, description: "The permissions this role grants"
  field :users, [Types::UserType], null: false, description: "The users who have this role"

  association_loaders OrganizationRole, :organization, :users, :permissions
end
