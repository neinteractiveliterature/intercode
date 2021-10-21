# frozen_string_literal: true
class Mutations::UpdateStaffPosition < Mutations::BaseMutation
  field :staff_position, Types::StaffPositionType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :staff_position, Types::StaffPositionInputType, required: true, camelize: false

  load_and_authorize_convention_associated_model :staff_positions, :id, :update

  def resolve(**args)
    attrs = process_transitional_ids_in_input(args[:staff_position].to_h, :user_con_profile_ids)
    staff_position.update!(attrs)

    { staff_position: staff_position }
  end
end
