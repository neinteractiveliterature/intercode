Mutations::UpdateSignupBucket = GraphQL::Relay::Mutation.define do
  name 'UpdateSignupBucket'
  return_field :signup, Types::SignupType

  input_field :id, !types.Int
  input_field :bucket_key, !types.String

  resolve ->(_obj, args, ctx) do
    signup = ctx[:convention].signups.find(args[:id])
    raise 'The selected bucket is full.' if signup.run.bucket_full?(args[:bucket_key]) && signup.counted?

    original_bucket_key = signup.bucket_key
    signup.update!(bucket_key: args[:bucket_key])

    if signup.bucket_key_previously_changed? && signup.counted? && original_bucket_key
      EventVacancyFillService.new(signup.run, original_bucket_key).call!
    end

    { signup: signup.reload }
  end
end
