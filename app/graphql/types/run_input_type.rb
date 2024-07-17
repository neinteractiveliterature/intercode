# frozen_string_literal: true
class Types::RunInputType < Types::BaseInputObject
  argument :room_ids, [ID], required: false, camelize: true
  argument :schedule_note, String, required: false, camelize: false
  argument :starts_at, Types::DateType, required: false, camelize: false
  argument :title_suffix, String, required: false, camelize: false
end
