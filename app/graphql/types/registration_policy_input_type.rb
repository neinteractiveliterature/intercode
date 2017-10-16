Types::RegistrationPolicyInputType = GraphQL::InputObjectType.define do
  name "RegistrationPolicyInput"

  input_field :buckets, types[!Types::RegistrationPolicyBucketInputType]
end
