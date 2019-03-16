class Mutations::DeleteOrganizationRole < Mutations::BaseMutation
  argument :id, Integer, required: true

  def resolve(id:)
    organization_role = OrganizationRole.find(id)
    organization_role.destroy!
    {}
  end
end
