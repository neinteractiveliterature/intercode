# frozen_string_literal: true
class Mutations::CreateOrganizationRole < Mutations::BaseMutation
  field :organization_role, Types::OrganizationRoleType, null: false

  argument :organization_id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_organization_id, ID, required: false, camelize: true
  argument :organization_role, Types::OrganizationRoleInputType, required: true, camelize: false
  argument :user_ids,
           [Integer],
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_user_ids, [ID], required: false, camelize: true
  argument :permissions, [Types::PermissionInputType], required: true

  attr_reader :organization

  define_authorization_check do |args|
    @organization = Organization.find(args[:transitional_organization_id] || args[:organization_id])
    policy(OrganizationRole.new(organization: organization)).create?
  end

  def resolve(**args)
    processed_args = process_transitional_ids_in_input(args, :user_ids)
    new_role = organization.organization_roles.create!(processed_args[:organization_role].to_h)
    new_role.update!(user_ids: processed_args[:user_ids])
    processed_args[:permissions].each do |permission|
      new_role.permissions.create!(process_transitional_ids_in_input(permission, :model_id, :role_id))
    end

    # not sure why, but if I don't do this it seems like permissions get returned twice
    new_role.reload

    { organization_role: new_role }
  end
end
