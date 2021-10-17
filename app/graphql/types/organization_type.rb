# frozen_string_literal: true
class Types::OrganizationType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :name, String, null: false
  field :conventions, [Types::ConventionType], null: false
  field :organization_roles, [Types::OrganizationRoleType], null: false, camelize: false
  field :current_ability_can_manage_access, Boolean, null: false

  association_loaders Organization, :conventions, :organization_roles

  def current_ability_can_manage_access
    policy(OrganizationRole.new(organization_id: object.id)).manage?
  end
end
