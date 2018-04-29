Types::SignupType = GraphQL::ObjectType.define do
  name 'Signup'

  field :id, !types.Int
  field :state, Types::SignupStateType
  field :counted, types.Boolean
  field :bucket_key, types.String
  field :requested_bucket_key, types.String

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
