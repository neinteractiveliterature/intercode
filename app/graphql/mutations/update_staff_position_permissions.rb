class Mutations::UpdateStaffPositionPermissions < Mutations::BaseMutation
  field :staff_position, Types::StaffPositionType, null: false, camelize: false
  argument :staff_position_id, Int, required: true, camelize: false
  argument :grant_permissions, [Types::PermissionInputType], required: true, camelize: false
  argument :revoke_permissions, [Types::PermissionInputType], required: true, camelize: false

  attr_reader :staff_position

  def authorized?(args)
    @staff_position = convention.staff_positions.find(args[:staff_position_id])
    policy(Permission.new(model: staff_position)).create?
  end

  def resolve(**args)
    args[:grant_permissions].each do |permission_input|
      staff_position.permissions.find_or_create_by!(permission_attrs_for_input(permission_input))
    end

    args[:revoke_permissions].each do |permission_input|
      staff_position.permissions.where(permission_attrs_for_input(permission_input)).destroy_all
    end

    { staff_position: staff_position }
  end

  private

  def permission_attrs_for_input(input)
    permission_attrs_for_model(input[:model_type], input[:model_id]).merge(
      permission: input[:permission]
    )
  end

  def permission_attrs_for_model(model_type, model_id)
    case model_type
    when 'EventCategory' then { event_category_id: model_id }
    else raise ArgumentError, "Unknown permission model_type #{model_type}"
    end
  end
end
