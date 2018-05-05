Types::RunType = GraphQL::ObjectType.define do
  name 'Run'

  field :id, !types.Int
  field :event, Types::EventType
  field :starts_at, Types::DateType
  field :ends_at, Types::DateType
  field :title_suffix, types.String
  field :schedule_note, types.String

  field :rooms, types[Types::RoomType] do
    resolve ->(obj, _args, _ctx) do
      AssociationLoader.for(Run, :rooms).load(obj)
    end
  end

  field :confirmed_signup_count, types.Int do
    resolve ->(obj, _args, _ctx) {
      SignupCountLoader.for.load(obj).then do |presenter|
        presenter.counted_signups_by_state('confirmed').size
      end
    }
  end

  field :confirmed_limited_signup_count, types.Int do
    resolve ->(obj, _args, _ctx) {
      SignupCountLoader.for.load(obj).then(&:confirmed_limited_count)
    }
  end

  field :waitlisted_signup_count, types.Int do
    resolve ->(obj, _args, _ctx) {
      SignupCountLoader.for.load(obj).then do |presenter|
        presenter.counted_signups_by_state('waitlisted').size
      end
    }
  end

  field :not_counted_signup_count, types.Int do
    resolve ->(obj, _args, _ctx) {
      SignupCountLoader.for.load(obj).then do |presenter|
        (
          presenter.not_counted_signups_by_state('confirmed').size +
          presenter.not_counted_signups_by_state('waitlisted').size
        )
      end
    }
  end

  field :my_signups, types[Types::SignupType] do
    resolve ->(obj, _args, ctx) {
      return [] unless ctx[:user_con_profile]
      ctx[:user_con_profile].signups.select { |signup| signup.run_id == obj.id }
    }
  end
end
