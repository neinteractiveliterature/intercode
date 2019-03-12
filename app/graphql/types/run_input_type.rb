class Types::RunInputType < Types::BaseInputObject
  argument :starts_at, Types::DateType, required: false, camelize: false
  argument :title_suffix, String, required: false, camelize: false
  argument :schedule_note, String, required: false, camelize: false
  argument :room_ids, [Integer], required: false, camelize: false
end
