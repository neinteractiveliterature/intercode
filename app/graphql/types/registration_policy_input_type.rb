Types::RegistrationPolicyInputType = GraphQL::InputObjectType.define do
  name 'RegistrationPolicyInput'

  input_field :buckets, types[!Types::RegistrationPolicyBucketInputType]
  input_field :prevent_no_preference_signups, types.Boolean
end
