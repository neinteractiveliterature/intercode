Types::RunInputType = GraphQL::InputObjectType.define do
  name "RunInput"

  input_field :starts_at, Types::DateType
  input_field :title_suffix, types.String
  input_field :schedule_note, types.String
  input_field :room_ids, types[types.Int]
end
