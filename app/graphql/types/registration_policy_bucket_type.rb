Types::RegistrationPolicyBucketType = GraphQL::ObjectType.define do
  name "RegistrationPolicyBucket"

  field :key, !types.String
  field :name, !types.String
  field :description, !types.String
  field :minimum_slots, types.Int
  field :preferred_slots, types.Int
  field :total_slots, types.Int
  field :slots_limited, !types.Boolean
  field :anything, !types.Boolean
end
