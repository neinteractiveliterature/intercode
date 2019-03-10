Mutations::ForceConfirmSignup = GraphQL::Relay::Mutation.define do
  name 'ForceConfirmSignup'
  return_field :signup, Types::SignupType

  input_field :id, !types.Int
  input_field :bucket_key, !types.String

  resolve ->(_obj, args, ctx) do
    signup = ctx[:convention].signups.find(args[:id])
    signup.update!(state: 'confirmed', bucket_key: args[:bucket_key])
    { signup: signup }
  end
end
