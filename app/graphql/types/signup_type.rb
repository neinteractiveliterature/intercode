Types::SignupType = GraphQL::ObjectType.define do
  name 'Signup'

  field :id, !types.Int
  field :state, Types::SignupStateType
  field :counted, types.Boolean
  field :bucket_key, types.String do
    resolve ->(signup, _args, ctx) do
      if ctx[:current_ability].can?(:read, signup) || signup.bucket.expose_attendees?
        signup.bucket_key
      end
    end
  end
  field :requested_bucket_key, types.String do
    guard ->(signup, _args, ctx) do
      ctx[:current_ability].can?(:read, signup)
    end
  end

  field :run, Types::RunType do
    resolve ->(obj, _args, _ctx) {
      RecordLoader.for(Run).load(obj.run_id)
    }
  end

  field :user_con_profile, Types::UserConProfileType do
    resolve ->(obj, _args, _ctx) {
      RecordLoader.for(UserConProfile).load(obj.user_con_profile_id)
    }
  end
end
