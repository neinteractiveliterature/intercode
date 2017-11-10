Types::RunType = GraphQL::ObjectType.define do
  name "Run"

  field :id, !types.Int
  field :event, Types::EventType
  field :starts_at, Types::DateType
  field :title_suffix, types.String
  field :schedule_note, types.String

  field :rooms, types[Types::RoomType] do
    resolve ->(obj, _args, _ctx) do
      AssociationLoader.for(Run, :rooms).load(obj)
    end
  end

  field :confirmed_signup_count, types.Int do
    resolve ->(obj, _args, ctx) {
      ctx[:confirmed_signup_count_by_run_id][obj.id] || 0
    }
  end

  field :waitlisted_signup_count, types.Int do
    resolve ->(obj, _args, ctx) {
      ctx[:waitlisted_signup_count_by_run_id][obj.id] || 0
    }
  end

  field :not_counted_signup_count, types.Int do
    resolve ->(obj, _args, ctx) {
      ctx[:not_counted_signup_count_by_run_id][obj.id] || 0
    }
  end

  field :my_signups, types[Types::SignupType] do
    resolve ->(obj, _args, ctx) {
      return [] unless ctx[:user_con_profile]
      ctx[:user_con_profile].signups.select { |signup| signup.run_id == obj.id }
    }
  end
end
