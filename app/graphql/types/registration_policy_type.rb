Types::RegistrationPolicyType = GraphQL::ObjectType.define do
  name 'RegistrationPolicy'

  field :buckets, !types[!Types::RegistrationPolicyBucketType]
  field :prevent_no_preference_signups, !types.Boolean
  field :slots_limited, types.Boolean, property: :slots_limited?
  field :total_slots, types.Int
  field :preferred_slots, types.Int
  field :minimum_slots, types.Int
end
