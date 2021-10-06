# frozen_string_literal: true
class Mutations::UpdateOrganizationRole < Mutations::BaseMutation
  field :organization_role, Types::OrganizationRoleType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :organization_role, Types::OrganizationRoleInputType, required: true, camelize: false
  argument :add_user_ids,
           [Integer],
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_add_user_ids, [ID], required: false, camelize: true
  argument :remove_user_ids,
           [Integer],
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_remove_user_ids, [ID], required: false, camelize: true
  argument :add_permissions, [Types::PermissionInputType], required: false, camelize: false
  argument :remove_permission_ids,
           [Integer],
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_remove_permission_ids, [ID], required: false, camelize: true

  load_and_authorize_model_with_id OrganizationRole, :id, :update

  def resolve(**args)
    processed_args = process_transitional_ids_in_input(args, :add_user_ids, :remove_user_ids, :remove_permission_ids)
    organization_role.update!(
      user_ids: organization_role.user_ids + processed_args[:add_user_ids] - processed_args[:remove_user_ids],
      **processed_args[:organization_role].to_h
    )
    processed_args[:add_permissions].each { |permission| organization_role.permissions.create!(permission.to_h) }
    organization_role.permissions.where(id: processed_args[:remove_permission_ids]).destroy_all

    # not sure why, but if I don't do this it seems like permissions get returned twice
    organization_role.reload

    { organization_role: organization_role }
  end
end
