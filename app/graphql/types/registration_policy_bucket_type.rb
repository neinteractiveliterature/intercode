Types::RegistrationPolicyBucketType = GraphQL::ObjectType.define do
  name 'RegistrationPolicyBucket'

  field :key, !types.String
  field :name, types.String
  field :description, types.String
  field :minimum_slots, types.Int
  field :preferred_slots, types.Int
  field :total_slots, types.Int

  field :slots_limited, !types.Boolean do
    resolve ->(obj, _args, _ctx) { !!obj.slots_limited? }
  end

  field :anything, !types.Boolean do
    resolve ->(obj, _args, _ctx) { !!obj.anything? }
  end
end
