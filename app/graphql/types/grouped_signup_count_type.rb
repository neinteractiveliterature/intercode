class Types::GroupedSignupCountType < Types::BaseObject
  field :state, Types::SignupStateType, null: false
  field :bucket_key, String, null: true
  field :counted, Boolean, null: false
  field :count, Integer, null: false
end
