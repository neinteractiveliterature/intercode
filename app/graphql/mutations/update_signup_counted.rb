Mutations::UpdateSignupCounted = GraphQL::Relay::Mutation.define do
  name 'UpdateSignupCounted'
  return_field :signup, Types::SignupType

  input_field :id, !types.Int
  input_field :counted, !types.Boolean

  resolve ->(_obj, args, ctx) do
    signup = ctx[:convention].signups.find(args[:id])
    signup.update!(counted: args[:counted])

    if signup.counted_previously_changed? && !args[:counted] && signup.bucket_key
      EventVacancyFillService.new(signup.run, signup.bucket_key).call!
    end

    { signup: signup }
  end
end
