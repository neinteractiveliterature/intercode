# frozen_string_literal: true
class Mutations::DeleteOrganizationRole < Mutations::BaseMutation
  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_model_with_id OrganizationRole, :id, :destroy

  def resolve(*)
    organization_role.destroy!
    {}
  end
end
