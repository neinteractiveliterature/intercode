class Mutations::DeleteOrganizationRole < Mutations::BaseMutation
  argument :id, Integer, required: true

  load_and_authorize_model_with_id OrganizationRole, :id, :destroy

  def resolve(*)
    organization_role.destroy!
    {}
  end
end
