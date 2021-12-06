# frozen_string_literal: true
class Types::OrganizationType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: false
  field :conventions, [Types::ConventionType], null: false
  field :organization_roles, [Types::OrganizationRoleType], null: false, camelize: false
  field :current_ability_can_manage_access, Boolean, null: false

  association_loaders Organization, :conventions, :organization_roles

  def current_ability_can_manage_access
    policy(OrganizationRole.new(organization_id: object.id)).manage?
  end
end
