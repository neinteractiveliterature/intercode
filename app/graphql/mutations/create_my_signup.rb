class Mutations::CreateMySignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :run_id, Int, required: true, camelize: false
  argument :requested_bucket_key, String, required: false, camelize: false
  argument :no_requested_bucket, Boolean, required: false, camelize: false

  def resolve(run_id:, requested_bucket_key: nil, no_requested_bucket: false)
    should_have_requested_bucket_key = no_requested_bucket.blank?
    if should_have_requested_bucket_key && !requested_bucket_key
      raise BetterRescueMiddleware::UnloggedError,
        'Bad request: signups must either request a bucket or specify that no bucket is requested.'
    end

    run = context[:convention].runs.find(run_id)

    result = EventSignupService.new(
      context[:user_con_profile],
      run,
      should_have_requested_bucket_key ? requested_bucket_key : nil,
      context[:current_user]
    ).call

    if result.failure?
      raise BetterRescueMiddleware::UnloggedError, result.errors.full_messages.join(', ')
    end

    { signup: result.signup }
  end
end
