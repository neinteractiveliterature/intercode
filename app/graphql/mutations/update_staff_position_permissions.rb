# frozen_string_literal: true
class Mutations::UpdateStaffPositionPermissions < Mutations::BaseMutation
  field :staff_position, Types::StaffPositionType, null: false, camelize: false
  argument :staff_position_id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_staff_position_id, ID, required: false, camelize: true
  argument :grant_permissions, [Types::PermissionInputType], required: true, camelize: false
  argument :revoke_permissions, [Types::PermissionInputType], required: true, camelize: false

  attr_reader :staff_position

  define_authorization_check do |args|
    @staff_position = convention.staff_positions.find(args[:staff_position_id])
    policy(Permission.new(role: staff_position)).create?
  end

  def resolve(**args)
    grant_permissions = Types::PermissionInputType.load_permission_input_models(args[:grant_permissions])
    revoke_permissions = Types::PermissionInputType.load_permission_input_models(args[:revoke_permissions])

    grant_permissions.each { |input| Permission.grant(staff_position, input[:model], input[:permission]) }

    revoke_permissions.each { |input| Permission.revoke(staff_position, input[:model], input[:permission]) }

    { staff_position: staff_position }
  end
end
