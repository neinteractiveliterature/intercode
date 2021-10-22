# frozen_string_literal: true
class Types::RunInputType < Types::BaseInputObject
  argument :starts_at, Types::DateType, required: false, camelize: false
  argument :title_suffix, String, required: false, camelize: false
  argument :schedule_note, String, required: false, camelize: false
  argument :transitional_room_ids,
           [ID],
           required: false,
           camelize: true,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the roomIds field so that \
we can remove this temporary one."
  argument :room_ids, [ID], required: false, camelize: true
end
