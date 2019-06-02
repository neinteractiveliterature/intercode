class Mutations::CreateUserSignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :run_id, Int, required: true, camelize: false
  argument :user_con_profile_id, Int, required: true, camelize: false
  argument :requested_bucket_key, String, required: false, camelize: false
  argument :no_requested_bucket, Boolean, required: false, camelize: false
  argument :suppress_notifications, Boolean, required: false, camelize: false

  def resolve(run_id:, user_con_profile_id:, requested_bucket_key: nil, no_requested_bucket: false, suppress_notifications: false)
    should_have_requested_bucket_key = no_requested_bucket.blank?
    if should_have_requested_bucket_key && !requested_bucket_key
      raise BetterRescueMiddleware::UnloggedError,
        'Bad request: signups must either request a bucket or specify that no bucket is requested.'
    end

    run = context[:convention].runs.find(run_id)
    user_con_profile = context[:convention].user_con_profiles.find(user_con_profile_id)

    result = EventSignupService.new(
      user_con_profile,
      run,
      should_have_requested_bucket_key ? requested_bucket_key : nil,
      context[:current_user],
      suppress_notifications: suppress_notifications
    ).call

    if result.failure?
      raise BetterRescueMiddleware::UnloggedError, result.errors.full_messages.join(', ')
    end

    { signup: result.signup }
  end
end
