# frozen_string_literal: true
class Mutations::CreateSignupRequest < Mutations::BaseMutation
  field :signup_request, Types::SignupRequestType, null: false

  argument :target_run_id, ID, required: false, camelize: true
  argument :requested_bucket_key, String, required: false, camelize: false
  argument :replace_signup_id, ID, required: false, camelize: true

  attr_reader :target_run

  define_authorization_check do |args|
    @target_run = convention.runs.find(args[:target_run_id])
    policy(SignupRequest.new(target_run: target_run, user_con_profile: user_con_profile)).create?
  end

  def resolve(**args)
    replace_signup = (user_con_profile.signups.find(args[:replace_signup_id]) if args[:replace_signup_id])

    result = CreateSignupRequestService.new(
      user_con_profile:
      target_run:,
      replace_signup:,
      requested_bucket_key: args[:requested_bucket_key],
      whodunit: current_user
    ).call!

    { signup_request: result.signup_request }
  end
end
