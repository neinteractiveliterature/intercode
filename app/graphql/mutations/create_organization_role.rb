class Mutations::CreateOrganizationRole < Mutations::BaseMutation
  field :organization_role, Types::OrganizationRoleType, null: false

  argument :organization_id, Integer, required: true, camelize: false
  argument :organization_role, Types::OrganizationRoleInputType, required: true, camelize: false
  argument :user_ids, [Integer], required: true, camelize: false
  argument :permissions, [Types::PermissionInputType], required: true

  def resolve(organization_id:, organization_role:, user_ids:, permissions:)
    organization = Organization.find(organization_id)
    new_role = organization.organization_roles.create!(organization_role.to_h)
    new_role.update!(user_ids: user_ids)
    permissions.each do |permission|
      new_role.permissions.create!(permission.to_h)
    end
    { organization_role: new_role }
  end
end
