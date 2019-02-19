class Types::OrganizationType < Types::BaseObject
  field :id, Int, null: false
  field :name, String, null: false
  field :conventions, [Types::ConventionType], null: false
  field :organization_roles, [Types::OrganizationRoleType], null: false, camelize: false

  association_loaders Organization, :conventions, :organization_roles
end
