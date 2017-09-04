Types::SignupType = GraphQL::ObjectType.define do
  name "Signup"
  field :run, Types::RunType
  field :user_con_profile, Types::UserConProfileType
  field :state, Types::SignupStateType
  field :counted, types.Boolean
  field :bucket_key, types.String
  field :requested_bucket_key, types.String
end
