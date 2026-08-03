# frozen_string_literal: true
class Mutations::CreateMySignup < Mutations::BaseMutation
  description "Sign the current user up for a run, as a self-service signup"

  field :signup, Types::SignupType, null: false, description: "The signup that was created"

  argument :no_requested_bucket,
           Boolean,
           required: false,
           camelize: false,
           description: "Set to true to sign up with no bucket preference"
  argument :requested_bucket_id,
           ID,
           required: false,
           camelize: true,
           description: "The bucket to request, or null for no preference"
  argument :requested_bucket_key, # rubocop:disable GraphQL/ExtractInputType
           String,
           required: false,
           camelize: false,
           deprecation_reason: "Use requestedBucketId instead",
           description: "The bucket key to request, or null for no preference"
  argument :run_id, # rubocop:disable GraphQL/ExtractInputType
           ID,
           required: false,
           camelize: true,
           description: "The ID of the run to sign up for"

  attr_reader :run

  define_authorization_check do |args|
    @run = convention.runs.find(args[:run_id])
    policy(Signup.new(user_con_profile:, run:)).create?
  end

  def resolve(**args)
    should_have_requested_bucket = args[:no_requested_bucket].blank?
    requested_bucket_id = args[:requested_bucket_id]&.to_i || requested_bucket_id_from_key(args)
    if should_have_requested_bucket && !requested_bucket_id
      raise GraphQL::ExecutionError,
            "Bad request: signups must either request a bucket or specify that no bucket is requested."
    end

    result =
      EventSignupService.new(
        context[:user_con_profile],
        run,
        should_have_requested_bucket ? requested_bucket_id : nil,
        context[:current_user],
        action: "self_service_signup"
      ).call_and_raise

    raise GraphQL::ExecutionError, result.errors.full_messages.join(", ") if result.failure?

    { signup: result.signup }
  end

  private

  def requested_bucket_id_from_key(args)
    run.registration_policy.bucket_with_key(args[:requested_bucket_key])&.id
  end
end
