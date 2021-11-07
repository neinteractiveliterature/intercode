# frozen_string_literal: true
class Types::OrganizationType < Types::BaseObject
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
  field :conventions, [Types::ConventionType], null: false
  field :organization_roles, [Types::OrganizationRoleType], null: false, camelize: false
  field :current_ability_can_manage_access, Boolean, null: false

  association_loaders Organization, :conventions, :organization_roles

  def current_ability_can_manage_access
    policy(OrganizationRole.new(organization_id: object.id)).manage?
  end
end
