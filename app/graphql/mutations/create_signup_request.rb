class Mutations::CreateSignupRequest < Mutations::BaseMutation
  field :signup_request, Types::SignupRequestType, null: false

  argument :target_run_id, Int, required: true, camelize: false
  argument :requested_bucket_key, String, required: false, camelize: false
  argument :replace_signup_id, Int, required: false, camelize: false

  attr_reader :target_run

  define_authorization_check do |args|
    @target_run = convention.runs.find(args[:target_run_id])
    policy(SignupRequest.new(target_run: target_run, user_con_profile: user_con_profile)).create?
  end

  def resolve(**args)
    raise 'Signup requests are closed.' unless convention.signup_requests_open?

    replace_signup = if args[:replace_signup_id]
      user_con_profile.signups.find(args[:replace_signup_id])
    end

    signup_request = user_con_profile.signup_requests.create!(
      target_run: target_run,
      replace_signup: replace_signup,
      requested_bucket_key: args[:requested_bucket_key],
      updated_by: current_user
    )

    SignupRequests::NewSignupRequestNotifier.new(signup_request: signup_request).deliver_later

    { signup_request: signup_request }
  end
end
