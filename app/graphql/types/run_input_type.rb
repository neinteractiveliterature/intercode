# frozen_string_literal: true
class Types::RunInputType < Types::BaseInputObject
  argument :starts_at, Types::DateType, required: false, camelize: false
  argument :title_suffix, String, required: false, camelize: false
  argument :schedule_note, String, required: false, camelize: false
  argument :room_ids,
           [Integer],
           required: false,
           camelize: false,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID."
  argument :transitional_room_ids, [ID], required: false, camelize: true
end
