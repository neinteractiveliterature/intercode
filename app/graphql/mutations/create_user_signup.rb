# frozen_string_literal: true
class Mutations::CreateUserSignup < Mutations::BaseMutation
  description "Sign a user up for a run, as an admin action"

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
  argument :suppress_confirmation, # rubocop:disable GraphQL/ExtractInputType
           Boolean,
           required: false,
           camelize: false,
           description: "Set to true to skip sending the signup confirmation notification"
  argument :suppress_notifications, # rubocop:disable GraphQL/ExtractInputType
           Boolean,
           required: false,
           camelize: false,
           description: "Set to true to skip sending team member notifications for this signup"
  argument :user_con_profile_id, # rubocop:disable GraphQL/ExtractInputType
           ID,
           required: false,
           camelize: true,
           description: "The ID of the user con profile to sign up"

  attr_reader :run, :signup_user_con_profile

  define_authorization_check do |args|
    @run = convention.runs.find(args[:run_id])
    @signup_user_con_profile = convention.user_con_profiles.find(args[:user_con_profile_id])
    policy(Signup.new(run:, user_con_profile: signup_user_con_profile)).create?
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
        signup_user_con_profile,
        run,
        should_have_requested_bucket ? requested_bucket_id : nil,
        context[:current_user],
        suppress_notifications: args[:suppress_notifications],
        suppress_confirmation: args[:suppress_confirmation],
        allow_non_self_service_signups: true,
        action: "admin_create_signup"
      ).call

    raise GraphQL::ExecutionError, result.errors.full_messages.join(", ") if result.failure?

    { signup: result.signup }
  end

  private

  def requested_bucket_id_from_key(args)
    return nil unless args[:requested_bucket_key]
    normalized_key = RegistrationPolicyBucket.normalize_key(args[:requested_bucket_key])
    run.registration_policy.buckets.find { |bucket| bucket.key == normalized_key }&.id
  end
end
