# frozen_string_literal: true
class Mutations::CreateMySignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :transitional_run_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the runId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :run_id, ID, required: false, camelize: true
  argument :requested_bucket_key, String, required: false, camelize: false
  argument :no_requested_bucket, Boolean, required: false, camelize: false

  attr_reader :run

  define_authorization_check do |args|
    @run = convention.runs.find(args[:transitional_run_id] || args[:run_id])
    policy(Signup.new(user_con_profile: user_con_profile, run: run)).create?
  end

  def resolve(**args)
    should_have_requested_bucket_key = args[:no_requested_bucket].blank?
    if should_have_requested_bucket_key && !args[:requested_bucket_key]
      raise GraphQL::ExecutionError,
            'Bad request: signups must either request a bucket or specify that no bucket is requested.'
    end

    result =
      EventSignupService.new(
        context[:user_con_profile],
        run,
        should_have_requested_bucket_key ? args[:requested_bucket_key] : nil,
        context[:current_user],
        action: 'self_service_signup'
      ).call_and_raise

    raise GraphQL::ExecutionError, result.errors.full_messages.join(', ') if result.failure?

    { signup: result.signup }
  end
end
