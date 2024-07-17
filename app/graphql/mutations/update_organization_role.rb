# frozen_string_literal: true
class Mutations::UpdateOrganizationRole < Mutations::BaseMutation
  field :organization_role, Types::OrganizationRoleType, null: false

  argument :id, ID, required: false, camelize: true
  argument :organization_role, Types::OrganizationRoleInputType, required: true, camelize: false
  argument :add_user_ids, [ID], required: false, camelize: true
  argument :remove_user_ids, [ID], required: false, camelize: true
  argument :add_permissions, [Types::PermissionInputType], required: false, camelize: false
  argument :remove_permission_ids, [ID], required: false, camelize: true

  load_and_authorize_model_with_id OrganizationRole, :id, :update

  def resolve(**args)
    organization_role.update!(
      user_ids: organization_role.user_ids + args[:add_user_ids] - args[:remove_user_ids],
      **args[:organization_role].to_h
    )
    args[:add_permissions].each { |permission| organization_role.permissions.create!(permission) }
    organization_role.permissions.where(id: args[:remove_permission_ids]).destroy_all

    # not sure why, but if I don't do this it seems like permissions get returned twice
    organization_role.reload

    { organization_role: organization_role }
  end
end
