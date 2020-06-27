class Types::RegistrationPolicyType < Types::BaseObject
  field :buckets, [Types::RegistrationPolicyBucketType], null: false
  field :prevent_no_preference_signups, Boolean, null: false
  field :slots_limited, Boolean, method: :slots_limited?, null: true
  field :only_uncounted, Boolean, method: :only_uncounted?, null: true
  field :total_slots, Integer, null: false
  field :preferred_slots, Integer, null: false
  field :minimum_slots, Integer, null: false
  field :total_slots_including_not_counted, Integer, null: false
  field :preferred_slots_including_not_counted, Integer, null: false
  field :minimum_slots_including_not_counted, Integer, null: false
end
