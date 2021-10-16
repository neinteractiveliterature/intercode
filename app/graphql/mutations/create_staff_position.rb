# frozen_string_literal: true
class Mutations::CreateStaffPosition < Mutations::BaseMutation
  field :staff_position, Types::StaffPositionType, null: false

  argument :staff_position, Types::StaffPositionInputType, required: true, camelize: false

  authorize_create_convention_associated_model :staff_positions

  def resolve(**args)
    attrs = process_transitional_ids_in_input(args[:staff_position].to_h, :user_con_profile_ids)
    staff_position = convention.staff_positions.create!(attrs)
    { staff_position: staff_position }
  end
end
