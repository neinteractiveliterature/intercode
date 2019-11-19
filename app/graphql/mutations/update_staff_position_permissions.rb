class Mutations::UpdateStaffPositionPermissions < Mutations::BaseMutation
  field :staff_position, Types::StaffPositionType, null: false, camelize: false
  argument :staff_position_id, Int, required: true, camelize: false
  argument :grant_permissions, [Types::PermissionInputType], required: true, camelize: false
  argument :revoke_permissions, [Types::PermissionInputType], required: true, camelize: false

  attr_reader :staff_position

  define_authorization_check do |args|
    @staff_position = convention.staff_positions.find(args[:staff_position_id])
    policy(Permission.new(role: staff_position)).create?
  end

  def resolve(**args)
    Types::PermissionInputType.load_permission_input_models(args[:grant_permissions]).each do |input|
      Permission.grant(staff_position, input[:model], input[:permission])
    end

    Types::PermissionInputType.load_permission_input_models(args[:revoke_permissions]).each do |input|
      Permission.revoke(staff_position, input[:model], input[:permission])
    end

    { staff_position: staff_position }
  end
end
