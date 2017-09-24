Types::NewRunInputType = GraphQL::InputObjectType.define do
  name "NewRunInput"

  input_field :event_id, !types.Int
  input_field :starts_at, !Types::DateType
  input_field :title_suffix, types.String
  input_field :schedule_note, types.String
  input_field :room_ids, types[types.Int]
end
