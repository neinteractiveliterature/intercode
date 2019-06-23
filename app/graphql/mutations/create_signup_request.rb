class Mutations::CreateSignupRequest < Mutations::BaseMutation
  field :signup_request, Types::SignupRequestType, null: false

  argument :target_run_id, Int, required: true, camelize: false
  argument :requested_bucket_key, String, required: false, camelize: false
  argument :replace_signup_id, Int, required: false, camelize: false

  def resolve(target_run_id:, requested_bucket_key: nil, replace_signup_id: nil)
    raise 'Signup requests are closed.' unless convention.signup_requests_open?

    target_run = convention.runs.find(target_run_id)
    replace_signup = user_con_profile.signups.find(replace_signup_id) if replace_signup_id
    signup_request = user_con_profile.signup_requests.create!(
      target_run: target_run,
      replace_signup: replace_signup,
      requested_bucket_key: requested_bucket_key,
      updated_by: current_user
    )

    SignupRequestsMailer.new_signup_request(signup_request).deliver_later

    { signup_request: signup_request }
  end
end
