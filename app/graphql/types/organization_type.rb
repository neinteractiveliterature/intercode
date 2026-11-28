# frozen_string_literal: true
class Types::OrganizationType < Types::BaseObject
  description "A group that runs one or more conventions"
  field :conventions, [Types::ConventionType], null: false, description: "The conventions this organization runs"
  field :current_ability_can_manage_access,
        Boolean,
        null: false,
        description: "Whether you can manage who has access to this organization"
  field :id, ID, null: false, description: "The ID of this organization"
  field :name, String, null: false, description: "The name of this organization"
  field :organization_roles,
        [Types::OrganizationRoleType],
        null: false,
        camelize: false,
        description: "The roles within this organization"

  association_loaders Organization, :conventions, :organization_roles

  # rubocop:disable-next Naming/PredicateMethod
  def current_ability_can_manage_access
    policy(OrganizationRole.new(organization_id: object.id)).manage?
  end
end
