class Types::GroupedSignupCountType < Types::BaseObject
  field :bucket_key, String, null: true
  field :count, Integer, null: false
  field :counted, Boolean, null: false
  field :requested_bucket_key, String, null: true
  field :state, Types::SignupStateType, null: false
  field :team_member, Boolean, null: false
end
