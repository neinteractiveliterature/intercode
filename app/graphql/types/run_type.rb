Types::RunType = GraphQL::ObjectType.define do
  name "Run"

  field :id, !types.Int
  field :event, Types::EventType
  field :starts_at, Types::DateType
  field :title_suffix, types.String
  field :schedule_note, types.String
  field :rooms, types[Types::RoomType]

  field :my_signups, types[Types::SignupType] do
    resolve ->(obj, _args, ctx) {
      obj.signups.where(user_con_profile_id: ctx[:user_con_profile]&.id)
    }
  end
end
