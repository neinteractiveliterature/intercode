# frozen_string_literal: true
class Types::OrganizationRoleType < Types::BaseObject
  description "A role within an organization that grants permissions to its members"
  field :id, ID, null: false, description: "The ID of this organization role"
  field :name, String, null: false, description: "The name of this role"
  field :organization,
        Types::OrganizationType,
        association_model: OrganizationRole,
        null: false,
        description: "The organization this role belongs to"
  field :permissions,
        [Types::PermissionType],
        association_model: OrganizationRole,
        null: false,
        description: "The permissions this role grants"
  field :users,
        [Types::UserType],
        association_model: OrganizationRole,
        null: false,
        description: "The users who have this role"
end
