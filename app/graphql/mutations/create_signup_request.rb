# frozen_string_literal: true
class Mutations::CreateSignupRequest < Mutations::BaseMutation
  description "Create a request to sign up for a run, for the current user, in a moderated-signup convention"

  field :signup_request, Types::SignupRequestType, null: false, description: "The signup request that was created"

  argument :replace_signup_id,
           ID,
           required: false,
           camelize: true,
           description: "The ID of an existing signup this request should replace if accepted"
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
  argument :target_run_id, # rubocop:disable GraphQL/ExtractInputType
           ID,
           required: false,
           camelize: true,
           description: "The ID of the run to request a signup for"

  attr_reader :target_run

  define_authorization_check do |args|
    @target_run = convention.runs.find(args[:target_run_id])
    policy(SignupRequest.new(target_run:, user_con_profile:)).create?
  end

  def resolve(**args)
    replace_signup = (user_con_profile.signups.find(args[:replace_signup_id]) if args[:replace_signup_id])
    requested_bucket_id = args[:requested_bucket_id]&.to_i || requested_bucket_id_from_key(args)

    result =
      CreateSignupRequestService.new(
        user_con_profile:,
        target_run:,
        replace_signup:,
        requested_bucket_id:,
        whodunit: current_user
      ).call!

    { signup_request: result.signup_request }
  end

  private

  def requested_bucket_id_from_key(args)
    return nil unless args[:requested_bucket_key]
    normalized_key = RegistrationPolicyBucket.normalize_key(args[:requested_bucket_key])
    target_run.registration_policy.buckets.find { |bucket| bucket.key == normalized_key }&.id
  end
end
