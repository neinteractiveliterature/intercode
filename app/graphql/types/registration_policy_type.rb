Types::RegistrationPolicyType = GraphQL::ObjectType.define do
  name "RegistrationPolicy"

  field :slots_limited, types.Boolean, property: :slots_limited?
  field :total_slots, types.Int
end
