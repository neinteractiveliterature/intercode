class Types::OrganizationType < Types::BaseObject
  field :id, Int, null: false
  field :name, String, null: false
  field :conventions, [Types::ConventionType], null: false
  field :organization_roles, [Types::OrganizationRoleType], null: false, camelize: false
  field :current_ability_can_manage_access, Boolean, null: false

  association_loaders Organization, :conventions, :organization_roles

  def current_ability_can_manage_access
    can?(:manage, OrganizationRole.new(organization_id: object.id))
  end
end
