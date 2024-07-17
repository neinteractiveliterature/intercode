# frozen_string_literal: true
class Mutations::DeleteOrganizationRole < Mutations::BaseMutation
  argument :id, ID, required: false

  load_and_authorize_model_with_id OrganizationRole, :id, :destroy

  def resolve(*, id:)
    organization_role.destroy!
    {}
  end
end
